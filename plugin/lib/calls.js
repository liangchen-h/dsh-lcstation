/**
 * Calls view data: what this machine can actually invoke.
 *
 * Four groups, each read from the live subsystem rather than from a config file
 * we hand-edit:
 *   skills      -> ctx.get("skills")  (the Harness skill registry)
 *   plugins     -> ctx.get("pluginManager")  (the plugin manager owns enable/disable)
 *   programs    -> PATH + a small registry of extra entries this plugin keeps
 *   ws-tools    -> <ws>/cap/tool/*.md  (the Workstation tool catalog)
 *
 * Every mutating helper returns a `readback` taken AFTER the write, so the UI can
 * show "changed" versus "only displayed" instead of trusting the request.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, renameSync, statSync, mkdirSync } from "node:fs";
import { join, extname, WS_HOME, STATE_DIR, backupFile, readText, fileInfo } from "./paths.js";

/** Extra program entries the user registered through this plugin. */
const PROGRAMS_REGISTRY = join(STATE_DIR, "programs.json");
/** PATH scan cache (milliseconds). */
const PATH_CACHE_MS = 60_000;
let pathCache;

/** Read the extra-program registry. */
function readProgramRegistry() {
	try {
		const parsed = JSON.parse(readFileSync(PROGRAMS_REGISTRY, "utf8"));
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/** Persist the extra-program registry (backup first). */
function writeProgramRegistry(rows) {
	mkdirSync(STATE_DIR, { recursive: true });
	if (existsSync(PROGRAMS_REGISTRY)) backupFile(PROGRAMS_REGISTRY);
	writeFileSync(PROGRAMS_REGISTRY, JSON.stringify(rows, null, 2), "utf8");
	return JSON.parse(readFileSync(PROGRAMS_REGISTRY, "utf8"));
}

/** Scan PATH for runnable programs, cached for a minute. */
export function scanPrograms() {
	const now = Date.now();
	if (pathCache !== undefined && now - pathCache.at < PATH_CACHE_MS) return pathCache.rows;
	const exts = (process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.PS1").split(";").filter((e) => e !== "").map((e) => e.toLowerCase());
	const rows = [];
	const seen = new Set();
	for (const dir of (process.env.PATH ?? "").split(";")) {
		if (dir === "" || !existsSync(dir)) continue;
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			const ext = extname(entry.name).toLowerCase();
			if (!exts.includes(ext)) continue;
			const stem = entry.name.slice(0, entry.name.length - ext.length).toLowerCase();
			if (seen.has(stem)) continue;
			seen.add(stem);
			rows.push({ id: stem, name: stem, ext, path: join(dir, entry.name), source: "PATH" });
		}
	}
	rows.sort((a, b) => a.name.localeCompare(b.name));
	pathCache = { at: now, rows };
	return rows;
}

/** The Workstation `cap/tool` catalog. */
export function listWsTools() {
	const dir = join(WS_HOME, "cap", "tool");
	if (!existsSync(dir)) return [];
	let entries;
	try {
		entries = readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	return entries
		.filter((e) => e.isFile())
		.map((e) => {
			const path = join(dir, e.name);
			const disabled = e.name.endsWith(".disabled");
			const base = disabled ? e.name.slice(0, -".disabled".length) : e.name;
			const info = fileInfo(path);
			const text = readText(path) ?? "";
			const firstLine = (text.split(/\r?\n/).find((l) => l.trim() !== "") ?? "").trim();
			return {
				id: base,
				name: base.replace(/\.md$/i, ""),
				path,
				disabled,
				size: info?.size ?? 0,
				mtime: info?.mtime ?? 0,
				summary: firstLine.slice(0, 160),
				chars: text.length
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

/** Enable/disable one `cap/tool` entry by renaming its file (reversible). */
export function setWsToolEnabled(name, enabled) {
	const dir = join(WS_HOME, "cap", "tool");
	const active = join(dir, name);
	const off = join(dir, `${name}.disabled`);
	const from = enabled ? off : active;
	const to = enabled ? active : off;
	if (!existsSync(from)) return { ok: false, reason: "not-found", from };
	backupFile(from);
	renameSync(from, to);
	// Read back: the catalog after the rename is the only proof that counts.
	const after = listWsTools().find((row) => row.name === name || row.id === name);
	return { ok: true, readback: after !== undefined ? { name: after.name, disabled: after.disabled } : { missing: true } };
}

/** Delete one `cap/tool` entry by moving it into the plugin backups tree. */
export function deleteWsTool(name) {
	const dir = join(WS_HOME, "cap", "tool");
	const candidates = [join(dir, name), join(dir, `${name}.disabled`)];
	const found = candidates.find((p) => existsSync(p));
	if (found === undefined) return { ok: false, reason: "not-found" };
	const backup = backupFile(found);
	renameSync(found, `${found}.deleted-${Date.now()}`);
	const readback = listWsTools().find((row) => row.name === name || row.id === name);
	return { ok: true, backup, readback: readback ?? "gone" };
}

/** Create a new `cap/tool` entry. */
export function addWsTool(name, body) {
	const dir = join(WS_HOME, "cap", "tool");
	mkdirSync(dir, { recursive: true });
	const safe = String(name ?? "").replace(/[\\/:*?"<>|]/g, "_").trim();
	if (safe === "") return { ok: false, reason: "empty-name" };
	const path = join(dir, safe.endsWith(".md") ? safe : `${safe}.md`);
	if (existsSync(path)) return { ok: false, reason: "exists", path };
	writeFileSync(path, String(body ?? `# ${safe}\n`), "utf8");
	const readback = listWsTools().find((row) => row.path === path);
	return { ok: true, path, readback: readback !== undefined ? { name: readback.name, size: readback.size } : "missing" };
}

/** Add/remove an extra program entry (a name -> path registration). */
export function upsertProgram(entry) {
	const rows = readProgramRegistry();
	const id = String(entry?.id ?? entry?.name ?? "").trim();
	const path = String(entry?.path ?? "").trim();
	if (id === "" || path === "") return { ok: false, reason: "empty" };
	const next = rows.filter((row) => row.id !== id);
	if (!entry.remove) next.push({ id, name: entry.name ?? id, path, source: "registered", note: entry.note ?? "" });
	const readback = writeProgramRegistry(next);
	return { ok: true, readback: readback.find((row) => row.id === id) ?? "removed" };
}

/**
 * Read the skill registry.
 * @param skills - the `skills` service, or undefined.
 */
export async function listSkills(skills) {
	if (skills === undefined) return { available: false, rows: [] };
	try {
		const rows = await skills.list();
		return {
			available: true,
			rows: (rows ?? []).map((row) => ({
				id: row.name ?? row.id,
				name: row.name ?? row.id,
				description: row.description ?? "",
				source: row.source ?? row.layer ?? "",
				path: row.path ?? row.directory ?? "",
				enabled: true
			}))
		};
	} catch (error) {
		return { available: false, rows: [], error: error instanceof Error ? error.message : String(error) };
	}
}

/**
 * Read the plugin/bundle inventory the plugin manager owns.
 *
 * `listPlugins()` rows are keyed by `entryId` (that is the id `setPluginEnabled`
 * matches on) and carry `moduleName` as the human-readable package; a row with a
 * `readOnlyReason` is NOT toggleable (`management-required` / `unaddressable`) and
 * the UI must say so instead of pretending the switch would work.
 */
export async function listPlugins(pluginManager) {
	if (pluginManager === undefined) return { available: false, plugins: [], bundles: [] };
	try {
		const [plugins, bundles] = await Promise.all([
			pluginManager.listPlugins(),
			Promise.resolve(pluginManager.listBundles())
		]);
		return {
			available: true,
			plugins: (plugins ?? []).map((row) => ({
				id: row.entryId ?? row.id ?? row.moduleName,
				name: row.moduleName ?? row.packageName ?? row.name ?? row.entryId,
				entryId: row.entryId ?? row.id,
				version: row.version ?? "",
				enabled: row.enabled !== false,
				source: row.kind ?? row.source ?? "",
				...(row.readOnlyReason === undefined ? {} : { readOnlyReason: row.readOnlyReason })
			})),
			bundles: (bundles ?? []).map((row) => ({
				name: row.name,
				version: row.version ?? "",
				installed: row.installed !== false,
				enabled: row.enabled !== false
			}))
		};
	} catch (error) {
		return { available: false, plugins: [], bundles: [], error: error instanceof Error ? error.message : String(error) };
	}
}

/** Toggle a plugin or bundle through the plugin manager, then read back. */
export async function togglePlugin(pluginManager, { kind, id, enabled }) {
	if (pluginManager === undefined) return { ok: false, reason: "no-plugin-manager" };
	try {
		if (kind === "bundle") await pluginManager.setBundleEnabled(id, !!enabled);
		else await pluginManager.setPluginEnabled(id, !!enabled);
	} catch (error) {
		return { ok: false, reason: error instanceof Error ? error.message : String(error) };
	}
	const after = await listPlugins(pluginManager);
	const row = kind === "bundle" ? after.bundles.find((b) => b.name === id) : after.plugins.find((p) => p.id === id || p.entryId === id);
	return { ok: true, requested: !!enabled, readback: row ?? "not-found", verified: row !== undefined && row.enabled === !!enabled };
}
