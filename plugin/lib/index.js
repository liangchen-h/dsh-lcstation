/**
 * dsh-lcstation — Host half.
 *
 * Turns the Workstation's four ideas (canvas card flow / memory / calls /
 * outputs) into DSH plugin surfaces. Everything here is a *program*: the card
 * chain is folded from the Host's own `session/event` stream, memory items are
 * lifted by regex rules, outputs are a bounded disk scan, and calls read the
 * live services. No model is ever invoked — not on the chat path and not off it.
 *
 * Read-only guarantees:
 *  - session logs and workspace ledgers are never written;
 *  - every write to a user file is preceded by a copy into
 *    `<Desktop>/work/lc-plugin/backups/<stamp>/` and followed by a read-back.
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, renameSync, appendFileSync, createReadStream } from "node:fs";
import { join, basename } from "node:path";
import { CardEngine } from "./cards.js";
import { MemoryTracker, readMemoryFiles, saveMemoryFile, importIntoMemory, saveOverlay, loadOverlay } from "./memory.js";
import { scanPrograms, listWsTools, setWsToolEnabled, deleteWsTool, addWsTool, upsertProgram, listSkills, listPlugins, togglePlugin } from "./calls.js";
import { scanOutputs, readForViewer, retireOutput, readerKind, listBackups, restoreFromBackup } from "./outputs.js";
import { ensureChains, loadChains } from "./chains.js";
import { transcriptOf, summaryKey, readSummary, ensureSummary } from "./summary.js";
import { RUNTIME_DIR, STATE_DIR, PLUGIN_HOME, WS_HOME, outputRoots, underRoots, existsSync, fileInfo, backupFile } from "./paths.js";

const VERSION = "0.1.0";
const ROUTE_PREFIX = "/lc/";
const inject = ["webServer"];

/** Tools whose call means "a file was written by this turn". */
const WRITE_TOOLS = new Set(["write", "ops_write", "edit", "ops_edit", "apply_patch", "ops_apply_patch", "str_replace_editor"]);

/** Per-session side state the routes need beyond the card fold. */
const side = {
	/** @type {Map<string, Set<string>>} sessionId -> lowercased written paths */
	written: new Map(),
	/** @type {Map<string, Array<{path:string,band:number,at:number}>>} sessionId -> write log, in call order */
	writes: new Map(),
	/** @type {Map<string, Map<string, Array<{turn:number,path:string,backup:string,size:number,mtime:number,at:number}>>>} sessionId -> path -> pre-images */
	preImages: new Map(),
	/** @type {Set<string>} sessions that have produced at least one event */
	seen: new Set(),
	memoryReplayed: new Set(),
	lastSessionId: undefined
};

const cards = new CardEngine();
const memory = new MemoryTracker();

/** A segment of work is sealed when the user sends one of these on its own. */
const END_MARK_LINE = /^(?:\/end|发送|结束|收工|完成了)$/i;
const END_MARK_TAIL = /(?:^|\s)\/end\s*$/i;

/** True when a user message is a "this segment is done" marker. */
function isEndMark(text) {
	const trimmed = String(text ?? "").trim();
	if (trimmed === "") return false;
	return END_MARK_LINE.test(trimmed) || (trimmed.length <= 60 && END_MARK_TAIL.test(trimmed));
}

/** First line of a text, clipped. */
function firstLineOf(text, limit = 40) {
	const line = String(text ?? "").trim().split("\n")[0];
	return line.length > limit ? line.slice(0, limit) + "…" : line;
}

/** Stable dedupe key: same file, whether the path came from a tool arg or from a card. */
function normPath(value) {
	return String(value ?? "").replace(/\\/g, "/").replace(/\/{2,}/g, "/").replace(/\/+$/, "").toLowerCase();
}

