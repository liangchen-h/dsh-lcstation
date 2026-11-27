/* 任务链归属：规则判不了的地方交给模型判。
 *
 * 两种时机：
 *  1) 第一次用工作站（这个会话没有判定缓存）→ 把历史里所有用户输入一次性交给模型，整体切链；
 *  2) 之后每出现新的一轮 → 只把这一轮的输入 + 现有链的摘要交给模型，判它接哪条链（或另起一条）。
 *
 * 只做一件事：把「第 N 轮」归到哪条链。不生成卡片、不总结对话内容。
 * 结果落盘在 RUNTIME_DIR/chains-<session>.json，同一条轮次不会重复问模型。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { RUNTIME_DIR } from "./paths.js";

const ENDPOINT = process.env.LC_CHAIN_ENDPOINT ?? "https://api.deepseek.com/chat/completions";
const MODEL = process.env.LC_CHAIN_MODEL ?? "deepseek-chat";
const TIMEOUT_MS = Number(process.env.LC_CHAIN_TIMEOUT ?? 45000);

function cacheFile(sessionId) {
	return join(RUNTIME_DIR, `chains-${String(sessionId).replace(/[^\w.-]/g, "_")}.json`);
}

function apiKey() {
	if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
	const candidates = [join(homedir(), ".dsh", ".credentials.yaml"), join(homedir(), ".dsh", ".credentials.yml")];
	for (const file of candidates) {
		if (!existsSync(file)) continue;
		try {
			const text = readFileSync(file, "utf8");
			const hit = text.match(/^\s*DEEPSEEK_API_KEY:\s*(\S+)\s*$/m);
			if (hit) return hit[1].replace(/^["']|["']$/g, "");
		} catch (error) {
			/* 读不到就继续找下一个 */
		}
	}
	return undefined;
}

async function ask(prompt, key) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(ENDPOINT, {
			method: "POST",
			headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
			body: JSON.stringify({
				model: MODEL,
				temperature: 0,
				max_tokens: 1200,
				response_format: { type: "json_object" },
				messages: [
					{ role: "system", content: "你只做一件事：判断几段用户输入是不是同一件事。只输出 JSON，不要解释。" },
					{ role: "user", content: prompt }
				]
			}),
			signal: controller.signal
		});
		if (!res.ok) return { ok: false, reason: `http-${res.status}` };
		const body = await res.json();
		const text = body?.choices?.[0]?.message?.content ?? "";
		return { ok: true, text };
	} catch (error) {
		return { ok: false, reason: error?.name === "AbortError" ? "timeout" : "network" };
	} finally {
		clearTimeout(timer);
	}
}

function parseJson(text) {
	try {
		return JSON.parse(text);
	} catch (error) {
		const hit = String(text).match(/\{[\s\S]*\}/);
		if (hit === null) return undefined;
		try {
			return JSON.parse(hit[0]);
		} catch (error2) {
			return undefined;
		}
	}
}

function gistOf(text, limit = 70) {
	const clean = String(text ?? "").replace(/\s+/g, " ").trim();
	return clean.length > limit ? clean.slice(0, limit) + "…" : clean;
}

/** 全量：一次问完，把历史切成若干条链。 */
async function fullPass(userTexts, key) {
	const lines = userTexts.map(({ band, text }) => `第${band}轮：${gistOf(text, 140)}`).join("\n");
	const prompt = [
		"下面是同一段对话里用户每次输入的摘要（按轮次）。请把「在做同一件事」的轮次归成一条链。",
		"判据只看对象：处理的是同一个页面/同一个功能/同一个 bug/同一批文件，才算同一件事。",
		"规则：",
		"- 对象换了就另起一条链。话题从 A 功能跳到 B 功能、从改代码跳到查环境问题，都是两条链。",
		"- 语气词不是判据：「顺便」「好了」「再」「另外」「继续」都不代表同一件事，要看它们后面处理的是什么对象。",
		"- 收尾、追问、纠错属于它上一轮所在的那条链：例如「把刚才那些临时文件删了」「这个分配不对」应当接上一轮那条链。",
		"- 一条链里的轮次不必连续（用户可能回头补前面的事），但同一条链内部按轮次先后排列。",
		"- 每轮必须且只能归到一条链里。",
		"- 「清理/删除/收拾/确认上一轮留下的东西」本身没有处理对象，必须跟着上一轮那条链走，不允许单独成链。",
		'输出 JSON：{"groups":[{"name":"这条链在做什么(不超过14字)","turns":[轮次数字…],"why":"这条链共同的处理对象是什么；把某一轮并进来是因为它和哪一轮是同一件事"}], …}',
		"先想清楚每条链共同处理的「对象」，再决定哪些轮次属于它；「why」要写具体。",
		"",
		lines
	].join("\n");
	const reply = await ask(prompt, key);
	if (!reply.ok) return { ok: false, reason: reply.reason };
	const parsed = parseJson(reply.text);
	if (parsed === undefined || !Array.isArray(parsed.groups)) return { ok: false, reason: "bad-json" };
	return { ok: true, groups: parsed.groups };
}

