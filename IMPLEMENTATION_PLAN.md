# Implementation Plan — 出师考核学习工具 v2

> 基于 DESIGN_MASTER.md 和四份 WORK_ORDER 的整合实施计划
> 执行顺序：A → B → C → D（顺序执行，每阶段完成确认后进入下一阶段）

---

## 执行总览

```
阶段 A: app.js 独占修改（三模块串行）
    ├── 模块一: 学习路径导航 (subjects/study-plan.json + app.js 视图渲染)
    ├── 模块二: 自适应练习 (app.js: perf 表 + 加权出题 + 智能复习)
    └── 模块三: 错题本 + 仪表盘 (app.js: 错题过滤 + 统计图表)
        ↓ [Gate A: 语法通过 + 6 个 switchTab 正常工作]

阶段 B: 实践备考（独立文件，不碰 app.js）
    ├── subjects/practical-exam.json (操作考点 + 答辩题库)
    └── practical-exam.js (独立渲染引擎)
        ↓ [Gate B: JSON 合法 + JS 编译通过]

阶段 C: PWA + 移动适配（index.html 独占修改）
    ├── manifest.json + sw.js (离线 + 可安装)
    └── index.html (Tab 栏对齐 + 容器 + 响应式 CSS)
        ↓ [Gate C: 手机可用 + 离线可用 + 全 Tab 正常]

阶段 D: 题库扩充（仅改 subject 文件，每次一个）
    ├── s3 中药学 23→50 | s4 方剂学 16→40 | s9 针灸 18→40
    └── s6 外科 18→35 | s2/s7/s8 各补 5-6 题
        ↓ [Gate D: 500+ 题 + 每批语法通过]
```

---

## 阶段 A 详细步骤

### A1: 新建 subjects/study-plan.json（5-10KB）

三阶段路线配置数据，结构按 WORK_ORDER_A.md 中的模板。

### A2: 扩展 app.js Tab 系统

当前 switchTab() 处理 `learn`/`quiz`/`favs`/`history` 四个 tab。扩展为：
```
learn → study（改名，保持向后兼容）
studyPlan（新增）
quiz（保持）
wrongBook（新增）
stats（新增）
practical（新增，占位符给阶段 B）
```

Tab 名称最终以 DESIGN_MASTER.md 2.5 节为准。

### A3: 新增 renderStudyPlan()

读取 study-plan 数据 → 渲染三阶段卡片 → 进度条 → 点击跳转。

### A4: 进度追踪集成

showCard() 后追加到 `studyProgress.readPoints`，cardQuiz 完成后追加到 `studyProgress.cardQuizDone`。

### A5: perf 数据管理层

新增 getPerf() / savePerf() / getAccuracy() 三个函数，schema 见 DESIGN_MASTER.md 2.2。

### A6: 加权出题逻辑改造

改造现有的出题函数，将「随机 shuffle + slice」替换为三池加权采样（复习 60% / 巩固 30% / 探索 10%）。_submitQuiz() 中追加 savePerf() 调用。

### A7: 智能复习按钮 + 题目标签

练习选科界面新增「全局智能复习」按钮；每道题卡片显示 🔄重点复习 / ✅掌握 / ⭐新题 标签。

### A8: 错题本（renderWrongBook）

perf 表筛选正确率 <50% 的知识点 → 按科分组 → 错题重做 → 导出。

### A9: 统计仪表盘（renderStats）

手写 HTML/CSS 横向条形图（科目概览）+ SVG 简易折线图（正确率趋势）+ 薄弱板块高亮。

### A10: 阶段 B 占位符

app.js 末尾添加空函数 `window.renderPractical = function() {}`，供阶段 B 覆盖。

### 阶段 A 风险与缓解

| 风险 | 概率 | 缓解 |
|------|------|------|
| app.js 截断（29KB > Write 工具上限） | 高 | 所有 app.js 写入用 Python heredoc，不能直接用 Write 工具 |
| Tab 栏不匹配（index.html 还是 4 个旧 Tab） | 高 | 阶段 A 不改 index.html，Tab 通过 switchTab() 代码路径工作，无按钮可见是预期行为，阶段 C 修复 |
| 破坏现有 quizHistory | 中 | _submitQuiz() 中只追加 savePerf()，不删除现有推入逻辑 |

### 阶段 A 门禁

- [ ] `node --check app.js` 通过
- [ ] 6 个 switchTab() case 均不报错
- [ ] 答题后 `localStorage.perf` 写入正常
- [ ] 知识卡片展开后 `localStorage.studyProgress` 写入正常
- [ ] 现有学习/练习功能无退化
- [ ] 迷你诊室交互仍然正常

---

## 阶段 B 详细步骤

### B1: 新建 subjects/practical-exam.json（8-15KB）

结构化实践考纲数据：针灸操作（≥10 腧穴）、推拿（≥3 项）、拔罐（≥3 项）、艾灸（≥3 项）、答辩题库（≥10 道）。

### B2: 新建 practical-exam.js（8-12KB）

自执行 IIFE，提供 `window.renderPractical()` 覆盖阶段 A 的占位符。渲染左目录+右详情布局。localStorage key: `practicalProgress` 管理已掌握标记。

### 阶段 B 风险与缓解

| 风险 | 概率 | 缓解 |
|------|------|------|
| `#practical-tab` DOM 容器还不存在（阶段 C 才创建） | 高 | init() 用 setTimeout 轮询直到容器出现 |
| 与阶段 A 的 window.renderPractical 名称冲突 | 低 | 阶段 B 加载在 app.js 之后，直接覆盖占位符 |

### 阶段 B 门禁

