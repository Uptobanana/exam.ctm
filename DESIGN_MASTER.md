# 出师考核学习工具 v2 — 总体设计文档

> 版本：v2.0-draft
> 日期：2026-07-16
> 本文件是所有阶段的「宪法」。每个阶段开工前必读。

---

## 一、架构总览

```
D:\Work\syllabus\
├── index.html                 ← 主入口（双击打开，PWA 改造目标）
├── app.js                     ← 核心引擎（学习框架 + 练习 + 统计，29KB）
├── mini-quiz-patch.js         ← 迷你诊室交互绑定
├── sw.js                      ← [新增·模块五] Service Worker
├── manifest.json              ← [新增·模块五] PWA Manifest
├── study-plan.json            ← [新增·模块一] 学习路线配置
├── practical-exam.js          ← [新增·模块四] 实践考试渲染引擎
├── DESIGN_MASTER.md           ← [本文件]
├── WORK_ORDER_A.md            ← 窗口 A 工作令
├── WORK_ORDER_B.md            ← 窗口 B 工作令
├── WORK_ORDER_C.md            ← 窗口 C 工作令
├── WORK_ORDER_D.md            ← 窗口 D 工作令
└── subjects/
    ├── study-plan.json        ← [新增·模块一] 学习路线数据
    ├── practical-exam.json    ← [新增·模块四] 实践考试数据
    ├── s1-zhongji.js          ← 中医基础理论（84KB 64题）
    ├── s2-zhongzhen.js        ← 中医诊断学（73KB 34题）
    ├── s3-zhongyao.js         ← 中药学（133KB 23题）
    ├── s4-fangji.js           ← 方剂学（77KB 16题）
    ├── s5-neike.js            ← 中医内科学（104KB 84题）
    ├── s6-waike.js            ← 中医外科学（99KB 18题）
    ├── s7-fuke.js             ← 中医妇科学（61KB 33题）
    ├── s8-erke.js             ← 中医儿科学（59KB 30题）
    └── s9-zhenjiu.js          ← 针灸学（56KB 18题）
```

## 二、共享数据结构约定（所有窗口必须遵守）

### 2.1 localStorage Key 命名规范

| Key | 用途 | 写入方 | 读取方 |
|-----|------|--------|--------|
| `perf` | 知识点掌握度表（JSON） | 模块二（练习评分） | 模块二（出题）、模块三（仪表盘） |
| `quizHistory` | 练习历史记录（JSON Array） | 模块二（每次提交） | 模块三（趋势图） |
| `quizSession` | 练习暂存（JSON） | 模块二（自动保存） | 模块二（恢复进度） |
| `studyProgress` | 学习进度（JSON） | 模块一（知识点已读标记） | 模块一（进度显示）、模块三（覆盖度） |
| `wrongBookCache` | 错题本缓存（JSON） | 模块三 | 模块三 |
| `favorites` | 收藏列表（JSON Array） | 已有（app.js favs 功能） | 阶段 A（favs Tab）

**所有 key 统一小驼峰命名（camelCase），不得使用下划线或连字符。**

### 2.2 perf 表 Schema（模块二写入，模块三读取）

```js
// localStorage key: "perf"
// 值：JSON 对象
{
  "zj-1-1": {            // 知识点 ID，与 subject 文件中 id 字段一致
    "total": 12,          // 该知识点相关题目的总作答次数
    "correct": 9,         // 答对次数
    "lastCorrect": true,  // 最近一次是否答对
    "lastSeen": 1721100000000  // Unix 毫秒时间戳
  },
  "zy-5-3": { "total": 4, "correct": 2, "lastCorrect": false, "lastSeen": 1721090000000 }
}
```

**perf 记录的 key 必须是 subject 文件中的知识点 ID——可以是单个 ID，也可以是单元级别的前缀匹配。当题目属于某知识点时，用该知识点的精确 ID；当题目跨知识点（如综合题），用主关联知识点的 ID。**

### 2.3 studyProgress Schema（模块一写入，模块一/三读取）

```js
// localStorage key: "studyProgress"
// 值：JSON 对象
{
  "readPoints": ["1-1-1", "1-1-2", "dx-10", ...],  // 已读知识点 ID 列表
  "cardQuizDone": ["1-1-1", "dx-10", ...],          // 已完成 cardQuiz 的知识点 ID
  "stageUnlocked": 2,                                // 已解锁阶段（1/2/3）
  "lastAccess": 1721100000000                         // 最后学习时间戳
}
```

### 2.4 quizHistory Schema（已有，保持兼容 + 迁移）

v1 使用 key `syllabus_v4_qh` 存储答题历史。阶段 A 在 app.js 初始化时执行一次性迁移：读取旧 key → 有数据则写入新 key `quizHistory` → 保留旧 key 不清除（零风险后备）。之后所有代码只读写 `quizHistory`。现有结构：timestamp、subject、questions、answers、score 等字段不变。

### 2.5 Tab 注册接口

app.js 中的 Tab 通过一个数组管理。所有新增 Tab（学习路线、实践备考、统计）都必须通过同一个注册机制加入，不得硬编码：

```js
// 阶段 A 需要在 app.js 中修改 tabs 数组：
// 当前: ['study', 'quiz', 'favs', 'history']
// 目标: ['study', 'studyPlan', 'quiz', 'wrongBook', 'stats', 'favs', 'practical']
```