/** 增量：只判这一轮接哪条链。prevChainId / prevText = 上一轮所在的链与它说的话（最强线索）。 */
async function judgeOne(userTexts, chains, key, prevChainId, prevText) {
	const list = chains
		.map((chain) => {
			const head = `链${chain.id}｜${chain.name === undefined || chain.name === "" ? "（未命名）" : chain.name}｜共${chain.turns.length}轮`;
			const samples = (chain.samples ?? []).map((s) => `第${s.band}轮：${s.text}`).join(" ／ ");
			return samples === "" ? head : `${head}\n    这条链覆盖：${samples}`;
		})
		.join("\n");
	const current = userTexts[userTexts.length - 1];
	const prevLine =
		prevChainId === undefined || prevChainId === null
			? "这一轮之前还没有判定过任何轮次。"
			: `上一轮（第${current.band - 1}轮）属于链${prevChainId}，用户上一轮说的是：${gistOf(prevText ?? "", 120)}`;
	const prompt = [
		"这是一段对话里现有的任务链（每条链在做什么、覆盖了哪些轮次）：",
		list || "（还没有任何链）",
		"",
		prevLine,
		`用户最新一轮（第${current.band}轮）说：${gistOf(current.text, 200)}`,
		"",
		"判断这一轮应该接到哪条链上。",
		"判据只看处理的对象（哪个页面/哪个功能/哪个 bug/哪批文件）：对象和某条链里已有的轮次相同 → 接那条链；对象是新的 → 新开一条链。",
		"「顺便」「好了」「再」「那么」这类语气词不改变对象：不要因为语气像收尾就把新对象塞进旧链，也不要因为语气就把同一件事另开一条链。",
		"如果这一轮没有提出新的处理对象，只是在善后上一轮的结果（删掉上一轮留下的临时文件、清理、确认、就此收尾），接上一轮那条链。",
		"如果这一轮是在给上一轮追问或纠错，也属于上一轮那条链。",
		'只输出 JSON：{"chain": 链号}，新开一条链就输出 {"chain": 0}。'
	].join("\n");
	const reply = await ask(prompt, key);
	if (!reply.ok) return { ok: false, reason: reply.reason };
	const parsed = parseJson(reply.text);
	const id = Number(parsed?.chain);
	if (!Number.isFinite(id) || id < 0) return { ok: false, reason: "bad-json" };
	return { ok: true, chain: id };
}

export function loadChains(sessionId) {
	const file = cacheFile(sessionId);
	if (!existsSync(file)) return undefined;
	try {
		const parsed = JSON.parse(readFileSync(file, "utf8"));
		if (parsed === null || typeof parsed !== "object") return undefined;
		return parsed;
	} catch (error) {
		return undefined;
	}
}

function saveChains(sessionId, data) {
	try {
		mkdirSync(RUNTIME_DIR, { recursive: true });
		writeFileSync(cacheFile(sessionId), JSON.stringify(data), "utf8");
	} catch (error) {
		/* 写不下就算了，本次进程内仍在内存里 */
	}
}

function chainListFrom(bands, userTexts, names) {
	const byChain = new Map();
	const textOf = new Map(userTexts.map((u) => [u.band, u.text]));
	for (const band of [...new Set(Object.keys(bands).map(Number))].sort((a, b) => a - b)) {
		const id = bands[band];
		if (!byChain.has(id)) byChain.set(id, []);
		byChain.get(id).push(band);
	}
	return [...byChain.keys()]
		.sort((a, b) => a - b)
		.map((id) => {
			const turns = byChain.get(id);
			return {
				id,
				turns,
				name: names?.[id],
				first: textOf.get(turns[0]) ?? "",
				last: textOf.get(turns[turns.length - 1]) ?? "",
				// 每轮一条短摘要（只留最近 4 轮）：让模型看到「这条链到底覆盖了哪些事」，
				// 而不是只靠 first/last 猜。
				samples: turns.slice(-4).map((band) => ({ band, text: gistOf(textOf.get(band) ?? "") }))
			};
		});
}

