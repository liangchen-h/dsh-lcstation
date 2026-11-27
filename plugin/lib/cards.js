/**
 * The card chain: a pure, incremental fold of the Host's `session/event` stream
 * into "what did the model just do" cards.
 *
 * Hard rules this module exists to satisfy:
 *  - Cards are produced by THIS program (rules only). No model call ever happens
 *    on the chat path: every handler here is synchronous and O(1) amortised.
 *  - The fold is incremental. One event in, at most one card appended; nothing
 *    rescans a session file and nothing replays history on a timer.
 *  - Cards are append-only. Only the `state` field (`running` -> `ok`/`failed`)
 *    and the optional `result` summary may be updated in place afterwards.
 *
 * ── Serial vs parallel (the user's definition, verbatim in spirit) ────────────
 * "No upstream/downstream relation between two branches = display them in
 *  parallel (side-by-side lanes). It is NOT about happening at the same time.
 *  Sequential-but-unrelated steps on the same level, several concurrent tasks,
 *  and subagents are all parallel. Only a real chain of `before -> after` is
 *  serial (stacked down one column)."
 *
 * So the grouping key is DEPENDENCY, not time. `dependsOn(prev, next)` asks, in
 * order:
 *   1. Explicit parent/child: does `next` carry `parentCallId`/`parentId` that
 *      names `prev`? (subagent spawn, tool-workflow nesting)  -> serial
 *   2. Data dependency: does `next`'s arguments mention a path/value that
 *      `prev` produced (wrote, read, or named on its command line)? -> serial
 *   3. Subagent lineage: does `next` belong to a session whose
 *      `parentSession`/spawn card is `prev`? -> serial
 *   4. Nothing above: -> PARALLEL. This is the documented degradation rule:
 *      "同一轮内无依赖即并联" (same turn, no dependency => parallel). We never
 *      chain two cards just because one arrived after the other.
 *
 * Lane bookkeeping: each lane is one column. A card that depends on a lane's
 * tail extends that lane (serial); a card with no dependency opens a new lane
 * (parallel). Lanes are capped so a very wide fan-out stays readable; past the
 * cap the oldest lane is reused and the card is flagged `laneReused`.
 */

/** How many parallel columns a board will open before it starts reusing lanes. */
export const MAX_LANES = 24;
/** How many boards (sessions) stay in memory; oldest is dropped past this. */
export const MAX_BOARDS = 48;
/** How many cards a single board keeps; the tail is dropped past this. */
export const MAX_CARDS = 4000;

/** Tools whose card means "read something". */
const READ_TOOLS = new Set(["read", "ops_read", "grep", "glob", "ops_grep", "ops_glob", "ls", "ops_ls", "read_file"]);
/** Tools whose card means "ran a command". */
const RUN_TOOLS = new Set(["pwsh", "ops_bash", "bash", "terminal", "ops_terminal", "ops_pwsh", "shell", "run"]);
/** Tools whose card means "wrote a file". */
const WRITE_TOOLS = new Set(["write", "ops_write", "edit", "ops_edit", "apply_patch", "ops_apply_patch", "str_replace_editor", "notebook_edit"]);
/** Tools whose card means "started a subagent". */
const SUBAGENT_TOOLS = new Set(["subagent", "subagent_fork", "ops_subagent", "agent", "agent_team", "workflow"]);
/** Tools whose card means "went to the network". */
const WEB_TOOLS = new Set(["web_search", "web_fetch", "ops_web_search", "ops_web_fetch"]);

/** Paths mentioned by a tool-argument blob (quoted or bare, Windows or POSIX). */
function pathsIn(value) {
	const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
	const found = new Set();
	const re = /(?:[A-Za-z]:[\\/]|\/)[^\s"'`,;)\]}>]{2,}/g;
	let m;
	while ((m = re.exec(text)) !== null) {
		const raw = m[0].replace(/\\/g, "/").replace(/\/+$/, "");
		if (raw.length > 2) found.add(raw.toLowerCase());
	}
	return found;
}

/** First non-empty line of a blob, trimmed to `max` characters. */
/** Message content blocks -> one plain string (text blocks only). */
function textOfBlocks(content) {
	if (content === null || content === undefined) return "";
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		if (block === null || typeof block !== "object") continue;
		if (block.type === "text" && typeof block.text === "string") parts.push(block.text);
	}
	return parts.join("\n").trim();
}

