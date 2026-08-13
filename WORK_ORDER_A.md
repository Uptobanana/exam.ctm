# 工作令 A — 模块一/二/三（学习路径 + 自适应练习 + 错题本与仪表盘）

> 本文件配合 `DESIGN_MASTER.md` 使用。开工前先读 DESIGN_MASTER.md，再读本文件，再读 PROJECT_HANDOVER.md。

---

## 总览

阶段 A 负责 app.js 的全部改动，按模块一→模块二→模块三顺序执行。

**改动文件**：仅 `app.js`（当前约 29KB）+ 新增 `subjects/study-plan.json`（约 5-10KB）。

## 前置约束

- app.js 独占写权限：任何其他窗口不得在窗口 A 完工前修改 app.js
- 文件截断风险：app.js 约 29KB，大幅修改建议用 Python heredoc 方式写入
- 每完成一个模块后执行三连验证（语法检查 + 逗号检查 + 浏览器冒烟测试）

---

## 模块一：学习路径导航

### 目标
新增「学习路线」Tab，展示三阶段递进学习路径，标注单元权重、进度、跳转入口。

### 新增文件：`subjects/study-plan.json`

```json
{
  "stages": [
    {
      "id": "stage1",
      "name": "基础阶段",
      "description": "先立根基——理论体系和辨证方法是一切临床科目的思维基础",
      "subjects": ["s1-zhongji", "s2-zhongzhen"],
      "threshold": "stage1 全部单元 cardQuiz 完成率 ≥ 70%"
    },
    {
      "id": "stage2",
      "name": "临床基础",
      "description": "掌握武器——中药是弹药库，方剂是战术组合，两科同步推进，相互印证",
      "subjects": ["s3-zhongyao", "s4-fangji"],
      "threshold": "stage1+stage2 全部单元 cardQuiz 完成率 ≥ 60%"
    },
    {
      "id": "stage3",
      "name": "临床应用",
      "description": "投入战场——内科是核心临床科目，妇/外/儿分科扩宽，针灸独立成体系",
      "subjects": ["s5-neike", "s6-waike", "s7-fuke", "s8-erke", "s9-zhenjiu"],
      "threshold": "全科通过 mock 考试 ≥ 60%"
    }
  ],
  "subjectWeights": {
    "s1-zhongji": "高频",
    "s2-zhongzhen": "高频",
    "s3-zhongyao": "高频",
    "s4-fangji": "高频",
    "s5-neike": "高频",
    "s6-waike": "中频",
    "s7-fuke": "中频",
    "s8-erke": "中频",
    "s9-zhenjiu": "中频"
  }
}
```

### app.js 改动

**a) Tab 系统扩展**

修改 tabs 数组，从 `['study', 'quiz', 'favs', 'history']` 扩展为：
```
['study', 'studyPlan', 'quiz', 'wrongBook', 'stats', 'favs', 'practical']
```
`stats` 是模块三的统计 Tab（内含历史答题记录详情），`favs` 保留原收藏功能，`practical` 是为阶段 B 预留的占位符。`history` 不再作为独立 Tab，其功能并入统计 Tab。

在 `switchTab()` 中增加对应的 case 分支。

**b) 新增 `renderStudyPlan()` 函数**

核心渲染逻辑：
1. 在 app.js 中用 fetch 异步加载 `subjects/study-plan.json`（阶段 C 的 Service Worker 会自动缓存此文件，离线可用）
2. 渲染三阶段卡片布局：每个阶段显示名称、描述、包含的科目、解锁状态
3. 每个科目下展开单元列表，每个单元显示：名称、权重标签、已完成 cardQuiz / 总知识点数、进度条
4. 已解锁的阶段可展开查看单元详情；未解锁的阶段灰显
5. 点击任一个单元跳转到对应知识卡片页（调用 `switchTab('study')` 并定位到对应科目/单元）
6. 阶段解锁判断：读取 `localStorage` 中 `studyProgress.cardQuizDone`，计算该阶段的完成率，达到阈值自动解锁

