# 🚀 中医出师考核工具 — 快速接手指引

> 新任务窗口先读此文件了解关键信息，再读 PROJECT_HANDOVER.md（同目录下）获取完整细节。
> **最后更新：2026-07-16（v2 设计完成，待执行）**

## 📁 核心文件路径

所有工作文件在 D:\Work\syllabus\

```
入口文件:    index.html  ← 双击浏览器打开
框架引擎:    app.js（29KB，含学习+练习+暂存功能）
v2 设计文档: DESIGN_MASTER.md → WORK_ORDER_A/B/C/D.md → IMPLEMENTATION_PLAN.md
各科目数据:  subjects/s1-zhongji.js ~ s9-zhenjiu.js
```

## 🟢 v1 状态：全部完成

| 科目 | 大小 | 题库 | 状态 |
|------|:----:|:----:|:----:|
| 中基(s1) | 84K | 64题 | ✅ |
| 中诊(s2) | 73K | 34题 | ✅ |
| 中药(s3) | 133K | 23题 | ✅ |
| 方剂(s4) | 77K | 16题 | ✅ |
| 内科(s5) | 104K | 84题 | ✅ |
| 外科(s6) | 99K | 18题 | ✅ |
| 妇科(s7) | 61K | 33题 | ✅ |
| 儿科(s8) | 59K | 30题 | ✅ |
| 针灸(s9) | 56K | 18题 | ✅ |

**总题库 320题，含练习暂存功能**

## 📋 v2 路线图（A→B→C→D 顺序执行）

| 阶段 | 做什么 | 改什么 | 目的 |
|:---:|:---|:---|:---|
| **A** | 学习路线 + 自适应练习 + 错题本仪表盘 | app.js + study-plan.json | 学习路径、智能出题、掌握度可视化 |
| **B** | 实践考试备考模块 | practical-exam.js + .json | 操作考试 + 答辩的结构化备考 |
| **C** | PWA + 移动端适配 | index.html + sw.js + manifest.json | 手机可用、离线可用、可安装 |
| **D** | 题库扩充 320→500+ | 各 subject 文件 | 重点补中药/方剂/针灸 |

**关键约束**：app.js 由阶段 A 独占，index.html 由阶段 C 独占。每阶段完成确认后再开下一阶段。

## 📐 知识卡片标准（阶段 D 题库扩充时遵循）

每个知识点 content 必须含：
- 📜 classic-quote（经典原文+出处）+ 💡 plain（通俗理解+比喻）= **最低要求**
- 📊 compare-table + 🚨 trap-box + 🏥 clinical-case = **进阶**
- 📖 story + 🩺 mini-quiz + 📝 cardQuiz = **加分**

**阶段 D 新增题目必须包含 `pointId` 字段**（关联知识点 ID，自适应练习的基础数据）。

## ⚡ v2 关键设计决策（已确认）

1. **7 个 Tab**：学习 / 学习路线 / 练习 / 错题本 / 统计 / 收藏 / 实践备考
2. **quizHistory key**：从 v1 的 `syllabus_v4_qh` 迁移到 `quizHistory`（阶段 A 初始化时一次性迁移，旧 key 保留）
3. **study-plan.json**：app.js 用 fetch 加载（SW 自动缓存离线可用）
4. **favs** 保留为独立 Tab，history 并入统计 Tab

## ⚠️ 技术雷区（必读）

1. **写入截断**：JS/脚本 >25KB 必须用 Python heredoc 通过 bash 写入，不可用 Write 工具。app.js（~29KB）写入必须走 heredoc。
2. **VM路径**：Python 在 Linux VM 中运行，用 `/sessions/<session>/mnt/syllabus/` 路径（session ID 通过 `ls /sessions/` 获取）
3. **单元逗号**：subject 文件修改后需用 regex 全局修复数组间逗号
4. **三连验证**：`node --check` + 逗号检查 + 单元完整性
5. **引号风格**：各文件引号风格不同（见 PROJECT_HANDOVER.md 4.2 节），修改时保持上下文一致
