/* 最终产出的一句交付说明：整段对话读完，说清"做成了什么"。
 *
 * 只在结束标记出现时触发一次；结果按「标记次数 + 最后一次标记时间」落盘缓存，
 * 面板轮询命中缓存就不再问模型。模型不可用时上游会退回本地摘要，不影响面板。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { RUNTIME_DIR } from "./paths.js";

const ENDPOINT = process.env.LC_CHAIN_ENDPOINT ?? "https://api.deepseek.com/chat/completions";
const MODEL = process.env.LC_CHAIN_MODEL ?? "deepseek-chat";
const TIMEOUT_MS = Number(process.env.LC_SUMMARY_TIMEOUT ?? 40000);
const MAX_INPUT_CHARS = 6000;

const inFlight = new Map();

function cacheFile(sessionId) {
	return join(RUNTIME_DIR, `final-${String(sessionId).replace(/[^\w.-]/g, "_")}.json`);
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
			/* 下一个候选文件 */
		}
	}
	return undefined;
}

function clip(text, limit) {
	const value = String(text ?? "").replace(/\s+/g, " ").trim();
	return value.length > limit ? value.slice(0, limit) + "…" : value;
}

/** Compact transcript: what the user asked each turn, and the first line of what came back. */
export function transcriptOf(cards) {
	const lines = [];
	for (const card of cards ?? []) {
		if (card.kind === "msg-user") lines.push(`第 ${card.band} 轮 用户：${clip(card.text, 200)}`);
		else if (card.kind === "msg-ai") lines.push(`　　　　助手：${clip(card.text, 160)}`);
	}
	let text = lines.join("\n");
	if (text.length > MAX_INPUT_CHARS) text = text.slice(text.length - MAX_INPUT_CHARS);
	return text;
}

export function summaryKey(marks, lastBand) {
	const last = marks[marks.length - 1];
	return `${marks.length}:${last?.at ?? 0}:${lastBand}`;
}

/** Cached one-liner for this marker state, if it was already generated. */
export function readSummary(sessionId, key) {
	const file = cacheFile(sessionId);
	if (!existsSync(file)) return undefined;
	try {
		const parsed = JSON.parse(readFileSync(file, "utf8"));
		if (parsed?.key !== key || typeof parsed.text !== "string" || parsed.text.trim() === "") return undefined;
		return parsed.text.trim();
	} catch (error) {
		return undefined;
	}
}

/** Fire-and-forget: asks the model once per marker state and caches the answer. */
export function ensureSummary(sessionId, key, transcript) {
	if (inFlight.has(sessionId)) return;
	const readable = apiKey();
	if (readable === undefined) return;
	inFlight.set(sessionId, true);
	(async () => {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
		try {
			const res = await fetch(ENDPOINT, {
				method: "POST",
				headers: { "content-type": "application/json", authorization: `Bearer ${readable}` },
				body: JSON.stringify({
					model: MODEL,
					temperature: 0,
					max_tokens: 120,
					messages: [
						{
							role: "system",
							content:
								"你在填一个「最终产出」面板的说明行。读完整个对话，用一句中文说清这次到底做成了什么：做出来的东西就写它是什么，修的问题就写修好了什么。不超过 60 字，不加引号、不加编号、不罗列过程、不写「本次对话」这类开场。"
						},
						{ role: "user", content: `对话如下：\n${transcript}` }
					]
				}),
				signal: controller.signal
			});
			if (!res.ok) return;
			const body = await res.json();
			const raw = String(body?.choices?.[0]?.message?.content ?? "").trim();
			const text = raw.replace(/^["「『]|["」』]$/g, "").replace(/\s+/g, " ").trim();
			if (text === "") return;
			writeFileSync(cacheFile(sessionId), JSON.stringify({ key, text, at: Date.now() }, null, 1));
		} catch (error) {
			/* 失败就不缓存，下次标记再试 */
		} finally {
			clearTimeout(timer);
			inFlight.delete(sessionId);
		}
	})();
}
