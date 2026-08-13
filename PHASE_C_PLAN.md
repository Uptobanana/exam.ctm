# 阶段 C 分步执行计划

> 创建日期：2026-07-16
> 状态：进行中
> 依赖：阶段 A + B 已完成

## 前置检查结果

- **app.js Tab 名称**（从 switchTab 分支提取）：`study` / `studyPlan` / `quiz` / `wrongBook` / `stats` / `favs` / `practical` — 共 7 个
- **渲染模型**：所有 Tab 共用 `#mainContent` 容器，各 render 函数通过 `mainContent.innerHTML = ...` 重绘
- **唯一例外**：practical-exam.js 的 `init()` 轮询等待 `#practical-tab`，需在 app.js 的 `renderPractical()` 中创建该 ID 的 div
- **index.html 现状**：4 个旧 Tab 按钮（`data-tab="learn"`/`quiz`/`favs`/`history`），需要在本次改为 7 个新按钮

## 执行原则

- 阶段 C **独占** index.html 写权限
- app.js 只做一处微调：`renderPractical()` 占位符（确保 `#practical-tab` 存在）
- 所有 Tab 共用 `#mainContent`，不创建独立容器 div
- 移动端适配以 iOS Safari 和 Chrome Android 为目标

---

## 分步执行

| 步 | 状态 | 做什么 | 改动文件 | 验证方式 |
|:--|:--|:---|:---|:---|
| 1 | ✅ 已完成 | 创建 `manifest.json`（无图标降级版） | 新文件 | python3 JSON 解析 |
| 2 | ✅ 已完成 | 创建 `sw.js` | 新文件 | `node --check` |
| 3 | ✅ 已完成 | 修改 app.js `renderPractical()` 占位符 + 移除 practical-exam.js 自启动 | app.js + practical-exam.js | `node --check` |
| 4 | ✅ 已完成 | 修改 index.html Tab 栏——4→7 个按钮 | index.html | 浏览器 Tab 切换正常 |
| 5 | ✅ 已完成 | 修改 index.html `<head>` 添加 PWA meta 标签 | index.html | — |
| 6 | ✅ 已完成 | 修改 index.html —— 引入 practical-exam.js + SW 注册 | index.html | — |
| 7 | ✅ 已完成 | 修改 index.html CSS——响应式适配（768px 断点） | index.html | — |
| 8 | ✅ 已完成 | 最终验证：JSON 合法 + JS 语法 + HTML 结构 | bash | 全部 19 项通过 ✅ |

---

## 关键设计决策

1. **不创建独立容器 div**——`#mainContent` 是唯一渲染目标，避免破坏现有 app.js switchTab 逻辑
2. **Tab 按钮保留 `data-tab` 属性**——app.js 用 `querySelector('[data-tab="..."]')` 匹配高亮，不能改成 `onclick` 模式
3. **旧 history Tab 按钮移除**——其功能已并入 stats 统计 Tab 的折叠面板
4. **收藏 Tab（favs）保留**——独立 Tab，按钮和容器不变

## 状态图例

- ⬜ 待执行
- 🔄 进行中
- ✅ 已完成
- ❌ 受阻
