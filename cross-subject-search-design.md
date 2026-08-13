# 跨科联动检索 · 施工设计

**日期**：2026-08-07
**目标**：为出师考核学习工具实现跨科联动检索，含 A（侧栏搜索）、B（卡片内可点击跨科链接）、C（知识图谱，A+B 后做）。本设计覆盖 A+B 详细方案 + C 前向兼容 + broken zy 标记修复。

---

## 一、背景与现状

### 1.1 项目现状
- 离线学习 SPA，入口 `D:\Work\syllabus\index.html`，核心引擎 `app.js`（1474行），9 科数据 `subjects/s1~s9.js`
- 664 个知识点（s1=142/s2=96/s3=88/s4=44/s5=62/s6=83/s7=54/s8=54/s9=41）
- 现有功能：知识树浏览、卡片学习、练习题、智能出题、错题本、收藏、统计、学习计划、实操模拟
- UI：`<header>`（☰菜单+标题）+ `<aside id="sidebar">`（知识树 `#tree`）+ `<main id="mainContent">`（卡片渲染）

### 1.2 跨科标记现状（已就绪的数据基础）
全项目跨科标记共 3275 处，**仅 `[fj-]`（2983）和 `[zy-]`（292）两种**，无其他前缀：
- `[fj-X-Y]`：s2/s3/s5/s6/s7/s8 引用 s4 方剂学，2983 处，**全部有效**（0 broken）
- `[zy-X-Y]`：s4 引用 s3 中药学，292 处，**103 个唯一 target 无效**（见第七节）
- 标记即目标知识点 ID 加方括号，如 `[fj-2-1]` = 跳转到 s4 的 fj-2-1 点

### 1.3 关键代码事实
- `findPoint(id)`（app.js:148）：遍历全部科目，返回 `{point, subject}`，**已支持跨科定位**
- `getPointPath(id)`（app.js:164）：返回 "科目·单元·子单元" 位置面包屑
- `showCard(id)`（app.js:351）：`mainContent.innerHTML` 渲染卡片，`p.content` **原样插入** `<div class="content">`（B 挂钩点）
- `renderTree()`（app.js:256）/ `bindTreeEvents()`（291）：侧栏树构建与交互
- `window._SUBJECTS`：全局科目数组（registerSubject 注册）

---

## 二、模块结构

新增独立模块 **`xlink.js`**（index.html 中 app.js 之后加载），承载全部跨科检索逻辑。app.js 仅加 **3 处最小挂钩**：

1. `showCard(id)` 渲染 content 前调 `XLink.processContent(p.content, p.id)` 把标记变链接
2. `showCard(id)` 末尾调 `XLink.onShowCard(p.id)` 维护导航历史
3. `DOMContentLoaded` 末尾调 `XLink.init()` 构建索引、绑定搜索框

**理由**：app.js 已 1474 行，再加 ~500 行过大；项目已有 `mini-quiz-patch.js` 补丁模块先例，xlink.js 同模式，职责单一可独立测试。xlink.js 暴露 `window.XLink = { init, processContent, onShowCard, searchPoints, getNeighbors, getSubgraph }`，app.js 不依赖其内部实现。

**C 阶段**再加 `xgraph.js`（xlink.js 之后加载），仅消费 XLink API，不直接碰 _SUBJECTS，可独立移除。

---

## 三、共享基础设施（A/B/C 共用）

页面加载时（subjects 注册完后）一次性构建，开销 <100ms：

### 3.1 XLINK_NAMES + NAMES_BY_ID（B 用）
- 从 s4 解析方剂名（跳过 fj-1-*，name 按"、"和"的"分割，同跨科补齐工程批次2方法）-> 128 方剂名
- 从 s3 解析中药名 -> ~88 中药名
- `XLINK_NAMES["麻黄汤"]="fj-2-1"`；`NAMES_BY_ID["fj-2-1"]=["麻黄汤","桂枝汤","小青龙汤"]`

