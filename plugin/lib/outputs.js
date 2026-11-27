/**
 * Outputs view data: what this machine produced, where it is, and what can be
 * rolled back.
 *
 * The scan is bounded (depth + count) and cached for a few seconds, so opening the
 * tab does not walk the whole Desktop/work tree on every poll. The "changed this
 * turn" set comes from the session event stream (write/edit tool calls and
 * `workspace/changes`), not from mtime guessing alone.
 */
import { readdirSync, existsSync, statSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, basename, dirname, extname, resolve, sep } from "node:path";
import { outputRoots, backupFile, BACKUP_DIR } from "./paths.js";

/** Extensions rendered as text in the built-in reader. */
const TEXT_EXT = new Set([".md", ".txt", ".json", ".jsonl", ".yml", ".yaml", ".ps1", ".mjs", ".js", ".ts", ".py", ".css", ".html", ".csv", ".log", ".ini", ".toml", ".sql"]);
/** Extensions rendered as images. */
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".ico", ".svg"]);

const MAX_ROWS = 4000;
const CACHE_MS = 4000;
let cache;

/** Is this path a rollback artifact (a version snapshot rather than a deliverable)? */
function isRollback(path, name) {
	const lower = path.toLowerCase();
	return (
		lower.includes("\\dsh-tools\\state\\") ||
		lower.includes("\\lc-plugin\\backups\\") ||
		/\.bak|\.orig|before-|\.pre-|\.backup|-\d{13}\.json$/i.test(name)
	);
}

/** Is this path a scratch file? */
function isTemp(path, name) {
	const lower = path.toLowerCase();
	return (
		lower.includes("\\temp\\") ||
		lower.includes("\\_测试残留\\") ||
		/\.(tmp|temp|log~|crdownload|partial)$/i.test(name) ||
		/^(tmp|temp)_/i.test(name)
	);
}

