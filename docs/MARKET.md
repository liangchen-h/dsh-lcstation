# 上架到 DSH 市场

DSH 的插件市场（`dshmarket` / `dsh-community-market`）不读本仓库，它每次打开都实时拉一份索引：

- 官方精选列表：<https://awesome-dsh-plugin.com/plugins.json>（由 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 的 CI 每日从列表生成）
- 结构遵循 `@deepseek-ai/dsh-plugin-market-index` 的 **format 1**

所以有两条路，互不冲突，可以都走。

---

## 路线 A：进官方精选列表（推荐，一次 PR，约一天生效）

注意：那个仓库是**列表**，不是市场应用本身；别往 `dsh-market/dsh-market` 提条目。

1. Fork 并打开 <https://github.com/awesome-dsh-plugin/awesome-dsh-plugin>
2. 在列表里按字母序加一条（Markdown 一行，与相邻条目同格式）
3. 提 PR，标题形如 `Add lc-station`

可直接粘贴的条目：

```markdown
- [lc-station](https://github.com/liangchen-h/lc-station) - DSH 工作站：把会话事件流折成卡片链画布，另有记忆 / 调用 / 产出三视图；界面中英双语，不占对话模型的调用预算。
```

英文版（如果列表只收英文描述）：

```markdown
- [lc-station](https://github.com/liangchen-h/lc-station) - DSH workstation: folds the session event stream into a card-chain canvas, with memory / calls / outputs views and a bilingual (zh / en) UI. No model calls on the chat path.
```

PR 描述里可以写：

> Adds `lc-station` (MIT, public repo). Ships a Cordis bundle patch, mounts a Workstation page plus a session-scoped right pane. Bilingual UI, `Final output` panel summarized once per session. Install: `pnpm dsh plugin add` → pick from market, or `DSH_PROFILE=desktop node scripts/sync-plugin.mjs` for local development.

收录后市场会自动给出「安装」按钮（走 `npm` 或 `git+https` + 固定 commit，取决于索引里该版本的 `source`）。

---

## 路线 B：自托管索引（现在就能用，不必等上架）

本仓库带了一份符合 format 1 的索引：[`market/plugins.json`](../market/plugins.json)。把它放到任何能通过 HTTP 访问的位置，然后让 DSH 指向它：

```sh
DSHM_REGISTRY_URL=https://your-host.example/lc-station/plugins.json dsh web
```

也可以把文件原样托管在对象存储、内网静态站点，或 `python -m http.server` 起个临时服务。

索引里的 `source` 是 `git` 类型，所以安装时 pnpm 会拿 `git+https://github.com/liangchen-h/lc-station.git#<commit>&path:/plugin` —— 固定到具体 commit，不会悄悄跟着 `main` 漂移。

想要发新版本时：

1. 改 `plugin/package.json` 的 `version`
2. `git commit`，取 `git rev-parse HEAD` 的 40 位 SHA
3. 把新版本条目写进 `market/plugins.json` 的 `versions` 数组（`version` / `publishTimestamp` / `source.commit`）
4. 提交并推送索引

索引也可以只列版本、不带 `title` / `description` —— 市场和 DSH 会回落到包自身的清单字段。

---

## 发布 npm 版（可选）

如果要让索引用 `{"type":"npm"}` 代替 git：

```sh
cd plugin
npm publish --access public
```

`plugin/package.json` 已带 `files`、`exports`、`dsh.bundle.patch`、`dsh.client`，`npm publish` 出来的包可直接被市场按 `lc-station@<version>` 安装。之后把索引里的 `source` 改成：

```json
{ "type": "npm", "registry": "https://registry.npmjs.org" }
```

---

## 校验索引

改完 `market/plugins.json` 后先用 DSH 自带的校验器跑一遍，避免市场端解析失败：

```sh
node -e "
const { parseMarketIndex } = await import('file:///D:/tools/DSH-NEXT/resources/app/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js');
const fs = await import('node:fs');
const doc = JSON.parse(fs.readFileSync('market/plugins.json', 'utf8'));
const out = parseMarketIndex(doc, 'https://example.com/plugins.json');
console.log('ok', out.plugins.length, out.plugins[0].versions.map(v => v.version));
" --input-type=module
```

（路径按本机 DSH 安装位置调整；报 `MarketIndexError` 时 `path` 会直接指出哪个字段不对。）