### 3.2 MARKER_INDEX（A/C 用，天然有向图）
- 扫描全部 664 点 content 的 `[fj-X-Y]`/`[zy-X-Y]` 标记
- `OUTBOUND[sourceId] = [{targetId, label}]`（本点链接了谁）
- `INBOUND[targetId] = [sourceId]`（谁链接了本点）
- **仅收录有效边**（`findPoint(targetId)` 非空），broken 标记过滤
- ⚠️ **标记正则必须用 `[(zji|dx|zy|fj|nk|wk|fk|ek|zj)-[a-z0-9-]+]`，含字母段 `[a-z0-9-]+`**--s3 ID 有 a/b/c/d/e/f/g 字母变体（如 `zy-22c-2`、`zy-15b-1`），用 `[\d-]+` 会漏匹配（批次0验证时曾因此误判）

### 3.3 SEARCH_INDEX（A 用）
- `id -> {name, content, subject}` 简化索引，供关键词检索

### 3.4 图谱查询 API（C 用，接口先定）
- `XLink.getNeighbors(id)` -> `{inbound:[...], outbound:[...]}`
- `XLink.getSubgraph(centerId, depth, cap)` -> `{nodes:[...], edges:[...]}`（带深度和节点数上限）

---

## 四、A：侧栏搜索

### 4.1 UI
侧栏顶部（"大纲导航"标题上方）加 `<input id="searchBox" placeholder="搜索知识点/方剂/中药...">`。输入时 `#tree` 区域切换为 `#searchResults`；清空或 Esc 恢复树。

### 4.2 搜索逻辑（`searchPoints(keyword)`）
- 遍历 `_SUBJECTS` 全部 664 点，匹配 `name`（优先）+ `content`，子串匹配不区分大小写
- 结果按科目分组（9 科），每组显示命中数
- 每条结果：知识点名 + `getPointPath` 面包屑 + 命中片段（关键词前后 30 字，高亮）
- 点击结果 -> `showCard(id)`，侧栏恢复树并展开定位到该点

### 4.3 跨科关联增强（用 MARKER_INDEX）
若关键词命中 XLINK_NAMES 中某方剂/中药名，结果顶部额外显示"跨科引用"区--列出所有 content 含该 `[ID]` 标记的点（INBOUND）。例：搜"麻黄汤"-> 直接命中 s4 fj-2-1 + 跨科引用 s2/s5/s6/s7/s8 中提及麻黄汤的点。

### 4.4 新增函数
`buildSearchIndex()`、`searchPoints(kw)`、`renderSearchResults(kw)`、`bindSearchInput()`

---

## 五、B：卡片内可点击链接 + 导航历史

### 5.1 链接渲染（`processContent(html, currentId)`）
在 showCard innerHTML 前调用，对 content HTML 做标记->链接替换：
- 正则找 `[fj-X-Y]`/`[zy-X-Y]` 标记
- **target 验证**：`findPoint(targetId)` 非空才渲染为链接；为空（broken）保留纯文本不生成死链
- 对有效标记，查 `NAMES_BY_ID[ID]`，在标记**前方文本**找最长匹配名称
  - 命中：`麻黄汤[fj-2-1]` -> `<a class="xlink" data-xid="fj-2-1">麻黄汤</a>`（方剂名作链接文本，标记被消费）
  - 未命中名称：`[fj-2-1]` -> `<a class="xlink" data-xid="fj-2-1">[fj-2-1]</a>`（标记本身作链接，兜底）
- CSS：`.xlink` 主题色+下划线+hover 手型
- 仅替换标记及前方名称，不动其他 HTML

### 5.2 点击跳转（事件委托）
mainContent 上委托 `.xlink` click -> 读 `data-xid` -> 推当前 id 入历史 -> `showCard(targetId)` -> 自动展开树到目标科目/单元。跳转后目标卡片 content 同样经 processContent 处理（可继续点，顺藤摸瓜）。

