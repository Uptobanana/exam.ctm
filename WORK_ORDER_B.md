# 工作令 B — 模块四（实践考试备考模块）

> 本文件配合 `DESIGN_MASTER.md` 使用。开工前先读 DESIGN_MASTER.md，再读本文件，再读 PROJECT_HANDOVER.md。
>
> **依赖**：阶段 A 已完成（app.js 中已注册 `practical` Tab 占位符和空的 `renderPractical()` 函数）。

---

## 总览

阶段 B 负责实践考试备考模块，完全独立开发，不碰 app.js。所有代码在新增文件中完成。

**新增文件**：
- `subjects/practical-exam.json` — 实践考试结构化数据（目标 8-15KB）
- `practical-exam.js` — 渲染引擎（目标 8-12KB）

**涉及修改的现有文件**：无。阶段 C 会在 index.html 中为实践备考引入 script 引用和 DOM 容器。

## 前置约束

- 不得修改 app.js（由阶段 A 完工冻结）
- 不得修改 index.html（由阶段 C 独占）
- `practical-exam.js` 中渲染目标容器 ID 约定为 `#practical-tab`，阶段 C 创建
- 数据源为 `subjects/practical-exam.json`，在 `practical-exam.js` 中用 fetch 读取；同时提供回退方案：`window.PRACTICAL_DATA` 可由阶段 C 在 index.html 中内联注入

---

## 数据设计：`subjects/practical-exam.json`

```json
{
  "categories": [
    {
      "id": "acupuncture-op",
      "name": "针灸操作",
      "type": "operation",
      "weight": "必考",
      "items": [
        {
          "id": "acup-op-001",
          "name": "足三里穴定位与进针",
          "description": "准确定位足三里穴并完成毫针进针操作",
          "steps": [
            "取穴：犊鼻穴下3寸，胫骨前嵴外一横指",
            "消毒：穴位局部皮肤和医者手指",
            "进针：直刺1-1.5寸，得气感为局部酸麻胀"
          ],
          "scoring": [
            {"criterion": "定位准确", "maxScore": 3},
            {"criterion": "消毒规范", "maxScore": 2},
            {"criterion": "进针手法正确", "maxScore": 2},
            {"criterion": "得气判断准确", "maxScore": 3}
          ],
          "pitfalls": [
            "定位偏移：混淆犊鼻下3寸的具体位置，可用手指同身寸法辅助",
            "进针角度偏差：直刺变斜刺，需注意针体与皮肤的角度"
          ],
          "media": null
        }
      ]
    },
    {
      "id": "defense",
      "name": "现场答辩",
      "type": "oral",
      "weight": "必考",
      "items": [
        {
          "id": "def-001",
          "name": "胃痛辨证论治",
          "question": "患者胃脘胀痛，嗳气频作，每因情志不遂而加重，舌苔薄白，脉弦。请进行辨证论治。",
          "answerFramework": [
            "辨证：肝气犯胃证",
            "病机：肝郁气滞，横逆犯胃，胃失和降",
            "治法：疏肝理气，和胃止痛",
            "代表方：柴胡疏肝散加减",
            "方解：柴胡疏肝解郁，香附理气止痛；枳壳、陈皮理气和胃；芍药、甘草缓急止痛；川芎行气活血"
          ],
          "relatedKnowledge": ["中诊：四诊/问诊/切诊", "内科：胃痛/肝气犯胃证", "方剂：柴胡疏肝散"],
          "media": null
        }
      ]
    },
    {
      "id": "tuina-op",
      "name": "推拿手法",
      "type": "operation",
      "weight": "常考",
      "items": []
    },
    {
      "id": "cupping-op",
      "name": "拔罐操作",
      "type": "operation",
      "weight": "常考",
      "items": []
    },
    {
      "id": "moxa-op",
      "name": "艾灸操作",
      "type": "operation",
      "weight": "常考",
      "items": []
    }
  ]
}
```

**内容填充策略**：
- 针灸操作类：覆盖大纲要求的常用穴位（不少于 10 个腧穴），每个按上述模板填写定位、操作步骤、评分标准、常见失分点
- 推拿、拔罐、艾灸各至少 3~5 个操作项
- 答辩类：不少于 10 道常见病例分析题，覆盖内科（胃痛/咳嗽/头痛/心悸/水肿）、妇科（痛经/崩漏）、儿科（小儿泄泻）等

---

## 渲染引擎：`practical-exam.js`

### 入口

提供一个入口函数：

```js
(function() {
  // 等待 DOM 就绪
  function init() {
    var container = document.getElementById('practical-tab');
    if (!container) { setTimeout(init, 100); return; }
    if (window.PRACTICAL_DATA) {
      render(container, window.PRACTICAL_DATA);
    } else {
      container.innerHTML = '<p>加载实践考试数据中...</p>';
      fetch('subjects/practical-exam.json')
        .then(r => r.json())
        .then(d => render(container, d))
        .catch(e => container.innerHTML = '<p>数据加载失败，请检查文件。</p>');
    }
  }

  // 渲染整个模块
  function render(container, data) { /* 实现见下 */ }

  // 暴露全局入口
  window.renderPractical = function() { init(); };
  document.addEventListener('DOMContentLoaded', init);
})();
```

### 主渲染逻辑 `render(container, data)`

**布局**：左侧目录（按类别分组的考点菜单）+ 右侧内容区（选中考点的详情）。

**左侧目录**：
- 按 category 分组，每组一个折叠面板
- 每个 item 一行，显示名称 + 权重标签（必考/常考/偶考），颜色区分
- 点击 item 在右侧展开详情

**右侧内容区**（默认显示第一个考点）：

操作类详情卡片结构：
1. 标题 + 权重标签
2. 操作步骤（编号列表）
3. 评分标准表格（评分项 + 分值，以纯 HTML table 实现）
4. 常见失分点（红色标记的要点）
5. 已掌握/待练习 切换按钮（存 localStorage）

答辩类详情卡片结构：
1. 题干（病例描述）
2. 答题框架（可折叠，先隐藏鼓励用户自行口述，点「查看答案」展开）
3. 相关知识点链接（显示学科+章节名称，为用户提供复习方向）

### localStorage 使用

```js
// key: "practicalProgress"
// 值：JSON 对象
{
  "acup-op-001": { "status": "mastered" },  // 或 "pending"
  "def-001": { "status": "pending" }
}
```

每个考点卡片底部有一个「标记已掌握」按钮，切换状态并保存。目录侧对应项前显示 ✔️ 或 ⏳ 图标。

---

## 达成标准

- 「实践备考」Tab 正常渲染，左侧目录按类别显示
- 操作类考点：显示步骤 + 评分表 + 失分点
- 答辩类考点：题干可见，答案框架折叠/展开
- 已掌握标记功能正常，刷新后保持状态
- 数据文件独立，不依赖 app.js 任何函数

---

## 验证清单

- [ ] `subjects/practical-exam.json` JSON 语法合法（可用 python3 解析验证）
- [ ] `practical-exam.js` 语法检查通过 (`node --check`)
- [ ] 浏览器中渲染正常：目录、详情、掌握标记
- [ ] localStorage 存取正常