**c) 进度追踪改造**

在现有的「知识点已读」逻辑中（如果还没有，需要在知识卡片展开事件中添加），向 `studyProgress.readPoints` 追加当前知识点 ID。cardQuiz 完成后向 `studyProgress.cardQuizDone` 追加。

**d) index.html 变更（记录于此，由窗口 C 执行）**

- 新增 `<script src="subjects/study-plan.json?type=application/json" id="study-plan-data"></script>`（或通过 fetch）
- 更好的方式：在 index.html 中用内联 script 加载 JSON 文件并赋值 `window.STUDY_PLAN`

### 达成标准
- 打开「学习路线」Tab，看到三阶段递进结构
- 每个单元的权重、进度一目了然
- 点击单元跳转到对应知识卡片页
- 未学够的阶段显示为锁定状态

---

## 模块二：自适应练习系统

### 目标
把「随机出题」改为「加权智能出题」，新增 perf 数据结构、智能复习按钮。

### app.js 改动

**a) quizHistory key 迁移（首页初始化时执行一次）**

```js
// 一次性迁移：syllabus_v4_qh → quizHistory
(function() {
  var old = localStorage.getItem('syllabus_v4_qh');
  if (old && !localStorage.getItem('quizHistory')) {
    localStorage.setItem('quizHistory', old);
  }
  // 旧 key 保留不清除，零风险后备
})();
```

之后所有代码只读写 `quizHistory`。`_submitQuiz()` 追加记录时用新 key。

**b) perf 数据管理**

新增函数（DESIGN_MASTER.md 2.2 节定义了完整 schema）：

```js
// 读取
function getPerf() { return JSON.parse(localStorage.getItem('perf') || '{}'); }
// 保存单条
function savePerf(pointId, correct) {
  var p = getPerf();
  if (!p[pointId]) p[pointId] = { total: 0, correct: 0 };
  p[pointId].total++;
  if (correct) p[pointId].correct++;
  p[pointId].lastCorrect = correct;
  p[pointId].lastSeen = Date.now();
  localStorage.setItem('perf', JSON.stringify(p));
}
// 获取知识点正确率
function getAccuracy(pointId) {
  var p = getPerf();
  return p[pointId] ? p[pointId].correct / p[pointId].total : null;
}
```

**b) 题目关联知识点**

题目数据结构中必须新增 `pointId` 字段（现有题目可能没有，需要兼容处理——没有 pointId 的题目归入「探索池」）。在提交答案时，从题目对象的 pointId 调用 savePerf。

**关键提醒**：模块六（窗口 D）扩充题库时，每道新题必须包含 pointId 字段。格式示例如：
```json
{"q":"...","opts":["A","B","C","D"],"ans":0,"pointId":"zy-5-3","id":"q-zy-001"}
```

**c) 加权出题逻辑**

改造现有的出题函数（`generateQuiz` 或类似名称），替代原「随机 shuffle + slice」逻辑：

```
输入：科目 ID 列表（可跨科）
步骤：
  1. 获取候选题目池（从对应科目的 QN 数组）
  2. 读取 perf 表
  3. 按正确率将题目分入三池：
     - 复习池：correctRate < 0.5 或错过的题
     - 巩固池：0.5 ≤ correctRate < 0.8
     - 探索池：无 perf 记录或 correctRate ≥ 0.8
  4. 按 60% 复习 / 30% 巩固 / 10% 探索 比例抽取（总量 50~80 题）
  5. 各池内随机 shuffle
  6. 如某池不足配额，余量分配给下一优先级池
```

**d) 智能复习按钮**

在练习选科界面新增「全局智能复习」按钮：
- 不手动选科
- 汇总所有科目中正确率最低的 80 个知识点的题目
- 按加权出题逻辑自动组卷
- 窗口标题显示「智能复习卷」

**e) UI 标签**