### 5.3 导航历史 + 面包屑 + 返回（`navHistory` 栈）
- `onShowCard(id)`：若 id 与栈顶不同则入栈（树点击和链接跳转都入栈，统一管理）
- mainContent 顶部加面包屑条：`中诊·风寒表证 › 方剂·麻黄汤`（当前为末项），仅 history.length>1 时显示
- "← 返回"按钮：出栈回到上一知识点
- 点面包屑某级：跳到该点并截断后续历史
- 与现有 `breadcrumb`（知识点自身位置）并存--现有是"位置"，新增是"来路"

### 5.4 新增函数
`processContent()`、`bindXLinkClicks()`、`pushNavHistory()`/`popNavHistory()`/`renderBreadcrumb()`

---

## 六、C 前向兼容（A+B 后做，接口先定）

### 6.1 图谱数据模型
MARKER_INDEX 即天然有向图：节点=知识点（id,name,subject,type），边=标记引用（source->target，label=方剂/中药名），仅有效边。

### 6.2 C 模块
独立 `xgraph.js`（window.XGraph），`renderGraph(centerId, container)` 消费 `XLink.getSubgraph`，SVG 或 vis-network 渲染。点击图节点 -> `showCard(id)` + navHistory（复用 B 跳转）。

### 6.3 可视化方案
- **C v1 简化版：纯 SVG 自绘**（无依赖，离线一致）。中心节点 + 一跳邻居（cap≤30，按入度排序），简单辐射/力导向布局。覆盖 80% 场景。
- **C v2 增强版：vis-network（本地 `vis-network.min.js`，不用 CDN 保离线）**。支持大图、缩放平移、物理引擎。v1 SVG 在大 hub 不够用时升级。
- **规模**：3275 标记 / 183 唯一 target，最大入度 fj-8-3=373（需 cap）。C 必须支持节点数上限 + 按权重排序。

---

## 七、数据质量：broken zy 标记修复

### 7.1 现象
s3 有 88 点，ID 多为 `zy-X-Y`，含 `a/b` 子单元变体（如 `zy-5b-1`、`zy-22a-3`）。s4 的 292 处 `[zy-X-Y]` 标记引用 142 个唯一 target，**103 个在 s3 不存在**（如 `zy-5-7`、`zy-6-15`）。`[fj-]` 标记 0 broken。

### 7.2 影响
- B：不验证则点击 zy 标记跳到"未找到该知识点"。**B 的 processContent 含 target 验证**，broken 降级为纯文本，安全。
- A/C：MARKER_INDEX 只收录有效边，broken 自动过滤。
- 但 broken 标记意味着 s4 的 zy 链接长期失效，需修复才能让 B 的中药链接真正可用。

### 7.3 修复方案（独立批次）
- 从 s3 构建中药名->zy-ID 映射（s3 的 name 字段）
- 遍历 s4 content 中每个 broken `[zy-X-Y]` 标记，找其前方中药名，查映射得正确 zy-ID，替换标记
- 无名称匹配的 broken 标记：人工核查或移除
- 修复后 s4 备份，`node --check` 验证

---

## 八、影响范围与风险

- **改动文件**：app.js（3 处挂钩 ~10 行）、index.html（搜索框 HTML + xlink.js 引用 + CSS）、新增 xlink.js
- **不改动**：9 个科目数据文件（只读 content）、findPoint/getPointPath/renderTree 核心逻辑
- **风险低**：processContent 只做标记->链接替换不改原文字；索引构建 try-catch 兜底（失败则标记保持字面文本）；导航历史纯增量
- **验证**：前端 JS 用浏览器实打开开 index.html 验证搜索/跳转/返回；每步改后浏览器审查

---

## 九、分批次执行计划

### 批次总览

| 批次 | 任务 | 文件 | 依赖 | 说明 |
|------|------|------|------|------|
| **0** | 修复 s4 broken zy 标记 | s4-fangji.js | 无 | ✅已完成 | 数据清理，让 B 的中药链接可用 |
| **1** | xlink.js 索引层 + init 挂钩 | xlink.js, app.js, index.html | 无 | ✅已完成 | 构建三索引+图谱API，app.js 加 init 挂钩 |
| **2** | A 侧栏搜索 | xlink.js, index.html, app.js | 1 | ✅已完成 | 搜索框+searchPoints+结果分组+跨科关联区 |
| **3** | B 链接渲染 | xlink.js, app.js, index.html | 0,1 | ✅已完成 | processContent含target验证+CSS+showCard挂钩 |
| **4** | B 导航历史 | xlink.js, app.js, index.html | 3 | ✅已完成 | navHistory+面包屑+返回+点击委托+树定位 |
| **5** | 浏览器集成测试 | - | 0-4 | A/B 全流程实测 |