/** Back to a native-looking Windows path for display. */
function prettyPath(value) {
	const fixed = String(value ?? "").replace(/\//g, "\\").replace(/\\{2,}/g, "\\");
	return /^[a-z]:\\/i.test(fixed) ? fixed[0].toUpperCase() + fixed.slice(1) : fixed;
}

/** Drops the marker itself and any leading/trailing decorative punctuation. */
function stripEndMark(text) {
	return String(text ?? "")
		.replace(END_MARK_TAIL, "")
		.replace(END_MARK_LINE, "")
		.replace(/^[\s:：,，。.\-—]+|[\s,，。]+$/g, "")
		.trim();
}

/** The first real paragraph of an assistant message, with markdown noise stripped. */
function firstParagraphOf(text, limit = 220) {
	const lines = String(text ?? "").split("\n");
	const kept = [];
	for (const raw of lines) {
		const line = raw.trim();
		if (line === "") {
			if (kept.length > 0) break;
			continue;
		}
		if (/^(?:```|~~~)/.test(line)) continue;
		if (/^#{1,6}\s/.test(line)) {
			if (kept.length > 0) break;
			kept.push(line.replace(/^#{1,6}\s+/, ""));
			continue;
		}
		kept.push(line.replace(/^(?:[-*+]\s+|>\s*)/, ""));
		if (kept.join(" ").length >= limit) break;
	}
	const merged = kept.join(" ").replace(/\s+/g, " ").trim();
	if (merged === "") return "";
	return merged.length > limit ? merged.slice(0, limit).replace(/[，、。；：,.;:]$/, "") + "…" : merged;
}

/** One-line "what this segment delivered" note: the marker's own words, else the last assistant paragraph. */
function summaryOf(board, mark, from) {
	const own = stripEndMark(mark.full);
	if (own.length >= 8) return own.slice(0, 240);
	const cards = board?.cards ?? [];
	const bandOf = (card) => Number(card.band ?? 0);
	const ai = cards.filter((card) => card.kind === "msg-ai" && bandOf(card) >= from && bandOf(card) <= bandOf(mark));
	for (let index = ai.length - 1; index >= 0; index -= 1) {
		const text = firstParagraphOf(ai[index].text);
		if (text.length >= 8) return text;
	}
	return "";
}

/** Lowercased absolute paths mentioned by a tool-call argument blob. */
function writtenPathsOf(args) {
	const raw = typeof args === "string" ? args : JSON.stringify(args ?? "");
	// Tool arguments arrive JSON-escaped: `C:\\Users\\...` must become `C:\Users\...`
	// before it can be checked against the filesystem.
	const text = raw.replace(/\\\\/g, "\\");
	const out = [];
	const re = /[A-Za-z]:[\\/][^\s"'`,;)\]}>]{2,}/g;
	let m;
	while ((m = re.exec(text)) !== null) out.push(m[0].replace(/\//g, "\\"));
	return out;
}

/** Append-only log of "this turn wrote this file", one line per tool-call path. */
function writesFile(sessionId) {
	return join(RUNTIME_DIR, `writes-${String(sessionId).replace(/[^\w.-]/g, "_")}.jsonl`);
}

/** Load a session's write log from disk into memory once. */
function loadWrites(sessionId) {
	if (side.writes.has(sessionId)) return;
	const file = writesFile(sessionId);
	const rows = [];
	side.writes.set(sessionId, rows);
	if (!existsSync(file)) return;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		if (line.trim() === "") continue;
		try {
			const entry = JSON.parse(line);
			if (typeof entry?.path === "string") rows.push({ path: entry.path, band: Number(entry.band) || 0, at: Number(entry.at) || 0 });
		} catch {
			/* a torn last line does not invalidate the rest */
		}
	}
}

/** Record one write and persist it so a reload does not lose the segment. */
function recordWrite(sessionId, path, band, at) {
	loadWrites(sessionId);
	const rows = side.writes.get(sessionId);
	rows.push({ path, band, at });
	try {
		mkdirSync(RUNTIME_DIR, { recursive: true });
		appendFileSync(writesFile(sessionId), JSON.stringify({ path, band, at }) + "\n");
	} catch {
		/* the in-memory log still works for this run */
	}
}

/** Append-only index file for one session's pre-images. */
function preImageFile(sessionId) {
	return join(RUNTIME_DIR, `preimages-${String(sessionId).replace(/[^\w.-]/g, "_")}.jsonl`);
}

/** Load a session's pre-image index from disk into memory once. */
function loadPreImages(sessionId) {
	if (side.preImages.has(sessionId)) return;
	const file = preImageFile(sessionId);
	const byPath = new Map();
	side.preImages.set(sessionId, byPath);
	if (!existsSync(file)) return;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		if (line.trim() === "") continue;
		let entry;
		try {
			entry = JSON.parse(line);
		} catch {
			continue;
		}
		if (typeof entry?.path !== "string" || typeof entry?.backup !== "string") continue;
		const list = byPath.get(entry.path) ?? [];
		list.push(entry);
		byPath.set(entry.path, list);
	}
}

/** Pre-images copied right before a file tool overwrites an existing file, keyed by turn. */
function capturePreImage(sessionId, path, event) {
	if (!underRoots(path, outputRoots().map((root) => root.path)) || !existsSync(path)) return;
	const turn = Number(event?.data?.turn ?? event?.turn ?? 0);
	loadPreImages(sessionId);
	const byPath = side.preImages.get(sessionId);
	const list = byPath.get(path) ?? [];
	const info = fileInfo(path);
	if (info === undefined) return;
	const newest = list[list.length - 1];
	if (newest !== undefined && newest.size === info.size && newest.mtime === info.mtime) return;
	const backup = backupFile(path);
	if (backup === undefined) return;
	list.push({ turn, path, backup, size: info.size, mtime: info.mtime, at: Date.now() });
	byPath.set(path, list);
	try {
		mkdirSync(RUNTIME_DIR, { recursive: true });
		appendFileSync(preImageFile(sessionId), JSON.stringify(list[list.length - 1]) + "\n");
	} catch {
		/* the in-memory index still works for this run */
	}
	side.preImages.set(sessionId, byPath);
}