/**
 * 保证这个会话的链归属是最新的。
 * userTexts: [{band, text}]（按 band 升序，只含用户消息）
 * 返回 { bands, chains, source, error }
 */
export async function ensureChains(sessionId, userTexts, options = {}) {
	const bands = userTexts.map((u) => u.band);
	if (bands.length === 0) return { bands: {}, chains: [], source: "empty" };
	const maxBand = bands[bands.length - 1];
	const cached = options.force === true ? undefined : loadChains(sessionId);
	const key = apiKey();
	if (key === undefined) return { bands: cached?.bands ?? {}, chains: [], source: "no-key", error: "missing-api-key" };

	if (cached !== undefined && cached.lastBand >= maxBand) {
		return { bands: cached.bands, chains: chainListFrom(cached.bands, userTexts, cached.names), source: "cache" };
	}

	// 第一次用：全量切
	if (cached === undefined) {
		const result = await fullPass(userTexts, key);
		if (!result.ok) return { bands: {}, chains: [], source: "ai-failed", error: result.reason };
		// groups 的顺序就是链号：重新按顺序编号，避免模型给出重复 id
		const textAt = (band) => userTexts.find((u) => u.band === band)?.text;
		const ordered = {};
		for (const band of bands) ordered[band] = undefined;
		let chainId = 0;
		const orderedNames = {};
		for (const group of result.groups) {
			const turns = (Array.isArray(group?.turns) ? group.turns : []).map((n) => Number(n)).filter((n) => bands.includes(n));
			if (turns.length === 0) continue;
			chainId += 1;
			if (group?.name) orderedNames[chainId] = String(group.name).slice(0, 20);
			else orderedNames[chainId] = gistOf(textAt(turns[0]) ?? "", 14);
			for (const band of turns) ordered[band] = chainId;
		}
		// 模型漏掉的轮次：跟随前一个已判定轮次的链（开头就漏的直接进链 1）。
		let lastId = 1;
		for (const band of bands) {
			if (ordered[band] === undefined) ordered[band] = lastId;
			else lastId = ordered[band];
		}
		const data = { version: 1, bands: ordered, names: orderedNames, lastBand: maxBand };
		saveChains(sessionId, data);
		return { bands: ordered, chains: chainListFrom(ordered, userTexts, orderedNames), source: "ai-full" };
	}

	// 之后：只判新出现的轮次
	const next = { ...cached, bands: { ...cached.bands }, names: { ...(cached.names ?? {}) } };
	const fresh = userTexts.filter((u) => u.band > (cached.lastBand ?? 0));
	for (const item of fresh) {
		const chainsNow = chainListFrom(next.bands, userTexts, next.names);
		// 上一轮是谁的链：模型判「收尾/追问算同一条」时最靠得住的线索。
		const prevBand = Object.keys(next.bands)
			.map(Number)
			.filter((band) => Number.isFinite(band) && band < item.band)
			.sort((a, b) => b - a)[0];
		const prevChainId = prevBand === undefined ? undefined : next.bands[prevBand];
		const prevText = prevBand === undefined ? "" : (userTexts.find((u) => u.band === prevBand)?.text ?? "");
		const verdict = await judgeOne([item], chainsNow, key, prevChainId, prevText);
		if (!verdict.ok) return { bands: next.bands, chains: chainsNow, source: "ai-failed", error: verdict.reason };
		const known = new Set(chainsNow.map((c) => c.id));
		const freshId = chainsNow.length === 0 ? 1 : Math.max(...chainsNow.map((c) => c.id)) + 1;
		// 模型点了一个不存在的链号时不要造空洞链，直接新开一条。
		const id = verdict.chain === 0 || !known.has(verdict.chain) ? freshId : verdict.chain;
		next.bands[item.band] = id;
		next.lastBand = item.band;
		// 新链没名字时用这一轮的话兜名字，画布上不至于只剩「任务链 3」。
		if (next.names[id] === undefined || next.names[id] === "") next.names[id] = gistOf(item.text, 14);
	}
	saveChains(sessionId, next);
	return { bands: next.bands, chains: chainListFrom(next.bands, userTexts, next.names), source: "ai-incremental" };
}