### 依赖关系
```
批次0(zy修复) ──┐
批次1(索引层) ──┼──> 批次3(B链接) ──> 批次4(B导航) ──┐
         └────> 批次2(A搜索) ────────────────────────┼──> 批次5(集成测试)
```
批次 0/1 相互独立可并行；批次2依赖1；批次3依赖0+1；批次4依赖3；批次5依赖全部。

### 各批次详情

**批次0：修复 s4 broken zy 标记** ✅已完成（2026-08-07）
- 探查 s3 实际 ID 结构（unit、a/b/c/d字母变体）
- 从 s3 name 字段构建中药名->zy-ID 映射（主列药点优先：性能功效应用>功效主治>用法/使用注意）
- 遍历 s4 broken `[zy-X-Y]`，找前方中药名->查正确 ID->重映射；无法解析的移除标记但保留药名
- **结果**：s4 zy标记 292处（108有效+184broken）-> 249处（249有效+0broken）。141处重映射到正确s3 ID（如 桂枝->zy-10-1、川芎->zy-22c-2、柴胡->zy-11-1），43处无法解析（如桃仁/泽泻出现在多个s3 content无法定位主点）移除标记保留药名。`node --check`通过，其他文件未波及。备份 outputs/s4-fangji.js.bak-20260807-zyfix
- **关键教训**：s3 ID 含字母变体（a/b/c/d/e/f/g），匹配正则须用 `[a-z0-9-]+` 不能用 `[\d-]+`（已并入3.2节）

**批次1：xlink.js 索引层 + init 挂钩** ✅已完成（2026-08-07）
- 新建 xlink.js，实现 `XLink.init()` 构建三索引（XLINK_NAMES/NAMES_BY_ID 128方剂名、MARKER_INDEX 含 target 验证 1368有效边0broken、SEARCH_INDEX 663知识点）+ 图谱 API（getNeighbors/getSubgraph）
- app.js DOMContentLoaded 的 setTimeout 内加 `XLink.init()`；index.html 加 `<script src="xlink.js">`（app.js 后）
- 标记正则用 `[(zji|dx|zy|fj|nk|wk|fk|ek|zj)-[a-z0-9-]+]`（兼容 s3 字母变体 ID）
- 验证：node --check 通过；node harness 加载9科目+xlink 调 init，索引计数正确（663点/128方剂名/1368边/0broken），findPoint/getNeighbors/getSubgraph/字母变体正则全过
- **教训**：Edit 工具也截断大JS（app.js 66KB 被截断末尾，丢失 IIFE 关闭+renderPractical 结尾），已用 Python 重构修复（renderPractical 占位符+委托 practical-exam.js init）。后续 app.js 改动一律用 Python
- 风险：低（已化解 Edit 截断风险）

**批次2：A 侧栏搜索** ✅已完成（2026-08-07）
- index.html 侧栏顶部加 `<input id="searchBox">` + `<div id="searchResults">` + CSS（Python改25KB）
- xlink.js 实现 `searchPoints`（663点 name+content 全文检索，去标签/去标记后匹配，按科目分组，含path与片段）/ `renderSearchResults`（`<mark>`高亮+跨科关联标签：kw命中方剂名显示其INBOUND引用数）/ `bindSearchInput`（input切换#tree/#searchResults，Esc清空）
- 结果/关联标签点击调 `window.showCard(id)` 跳转+恢复树；app.js 暴露 `window.showCard=showCard`（Python改66KB）
- 验证：node harness 搜"麻黄"76结果8科、"桂枝汤"22结果+跨科关联(桂枝汤fj-2-1引用31)、"归脾汤"61结果7科带片段、空/不存在返回0。renderSearchResults/bindSearchInput 依赖DOM，留批次5浏览器实测
- **教训**：Write工具连~6-10KB的xlink.js也截断（6200字节处），改用bash heredoc写入完整。所有JS写入一律用heredoc/Python
- 风险：低