/** Fold one session event into every consumer. */
function onSessionEvent(session, event) {
	const sessionId = session?.id ?? session?.sessionId;
	if (typeof sessionId !== "string") return;
	side.seen.add(sessionId);
	side.lastSessionId = sessionId;
	if (event?.type === "tool/call" && WRITE_TOOLS.has(String(event.data?.name ?? ""))) {
		const set = side.written.get(sessionId) ?? new Set();
		const band = Number(event.data?.turn ?? cards.boards.get(sessionId)?.turn ?? 0);
		const at = Number(event.time) || Date.now();
		for (const p of writtenPathsOf(event.data?.arguments)) {
			set.add(p.toLowerCase());
			recordWrite(sessionId, p, band, at);
			capturePreImage(sessionId, p, event);
		}
		side.written.set(sessionId, set);
	}
	try {
		if (!cards.boards.has(sessionId)) restoreCachedBoard(sessionId);
		cards.fold(sessionId, event ?? {});
		const board = cards.boards.get(sessionId);
		if (board !== undefined) schedulePersist(board);
	} catch (error) {
		ctx0?.logger?.warn?.(`dsh-lcstation: card fold failed for ${event?.type}: ${error instanceof Error ? error.message : error}`);
	}
	try {
		memory.observe(sessionId, event ?? {});
	} catch (error) {
		ctx0?.logger?.warn?.(`dsh-lcstation: memory fold failed for ${event?.type}: ${error instanceof Error ? error.message : error}`);
	}
}

/** Set by `apply` so the fold helpers can log without threading ctx through. */
let ctx0;

/** JSON response helper. */
function json(res, value, status = 200) {
	if (res.writableEnded === true) return;
	res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
	res.end(JSON.stringify(value));
}

/** Read a JSON request body (bounded). */
function readBody(req) {
	return new Promise((resolve) => {
		let data = "";
		req.setEncoding("utf8");
		req.on("data", (chunk) => {
			data += chunk;
			if (data.length > 8 * 1024 * 1024) req.destroy();
		});
		req.on("end", () => {
			if (data.trim() === "") return resolve({});
			try {
				const parsed = JSON.parse(data);
				resolve(parsed !== null && typeof parsed === "object" ? parsed : {});
			} catch {
				resolve({ __invalid: true, raw: data.slice(0, 500) });
			}
		});
		req.on("error", () => resolve({}));
	});
}

/** Spawn a detached OS helper (Explorer / default program). */
function launch(program, args) {
	try {
		const child = spawn(program, args, { detached: true, stdio: "ignore", windowsHide: false });
		child.unref();
		return true;
	} catch {
		return false;
	}
}

/**
 * One-shot backfill: a board lives in memory only, so after a plugin reload the
 * canvas would start empty even though the conversation continues. When a board
 * is first asked for, replay that session's already-live events through the same
 * fold. This reads the in-memory session once — it is not a periodic rescan.
 */
function cacheFile(sessionId) {
	return join(PLUGIN_HOME, ".runtime", "sessions", String(sessionId).replace(/[^A-Za-z0-9._-]/g, "_") + ".json");
}

/** 插件自己折叠的结果落盘：会话被压缩、插件被重载，链子也还在。 */
function persistBoard(board) {
	try {
		mkdirSync(join(PLUGIN_HOME, ".runtime", "sessions"), { recursive: true });
		const file = cacheFile(board.sessionId);
		const next = board.dump();
		// 绝不用一张（近乎）空的板覆盖历史更长的缓存：重启瞬间最容易踩到，
		// 一旦覆盖，之前几百张卡就再也回不来了。
		try {
			const prev = JSON.parse(readFileSync(file, "utf8"));
			const prevCount = Array.isArray(prev.cards) ? prev.cards.length : 0;
			const nextCount = Array.isArray(next.cards) ? next.cards.length : 0;
			if (nextCount === 0 && prevCount > 0) return;
			if (prevCount > nextCount && nextCount * 2 < prevCount) {
				// 变短多半是重建，不是正常追加：先留 .bak 再写
				try { renameSync(file, file + ".bak"); } catch { /* 备份失败也要写下去 */ }
			}
		} catch {
			/* 没有旧文件是正常情况 */
		}
		writeFileSync(file, JSON.stringify(next), "utf8");
	} catch {
		/* 缓存写不了不影响主流程 */
	}
}

/** 启动时把所有落过盘的会话板都装回来：不依赖任何新事件，打开就能看。 */
function restoreAllCachedBoards() {
	const dir = join(PLUGIN_HOME, ".runtime", "sessions");
	let names = [];
	try {
		names = readdirSync(dir).filter((n) => n.endsWith(".json"));
	} catch {
		return 0;
	}
	let newest = { id: undefined, at: 0 };
	for (const name of names) {
		const sessionId = name.slice(0, -5);
		if (cards.boards.has(sessionId)) continue;
		try {
			const at = statSync(join(dir, name)).mtimeMs;
			if (at > newest.at) newest = { id: sessionId, at };
		} catch {
			/* 拿不到时间就按文件名顺序处理 */
		}
		restoreCachedBoard(sessionId);
		side.seen.add(sessionId);
	}
	if (side.lastSessionId === undefined && newest.id !== undefined) side.lastSessionId = newest.id;
	return cards.boards.size;
}

const persistTimers = new Map();

function schedulePersist(board) {
	if (persistTimers.has(board.sessionId)) return;
	const timer = setTimeout(() => {
		persistTimers.delete(board.sessionId);
		persistBoard(board);
	}, 1500);
	if (typeof timer.unref === "function") timer.unref();
	persistTimers.set(board.sessionId, timer);
}

