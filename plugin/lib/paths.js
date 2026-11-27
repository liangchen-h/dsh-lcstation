/**
 * Shared paths + small file helpers for lc-station.
 *
 * Everything the plugin touches lives under the user's DSH home or the
 * Workstation workspace; nothing outside those two roots is read or written.
 */
import { existsSync, mkdirSync, copyFileSync, readFileSync, statSync, readdirSync } from "node:fs";
import { join, dirname, basename, extname, sep } from "node:path";
import { homedir } from "node:os";

/** Absolute DSH home (`~/.dsh` unless the Host was started with DSH_HOME). */
export const DSH_HOME = process.env.DSH_HOME && process.env.DSH_HOME !== "" ? process.env.DSH_HOME : join(homedir(), ".dsh");

/** The Workstation workspace shipped beside the old GUI app. */
export const WS_HOME = join(DSH_HOME, "ws");

/** Where this plugin keeps its own backups, runtime artifacts and state overlays. */
export const PLUGIN_HOME = join(homedir(), "Desktop", "work", "lc-plugin");
export const BACKUP_DIR = join(PLUGIN_HOME, "backups");
export const RUNTIME_DIR = join(PLUGIN_HOME, ".runtime");
export const STATE_DIR = join(PLUGIN_HOME, "state");

/** Files treated as cross-conversation memory (editable in the memory view). */
export function memoryFiles() {
	return [
		{ id: "agents-md", label: "AGENTS.md（全局指令）", path: join(DSH_HOME, "AGENTS.md") },
		{ id: "prompt-inject", label: "prompt-inject.md（注入片段）", path: join(DSH_HOME, "prompt-inject.md") },
		...listTextFiles(join(WS_HOME, "mem")).map((p) => ({
			id: `ws-mem:${p.slice(WS_HOME.length + 1)}`,
			label: `Workstation mem/${p.slice(join(WS_HOME, "mem").length + 1)}`,
			path: p
		})),
		{ id: "ws-settings", label: "Workstation .settings.json", path: join(WS_HOME, ".settings.json") },
		{ id: "ws-index", label: "Workstation INDEX.md", path: join(WS_HOME, "INDEX.md") }
	];
}

/** Directories scanned by the outputs view. */
export function outputRoots() {
	return [
		{ id: "ws-work", label: "Workstation work/", path: join(WS_HOME, "work") },
		{ id: "ws-canvas", label: "Workstation canvas/", path: join(WS_HOME, "canvas") },
		{ id: "desktop-work", label: "Desktop/work", path: join(homedir(), "Desktop", "work") },
		{ id: "dsh-tools-state", label: "dsh-tools state/", path: join(homedir(), "Desktop", "work", "dsh-tools", "state") }
	];
}

/** Recursively list regular text files below a directory, depth-limited. */
export function listTextFiles(root, depth = 3, out = []) {
	if (!existsSync(root) || depth < 0) return out;
	let entries;
	try {
		entries = readdirSync(root, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		if (entry.name.startsWith(".") && entry.name !== ".settings.json") continue;
		const full = join(root, entry.name);
		if (entry.isDirectory()) {
			if (depth > 0) listTextFiles(full, depth - 1, out);
			continue;
		}
		if (!entry.isFile()) continue;
		const ext = extname(entry.name).toLowerCase();
		if ([".md", ".txt", ".json", ".yml", ".yaml", ".ps1", ".mjs"].includes(ext) || entry.name === ".settings.json") out.push(full);
	}
	return out;
}

/** Read a UTF-8 text file, or `undefined` when it is missing. */
export function readText(path) {
	try {
		return readFileSync(path, "utf8");
	} catch {
		return undefined;
	}
}

/** Timestamp folder name shared by one logical operation's backups. */
export function stamp() {
	const d = new Date();
	const p = (n, w = 2) => String(n).padStart(w, "0");
	return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

/**
 * Copy `path` into `<backups>/<stamp>/<flat name>` before it is modified.
 * @returns the backup path, or `undefined` when the source does not exist.
 */
export function backupFile(path, dir = join(BACKUP_DIR, stamp())) {
	if (!existsSync(path)) return undefined;
	mkdirSync(dir, { recursive: true });
	const flat = path.replace(/^[A-Za-z]:/, "").replace(/[\\/:]/g, "_");
	let target = join(dir, flat);
	for (let n = 2; existsSync(target); n += 1) target = join(dir, `${flat}-${n}`);
	copyFileSync(path, target);
	return target;
}

/** `stat` in a shape the client can render, or `undefined`. */
export function fileInfo(path) {
	try {
		const s = statSync(path);
		if (!s.isFile()) return undefined;
		return { path, name: basename(path), size: s.size, mtime: s.mtimeMs, dir: dirname(path) };
	} catch {
		return undefined;
	}
}

/** Guard against path traversal: only absolute paths under an allowed root. */
export function underRoots(path, roots) {
	if (typeof path !== "string" || !/^[A-Za-z]:[\\/]/.test(path)) return false;
	const normalized = path.replace(/\//g, sep).toLowerCase();
	return roots.some((root) => normalized === root.toLowerCase() || normalized.startsWith(`${root.toLowerCase()}${sep}`));
}

export { join, dirname, basename, extname, sep, existsSync, mkdirSync, readFileSync, readdirSync, statSync };