/** Walk one root, depth-limited, collecting file rows. */
function walk(root, label, depth, rows) {
	if (depth < 0 || rows.length >= MAX_ROWS) return;
	let entries;
	try {
		entries = readdirSync(root, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		if (rows.length >= MAX_ROWS) return;
		if (entry.name === "node_modules" || entry.name === ".git") continue;
		const full = join(root, entry.name);
		if (entry.isDirectory()) {
			walk(full, label, depth - 1, rows);
			continue;
		}
		if (!entry.isFile()) continue;
		if (/\.retired-\d+$/.test(entry.name)) continue;
		let stat;
		try {
			stat = statSync(full);
		} catch {
			continue;
		}
		rows.push({ path: full, name: entry.name, dir: dirname(full), size: stat.size, mtime: stat.mtimeMs, root: label });
	}
}

/**
 * Scan every output root and classify the rows.
 * @param written - absolute paths this session wrote (lowercased set).
 */
export function scanOutputs(written) {
	const now = Date.now();
	const writtenKey = [...(written ?? [])].sort().join("\n");
	if (cache !== undefined && now - cache.at < CACHE_MS && writtenKey === cache.writtenKey) return cache.value;
	const rows = [];
	for (const root of outputRoots()) {
		if (!existsSync(root.path)) continue;
		walk(root.path, root.label, root.id === "dsh-tools-state" ? 1 : 3, rows);
	}
	const seen = new Set();
	const classified = [];
	for (const row of rows) {
		const key = row.path.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		const changed = written !== undefined && written.has(key);
		let category = "final";
		if (isRollback(row.path, row.name)) category = "rollback";
		else if (isTemp(row.path, row.name)) category = "temp";
		else if (changed) category = "changed";
		const ext = extname(row.name).toLowerCase();
		const type = IMAGE_EXT.has(ext) ? "图片" : [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"].includes(ext) ? "文档" : [".js", ".mjs", ".ts", ".py", ".css", ".html", ".ps1", ".sql"].includes(ext) ? "代码" : TEXT_EXT.has(ext) ? "文本与数据" : "其他类型";
		classified.push({ ...row, category, type, changedThisSession: changed });
	}
	classified.sort((a, b) => b.mtime - a.mtime);
	const value = {
		generatedAt: now,
		total: classified.length,
		counts: {
			changed: classified.filter((r) => r.category === "changed").length,
			temp: classified.filter((r) => r.category === "temp").length,
			rollback: classified.filter((r) => r.category === "rollback").length,
			final: classified.filter((r) => r.category === "final").length
		},
		rows: classified.slice(0, MAX_ROWS)
	};
	cache = { at: now, value, writtenKey };
	return value;
}

/** How the built-in reader should present a file. */
export function readerKind(path) {
	const ext = extname(path).toLowerCase();
	if (IMAGE_EXT.has(ext)) return { mode: "image", ext };
	if (TEXT_EXT.has(ext)) return { mode: "text", ext };
	return { mode: "external", ext };
}

/** Read a file for the built-in viewer. Never used for writes. */
export function readForViewer(path) {
	const kind = readerKind(path);
	const stat = statSync(path);
	if (stat.size > 4 * 1024 * 1024) return { mode: "toobig", size: stat.size, kind };
	if (kind.mode === "image") return { mode: "image", ext: kind.ext, base64: readFileSync(path).toString("base64"), size: stat.size };
	if (kind.mode === "text") return { mode: "text", ext: kind.ext, text: readFileSync(path, "utf8"), size: stat.size };
	return { mode: "external", ext: kind.ext, size: stat.size };
}

/** Flat backup file name for an absolute path (same rule `backupFile` uses). */
function flatOf(path) {
	return path.replace(/^[A-Za-z]:/, "").replace(/[\\/:]/g, "_");
}

/** Every backup this plugin holds for `path`, newest stamp first. */
export function listBackups(path) {
	if (!existsSync(BACKUP_DIR)) return [];
	let stamps;
	try {
		stamps = readdirSync(BACKUP_DIR, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
	} catch {
		return [];
	}
	const flat = flatOf(path);
	const pattern = new RegExp(`^${flat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(-\\d+)?$`);
	const out = [];
	for (const stampName of stamps.sort().reverse()) {
		const dir = join(BACKUP_DIR, stampName);
		let names;
		try {
			names = readdirSync(dir).filter((name) => pattern.test(name));
		} catch {
			continue;
		}
		for (const name of names) {
			const candidate = join(dir, name);
			const info = statSync(candidate);
			out.push({ backup: candidate, stamp: stampName + "/" + name, size: info.size, mtime: info.mtimeMs });
		}
	}
	return out;
}

/**
 * Copy one backup back over `path`. The backup must belong to that exact path,
 * and the result is read back and compared before the call reports success.
 */
export function restoreFromBackup(path, backup) {
	if (!existsSync(backup)) return { ok: false, reason: "backup-missing" };
	if (!resolve(backup).startsWith(resolve(BACKUP_DIR) + sep)) return { ok: false, reason: "backup-outside-store" };
	if (!new RegExp(`^${flatOf(path).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(-\\d+)?$`).test(basename(backup))) return { ok: false, reason: "backup-not-for-this-path" };
	const before = existsSync(path) ? readFileSync(path).toString("base64") : undefined;
	const desired = readFileSync(backup);
	const saved = backupFile(path);
	writeFileSync(path, desired);
	const now = readFileSync(path);
	cache = undefined;
	return {
		ok: Buffer.compare(now, desired) === 0,
		restored: path,
		replacedBackup: saved,
		previous: before === undefined ? "was-absent" : "was-present",
		readback: Buffer.compare(now, desired) === 0 ? "matches-backup" : "differs"
	};
}

/** Move one output into the plugin backups tree (the only delete this plugin performs). */
export function retireOutput(path) {
	if (!existsSync(path)) return { ok: false, reason: "not-found" };
	const backup = backupFile(path);
	if (!backup) return { ok: false, reason: "backup-failed" };
	const retired = `${path}.retired-${Date.now()}`;
	renameSync(path, retired);
	cache = undefined;
	return { ok: true, backup, retired, readback: existsSync(path) ? "still-present" : "gone" };
}
