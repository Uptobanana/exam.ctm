# 阶段 B 分步执行计划

> 创建日期：2026-07-16
> 状态：已完成 ✅

## 执行原则

- 每步独立验证，通过才进下一步
- 不碰 app.js，不碰 index.html
- 新增两个文件：`subjects/practical-exam.json` + `practical-exam.js`

---

## 分步执行

| 步 | 状态 | 做什么 | 改动方式 | 验证方式 |
|:--|:--|:---|:---|:---|
| 1 | ✅ 已完成 | 创建 `subjects/practical-exam.json` | Write | ✅ JSON 合法（5 分类 32 项） |
| 2 | ✅ 已完成 | 新建 `practical-exam.js`（全部代码一次到位）| Write | `node --check` 通过，括号平衡 |

---

## 交付总结

### 新增文件
- `subjects/practical-exam.json` — 5 类别 32 考点（针灸 12 / 推拿 4 / 拔罐 3 / 艾灸 3 / 答辩 10）
- `practical-exam.js` — 252 行，自执行 IIFE

### food 功能
- 左侧目录：按类别分组、折叠面板、权重标签（必考/常考）、✔️/⏳ 掌握标记
- 操作类详情：操作步骤编号列表、评分标准表格、常见失分点
- 答辩类详情：病例题干、答案框架折叠展开、关联知识点标签
- 已掌握标记：按钮切换 + localStorage (`practicalProgress`) 持久化
- 全部 CSS 内联注入（含 768px 移动端响应式）
- `window.renderPractical` 覆盖 app.js 占位符

### 验证
| 项目 | 状态 |
|:---|:---|
| practical-exam.json JSON 合法 | ✅ |
| practical-exam.js `node --check` | ✅ |
| IIFE 包裹完整 | ✅ |
| 括号平衡 96/96 | ✅ |
| 17 项关键功能检查 | ✅ |
| localStorage key | `practicalProgress` |
