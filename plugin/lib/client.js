window.__ModuleLoader__.load({
	id: "lc-station",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const React = require("react");
		const h = React.createElement;

		/* ────────────────────────────── i18n ────────────────────────────── */

		const EN_DICT = {
			"秒前": "s ago",
			"分钟前": "m ago",
			"小时前": "h ago",
			"天前": "d ago",
			"第 ": "Turn ",
			" 轮": "",
			"个动作": " actions",
			"步骤 ": "Step ",
			"展开": "Expand",
			"你说": "You",
			"计划": "Plan",
			"步 ": "Step ",
			"结果": "Result",
			"读": "Read",
			"写": "Write",
			"跑": "Run",
			"联网": "Web",
			"子体": "Sub",
			"工具": "Tool",
			"待办": "Todo",
			"产出": "Outputs",
			"备注": "Note",
			"轮次": "Turn",
			"回复": "Reply",
			"后台": "Job",
			"压缩": "Compact",
			" · 并行 ": " · parallel ",
			" 路": "",
			"组内节点及依赖预览": "Nodes and dependencies in this group",
			"未命名": "Untitled",
			"条目详情": "Item",
			" 项": " items",
			" · 单链": " · single chain",
			"返回上一级": "Back",
			"← 返回": "← Back",
			"内容": "Content",
			"参数": "Args",
			"按住拖动卡片": "Drag to move",
			"⠿  拖动": "⠿  Drag",
			" · 步 ": " · step ",
			"还没有活动会话。开一个对话，这里会实时长出卡片链。": "No active session yet. Start a conversation and the card chain grows here live.",
			"取数失败：": "Fetch failed: ",
			"这个会话暂时没有卡片。": "No cards for this session yet.",
			"从会话历史重建": "Rebuild from history",
			"卡片由插件的规则引擎从 session/event 折叠，不经过模型；已有历史会被直接装回来，不用等新事件。": "Cards are folded from session/event by a rule engine, no model involved. Existing history is loaded straight back, no need to wait for new events.",
			"链 ": "Chain ",
			"任务链 ": "Task chain ",
			"时间线与搜索": "Timeline and search",
			"时间线": "Timeline",
			"搜关键字：命令 / 文件名 / 报错…": "Search: command / file / error…",
			"匹配 ": "Match ",
			" 条": " hits",
			"没有匹配的卡。": "No matching cards.",
			"自适应": "Fit",
			"横向连线 = 骨干：轮次从左往右推进 · 点开进小画布": "Horizontal links = backbone: turns flow left to right · click to open",
			"一块颜色 = 一组，点开在画布里变成小画布": "One color = one group; click to expand into a sub-canvas",
			"拖拽平移 · 滚轮缩放 · 双击自适应": "Drag to pan · wheel to zoom · double-click to fit",
			"共 ": "",
			" 张卡 · ": " cards · ",
			" 轮 · 画面上 ": " turns · on screen ",
			" 块": " groups",
			"（无输出）": "(no output)",
			"运行中…": "Running…",
			"（无回显）": "(no echo)",
			"（还没回报）": "(no report yet)",
			"还没有步骤": "No steps yet",
			"跑程": "Runs",
			"分支 ": "Branch ",
			"串": "seq",
			"并": "par",
			" 轮 · 步 ": " turn · step ",
			"已保存 · 回读一致 ": "Saved · read-back matches ",
			" · 备份 ": " · backup ",
			"保存失败：": "Save failed: ",
			"先勾选要导入的条目": "Select items to import first",
			"已追加 ": "Appended ",
			" 条 · 备份 ": " items · backup ",
			"追加失败：": "Append failed: ",
			"没有改动": "No changes",
			"已写入 ": "Wrote ",
			" 条编辑覆盖": " edited entries",
			"写入失败：": "Write failed: ",
			"加载中…": "Loading…",
			"跨对话记忆": "Cross-session memory",
			"磁盘上的记忆文件": "Memory files on disk",
			"本次注入": "Injected this session",
			"本会话观察到的注入内容": "Content injected in this session",
			"对话中的候选记忆": "Candidates from the conversation",
			"从对话提取的候选，需自行确认": "Extracted from the conversation; confirm before importing",
			"子智能体记录": "Subagent records",
			"实际观察到的调用和回报": "Observed calls and reports",
			"← 返回记忆目录": "← Back to memory",
			"① 跨对话记忆": "1. Cross-session memory",
			"可直接编辑并保存，保存前自动备份": "Editable; backed up automatically before saving",
			" (缺失)": " (missing)",
			"保存": "Save",
			"② 本次对话导入的跨对话记忆": "2. Memory injected into this session",
			"本会话启动时被注入的内容，只读快照": "Read-only snapshot of what was injected at session start",
			"本会话没有观察到 system/developer 注入事件（可能早于插件启动）。": "No system/developer injection observed in this session (it may predate the plugin).",
			" 字": " chars",
			"（已截断）": "(truncated)",
			"③ 对话中的记忆": "3. Memory from the conversation",
			"规则引擎从事件里抽取，可改、可勾选后导入 ①": "Extracted by the rule engine; edit and import into section 1",
			"本会话还没抽到偏好/约束/决定。规则只认明确句式，宁缺不猜。": "No preference/constraint/decision extracted yet. Rules only match explicit phrasing.",
			"用户": "User",
			"助手": "Assistant",
			" · 已编辑": " · edited",
			"追加到：": "Append to: ",
			"保存本条编辑": "Save this edit",
			"导入到跨对话记忆": "Import into cross-session memory",
			"④ 子智能体记录": "4. Subagent records",
			"观察到的子智能体调用参数和回报，并非子体全部记忆": "Observed subagent args and reports; not their full memory",
			"尚未观察到子智能体调用；插件启动前的记录可能未载入。": "No subagent calls observed yet; records from before the plugin started may be missing.",
			" → 进行中": " → running",
			"任务：": "Task: ",
			"回报：": "Report: ",
			"文件来源：": "Files from: ",
			"已切换并回读确认：": "Switched and verified: ",
			"接口接受但回读不一致：": "Accepted but read-back differs: ",
			"失败：": "failed: ",
			"已切换并回读：": "Switched: ",
			"删除 cap/tool 条目「": "Delete cap/tool entry \"",
			"」？会先备份再移走。": "\"? It is backed up before being moved.",
			"已删除（备份 ": "Deleted (backup ",
			"新 cap/tool 条目名（不含路径）：": "New cap/tool entry name (no path):",
			"内容（可留空）：": "Content (optional):",
			"已创建 ": "Created ",
			"登记一个可执行文件的完整路径：": "Full path of the executable:",
			"显示名：": "Display name:",
			"已登记：": "Registered: ",
			"本对话使用 ": "Used in this chat ",
			"全部库 ": "Whole library ",
			"只统计这个会话的卡片（读/写/跑/联网/子体/工具），按次数排序": "Counts cards of this session only (read/write/run/web/sub/tool), sorted by count",
			"上：插件与 bundle　下左：skills　下右：可执行程序；每块各自搜索、各自滚动": "Top: plugins and bundles · bottom-left: skills · bottom-right: programs. Each pane searches and scrolls on its own.",
			"本对话用过的调用": "Calls used in this chat",
			" 类": " kinds",
			"这个会话还没有可统计的调用。": "No calls to count in this session yet.",
			"最后出现：第 ": "Last seen: turn ",
			" 个 · Harness skill 注册表": " · Harness skill registry",
			"搜索 skill": "Search skills",
			"没有读出 skill。": "Could not read skills.",
			"没有匹配「": "No skill matching \"",
			"」的 skill。": "\".",
			"启用": "Enable",
			"插件与 bundle": "Plugins & bundles",
			" 个 · 启停走 dsh 的插件管理器": " · toggled through the DSH plugin manager",
			"搜索插件": "Search plugins",
			"停用": "Disable",
			"不由插件管理器直接管理": "Not managed by the plugin manager",
			"只读：": "Read-only: ",
			"显示更多（还有 ": "Show more (",
			" 个）": " left)",
			"cap/tool 说明条目": "cap/tool entries",
			" 条 · 工作区 <WS>/cap/tool 下的工具说明，不是可执行文件": " · tool notes under <WS>/cap/tool, not executables",
			"搜索工具条目": "Search entries",
			"新增": "Add",
			"cap/tool 为空或不存在。": "cap/tool is empty or missing.",
			"已停用": "Disabled",
			"删除": "Delete",
			"可执行程序": "Programs",
			"PATH 扫描 ": "PATH scan ",
			" 个，当前显示 ": ", showing ",
			" 个 · 拖到对话输入框可导入": " · drag into the composer to import",
			"过滤程序名或路径": "Filter name or path",
			"登记程序": "Register program",
			"按住后拖到 DSH 对话输入框即可作为文件导入；单击复制路径": "Press and drag into the DSH composer to import as a file; click to copy the path",
			"构造拖拽负载失败：": "Failed to build drag payload: ",
			"文件还没读完，松手后重拖一次（约半秒），或单击复制路径": "File not ready; drop and drag again (about half a second), or click to copy the path",
			"已复制路径：": "Path copied: ",
			"复制失败：": "Copy failed: ",
			"本会话观察到的写入": "Writes observed this session",
			"疑似临时文件": "Likely temp files",
			"备份或版本文件": "Backups / versions",
			"其他扫描文件": "Other scanned files",
			"全部类型": "All types",
			"已在资源管理器定位": "Revealed in Explorer",
			"已交给系统程序打开": "Opened with the system program",
			"读取失败：": "Read failed: ",
			"已移走（回读：": "Moved away (read-back: ",
			"预览失败：": "Preview failed: ",
			"清理 ": "Clean up ",
			" 个文件（合计 ": " files (total ",
			"）？会先备份再改名，不会直接删除。": ")? They are backed up and renamed, not deleted.",
			"清理完成：移走 ": "Done: moved ",
			" 个，合计 ": " files, total ",
			"；失败 ": "; failed ",
			"查询失败：": "Query failed: ",
			"这个文件没有本插件的备份，无法回滚。": "No plugin backup for this file; cannot roll back.",
			"找到 ": "Found ",
			" 个备份，最新一个是 ": " backups, newest is ",
			"已恢复并回读校验：": "Restored and verified: ",
			"恢复失败：": "Restore failed: ",
			"最终产出": "Final output",
			"还没有结束标记": "No end marker yet",
			"在对话里单独发一条「发送」「结束」或 /end，这一段写完的文件会汇总到最上面这里。": "Send \"sent\", \"done\" or /end as its own message; files written in this conversation are collected here.",
			"正在把整段对话归纳成一句话…": "Summarising the conversation in one line…",
			"这一段没有观察到写文件。": "No file writes observed in this session.",
			"文件已不存在": "File is gone",
			"定位": "Reveal",
			"阅读": "Read",
			"打开": "Open",
			"扫描中…": "Scanning…",
			"这些是限定目录中的扫描结果，并非全部经过确认的产出；写入记录覆盖插件观察到的会话事件，备份文件也不等于可回滚版本。": "These are scans of bounded directories, not confirmed deliverables. Write records cover the session events this plugin observed; a backup file is not the same as a restorable version.",
			" 个文件 · 扫描于 ": " files · scanned at ",
			" · 本会话写过 ": " · written this session ",
			"按对话轮查看变更": "Changes by turn",
			"基于宿主记录；已释放的快照标记为不可用": "From host records; released snapshots are marked unavailable",
			"当前会话未连接到宿主变更记录。": "This session is not connected to host change records.",
			"此会话尚无可查的工作区变更记录。": "No workspace change records for this session yet.",
			"版本 ": "Version ",
			"按轮可回滚的文件": "Restorable files by turn",
			"插件在写文件前复制的前像；恢复时原内容会另存一份": "Pre-images copied before a write; current content is saved aside when restoring",
			"本次载入后尚未观察到写文件调用，没有可回滚的前像。": "No write calls observed since load; nothing to roll back.",
			" 轮 · ": " turn · ",
			" 个文件": " files",
			"恢复到这一轮之前": "Restore to before this turn",
			"文件类型": "File type",
			"文档": "Docs",
			"图片": "Images",
			"代码": "Code",
			"文本与数据": "Text & data",
			"其他类型": "Other",
			" 项；类型按扩展名识别": " items; type detected by extension",
			"全选当前列表": "Select all",
			"清除选择": "Clear selection",
			"预览清理 ": "Preview cleanup ",
			"只处理勾选的文件；先备份到 lc-plugin/backups，再改名为 .retired-时间戳": "Only checked files; backed up to lc-plugin/backups, then renamed to .retired-<stamp>",
			"清理预览": "Cleanup preview",
			" 个 · 合计 ": " files · total ",
			"已不存在": "Gone",
			"确认清理 ": "Confirm cleanup ",
			"取消": "Cancel",
			"备份": "Backups",
			"没有本插件的备份，无法从这里恢复。": "No plugin backup; cannot restore from here.",
			"恢复这个备份": "Restore this backup",
			"关闭": "Close",
			"用系统程序打开": "Open with system program",
			"这个类型没有内置阅读器（": "No built-in reader for this type (",
			"），请用系统程序打开。": "); open it with the system program.",
			"这一分类下没有文件。": "No files in this category.",
			" 个版本": " versions",
			"查备份": "Backups",
			"移出": "Retire",
			"画布": "Canvas",
			"记忆": "Memory",
			"调用": "Calls",
			"右栏服务不可用（sidebarRight 未就绪）": "Right-pane service unavailable (sidebarRight not ready)",
			"openTab 失败：": "openTab failed: ",
			"工作站": "Workstation",
			" 张 · ": " cards · ",
			"暂无活动会话": "No active session",
			"画布：session/event 增量折叠，只增不改": "Canvas: session/event folded incrementally, append-only",
			"记忆：磁盘 + 事件规则抽取，可改可导入": "Memory: disk + rule extraction, editable and importable",
			"调用：读活服务，改动回读确认": "Calls: live services, changes verified by read-back",
			"产出：有界扫描，定位/阅读/比版本": "Outputs: bounded scan, reveal / read / compare versions",
			"当前对话": "This chat",
			"最近对话": "Recent chats",
			"画布 / 记忆 / 调用 / 产出，跟着当前对话走": "Canvas / memory / calls / outputs follow the current chat",
			" 秒前": "s ago",
			" 分钟前": "m ago",
			" 小时前": "h ago",
			" 天前": "d ago",
			" 个动作": " actions",
			"  (缺失)": " (missing)",
			" 轮开始": " turn started",
			"还原": "Revert",
			"（服务不可用）": " (service unavailable)",
			"把这行移出产出目录？会先备份。\n": "Move this out of the outputs folder? It is backed up first.\n",
			"用这个备份覆盖当前文件？\n备份：": "Overwrite the current file with this backup?\nBackup: ",
			"\n当前：": "\nCurrent: ",
			"历史记录的快照已释放": "the history snapshot was released",
			" 个": " files",
			"当前显示 ": "Showing "
		};
		let LANG = typeof localStorage === "undefined" ? "zh" : localStorage.getItem("lcs-lang") === "en" ? "en" : "zh";
		const T = (text) => (LANG === "en" && Object.prototype.hasOwnProperty.call(EN_DICT, text) ? EN_DICT[text] : text);

		const { useState, useEffect, useRef, useMemo, useCallback, memo } = React;

		/* ────────────────────────────── styles ────────────────────────────── */

		const STYLE_TAG = "lc-station-styles";
		const CSS = `
.lcs-root {
  --lcs-bg: var(--dsw-alias-bg-base, #17181c);
  --lcs-panel: var(--dsw-alias-bg-layer-1, #1e2026);
  --lcs-panel-2: var(--dsw-alias-bg-layer-2, #15161a);
  --lcs-line: var(--dsw-alias-border-l2, color-mix(in oklab, var(--lcs-text) 9%, transparent));
  --lcs-text: var(--dsw-alias-label-primary, #e8e9ec);
  --lcs-dim: var(--dsw-alias-label-secondary, #9aa0aa);
  --lcs-faint: var(--dsw-alias-label-tertiary, #6b7280);
  --lcs-accent: #ff7500;
  --lcs-ok: #3ecf8e;
  --lcs-warn: #f5c451;
  --lcs-bad: #ff5a52;
  display: flex; flex-direction: column; height: 100%; min-height: 0;
  background: var(--lcs-bg); color: var(--lcs-text);
  font: 13px/1.5 -apple-system, "Segoe UI", "Microsoft YaHei", system-ui, sans-serif;
}
.lcs-head {
  display: flex; align-items: center; gap: 14px; padding: 14px 20px 0; flex: 0 0 auto;
}
.lcs-title { display: flex; align-items: baseline; gap: 10px; }
.lcs-title h1 { font-size: 16px; font-weight: 650; margin: 0; letter-spacing: .2px; }
.lcs-title span { font-size: 11px; color: var(--lcs-faint); font-variant-numeric: tabular-nums; }
.lcs-tabs { display: flex; gap: 2px; margin-left: auto; background: var(--lcs-panel-2); padding: 3px; border-radius: 10px; border: 1px solid var(--lcs-line); }
.lcs-tab {
  appearance: none; border: 0; background: transparent; color: var(--lcs-dim);
  padding: 6px 16px; border-radius: 8px; font: inherit; font-size: 12.5px; cursor: pointer;
  transition: color .12s, background .12s;
}
.lcs-tab:hover { color: var(--lcs-text); }
.lcs-tab[data-active="true"] { background: var(--lcs-panel); color: var(--lcs-text); box-shadow: 0 1px 0 color-mix(in oklab, var(--lcs-text) 5%, transparent) inset, 0 0 0 1px var(--lcs-line); font-weight: 600; }
.lcs-tab[data-active="true"]::before { content: ""; display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--lcs-accent); margin-right: 7px; vertical-align: 1px; }
.lcs-sub { padding: 6px 20px 10px; color: var(--lcs-faint); font-size: 11.5px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
.lcs-body { flex: 1 1 auto; min-height: 0; overflow: hidden; padding: 0 20px 16px; display: flex; flex-direction: column; }
.lcs-scroll { overflow: auto; min-height: 0; flex: 1 1 auto; }

/* ── right column pane ── */
.lcs-pane { padding: 0; }
.lcs-pane-head {
  display: flex; align-items: center; gap: 8px; padding: 10px 12px 8px; flex: 0 0 auto;
  border-bottom: 1px solid var(--lcs-line);
}
.lcs-pane-title { font-size: 13px; font-weight: 650; letter-spacing: .2px; }
.lcs-tabs-sm { margin-left: auto; padding: 2px; border-radius: 8px; }
.lcs-lang { margin-left: 6px; }
.lcs-lang .lcs-tab { min-width: 30px; text-align: center; padding: 4px 6px; font-size: 11.5px; }
.lcs-tabs-sm .lcs-tab { padding: 4px 9px; font-size: 11.5px; border-radius: 6px; }
.lcs-tabs-sm .lcs-tab[data-active="true"]::before { width: 4px; height: 4px; margin-right: 5px; }
.lcs-pane .lcs-body { padding: 8px 10px 10px; }
.lcs-pane .lcs-sub { display: none; }
.lcs-pane .lcs-lane { flex: 0 0 232px; }
.lcs-chip { font-size: 11.5px; color: var(--lcs-dim); }

.lcs-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex: 0 0 auto; }
.lcs-dot[data-s="running"] { background: var(--lcs-warn); box-shadow: 0 0 0 3px rgba(245,196,81,.14); animation: lcs-pulse 1.2s ease-in-out infinite; }
.lcs-dot[data-s="ok"] { background: var(--lcs-ok); }
.lcs-dot[data-s="failed"] { background: var(--lcs-bad); }
@keyframes lcs-pulse { 0%,100% { opacity: .45 } 50% { opacity: 1 } }

/* ── canvas ── */
.lcs-viewport {
  position: relative; flex: 1 1 auto; min-height: 0; overflow: hidden; border-radius: 12px;
  border: 1px solid var(--lcs-line); background-color: var(--lcs-bg);
  cursor: grab; touch-action: none;
}
.lcs-viewport[data-drag="true"] { cursor: grabbing; }
.lcs-world { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }
.lcs-edges { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.lcs-map {
	position: absolute;
	left: 12px;
	bottom: 54px;
	z-index: 6;
	padding: 2px;
	border: 1px solid var(--lcs-line);
	border-radius: 9px;
	background: var(--lcs-panel);
	cursor: default;
	line-height: 0;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.lcs-map { pointer-events: none; }
.lcs-grid[data-calls="used"] .lcs-lib { display: none; }
.lcs-zoom {
  position: absolute; left: 12px; bottom: 12px; display: flex; align-items: center; gap: 4px; white-space: nowrap;
  background: var(--lcs-panel); border: 1px solid var(--lcs-line); border-radius: 10px; padding: 4px 6px;
  box-shadow: 0 6px 18px rgba(0,0,0,.28); z-index: 2;
}
.lcs-zoom .lcs-btn { padding: 3px 9px; font-size: 11.5px; }
.lcs-zoom-val { font-size: 11px; color: var(--lcs-dim); min-width: 40px; text-align: center; font-variant-numeric: tabular-nums; }
.lcs-empty { color: var(--lcs-faint); font-size: 12px; padding: 28px 4px; text-align: center; line-height: 1.9; }
/* ── 分层：轮次块 / 步骤组 / 浮窗 ───────────────────────────────── */
.lcs-viewport { user-select: none; -webkit-user-select: none; }
.lcs-win-body, .lcs-win-body .cv-out, .lcs-win-body .cv-run-out, .lcs-win-body .cv-note,
.lcs-win-body .cv-cmd, .lcs-win-body pre { user-select: text; -webkit-user-select: text; }
.lcs-win-body .cv-out, .lcs-win-body .cv-run-out, .lcs-win-body .cv-note { cursor: text; }

.lcs-node-turn { box-shadow: none; background: none; }

.lcs-tstart {
  position: absolute; top: -19px; left: 0;
  font-size: 10.5px; letter-spacing: 0.03em;
  padding: 1px 7px; border-radius: 999px; white-space: nowrap;
  color: color-mix(in oklab, var(--lcs-text) 74%, transparent);
  background: color-mix(in oklab, var(--lcs-text) 8%, transparent);
}

.lcs-tcard {
  --h: hsl(var(--hue) 70% 62%);
  display: flex; flex-direction: column; gap: 5px; width: 100%; box-sizing: border-box;
  padding: 11px 13px 11px 15px; text-align: left; cursor: pointer;
  border: 1px solid color-mix(in oklab, var(--h) 34%, transparent);
  border-left: 3px solid var(--h);
  border-radius: 10px;
  background:
    linear-gradient(180deg, color-mix(in oklab, var(--h) 9%, var(--bg-2, #1e2026)), color-mix(in oklab, var(--h) 3%, var(--bg-1, #17181c)));
  box-shadow: 0 16px 34px -24px color-mix(in oklab, #000 65%, transparent);
  color: var(--fg); font: inherit;
  transition: border-color .12s, transform .12s;
}
.lcs-tcard:hover { border-color: color-mix(in oklab, var(--h) 62%, transparent); transform: translateY(-1px); }
.lcs-tcard-top { display: flex; align-items: center; gap: 8px; }
.lcs-tcard-no { font-size: 12px; font-weight: 600; color: var(--h); letter-spacing: .02em; }
.lcs-tcard-count { font-size: 10.5px; color: var(--fg-4); }
.lcs-tcard-open { margin-left: auto; font-size: 10.5px; color: var(--fg-4); }
.lcs-tcard-row { display: flex; gap: 7px; font-size: 11.5px; line-height: 1.45; color: var(--fg-2); }
.lcs-tcard-row b { color: var(--fg-4); font-weight: 500; flex: 0 0 26px; }
.lcs-tcard-row span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lcs-tcard-row.out span { color: var(--fg-3); }
.lcs-tcard-steps { display: flex; gap: 5px; flex-wrap: nowrap; overflow: hidden; }
.lcs-chipx {
  font-size: 9.5px; padding: 2px 6px; border-radius: 4px; white-space: nowrap;
  background: color-mix(in oklab, var(--lcs-text) 6%, transparent); color: var(--fg-4); border: 1px solid color-mix(in oklab, var(--lcs-text) 7%, transparent);
}
.lcs-chipx.grp { background: color-mix(in oklab, var(--h) 20%, transparent); color: var(--h); border-color: color-mix(in oklab, var(--h) 34%, transparent); }

.lcs-tcard.head .lcs-tcard-no { font-size: calc(11px * var(--lc-ik, 1)); }
.lcs-tcard.tiny .lcs-tcard-no { font-size: calc(11.5px * var(--lc-ik, 1)); }
.lcs-tcard.head .lcs-tcard-desc, .lcs-tcard.tiny .lcs-tcard-desc { font-size: calc(9.5px * var(--lc-ik, 1)); }
.lcs-tcard.head {
  width: 100%; height: 168px; flex-direction: column; align-items: flex-start; justify-content: center;
  gap: 4px; padding: 8px 9px; border-radius: 8px;
}
.lcs-tcard.head .lcs-tcard-desc {
  font-size: 10px; line-height: 1.35; color: var(--fg-4); white-space: normal;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.lcs-tcard.tiny {
  width: 126px; height: 48px; flex-direction: column; align-items: flex-start; justify-content: center;
  gap: 2px; padding: 6px 7px; border-radius: 7px; display: flex;
}
.lcs-tcard.tiny .lcs-tcard-no { font-size: 10px; }
.lcs-tcard.tiny .lcs-tcard-desc { font-size: 9.5px; color: var(--fg-5); white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.lcs-win {
  --h: hsl(var(--hue) 70% 62%);
  position: absolute; inset: 0; display: flex; flex-direction: column;
  border: 1px solid color-mix(in oklab, var(--h) 40%, var(--lcs-line));
  border-radius: 12px; overflow: hidden;
  background: var(--lcs-bg);
  box-shadow: 0 40px 90px -30px rgba(0,0,0,.96), 0 0 0 1px color-mix(in oklab, var(--lcs-text) 3%, transparent);
}
.lcs-win-head {
  display: flex; align-items: center; gap: 12px; padding: 14px 20px;
  border-bottom: 1px solid var(--lcs-line);
  background: color-mix(in oklab, var(--h) 8%, var(--lcs-panel));
  touch-action: none;
}
.lcs-win-title { font-size: 12px; font-weight: 600; color: var(--fg); }
.lcs-win-sub { font-size: 10.5px; color: var(--fg-4); }
.lcs-win-btn { margin-left: auto; padding: 8px 14px; border-radius: 7px; border: 1px solid var(--lcs-line); background: color-mix(in oklab, var(--lcs-text) 6%, transparent); color: var(--fg-2); cursor: pointer; font-size: 12px; line-height: 1; }
.lcs-win-btn:hover { color: var(--fg); background: color-mix(in oklab, var(--lcs-text) 12%, transparent); }
.lcs-win-body { position: relative; flex: 1; min-height: 0; overflow: hidden; cursor: grab; touch-action: none; user-select: none; background-image: radial-gradient(circle, color-mix(in srgb, var(--lcs-text) 13%, transparent) 1px, transparent 1px); background-size: 26px 26px; }
.lcs-win-chain { position: relative; min-height: 100%; }
.lcs-detail { height: 100%; overflow: auto; padding: 26px 0 48px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); user-select: text; cursor: text; }
.lcs-detail-inner { max-width: 880px; margin: 0 auto; padding: 0 30px; }
.lcs-detail h2 { font-size: 17px; line-height: 1.55; margin: 0 0 6px; font-weight: 600; }
.lcs-detail .lcs-detail-meta { font-size: 11.5px; color: var(--lcs-dim); margin: 0 0 22px; letter-spacing: .02em; }
.lcs-detail section { border-top: 1px solid var(--lcs-line); padding: 16px 0 6px; }
.lcs-detail h3 { font-size: 10.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--lcs-faint); margin: 0 0 10px; font-weight: 600; }
.lcs-detail pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font: 12.5px/1.78 ui-monospace, "Cascadia Code", Consolas, monospace; color: var(--dsw-alias-label-primary); }
.lcs-drag-handle { display: block; box-sizing: border-box; width: 100%; height: 28px; padding: 0 6px; margin-bottom: 6px; text-align: left; border: 0; border-radius: 6px; background: transparent; color: var(--lcs-faint); font-size: 11px; cursor: grab; user-select: none; touch-action: none; opacity: .5; transition: opacity .12s, background .12s; }
.lcs-drag-handle:hover { opacity: 1; background: color-mix(in oklab, var(--lcs-text) 6%, transparent); }
.lcs-drag-handle:active { cursor: grabbing; }
.lcs-win-edges { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.lcs-win-cell { position: absolute; }
.lcs-win .lcs-grow-row { height: 158px; }
.lcs-hit { outline: 2px solid rgba(255,196,88,.85); outline-offset: 3px; border-radius: 14px; }
.lcs-win-card .cv-card { height: 212px; box-sizing: border-box; }
.lcs-win-card .cv-run-out, .lcs-win-card .cv-out { max-height: 190px; overflow: auto; }

.lcs-grow-row {
  --h: hsl(var(--hue) 70% 62%);
  display: flex; flex-direction: column; gap: 4px; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; text-align: left; cursor: pointer;
  padding: 9px 11px; border-radius: 9px; font: inherit; color: var(--fg);
  border: 1px solid color-mix(in oklab, var(--h) 26%, transparent);
  border-left: 3px solid var(--h);
  background: color-mix(in oklab, var(--h) 8%, var(--lcs-panel));
}
.lcs-grow-row:hover { border-color: color-mix(in oklab, var(--h) 55%, transparent); }
.lcs-grow-head { display: flex; align-items: center; gap: 8px; }
.lcs-grow-no { font-size: 11.5px; font-weight: 600; color: var(--h); }
.lcs-grow-count { font-size: 10px; color: var(--fg-4); }
.lcs-grow-open { margin-left: auto; font-size: 10px; color: var(--fg-4); }
.lcs-grow-line { display: flex; gap: 7px; font-size: 11px; color: var(--fg-3); }
.lcs-grow-kind { flex: 0 0 34px; font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: var(--h); opacity: .8; }
.lcs-grow-more { display: flex; flex-direction: column; gap: 1px; font-size: 10px; color: var(--fg-5); overflow: hidden; }
.lcs-gsum-tally, .lcs-gsum-tools { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lcs-gsum-tools { color: color-mix(in oklab, var(--h) 70%, var(--fg-6, var(--fg-5))); }
.lcs-mini-map { display: block; width: 100%; flex: 0 0 90px; color: var(--h); overflow: hidden; }
.lcs-mini-node { fill: color-mix(in oklab, var(--h) 16%, var(--lcs-panel)); stroke: color-mix(in oklab, var(--h) 55%, transparent); stroke-width: 1.5px; }
.lcs-mini-node.grp { fill: color-mix(in oklab, var(--h) 30%, var(--lcs-panel)); stroke: color-mix(in oklab, var(--h) 80%, transparent); }
.lcs-mini-chain { display: flex; align-items: center; overflow-x: auto; gap: 3px; width: 100%; min-height: 75px; }
.lcs-mini-item { display: flex; align-items: center; flex: 0 0 auto; gap: 3px; }
.lcs-mini-link { color: var(--h); opacity: .7; }
.lcs-mini-card { display: flex; flex-direction: column; justify-content: center; gap: 4px; width: 74px; height: 58px; padding: 5px; box-sizing: border-box; border: 1px solid color-mix(in oklab, var(--h) 34%, transparent); border-radius: 5px; background: color-mix(in oklab, var(--lcs-panel-2) 70%, transparent); font-size: 9px; overflow: hidden; }
.lcs-mini-card b { color: var(--h); font-size: 8px; text-transform: uppercase; }
.lcs-mini-card span { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
/* ── 浮窗里的链状连线 ─────────────────────────────────────────── */
.lcs-win-row { display: flex; flex-direction: column; gap: 0; }
.lcs-link { position: relative; height: 16px; margin-left: 26px; }
.lcs-link::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 1.5px; background: color-mix(in oklab, var(--lcs-text) 18%, transparent); }
.lcs-link::after {
  content: ""; position: absolute; left: -3px; bottom: 0;
  border: 4px solid transparent; border-top-color: color-mix(in oklab, var(--lcs-text) 26%, transparent);
}

/* ── 右上角：时间线 + 搜索 ────────────────────────────────────── */
.lcs-tl-btn {
  position: absolute; right: 12px; top: 12px; z-index: 30;
  padding: 5px 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid var(--lcs-line); background: var(--lcs-panel); color: var(--lcs-dim);
  font-size: 11.5px; backdrop-filter: blur(8px);
}
.lcs-tl-btn:hover, .lcs-tl-btn[data-on="true"] { color: var(--fg); border-color: color-mix(in oklab, var(--lcs-text) 26%, transparent); }
.lcs-tl {
  position: absolute; right: 12px; top: 46px; z-index: 31; width: 340px; max-height: 66%;
  display: flex; flex-direction: column; gap: 8px; padding: 10px;
  border: 1px solid var(--lcs-line); border-radius: 11px;
  background: var(--lcs-panel); box-shadow: 0 30px 70px -30px rgba(0,0,0,.55);
  backdrop-filter: blur(10px);
}
.lcs-tl-q {
  width: 100%; box-sizing: border-box; padding: 6px 9px; border-radius: 7px;
  border: 1px solid var(--lcs-line); background: var(--lcs-panel-2); color: var(--lcs-text);
  font-size: 11.5px; outline: none;
}
.lcs-tl-q:focus { border-color: color-mix(in oklab, var(--lcs-text) 30%, transparent); }
.lcs-tl-list { overflow: auto; display: flex; flex-direction: column; gap: 2px; }
.lcs-tl-head { font-size: 10px; color: var(--lcs-faint); padding: 2px 4px 4px; letter-spacing: .06em; }
.lcs-tl-row {
  display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; cursor: pointer;
  padding: 5px 7px; border: 0; border-radius: 6px; background: transparent; color: var(--fg-2); font: inherit; font-size: 11.5px;
}
.lcs-tl-row:hover { background: color-mix(in oklab, var(--lcs-text) 8%, transparent); color: var(--fg); }
.lcs-tl-time { flex: 0 0 auto; font-size: 10px; color: var(--lcs-faint); }
.lcs-tl-main { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lcs-tl-n { flex: 0 0 auto; font-size: 10px; color: var(--fg-5); }
.lcs-legend { display: flex; gap: 16px; color: var(--lcs-faint); font-size: 11px; padding: 8px 2px 0; border-top: 1px solid var(--lcs-line); margin-top: 8px; flex: 0 0 auto; }

/* ── 卡片本体：1:1 照 Workstation 原程序的 .cv-card ──
   变量在 .lcs-node 上重定义，免得借用 DSH 自己的 --fg/--line 时串主题 */
.lcs-node {
  position: absolute;
}

/* 卡片样式的作用域：画布节点和浮窗里的卡共用同一套，靠这个类挂变量 */
.cv-scope {
  --line: var(--dsw-alias-border-l1);
  --line-2: var(--dsw-alias-border-l2);
  --bg-1: var(--dsw-alias-bg-base);
  --bg-2: var(--dsw-alias-bg-layer-1);
  --bg-4: var(--dsw-alias-bg-layer-2);
  --fg: var(--dsw-alias-label-primary);
  --fg-2: var(--dsw-alias-label-secondary);
  --fg-3: var(--dsw-alias-label-secondary);
  --fg-4: var(--dsw-alias-label-tertiary);
  --fg-5: var(--dsw-alias-label-tertiary);
  --hi: inset 0 1px 0 color-mix(in oklab, var(--lcs-text) 4%, transparent);
}
/* 缩略两档：拉远只看轮廓，不许把 200 多张卡的正文都排一遍 */
.cv-scope.lod-compact .cv-card { height: 34px; }
.cv-scope.lod-compact .cv-head { border-bottom: none; }
.cv-scope.lod-compact .cv-title { font-size: 11px; }
.cv-scope.lod-block .cv-card,
.cv-scope .cv-card.cv-tiny {
  height: 22px; min-height: 22px; flex-direction: row; align-items: center; gap: 6px;
  padding: 0 7px; border-radius: 6px; box-shadow: none;
}
.cv-scope .cv-card.cv-tiny .cv-kind { width: 10px; height: 10px; padding: 0; border-radius: 3px; font-size: 0; }
.cv-scope .cv-card.cv-tiny .cv-run { margin-left: auto; }
.cv-scope .cv-card {
  display: flex; flex-direction: column; height: 212px; box-sizing: border-box; overflow: hidden;
  border: 1px solid var(--line-2); border-radius: 12px;
  background: var(--bg-2);
  box-shadow: 0 14px 30px -22px rgba(15,20,30,.26), var(--hi);
  animation: lcs-in .16s ease-out;
}
@keyframes lcs-in { from { opacity: 0; transform: translateY(-3px) } to { opacity: 1; transform: none } }
/* 深色底需要更实的投影，浅色底用上面那条浅投影 */
body[data-ds-dark-theme] .cv-scope .cv-card { box-shadow: 0 20px 48px -22px rgba(0,0,0,.92), var(--hi); }
.cv-scope .cv-head {
  display: flex; align-items: center; gap: 7px; height: 34px; padding: 0 9px 0 10px;
  border-bottom: 1px solid var(--line); flex: none; background: color-mix(in oklab, var(--fg) 3%, transparent); cursor: grab;
}
/* 类别徽标不写死颜色：按主题前景色混色，浅色底上自然变深、深色底上自然变浅 */
.cv-scope .cv-kind {
  font-size: 8.5px; line-height: 1; padding: 3px 5px; border-radius: 4px; letter-spacing: .07em;
  text-transform: uppercase; flex: none;
  color: color-mix(in oklab, #6b77e0 55%, var(--fg));
  background: color-mix(in oklab, #6b77e0 18%, transparent);
}
.cv-scope .cv-kind.plan { color: color-mix(in oklab, #d6a860 45%, var(--fg)); background: color-mix(in oklab, #d6a860 18%, transparent); }
.cv-scope .cv-kind.sub { color: color-mix(in oklab, #3fa87a 45%, var(--fg)); background: color-mix(in oklab, #3fa87a 18%, transparent); }
.cv-scope .cv-kind.tool { color: color-mix(in oklab, #a06edc 45%, var(--fg)); background: color-mix(in oklab, #a06edc 18%, transparent); }
.cv-scope .cv-kind.note { color: var(--fg-3); background: color-mix(in oklab, var(--fg) 8%, transparent); }
.cv-scope .cv-title {
  flex: 1; min-width: 0; font-size: 12.5px; font-weight: 560; color: var(--fg);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cv-scope .cv-run { width: 5px; height: 5px; border-radius: 99px; flex: none; background: color-mix(in oklab, var(--fg) 26%, transparent); }
.cv-scope .cv-run.running { background: #6b77e0; box-shadow: 0 0 8px rgba(107,119,224,.9); animation: lcs-pulse 1.4s ease-in-out infinite; }
.cv-scope .cv-run.done { background: #3fa87a; }
.cv-scope .cv-run.stopped { background: #d6a860; }
@keyframes lcs-pulse { 50% { opacity: .38 } }
.cv-scope .cv-body { flex: 1; min-height: 0; display: flex; flex-direction: column; }

/* 跑程卡 */
.cv-scope .cv-run-top { display: flex; align-items: center; gap: 6px; padding: 9px 11px 6px; flex: none; }
.cv-scope .cv-prompt { font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 12px; color: color-mix(in oklab, #7f8bff 60%, var(--fg)); flex: none; }
.cv-scope .cv-cmd {
  flex: 1; min-width: 0; font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 11.5px;
  color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cv-scope .cv-run-out {
  flex: 1; min-height: 0; overflow: auto; margin: 0 11px 9px; padding: 8px 10px;
  background: var(--bg-4); border: 1px solid var(--line); border-radius: 8px;
}
.cv-scope .cv-run-meta { font-size: 10px; margin-bottom: 6px; }
.cv-scope .cv-run-meta.ok { color: color-mix(in oklab, #3ecf8e 70%, var(--fg, #e8e9ec)); }
.cv-scope .cv-run-meta.bad { color: color-mix(in oklab, #ff5a52 62%, var(--fg, #e8e9ec)); }
.cv-scope .cv-run-stdout, .cv-scope .cv-run-stderr {
  margin: 0; font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 10.5px;
  line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere;
}
.cv-scope .cv-run-stdout { color: var(--fg-2); }
.cv-scope .cv-run-stderr { color: color-mix(in oklab, #ff5a52 58%, var(--fg, #e8e9ec)); }

/* 调用卡 */
.cv-scope .cv-tools { padding: 8px 10px; display: flex; flex-direction: column; gap: 5px; flex: none; }
.cv-scope .cv-tool {
  display: flex; align-items: center; gap: 7px; padding: 6px 8px;
  border: 1px solid var(--line); border-radius: 7px; background: var(--bg-2);
}
.cv-scope .cv-tool b { font-size: 11.5px; font-weight: 540; color: var(--fg); flex: none; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cv-scope .cv-tool i {
  flex: 1; min-width: 0; font-style: normal; font-size: 10.5px; color: var(--fg-4);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lcs-node .tagx {
  font-size: 9.5px; line-height: 1; padding: 3px 5px; border-radius: 4px; flex: none;
  color: color-mix(in oklab, #6b77e0 55%, var(--fg, #e8e9ec)); background: color-mix(in oklab, #6b77e0 16%, transparent);
}

/* 输出 / 备注 / 计划 / 子对 */
.cv-scope .cv-out {
  flex: 1; min-height: 0; overflow: auto; margin: 0 11px 9px; padding: 8px 10px;
  font-size: 11.5px; line-height: 1.72; color: var(--fg-2); background: var(--bg-4);
  border: 1px solid var(--line); border-radius: 8px; white-space: pre-wrap; overflow-wrap: anywhere;
}
.cv-scope .cv-note {
  flex: 1; min-height: 0; overflow: auto; padding: 10px 11px;
  font-size: 12px; line-height: 1.75; color: var(--fg-2); white-space: pre-wrap; overflow-wrap: anywhere;
}
.cv-scope .cv-goal {
  padding: 9px 11px 8px; font-size: 11.5px; line-height: 1.65; color: var(--fg);
  border-bottom: 1px solid var(--line); flex: none; max-height: 72px; overflow: auto;
}
.cv-scope .cv-steps { flex: 1; min-height: 0; overflow: auto; padding: 6px 11px 10px; }
.cv-scope .cv-step { display: flex; gap: 9px; padding: 7px 0; border-bottom: 1px solid color-mix(in oklab, var(--fg) 7%, transparent); }
.cv-scope .cv-step:last-child { border-bottom: 0; }
.cv-scope .cv-step .no {
  width: 17px; height: 17px; flex: none; display: flex; align-items: center; justify-content: center;
  font-size: 9.5px; color: var(--fg-3); border: 1px solid var(--line-2); border-radius: 5px;
  font-variant-numeric: tabular-nums;
}
.cv-scope .cv-step .main { flex: 1; min-width: 0; font-size: 12px; line-height: 1.6; color: var(--fg); overflow-wrap: anywhere; }
.cv-scope .cv-step-desc {
  padding: 9px 11px 6px; font-size: 11.5px; line-height: 1.7; color: var(--fg-3);
  flex: none; max-height: 66px; overflow: auto;
}
.cv-scope .cv-hint { font-size: 11px; color: var(--fg-5); line-height: 1.7; padding: 2px 0; }

/* 卡底注：分支 / 并串 / 轮次 / 时间 */
.cv-scope .cv-run-hist {
  display: flex; align-items: center; gap: 5px; padding: 0 11px 8px;
  font-size: 10px; color: var(--fg-5); flex: none; flex-wrap: wrap;
}
.cv-scope .cv-run-past {
  padding: 1px 5px; font-size: 10px; color: var(--fg-4);
  border: 1px solid var(--line); border-radius: 4px;
}

/* ── generic panels ── */
.lcs-grid { display: flex; flex-direction: column; gap: 14px; }
.lcs-block { border: 1px solid var(--lcs-line); border-radius: 12px; background: var(--lcs-panel-2); overflow: hidden; }
.lcs-final {
  display: flex; align-items: stretch; gap: 14px; padding: 12px 14px; border-radius: 14px;
  border: 1px solid color-mix(in oklab, var(--lcs-accent) 52%, var(--lcs-line));
  background: linear-gradient(135deg, color-mix(in oklab, var(--lcs-accent) 16%, var(--lcs-panel-2)), var(--lcs-panel-2) 62%);
}
.lcs-final[data-state="idle"] { border-color: var(--lcs-line); background: var(--lcs-panel-2); }
.lcs-final-side { display: flex; align-items: center; padding-right: 14px; border-right: 1px solid var(--lcs-line); }
.lcs-final-side b { white-space: nowrap; letter-spacing: .22em; font-size: 12.5px; font-weight: 700; color: var(--lcs-accent); }
.lcs-final[data-state="idle"] .lcs-final-side b { color: var(--lcs-faint); }
.lcs-final-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.lcs-final-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.lcs-final-head b { font-size: 13.5px; font-weight: 640; }
.lcs-final-summary { margin: 0; font-size: 12.5px; line-height: 1.7; color: var(--lcs-text); max-width: 96ch; }
.lcs-final-list { display: flex; flex-direction: column; gap: 4px; max-height: 264px; overflow: auto; }
.lcs-final-row { display: flex; align-items: center; gap: 9px; padding: 5px 8px; border-radius: 8px; background: color-mix(in oklab, var(--lcs-panel) 74%, transparent); }
.lcs-final-row > b { font-size: 12px; font-weight: 600; white-space: nowrap; }
.lcs-final-row > .lcs-mono { font-size: 10.5px; color: var(--lcs-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lcs-block-head { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--lcs-line); background: var(--lcs-panel); }
.lcs-block-head b { font-size: 12.5px; font-weight: 620; }
.lcs-block-head em { font-style: normal; color: var(--lcs-faint); font-size: 11px; }
.lcs-block-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
.lcs-kv { display: flex; gap: 8px; font-size: 11.5px; color: var(--lcs-dim); }
.lcs-kv b { color: var(--lcs-text); font-weight: 560; }
.lcs-btn {
  appearance: none; border: 1px solid var(--lcs-line); background: var(--lcs-panel); color: var(--lcs-text);
  font: inherit; font-size: 11.5px; padding: 4px 11px; border-radius: 7px; cursor: pointer; white-space: nowrap;
}
.lcs-btn:hover { border-color: var(--lcs-accent); color: #fff; }
.lcs-btn[data-tone="primary"] { background: var(--lcs-accent); border-color: var(--lcs-accent); color: #17181c; font-weight: 600; }
.lcs-btn[data-tone="danger"] { border-color: rgba(255,90,82,.5); color: var(--lcs-bad); }
.lcs-btn[data-tone="danger"]:hover { background: rgba(255,90,82,.12); color: var(--lcs-bad); }
.lcs-btn:disabled { opacity: .45; cursor: default; }
.lcs-input, .lcs-textarea, .lcs-select {
  appearance: none; border: 1px solid var(--lcs-line); background: var(--lcs-bg); color: var(--lcs-text);
  font: inherit; font-size: 12px; padding: 5px 9px; border-radius: 7px; width: 100%;
}
.lcs-textarea { resize: vertical; min-height: 200px; font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: 11.5px; line-height: 1.6; }
.lcs-row { display: flex; gap: 8px; align-items: center; }
.lcs-row > .lcs-grow { flex: 1 1 auto; min-width: 0; }
.lcs-item { display: flex; gap: 9px; align-items: flex-start; padding: 7px 9px; border-radius: 8px; border: 1px solid transparent; }
.lcs-item:hover { background: var(--lcs-panel); border-color: var(--lcs-line); }
.lcs-item-text { flex: 1 1 auto; min-width: 0; font-size: 12px; }
.lcs-tag { font-size: 10px; padding: 1px 6px; border-radius: 5px; background: var(--lcs-panel); border: 1px solid var(--lcs-line); color: var(--lcs-dim); white-space: nowrap; }
.lcs-tag[data-kind="constraint"] { color: color-mix(in oklab, #ff5a52 55%, var(--lcs-text)); border-color: rgba(255,90,82,.35); }
.lcs-tag[data-kind="preference"] { color: color-mix(in oklab, #3ecf8e 55%, var(--lcs-text)); border-color: rgba(62,207,142,.35); }
.lcs-tag[data-kind="decision"] { color: color-mix(in oklab, #f5c451 55%, var(--lcs-text)); border-color: rgba(255,209,102,.35); }
.lcs-note { font-size: 11px; color: var(--lcs-faint); }
.lcs-ok { color: var(--lcs-ok); }
.lcs-bad { color: var(--lcs-bad); }
.lcs-sep { height: 1px; background: var(--lcs-line); margin: 2px 0; }
.lcs-mono { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: 11px; color: var(--lcs-dim); word-break: break-all; }
.lcs-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; padding: 1px 7px; border-radius: 20px; border: 1px solid var(--lcs-line); color: var(--lcs-dim); white-space: nowrap; flex: 0 0 auto; }
.lcs-pill[data-on="true"] { color: var(--lcs-ok); border-color: rgba(62,207,142,.4); }
.lcs-pill[data-on="false"] { color: var(--lcs-faint); }
.lcs-cols { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 10px; }
.lcs-list { display: flex; flex-direction: column; gap: 2px; max-height: 340px; overflow: auto; overscroll-behavior: auto; }
.lcs-grid[data-calls] .lcs-list { max-height: none; overflow: visible; }

/* ── 调用页：三区铺满屏幕 ─────────────────────────────────────────────
 * 插件占上排整行（大），技能与程序在下排并列（小）。三块各自滚动、
 * 各自搜索，块与块之间留空隙，整页不再整体滚动。 */
.lcs-calls { overflow: hidden; display: flex; flex-direction: column; gap: 10px; height: 0; }
.lcs-calls[data-mode="used"] { overflow: auto; }
.lcs-calls-bar { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; flex-wrap: wrap; }
.lcs-calls-grid { flex: 1 1 auto; min-height: 0; height: 0; display: flex; flex-direction: column; gap: 10px; }
.lcs-calls-grid[data-calls="lib"] {
  display: grid; gap: 16px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1.55fr) minmax(0, 1fr);
  grid-template-areas: "plugins plugins" "skills programs";
}
.lcs-calls-grid[data-calls="lib"] > .lcs-block { display: flex; flex-direction: column; min-height: 0; }
.lcs-calls-grid[data-calls="lib"] > .lcs-block > .lcs-block-head { flex: 0 0 auto; flex-wrap: wrap; row-gap: 6px; }
.lcs-calls-grid[data-calls="lib"] > .lcs-block > .lcs-block-body { flex: 1 1 auto; min-height: 0; overflow: auto; overscroll-behavior: contain; }
.lcs-calls-grid[data-calls="lib"] .lcs-block-head em { flex: 1 1 100px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lcs-calls-plugins { grid-area: plugins; }
.lcs-calls-skills { grid-area: skills; }
.lcs-calls-programs { grid-area: programs; }
.lcs-calls-sub { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding-top: 2px; }
.lcs-calls-sub b { font-size: 11.5px; font-weight: 600; color: var(--lcs-dim); }
.lcs-calls-sub em { font-style: normal; font-size: 11px; color: var(--lcs-faint); flex: 1 1 120px; min-width: 0; }
.lcs-calls-sub .lcs-input { width: auto; }
.lcs-calls-grid[data-calls] .lcs-list { max-height: none; overflow: visible; }
.lcs-viewer { border: 1px solid var(--lcs-line); border-radius: 10px; background: var(--lcs-bg); padding: 12px; max-height: 420px; overflow: auto; }
.lcs-viewer pre { margin: 0; font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: 11.5px; white-space: pre-wrap; word-break: break-word; }
.lcs-viewer img { max-width: 100%; display: block; margin: 0 auto; }
.lcs-versions { display: flex; flex-direction: column; gap: 4px; margin: 6px 0 0 4px; padding-left: 10px; border-left: 1px dashed var(--lcs-line); }
`;

		/* ────────────────────────────── helpers ────────────────────────────── */

		function installStyles() {
			if (typeof document === "undefined") return undefined;
			let tag = document.querySelector('style[data-plugin-css="' + STYLE_TAG + '"]');
			if (tag === null) {
				tag = document.createElement("style");
				tag.dataset.plugin = "lc-station";
				tag.dataset.pluginCss = STYLE_TAG;
				tag.textContent = CSS;
				document.head.appendChild(tag);
			}
			return () => tag.remove();
		}

		function fmtTime(ms) {
			if (typeof ms !== "number" || ms <= 0) return "";
			const d = new Date(ms);
			return d.toLocaleTimeString("zh-CN", { hour12: false });
		}

		function relTime(ms) {
			if (typeof ms !== "number" || ms <= 0) return "";
			const diff = Date.now() - ms;
			if (diff < 60e3) return Math.max(0, Math.round(diff / 1000)) + T(" 秒前");
			if (diff < 3600e3) return Math.round(diff / 60e3) + T(" 分钟前");
			if (diff < 86400e3) return Math.round(diff / 3600e3) + T(" 小时前");
			return Math.round(diff / 86400e3) + T(" 天前");
		}

		function fmtSize(n) {
			if (typeof n !== "number") return "";
			if (n < 1024) return n + " B";
			if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
			return (n / 1024 / 1024).toFixed(2) + " MB";
		}

		async function api(path, body) {
			const init = body === undefined ? {} : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) };
			let response;
			try { response = await fetch(path, init); }
			catch { return { ok: false, reason: "network-error" }; }
			const text = await response.text();
			try {
				return JSON.parse(text);
			} catch {
				return { ok: false, reason: "bad-json", status: response.status, raw: text.slice(0, 200) };
			}
		}

		/**
		 * Poll a JSON endpoint. `interval` of 0 fetches once.
		 * Keeps the last good value when a poll fails so the UI never blanks.
		 */
		function useJson(url, interval) {
			const [state, setState] = useState({ data: undefined, error: undefined, loading: true });
			const alive = useRef(true);
			useEffect(() => {
				alive.current = true;
				let timer;
				const tick = async () => {
					try {
						const data = await api(url);
						if (!alive.current) return;
						setState({ data, error: undefined, loading: false });
					} catch (error) {
						if (!alive.current) return;
						setState((prev) => ({ data: prev.data, error: String(error), loading: false }));
					}
					if (interval > 0 && alive.current) timer = setTimeout(tick, interval);
				};
				tick();
				return () => {
					alive.current = false;
					clearTimeout(timer);
				};
			}, [url, interval]);
			return state;
		}

		/* ────────────────────────────── icon ────────────────────────────── */

		/** Sidebar glyph: a workstation screen with a card chain on it. */
		function LcStationIcon(props) {
			const size = (props && props.size) || 18;
			return h(
				"svg",
				{ width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
				h("rect", { x: 2.5, y: 4, width: 19, height: 13, rx: 2.2, stroke: "currentColor", strokeWidth: 1.6 }),
				h("path", { d: "M8 21h8", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" }),
				h("path", { d: "M12 17v4", stroke: "currentColor", strokeWidth: 1.6 }),
				h("rect", { x: 5.5, y: 7, width: 4.4, height: 3, rx: 0.9, fill: "currentColor", opacity: 0.85 }),
				h("rect", { x: 5.5, y: 11.4, width: 4.4, height: 2.6, rx: 0.9, fill: "currentColor", opacity: 0.5 }),
				h("rect", { x: 11.2, y: 7, width: 7.3, height: 7, rx: 1.1, fill: "currentColor", opacity: 0.28 })
			);
		}

		/* ────────────────────────────── canvas ────────────────────────────── */

		const KIND_GLYPH = {
			"read-file": "◍",
			"write-file": "✎",
			"run-cmd": "▶",
			"spawn-subagent": "⌥",
			web: "◎",
			deliverable: "★",
			todo: "☑",
			compact: "≡",
			job: "⚙",
			approval: "⚑",
			tool: "•"
		};

		/* ── 无限画布 ────────────────────────────────────────────────────────
		 * 和原程序一样是一张可以随便拖、随便缩放的平面：横轴 = 分支（并联），
		 * 纵轴 = 同一条链上的先后（串联）。世界层只有一个 transform，
		 * 卡片只按 id 增量挂载，历史永远不重建。 */
		const NODE_W = 420;
		const COL_GAP = 56;
		const ROW_GAP = 18;
		const NODE_H = 212;

		/** 把卡片摊到平面上：lane → 列，链内次序 → 行。
		 *  列太多会摊成一条读不了的细线，所以每行最多 COLS_PER_ROW 列，超出的换行继续排；
		 *  同一行里的列 = 并联，行内向下 = 串联，换行只是排版，不代表依赖。 */
		const COLS_PER_ROW = 4;

		/* 视口剔除：只把画面里的卡交给 React。世界坐标 → 屏幕坐标 = 先缩放再平移。
		 * 上限 MAX_RENDER 张（超出按离视口中心最近取），保证拖拽时 DOM 数量有界。 */
		const MAX_RENDER = 220;
		const CULL_PAD = 260;

		function cullNodes(nodes, view, size) {
			const vw = size.w || 1200;
			const vh = size.h || 800;
			const w = NODE_W * view.k;
			const hgt = NODE_H * view.k;
			const cx = vw / 2;
			const cy = vh / 2;
			const hits = [];
			for (const node of nodes) {
				const sx = node.x * view.k + view.x;
				const sy = node.y * view.k + view.y;
				if (sx + w < -CULL_PAD || sx > vw + CULL_PAD) continue;
				if (sy + hgt < -CULL_PAD || sy > vh + CULL_PAD) continue;
				hits.push(node);
			}
			if (hits.length <= MAX_RENDER) return hits;
			hits.sort((a, b) => {
				const da = (a.x * view.k + view.x - cx) ** 2 + (a.y * view.k + view.y - cy) ** 2;
				const db = (b.x * view.k + view.x - cx) ** 2 + (b.y * view.k + view.y - cy) ** 2;
				return da - db;
			});
			return hits.slice(0, MAX_RENDER);
		}

		/* ─────────────── 层次化：轮次 → 步骤组 → 卡片 ───────────────
		 * 用户要的是「一条骨干链 + 可展开的组」，不是几百张卡平铺。
		 * 顶层只画「轮」：一轮 = 一块彩色区域，写这一轮的概述；
		 * 点开成浮窗，里面按骨干顺序排：你说 → 计划 → 步骤 1..N（各是组） → AI 回复；
		 * 再点步骤组，又开一层浮窗，直到最小层直接是卡片原文。 */

		const TURN_HUES = [212, 268, 158, 32, 336, 190, 96, 288];

		function turnHue(turn) {
			const n = TURN_HUES.length;
			return TURN_HUES[((turn ?? 1) - 1 + n * 100) % n];
		}

		function short(text, max) {
			const line = String(text ?? "").replace(/\s+/g, " ").trim();
			return line.length > max ? line.slice(0, max - 1) + "…" : line;
		}

		/** 一轮对话压成骨干：你说 → 计划 → 各步骤组 → AI 回复。 */
		function buildTurn(turnCards) {
			const turn = turnCards.length > 0 ? turnCards[0].band ?? 1 : 1;
			const items = [];

			// 首条用户消息提到最前面
			const firstUser = turnCards.find((c) => c.kind === "msg-user");
			const lastAi = [...turnCards].reverse().find((c) => c.kind === "msg-ai");
			if (firstUser !== undefined) items.push({ kind: "card", card: firstUser });

			// 计划卡（todo）单独提出来
			const planCard = turnCards.find((c) => c.kind === "todo");
			if (planCard !== undefined) items.push({ kind: "card", card: planCard });

			// 中间的每一步动作：动作多了就压成组（每组 ≤6 项，组内还能再分）
			const middle = turnCards.filter((card) => card !== firstUser && card !== planCard && card !== lastAi);
			for (const item of groupChildren(middle, turn)) items.push(item);
			// AI 的收尾回复放最后当「结果」
			if (lastAi !== undefined && lastAi !== firstUser && lastAi !== planCard) {
				items.push({ kind: "card", card: lastAi });
			}

			const plan = planCard ? short(planCard.result || planCard.sub || "", 90) : "";
			const intro = firstUser ? short(firstUser.sub, 70) : "";
			const outro = lastAi ? short(lastAi.sub, 70) : "";
			const count = turnCards.length;
			return {
				id: "turn-" + turn,
				turn,
				hue: turnHue(turn),
				title: T("第 ") + turn + T(" 轮"),
				count,
				intro,
				plan,
				outro,
				items,
				desc: intro || outro || plan || count + T(" 个动作")
			};
		}

		/* 把一轮的中间卡片切成组，优先保证「一条串行链不被切断」：
		 * 只有当下一个卡与本组没有依赖关系、且本组已经装够时，才在这里收口；
		 * 若组数仍超过 6，就放大每组的容量重来（放大只会减少组数，不会再切链）。 */
		function chunkByChain(cards, maxGroups) {
			const chunks = [];
			let size = Math.max(3, Math.ceil(cards.length / maxGroups));
			for (let attempt = 0; attempt <= cards.length; attempt++, size++) {
				chunks.length = 0;
				let start = 0;
				while (start < cards.length) {
					const ids = new Set();
					let end = start;
					while (end < cards.length) {
						const card = cards[end];
						const linked = card.predecessorId !== undefined && card.predecessorId !== null && ids.has(card.predecessorId);
						const filled = end - start >= size;
						if (filled && !linked) break;
						if (end - start >= size + 24) break;
						ids.add(card.id);
						end += 1;
					}
					chunks.push(cards.slice(start, end));
					start = end;
				}
				if (chunks.length <= maxGroups) return chunks;
			}
			return chunks;
		}

		function groupChildren(cards, step) {
			if (cards.length <= 6) return cards.map((card) => ({ kind: "card", card }));
			const parts = chunkByChain(cards, 6);
			const chunks = [];
			for (const part of parts) {
				if (part.length < 3) chunks.push(...part.map((card) => ({ kind: "card", card })));
				else chunks.push({ kind: "group", step: String(step) + "." + (chunks.length + 1), cards: part });
			}
			return chunks;
		}

		function buildTurns(cards) {
			const byTurn = new Map();
			for (const card of cards) {
				const band = card.band ?? 1;
				if (!byTurn.has(band)) byTurn.set(band, []);
				byTurn.get(band).push(card);
			}
			return [...byTurn.keys()].sort((a, b) => a - b).flatMap((band) => {
				const turn = buildTurn(byTurn.get(band));
				return turn.items.map((item, index) => {
					const cards = item.kind === "card" ? [item.card] : item.cards;
					const first = cards[0];
					return { ...turn, id: "turn-" + band + "-" + (item.kind === "card" ? first.id : "step-" + item.step), item, cards, title: item.kind === "card" ? first.title : T("步骤 ") + item.step, desc: short(first.sub || first.title, 70), count: cards.length, items: item.kind === "group" ? groupChildren(item.cards, item.step) : [] };
				});
			});
		}

		/* ── 任务链：同一件事的轮次串成一条链，不同任务各占一条链（互不连线） ───────── */

		const CN_DIGIT = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };

		function backRefTo(text) {
			const source = (text || "").slice(0, 200);
			const ordinal = source.match(/第\s*([一二两三四五六七八九十\d]{1,3})\s*(?:部分|块|件事|个问题|个任务|条)/);
			if (ordinal !== null) {
				const raw = ordinal[1];
				const n = /^\d+$/.test(raw) ? Number(raw) : CN_DIGIT[raw] ?? NaN;
				if (Number.isFinite(n) && n >= 1) return n;
			}
			if (/(回到|接着|继续做|续做).{0,8}(前面|之前|刚才|原来|第一|上一条|老任务)/.test(source)) return -1;
			if (/(前面|之前|刚才|第一部分).{0,8}(那个|未完成|遗漏|漏掉|忘了)/.test(source)) return -1;
			return null;
		}

		/* 「另开一件事」的说法：这时候不接着上一个链，另起一条 */
		function newTaskCue(text) {
			const source = (text || "").slice(0, 160);
			if (/(另一件|另外一个任务|换个话题|换个任务|新任务|新问题|重新开始|先放一放|先不管这个|顺便问|另外问)/.test(source)) return true;
			if (/(^|\n)\s*(接下来|下一步)?\s*(我想|我要|帮我|需要你)(做|改|写|建|搭|重写)/.test(source) && source.length < 40) return true;
			return false;
		}

		function wordsOfText(text) {
			const out = new Set();
			for (const chunk of (text || "").split(/[^\p{L}\p{N}]+/u)) {
				const word = chunk.trim().toLowerCase();
				if (word.length >= 2) out.add(word);
			}
			return out;
		}

		function splitTurnItems(items) {
			const head = items.find((it) => it.item.kind === "card" && it.item.card.kind === "msg-user");
			const plan = items.find((it) => it.item.kind === "card" && it.item.card.kind === "todo");
			const reply = [...items].reverse().find((it) => it.item.kind === "card" && it.item.card.kind === "msg-ai");
			const rest = items.filter((it) => it !== head && it !== plan && it !== reply && (it.cards === undefined || it.cards.length > 0));
			return { head, plan, reply, rest };
		}

		/** 把轮次分组成任务链：默认接到最近在做的链；用户明确指代「第 N 部分」才跨链；
		 * 用户说「另外一件事」就另起一条；overrides（轮次 → 链号，来自拖拽）优先级最高。 */
		function buildChains(turns, overrides) {
			const forced = overrides || {};
			const byTurn = new Map();
			for (const item of turns) {
				if (!byTurn.has(item.turn)) byTurn.set(item.turn, []);
				byTurn.get(item.turn).push(item);
			}
			const bands = [...byTurn.keys()].sort((a, b) => a - b);
			const chains = [];
			const maxForced = Math.max(0, ...Object.values(forced).map(Number).filter((n) => Number.isFinite(n) && n > 0));
			for (let index = 0; index < maxForced; index++) chains.push({ index: index + 1, turns: [], words: new Set(), items: [] });
			let current = null;
			for (const band of bands) {
				const items = byTurn.get(band);
				const userText = items
					.filter((it) => it.item.kind === "card" && it.item.card.kind === "msg-user")
					.map((it) => (it.item.card.sub || "") + " " + (it.item.card.detail || ""))
					.join(" ");
				const synthetic = userText.trim() === "" || /^(time sampled|<goal_round>|continued|继续$)/i.test(userText.trim());
				let target = current;
				const pick = forced[band];
				if (pick === 0) {
					target = null;
				} else if (pick !== undefined && chains[pick - 1] !== undefined) {
					target = chains[pick - 1];
				} else {
					const ref = synthetic ? null : backRefTo(userText);
					if (ref !== null && chains.length > 0) {
						if (ref === -1) {
							const words = wordsOfText(userText);
							let best = null;
							for (const chain of chains) {
								let hit = 0;
								for (const word of words) if (chain.words.has(word)) hit += 1;
								if (best === null || hit > best.hit) best = { chain, hit };
							}
							target = best !== null && best.hit > 0 ? best.chain : current;
						} else if (chains[ref - 1] !== undefined) {
							target = chains[ref - 1];
						}
					} else if (!synthetic && newTaskCue(userText)) {
						target = null;
					}
				}
				if (target === null || target === undefined) {
					target = { index: chains.length + 1, turns: [], words: new Set(), items: [] };
					chains.push(target);
				}
				target.turns.push(band);
				target.items.push({ band, items });
				for (const word of wordsOfText(userText)) target.words.add(word);
				current = target;
			}
			return chains;
		}

		const CHAIN_GAP_X = 110;
		const CHAIN_GAP_Y = 170;
		const LANE_GAP = 18;

		/** 一条链：轮次从左往右；每轮内部是「你说 → 计划 → 若干并列分支 → 回复」。 */
		function layoutTaskChain(chain) {
			const nodes = [];
			const edges = [];
			let offsetX = 0;
			let chainTop = Infinity;
			let chainBottom = -Infinity;
			let prevTail = null;
			for (const { band, items } of chain.items) {
				const { head, plan, reply, rest } = splitTurnItems(items);
				const rows = rest.map((it) => {
					const first = it.cards[0];
					return { key: it.id, item: it, cards: it.cards, w: it.item.kind === "group" ? 320 : 420, h: it.item.kind === "group" ? 158 : 212, pred: first === undefined ? undefined : first.predecessorId };
				});
				const laneEdges = [];
				for (const row of rows) {
					if (row.pred === undefined) continue;
					for (const other of rows) {
						if (other === row) continue;
						if (other.cards.some((card) => card.id === row.pred)) laneEdges.push({ key: "le-" + other.key + "-" + row.key, a: other.key, b: row.key });
					}
				}
				const lanes = rows.length > 0 ? placeLanes(rows, laneEdges, 72, LANE_GAP) : 0;
				let blockW = 0;
				let blockH = 212;
				for (const row of rows) {
					blockW = Math.max(blockW, row.x + row.w);
					blockH = Math.max(blockH, row.y + row.h);
				}
				const placed = { lanes, width: blockW, height: blockH, rows };
				const blockTop = -placed.height / 2;
				const headW = head === undefined ? 0 : 420;
				const planW = plan === undefined ? 0 : 420;
				const baseX = offsetX + (headW > 0 ? headW + 72 : 0) + (planW > 0 ? planW + 72 : 0);
				let maxX = offsetX;
				const push = (item, x, y, w, h, extra) => {
					nodes.push({ key: item.id, turn: { ...item, turn: band }, item: item.item, chains: { index: chain.index, first: prevTail === undefined }, x, y, w, h, ...(extra || {}) });
					maxX = Math.max(maxX, x + w);
				};
				if (head !== undefined) push(head, offsetX, blockTop + placed.height / 2 - 106, 420, 212);
				if (plan !== undefined) push(plan, offsetX + headW + 72, blockTop + placed.height / 2 - 106, 420, 212);
				for (const row of placed.rows) push(row.item, baseX + row.x, blockTop + row.y, row.w, row.h);
				const entry = plan !== undefined ? plan : head;
				for (const row of placed.rows) {
					if (laneEdges.some((edge) => edge.b === row.key)) continue;
					if (entry !== undefined) edges.push({ key: "in-" + entry.id + "-" + row.key, a: entry.id, b: row.key });
				}
				for (const edge of laneEdges) edges.push({ key: edge.key, a: edge.a, b: edge.b });
				const tailKey = reply !== undefined ? reply.id : placed.rows.length > 0 ? placed.rows[placed.rows.length - 1].key : head === undefined ? undefined : head.id;
				if (reply !== undefined) {
					push(reply, maxX + 72, blockTop + placed.height / 2 - 106, 420, 212);
					for (const row of placed.rows) {
						const hasNext = laneEdges.some((edge) => edge.a === row.key);
						if (!hasNext) edges.push({ key: "out-" + row.key + "-" + reply.id, a: row.key, b: reply.id });
					}
					if (placed.rows.length === 0 && entry !== undefined) edges.push({ key: "out-" + entry.id + "-" + reply.id, a: entry.id, b: reply.id });
				}
				chainTop = Math.min(chainTop, blockTop);
				chainBottom = Math.max(chainBottom, blockTop + placed.height);
				if (prevTail !== undefined && head !== undefined) edges.push({ key: "turn-" + prevTail + "-" + head.id, a: prevTail, b: head.id });
				prevTail = tailKey;
				offsetX = maxX + CHAIN_GAP_X;
			}
			return { nodes, edges, width: offsetX, top: chainTop === Infinity ? 0 : chainTop, bottom: chainBottom === -Infinity ? 0 : chainBottom };
		}

		/** 顶层：每条任务链一行，链内轮次从左往右，链与链之间留大间隔、互不连接。 */
		function layoutChains(chains) {
			const nodes = [];
			const edges = [];
			let offsetY = 0;
			for (const chain of chains) {
				const local = layoutTaskChain(chain);
				const shift = offsetY - local.top;
				for (const node of local.nodes) nodes.push({ ...node, y: node.y + shift });
				for (const edge of local.edges) edges.push(edge);
				offsetY += local.bottom - local.top + CHAIN_GAP_Y;
			}
			return { nodes, edges, chains };
		}

		const TURN_W = 460;
		const TURN_H = 168;
		const TURN_GAP = 96;
		/** 顶层排布的换行宽度：一轮块放不下就折到下一行，世界保持接近正方形。 */
		const ROW_W = 2600;
		const ROW_BAND_GAP = 112;

		/* 边的几何只由两端节点决定：源节点右边中点 → 目标节点左边中点。
		 * 拖动节点时调用方传进来的就是移动后的坐标，所以线一定跟着卡走。 */
		function edgePath(a, b) {
			const x1 = a.x + a.w;
			const y1 = a.y + a.h / 2;
			const x2 = b.x;
			const y2 = b.y + b.h / 2;
			const bend = Math.max(48, Math.abs(x2 - x1) * 0.46);
			return (
				"M " + x1 + " " + y1 +
				" C " + (x1 + bend) + " " + y1 + ", " + (x2 - bend) + " " + y2 + ", " + x2 + " " + y2
			);
		}

		/** 顶层的顺序排布：一轮内部就是「你说 → 计划 → 步骤… → 收尾」一条直线。
		 * 顶层的先后是时间顺序，不靠依赖推；并列只发生在组里面。 */
		/* 一轮内部的形状：主轴（你说 → AI 回复）始终保持一条水平线，先后看主轴；
		 * 中间的并列块在主轴【上下交错】排开，看分支。这样「前后顺序」和「分支」同时都在，
		 * 一轮不会因为并列多就把整块世界拉成一堵墙。 */
		function layoutSeq(items) {
			const GAP_X = 72;
			const GAP_Y = 20;
			const SPINE = 0;
			const rows = items.map((item, index) => ({
				key: item.kind + ":" + (item.card ? item.card.id : "s" + item.step + ":" + index),
				item,
				x: 0,
				y: 0,
				w: item.kind === "group" ? 320 : 420,
				h: item.kind === "group" ? 158 : 212
			}));
			const edges = [];
			if (rows.length === 0) return { rows, edges, width: 0, height: 0, spine: SPINE };
			if (rows.length <= 2) {
				let x = 0;
				for (const row of rows) {
					row.x = x;
					row.y = SPINE - row.h / 2;
					x += row.w + GAP_X;
				}
				for (const [index, row] of rows.entries()) {
					if (index > 0) edges.push({ key: "sq-" + rows[index - 1].key + "-" + row.key, a: rows[index - 1].key, b: row.key });
				}
				return { rows, edges, width: x - GAP_X, height: Math.max(...rows.map((row) => row.h)), top: -Math.max(...rows.map((row) => row.h)) / 2, spine: SPINE };
			}
			const head = rows[0];
			const tail = rows[rows.length - 1];
			const middle = rows.slice(1, -1);
			const branchW = Math.max(...middle.map((row) => row.w));
			head.x = 0;
			head.y = SPINE - head.h / 2;
			const branchX = head.w + GAP_X;
			// 第 1 块挂上方第 1 层，第 2 块挂下方第 1 层，第 3 块上方第 2 层……上下交错，避免一条竖墙。
			let up = 0;
			let down = 0;
			for (const [index, row] of middle.entries()) {
				row.x = branchX + (branchW - row.w) / 2;
				if (index % 2 === 0) {
					row.y = SPINE - row.h / 2 - (up + 1) * (row.h + GAP_Y);
					up += 1;
				} else {
					row.y = SPINE - row.h / 2 + (down + 1) * (row.h + GAP_Y);
					down += 1;
				}
				edges.push({ key: "sq-head-" + head.key + "-" + row.key, a: head.key, b: row.key });
				edges.push({ key: "sq-tail-" + row.key + "-" + tail.key, a: row.key, b: tail.key });
			}
			tail.x = branchX + branchW + GAP_X;
			tail.y = SPINE - tail.h / 2;
			const width = Math.max(...rows.map((row) => row.x + row.w));
			const top = Math.min(...rows.map((row) => row.y));
			const bottom = Math.max(...rows.map((row) => row.y + row.h));
			return { rows, edges, width, height: bottom - top, top, spine: SPINE };
		}

		/** 顶层：任务链布局。返回 { nodes, edges, chains }，chains 里带着每轮的归属。 */
		function layoutTurns(turns, overrides) {
			return layoutChains(buildChains(turns, overrides));
		}

		/** 窗口里：横向链，一条链从左往右；组是链上的一格。 */
		const CHAIN_GAP = 72;
		/** 泳道排布：每个「起点」占一条泳道（=并列），同泳道内后继依次右移（=先后）。
		 * 一个节点有两个以上后继时，第一个留在本泳道，其余各自另起一条泳道（=分叉）。 */
		function placeLanes(rows, edges, gapX, gapY) {
			const succ = new Map(rows.map((row) => [row.key, []]));
			const indeg = new Map(rows.map((row) => [row.key, 0]));
			for (const edge of edges) {
				succ.get(edge.a).push(edge.b);
				indeg.set(edge.b, (indeg.get(edge.b) ?? 0) + 1);
			}
			const laneOf = new Map();
			const colOf = new Map();
			let lane = 0;
			const visit = (key, laneIndex, col) => {
				if (laneOf.has(key)) return;
				laneOf.set(key, laneIndex);
				colOf.set(key, col);
				const kids = succ.get(key).filter((kid) => !laneOf.has(kid));
				for (const [index, kid] of kids.entries()) visit(kid, index === 0 ? laneIndex : lane++, col + 1);
			};
			for (const row of rows) if ((indeg.get(row.key) ?? 0) === 0) visit(row.key, lane++, 0);
			for (const row of rows) if (!laneOf.has(row.key)) visit(row.key, lane++, 0);
			const heights = new Map();
			for (const row of rows) heights.set(laneOf.get(row.key), Math.max(heights.get(laneOf.get(row.key)) ?? 0, row.h));
			const tops = new Map();
			let cursor = 0;
			for (const index of [...heights.keys()].sort((a, b) => a - b)) {
				tops.set(index, cursor);
				cursor += heights.get(index) + gapY;
			}
			for (const row of rows) {
				const column = colOf.get(row.key);
				row.x = column * (row.w + gapX);
				row.y = tops.get(laneOf.get(row.key)) + (heights.get(laneOf.get(row.key)) - row.h) / 2;
			}
			return lane;
		}

		function layoutChain(items) {
			const edges = [];
			const rows = items.map((item, index) => {
				const cards = item.kind === "group" ? item.cards : [item.card];
				const row = {
					key: item.kind + ":" + (item.card ? item.card.id : "s" + item.step + ":" + index),
					item,
					x: 0,
					y: 0,
					w: item.kind === "group" ? 320 : 420,
					h: item.kind === "group" ? 158 : 212
				};
				return row;
			});
			const owner = new Map();
			for (const row of rows) {
				const cards = row.item.kind === "group" ? row.item.cards : [row.item.card];
				for (const card of cards) owner.set(card.id, row);
			}
			for (const row of rows) {
				const cards = row.item.kind === "group" ? row.item.cards : [row.item.card];
				for (const card of cards) {
					const previous = owner.get(card.predecessorId);
					if (previous && previous !== row && !edges.some((edge) => edge.a === previous.key && edge.b === row.key)) {
						edges.push({ key: "ce-" + previous.key + "-" + row.key, a: previous.key, b: row.key });
					}
				}
			}
			const lanes = placeLanes(rows, edges, CHAIN_GAP, 22);
			const width = Math.max(0, ...rows.map((r) => r.x + r.w));
			const height = Math.max(0, ...rows.map((r) => r.y + r.h));
			return { rows, edges, width, height, lanes };
		}

		function refreshFrame(frame, cards) {
			if (frame.liveGroup) {
				const turn = buildTurn(cards.filter((card) => (card.band ?? 1) === frame.liveGroup.band));
				let group = turn.items.find((item) => item.kind === "group" && item.step === frame.liveGroup.step);
				let single;
				for (const anchor of frame.liveGroup.anchors || []) {
					if (!group) break;
					const item = groupChildren(group.cards, group.step).find((candidate) => candidate.kind === "group" ? candidate.cards.some((card) => card.id === anchor) : candidate.card.id === anchor);
					group = item?.kind === "group" ? item : undefined;
					if (item?.kind === "card") { single = item; break; }
				}
				if (group) frame = { ...frame, items: groupChildren(group.cards, group.step) };
				else if (single) frame = { ...frame, items: [single] };
				else {
					const ids = new Set(frame.items.flatMap((item) => item.kind === "group" ? item.cards.map((card) => card.id) : [item.card.id]));
					frame = { ...frame, items: cards.filter((card) => ids.has(card.id)).map((card) => ({ kind: "card", card })) };
				}
			}
			const latest = new Map(cards.map((card) => [card.id, card]));
			const update = (card) => latest.get(card.id) || card;
			return {
				...frame,
				detailCard: frame.detailCard ? update(frame.detailCard) : frame.detailCard,
				items: frame.items.map((item) => item.kind === "group"
					? { ...item, cards: item.cards.map(update) }
					: { ...item, card: update(item.card) })
			};
		}

		function byKey(list, key) {
			for (const row of list) if (row.key === key) return row;
			return undefined;
		}

		function cullNodes(nodes, view, size) {
			const vw = size.w || 1200;
			const vh = size.h || 800;
			const pad = 320;
			const hits = [];
			for (const node of nodes) {
				const sx = node.x * view.k + view.x;
				const sy = node.y * view.k + view.y;
				const w = (node.w || NODE_W) * view.k;
				const h = (node.h || NODE_H) * view.k;
				if (sx + w < -pad || sx > vw + pad) continue;
				if (sy + h < -pad || sy > vh + pad) continue;
				hits.push(node);
			}
			return hits;
		}

		/* 默认视角：沿用「自适应」算出的缩放比例（整块世界的比例尺），
		 * 但把视口中心对到「最后几轮」，而不是世界左上角或世界正中心。 */
		function viewFocus(nodes, width, height, turns = 3) {
			if (nodes.length === 0) return { x: 48, y: 44, k: 1 };
			const base = fitView(nodes, width, height);
			const bands = [...new Set(nodes.map((node) => node.turn?.turn ?? 0))].sort((a, b) => a - b);
			const tailBands = new Set(bands.slice(Math.max(0, bands.length - turns)));
			let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
			for (const node of nodes) {
				if (!tailBands.has(node.turn?.turn ?? 0)) continue;
				minX = Math.min(minX, node.x);
				maxX = Math.max(maxX, node.x + (node.w || NODE_W));
				minY = Math.min(minY, node.y);
				maxY = Math.max(maxY, node.y + (node.h || NODE_H));
			}
			const cx = (minX + maxX) / 2;
			const cy = (minY + maxY) / 2;
			return { k: base.k, x: width / 2 - cx * base.k, y: height / 2 - cy * base.k };
		}

		function boundsOf(nodes) {
			let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
			for (const node of nodes) {
				minX = Math.min(minX, node.x);
				minY = Math.min(minY, node.y);
				maxX = Math.max(maxX, node.x + (node.w || NODE_W));
				maxY = Math.max(maxY, node.y + (node.h || NODE_H));
			}
			if (minX === Infinity) return { minX: 0, minY: 0, w: 1, h: 1 };
			return { minX, minY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) };
		}

		function fitView(nodes, width, height) {
			if (nodes.length === 0) return { x: 48, y: 44, k: 1 };
			let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
			for (const node of nodes) {
				minX = Math.min(minX, node.x);
				maxX = Math.max(maxX, node.x + (node.w || NODE_W));
				minY = Math.min(minY, node.y);
				maxY = Math.max(maxY, node.y + (node.h || NODE_H));
			}
			const pad = 64;
			// 「自适应」优先保证看清楚：整块世界塞得下时按比例缩，塞不下就停在可读下限，
			// 剩下的靠平移/滚轮——缩到 19% 那种「全都看得见但谁都读不出」不算自适应。
			const FIT_MIN_K = 0.34;
			const k = Math.max(FIT_MIN_K, Math.min(1.05, Math.min((width - pad * 2) / Math.max(1, maxX - minX), (height - pad * 2) / Math.max(1, maxY - minY))));
			return {
				k,
				x: (maxX - minX) * k > width - pad * 2 ? pad - minX * k : (width - (maxX - minX) * k) / 2 - minX * k,
				y: (maxY - minY) * k > height - pad * 2 ? pad - minY * k : (height - (maxY - minY) * k) / 2 - minY * k
			};
		}

		/** 顶层的一张「轮」卡：一块颜色区域，写概述和连接关系。 */
		const TurnCard = memo(function TurnCard({ turn, lod, onOpen }) {
			const style = { "--hue": String(turn.hue) };
			if (lod === "tiny") {
				return h(
					"button",
					{ className: "lcs-tcard tiny", style, onClick: onOpen, title: turn.title + " · " + turn.desc },
					h("span", { className: "lcs-tcard-no" }, turn.title),
					h("span", { className: "lcs-tcard-desc" }, short(turn.desc, 12))
				);
			}
			if (lod === "head") {
				return h(
					"button",
					{ className: "lcs-tcard head", style, onClick: onOpen, title: turn.desc },
					h("span", { className: "lcs-tcard-no" }, turn.title),
					h("span", { className: "lcs-tcard-desc" }, short(turn.desc, 18))
				);
			}
			return h(
				"button",
				{ className: "lcs-tcard", style, onClick: onOpen },
				h(
					"div",
					{ className: "lcs-tcard-top" },
					h("span", { className: "lcs-tcard-no" }, turn.title),
					h("span", { className: "lcs-tcard-count" }, turn.count + T(" 个动作")),
					h("span", { className: "lcs-tcard-open" }, T("展开"))
				),
				turn.intro ? h("div", { className: "lcs-tcard-row" }, h("b", null, T("你说")), h("span", null, turn.intro)) : null,
				turn.plan ? h("div", { className: "lcs-tcard-row" }, h("b", null, T("计划")), h("span", null, turn.plan)) : null,
				h(
					"div",
					{ className: "lcs-tcard-steps" },
					turn.items.slice(0, 6).map((item) =>
						h(
							"span",
							{ key: item.kind + (item.card ? item.card.id : item.step), className: "lcs-chipx" + (item.kind === "group" ? " grp" : "") },
							item.kind === "group" ? T("步 ") + (item.step ?? 0) + " · " + item.cards.length : (DISPLAY_KIND[item.card.kind] ?? "note")
						)
					),
					turn.items.length > 6 ? h("span", { className: "lcs-chipx" }, "+" + (turn.items.length - 6)) : null
				),
				turn.outro ? h("div", { className: "lcs-tcard-row out" }, h("b", null, T("结果")), h("span", null, turn.outro)) : null
			);
		});

		/** 组内缩略：有依赖的按「列＝先后、同列＝并列」画，没依赖的退回 3 列网格。 */
		const MINI_COLS = 3;
		const MINI_W = 98;
		const MINI_H = 54;
		const MINI_GAP = 10;
		function miniLayout(children) {
			const rows = children.map((item, index) => ({
				key: item.kind + ":" + (item.card ? item.card.id : "m" + item.step + ":" + index),
				item,
				x: 0,
				y: 0,
				w: MINI_W,
				h: MINI_H
			}));
			const owner = new Map();
			for (const row of rows) for (const card of row.item.kind === "group" ? row.item.cards : [row.item.card]) owner.set(card.id, row);
			const edges = [];
			for (const row of rows) {
				for (const card of row.item.kind === "group" ? row.item.cards : [row.item.card]) {
					const from = owner.get(card.predecessorId);
					if (from && from !== row && !edges.some((edge) => edge.a === from.key && edge.b === row.key)) edges.push({ key: "me-" + from.key + "-" + row.key, a: from.key, b: row.key });
				}
			}
			// 泳道排布：并列各占一行，先后在行内右移；分叉另起一行
			const lanes = placeLanes(rows, edges, MINI_GAP, 6);
			const width = rows.reduce((max, row) => Math.max(max, row.x + row.w), MINI_W);
			const height = rows.reduce((max, row) => Math.max(max, row.y + row.h), MINI_H);
			return { rows, edges, width, height, lanes };
		}

		/** 浮窗里的「步骤组」：彩色区域 + 里面几条概述。 */
		const DIGEST_LABEL = { "read-file": "读", "write-file": "写", "run-cmd": "跑", web: "联网", "spawn-subagent": "子体", tool: "工具", todo: "待办", deliverable: "产出", note: "备注", turn: "轮次", "msg-user": "你说", "msg-ai": "回复", job: "后台", compact: "压缩" };
		const TOOL_KINDS = new Set(["read-file", "write-file", "run-cmd", "web", "spawn-subagent", "tool"]);

		/** Rule-based digest of what a group actually did: action kinds and the top tools. */
		function groupDigest(cards) {
			const kinds = new Map();
			const tools = new Map();
			for (const card of cards) {
				kinds.set(card.kind, (kinds.get(card.kind) ?? 0) + 1);
				const name = TOOL_KINDS.has(card.kind) && typeof card.sub === "string" && card.sub !== "" ? card.sub : undefined;
				if (name !== undefined) tools.set(name, (tools.get(name) ?? 0) + 1);
			}
			const ORDER = ["read-file", "write-file", "run-cmd", "web", "spawn-subagent", "tool"];
			const parts = [...kinds.entries()]
				.sort((a, b) => (ORDER.indexOf(a[0]) - ORDER.indexOf(b[0])) || b[1] - a[1])
				.map(([kind, n]) => (T(DIGEST_LABEL[kind] ?? kind)) + "×" + n);
			const top = [...tools.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([name, n]) => short(name, 16) + (n > 1 ? "×" + n : ""));
			return { tally: parts.join(" · "), tools: top.join("，") };
		}

		function GroupRow({ group, hue, onOpen }) {
			const mini = miniLayout(groupChildren(group.cards, group.step));
			const miniHeight = 90;
			return h(
				"button",
				{ className: "lcs-grow-row", style: { "--hue": String(hue) }, onClick: onOpen },
				h(
					"div",
					{ className: "lcs-grow-head" },
					h("span", { className: "lcs-grow-no" }, T("步 ") + (group.step ?? 0)),
					h("span", { className: "lcs-grow-count" }, group.cards.length + T(" 个动作") + (mini.lanes > 1 ? T(" · 并行 ") + mini.lanes + T(" 路") : "")),
					h("span", { className: "lcs-grow-open" }, T("展开"))
				),
				h("svg", { className: "lcs-mini-map", viewBox: "-6 -6 " + Math.max(1, mini.width + 12) + " " + Math.max(1, mini.height + 12), preserveAspectRatio: "xMidYMid meet", height: miniHeight, "aria-label": T("组内节点及依赖预览") },
					mini.edges.map((edge) => h("path", { key: edge.key, d: edgePath(byKey(mini.rows, edge.a), byKey(mini.rows, edge.b)), fill: "none", stroke: "currentColor", strokeWidth: 2, opacity: .55 })),
					mini.rows.map((row) => {
						const first = row.item.kind === "group" ? row.item.cards[0] : row.item.card;
						const label = first?.title || first?.sub || T("未命名");
						return h("g", { key: row.key },
							h("title", null, label),
							h("rect", { x: row.x, y: row.y, width: row.w, height: row.h, rx: 7, className: "lcs-mini-node" + (row.item.kind === "group" ? " grp" : "") }),
							h("text", { x: row.x + 6, y: row.y + 30, fill: "currentColor", fontSize: 10, pointerEvents: "none" }, short(label, 8))
						);
					})
				),
				(() => {
					const digest = groupDigest(group.cards);
					return h("div", { className: "lcs-grow-more" },
						h("span", { className: "lcs-gsum-tally" }, digest.tally),
						digest.tools === "" ? null : h("span", { className: "lcs-gsum-tools" }, digest.tools)
					);
				})()
			);
		}

		/* 画布内的浮窗：标题栏拖动、× 关闭；内部是一条横向链 + 真实连线。
		 * 关闭按钮单独吃 pointerdown，标题栏的拖拽不吞掉它的 click。 */
		function StackWindow({ frame, depth, onClose, onPush }) {
			const [offsets, setOffsets] = useState({});
			const [pan, setPan] = useState({ x: 32, y: 32 });
			const panDragRef = useRef(null);
			const suppressClickRef = useRef(false);
			const chain = layoutChain(frame.items);
			const position = (row) => {
				const off = offsets[row.key] || { dx: 0, dy: 0 };
				return { ...row, x: row.x + off.dx, y: row.y + off.dy };
			};
			const startNodeDrag = (e, row) => {
				if (e.button !== 0 || e.target.closest(".cv-out, .cv-run-out, .cv-note, .cv-cmd, pre")) return;
				suppressClickRef.current = false;
				const off = offsets[row.key] || { dx: 0, dy: 0 };
				const startX = e.clientX, startY = e.clientY;
				let moved = false;
				const move = (ev) => {
					const dx = ev.clientX - startX, dy = ev.clientY - startY;
					if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
					if (moved) setOffsets((prev) => ({ ...prev, [row.key]: { dx: off.dx + dx, dy: off.dy + dy } }));
				};
				const up = () => {
					window.removeEventListener("pointermove", move);
					window.removeEventListener("pointerup", up);
					window.removeEventListener("pointercancel", up);
					if (moved) suppressClickRef.current = true;
				};
				window.addEventListener("pointermove", move);
				window.addEventListener("pointerup", up);
				window.addEventListener("pointercancel", up);
			};

			return h(
				"div",
				{
					className: "lcs-win",
					"data-depth": String(depth),
					style: { zIndex: 40 + depth * 10, "--hue": String(frame.hue) }
				},
				h(
					"div",
					{ className: "lcs-win-head" },
					h("span", { className: "lcs-win-title" }, frame.title),
					h("span", { className: "lcs-win-sub" }, frame.detailCard ? T("条目详情") : frame.items.length + T(" 项") + (chain.lanes > 1 ? T(" · 并行 ") + chain.lanes + T(" 路") : T(" · 单链"))),
					h("button", { className: "lcs-win-btn", onClick: onClose, title: T("返回上一级") }, T("← 返回"))
				),
				h(
					"div",
					{ className: "lcs-win-body cv-scope", onPointerDown: (e) => { if (e.button !== 0 || e.target.closest(".lcs-win-cell, .lcs-detail")) return; panDragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; e.currentTarget.setPointerCapture(e.pointerId); }, onPointerMove: (e) => { const d = panDragRef.current; if (d) setPan({ x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y }); }, onPointerUp: () => { panDragRef.current = null; }, onPointerCancel: () => { panDragRef.current = null; } },
					frame.detailCard ? h("article", { className: "lcs-detail" }, h("div", { className: "lcs-detail-inner" }, h("h2", null, frame.detailCard.title), h("p", { className: "lcs-detail-meta" }, [frame.detailCard.kind, frame.detailCard.t ? new Date(frame.detailCard.t).toLocaleString() : null].filter(Boolean).join(" · ")), ...[[T("内容"), frame.detailCard.text || frame.detailCard.sub], [T("参数"), frame.detailCard.detail], [T("结果"), frame.detailCard.result]].filter(([, value]) => value != null && value !== "").map(([label, value]) => h("section", { key: label }, h("h3", null, label), h("pre", null, typeof value === "string" ? value : JSON.stringify(value, null, 2)))))) : h(
						"div",
						{ className: "lcs-win-chain", style: { width: chain.width + "px", height: chain.height + "px", transform: "translate(" + pan.x + "px," + pan.y + "px)" } },
						h(
							"svg",
							{ className: "lcs-win-edges", width: chain.width, height: chain.height },
							chain.edges.map((edge) => {
								const a = byKey(chain.rows, edge.a);
								const b = byKey(chain.rows, edge.b);
								if (a === undefined || b === undefined) return null;
								return h("path", { key: edge.key, d: edgePath({ ...position(a), y: position(a).y + 34 }, { ...position(b), y: position(b).y + 34 }), stroke: "var(--dsw-alias-label-secondary)", strokeWidth: 2, fill: "none" });
							})
						),
						chain.rows.map((row) =>
							h(
								"div",
								{ key: row.key, className: "lcs-win-cell", style: { left: position(row).x + "px", top: position(row).y + "px", width: row.w + "px", height: row.h + "px" } },
								h("button", { className: "lcs-drag-handle", onPointerDown: (e) => { e.preventDefault(); startNodeDrag(e, row); }, title: T("按住拖动卡片") }, T("⠿  拖动")),
								row.item.kind === "group"
									? h(GroupRow, {
											group: row.item,
											hue: frame.hue,
											onOpen: () =>
												onPush({
													id: frame.id + "/" + row.key,
													title: frame.title + T(" · 步 ") + (row.item.step ?? 0),
														liveGroup: frame.liveGroup ? { ...frame.liveGroup, anchors: [...(frame.liveGroup.anchors || []), row.item.cards[0].id] } : undefined,
													hue: frame.hue,
													x: frame.x + 40,
													y: frame.y + 40,
													items: groupChildren(row.item.cards, row.item.step)
												})
										})
									: h("div", { className: "lcs-win-card", "data-card": row.item.card.id, onClick: () => onPush({ id: frame.id + "/" + row.key, title: row.item.card.title, hue: frame.hue, detailCard: row.item.card, items: [] }) }, h(Card, { card: row.item.card, lod: "full" }))
							)
						)
					)
				)
			);
		}

		function CanvasView({ sessionId }) {
			const cardsRef = useRef([]);
			const sinceRef = useRef(-1);
			const revisionRef = useRef(0);
			const generationRef = useRef(null);
			const vpRef = useRef(null);
			const dragRef = useRef(null);
			const fittedRef = useRef(false);
			const [tick, setTick] = useState(0);
			const [view, setView] = useState({ x: 48, y: 44, k: 1 });
			const [dragging, setDragging] = useState(false);
			const [meta, setMeta] = useState({ lanes: [], total: 0, error: undefined });
			const [size, setSize] = useState({ w: 1200, h: 800 });
			const [stack, setStack] = useState([]);
			const [offsets, setOffsets] = useState({});
			const [tlOpen, setTlOpen] = useState(false);
			const [hitKey, setHitKey] = useState(null);
			const flashRef = useRef(null);
			const [q, setQ] = useState("");

			const MIN_K = 0.22;
			const viewRef = useRef({ x: 48, y: 44, k: 1 });
			const worldRef = useRef(null);
			const bgRef = useRef(null);
			const settleRef = useRef(null);
			const metaRef = useRef({ total: 0 });
			const cardDragRef = useRef(null);
			const suppressClickRef = useRef(false);

			const paint = (v) => {
				viewRef.current = v;
				if (worldRef.current !== null) {
					worldRef.current.style.transform = "translate(" + v.x + "px," + v.y + "px) scale(" + v.k + ")";
				}
				if (bgRef.current !== null) {
					const g = 26 * v.k;
					bgRef.current.style.backgroundSize = g + "px " + g + "px";
					bgRef.current.style.backgroundPosition = v.x + "px " + v.y + "px";
				}
			};

			const commit = (v) => {
				viewRef.current = v;
				if (settleRef.current !== null) clearTimeout(settleRef.current);
				settleRef.current = setTimeout(() => {
					settleRef.current = null;
					setView({ ...viewRef.current });
				}, 80);
			};

			useEffect(() => {
				cardsRef.current = [];
				sinceRef.current = -1;
				revisionRef.current = 0;
				generationRef.current = null;
				fittedRef.current = false;
				viewRef.current = { x: 48, y: 44, k: 1 };
				setView({ x: 48, y: 44, k: 1 });
				setMeta({ lanes: [], total: 0, error: undefined });
				setStack([]);
				setOffsets({});
			}, [sessionId]);

			/* 手工改接：拖一轮到你想要的另一轮上 → 这一轮接到那条链；拖到空白 → 从这轮另开一条链。
			 * 存 localStorage，刷新/重载都不丢。 */
			const [chainOverrides, setChainOverrides] = useState(() => {
				try {
					const raw = JSON.parse(localStorage.getItem("lc.chainOverrides") || "{}");
					return raw && typeof raw === "object" ? raw : {};
				} catch (error) {
					return {};
				}
			});
			const overrideRef = useRef(chainOverrides);
			overrideRef.current = chainOverrides;
			/* 模型判定的链归属：第一次用工作站时整体切一次，之后每出新的一轮再判一次。 */
			const [aiChains, setAiChains] = useState({});
			const [chainNames, setChainNames] = useState({});
			const [chainSource, setChainSource] = useState("");
			const chainCheckedRef = useRef(-1);
			const applyOverride = (band, chainIndex) => {
				const next = { ...overrideRef.current };
				if (chainIndex === undefined) delete next[band];
				else next[band] = chainIndex;
				setChainOverrides(next);
				try {
					localStorage.setItem("lc.chainOverrides", JSON.stringify(next));
				} catch (error) {
					/* 存不下就算了，本次会话内仍然生效 */
				}
			};

			useEffect(() => {
				let alive = true;
				let timer;
				const pull = async () => {
					if (sessionId === null || sessionId === undefined) {
						if (alive) timer = setTimeout(pull, 1000);
						return;
					}
					const data = await api("/lc/cards?session=" + encodeURIComponent(sessionId) + "&since=" + sinceRef.current + "&revision=" + revisionRef.current);
					if (!alive) return;
					if (data && data.ok) {
						if (sinceRef.current >= 0 && ((generationRef.current !== null && data.generation !== generationRef.current) || (data.revision ?? 0) < revisionRef.current)) {
							sinceRef.current = -1;
							revisionRef.current = 0;
							timer = setTimeout(pull, 0);
							return;
						}
						const incoming = data.cards || [];
						if (sinceRef.current < 0 || data.total < cardsRef.current.length) {
							cardsRef.current = incoming;
						} else if (incoming.length > 0) {
							cardsRef.current = cardsRef.current.concat(incoming);
						}
						const updates = data.updates || [];
						if (updates.length) {
							const changed = new Map(updates.map((card) => [card.id, card]));
							cardsRef.current = cardsRef.current.map((card) => changed.get(card.id) || card);
						}
						revisionRef.current = data.revision || 0;
						generationRef.current = data.generation ?? null;
						sinceRef.current = data.total - 1;
						const grew = updates.length > 0 || incoming.length > 0 || data.total !== metaRef.current.total;
						if (grew) {
							setMeta({ lanes: data.lanes || [], total: data.total || 0, error: undefined });
							metaRef.current = { total: data.total || 0 };
							setTick((n) => n + 1);
						} else {
							setMeta((prev) => prev.error === undefined ? prev : { ...prev, error: undefined });
						}
					} else {
						setMeta((prev) => ({ ...prev, error: data?.reason ?? "no-data" }));
					}
					if (alive) timer = setTimeout(pull, 700);
				};
				pull();
				return () => {
					alive = false;
					clearTimeout(timer);
				};
			}, [sessionId]);

			// 板是空的但会话里明明有历史（插件刚重启、缓存还没落盘）：直接从宿主事件流重折一次。
			const triedRebuild = useRef(false);
			useEffect(() => {
				if (sessionId === null || sessionId === undefined) return;
				if (meta.total !== 0 || triedRebuild.current) return;
				triedRebuild.current = true;
				api("/lc/rebuild?session=" + encodeURIComponent(sessionId), {}).then((result) => {
					if (result && result.ok && result.total > 0) {
						sinceRef.current = -1;
						revisionRef.current = 0;
						setTick((n) => n + 1);
					}
				});
			}, [sessionId, meta.total]);

			const rebuildNow = async () => {
				const result = await api("/lc/rebuild?session=" + encodeURIComponent(sessionId), {});
				triedRebuild.current = true;
				sinceRef.current = -1;
				revisionRef.current = 0;
				setMeta((prev) => ({ ...prev, error: result && result.ok ? undefined : (result?.reason ?? "rebuild-failed") }));
				setTick((n) => n + 1);
			};


			const turns = useMemo(() => buildTurns(cardsRef.current), [tick, meta.total]);
			useEffect(() => {
				if (sessionId === null || sessionId === undefined) return;
				if (chainCheckedRef.current === meta.total || meta.total === 0) return;
				chainCheckedRef.current = meta.total;
				let alive = true;
				api("/lc/chains?session=" + encodeURIComponent(sessionId)).then((result) => {
					if (!alive || !result || result.ok !== true) return;
					setAiChains(result.bands || {});
					setChainNames(result.names || {});
					setChainSource(result.source || "");
				});
				return () => {
					alive = false;
				};
			}, [sessionId, meta.total]);
			const world = useMemo(() => layoutTurns(turns, { ...aiChains, ...chainOverrides }), [turns, chainOverrides, aiChains]);
			const hasCanvas = world.nodes.length > 0;

			useEffect(() => {
				const el = vpRef.current;
				if (el === null) return;
				const onWheel = (e) => {
					if (e.target.closest(".lcs-win, .lcs-tl")) return;
					e.preventDefault();
					const rect = el.getBoundingClientRect();
					const mx = e.clientX - rect.left;
					const my = e.clientY - rect.top;
					const v = viewRef.current;
					const k = Math.min(2.4, Math.max(MIN_K, v.k * Math.exp(-e.deltaY * 0.0016)));
					const ratio = k / v.k;
					paint({ k, x: mx - (mx - v.x) * ratio, y: my - (my - v.y) * ratio });
					commit(viewRef.current);
				};
				el.addEventListener("wheel", onWheel, { passive: false });
				return () => el.removeEventListener("wheel", onWheel);
			}, [hasCanvas]);

			useEffect(() => {
				const el = vpRef.current;
				if (el === null) return;
				const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
				measure();
				let ro;
				if (typeof ResizeObserver === "function") {
					ro = new ResizeObserver(measure);
					ro.observe(el);
				}
				return () => {
					if (ro !== undefined) ro.disconnect();
				};
			}, [hasCanvas]);

			const chainKey = Object.keys(aiChains).length + ":" + Object.keys(chainOverrides).length;
			useEffect(() => {
				fittedRef.current = false;
			}, [chainKey]);
			useEffect(() => {
				const el = vpRef.current;
				if (fittedRef.current || el === null || world.nodes.length === 0) return;
				fittedRef.current = true;
				const v = viewFocus(world.nodes, el.clientWidth, el.clientHeight);
				viewRef.current = v;
				setView(v);
			}, [world.nodes.length, chainKey]);

			const fit = () => {
				const el = vpRef.current;
				if (el === null) return;
				const v = fitView(world.nodes, el.clientWidth, el.clientHeight);
				viewRef.current = v;
				paint(v);
				setView(v);
			};

			const zoomBy = (factor) => {
				const el = vpRef.current;
				if (el === null) return;
				const v = viewRef.current;
				const k = Math.min(2.4, Math.max(MIN_K, v.k * factor));
				const ratio = k / v.k;
				const mx = el.clientWidth / 2;
				const my = el.clientHeight / 2;
				const next = { k, x: mx - (mx - v.x) * ratio, y: my - (my - v.y) * ratio };
				paint(next);
				setView(next);
			};

			if (sessionId === null || sessionId === undefined) {
				return h("div", { className: "lcs-empty" }, T("还没有活动会话。开一个对话，这里会实时长出卡片链。"));
			}
			if (world.nodes.length === 0) {
				return h(
					"div",
					{ className: "lcs-empty" },
					meta.error ? T("取数失败：") + meta.error : T("这个会话暂时没有卡片。"),
					h("br"),
					h(
						"button",
						{ className: "lcs-btn", onClick: rebuildNow, style: { marginTop: "14px" } },
						T("从会话历史重建")
					),
					h("br"),
					h("span", { className: "lcs-note" }, T("卡片由插件的规则引擎从 session/event 折叠，不经过模型；已有历史会被直接装回来，不用等新事件。"))
				);
			}

			const gridSize = 26 * view.k;
			const lod = view.k >= 0.62 ? "full" : view.k >= 0.28 ? "head" : "tiny";
			const visible = world.nodes.filter((node) => {
				const off = offsets[node.key] || { dx: 0, dy: 0 };
				return cullNodes([{ ...node, x: node.x + off.dx, y: node.y + off.dy }], view, size).length > 0;
			});
			const keyword = q.trim().toLowerCase();
			const hits =
				keyword === ""
					? []
					: cardsRef.current
							.filter((card) => {
								const hay = ((card.title || "") + " " + (card.sub || "") + " " + (card.result || "") + " " + (card.detail || "")).toLowerCase();
								return hay.indexOf(keyword) !== -1;
							})
							.slice(0, 30);

			// 卡片按住标题拖动：直接写 DOM left/top，松手才记偏移，拖动过就不当点击
			const onNodeDown = (e, node) => {
				if (e.button !== 0) return;
				// 每次按下都先清掉上回拖动留下的抑制标记，否则「拖过一次之后再也点不开」
				suppressClickRef.current = false;
				const off = offsets[node.key] || { dx: 0, dy: 0 };
				cardDragRef.current = {
					key: node.key,
					sx: e.clientX,
					sy: e.clientY,
					ox: off.dx,
					oy: off.dy,
					dx: off.dx,
					dy: off.dy,
					moved: false,
					el: e.currentTarget
				};
				const move = (ev) => {
					const d = cardDragRef.current;
					if (d === null) return;
					const k = viewRef.current.k || 1;
					d.dx = d.ox + (ev.clientX - d.sx) / k;
					d.dy = d.oy + (ev.clientY - d.sy) / k;
					if (Math.abs(ev.clientX - d.sx) > 3 || Math.abs(ev.clientY - d.sy) > 3) d.moved = true;
					setOffsets((prev) => ({ ...prev, [d.key]: { dx: d.dx, dy: d.dy } }));
				};
				const up = (ev) => {
					window.removeEventListener("pointermove", move);
					window.removeEventListener("pointerup", up);
					const d = cardDragRef.current;
					cardDragRef.current = null;
					if (d === null || !d.moved) return;
					suppressClickRef.current = true;
					setOffsets((prev) => ({ ...prev, [d.key]: { dx: d.dx, dy: d.dy } }));
					/* 拖到别的「你说」卡上 = 这一轮接到那条链；拖到空白 = 从这一轮另开一条链 */
					const el = vpRef.current;
					if (el === null || node.turn?.item?.card?.kind !== "msg-user") return;
					const rect = el.getBoundingClientRect();
					const wx = (ev.clientX - rect.left - viewRef.current.x) / (viewRef.current.k || 1);
					const wy = (ev.clientY - rect.top - viewRef.current.y) / (viewRef.current.k || 1);
					let hit = null;
					for (const other of world.nodes) {
						if (other === node || other.turn?.item?.card?.kind !== "msg-user") continue;
						if (wx < other.x || wx > other.x + other.w || wy < other.y || wy > other.y + other.h) continue;
						hit = other;
					}
					if (hit !== null) applyOverride(node.turn.turn, hit.chains.index);
					else applyOverride(node.turn.turn, 0);
				};
				window.addEventListener("pointermove", move);
				window.addEventListener("pointerup", up);
			};
			const onNodeMove = (e) => {
				const d = cardDragRef.current;
				if (d === null) return;
				const k = viewRef.current.k || 1;
				d.dx = d.ox + (e.clientX - d.sx) / k;
				d.dy = d.oy + (e.clientY - d.sy) / k;
				if (Math.abs(e.clientX - d.sx) > 3 || Math.abs(e.clientY - d.sy) > 3) d.moved = true;
				d.el.style.left = "calc(" + d.dx + "px)";
				d.el.style.top = "calc(" + d.dy + "px)";
			};
			const onNodeUp = () => {
				/* 收尾统一由 window 上的 pointerup 处理 */
			};

			/** 把某块轮次移到画布正中，缩放不变 —— 落地后原地滚轮就能放大看这张卡。 */
			const centerOn = (turnId) => {
				const node = world.nodes.find((n) => n.key === turnId);
				const el = vpRef.current;
				if (node === undefined || el === null) return;
				const k = viewRef.current.k;
				const off = offsets[node.key] || { dx: 0, dy: 0 };
				const v = {
					k,
					x: el.clientWidth / 2 - (node.x + off.dx + node.w / 2) * k,
					y: el.clientHeight / 2 - (node.y + off.dy + node.h / 2) * k
				};
				paint(v);
				setView(v);
			};

			/* 定位 ≠ 打开：时间线和搜索只把画布挪过去、让目标落在正中并高亮，缩放值不变。 */
			const jumpToTurn = (turn) => {
				centerOn(turn.id);
				setTlOpen(false);
				flash(turn.id);
			};

			const jumpToCard = (card) => {
				const target = turns.find((turn) => turn.cards.some((item) => item.id === card.id));
				if (!target) return;
				centerOn(target.id);
				setTlOpen(false);
				flash(target.id);
			};

			const flash = (key) => {
				setHitKey(key);
				if (flashRef.current !== null) clearTimeout(flashRef.current);
				flashRef.current = setTimeout(() => setHitKey(null), 1600);
			};

			const openTurn = (turn) => {
				// 浮窗用的是视口像素坐标，不是世界坐标：把卡片当前位置换算成屏幕位置再开窗
				const node = world.nodes.find((n) => n.key === turn.id);
				const el = vpRef.current;
				const k = viewRef.current.k;
				const off = node === undefined ? { dx: 0, dy: 0 } : offsets[node.key] || { dx: 0, dy: 0 };
				const vw = el === null ? 1200 : el.clientWidth;
				const vh = el === null ? 800 : el.clientHeight;
				const base =
					node === undefined
						? { x: 120, y: 120 }
						: {
								x: Math.max(24, Math.min(vw - 420, node.x + off.dx) * k + viewRef.current.x + 32),
								y: Math.max(24, Math.min(vh - 260, node.y + off.dy) * k + viewRef.current.y + 18)
							};
				setStack([
					{
						id: turn.id,
						title: turn.title + " · " + turn.count + T(" 个动作"),
						hue: turn.hue,
						liveGroup: { band: turn.turn, step: turn.item.step },
						x: Math.round(base.x),
						y: Math.round(base.y),
						items: turn.items
					}
				]);
			};
			const pushFrame = (frame) => setStack((prev) => prev.concat([frame]));
			const closeFrame = (depth) => setStack((prev) => prev.slice(0, depth));

			return h(
				"div",
				{ className: "lcs-root", style: { display: "contents" } },
				h(
					"div",
					{
						className: "lcs-viewport",
						ref: (el) => {
							vpRef.current = el;
							bgRef.current = el;
						},
						"data-drag": String(dragging),
						style: {
							backgroundImage: "radial-gradient(circle, color-mix(in srgb, var(--lcs-text) 13%, transparent) 1px, transparent 1px)",
							backgroundSize: gridSize + "px " + gridSize + "px",
							backgroundPosition: view.x + "px " + view.y + "px"
						},
						onPointerDown: (e) => {
							if (e.button !== 0 && e.button !== 1) return;
							if (e.target && e.target.closest && e.target.closest(".lcs-zoom")) return;
							if (e.target && e.target.closest && e.target.closest(".lcs-tl")) return;
							if (e.target && e.target.closest && e.target.closest(".lcs-tl-btn")) return;
							if (e.target && e.target.closest && e.target.closest(".lcs-win")) return;
							if (e.target && e.target.closest && e.target.closest(".lcs-tcard")) return;
							if (e.target && e.target.closest && e.target.closest(".lcs-node-turn")) return;
							dragRef.current = { sx: e.clientX, sy: e.clientY, ox: viewRef.current.x, oy: viewRef.current.y };
							setDragging(true);
							try {
								e.currentTarget.setPointerCapture(e.pointerId);
							} catch {
								/* ignore */
							}
						},
						onPointerMove: (e) => {
							const d = dragRef.current;
							if (d === null) return;
							paint({ k: viewRef.current.k, x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) });
						},
						onPointerUp: () => {
							if (dragRef.current === null) return;
							dragRef.current = null;
							setDragging(false);
							commit(viewRef.current);
						},
						onPointerCancel: () => {
							if (dragRef.current === null) return;
							dragRef.current = null;
							setDragging(false);
							commit(viewRef.current);
						},
						onDoubleClick: fit
					},
					h(
						"div",
						{
							className: "lcs-world",
							ref: worldRef,
							style: {
								transform: "translate(" + view.x + "px," + view.y + "px) scale(" + view.k + ")",
								"--lc-ik": String(Math.min(2.6, Math.max(1, 1 / Math.max(view.k, 0.45))))
							}
						},
						h(
							"svg",
							{ className: "lcs-edges", width: 1, height: 1 },
							world.edges.map((edge) => {
								const a = world.nodes.find((n) => n.key === edge.a);
								const b = world.nodes.find((n) => n.key === edge.b);
								if (a === undefined || b === undefined) return null;
								const oa = offsets[a.key] || { dx: 0, dy: 0 };
								const ob = offsets[b.key] || { dx: 0, dy: 0 };
								const pa = { x: a.x + oa.dx, y: a.y + oa.dy, w: a.w, h: a.h };
								const pb = { x: b.x + ob.dx, y: b.y + ob.dy, w: b.w, h: b.h };
								return h("path", {
									key: edge.key,
									d: edgePath(pa, pb),
									stroke: "var(--dsw-alias-label-secondary)",
									strokeWidth: 2,
									fill: "none"
								});
							})
						),
						visible.map((node) => {
							const off = offsets[node.key] || { dx: 0, dy: 0 };
							return h(
								"div",
								{
									key: node.key,
									className: "lcs-node lcs-node-turn cv-scope" + (hitKey === node.key ? " lcs-hit" : ""),
									style: {
										left: node.x + off.dx + "px",
										top: node.y + off.dy + "px",
										width: node.w + "px",
										height: lod === "full" ? node.h + "px" : "auto"
									},
									onPointerDown: (e) => onNodeDown(e, node)
								},
								node.turn?.item?.card?.kind === "msg-user"
									? h("div", { className: "lcs-tstart" }, (node.chains?.first ? (chainNames[node.chains.index] ? T("链 ") + node.chains.index + " · " + chainNames[node.chains.index] : T("任务链 ") + node.chains.index) + " · " : "") + "第 " + (node.turn.turn ?? 0) + T(" 轮开始"))
									: null,
								node.turn.item.kind === "group"
									? h(GroupRow, { group: node.turn.item, hue: node.turn.hue, onOpen: () => { if (!suppressClickRef.current) openTurn(node.turn); } })
									: h("div", { onClick: () => { if (!suppressClickRef.current) setStack([{ id: node.turn.id, title: node.turn.item.card.title, hue: node.turn.hue, detailCard: node.turn.item.card, items: [] }]); } }, h(Card, { card: node.turn.item.card, lod: "full" }))
							);
						})
					),
					stack.map((frame, depth) =>
						h(StackWindow, {
							key: frame.id,
							frame: refreshFrame(frame, cardsRef.current),
							depth,
							onClose: () => closeFrame(depth),
							onPush: pushFrame
						})
					),
					h(
						"button",
						{ className: "lcs-tl-btn", "data-on": String(tlOpen), onClick: () => setTlOpen((v) => !v), title: T("时间线与搜索") },
						T("时间线")
					),
					tlOpen
						? h(
								"div",
								{ className: "lcs-tl" },
								h("input", {
									className: "lcs-tl-q",
									placeholder: T("搜关键字：命令 / 文件名 / 报错…"),
									value: q,
									onChange: (e) => setQ(e.target.value)
								}),
								q.trim() === ""
									? h(
											"div",
											{ className: "lcs-tl-list" },
											h("div", { className: "lcs-tl-head" }, T("时间线")),
											turns.map((turn) =>
												h(
													"button",
													{ key: turn.id, className: "lcs-tl-row", onPointerDown: () => jumpToTurn(turn) },
													h("span", { className: "lcs-tl-time" }, T("第 ") + (turn.turn ?? 0) + T(" 轮")),
													h("span", { className: "lcs-tl-main" }, short(turn.title, 34)),
													h("span", { className: "lcs-tl-n" }, turn.count)
												)
											)
										)
									: h(
											"div",
											{ className: "lcs-tl-list" },
											h("div", { className: "lcs-tl-head" }, T("匹配 ") + hits.length + T(" 条")),
											hits.length === 0
												? h("div", { className: "lcs-note", style: { padding: "8px 10px" } }, T("没有匹配的卡。"))
												: hits.map((card) =>
														h(
															"button",
															{ key: card.id, className: "lcs-tl-row", onPointerDown: () => jumpToCard(card) },
															h("span", { className: "lcs-tl-time" }, T("第 ") + (card.band ?? 1) + T(" 轮")),
															h("span", { className: "lcs-tl-main" }, short(card.title || card.sub || "", 34)),
															h("span", { className: "lcs-tl-n" }, DISPLAY_KIND[card.kind] ?? "note")
														)
													)
										)
							)
						: null,
					(() => {
						const MAP_W = 384;
						const MAP_H = 132;
						const pad = 8;
						const bb = boundsOf(world.nodes);
						const s = Math.min((MAP_W - pad * 2) / bb.w, (MAP_H - pad * 2) / bb.h);
						const toMap = (x, y) => [pad + (x - bb.minX) * s, pad + (y - bb.minY) * s];
						const rectW = Math.max(6, (size.w / view.k) * s);
						const rectH = Math.max(6, (size.h / view.k) * s);
						const [rx, ry] = toMap(-view.x / view.k, -view.y / view.k);
						return h(
							"div",
							{ className: "lcs-map" },
							h(
								"svg",
								{ width: MAP_W, height: MAP_H, viewBox: "0 0 " + MAP_W + " " + MAP_H },
								(() => {
									const bands = new Map();
									for (const node of world.nodes) {
										const index = node.chains?.index ?? 0;
										const box = bands.get(index) ?? { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
										box.minX = Math.min(box.minX, node.x);
										box.minY = Math.min(box.minY, node.y);
										box.maxX = Math.max(box.maxX, node.x + (node.w || NODE_W));
										box.maxY = Math.max(box.maxY, node.y + (node.h || NODE_H));
										bands.set(index, box);
									}
									return [...bands.entries()].map(([index, box]) => {
										const [x, y] = toMap(box.minX, box.minY);
										const w = Math.max(2, (box.maxX - box.minX) * s);
										const h2 = Math.max(2, (box.maxY - box.minY) * s);
										return h("rect", {
											key: "mb-" + index,
											x: x.toFixed(1),
											y: y.toFixed(1),
											width: w.toFixed(1),
											height: h2.toFixed(1),
											rx: 2,
											fill: "color-mix(in oklab, var(--lcs-text) 22%, transparent)",
											stroke: "color-mix(in oklab, var(--lcs-text) 38%, transparent)",
											strokeWidth: 0.6
										});
									});
								})(),
								h("rect", { x: rx.toFixed(1), y: ry.toFixed(1), width: Math.max(12, rectW), height: Math.max(16, rectH), fill: "none", stroke: "#ffffff", strokeWidth: 2, rx: 1 }),
								h("line", {
									x1: (rx + Math.max(12, rectW) / 2).toFixed(1),
									y1: 2,
									x2: (rx + Math.max(12, rectW) / 2).toFixed(1),
									y2: MAP_H - 2,
									stroke: "#ffffff",
									strokeWidth: 1,
									opacity: 0.55
								})
							)
						);
					})(),
					h(
						"div",
						{ className: "lcs-zoom" },
						h("button", { className: "lcs-btn", onClick: () => zoomBy(1 / 1.25) }, "−"),
						h("span", { className: "lcs-zoom-val" }, Math.round(view.k * 100) + "%"),
						h("button", { className: "lcs-btn", onClick: () => zoomBy(1.25) }, "＋"),
						h("button", { className: "lcs-btn", onClick: fit }, T("自适应")),
						h("button", { className: "lcs-btn", onClick: () => { const v = { x: 48, y: 44, k: 1 }; paint(v); setView(v); } }, "1:1")
					)
				),
				h(
					"div",
					{ className: "lcs-legend" },
					h("span", null, T("横向连线 = 骨干：轮次从左往右推进 · 点开进小画布")),
					h("span", null, T("一块颜色 = 一组，点开在画布里变成小画布")),
					h("span", null, T("拖拽平移 · 滚轮缩放 · 双击自适应")),
					h("span", null, T("共 ") + meta.total + T(" 张卡 · ") + turns.length + T(" 轮 · 画面上 ") + visible.length + T(" 块"))
				)
			);
		}

		/* 卡片种类对齐 Workstation 原程序的六种：task / plan / sub / run / tool / note。
		 * 事件里认出来的细分类（read-file、write-file、web…）都归到 tool，
		 * 界面上就是原程序那套「跑程 / 调用 / 子对 / 计划 / 备注」的观感。 */
		const DISPLAY_KIND = {
			"run-cmd": "run",
			"read-file": "tool",
			"write-file": "tool",
			web: "tool",
			tool: "tool",
			approval: "tool",
			job: "tool",
			"spawn-subagent": "sub",
			todo: "plan",
			deliverable: "note",
			compact: "note",
			note: "note"
		};

		const RUN_KEYS = ["command", "cmd", "script", "commandLine", "code", "shell"];

		function jsonOf(text) {
			if (text === null || text === undefined) return undefined;
			if (typeof text !== "string") return text;
			try {
				return JSON.parse(text);
			} catch {
				return undefined;
			}
		}

		function cmdText(card) {
			const parsed = jsonOf(card.detail);
			if (parsed !== null && typeof parsed === "object") {
				for (const key of RUN_KEYS) {
					const value = parsed[key];
					if (typeof value === "string" && value.trim() !== "") return value;
				}
			}
			return String(card.title ?? "").replace(/^跑\s*/, "");
		}

		function argText(card) {
			const parsed = jsonOf(card.detail);
			if (typeof parsed === "string") return parsed.slice(0, 180);
			if (parsed === null || typeof parsed !== "object") return String(card.detail ?? "").slice(0, 180);
			const parts = [];
			for (const key of ["path", "file", "files", "url", "pattern", "query", "name", "cwd", "prompt", "instructions"]) {
				const value = parsed[key];
				if (typeof value === "string" && value !== "") parts.push(key + "=" + value);
				else if (Array.isArray(value) && value.length > 0) parts.push(key + "=" + value.slice(0, 3).join(","));
			}
			if (parts.length === 0) return JSON.stringify(parsed).slice(0, 180);
			return parts.join(" · ").slice(0, 180);
		}

		function CardBody({ card, dk }) {
			const state = card.state || "ok";
			const result = card.result || "";
			if (dk === "run") {
				return [
					h(
						"div",
						{ className: "cv-run-top", key: "top" },
						h("span", { className: "cv-prompt" }, "$"),
						h("span", { className: "cv-cmd", title: cmdText(card) }, cmdText(card))
					),
					h(
						"div",
						{ className: "cv-run-out", key: "out" },
						h(
							"div",
							{ className: "cv-run-meta " + (state === "failed" ? "bad" : "ok") },
							(state === "running" ? "running" : state === "failed" ? "exit ≠ 0" : "exit 0") + (card.sub ? " · " + card.sub : "")
						),
						h("pre", { className: state === "failed" ? "cv-run-stderr" : "cv-run-stdout" }, result || (state === "running" ? "…" : T("（无输出）")))
					)
				];
			}
			if (dk === "tool") {
				return [
					h(
						"div",
						{ className: "cv-tools", key: "tools" },
						h(
							"div",
							{ className: "cv-tool" },
							h("span", { className: "tagx" }, "tool"),
							h("b", null, card.sub || card.title),
							h("i", { title: argText(card) }, argText(card))
						)
					),
					h("div", { className: "cv-out", key: "out" }, result || (state === "running" ? T("运行中…") : T("（无回显）")))
				];
			}
			if (dk === "sub") {
				return [
					h("div", { className: "cv-step-desc", key: "desc" }, card.sub || card.title),
					h("div", { className: "cv-out", key: "out" }, result || T("（还没回报）"))
				];
			}
			if (dk === "plan") {
				const lines = String(result || card.sub || "").split("\n").map((line) => line.trim()).filter((line) => line !== "").slice(0, 12);
				return [
					h("div", { className: "cv-goal", key: "goal" }, card.title),
					h(
						"div",
						{ className: "cv-steps", key: "steps" },
						lines.length === 0
							? h("div", { className: "cv-hint" }, T("还没有步骤"))
							: lines.map((line, i) =>
									h(
										"div",
										{ className: "cv-step", key: i },
										h("span", { className: "no" }, String(i + 1)),
										h("div", { className: "main" }, line.replace(/^[-*·]\s*/, ""))
									)
								)
					)
				];
			}
			return [h("div", { className: "cv-note", key: "note" }, result || card.sub || card.title)];
		}

		const Card = memo(function Card({ card, lod }) {
			const dk = DISPLAY_KIND[card.kind] ?? "note";
			if (lod === "block") {
				// 缩得太远时不渲染任何文字：只留一条种类色和状态点，拖起来不花力气
				return h(
					"div",
					{ className: "cv-card cv-tiny" },
					h("span", { className: "cv-kind " + dk }, ""),
					h("span", { className: "cv-run " + (card.state === "running" ? "running" : card.state === "failed" ? "stopped" : "done") })
				);
			}
			const state = card.state || "ok";
			const dot = state === "running" ? "running" : state === "failed" ? "stopped" : "done";
			// 跑程卡的标题原本是「跑 <命令>」，和卡里的 $ 命令行重复，改为用工具名当标题
			const head = dk === "run" ? card.sub || T("跑程") : card.title;
			return h(
				"div",
				{ className: "cv-card" },
				h(
					"div",
					{ className: "cv-head" },
					h("span", { className: "cv-kind " + dk }, dk),
					h("span", { className: "cv-title", title: card.title }, head),
					h("span", { className: "cv-run " + dot })
				),
				lod === "compact" ? null : h("div", { className: "cv-body" }, h(CardBody, { card, dk })),
				lod === "full"
					? h(
							"div",
							{ className: "cv-run-hist" },
							h("span", { className: "cv-run-past" }, T("分支 ") + ((card.lane ?? 0) + 1)),
							h("span", { className: "cv-run-past" }, card.serial ? T("串") : T("并")),
							h("span", null, T("第 ") + Math.max(1, card.band || 1) + T(" 轮 · 步 ") + (card.step ?? 0)),
							h("span", null, fmtTime(card.time))
						)
					: null
			);
		});

		/* ────────────────────────────── memory ────────────────────────────── */

		function MemoryView({ sessionId }) {
			const [memorySection, setMemorySection] = useState(null);
			const { data, error } = useJson("/lc/memory?session=" + encodeURIComponent(sessionId || ""), 5000);
			const [fileId, setFileId] = useState("");
			const [draft, setDraft] = useState("");
			const [draftFor, setDraftFor] = useState(undefined);
			const [notice, setNotice] = useState(undefined);
			const [selected, setSelected] = useState({});
			const [target, setTarget] = useState("");
			const [edits, setEdits] = useState({});

			const cross = (data && data.cross) || [];
			const current = cross.find((f) => f.id === fileId) || cross[0];
			useEffect(() => {
				if (current !== undefined && draftFor !== current.path) {
					setDraft(current.content || "");
					setDraftFor(current.path);
					setFileId(current.id);
				}
			}, [current && current.path, current && current.content]);
			useEffect(() => {
				if (target === "" && cross.length > 0) setTarget(cross[0].path);
			}, [cross.length]);

			const save = async () => {
				const result = await api("/lc/memory/file", { path: current.path, content: draft });
				setNotice({ ok: result.ok, text: result.ok ? T("已保存 · 回读一致 ") + result.readbackMatches + T(" · 备份 ") + result.backup : T("保存失败：") + result.reason });
			};

			const importSelected = async () => {
				const items = ((data && data.live) || []).filter((item) => selected[item.id]);
				if (items.length === 0) return setNotice({ ok: false, text: T("先勾选要导入的条目") });
				const result = await api("/lc/memory/import", { target, items: items.map((i) => ({ kind: i.kind, text: i.text })) });
				setNotice({ ok: result.ok, text: result.ok ? T("已追加 ") + items.length + T(" 条 · 备份 ") + result.backup : T("追加失败：") + result.reason });
			};

			const saveEdits = async () => {
				const items = Object.entries(edits).map(([id, text]) => ({ id, text }));
				if (items.length === 0) return setNotice({ ok: false, text: T("没有改动") });
				const result = await api("/lc/memory/items", { session: sessionId, items });
				setNotice({ ok: result.ok, text: result.ok ? T("已写入 ") + result.items + T(" 条编辑覆盖") : T("写入失败：") + result.reason });
			};

			if (error) return h("div", { className: "lcs-empty" }, T("取数失败：") + error);
			if (!data) return h("div", { className: "lcs-empty" }, T("加载中…"));

			return h(
				"div",
				{ className: "lcs-scroll" },
				memorySection === null ? h("div", { className: "lcs-grid" },
					[[T("跨对话记忆"), T("磁盘上的记忆文件"), cross.length], [T("本次注入"), T("本会话观察到的注入内容"), (data.imported || []).length], [T("对话中的候选记忆"), T("从对话提取的候选，需自行确认"), (data.live || []).length], [T("子智能体记录"), T("实际观察到的调用和回报"), (data.subagents || []).length]].map(([title, desc, count], i) =>
						h("button", { key: title, className: "lcs-block", onClick: () => setMemorySection(i), style: { textAlign: "left", cursor: "pointer", padding: 20 } }, h("b", null, title), h("div", { className: "lcs-note", style: { marginTop: 8 } }, desc + " · " + count + T(" 项")))))
				: h("div", null,
					h("button", { className: "lcs-btn", onClick: () => setMemorySection(null), style: { marginBottom: 12 } }, T("← 返回记忆目录")),
				h(
					"div",
					{ className: "lcs-grid" },

					/* (a) */
					memorySection === 0 && h(
						"section",
						{ className: "lcs-block" },
						h("div", { className: "lcs-block-head" }, h("b", null, T("① 跨对话记忆")), h("em", null, T("可直接编辑并保存，保存前自动备份"))),
						h(
							"div",
							{ className: "lcs-block-body" },
							h(
								"div",
								{ className: "lcs-row" },
								h(
									"select",
									{ className: "lcs-select lcs-grow", value: current ? current.id : "", onChange: (e) => setFileId(e.target.value) },
									cross.map((file) => h("option", { key: file.id, value: file.id }, file.label + (file.exists ? "  (" + fmtSize(file.size) + ")" : T("  (缺失)"))))
								),
								h("button", { className: "lcs-btn", onClick: () => { setDraft(current.content || ""); setDraftFor(current.path); } }, T("还原")),
								h("button", { className: "lcs-btn", "data-tone": "primary", onClick: save, disabled: !current }, T("保存"))
							),
							current ? h("div", { className: "lcs-mono" }, current.path) : null,
							h("textarea", { className: "lcs-textarea", value: draft, onChange: (e) => setDraft(e.target.value), spellCheck: false }),
							notice ? h("div", { className: notice.ok ? "lcs-note lcs-ok" : "lcs-note lcs-bad" }, notice.text) : null
						)
					),

					/* (b) */
					memorySection === 1 && h(
						"section",
						{ className: "lcs-block" },
						h("div", { className: "lcs-block-head" }, h("b", null, T("② 本次对话导入的跨对话记忆")), h("em", null, T("本会话启动时被注入的内容，只读快照"))),
						h(
							"div",
							{ className: "lcs-block-body" },
							(data.imported || []).length === 0
								? h("div", { className: "lcs-note" }, T("本会话没有观察到 system/developer 注入事件（可能早于插件启动）。"))
								: (data.imported || []).map((item) =>
										h(
											"div",
											{ key: item.id, className: "lcs-item" },
											h(
												"div",
												{ className: "lcs-item-text" },
												h("div", { className: "lcs-row" }, h("span", { className: "lcs-tag" }, item.source), h("span", { className: "lcs-note" }, fmtTime(item.time) + " · " + item.chars + T(" 字") + (item.truncated ? T("（已截断）") : ""))),
												h("div", { className: "lcs-mono", style: { marginTop: 4, whiteSpace: "pre-wrap", maxHeight: 140, overflow: "auto" } }, item.text)
											)
										)
									)
						)
					),

					/* (c) */
					memorySection === 2 && h(
						"section",
						{ className: "lcs-block" },
						h("div", { className: "lcs-block-head" }, h("b", null, T("③ 对话中的记忆")), h("em", null, T("规则引擎从事件里抽取，可改、可勾选后导入 ①"))),
						h(
							"div",
							{ className: "lcs-block-body" },
							(data.live || []).length === 0
								? h("div", { className: "lcs-note" }, T("本会话还没抽到偏好/约束/决定。规则只认明确句式，宁缺不猜。"))
								: h(
										"div",
										{ className: "lcs-list" },
										(data.live || []).map((item) =>
											h(
												"div",
												{ key: item.id, className: "lcs-item" },
												h("input", {
													type: "checkbox",
													checked: !!selected[item.id],
													onChange: (e) => setSelected((prev) => ({ ...prev, [item.id]: e.target.checked }))
												}),
												h(
													"div",
													{ className: "lcs-item-text" },
													h("div", { className: "lcs-row" }, h("span", { className: "lcs-tag", "data-kind": item.kind }, item.label), h("span", { className: "lcs-note" }, (item.from === "user" ? T("用户") : T("助手")) + " · " + fmtTime(item.time) + (item.edited ? T(" · 已编辑") : ""))),
													h("textarea", {
														className: "lcs-textarea",
														style: { minHeight: 46, marginTop: 4 },
														value: edits[item.id] ?? item.text,
														onChange: (e) => setEdits((prev) => ({ ...prev, [item.id]: e.target.value }))
													})
												)
											)
										)
									),
							h(
								"div",
								{ className: "lcs-row" },
								h(
									"select",
									{ className: "lcs-select lcs-grow", value: target, onChange: (e) => setTarget(e.target.value) },
									cross.map((file) => h("option", { key: file.id, value: file.path }, T("追加到：") + file.label))
								),
								h("button", { className: "lcs-btn", onClick: saveEdits }, T("保存本条编辑")),
								h("button", { className: "lcs-btn", "data-tone": "primary", onClick: importSelected }, T("导入到跨对话记忆"))
							)
						)
					),

					/* (d) */
					memorySection === 3 && h(
						"section",
						{ className: "lcs-block" },
						h("div", { className: "lcs-block-head" }, h("b", null, T("④ 子智能体记录")), h("em", null, T("观察到的子智能体调用参数和回报，并非子体全部记忆"))),
						h(
							"div",
							{ className: "lcs-block-body" },
							(data.subagents || []).length === 0
								? h("div", { className: "lcs-note" }, T("尚未观察到子智能体调用；插件启动前的记录可能未载入。"))
								: (data.subagents || []).map((sub) =>
										h(
											"div",
											{ key: sub.id, className: "lcs-item" },
											h(
												"div",
												{ className: "lcs-item-text" },
												h("div", { className: "lcs-row" }, h("b", null, sub.name || sub.id), h("span", { className: "lcs-note" }, fmtTime(sub.startedAt) + (sub.endedAt ? " → " + fmtTime(sub.endedAt) : T(" → 进行中")))),
												h("div", { className: "lcs-note", style: { marginTop: 3 } }, T("任务：") + (sub.task || "—")),
												h("div", { className: "lcs-note" }, T("回报：") + (sub.result || "—"))
											)
										)
									)
						)
					),

					h("div", { className: "lcs-note" }, T("文件来源：") + (data.files || []).map((f) => f.path).join("  ·  "))
				))
			);
		}

		/* ────────────────────────────── calls ────────────────────────────── */

		function CallsView() {
			const { data, error } = useJson("/lc/calls", 0);
			const [notice, setNotice] = useState(undefined);
			const [reloadKey, setReloadKey] = useState(0);
			const [callsMode, setCallsMode] = useState("lib");
			const [progQuery, setProgQuery] = useState("");
			const [progLimit, setProgLimit] = useState(60);
			const [pluginQuery, setPluginQuery] = useState("");
			const [pluginLimit, setPluginLimit] = useState(80);
			const [skillQuery, setSkillQuery] = useState("");
			const [toolQuery, setToolQuery] = useState("");
			const [toolLimit, setToolLimit] = useState(20);
			const dragFiles = useRef(new Map());
			const fresh = useJson("/lc/calls", 0);
			useEffect(() => {
				if (reloadKey > 0 && fresh.data) setNotice((prev) => prev);
			}, [fresh.data]);

			const toggle = async (kind, id, enabled) => {
				const result = await api("/lc/calls/plugin", { kind, id, enabled, confirm: true });
				setNotice({ ok: result.ok && result.verified !== false, text: result.ok ? (result.verified ? T("已切换并回读确认：") + id + " → " + result.readback.enabled : T("接口接受但回读不一致：") + JSON.stringify(result.readback)) : T("失败：") + result.reason });
				setReloadKey((n) => n + 1);
			};
			const toggleTool = async (name, enabled) => {
				const result = await api("/lc/calls/tool", { action: "toggle", name, enabled, confirm: true });
				setNotice({ ok: result.ok, text: result.ok ? T("已切换并回读：") + JSON.stringify(result.readback) : T("失败：") + result.reason });
				setReloadKey((n) => n + 1);
			};
			const removeTool = async (name) => {
				if (!window.confirm(T("删除 cap/tool 条目「") + name + T("」？会先备份再移走。"))) return;
				const result = await api("/lc/calls/tool", { action: "delete", name, confirm: true });
				setNotice({ ok: result.ok, text: result.ok ? T("已删除（备份 ") + result.backup + "）" : T("失败：") + result.reason });
				setReloadKey((n) => n + 1);
			};
			const addTool = async () => {
				const name = window.prompt(T("新 cap/tool 条目名（不含路径）："));
				if (!name) return;
				const body = window.prompt(T("内容（可留空）："), "# " + name + "\n");
				const result = await api("/lc/calls/tool", { action: "add", name, body: body ?? "" });
				setNotice({ ok: result.ok, text: result.ok ? T("已创建 ") + result.path : T("失败：") + result.reason });
				setReloadKey((n) => n + 1);
			};
			/* Drag-out needs a real File on the dataTransfer, so the bytes are fetched as
			 * soon as the pointer goes down on a program row. A row that is not ready yet
			 * falls back to a uri-list copy instead of pretending to be an import. */
			const prefetchProgram = (row) => {
				if (dragFiles.current.has(row.path)) return;
				dragFiles.current.set(row.path, null);
				fetch("/lc/raw?path=" + encodeURIComponent(row.path))
					.then((response) => (response.ok ? response.blob() : null))
					.then((blob) => {
						if (blob === null) {
							dragFiles.current.delete(row.path);
							return;
						}
						const name = row.ext !== undefined ? row.name + row.ext : row.name;
						dragFiles.current.set(row.path, new File([blob], name, { type: "application/octet-stream" }));
						for (const key of dragFiles.current.keys()) {
							if (dragFiles.current.size <= 8) break;
							dragFiles.current.delete(key);
						}
					})
					.catch(() => {
						dragFiles.current.delete(row.path);
					});
			};
			const registerProgram = async () => {				const path = window.prompt(T("登记一个可执行文件的完整路径："));
				if (!path) return;
				const name = window.prompt(T("显示名："), path.split(/[\\\\/]/).pop() || "");
				const result = await api("/lc/calls/program", { id: name || path, name: name || path, path });
				setNotice({ ok: result.ok, text: result.ok ? T("已登记：") + JSON.stringify(result.readback) : T("失败：") + result.reason });
				setReloadKey((n) => n + 1);
			};

			const view = reloadKey > 0 && fresh.data ? fresh.data : data;
			if (error) return h("div", { className: "lcs-empty" }, T("取数失败：") + error);
			if (!view) return h("div", { className: "lcs-empty" }, T("加载中…"));

			const skills = view.skills || { available: false, rows: [] };
			const plugins = view.plugins || { available: false, plugins: [], bundles: [] };
			const programs = view.programs || { rows: [] };
			const wsTools = view.wsTools || { rows: [] };
			const usedRows = view.used || [];
			const match = (text, q) => q === "" || String(text).toLowerCase().includes(q.toLowerCase());
			const progAll = (programs.rows || []).filter((row) => match(row.name + " " + row.path, progQuery));
			const shownPrograms = progAll.slice(0, progLimit);
			const pluginAll = (plugins.plugins || []).filter((row) => match(row.name + " " + (row.id ?? ""), pluginQuery));
			const shownPlugins = pluginAll.slice(0, pluginLimit);
			const skillAll = (skills.rows || []).filter((row) => match(row.name + " " + (row.description ?? ""), skillQuery));
			const wsAll = (wsTools.rows || []).filter((row) => match(row.name + " " + (row.summary ?? ""), toolQuery));
			const shownWs = wsAll.slice(0, toolLimit);

			return h(
				"div",
				{ className: "lcs-scroll lcs-calls", "data-mode": callsMode },
				h(
					"div",
					{ className: "lcs-calls-bar" },
					h("button", { className: "lcs-btn", "data-on": String(callsMode === "used"), onClick: () => setCallsMode("used") }, T("本对话使用 ") + usedRows.length),
					h("button", { className: "lcs-btn", "data-on": String(callsMode === "lib"), onClick: () => setCallsMode("lib") }, T("全部库 ") + (pluginAll.length + skillAll.length + progAll.length)),
					h("span", { className: "lcs-note" }, callsMode === "used" ? T("只统计这个会话的卡片（读/写/跑/联网/子体/工具），按次数排序") : T("上：插件与 bundle　下左：skills　下右：可执行程序；每块各自搜索、各自滚动"))
				),
				notice ? h("div", { className: notice.ok ? "lcs-note lcs-ok" : "lcs-note lcs-bad" }, notice.text) : null,
				h(
					"div",
					{ className: "lcs-calls-grid", "data-calls": callsMode },

					callsMode === "used"
						? h(
								"section",
								{ className: "lcs-block" },
								h("div", { className: "lcs-block-head" }, h("b", null, T("本对话用过的调用")), h("em", null, usedRows.length + T(" 类"))),
								h(
									"div",
									{ className: "lcs-block-body" },
									usedRows.length === 0
										? h("div", { className: "lcs-note" }, T("这个会话还没有可统计的调用。"))
										: h(
												"div",
												{ className: "lcs-list" },
												usedRows.map((row) =>
													h(
														"div",
														{ key: row.kind + "·" + row.name, className: "lcs-item" },
														h("span", { className: "lcs-tag" }, row.kind),
														h("div", { className: "lcs-item-text" }, h("b", null, row.name), h("div", { className: "lcs-note" }, T("最后出现：第 ") + row.lastBand + T(" 轮"))),
														h("span", { className: "lcs-pill", "data-on": "true" }, "×" + row.count)
													)
												)
											)
								)
							)
						: null,

					h(
						"section",
						{ className: "lcs-block lcs-lib lcs-calls-skills" },
						h(
							"div",
							{ className: "lcs-block-head" },
							h("b", null, "skills"),
							h("em", null, skillAll.length + T(" 个 · Harness skill 注册表") + (skills.available ? "" : T("（服务不可用）"))),
							h("input", {
								className: "lcs-input",
								style: { marginLeft: "auto", width: "140px", flex: "0 0 auto" },
								placeholder: T("搜索 skill"),
								value: skillQuery,
								onChange: (e) => setSkillQuery(e.target.value)
							})
						),
						h(
							"div",
							{ className: "lcs-block-body" },
							(skills.rows || []).length === 0
								? h("div", { className: "lcs-note" }, skills.error || T("没有读出 skill。"))
								: skillAll.length === 0
									? h("div", { className: "lcs-note" }, T("没有匹配「") + skillQuery + T("」的 skill。"))
									: h(
										"div",
										{ className: "lcs-list" },
										skillAll.map((row) =>
											h(
												"div",
												{ key: row.id, className: "lcs-item" },
												h("span", { className: "lcs-pill", "data-on": "true" }, T("启用")),
												h("div", { className: "lcs-item-text" }, h("b", null, row.name), h("div", { className: "lcs-note" }, row.description || row.path || "")),
												h("span", { className: "lcs-tag" }, row.source || "skills")
											)
										)
									)
						)
					),

					h(
						"section",
						{ className: "lcs-block lcs-lib lcs-calls-plugins" },
						h(
							"div",
							{ className: "lcs-block-head" },
							h("b", null, T("插件与 bundle")),
							h("em", null, pluginAll.length + T(" 个 · 启停走 dsh 的插件管理器")),
							h("input", {
								className: "lcs-input",
								style: { marginLeft: "auto", width: "180px" },
								placeholder: T("搜索插件"),
								value: pluginQuery,
								onChange: (e) => setPluginQuery(e.target.value)
							})
						),
						h(
							"div",
							{ className: "lcs-block-body" },
							h(
								"div",
								{ className: "lcs-list" },
								shownPlugins.map((row) =>
									h(
										"div",
										{ key: "p-" + row.id, className: "lcs-item" },
										h("span", { className: "lcs-pill", "data-on": String(row.enabled) }, row.enabled ? T("启用") : T("停用")),
										h(
											"div",
											{ className: "lcs-item-text" },
											h("b", null, row.name),
											h("div", { className: "lcs-note" }, (row.version || "") + " · " + (row.source || "plugin") + " · " + (row.entryId || row.id))
										),
										row.readOnlyReason
											? h("span", { className: "lcs-tag", title: T("不由插件管理器直接管理") }, T("只读：") + row.readOnlyReason)
											: h("button", { className: "lcs-btn", onClick: () => toggle("plugin", row.id, !row.enabled) }, row.enabled ? T("停用") : T("启用"))
									)
								)
							),
							h("div", { className: "lcs-sep" }),
							h(
								"div",
								{ className: "lcs-list" },
								(plugins.bundles || []).map((row) =>
									h(
										"div",
										{ key: "b-" + row.name, className: "lcs-item" },
										h("span", { className: "lcs-pill", "data-on": String(row.enabled) }, row.enabled ? T("启用") : T("停用")),
										h("div", { className: "lcs-item-text" }, h("b", null, row.name), h("div", { className: "lcs-note" }, "bundle · " + row.version)),
										h("button", { className: "lcs-btn", onClick: () => toggle("bundle", row.name, !row.enabled) }, row.enabled ? T("停用") : T("启用"))
									)
								)
							),
							pluginAll.length > pluginLimit
								? h("button", { className: "lcs-btn", style: { alignSelf: "flex-start" }, onClick: () => setPluginLimit((n) => n + 20) }, T("显示更多（还有 ") + (pluginAll.length - pluginLimit) + T(" 个）"))
								: null,
							h("div", { className: "lcs-sep" }),
							h(
								"div",
								{ className: "lcs-calls-sub" },
								h("b", null, T("cap/tool 说明条目")),
								h("em", null, wsAll.length + T(" 条 · 工作区 <WS>/cap/tool 下的工具说明，不是可执行文件")),
								h("input", {
									className: "lcs-input",
									style: { marginLeft: "auto", width: "150px", flex: "0 0 auto" },
									placeholder: T("搜索工具条目"),
									value: toolQuery,
									onChange: (e) => setToolQuery(e.target.value)
								}),
								h("button", { className: "lcs-btn", onClick: addTool }, T("新增"))
							),
							(wsTools.rows || []).length === 0
								? h("div", { className: "lcs-note" }, T("cap/tool 为空或不存在。"))
								: h(
										"div",
										{ className: "lcs-list" },
										shownWs.map((row) =>
											h(
												"div",
												{ key: row.id, className: "lcs-item" },
												h("span", { className: "lcs-pill", "data-on": String(!row.disabled) }, row.disabled ? T("已停用") : T("启用")),
												h("div", { className: "lcs-item-text" }, h("b", null, row.name), h("div", { className: "lcs-note" }, row.summary || fmtSize(row.size))),
												h("button", { className: "lcs-btn", onClick: () => toggleTool(row.name, row.disabled) }, row.disabled ? T("启用") : T("停用")),
												h("button", { className: "lcs-btn", "data-tone": "danger", onClick: () => removeTool(row.name) }, T("删除"))
											)
										)
									)
						)
					),

					h(
						"section",
						{ className: "lcs-block lcs-lib lcs-calls-programs" },
						h(
							"div",
							{ className: "lcs-block-head" },
							h("b", null, T("可执行程序")),
							h("em", null, T("PATH 扫描 ") + (programs.total ?? 0) + T(" 个，当前显示 ") + shownPrograms.length + T(" 个 · 拖到对话输入框可导入")),
							h("input", {
								className: "lcs-input",
								style: { marginLeft: "auto", width: "180px" },
								placeholder: T("过滤程序名或路径"),
								value: progQuery,
								onChange: (e) => setProgQuery(e.target.value)
							}),
							h("button", { className: "lcs-btn", onClick: registerProgram }, T("登记程序"))
						),
						h(
							"div",
							{ className: "lcs-block-body" },
							h(
								"div",
								{ className: "lcs-list" },
								shownPrograms.map((row) =>
									h(
										"div",
										{
											key: row.id + row.path,
											className: "lcs-item",
											draggable: true,
											title: T("按住后拖到 DSH 对话输入框即可作为文件导入；单击复制路径"),
											onPointerDown: () => prefetchProgram(row),
											onDragStart: (ev) => {
												const file = dragFiles.current.get(row.path);
												ev.dataTransfer.effectAllowed = "copy";
												if (file instanceof File) {
													try {
														ev.dataTransfer.items.clear();
														ev.dataTransfer.items.add(file);
														ev.dataTransfer.setData("text/plain", row.path);
														return;
													} catch (err) {
														setNotice({ ok: false, text: T("构造拖拽负载失败：") + String(err) });
													}
												}
												const url = "file:///" + String(row.path).replace(/\\/g, "/");
												ev.dataTransfer.setData("text/uri-list", url);
												ev.dataTransfer.setData("text/plain", row.path);
												setNotice({ ok: false, text: T("文件还没读完，松手后重拖一次（约半秒），或单击复制路径") });
											},
											onClick: async () => {
												try {
													await navigator.clipboard.writeText(row.path);
													setNotice({ ok: true, text: T("已复制路径：") + row.path });
												} catch (err) {
													setNotice({ ok: false, text: T("复制失败：") + String(err) });
												}
											}
										},
										h("div", { className: "lcs-item-text" }, h("b", null, row.name), h("div", { className: "lcs-mono" }, row.path)),
										h("span", { className: "lcs-tag" }, row.source)
									)
								)
							),
							progAll.length > progLimit
								? h("button", { className: "lcs-btn", style: { alignSelf: "flex-start" }, onClick: () => setProgLimit((n) => n + 20) }, T("显示更多（还有 ") + (progAll.length - progLimit) + T(" 个）"))
								: null
						)
					)
				)
			);
		}

		/* ────────────────────────────── outputs ────────────────────────────── */

		const CATEGORY_LABEL = { changed: "本会话观察到的写入", temp: "疑似临时文件", rollback: "备份或版本文件", final: "其他扫描文件" };

		function OutputsView({ sessionId }) {
			const { data, error } = useJson("/lc/outputs?session=" + encodeURIComponent(sessionId || ""), 15000);
			const [category, setCategory] = useState("changed");
			const [fileType, setFileType] = useState("全部类型");
			const [viewer, setViewer] = useState(undefined);
			const [picked, setPicked] = useState(() => new Set());
			const [preview, setPreview] = useState(undefined);
			const [backups, setBackups] = useState(undefined);
			const [notice, setNotice] = useState(undefined);
			const { data: turnData } = useJson("/lc/outputs/turns?session=" + encodeURIComponent(sessionId || ""), 15000);
			const { data: preData } = useJson("/lc/outputs/preimages?session=" + encodeURIComponent(sessionId || ""), 15000);
			const { data: finalData } = useJson("/lc/outputs/final?session=" + encodeURIComponent(sessionId || "") + "&lang=" + LANG, 15000);

			const rows = data ? (data.rows || []).filter((row) => row.category === category && (fileType === "全部类型" || row.type === fileType)) : [];

			const open = async (row, mode) => {
				const result = await api("/lc/outputs/open", { path: row.path, mode });
				setNotice({ ok: result.ok, text: result.ok ? (mode === "select" ? T("已在资源管理器定位") : T("已交给系统程序打开")) : T("失败：") + result.reason });
			};
			const read = async (row) => {
				const result = await api("/lc/file?path=" + encodeURIComponent(row.path));
				if (!result.ok) return setNotice({ ok: false, text: T("读取失败：") + result.reason });
				setViewer({ ...result, row });
			};
			const retire = async (row) => {
				if (!window.confirm(T("把这行移出产出目录？会先备份。\n") + row.path)) return;
				const result = await api("/lc/outputs/retire", { path: row.path, confirm: true });
				setNotice({ ok: result.ok, text: result.ok ? T("已移走（回读：") + result.readback + "）" : T("失败：") + result.reason });
			};
			const previewClean = async (paths) => {
				const result = await api("/lc/outputs/retire-many", { paths, preview: true });
				if (!result.ok) return setNotice({ ok: false, text: T("预览失败：") + result.reason });
				setPreview(result);
				setNotice(undefined);
			};
			const runClean = async () => {
				if (!preview) return;
				if (!window.confirm(T("清理 ") + preview.count + T(" 个文件（合计 ") + fmtSize(preview.totalBytes) + T("）？会先备份再改名，不会直接删除。"))) return;
				const result = await api("/lc/outputs/retire-many", { paths: preview.rows.map((row) => row.path), confirm: true });
				setPreview(undefined);
				setPicked(new Set());
				setNotice({ ok: result.ok, text: T("清理完成：移走 ") + result.moved + " / " + result.count + T(" 个，合计 ") + fmtSize(result.totalBytes) + (result.results ? T("；失败 ") + result.results.filter((r) => !r.ok).length + T(" 个") : "") });
			};
			const lookBackups = async (row) => {
				const result = await api("/lc/outputs/backups?path=" + encodeURIComponent(row.path));
				if (!result.ok) return setNotice({ ok: false, text: T("查询失败：") + result.reason });
				setBackups({ path: row.path, rows: result.backups });
				setNotice({ ok: true, text: result.backups.length === 0 ? T("这个文件没有本插件的备份，无法回滚。") : T("找到 ") + result.backups.length + T(" 个备份，最新一个是 ") + fmtTime(result.backups[0].mtime) });
			};
			const doRestore = async (row, backup) => {
				if (!window.confirm(T("用这个备份覆盖当前文件？\n备份：") + backup + T("\n当前：") + row.path)) return;
				const result = await api("/lc/outputs/restore", { path: row.path, backup, confirm: true });
				setNotice({ ok: result.ok, text: result.ok ? T("已恢复并回读校验：") + result.readback : T("恢复失败：") + result.reason });
				setBackups(undefined);
			};

			const finalBlock = () => {
				if (!finalData) return null;
				if (!finalData.hasMarker) {
					return h(
						"section",
						{ className: "lcs-final", "data-state": "idle" },
						h("div", { className: "lcs-final-side" }, h("b", null, T("最终产出"))),
						h(
							"div",
							{ className: "lcs-final-main" },
							h("div", { className: "lcs-final-head" }, h("b", null, T("还没有结束标记"))),
							h("div", { className: "lcs-note" }, T("在对话里单独发一条「发送」「结束」或 /end，这一段写完的文件会汇总到最上面这里。"))
						)
					);
				}
				const segment = finalData.segment || { from: 0, to: 0 };
				return h(
					"section",
					{ className: "lcs-final", "data-state": "done" },
					h("div", { className: "lcs-final-side" }, h("b", null, T("最终产出"))),
					h(
						"div",
						{ className: "lcs-final-main" },
						finalData.summary ? h("p", { className: "lcs-final-summary" }, finalData.summary) : null,
						finalData.summaryPending ? h("div", { className: "lcs-note" }, T("正在把整段对话归纳成一句话…")) : null,
						finalData.count === 0
							? h("div", { className: "lcs-note" }, T("这一段没有观察到写文件。"))
							: h(
									"div",
									{ className: "lcs-final-list" },
									finalData.rows.map((row) =>
										h(
											"div",
											{ key: row.path, className: "lcs-final-row" },
											h("b", null, row.name),
											h("span", { className: "lcs-note" }, row.exists ? fmtSize(row.size) + " · " + relTime(row.mtime) : T("文件已不存在")),
											h("span", { className: "lcs-mono lcs-grow" }, row.path),
											h("button", { className: "lcs-btn", onClick: () => open(row, "select") }, T("定位")),
											h("button", { className: "lcs-btn", onClick: () => read({ ...row, name: row.name, mtime: row.mtime }) }, T("阅读")),
											h("button", { className: "lcs-btn", onClick: () => open(row, "open") }, T("打开"))
										)
									)
								)
					)
				);
			};

			if (error) return h("div", { className: "lcs-empty" }, T("取数失败：") + error);
			if (!data) return h("div", { className: "lcs-empty" }, T("扫描中…"));

			return h(
				"div",
				{ className: "lcs-scroll" },
				h(
					"div",
					{ className: "lcs-grid" },
					finalBlock(),
					h("div", { className: "lcs-note" }, T("这些是限定目录中的扫描结果，并非全部经过确认的产出；写入记录覆盖插件观察到的会话事件，备份文件也不等于可回滚版本。")),
					h(
						"div",
						{ className: "lcs-row" },
						Object.entries(CATEGORY_LABEL).map(([key, label]) =>
							h(
								"button",
								{ key, className: "lcs-btn", "data-tone": category === key ? "primary" : undefined, onClick: () => setCategory(key) },
								T(label) + "  " + (data.counts ? data.counts[key] : 0)
							)
						),
						h("span", { className: "lcs-note", style: { marginLeft: "auto" } }, T("共 ") + data.total + T(" 个文件 · 扫描于 ") + fmtTime(data.generatedAt) + T(" · 本会话写过 ") + data.writtenCount + T(" 个"))
					),
					category === "rollback" && turnData ? h("section", { className: "lcs-block" },
						h("div", { className: "lcs-block-head" }, h("b", null, T("按对话轮查看变更")), h("em", null, T("基于宿主记录；已释放的快照标记为不可用"))),
						h("div", { className: "lcs-block-body" },
							!turnData.available ? h("div", { className: "lcs-note" }, T("当前会话未连接到宿主变更记录。")) :
							(turnData.turns || []).length === 0 ? h("div", { className: "lcs-note" }, T("此会话尚无可查的工作区变更记录。")) :
							turnData.turns.map((entry) => h("div", { key: entry.turn, className: "lcs-item", style: { display: "block" } },
								h("b", null, T("第 ") + entry.turn + T(" 轮")),
								entry.versions.map((version, index) => h("div", { key: version.seq, className: "lcs-note", style: { padding: "6px 0" } },
									(entry.versions.length > 1 ? T("版本 ") + (index + 1) + " · " : "") + (version.available ? version.files.length + T(" 个文件") : T("历史记录的快照已释放")) + " · " + fmtTime(version.time),
									version.available ? h("div", null, version.files.map((file) => h("div", { key: file.path, className: "lcs-mono" }, file.display || file.path))) : null
								))
							))
						)) : null,
					category === "rollback" && preData
						? h(
								"section",
								{ className: "lcs-block" },
								h("div", { className: "lcs-block-head" }, h("b", null, T("按轮可回滚的文件")), h("em", null, T("插件在写文件前复制的前像；恢复时原内容会另存一份"))),
								h(
									"div",
									{ className: "lcs-block-body" },
									(preData.turns || []).length === 0
										? h("div", { className: "lcs-note" }, preData.note || T("本次载入后尚未观察到写文件调用，没有可回滚的前像。"))
										: preData.turns.slice(-8).reverse().map((entry) =>
												h("div", { key: entry.turn, style: { padding: "6px 0" } },
													h("b", null, T("第 ") + entry.turn + T(" 轮 · ") + entry.files.length + T(" 个文件")),
													entry.files.map((file) =>
														h("div", { key: file.backup, className: "lcs-row", style: { padding: "3px 0" } },
															h("span", { className: "lcs-mono lcs-grow" }, file.path),
															h("span", { className: "lcs-note" }, fmtSize(file.size) + " · " + relTime(file.at)),
															h("button", { className: "lcs-btn", "data-tone": "primary", onClick: () => doRestore({ path: file.path }, file.backup) }, T("恢复到这一轮之前"))
														)
													)
												)
											)
								)
							)
						: null,
					h("div", { className: "lcs-row" }, h("span", { className: "lcs-note" }, T("文件类型")), h("select", { className: "lcs-select", value: fileType, onChange: (e) => setFileType(e.target.value) }, ["全部类型", "文档", "图片", "代码", "文本与数据", "其他类型"].map((type) => h("option", { key: type, value: type }, T(type)))), h("span", { className: "lcs-note" }, T("当前显示 ") + rows.length + T(" 项；类型按扩展名识别"))),
					category === "temp"
						? h(
								"div",
								{ className: "lcs-row" },
								h("button", { className: "lcs-btn", onClick: () => setPicked(new Set(rows.map((row) => row.path))) }, T("全选当前列表")),
								h("button", { className: "lcs-btn", onClick: () => setPicked(new Set()) }, T("清除选择")),
								h("button", { className: "lcs-btn", "data-tone": "danger", disabled: picked.size === 0, onClick: () => previewClean([...picked]) }, T("预览清理 ") + picked.size + T(" 个")),
								h("span", { className: "lcs-note" }, T("只处理勾选的文件；先备份到 lc-plugin/backups，再改名为 .retired-时间戳"))
							)
						: null,
					preview
						? h(
								"section",
								{ className: "lcs-block" },
								h("div", { className: "lcs-block-head" }, h("b", null, T("清理预览")), h("em", null, preview.count + T(" 个 · 合计 ") + fmtSize(preview.totalBytes))),
								h(
									"div",
									{ className: "lcs-block-body" },
									preview.rows.map((row) => h("div", { key: row.path, className: "lcs-mono", style: { padding: "2px 0" } }, (row.exists ? fmtSize(row.size) : T("已不存在")) + "  " + row.path)),
									h("div", { className: "lcs-row", style: { marginTop: 8 } },
										h("button", { className: "lcs-btn", "data-tone": "danger", onClick: runClean }, T("确认清理 ") + preview.count + T(" 个")),
										h("button", { className: "lcs-btn", onClick: () => setPreview(undefined) }, T("取消"))
									)
								)
							)
						: null,
					backups
						? h(
								"section",
								{ className: "lcs-block" },
								h("div", { className: "lcs-block-head" }, h("b", null, T("备份")), h("em", null, backups.path)),
								h(
									"div",
									{ className: "lcs-block-body" },
									backups.rows.length === 0
										? h("div", { className: "lcs-note" }, T("没有本插件的备份，无法从这里恢复。"))
										: backups.rows.map((entry) =>
												h("div", { key: entry.backup, className: "lcs-row" },
													h("span", { className: "lcs-note" }, fmtTime(entry.mtime) + " · " + fmtSize(entry.size)),
													h("span", { className: "lcs-mono lcs-grow" }, entry.stamp),
													h("button", { className: "lcs-btn", "data-tone": "primary", onClick: () => doRestore({ path: backups.path }, entry.backup) }, T("恢复这个备份"))
												)
											),
									h("div", { className: "lcs-row", style: { marginTop: 8 } }, h("button", { className: "lcs-btn", onClick: () => setBackups(undefined) }, T("关闭")))
								)
							)
						: null,
					notice ? h("div", { className: notice.ok ? "lcs-note lcs-ok" : "lcs-note lcs-bad" }, notice.text) : null,
					viewer
						? h(
								"div",
								{ className: "lcs-viewer" },
								h(
									"div",
									{ className: "lcs-row", style: { marginBottom: 8 } },
									h("b", { className: "lcs-grow" }, viewer.row.name),
									h("span", { className: "lcs-note" }, fmtSize(viewer.size) + " · " + relTime(viewer.row.mtime)),
									h("button", { className: "lcs-btn", onClick: () => setViewer(undefined) }, T("关闭")),
									h("button", { className: "lcs-btn", onClick: () => open(viewer.row, "open") }, T("用系统程序打开"))
								),
								viewer.mode === "text"
									? h("pre", null, viewer.text)
									: viewer.mode === "image"
										? h("img", { alt: viewer.row.name, src: "data:image/" + (viewer.ext || "png").replace(".", "") + ";base64," + viewer.base64 })
										: h("div", { className: "lcs-note" }, T("这个类型没有内置阅读器（") + (viewer.ext || viewer.mode) + T("），请用系统程序打开。"))
							)
						: null,
					h(
						"section",
						{ className: "lcs-block" },
						h(
							"div",
							{ className: "lcs-block-body", style: { padding: 8 } },
							rows.length === 0
								? h("div", { className: "lcs-note" }, T("这一分类下没有文件。"))
								: h(
										"div",
										{ className: "lcs-list", style: { maxHeight: "none" } },
										rows.map((row) =>
											h(
												"div",
												{ key: row.path, className: "lcs-item", style: { flexDirection: "column", alignItems: "stretch" } },
												h(
													"div",
													{ className: "lcs-row" },
													category === "temp"
														? h("input", {
																type: "checkbox",
																checked: picked.has(row.path),
																onChange: (e) => {
																	const next = new Set(picked);
																	if (e.target.checked) next.add(row.path);
																	else next.delete(row.path);
																	setPicked(next);
																}
															})
														: null,
													h("span", { className: "lcs-dot", "data-s": "ok" }),
													h("b", { className: "lcs-grow" }, row.name),
													h("span", { className: "lcs-note" }, fmtSize(row.size) + " · " + relTime(row.mtime) + (row.versionCount ? " · " + row.versionCount + T(" 个版本") : "")),
													category === "rollback" || category === "final" ? h("button", { className: "lcs-btn", onClick: () => lookBackups(row) }, T("查备份")) : null,
													h("button", { className: "lcs-btn", onClick: () => open(row, "select") }, T("定位")),
													h("button", { className: "lcs-btn", onClick: () => read(row) }, T("阅读")),
													h("button", { className: "lcs-btn", onClick: () => open(row, "open") }, T("打开")),
													h("button", { className: "lcs-btn", "data-tone": "danger", onClick: () => retire(row) }, T("移出"))
												),
												h("div", { className: "lcs-mono" }, row.path),
												row.versions
													? h(
															"div",
															{ className: "lcs-versions" },
															row.versions.map((version) =>
																h("div", { key: version.path, className: "lcs-note" }, h("span", { className: "lcs-tag" }, fmtSize(version.size)), " ", fmtTime(version.mtime), " · ", version.dir)
															)
														)
													: null
											)
										)
									)
						)
					)
				)
			);
		}

		/* ────────────────────────────── page ────────────────────────────── */

		const TABS = [
			{ id: "canvas", label: "画布" },
			{ id: "memory", label: "记忆" },
			{ id: "calls", label: "调用" },
			{ id: "outputs", label: "产出" }
		];

		/* ── 右栏共享状态 ────────────────────────────────────────────────────
		 * 「在右栏打开」的入口在面板顶部下拉里，展示体是 sidebar.right.pane.tab。
		 * 两者是同一个模块的两个槽位实例，用模块级状态 + 订阅同步，
		 * 这样下拉选中的那一格会立刻反映到已经打开的右栏，不需要重新注册。 */
		const rightState = { view: "canvas", open: null };
		const rightSubs = new Set();

		function setRightView(next) {
			rightState.view = next;
			for (const fn of rightSubs) fn(next);
		}

		function useRightView() {
			const [view, setView] = useState(rightState.view);
			useEffect(() => {
				rightSubs.add(setView);
				setView(rightState.view);
				return () => {
					rightSubs.delete(setView);
				};
			}, []);
			return [view, setRightView];
		}

		/** 打开（或聚焦）右栏的 lc-station 页，并定位到某一格。返回错误文本，成功返回 null。 */
		function openRight(view, sessionId) {
			setRightView(view);
			if (typeof rightState.open !== "function") return T("右栏服务不可用（sidebarRight 未就绪）");
			try {
				rightState.open(view, sessionId ?? null);
				return null;
			} catch (err) {
				return T("openTab 失败：") + ((err && err.message) || String(err));
			}
		}

		/** 四格共用的主体，主面板与右栏都用它，避免两套渲染逻辑漂移。 */
		function StationBody({ tab, sessionId }) {
			return h(
				"div",
				{ className: "lcs-body" },
				tab === "canvas" ? h(CanvasView, { sessionId }) : null,
				tab === "memory" ? h(MemoryView, { sessionId }) : null,
				tab === "calls" ? h(CallsView, null) : null,
				tab === "outputs" ? h(OutputsView, { sessionId }) : null
			);
		}

		function StationPage() {
			const [tab, setTab] = useState("canvas");
			const [sessionId, setSessionId] = useState(null);
			const [err, setErr] = useState(null);
			const [lang, setLang] = useState(LANG);
			LANG = lang;
			const pickLang = (next) => {
				LANG = next;
				try {
					localStorage.setItem("lcs-lang", next);
				} catch {
					/* private mode: the switch still works for this render */
				}
				setLang(next);
			};
			const langSwitch = h(
				"div",
				{ className: "lcs-tabs lcs-tabs-sm lcs-lang" },
				["zh", "en"].map((code) =>
					h(
						"button",
						{ key: code, className: "lcs-tab", "data-active": String(lang === code), title: code === "zh" ? "中文" : "English", onClick: () => pickLang(code) },
						code === "zh" ? "中" : "EN"
					)
				)
			);
			const { data } = useJson("/lc/sessions", 4000);

			useEffect(() => {
				if (sessionId !== null || !data || !data.ok) return;
				const first = (data.sessions || [])[0];
				setSessionId(first ? first.sessionId : data.lastSessionId ?? null);
			}, [data, sessionId]);

			return h(
				"div",
				{ className: "lcs-root" },
				h(
					"div",
					{ className: "lcs-head" },
					h("div", { className: "lcs-title" }, h("h1", null, T("工作站")), h("span", null, "lc-station")),
					h(
						"div",
						{ className: "lcs-row", style: { gap: 8 } },
						data && (data.sessions || []).length > 0
							? h(
									"select",
									{ className: "lcs-select", style: { width: 300 }, value: sessionId ?? "", onChange: (e) => setSessionId(e.target.value) },
									(data.sessions || []).map((row) =>
										h("option", { key: row.sessionId, value: row.sessionId }, row.sessionId.slice(0, 24) + " · " + row.cards + T(" 张 · ") + relTime(row.updatedAt))
									)
								)
							: h("span", { className: "lcs-note" }, T("暂无活动会话"))
					),
					langSwitch,
					h(
						"div",
						{ className: "lcs-tabs" },
						TABS.map((item) =>
							h("button", { key: item.id, className: "lcs-tab", "data-active": String(tab === item.id), onClick: () => setTab(item.id) }, T(item.label))
						)
					)
				),
				h(
					"div",
					{ className: "lcs-sub" },
					h("span", null, T("画布：session/event 增量折叠，只增不改")),
					h("span", null, T("记忆：磁盘 + 事件规则抽取，可改可导入")),
					h("span", null, T("调用：读活服务，改动回读确认")),
					h("span", null, T("产出：有界扫描，定位/阅读/比版本"))
				),
				h(StationBody, { tab, sessionId })
			);
		}

		/* ── 右栏：跟在当前对话旁边的那一列 ────────────────────────────────
		 * 槽位作用域是 session，props 直接带当前 sessionId，所以「打开就是
		 * 当前对话的对应内容」不靠猜、不靠 lastSessionId 回退。 */
		function RightPane(props) {
			const sessionId = props && props.sessionId ? props.sessionId : null;
			const [tab, setTab] = useRightView();
			const [lang, setLang] = useState(LANG);
			LANG = lang;
			const pickLang = (next) => {
				LANG = next;
				try {
					localStorage.setItem("lcs-lang", next);
				} catch {
					/* private mode */
				}
				setLang(next);
			};
			const langSwitch = h(
				"div",
				{ className: "lcs-tabs lcs-tabs-sm lcs-lang" },
				["zh", "en"].map((code) =>
					h(
						"button",
						{ key: code, className: "lcs-tab", "data-active": String(lang === code), title: code === "zh" ? "中文" : "English", onClick: () => pickLang(code) },
						code === "zh" ? "中" : "EN"
					)
				)
			);
			return h(
				"div",
				{ className: "lcs-root lcs-pane" },
				h(
					"div",
					{ className: "lcs-pane-head" },
					h("span", { className: "lcs-pane-title" }, T("工作站")),
					h("span", { className: "lcs-chip" }, sessionId ? T("当前对话") : T("最近对话")),
					h(
						"div",
						{ className: "lcs-tabs lcs-tabs-sm" },
						TABS.map((item) =>
							h("button", { key: item.id, className: "lcs-tab", "data-active": String(tab === item.id), onClick: () => setTab(item.id) }, T(item.label))
						)
					),
					langSwitch
				),
				h(StationBody, { tab, sessionId })
			);
		}

		function RightPaneTitle() {
			return h("span", { className: "lcs-chip" }, T("工作站"));
		}

		/* ────────────────────────────── apply ────────────────────────────── */

		const inject = ["slots"];
		const PANEL_ID = "lc-station";

		function apply(ctx) {
			ctx.effect(() => installStyles(), "lc-station: stylesheet");

			ctx.effect(() => {
				const disposers = [];
				// `main` is keyed by the id the sidebar dispatches, so the sidebar entry
				// below and this page are one navigation target.
				disposers.push(
					ctx.slots.inject("main", () =>
						ctx.slots.register(
							{
								name: "main",
								key: PANEL_ID,
								label: () => T("工作站")
							},
							StationPage
						)
					)
				);
				disposers.push(
					ctx.slots.inject("sidebar.panellist", () =>
						ctx.slots.register(
							{
								name: "sidebar.panellist",
								id: PANEL_ID,
								order: 12,
								label: () => T("工作站")
							},
							LcStationIcon
						)
					)
				);

				/* 右栏：等 sidebarRightTabs / sidebarRight 两个服务就绪再挂，
				 * 用 ctx.inject 做局部延迟，缺服务时只少一个右栏、不拖垮整个插件。 */
				ctx.inject(["sidebarRightTabs", "sidebarRight", "layout"], (scope) => {
					const tabTypes = scope.sidebarRightTabs;
					const rightAxis = scope.sidebarRight;
					const layoutFace = scope.layout;
					if (!tabTypes || typeof tabTypes.register !== "function") return;
					if (rightAxis && typeof rightAxis.openTab === "function") {
						/* 先展开右栏——只有它渲染之后 session surface 才挂得上，openTab 才有东西可开；
						 * 再下一拍按 kind 开页。openTabIn 只对已 adopt 的 session 生效，所以给两次机会。 */
						rightState.open = (view, sessionId) => {
							try {
								layoutFace?.openRightbar?.(true, false);
							} catch (err) {
								console.warn("lc-station: openRightbar failed", err);
							}
							const options = { params: { view } };
							const attempt = () => {
								try {
									if (sessionId && typeof rightAxis.openTabIn === "function") rightAxis.openTabIn(sessionId, PANEL_ID, options);
									else rightAxis.openTab(PANEL_ID, options);
								} catch (err) {
									console.warn("lc-station: openTab failed", err);
								}
							};
							setTimeout(attempt, 260);
							setTimeout(attempt, 620);
						};
					}
					scope.effect(
						() =>
							tabTypes.register({
								id: PANEL_ID,
								kind: "lc-station",
								title: () => T("工作站"),
								guide: [
									{
										id: "lc-station-pane",
										order: 12,
										title: () => T("工作站"),
										description: () => T("画布 / 记忆 / 调用 / 产出，跟着当前对话走")
									}
								]
							}),
						"lc-station: right tab type"
					);
					scope.slots.inject("sidebar.right.pane.tab", () =>
						scope.slots.register({ name: "sidebar.right.pane.tab", key: PANEL_ID }, RightPane)
					);
					scope.slots.inject("sidebar.right.pane.tab.title", () =>
						scope.slots.register({ name: "sidebar.right.pane.tab.title", key: PANEL_ID }, RightPaneTitle)
					);
				});
				return () => {
					for (const dispose of disposers) {
						try {
							dispose();
						} catch {
							/* slot already collapsed */
						}
					}
				};
			}, "lc-station: slots");
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