function restoreCachedBoard(sessionId) {
	try {
		const cached = JSON.parse(readFileSync(cacheFile(sessionId), "utf8"));
		if (!Array.isArray(cached.cards) || cached.cards.length === 0) return false;
		return cards.board(sessionId).restore(cached);
	} catch {
		return false;
	}
}

function backfill(ctx, sessionId) {
	if (sessionId === null || sessionId === undefined) return;
	if (cards.boards.has(sessionId)) return;
	// 先恢复持久缓存；只有没有缓存时才回放会话快照。
	if (restoreCachedBoard(sessionId)) return;
	const sessions = ctx.get("sessions");
	if (sessions === undefined) return;
	let session;
	try {
		session = sessions.get(sessionId);
	} catch {
		return;
	}
	if (session === undefined) return;
	let events = [];
	try {
		events = session.snapshotEvents();
	} catch {
		return;
	}
	for (const event of events) {
		try {
			cards.fold(sessionId, event);
		} catch {
			/* a single unparsable event must not kill the replay */
		}
	}
}

/** Rebuild memory once from the events the Host still retains. */
function backfillMemory(ctx, sessionId) {
	if (!sessionId || side.memoryReplayed.has(sessionId)) return;
	const sessions = ctx.get("sessions");
	if (sessions === undefined) return;
	let events;
	try {
		const session = sessions.get(sessionId);
		if (session === undefined) return;
		events = session.snapshotEvents();
	} catch {
		return;
	}
	memory.sessions.delete(sessionId);
	for (const event of events) memory.observe(sessionId, event);
	side.memoryReplayed.add(sessionId);
}

/**
 * Local-only guard. Every mutating route demands `application/json`: a plain HTML form or a
 * cross-site `fetch` without a preflight cannot produce that content type, so a random page
 * open in the same browser cannot drive `/lc/memory/file`, `/lc/outputs/*` or `/lc/calls/*`.
 */
function guardRoute(route) {
	const inner = route.handler;
	return {
		...route,
		handler: async (req, res) => {
			if (req.method === "POST") {
				const type = String(req.headers?.["content-type"] ?? "").toLowerCase();
				if (!type.includes("application/json")) {
					res.statusCode = 415;
					res.setHeader("content-type", "application/json; charset=utf-8");
					res.end(JSON.stringify({ ok: false, reason: "json-only" }));
					return;
				}
			}
			return inner(req, res);
		}
	};
}