**批次3：B 链接渲染** ✅已完成（2026-08-07）
- xlink.js 实现 `processContent(html, id)`：正则 `([一-龥]*)\[(前缀-[a-z0-9-]+)\]` 捕获标记前置中文名+标记；fj 用 `NAMES_BY_ID[ID]` 找 preCh 结尾匹配的最长方剂名；zy 用 preCh（`|`/`<strong>` 分隔保证）；**target 验证**（`POINT_MAP[inner]` 为空则保留纯文本）；兜底：preCh 以剂型字结尾则用作链接（简称如麻杏甘石汤），否则 `[marker]` 作链接
- `bindXLinkClicks` 事件委托 mainContent 的 `.xlink` click -> `window.showCard(xid)`，init 中调用
- app.js showCard 的 content 经 `XLink.processContent` 处理（Python改66KB）；index.html 加 `.xlink` CSS（Python改25KB）
- 验证：node harness 3232标记->3232可点击链接、0 broken、2977名称链接+255兜底链接；单元测试全过（fj方剂名/zy中药名/broken降级/HTML混合/简称）。click委托依赖DOM，留批次5浏览器实测
- 风险：中（名称匹配边界情况--已用剂型字启发式覆盖简称）

**批次4：B 导航历史** ✅已完成（2026-08-07）
- xlink.js 实现 `navHistory` 栈、`onShowCard(id)`（push 去重+cap 12）、`renderBreadcrumb`（mainContent 顶部 insertAdjacentHTML 插入面包屑条：←返回按钮 + 最近6个crumbs+…省略号，仅 history.length>1 显示）、`_goBack`（pop+showCard）、`_jumpTo(idx)`（in-place 截断 `navHistory.length=idx+1`+showCard）
- crumb/返回点击调 `window.showCard`；onShowCard 检测末项==id 不重复入栈
- app.js showCard 末尾加 `XLink.onShowCard(id)`（Python改66KB）；index.html 加 `.nav-breadcrumb/.nav-back/.nav-crumb` CSS（Python改）
- **含跳转树定位**：showCard 调 `highlightTreePoint(id)` 展开 subject/unit/subunit 祖先链 + `scrollIntoView({block:'nearest'})`
- 验证：node harness 导航序列入栈、去重、goBack、jumpTo 截断、面包屑HTML生成、单点无面包屑全过。click/scrollIntoView 依赖DOM，留批次5浏览器实测
- 风险：低（_jumpTo 用 in-place 截断，不能用 slice 重赋值会断 `_navHistory` 引用）

**批次5：浏览器集成测试**
- 打开 index.html，全流程实测：搜索->点击结果->卡片内链接跳转->面包屑返回->跨科多跳
- 验证现有功能（树浏览/练习题/收藏/统计）不受影响
- 9 科抽样检查链接渲染
- 风险：低

---

## 十、验收标准

1. **A 搜索**：侧栏搜索框输入关键词，664 点全文检索，结果按科分组，跨科关联区正确，点击直达
2. **B 链接**：s2/s3/s4/s5/s6/s7/s8 卡片中 `[fj-]`/`[zy-]` 标记渲染为可点链接（方剂名/中药名作链接文本），点击跨科跳转，broken 标记降级纯文本
3. **B 导航**：跨科跳转后面包屑显示来路，返回按钮正确回退，多级面包屑可跳
4. **数据**：s4 broken zy 标记修复（broken 数 0）
5. **C 兼容**：XLink.getNeighbors/getSubgraph 接口就绪，C 阶段可直接消费
6. **现有功能不受影响**：知识树/练习题/收藏/统计等正常
7. **离线可用**：无 CDN 依赖（xlink.js 本地，C v2 用本地 vis-network）
