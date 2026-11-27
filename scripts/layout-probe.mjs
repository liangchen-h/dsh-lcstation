/* 用真实卡片数据跑 client.js 里的 buildTurns/layoutTurns，打印顶层几何。
 * 用法：node layout-probe.mjs [cardsFile]（不给就拉 http://127.0.0.1:57702/lc/cards） */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import vm from "node:vm";

const PORT = process.env.DSH_PORT ?? "57702";
const SRC =
	process.env.LC_CLIENT ??
	join(homedir(), ".dsh", "profiles", process.env.DSH_PROFILE ?? "desktop", "local", "lc-station", "lib", "client.js");

async function loadCards() {
	const file = process.argv[2];
	if (file) {
		const parsed = JSON.parse(readFileSync(file, "utf8"));
		return Array.isArray(parsed) ? parsed : parsed.cards;
	}
	const res = await fetch(`http://127.0.0.1:${PORT}/lc/cards?since=-1&revision=0`);
	const body = await res.json();
	return body.cards;
}

/* client.js 是浏览器模块包装，这里给它一个最小宿主，只把想要的函数抠出来。
 * 布局函数在 factory 闭包里，只有靠注入一行导出才够得着 —— 注入只发生在内存里。 */
function boot(source) {
	let factory;
	const window = {
		__ModuleLoader__: { load: (spec) => { factory = spec.factory; } }
	};
	const HARNESS = "window.__probe = { buildTurns, layoutTurns, layoutChain, groupChildren, buildTurn, miniLayout };\n\t\t";
	const patched = source.replace("exports.apply = apply;", "exports.apply = apply;\n\t\t" + HARNESS);
	const sandbox = {
		window,
		document: { createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }), head: { appendChild() {} }, querySelector: () => null },
		React: {
			createElement: (...args) => ({ args }),
			useState: (v) => [v, () => {}],
			useEffect: () => {},
			useRef: (v) => ({ current: v }),
			useMemo: (fn) => fn(),
			useCallback: (fn) => fn,
			memo: (fn) => fn
		},
		console,
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
		fetch
	};
	sandbox.globalThis = sandbox;
	vm.createContext(sandbox);
	vm.runInContext(patched, sandbox);
	factory((name) => {
		if (name === "react") return sandbox.React;
		throw new Error("unexpected require " + name);
	});
	return window.__probe;
}

const cards = await loadCards();
const probe = boot(readFileSync(SRC, "utf8"));
const result = probe.buildTurns === undefined ? (() => { throw new Error("probe missing"); })() : (() => {
	const turns = probe.buildTurns(cards);
	const laid = probe.layoutTurns(turns);
	// 每个组的缩略图：格子数守恒、最多三列、单格不越宽
	const minis = [];
	for (const turn of turns) {
		if (turn.item.kind !== "group") continue;
		const children = probe.groupChildren(turn.item.cards, turn.item.step);
		const mini = probe.miniLayout(children);
		const cols = new Set(mini.rows.map((r) => r.x));
		const overlap = mini.rows.some((a) => mini.rows.some((b) => a !== b && Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1));
		minis.push({ step: String(turn.item.step), children: children.length, cells: mini.rows.length, cols: cols.size, overlap, w: mini.width, h: mini.height, edgesToMissing: mini.edges.filter((e) => !mini.rows.some((r) => r.key === e.a || r.key === e.b)).length });
	}
	return { turns: turns.length, nodes: laid.nodes.length, edges: laid.edges.length, detail: turns.map(t => ({ id: t.id, kind: t.item.kind, size: t.cards.length, items: t.items.length, order: t.items.map(i => i.kind === "card" ? (i.card.kind + "|" + String(i.card.title||i.card.sub||"").slice(0,24)) : ("group:" + i.step + "x" + i.cards.length)) })), boxes: laid.nodes.map(n => ({ key: n.key, x: n.x, y: n.y, w: n.w, h: n.h })), minis };
})();
console.log(JSON.stringify({
	turns: result.turns,
	nodes: result.nodes,
	edges: result.edges,
	detail: result.detail,
	boxes: result.boxes.slice(0, 40),
	minis: result.minis
}, null, 1));