/** Every route this plugin serves. */
function routes(ctx) {
	const skills = () => ctx.get("skills");
	const pluginManager = () => ctx.get("pluginManager");

	return [
		/* ── health: the acceptance probe for P1 ─────────────────────────────── */
		{
			kind: "exact",
			path: "/lc/health",
			handler: async (req, res) => {
				const presets = ctx.get("agentPresets");
				let presetView;
				try {
					presetView = presets === undefined ? { available: false } : { available: true, defaultId: presets.defaultId, ...(await presets.remoteExportList()) };
				} catch (error) {
					presetView = { available: true, error: error instanceof Error ? error.message : String(error) };
				}
				json(res, {
					ok: true,
					plugin: "dsh-lcstation",
					version: VERSION,
					pid: process.pid,
					now: new Date().toISOString(),
					pluginHome: PLUGIN_HOME,
					boards: cards.boards.size,
					trackedSessions: [...side.seen].length,
					lastSessionId: side.lastSessionId,
					agentPresets: presetView
				});
			}
		},

		/* ── canvas ─────────────────────────────────────────────────────────── */
		/* ── 任务链归属（规则判不了的交模型） ─────────────────────────────── */
		{
			kind: "exact",
			path: "/lc/chains",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId;
				if (typeof sessionId !== "string") return json(res, { ok: false, reason: "no-session" });
				backfill(ctx, sessionId);
				const board = cards.boards.get(sessionId);
				const all = board === undefined ? [] : board.snapshot(-1, 0).cards;
				// 一个 turn 里会混进系统注入的卡片（system-reminder / runtime context / 后台任务回执），
				// 它们不是用户说的话，喂给分链模型只会让判定跑偏；同一个 turn 也只留最长的那条真实输入。
				const NOISE = /^(<system-reminder>|Current runtime context|Time sampled|background job|\[Compressed conversation section\]|\[\.\.\. )/i;
				const byBand = new Map();
				for (const card of all) {
					if (card.kind !== "msg-user") continue;
					const text = `${card.sub ?? ""} ${card.detail ?? ""}`.replace(/\s+/g, " ").trim();
					if (text === "" || NOISE.test(text)) continue;
					const band = card.band ?? 1;
					const prev = byBand.get(band);
					if (prev === undefined || text.length > prev.length) byBand.set(band, text);
				}
				const userTexts = [...byBand.entries()]
					.map(([band, text]) => ({ band, text }))
					.sort((a, b) => a.band - b.band);
				const force = url.searchParams.get("refresh") === "1";
				const result = await ensureChains(sessionId, userTexts, { force });
				const cached = loadChains(sessionId);
				return json(res, {
					ok: true,
					sessionId,
					source: result.source,
					error: result.error,
					bands: result.bands,
					chains: result.chains,
					names: cached?.names ?? {}
				});
			}
		},
		{
			kind: "prefix",
			path: "/lc/cards",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				let sessionId = url.searchParams.get("session") ?? side.lastSessionId;
				if (sessionId === null || sessionId === undefined) {
					// 还没有任何事件时也别让画布空着：直接给最近更新过的那块板。
					const latest = [...cards.boards.values()].sort((a, b) => b.updatedAt - a.updatedAt)[0];
					if (latest === undefined) return json(res, { ok: false, reason: "no-session", boards: [] });
					sessionId = latest.sessionId;
				}
				const since = Number(url.searchParams.get("since") ?? "-1");
				backfill(ctx, sessionId);
				const board = cards.boards.get(sessionId);
				if (board === undefined) {
					return json(res, { ok: true, sessionId, total: 0, lanes: [], cards: [], known: [...cards.boards.keys()] });
				}
				const revision = Number(url.searchParams.get("revision") ?? "0");
				json(res, { ok: true, ...board.snapshot(since, revision) });
			}
		},
		{
			kind: "exact",
			path: "/lc/rebuild",
			handler: async (req, res) => {
				// 从宿主内存里的完整事件流重折一遍：缓存被截断时用它把历史找回来。
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId;
				if (typeof sessionId !== "string") return json(res, { ok: false, reason: "no-session" });
				const sessions = ctx.get("sessions");
				if (sessions === undefined) return json(res, { ok: false, reason: "no-sessions-service" });
				let events = [];
				try {
					const session = sessions.get(sessionId);
					if (session === undefined) return json(res, { ok: false, reason: "session-not-found" });
					events = session.snapshotEvents();
				} catch (error) {
					return json(res, { ok: false, reason: "snapshot-failed", detail: error instanceof Error ? error.message : String(error) });
				}
				cards.boards.delete(sessionId);
				let folded = 0;
				for (const event of events) {
					try {
						cards.fold(sessionId, event);
						folded += 1;
					} catch {
						/* 单条坏事件不该毁掉整次重放 */
					}
				}
				const board = cards.boards.get(sessionId);
				if (board !== undefined) {
					persistBoard(board);
					side.lastSessionId = sessionId;
					side.seen.add(sessionId);
				}
				json(res, { ok: true, sessionId, events: events.length, folded, total: board === undefined ? 0 : board.cards.length });
			}
		},

		{
			kind: "exact",
			path: "/lc/sessions",
			handler: async (_req, res) => {
				const rows = [...cards.boards.values()]
					.sort((a, b) => b.updatedAt - a.updatedAt)
					.map((b) => ({
						sessionId: b.sessionId,
						cards: b.cards.length,
						lanes: b.lanes.length,
						turn: b.turn,
						updatedAt: b.updatedAt,
						parentSession: b.parentSession,
						delegationDepth: b.delegationDepth
					}));
				json(res, { ok: true, lastSessionId: side.lastSessionId, sessions: rows });
			}
		},

		/* ── memory ─────────────────────────────────────────────────────────── */
		{
			kind: "exact",
			path: "/lc/memory",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId ?? "";
				backfillMemory(ctx, sessionId);
				json(res, { ok: true, ...memory.view(sessionId), files: readMemoryFiles().map((f) => ({ id: f.id, label: f.label, path: f.path, exists: f.exists, size: f.size, mtime: f.mtime })) });
			}
		},
		{
			kind: "exact",
			path: "/lc/memory/file",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				json(res, saveMemoryFile(body.path, body.content));
			}
		},
		{
			kind: "exact",
			path: "/lc/memory/items",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				const sessionId = String(body.session ?? "");
				if (sessionId === "") return json(res, { ok: false, reason: "no-session" });
				const overlay = loadOverlay();
				const slot = (overlay[sessionId] ??= { items: {} });
				slot.items ??= {};
				for (const item of Array.isArray(body.items) ? body.items : []) {
					if (typeof item?.id !== "string") continue;
					slot.items[item.id] = {
						text: typeof item.text === "string" ? item.text : undefined,
						enabled: typeof item.enabled === "boolean" ? item.enabled : undefined,
						selected: typeof item.selected === "boolean" ? item.selected : undefined
					};
				}
				const wrote = saveOverlay(overlay);
				json(res, { ...wrote, session: sessionId, items: Object.keys(slot.items).length });
			}
		},
		{
			kind: "exact",
			path: "/lc/memory/import",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				json(res, importIntoMemory(body.target, Array.isArray(body.items) ? body.items : []));
			}
		},

		/* ── calls ──────────────────────────────────────────────────────────── */
		{
			kind: "exact",
			path: "/lc/calls",
			handler: async (req, res) => {
				const TOOL_KIND_LABEL = { "read-file": "读", "write-file": "写", "run-cmd": "跑", web: "联网", "spawn-subagent": "子体", tool: "工具", backfill: "回看", compress: "压缩" };
				const [skillRows, pluginRows] = await Promise.all([listSkills(skills()), listPlugins(pluginManager())]);
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId;
				const board = typeof sessionId === "string" ? cards.boards.get(sessionId) : undefined;
				const all = board === undefined ? [] : board.snapshot(-1, 0).cards;
				const counts = new Map();
				for (const card of all) {
					const label = card.sub ?? "";
					if (card.kind === "msg-user" || card.kind === "msg-ai" || card.kind === "todo" || card.kind === "note") continue;
					const name = label !== "" ? label : (TOOL_KIND_LABEL[card.kind] ?? card.kind);
					const key = card.kind + "·" + name;
					const row = counts.get(key) ?? { name, kind: card.kind, count: 0, lastBand: 0 };
					row.count += 1;
					row.lastBand = Math.max(row.lastBand, card.band ?? 0);
					counts.set(key, row);
				}
				const used = [...counts.values()].sort((a, b) => b.count - a.count);
				json(res, {
					ok: true,
					sessionId,
					skills: skillRows,
					plugins: pluginRows,
					programs: { available: true, total: scanPrograms().length, rows: scanPrograms().slice(0, 400) },
					wsTools: { available: existsSync(join(WS_HOME, "cap", "tool")), rows: listWsTools() },
					used
				});
			}
		},
		{
			kind: "exact",
			path: "/lc/calls/plugin",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				if (body.confirm !== true) return json(res, { ok: false, reason: "confirm-required" }, 428);
				json(res, await togglePlugin(pluginManager(), { kind: body.kind === "bundle" ? "bundle" : "plugin", id: String(body.id ?? ""), enabled: body.enabled === true }));
			}
		},
		{
			kind: "exact",
			path: "/lc/calls/tool",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				const action = String(body.action ?? "toggle");
				if (action === "add") return json(res, addWsTool(body.name, body.body));
				if (body.confirm !== true) return json(res, { ok: false, reason: "confirm-required" }, 428);
				if (action === "delete") return json(res, deleteWsTool(String(body.name ?? "")));
				return json(res, setWsToolEnabled(String(body.name ?? ""), body.enabled === true));
			}
		},
		{
			kind: "exact",
			path: "/lc/calls/program",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				json(res, upsertProgram(body));
			}
		},
		/* Raw bytes of one registered PATH program, so the row can be dragged into the
		 * composer as a real File (Files type) instead of a uri-list the composer ignores. */
		{
			kind: "exact",
			path: "/lc/raw",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const target = url.searchParams.get("path") ?? "";
				const listed = scanPrograms().some((row) => row.path === target);
				const ext = target.slice(target.lastIndexOf(".")).toLowerCase();
				const runnable = [".exe", ".cmd", ".bat", ".ps1", ".com", ".lnk"].includes(ext);
				if (!listed && !runnable) return json(res, { ok: false, reason: "not-a-program" }, 403);
				if (!existsSync(target)) return json(res, { ok: false, reason: "not-found" }, 404);
				const info = statSync(target);
				if (!info.isFile()) return json(res, { ok: false, reason: "not-a-file" }, 400);
				res.writeHead(200, {
					"content-type": "application/octet-stream",
					"content-length": String(info.size),
					"cache-control": "no-store"
				});
				createReadStream(target).pipe(res);
			}
		},

		/* ── outputs ────────────────────────────────────────────────────────── */
		{
			kind: "exact",
			path: "/lc/outputs/turns",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId;
				const session = sessionId && ctx.get("sessions")?.get(sessionId);
				const changes = ctx.get("workspaceChanges");
				if (!session || !changes) return json(res, { ok: true, turns: [], available: false });
				const turns = new Map();
				for (const event of session.snapshotEvents()) {
					if (event.type !== "workspace/changes") continue;
					const summary = changes.summary(sessionId, event.seq);
					const turn = event.data.turn;
					if (!turns.has(turn)) turns.set(turn, []);
					turns.get(turn).push({ seq: event.seq, time: event.time, available: !!summary, files: summary?.files ?? [], snapshot: !!summary?.snapshot });
				}
				json(res, { ok: true, available: true, turns: [...turns].map(([turn, versions]) => ({ turn, versions })).sort((a, b) => b.turn - a.turn) });
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId ?? "";
				const written = side.written.get(sessionId) ?? new Set();
				const scan = scanOutputs(written);
				json(res, { ok: true, sessionId, writtenCount: written.size, ...scan });
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/final",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId ?? "";
				if (!cards.boards.has(sessionId)) restoreCachedBoard(sessionId);
				const board = cards.boards.get(sessionId);
				const users = (board?.cards ?? []).filter((card) => card.kind === "msg-user");
				const marks = users
					.filter((card) => isEndMark(String(card.text ?? "")))
					.map((card) => ({ band: Number(card.band ?? 0), at: Number(card.time) || 0, text: firstLineOf(card.text, 40), full: String(card.text ?? "") }));
				loadWrites(sessionId);
				const log = side.writes.get(sessionId) ?? [];
				if (marks.length === 0) return json(res, { ok: true, hasMarker: false, marks: [], rows: [], count: 0 });
				const last = marks[marks.length - 1];
				/** The final deliverable covers the whole conversation, not just the last segment. */
				const from = 1;
				const kept = new Map();
				for (const entry of log) {
					if (entry.band < from || entry.band > last.band) continue;
					const key = normPath(entry.path);
					const seen = kept.get(key);
					if (!seen || entry.at >= seen.at) kept.set(key, entry);
				}
				/** Cards carry the write targets of every past turn, so the list can cover the whole conversation. */
				for (const card of board?.cards ?? []) {
					if (card.kind !== "write-file") continue;
					const band = Number(card.band ?? 0);
					if (band > last.band) continue;
					for (const target of card.produces ?? []) {
						const text = String(target ?? "");
						if (!/\.[a-z0-9]{1,8}$/i.test(text)) continue;
						const key = normPath(text);
						const seen = kept.get(key);
						const at = Number(card.time) || 0;
						if (!seen) {
							kept.set(key, { path: text, band, at });
							continue;
						}
						if (!seen.path.includes("\\") && text.includes("\\")) seen.path = text;
						if (at >= seen.at) {
							seen.at = at;
							seen.band = band;
						}
					}
				}
				const rows = [...kept.values()]
					.map((entry) => {
						const info = fileInfo(entry.path);
						return {
							path: prettyPath(entry.path),
							name: basename(prettyPath(entry.path)),
							band: entry.band,
							exists: info !== undefined,
							size: info?.size ?? 0,
							mtime: info?.mtime ?? entry.at
						};
					})
					.filter((row) => row.exists)
					.sort((a, b) => b.mtime - a.mtime);
				const lang = url.searchParams.get("lang") === "en" ? "en" : "zh";
				const own = stripEndMark(last.full);
				let summary = own;
				if (own.length < 8) {
					const cardsUpTo = (board?.cards ?? []).filter((card) => Number(card.band ?? 0) <= last.band);
					const key = summaryKey(marks, last.band, lang);
					const cached = readSummary(sessionId, key);
					if (cached === undefined) ensureSummary(sessionId, key, transcriptOf(cardsUpTo), lang);
					summary = cached ?? summaryOf(board, last, from);
				}
				json(res, { ok: true, hasMarker: true, marks, segment: { from, to: last.band }, summary, summaryPending: own.length < 8 && readSummary(sessionId, summaryKey(marks, last.band, lang)) === undefined, rows, count: rows.length });
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/open",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				const path = String(body.path ?? "");
				if (!underRoots(path, outputRoots().map((r) => r.path))) return json(res, { ok: false, reason: "outside-roots" });
				if (!existsSync(path)) return json(res, { ok: false, reason: "not-found" });
				const mode = String(body.mode ?? "open");
				const ok = mode === "select" ? launch("explorer.exe", ["/select,", path]) : launch("cmd.exe", ["/c", "start", "", path]);
				json(res, { ok, mode, path });
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/retire",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				if (body.confirm !== true) return json(res, { ok: false, reason: "confirm-required" }, 428);
				const path = String(body.path ?? "");
				if (!underRoots(path, outputRoots().map((r) => r.path))) return json(res, { ok: false, reason: "outside-roots" });
				json(res, retireOutput(path));
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/retire-many",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				const roots = outputRoots().map((r) => r.path);
				const paths = Array.isArray(body.paths) ? [...new Set(body.paths.map(String).filter((p) => underRoots(p, roots)))] : [];
				if (paths.length === 0) return json(res, { ok: false, reason: "no-valid-paths" });
				const rows = paths.map((path) => {
					const info = existsSync(path) ? fileInfo(path) : undefined;
					return { path, exists: info !== undefined, size: info ? info.size : 0 };
				});
				const totalBytes = rows.reduce((sum, row) => sum + row.size, 0);
				const preview = { count: rows.length, totalBytes, rows };
				if (body.preview === true) return json(res, { ok: true, preview: true, ...preview });
				if (body.confirm !== true) return json(res, { ok: false, reason: "confirm-required", preview }, 428);
				const results = rows.map((row) => ({ path: row.path, ...(row.exists ? retireOutput(row.path) : { ok: false, reason: "not-found" }) }));
				json(res, { ok: results.every((r) => r.ok), count: results.length, moved: results.filter((r) => r.ok).length, totalBytes, results });
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/backups",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const path = url.searchParams.get("path") ?? "";
				if (path === "") return json(res, { ok: false, reason: "no-path" });
				json(res, { ok: true, path, backups: listBackups(path) });
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/preimages",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const sessionId = url.searchParams.get("session") ?? side.lastSessionId ?? "";
				loadPreImages(sessionId);
				const byPath = side.preImages.get(sessionId);
				if (byPath === undefined) return json(res, { ok: true, session: sessionId, turns: [], note: "本次载入后尚未观察到写文件调用" });
				const turns = new Map();
				for (const list of byPath.values()) {
					for (const entry of list) {
						const bucket = turns.get(entry.turn) ?? [];
						bucket.push({ path: entry.path, backup: entry.backup, size: entry.size, at: entry.at, mtime: entry.mtime });
						turns.set(entry.turn, bucket);
					}
				}
				json(res, {
					ok: true,
					session: sessionId,
					turns: [...turns.entries()].sort((a, b) => a[0] - b[0]).map(([turn, files]) => ({ turn, files }))
				});
			}
		},
		{
			kind: "exact",
			path: "/lc/outputs/restore",
			handler: async (req, res) => {
				if (req.method !== "POST") return json(res, { ok: false, reason: "method" }, 405);
				const body = await readBody(req);
				if (body.confirm !== true) return json(res, { ok: false, reason: "confirm-required" }, 428);
				const path = String(body.path ?? "");
				const backup = String(body.backup ?? "");
				if (!underRoots(path, outputRoots().map((r) => r.path))) return json(res, { ok: false, reason: "outside-roots" });
				json(res, restoreFromBackup(path, backup));
			}
		},
		{
			kind: "prefix",
			path: "/lc/file",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://127.0.0.1");
				const path = url.searchParams.get("path") ?? "";
				if (!underRoots(path, outputRoots().map((r) => r.path))) return json(res, { ok: false, reason: "outside-roots" }, 403);
				if (!existsSync(path)) return json(res, { ok: false, reason: "not-found" }, 404);
				const info = fileInfo(path);
				json(res, { ok: true, ...info, kind: readerKind(path), ...readForViewer(path) });
			}
		},

		/* ── selftest: touch every subsystem so one restart reports all breakage ─ */
		{
			kind: "exact",
			path: "/lc/selftest",
			handler: async (_req, res) => {
				const checks = [];
				const check = async (name, fn) => {
					try {
						checks.push({ name, ok: true, value: await fn() });
					} catch (error) {
						checks.push({ name, ok: false, error: error instanceof Error ? `${error.message}` : String(error) });
					}
				};
				await check("webServer", () => (ctx.get("webServer") === undefined ? "missing" : "present"));
				await check("agentPresets", async () => (ctx.get("agentPresets") === undefined ? "missing" : (await ctx.get("agentPresets").remoteExportList()).presets.map((p) => `${p.id}${p.isDefault ? "*" : ""}`)));
				await check("skills", async () => { const s = await listSkills(skills()); return `${s.available} rows=${s.rows.length}${s.error ? ` err=${s.error}` : ""}`; });
				await check("plugins", async () => { const p = await listPlugins(pluginManager()); return `${p.available} plugins=${p.plugins.length} bundles=${p.bundles.length}${p.error ? ` err=${p.error}` : ""}`; });
				await check("programs", () => `${scanPrograms().length} on PATH`);
				await check("wsTools", () => `${listWsTools().length} in cap/tool`);
				await check("memoryFiles", () => readMemoryFiles().map((f) => `${f.id}:${f.size}`).join(","));
				await check("outputs", () => { const s = scanOutputs(new Set()); return `${s.total} files, counts=${JSON.stringify(s.counts)}`; });
				await check("cards", () => `${cards.boards.size} boards`);
				await check("agents", () => (ctx.get("agents") === undefined ? "missing" : `${ctx.get("agents").roots().length} roots`));
				await check("sessions", () => (ctx.get("sessions") === undefined ? "missing" : "present"));
				json(res, { ok: checks.every((c) => c.ok), version: VERSION, checks });
			}
		}
	];
}