function firstLine(value, max = 120) {
	const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
	const line = (text.split(/\r?\n/).find((l) => l.trim() !== "") ?? "").trim();
	return line.length > max ? `${line.slice(0, max)}…` : line;
}

/**
 * Flatten a tool-result message into one readable line.
 * Tool results routinely arrive as `[{"type":"text","text":"…"}]`; showing that
 * verbatim wastes the two visible lines the card has for it.
 */
function resultSummary(message, max = 200) {
	const content = message?.content;
	let text;
	if (typeof content === "string") text = content;
	else if (Array.isArray(content)) {
		text = content
			.flatMap((block) => (typeof block === "string" ? [block] : block?.type === "text" ? [block.text ?? ""] : []))
			.join(" ");
	} else text = JSON.stringify(content ?? "");
	const flat = String(text).replace(/\s+/g, " ").trim();
	return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

/** The single field a card uses to describe its subject. */
function subjectOf(args) {
	if (args === null || typeof args !== "object") return firstLine(args, 90);
	for (const key of ["file_path", "path", "filePath", "target", "command", "cmd", "query", "url", "prompt", "pattern", "name"]) {
		const v = args[key];
		if (typeof v === "string" && v !== "") return firstLine(v, key === "command" || key === "cmd" ? 120 : 90);
	}
	return firstLine(args, 90);
}

/** Classify one tool call into a card kind. */
export function classifyTool(name, args) {
	const n = String(name ?? "");
	if (SUBAGENT_TOOLS.has(n)) return "spawn-subagent";
	if (WRITE_TOOLS.has(n)) return "write-file";
	if (READ_TOOLS.has(n)) return "read-file";
	if (WEB_TOOLS.has(n)) return "web";
	if (RUN_TOOLS.has(n)) return "run-cmd";
	// MCP-bridged tools arrive as `mcp__<server>__<Tool>` (observed live:
	// `mcp__windows__PowerShell`). Fall back to a substring read of the name so a
	// bridged command still lands on the right card instead of the generic bucket.
	const lower = n.toLowerCase();
	if (/power(shell)?|bash|shell|terminal|command|exec/.test(lower)) return "run-cmd";
	if (/write|edit|patch|replace|create/.test(lower)) return "write-file";
	if (/read|grep|glob|search_file|list_dir|glob/.test(lower)) return "read-file";
	if (/search|fetch|browse|http/.test(lower)) return "web";
	return "tool";
}

const KIND_LABEL = {
	"read-file": "读",
	"write-file": "写",
	"run-cmd": "跑",
	"spawn-subagent": "子智能体",
	web: "联网",
	tool: "工具",
	todo: "待办",
	deliverable: "产出",
	turn: "轮次",
	note: "备注",
	"compact": "压缩",
	"job": "后台任务",
	"approval": "审批"
};

/** Does `next` depend on `prev`? See the module header for the ordered rules. */
function dependsOn(prev, next) {
	if (prev === undefined) return false;
	// Rule 1 — explicit parent/child naming.
	if (next.parentCallId !== undefined && prev.callId !== undefined && next.parentCallId === prev.callId) return true;
	if (next.parentId !== undefined && prev.id === next.parentId) return true;
	if (prev.subagentSession !== undefined && next.sessionId === prev.subagentSession) return true;
	// Rule 3 — subagent lineage (a child session's first card follows its spawn card).
	if (next.parentSession !== undefined && prev.sessionId === next.parentSession) return true;
	// Rule 2 — data dependency: something `next` names was produced by `prev`.
	if (prev.produces !== undefined && prev.produces.size > 0 && next.consumes !== undefined) {
		for (const p of next.consumes) if (prev.produces.has(p)) return true;
	}
	return false;
}

/** One session's folded board. */
export class Board {
	constructor(sessionId) {
		this.sessionId = sessionId;
		this.cards = [];
		this.byCallId = new Map();
		this.lanes = [];
		this.seq = -1;
		this.turn = 0;
		this.step = 0;
		this.parentSession = undefined;
		this.delegationDepth = 0;
		this.updatedAt = Date.now();
		this.revision = 0;
		this.changed = new Map();
		this.generation = `${Date.now()}-${Math.random()}`;
		this.nextCardId = 0;
	}

	/** 把折叠结果序列化，供插件重载后原样恢复（会话被压缩也不至于整条链消失）。 */
	dump() {
		return {
			sessionId: this.sessionId,
			cards: this.cards.map((card) => ({ ...card, produces: card.produces === undefined ? undefined : [...card.produces], consumes: card.consumes === undefined ? undefined : [...card.consumes] })),
			lanes: this.lanes.map((lane) => ({ id: lane.id, lastCardId: lane.tail?.id })) ,
			turn: this.turn,
			step: this.step,
			seq: this.seq,
			parentSession: this.parentSession,
			delegationDepth: this.delegationDepth,
			updatedAt: Date.now()
		};
	}

	/** 从 dump() 的结果恢复；索引与泳道都重建。 */
	restore(state) {
		if (state === null || typeof state !== "object") return false;
		const cards = Array.isArray(state.cards) ? state.cards : [];
		this.cards = cards;
		for (const card of cards) {
			if (card.produces !== undefined && !(card.produces instanceof Set)) card.produces = Array.isArray(card.produces) ? new Set(card.produces) : pathsIn(card.detail);
			if (card.consumes !== undefined && !(card.consumes instanceof Set)) card.consumes = Array.isArray(card.consumes) ? new Set(card.consumes) : pathsIn(card.detail);
		}
		this.nextCardId = cards.reduce((max, card) => {
			const suffix = Number(String(card.id).slice(String(card.id).lastIndexOf("#") + 1));
			return Number.isSafeInteger(suffix) ? Math.max(max, suffix + 1) : max;
		}, 0);
		this.byCallId = new Map();
		for (const card of cards) {
			if (card && typeof card.id === "string") this.byCallId.set(card.id, card);
			if (card && typeof card.callId === "string") this.byCallId.set(card.callId, card);
		}
		this.lanes = Array.isArray(state.lanes) ? state.lanes.map((lane) => ({ id: lane.id, tail: cards.find((card) => card.id === lane.lastCardId) })) : [];
		const previousByLane = new Map();
		for (const card of cards) {
			if (card.serial && !card.laneReused && card.predecessorId === undefined) card.predecessorId = previousByLane.get(card.lane);
			previousByLane.set(card.lane, card.id);
			let lane = this.lanes.find((candidate) => candidate.id === card.lane);
			if (lane === undefined) { lane = { id: card.lane }; this.lanes.push(lane); }
			if (lane.tail === undefined || card.index > lane.tail.index) lane.tail = card;
		}
		this.turn = Number(state.turn) || 0;
		this.step = Number(state.step) || 0;
		this.seq = Number.isFinite(state.seq) ? state.seq : cards.length - 1;
		this.parentSession = state.parentSession;
		this.delegationDepth = Number(state.delegationDepth) || 0;
		this.updatedAt = Date.now();
		return cards.length > 0;
	}

	/** Snapshot for HTTP; `since` returns only cards added after that index. */
	snapshot(since = -1, revision = 0) {
		const from = Number.isFinite(since) && since >= 0 ? Math.min(since + 1, this.cards.length) : 0;
		return {
			sessionId: this.sessionId,
			total: this.cards.length,
			lanes: this.lanes.map((lane) => lane.id),
			parentSession: this.parentSession,
			delegationDepth: this.delegationDepth,
			updatedAt: this.updatedAt,
			generation: this.generation,
			revision: this.revision,
			updates: since >= 0 ? [...this.changed.values()].filter((change) => change.revision > revision && change.card.index < from).map((change) => change.card) : [],
			cards: this.cards.slice(from)
		};
	}

	/**
	 * Append one card, choosing its lane by dependency.
	 * @param spec - card fields; `id`/`lane`/`band` are assigned here.
	 */
	push(spec) {
		const card = {
			...spec,
			id: `${this.sessionId}#${this.nextCardId++}`,
			index: this.cards.length,
			band: this.turn
		};
		let lane = this.lanes.find((candidate) => dependsOn(candidate.tail, card));
		if (lane !== undefined) {
			card.serial = true;
		} else if (this.lanes.length < MAX_LANES) {
			lane = { id: this.lanes.length, tail: undefined };
			this.lanes.push(lane);
			card.serial = false;
		} else {
			// Past the cap: continue the lane whose tail is oldest, flagged so the
			// UI can show the reuse instead of pretending the branch is new.
			lane = this.lanes.reduce((a, b) => (a.tail?.time ?? 0) <= (b.tail?.time ?? 0) ? a : b);
			card.serial = !!dependsOn(lane.tail, card);
			card.laneReused = true;
		}
		card.lane = lane.id;
		if (card.serial) card.predecessorId = lane.tail.id;
		lane.tail = card;
		this.cards.push(card);
		if (card.callId !== undefined) this.byCallId.set(card.callId, card);
		this.updatedAt = Date.now();
		if (this.cards.length > MAX_CARDS) {
			const removed = this.cards.splice(0, this.cards.length - MAX_CARDS);
			for (const old of removed) {
				this.changed.delete(old.id);
				if (old.callId !== undefined && this.byCallId.get(old.callId) === old) this.byCallId.delete(old.callId);
			}
			this.cards.forEach((old, index) => { old.index = index; });
			this.generation = `${Date.now()}-${Math.random()}`;
			this.lanes = [];
			for (const old of this.cards) {
				const existing = this.lanes.find((candidate) => candidate.id === old.lane);
				if (existing === undefined) this.lanes.push({ id: old.lane, tail: old });
				else existing.tail = old;
			}
		}
		return card;
	}

	/** Flip a running card's state; history is never rewritten otherwise. */
	settle(callId, state, summary) {
		// 工具卡用 callId 索引；后台任务卡没有 callId，按 id 兜底（id 就是 session#index）
		const card = this.byCallId.get(callId) ?? this.cards.find((c) => c.id === callId);
		if (card === undefined) return undefined;
		card.state = state;
		if (summary !== undefined) card.result = summary;
		card.settledAt = Date.now();
		this.changed.set(card.id, { revision: ++this.revision, card });
		this.updatedAt = Date.now();
		return card;
	}
}

/**
 * The fold engine: one `Board` per session, created on first event.
 * Feed it `session/event` payloads; it never reads a file.
 */
export class CardEngine {
	constructor() {
		/** @type {Map<string, Board>} */
		this.boards = new Map();
	}

	/** Fetch (or lazily create) a session's board. */
	board(sessionId) {
		let board = this.boards.get(sessionId);
		if (board === undefined) {
			board = new Board(sessionId);
			this.boards.set(sessionId, board);
			if (this.boards.size > MAX_BOARDS) {
				const oldest = [...this.boards.values()].sort((a, b) => a.updatedAt - b.updatedAt)[0];
				if (oldest !== undefined && oldest !== board) this.boards.delete(oldest.sessionId);
			}
		}
		return board;
	}

	/** Describe a board's parentage so a subagent session can be linked later. */
	setLineage(sessionId, { parentSession, delegationDepth }) {
		const board = this.board(sessionId);
		if (parentSession !== undefined) board.parentSession = parentSession;
		if (delegationDepth !== undefined) board.delegationDepth = delegationDepth;
		return board;
	}

	/**
	 * Fold one session event into its board.
	 * @param sessionId - owning session id.
	 * @param event - `{ seq, time, type, data }`.
	 * @returns the card appended (if any).
	 */
	fold(sessionId, event) {
		const board = this.board(sessionId);
		const time = typeof event.time === "number" ? event.time : Date.now();
		const data = event.data ?? {};
		board.seq = Math.max(board.seq, typeof event.seq === "number" ? event.seq : board.seq + 1);

		switch (event.type) {
			case "turn/start":
				board.turn = typeof data.turn === "number" ? data.turn : board.turn + 1;
				board.step = 0;
				return undefined;
			case "step/start":
				if (typeof data.turn === "number") board.turn = data.turn;
				if (typeof data.step === "number") board.step = data.step;
				return undefined;
			case "step/end":
			case "turn/end":
				return undefined;

			case "user/message": {
				const text = textOfBlocks(data.content);
				if (text === "") return undefined;
				return board.push({
					kind: "msg-user",
					time,
					sessionId,
					title: "你说",
					sub: firstLine(text, 90),
					text,
					step: board.step,
					state: "ok"
				});
			}

			case "assistant/message": {
				const text = textOfBlocks(data.message && data.message.content);
				if (text === "") return undefined;
				return board.push({
					kind: "msg-ai",
					time,
					sessionId,
					title: "AI 回复",
					sub: firstLine(text, 90),
					text,
					step: board.step,
					state: "ok"
				});
			}

			case "tool/call": {
				const args = parseArgs(data.arguments);
				const kind = classifyTool(data.name, args);
				const subject = subjectOf(args);
				const card = board.push({
					kind,
					time,
					callId: data.callId,
					sessionId,
					parentCallId: data.parentCallId ?? data.parentId,
					title: `${KIND_LABEL[kind] ?? "工具"} ${subject}`.trim(),
					sub: data.name,
					detail: typeof data.arguments === "string" ? data.arguments.slice(0, 4000) : JSON.stringify(data.arguments ?? {}).slice(0, 4000),
					produces: kind === "write-file" || kind === "read-file" || kind === "run-cmd" ? pathsIn(args) : undefined,
					consumes: pathsIn(args),
					step: board.step,
					state: "running"
				});
				if (kind === "spawn-subagent") {
					const child = args?.session_id ?? args?.sessionId ?? args?.agent_id;
					if (typeof child === "string") card.subagentSession = child;
				}
				return card;
			}

			case "tool/result": {
				const callId = data.message?.source?.callId;
				if (callId === undefined) return undefined;
				const failed = data.message?.isError === true;
				board.settle(callId, failed ? "failed" : "ok", resultSummary(data.message));
				return undefined;
			}

			case "deliverables/presented": {
				const files = Array.isArray(data.files) ? data.files : Array.isArray(data.deliverables) ? data.deliverables : [];
				const names = files.map((f) => (typeof f === "string" ? f : f?.path ?? f?.name ?? "")).filter((n) => n !== "");
				return board.push({
					kind: "deliverable",
					time,
					sessionId,
					title: `产出 ${names.length} 个文件`,
					sub: names.map((n) => n.split(/[\\/]/).pop()).slice(0, 4).join("、"),
					consumes: pathsIn(names),
					step: board.step,
					state: "ok"
				});
			}

			case "todo/write": {
				const items = Array.isArray(data.todos) ? data.todos : Array.isArray(data.items) ? data.items : [];
				return board.push({
					kind: "todo",
					time,
					sessionId,
					title: `待办 ${items.length} 条`,
					sub: items.filter((i) => i?.status === "in_progress").map((i) => firstLine(i?.content ?? "", 40)).join("；"),
					step: board.step,
					state: "ok"
				});
			}

			case "tool-workflow/agent-start": {
				return board.push({
					kind: "spawn-subagent",
					time,
					sessionId,
					title: `子智能体 ${firstLine(data.name ?? data.agentId ?? "", 60)}`,
					sub: firstLine(data.prompt ?? data.instructions ?? "", 90),
					subagentSession: data.sessionId,
					step: board.step,
					state: "running"
				});
			}
			case "tool-workflow/agent-end":
				return undefined;
			case "compaction/start":
				return board.push({ kind: "compact", time, sessionId, title: "上下文压缩开始", sub: "", step: board.step, state: "running" });
			case "compaction/end":
				return board.push({ kind: "compact", time, sessionId, title: "上下文压缩结束", sub: "", step: board.step, state: "ok" });
			case "job/registered":
				return board.push({
					kind: "job",
					time,
					sessionId,
					title: `后台任务 ${firstLine(data.label ?? data.command ?? data.kind ?? "", 60)}`,
					sub: data.kind ?? "",
					jobId: data.jobId,
					step: board.step,
					state: "running"
				});
			case "job/settled": {
				// jobId 是唯一能对上的一把钥匙：同一时刻可以有多个后台任务在跑
				const target = board.cards
					.slice()
					.reverse()
					.find((c) => c.kind === "job" && c.jobId === data.jobId && c.state === "running");
				if (target === undefined) return undefined;
				const bad = data.status === "failed" || data.ok === false || (typeof data.exitCode === "number" && data.exitCode !== 0);
				board.settle(target.id, bad ? "failed" : "ok", firstLine(String(data.status ?? data.exitCode ?? "已结束"), 80));
				return undefined;
			}
			case "approval/asked":
				return board.push({ kind: "approval", time, sessionId, title: "请求授权", sub: firstLine(data.reason ?? data.kind ?? "", 80), step: board.step, state: "running" });
			default:
				return undefined;
		}
	}
}

/** Tool arguments arrive either as JSON text or as an already-decoded object. */
function parseArgs(value) {
	if (value === undefined || value === null) return {};
	if (typeof value === "object") return value;
	try {
		const parsed = JSON.parse(value);
		return parsed !== null && typeof parsed === "object" ? parsed : { command: String(value) };
	} catch {
		return { command: String(value) };
	}
}
