import { readFileSync, writeFileSync } from "node:fs";

const SRC = process.argv[2];
const src = readFileSync(SRC, "utf8");
const lines = src.split("\n");
const cjk = /[\u4e00-\u9fff]/;
const out = [];
const seen = new Map();

lines.forEach((line, i) => {
  const ln = i + 1;
  if (ln >= 20 && ln <= 300) return; // CSS 段
  const trimmed = line.trimStart();
  if (trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*")) return;
  for (const m of line.matchAll(/"([^"\\\n]{1,80})"/g)) {
    const text = m[1];
    if (!cjk.test(text)) continue;
    const key = `${ln}:${text}`;
    if (seen.has(text)) {
      seen.get(text).push(ln);
      continue;
    }
    seen.set(text, [ln]);
    out.push({ text, lines: [ln] });
  }
});

const report = out.map((e) => `${String(e.lines[0]).padStart(4)}  x${String(seen.get(e.text).length).padStart(2)}  ${e.text}`).join("\n");
writeFileSync(process.argv[3], report + "\n", "utf8");
console.log(JSON.stringify({ unique: out.length, total: [...seen.values()].reduce((n, a) => n + a.length, 0) }));