每道练习题渲染时，在题目卡片顶部加一个小标签：
- perf 中该题正确率 < 0.5：显示「🔄 重点复习」
- perf 中该题正确率 ≥ 0.8 且做过 ≥ 3 次：显示「✅ 掌握」
- 无 perf 记录：显示「⭐ 新题」

### 达成标准
- 做完 30~50 道题后 perf 表建立
- 再次出题时错题明显重复出现
- 智能复习按钮可跨科目自动组卷
- 题目卡片上显示复习/新题/掌握标签

---

## 模块三：错题本 + 掌握度仪表盘

### 目标
新增「错题本」和「统计」两个 Tab，基于模块二的 perf 数据做可视化呈现。

### app.js 改动

**a) 错题本（wrongBook Tab）**

新增 `renderWrongBook()` 函数：

1. 读取 perf 表，筛选 `correct/total < 0.5` 的知识点
2. 按科目分组展示错题列表（perf 中的 pointId → 反查题目原文和选项）
3. 每个错题卡片显示：题目原文、答对/答错次数、所属知识点名、最近作答时间
4. 顶部增加科目筛选下拉框（中基/中诊/中药/.../全部）
5. 「错题重做」按钮：勾选错题 → 点击重做 → 调用模块二的加权出题逻辑（复习池优先模式）
6. 「导出」按钮：生成 Markdown/纯文本格式的错题清单，用 Blob + download 实现离线导出

**b) 统计仪表盘（stats Tab）**

新增 `renderStats()` 函数：

1. **科目概览图**（手写 HTML/CSS 横向条形图）：
   - 每个科目一行 bar，高度代表覆盖率（已读知识点 / 总知识点）
   - 颜色编码：绿 >80%、黄 60-80%、红 <60%（正确率，从 perf 计算）
   - 右侧显示数值

2. **正确率趋势图**（手写简易折线图）：
   - 读取 quizHistory，每一条记录是一个练习会话
   - X 轴：时间（日期标签）
   - Y 轴：该次练习的正确率（该次所有答题的正确数 / 总题数）
   - 用 SVG 或纯 HTML div 实现简单折线（10~15 个点即可，不需要完整图表库）
   - 如果 quizHistory 为空，显示「完成一次练习后这里会出现趋势图」

3. **薄弱板块高亮**：
   - 列出正确率最低的 3 个单元（从 perf 汇总到 unit 级别）
   - 每个旁边放一个「专门复习」按钮 → 跳转到智能复习模式

4. **历史答题记录**：
   - 趋势图下方提供「查看详细答题记录」折叠面板
   - 展开后显示 quizHistory 中的单条答题记录列表（日期、科目、题数、正确率）
   - 替代 v1 独立的 history Tab

**c) 数据汇总辅助函数**

新增 `perfBySubject()` 和 `perfByUnit()` 函数：遍历 perf 表，按 subject ID 前缀汇总正确率。

### 达成标准
- 「错题本」Tab 正确显示错题，可按科目筛选
- 错题重做后错题本自动更新（已掌握的题消失）
- 导出功能可生成可读的错题文本
- 「统计」Tab 显示科目掌握度条形图和正确率趋势
- 薄弱板块高亮并可直接跳转复习

---

## 验证清单（模块一~三全部完成后）

- [ ] `node --check app.js` 通过
- [ ] `node --check subjects/study-plan.json` 通过
- [ ] 浏览器打开 index.html：七个 Tab（学习/学习路线/练习/错题本/统计/收藏/实践备考）可切换
- [ ] 学习路线：三阶段可见，进度条显示，点击跳转正常
- [ ] 练习：答题后 perf 写入 localStorage，刷新后取到
- [ ] 智能复习：可跨科出题，显示复习/新题标签
- [ ] 错题本：错题列表显示正确，重做功能正常
- [ ] 统计：条形图和趋势图渲染正常
- [ ] 练习暂存功能不受影响
