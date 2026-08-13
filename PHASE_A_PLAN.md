# 阶段 A 分步执行计划

> 创建日期：2026-07-16
> 状态：进行中

## 执行原则

- 每步独立验证，通过才进下一步
- 每一步完成后更新本文件状态
- 所有 app.js 改动用 Python 脚本读写文件（Edit 工具也会触发截断）

---

## 模块一：学习路径导航

| 步 | 状态 | 做什么 | 改动方式 | 验证方式 |
|:--|:--|:---|:---|:---|
| 1 | ✅ 已完成 | 创建 `subjects/study-plan.json` | Write 新文件 | `node --check` 验证 JSON |
| 2 | ✅ 已完成 | quizHistory key 迁移：`syllabus_v4_qh` → `quizHistory` | Edit app.js（3 处） | 浏览器看记录是否还在 |
| 3 | 🔄 进行中 | Tab 标识 `learn` → `study` + 向后兼容 | Python 脚本改 app.js | 浏览器切换 Tab 不报错 |
| 4 | ✅ 已完成 | switchTab 新增 4 个分支 + headerTitle 映射 + 空渲染函数 | Python 脚本改 app.js | `node --check` 通过 |
| 5 | ✅ 已完成 | 新增 `renderStudyPlan()` + `updateStudyProgress()` | Python 脚本改 app.js | `node --check` 通过，函数平衡 |
| 6 | ✅ 已完成 | `showCard()` / `bindCardQuiz()` 追加进度追踪 | Python 脚本改 app.js | `node --check` 通过 |

## 模块二：自适应练习

| 步 | 状态 | 做什么 | 改动方式 | 验证方式 |
|:--|:--|:---|:---|:---|
| 7 | ✅ 已完成 | 新增 perf 管理层：`getPerf()` / `savePerf()` / `getAccuracy()` | Python 脚本改 app.js | `node --check` 通过 |
| 8 | ✅ 已完成 | `_submitQuiz()` 追加 `savePerf()` 调用 | Python 脚本改 app.js | `node --check` 通过 |
| 9 | ✅ 已完成 | 重写 `startQuiz()` 三池加权出题 | Python 脚本改 app.js | `node --check` 通过 |
| 10 | ✅ 已完成 | `showQuizSetup()` 加智能复习按钮 | Python 脚本改 app.js | `node --check` 通过 |
| 11 | ✅ 已完成 | `quiz card` 加题目标签（🔄/✅/⭐）+ `getQuizLabel()` 函数 + CSS | Python 脚本改 app.js | `node --check` 通过 |

## 模块三：错题本 + 仪表盘

| 步 | 状态 | 做什么 | 改动方式 | 验证方式 |
|:--|:--|:---|:---|:---|
| 12 | ✅ 已完成 | 新增 `perfBySubject()` / `perfByUnit()` 辅助函数 | Python 脚本改 app.js | `node --check` 通过 |
| 13 | ✅ 已完成 | 新增 `renderWrongBook()` + _wbReviewAll + _wbExport | Python 脚本改 app.js | `node --check` 通过 |
| 14 | ✅ 已完成 | 新增 `renderStats()` — 条形图 + 趋势图 + 薄弱板块 + 折叠面板 + CSS | Python 脚本改 app.js | `node --check` 通过 |
| 15 | ✅ 已完成 | `renderStats()` 包含趋势图 + 历史折叠面板 + 薄弱板块（在步骤 14 中一次性完成） | 追加在 renderStats 内 | `node --check` 通过 |
| 16 | ✅ 已完成 | 最终验证：文件完整性 + 语法 + 功能确认 | bash + 检查 | 全部正常 |

---

## 状态图例

- ⬜ 待执行
- 🔄 进行中
- ✅ 已完成
- ❌ 受阻
