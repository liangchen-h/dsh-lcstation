/**
 * Memory view data.
 *
 * Four blocks, all built by this program from the event stream + the disk —
 * no model is called, on the chat path or off it:
 *
 *  (a) cross-conversation memory  -> text files on disk (AGENTS.md, prompt-inject.md,
 *      Workstation mem/**, .settings.json).  Editable; every save backs up first.
 *  (b) what THIS session imported -> the seed messages the Host actually appended
 *      at session start (`system/message` / `developer/message`), shown read-only
 *      with their source label.
 *  (c) memories made DURING the conversation -> preference / constraint / decision
 *      sentences lifted from `user/message` + `assistant/message` by the rules in
 *      `RULES` below.  Editable (edits land in an overlay file, source text stays
 *      untouched), and selectable for the "import into cross-conversation memory"
 *      action.
 *  (d) subagent memory -> per subagent, grouped by session: what it was handed and
 *      what it reported, folded from `subagent/*`, `tool-workflow/*` and the
 *      `subagent` tool calls.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { memoryFiles, backupFile, readText, fileInfo, STATE_DIR, underRoots, DSH_HOME, WS_HOME } from "./paths.js";

/** Overlay holding human edits + selections for block (c). */
const OVERLAY_PATH = join(STATE_DIR, "memory-items.json");
/** How much of a seed message is kept for block (b). */
const SNAPSHOT_CHARS = 4000;

/**
 * Extraction rules for block (c). Order matters: the first matching rule names
 * the item, so a sentence that is both a preference and a constraint is filed as
 * a constraint (the stronger reading).
 */
const RULES = [
	{ kind: "constraint", label: "约束", re: /(不要|禁止|必须|只能|不许|务必|一律|绝对不能|别再|不得)/ },
	{ kind: "preference", label: "偏好", re: /(我喜欢|我倾向|我习惯|以后(都|一律)?|记住|偏好|优先(用|选)|我要的是|按我的)/ },
	{ kind: "decision", label: "决定", re: /(决定了?|定为|就用|采用|最终(选|用)|确认用|敲定)/ }
];

/** Split text into sentence-ish chunks that keep their punctuation. */
function sentences(text) {
	return String(text ?? "")
		.split(/(?<=[。！？；!?;\n])/u)
		.map((s) => s.trim())
		.filter((s) => s.length >= 8 && s.length <= 260);
}

/** Rule-based extraction of one text blob into candidate memory items. */
export function extractItems(text, source) {
	const out = [];
	for (const sentence of sentences(text)) {
		for (const rule of RULES) {
			if (!rule.re.test(sentence)) continue;
			out.push({ kind: rule.kind, label: rule.label, text: sentence, source });
			break;
		}
	}
	return out;
}

/** Read every cross-conversation memory file with its current content. */
export function readMemoryFiles() {
	return memoryFiles().map((file) => {
		const info = fileInfo(file.path);
		const text = readText(file.path);
		return {
			...file,
			exists: info !== undefined,
			size: info?.size ?? 0,
			mtime: info?.mtime ?? 0,
			content: text ?? ""
		};
	});
}

/** The roots a memory write may touch. */
export function memoryRoots() {
	return [DSH_HOME, WS_HOME];
}

/** Did this path come from `readMemoryFiles()`? Only those are writable. */
export function isKnownMemoryPath(path) {
	return memoryFiles().some((file) => file.path.toLowerCase() === String(path).toLowerCase());
}

/**
 * Save one memory file: backup, then overwrite with the posted text.
 * @returns `{ ok, backup, size, readback }` — `readback` is re-read from disk.
 */
export function saveMemoryFile(path, content) {
	if (!isKnownMemoryPath(path)) return { ok: false, reason: "not-a-memory-file" };
	if (!underRoots(path, memoryRoots())) return { ok: false, reason: "outside-roots" };
	const backup = backupFile(path);
	mkdirSync(join(path, ".."), { recursive: true });
	writeFileSync(path, String(content ?? ""), "utf8");
	const readback = readFileSync(path, "utf8");
	return { ok: true, path, backup, size: readback.length, readbackMatches: readback === String(content ?? "") };
}