- [ ] `node --check practical-exam.js` 通过
- [ ] `subjects/practical-exam.json` JSON 合法
- [ ] window.renderPractical 存在且不抛错
- [ ] 所有 content item 字段完整

---

## 阶段 C 详细步骤

### C1: 新建 manifest.json（~500B）

PWA 清单。无图标文件时不设 icons 数组。

### C2: 新建 sw.js（~2KB）

Cache-First 策略（subject JS/JSON + app.js），Network-First 策略（HTML）。版本化缓存名（tcm-exam-v1）。

### C3: 修改 index.html

- Tab 栏：从 4 个旧 Tab 扩展为 6 个新 Tab（具体名称以阶段 A 交付的 app.js 中 tabs 数组为准）
- 新增 Tab 按钮和容器 div（如果 app.js 采用 `#mainContent` 统一渲染则不需额外容器，但需为 practical 预备 `#practical-tab`）
- 引入 practical-exam.js 的 script 引用
- `<head>` 中加 PWA meta 标签（manifest link、viewport、theme-color、apple-mobile-web-app）
- `</body>` 前加 Service Worker 注册脚本
- CSS 末尾加响应式媒体查询（断点 768px，触控目标 ≥44px，字号 ≥14px）

### 阶段 C 关键注意事项

开工第一步：**读取阶段 A 交付的 app.js，确认 tabs 数组中实际的 Tab 名称**，以此为准对齐 index.html。

### 阶段 C 风险与缓解

| 风险 | 概率 | 缓解 |
|------|------|------|
| Tab 名称与 app.js 不一致 | 高 | 开工第一步读 app.js 确认 |
| SW 缓存过期内容 | 中 | 版本化缓存名，activate 清理旧版 |
| fetch 加载的数据离线不可用 | 中 | SW 对 /subjects/ 路径做 Cache-First |

### 阶段 C 门禁

- [ ] 6 个 Tab 按钮全部可见可用
- [ ] 阶段 A 学习路线正常渲染
- [ ] 阶段 B 实践备考正常渲染
- [ ] 375px 宽度下布局可用
- [ ] SW 注册成功
- [ ] 断网后内容可访问
- [ ] manifest.json 合法

---

## 阶段 D 详细步骤

### 题库扩充优先级

| 文件 | 当前 | 目标 | 增量 | 优先级 |
|------|:---:|:---:|:---:|:---:|
| s3-zhongyao.js | 23 | 50 | +27 | 🔴 最高 |
| s4-fangji.js | 16 | 40 | +24 | 🔴 最高 |
| s9-zhenjiu.js | 18 | 40 | +22 | 🟡 高 |
| s6-waike.js | 18 | 35 | +17 | 🟡 高 |
| s2-zhongzhen.js | 34 | 40 | +6 | 🟢 中 |
| s7-fuke.js | 33 | 38 | +5 | 🟢 中 |
| s8-erke.js | 30 | 35 | +5 | 🟢 中 |

### 每批流程

1. 读 target 文件 → 确认 QN 结构、ID 命名、引号风格
2. 确认目标知识点的 pointId 存在
3. 用 Python heredoc 写入（所有文件 >20KB）
4. `node --check` → 逗号检查 → 单元完整性
5. 浏览器验证新题可答可判

### 阶段 D 风险

| 风险 | 概率 | 缓解 |
|------|------|------|
| 大文件截断（s3 133KB） | 高 | Python heredoc，先从小文件（s7/s8 ~60KB）试水 |
| 插入后缺逗号 | 高 | 三连验证中逗号检查必做 |
| pointId 不存在 | 中 | 插入前 grep subject 文件确认 |
| 引号风格不一致 | 中 | 按 PROJECT_HANDOVER.md 4.2 节逐文件核对 |

---

## 已确认的设计决策

1. **study-plan.json 的加载方式**：阶段 A 在 app.js 中用 fetch 异步加载。阶段 C 的 Service Worker 自动缓存 `/subjects/` 路径，离线场景已覆盖。阶段 C 无需额外处理。

2. **Tab 布局调整**：保留 favs（收藏）为独立 Tab。history（答题历史）的原始数据展示并入统计 Tab，在趋势图下方以「查看详细答题记录」形式提供。最终 Tab 为 7 个：`study` / `studyPlan` / `quiz` / `wrongBook` / `stats` / `favs` / `practical`。

3. **quizHistory key 迁移**：v1 用 `syllabus_v4_qh`，v2 统一为 `quizHistory`。阶段 A 在 app.js 初始化时执行一次性迁移：读旧 key → 有数据则写入新 key → 仅保留新 key。之后所有代码只读 `quizHistory`。

### quizHistory key 迁移策略

**影响评估**：
- 阶段 A 的统计 Tab（趋势图）和阶段 C/D 均不直接依赖 key 名，只依赖 app.js 提供的数据读取接口
- 阶段 A 的 `_submitQuiz()` 同时写入新旧位置的 perf 数据和 quizHistory 记录
- 唯一风险：迁移逻辑执行时旧 key 有数据但写入新 key 失败（localStorage 满或异常）→ 概率极低，且旧数据保留不丢

**具体实现**（追加到 app.js 初始化流程末尾）：

```js
// 一次性迁移：syllabus_v4_qh → quizHistory
(function migrateQuizHistory() {
  var old = localStorage.getItem('syllabus_v4_qh');
  var existing = localStorage.getItem('quizHistory');
  if (old && !existing) {
    localStorage.setItem('quizHistory', old);
  }
  // 注意：不移除旧 key，保留作为后备，不增加任何风险
})();
```

旧 key `syllabus_v4_qh` 保留不清除——零风险，多占几字节 localStorage 完全可以接受。
