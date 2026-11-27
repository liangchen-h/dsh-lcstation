// 把实际部署的插件源码同步进本仓库的 plugin/ 目录。
// 真源默认是 DSH profile 里的本地插件目录（$DSH_HOME/profiles/<profile>/local/lc-station），
// 可用 LC_SRC 覆盖；本仓库只保存可提交的副本。
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const profile = process.env.DSH_PROFILE ?? "desktop";
const SRC = process.env.LC_SRC ?? join(homedir(), ".dsh", "profiles", profile, "local", "lc-station");
const DST = new URL("../plugin/", import.meta.url).pathname.replace(/^\//, "");

if (!existsSync(SRC)) {
	console.error(`源目录不存在: ${SRC}`);
	process.exit(1);
}
mkdirSync(join(DST, "lib"), { recursive: true });

const files = [
	...["package.json", "cordis.patch.yml"].map((name) => [join(SRC, name), join(DST, name)]),
	...readdirSync(join(SRC, "lib"))
		.filter((name) => name.endsWith(".js"))
		.map((name) => [join(SRC, "lib", name), join(DST, "lib", name)]),
];

let copied = 0;
let same = 0;
for (const [from, to] of files) {
	const before = existsSync(to) ? readFileSync(to) : undefined;
	const after = readFileSync(from);
	if (before !== undefined && Buffer.compare(before, after) === 0) {
		same += 1;
		continue;
	}
	copyFileSync(from, to);
	copied += 1;
	console.log(`更新 ${to.split(/[\\/]/).pop()} (${after.length} B)`);
}

const total = files.reduce((sum, [from]) => sum + statSync(from).size, 0);
console.log(`同步完成：变更 ${copied} 个，未变 ${same} 个，源码合计 ${(total / 1024).toFixed(0)} KB`);