/** Write the authenticated local URL once the connection service exists. */
function announceDevUrl(ctx) {
	let timer;
	const attempt = () => {
		try {
			const connection = ctx.get("connection");
			const webServer = ctx.get("webServer");
			if (connection === undefined || webServer === undefined) return false;
			const url = connection.authenticatedUrl(webServer.getOrigin());
			mkdirSync(RUNTIME_DIR, { recursive: true });
			writeFileSync(join(RUNTIME_DIR, "web-url.txt"), `${url}\n`, "utf8");
			mkdirSync(STATE_DIR, { recursive: true });
			return true;
		} catch {
			return false;
		}
	};
	if (attempt()) return;
	timer = setInterval(() => {
		if (attempt() && timer !== undefined) clearInterval(timer);
	}, 1500);
	ctx.effect(() => () => clearInterval(timer), "dsh-lcstation: dev web url");
}

/** Host entry point. */
function apply(ctx) {
	ctx0 = ctx;
	announceDevUrl(ctx);
	// 先把手里的历史装回来，再接事件：这样「工作站」打开时不用等任何新事件。
	restoreAllCachedBoards();

	ctx.effect(() => {
		const stopCards = ctx.on("session/event", (session, event) => onSessionEvent(session, event));
		const stopCreated = ctx.on("agent/created", ({ agent } = {}) => {
			const sessionId = agent?.session?.id ?? agent?.sessionId;
			if (typeof sessionId !== "string") return;
			const header = agent?.session?.header;
			cards.setLineage(sessionId, { parentSession: header?.parentSession, delegationDepth: header?.delegationDepth });
		});
		return () => {
			stopCards?.();
			stopCreated?.();
		};
	}, "dsh-lcstation: session folding");

	ctx.effect(() => {
		const disposers = routes(ctx).map((route) => ctx.webServer.register(guardRoute(route)));
		return () => {
			for (const dispose of disposers) {
				try {
					dispose();
				} catch {
					/* already gone */
				}
			}
		};
	}, "dsh-lcstation: http routes");
}

export { apply, inject, VERSION };