每个 Tab 对应一个 `switchTab(tabName)` 分支和一个 `render<CapitalizedName>()` 渲染函数。阶段 A 负责注册学习路线、练习、错题本、统计、收藏七个 Tab；**模块四的实践备考 Tab 由阶段 B 在外层文件注册；模块五无新增 Tab。**

为避免冲突：窗口 A 在写 app.js 时预留给实践备考一个 Tab 占位符和渲染钩子（一个空的 `renderPractical()` 函数）。窗口 B 的 `practical-exam.js` 加载后覆盖这个函数。

### 2.6 代码风格规范

- **app.js**：混用引号，修改时保持上下文一致，不得全局替换引号风格
- **subject JS 文件**：同 handover 第四节
- **新增 JSON 文件**：标准双引号 JSON，UTF-8 编码无 BOM
- **新增 JS 文件（practical-exam.js、sw.js）**：双引号为主，字符串用双引号
- **CSS**：响应式 media query 以 768px 为断点

## 三、模块间接口

### 模块一 → 模块二
- 模块一的「阶段测试」可以调用模块二的出题函数，参数指定科目和单元范围
- 接口：`window.startQuizByUnits(subjectIds, unitNames)` — 窗口 A 在实现模块二时暴露此函数

### 模块二 → 模块三
- 模块二的练习评分函数在写入 perf 表后，可选地触发模块三的缓存刷新
- 接口：`window.refreshWrongBookCache()` — 窗口 A 在实现模块三后自行调用

### 模块四 → 无
- 模块四完全独立，不调用任何 app.js 函数。它有自己的 JSON 数据源和渲染逻辑

### 模块五 → 全部
- Service Worker 缓存策略：对所有 `/subjects/` 下的 .js/.json 文件和根目录的 .js/.html 文件做 Cache-First
- 无接口依赖，独立改造

### 模块六 → 模块二
- 题库扩充仅增加 QN 数组内容，不改变题目数据结构（q/opts/ans/id/subject 字段不变）
- 新增题目必须包含 `pointId` 字段（关联知识点 ID），这是模块二 perf 表的基础

## 四、文件修改归属表

| 文件 | 负责阶段 | 备注 |
|------|:--------:|------|
| `app.js` | **A**（独占） | 顺序开发，阶段 A 有唯一写权限 |
| `study-plan.json`（subjects/） | **A** | 新增 |
| `index.html` | **C**（独占） | 阶段 A 需在 C 完工后检查 Tab 栏是否对齐 |
| `sw.js` | **C** | 新增 |
| `manifest.json` | **C** | 新增 |
| `practical-exam.js` | **B** | 新增 |
| `practical-exam.json`（subjects/） | **B** | 新增 |
| `s1~s9-*.js`（subjects/） | **D**（独占） | 每次改一个文件，走三连验证 |

## 五、执行顺序

全部阶段按 A → B → C → D 顺序执行，每阶段完成后确认无问题再开启下一阶段。

| 阶段 | 模块 | 改动文件 | 完成后检查 |
|:---|:---|:---|:---|
| A | 一·学习路径导航 | app.js + subjects/study-plan.json | Tab 可切换、路线可见、跳转正常 |
| | 二·自适应练习 | app.js | 答题后 perf 写入 localStorage、智能复习可用 |
| | 三·错题本+仪表盘 | app.js | 错题本显示正确、统计图表渲染正常 |
| B | 四·实践备考 | practical-exam.js + practical-exam.json | 目录+详情渲染正常、掌握标记可保存 |
| C | 五·PWA+移动适配 | index.html + sw.js + manifest.json | 手机可用、离线可用、可安装 |
| D | 六·题库扩充 | 各 subject 文件 | 每批语法验证通过 |

**关键约束**：app.js 由阶段 A 独占修改，index.html 由阶段 C 独占修改。阶段 A 完工后，阶段 C 需读取 A 的成果来对齐 index.html 中的 Tab 栏和容器 ID。

## 六、阶段间传递约定

A → C 传递清单：
- A 完工后，C 开工前需读取 app.js 确认 Tab 名称数组，将 `wrongBook`、`stats` 等 Tab 的 onclick 和容器 ID 写入 index.html
- A 完工后，C 需在 index.html 中加入 `practical-exam.js` 的 script 引用，以及 `#practical-tab` 容器
- A 完工后，C 需加入 study-plan.json 数据加载逻辑（或由 A 在 app.js 中 fetch，C 无需额外处理）

B → C 传递清单：
- B 完工后，C 确认 `practical-exam.js` 文件名和入口函数签名一致

## 七、验证标准（所有阶段）

每完成一个文件写入后，执行：

```bash
# JS 语法检查
node --check "文件路径.js"

# subject JS 文件的逗号检查
python3 -c "import re; c=open('文件路径').read(); missing=len(re.findall(r'\]\}\s*\{unit', c)); print(f'发现 {missing} 个可能缺逗号的位置') if missing else print('OK')"
```

对于 app.js 等关键文件，额外检查 `node --check` 通过后，在浏览器中打开 index.html 做手动冒烟测试：能否切换学习/练习/新 Tab、能否出题答题、能否暂存恢复。