/**
 * Append selected conversation memories to a cross-conversation memory file.
 * Appends only — the existing text is never rewritten.
 * @returns `{ ok, backup, appended }` with the appended block echoed back.
 */
export function importIntoMemory(path, items) {
	if (!isKnownMemoryPath(path)) return { ok: false, reason: "not-a-memory-file" };
	if (!Array.isArray(items) || items.length === 0) return { ok: false, reason: "no-items" };
	const backup = backupFile(path);
	const existing = readText(path) ?? "";
	const stamp = new Date().toISOString().slice(0, 19).replace("T", " ");
	const lines = items.map((item) => `- [${item.kind ?? "note"}] ${String(item.text ?? "").replace(/\r?\n/g, " ")}`);
	const block = `\n\n<!-- lc-station import ${stamp} -->\n${lines.join("\n")}\n`;
	writeFileSync(path, existing + block, "utf8");
	const readback = readFileSync(path, "utf8");
	return { ok: true, path, backup, appended: block.trim(), readbackEndsWithBlock: readback.endsWith(block) };
}

/** Human edits / selections for block (c): keyed by `sessionId` then item id. */
export function loadOverlay() {
	try {
		const parsed = JSON.parse(readFileSync(OVERLAY_PATH, "utf8"));
		return parsed !== null && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}

/** Persist the overlay (backs up the previous revision first). */
export function saveOverlay(overlay) {
	mkdirSync(STATE_DIR, { recursive: true });
	if (existsSync(OVERLAY_PATH)) backupFile(OVERLAY_PATH);
	writeFileSync(OVERLAY_PATH, JSON.stringify(overlay, null, 2), "utf8");
	const readback = JSON.parse(readFileSync(OVERLAY_PATH, "utf8"));
	return { ok: true, sessions: Object.keys(readback).length };
}

/**
 * Per-session memory tracker: fed the same `session/event` stream the card
 * engine consumes, so blocks (b), (c) and (d) stay incremental too.
 */
export class MemoryTracker {
	constructor() {
		/** @type {Map<string, { imported: any[], live: any[], subagents: Map<string, any>, seen: Set<string> }>} */
		this.sessions = new Map();
	}

	state(sessionId) {
		let entry = this.sessions.get(sessionId);
		if (entry === undefined) {
			entry = { imported: [], live: [], subagents: new Map(), seen: new Set() };
			this.sessions.set(sessionId, entry);
			if (this.sessions.size > 64) {
				const oldest = this.sessions.keys().next().value;
				if (oldest !== undefined && oldest !== sessionId) this.sessions.delete(oldest);
			}
		}
		return entry;
	}

	/** Fold one event. Returns nothing; state is read on demand by the route. */
	observe(sessionId, event) {
		const entry = this.state(sessionId);
		const data = event.data ?? {};
		const time = typeof event.time === "number" ? event.time : Date.now();

		switch (event.type) {
			// (b) what the session was seeded with.
			case "system/message":
			case "developer/message": {
				const text = messageText(data);
				if (text === "") return;
				entry.imported.push({
					id: `imp-${entry.imported.length}`,
					source: event.type === "system/message" ? "system/message（系统注入）" : "developer/message（开发者/记忆注入）",
					time,
					chars: text.length,
					text: text.slice(0, SNAPSHOT_CHARS),
					truncated: text.length > SNAPSHOT_CHARS
				});
				return;
			}
			// (c) memories made during the conversation.
			case "user/message": {
				const text = messageText(data);
				for (const item of extractItems(text, "user")) this.#add(entry, item, time, sessionId);
				return;
			}
			case "assistant/message": {
				const text = messageText(data);
				for (const item of extractItems(text, "assistant")) this.#add(entry, item, time, sessionId);
				return;
			}
			// (d) subagent memory.
			case "subagent/descriptor": {
				const id = String(data.agentId ?? data.id ?? data.sessionId ?? `sub-${entry.subagents.size}`);
				this.#subagent(entry, id).descriptor = {
					name: data.name ?? data.title ?? id,
					model: data.model ?? data.modelId ?? "",
					prompt: String(data.prompt ?? data.instructions ?? "").slice(0, 2000)
				};
				return;
			}
			case "subagent/catalog":
				return;
			case "tool-workflow/agent-start": {
				const id = String(data.agentId ?? data.sessionId ?? data.name ?? `sub-${entry.subagents.size}`);
				const sub = this.#subagent(entry, id);
				sub.name = data.name ?? sub.name ?? id;
				sub.task = String(data.prompt ?? data.instructions ?? data.task ?? "").slice(0, 2000);
				sub.startedAt = time;
				return;
			}
			case "tool-workflow/agent-end": {
				const id = String(data.agentId ?? data.sessionId ?? data.name ?? "");
				if (id !== "") {
					const sub = this.#subagent(entry, id);
					sub.endedAt = time;
					sub.result = String(data.result ?? data.summary ?? data.text ?? "").slice(0, 2000);
				}
				return;
			}
			case "tool/call": {
				const name = String(data.name ?? "");
				if (!["subagent", "subagent_fork", "ops_subagent", "workflow"].includes(name)) return;
				const id = `call:${data.callId ?? entry.subagents.size}`;
				const sub = this.#subagent(entry, id);
				sub.name = name;
				sub.task = String(typeof data.arguments === "string" ? data.arguments : JSON.stringify(data.arguments ?? "")).slice(0, 2000);
				sub.startedAt = time;
				sub.kind = "tool-call";
				return;
			}
			case "tool/result": {
				const callId = data.message?.source?.callId;
				if (callId === undefined) return;
				const sub = entry.subagents.get(`call:${callId}`);
				if (sub === undefined || sub.kind !== "tool-call") return;
				sub.endedAt = time;
				sub.result = messageText(data.message).slice(0, 2000);
				return;
			}
			default:
				return;
		}
	}

	#add(entry, item, time, sessionId) {
		const key = `${item.kind}|${item.text}`;
		if (entry.seen.has(key)) return;
		entry.seen.add(key);
		entry.live.push({
			id: `live-${sessionId}-${entry.live.length}`,
			kind: item.kind,
			label: item.label,
			text: item.text,
			from: item.source,
			time
		});
	}

	#subagent(entry, id) {
		let sub = entry.subagents.get(id);
		if (sub === undefined) {
			sub = { id, name: id, task: "", result: "", logs: [] };
			entry.subagents.set(id, sub);
		}
		return sub;
	}

	/** Assemble the memory view payload for one session, applying overlay edits. */
	view(sessionId) {
		const entry = this.state(sessionId);
		const overlay = loadOverlay();
		const edits = overlay[sessionId]?.items ?? {};
		const live = entry.live.map((item) => {
			const edit = edits[item.id];
			return {
				...item,
				edited: edit !== undefined,
				text: edit?.text ?? item.text,
				enabled: edit?.enabled ?? true,
				selected: edit?.selected ?? false
			};
		});
		return {
			sessionId,
			cross: readMemoryFiles(),
			imported: entry.imported,
			live,
			subagents: [...entry.subagents.values()].map((sub) => ({
				...sub,
				result: sub.result || (sub.endedAt === undefined ? "（未见回报）" : "（回报为空）")
			})),
			overlaySessions: Object.keys(overlay)
		};
	}
}

/** Pull the plain text out of a session message payload. */
function messageText(data) {
	const message = data?.message ?? data;
	const content = message?.content;
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		return content
			.flatMap((block) => {
				if (typeof block === "string") return [block];
				if (block?.type === "text") return [block.text ?? ""];
				if (block?.type === "tool-call") return [`[tool-call ${block.name ?? ""}]`];
				return [];
			})
			.join("\n");
	}
	if (typeof message?.text === "string") return message.text;
	return "";
}

export { basename, messageText };
