# 传统医学出师考核 · 一站式学习工具 — 项目交接手册

> 本文件用于新任务窗口快速接手。所有工作成果保存在 `D:\Work\syllabus\` 目录。
> 
> **最后更新：2026-08-12（动态出题引擎批次1-5 完成）**

---

## 一、项目当前阶段

### 1.1 中基(s1-zhongji.js)内容改造 — **已完成**
- ✅ 142个知识点全部改造：41个 derive-box + 5个 probe-box + 96个场景增强/轻量优化
- ✅ CSS 配套完善（derive-box/probe-box/compare-table/trap-box/classic-quote/clinical-case）
- ✅ index.html 移除 Service Worker 注册（解决缓存问题）
- ✅ s4-s9 的 registerSubject → window.registerSubject 修复（解决浏览器加载失败）
- ✅ 语法校验通过（node -c），运行时验证通过（142知识点+63道题）

### 1.2 动态出题引擎（dynquiz.js）- **批次1-5 已完成**
- ✅ 批次1：动态出题引擎核心。四类 choice 题型（概念辨析 30% / 原文理解 30% / 出处匹配 25% / 原文接龙 15%），单元分层加权（5-8 单元权重 3）。`startQuiz` 改为 70% 动态 + 30% 静态混合出卷，整体乱序。复用现有 `choice` 渲染/判分。
- ✅ 批次2：去重与降权。`dynHistory`（localStorage）按题签名记录 count/correct/consecCorrect；出题权重：从未见过 20 > 上次答错 16 > 连对1次 6 > 连对2次 3 > 连对≥3次 1。多问法独立签名。
- ✅ 批次3：错题本。`wrongBook`（localStorage 数组，软上限 500）记录答错题（sig/type/pointId/question/options/answer/explanation/wrongCount/lastWrong/consecCorrect/resolved/dyn）。`_submitQuiz` 判分时：答错入库（wrongCount 累加），答对且已入库则 consecCorrect++，连续 2 次标记 resolved。页面：列表（题干/类型/答错次数/知识点路径/时间）+ 单题"再练一次" + "已掌握" + "清空"。动态出题联动：未掌握错题的来源知识点动态题权重 ×2。
- ✅ 批次4：动态题详解联动。四类生成器 `explanation` 在原"答案说明"后追加来源卡片 `.mnem`（助记口诀）纯文本（`withMnem` helper）。`.quiz-explanation` 加 `white-space:pre-wrap` 换行渲染。注：设计文档 9.2 假设的 `.plain`/`.kv` 素材在 9 科目中均不存在，改用实际存在的 `.mnem`（s1 96 处，avg 31 字）。
- ✅ 批次5：全科目推广。**九科目全部启用**（s1/s2/s3/s4/s5/s6/s7/s8/s9；注 s3 数据 id 为 `'3'` 缺 s 前缀）。新增 **genDeriveNode**（给 derive-flow 节点选知识点）与 **genDeriveStep**（给 ds-title 选属于该知识点）两生成器，覆盖 s3/s9 推导链型卡片。题型配比 v4：concept 25% / qdef 25% / src 20% / quote 10% / dnode 10% / dstep 10%。
- 设计文档：`docs/2026-08-11-dynquiz-design.md`（已与用户确认）

### 1.3 已知限制 / 后续可选
- **s4/s6/s7/s8**：无 classic-quote/mnem，仅产 concept + dstep + dnode 型动态题，解析无口诀（属可接受降级）。s3/s9 无口诀同理。
- **s9 知识点名偏长**：s9 部分 point.name 含整段腧穴列表（如"经脉循行、主治概要、常用腧穴（…）的定位和主治"），作为选项时较长，但不影响正确性。
- 错题本与做题记录仅存本地 localStorage，无云端同步（设计文档界定为 YAGNI）。
- **s3 id 异常**：s3-zhongyao.js 的 subject.id 为 `'3'`（缺 s 前缀），dynquiz.js 按 `'3'` 启用。若数据修复 id 为 `'s3'`，需同步改 ENABLED_SUBJECTS。

---

## 二、文件结构与关键路径

```
D:\Work\syllabus\
  index.html              ← 入口（24KB，含完整CSS）
  app.js                  ← 核心框架（69KB，含错题本/判分/做题记录）
  dynquiz.js              ← 动态出题引擎 v4（四类生成器+去重降权+错题联动）
  mini-quiz-patch.js      ← 迷你诊室交互（2KB）
  practical-exam.js       ← 实践考试（38KB）
  subjects/
    s1-zhongji.js         ← 中医基础理论（123KB，142点，63题）★
    s2-zhongzhen.js       ← 中医诊断学
    s3-zhongyao.js        ← 中药学（id 为 '3'；derive 推导链，dnode/dstep 动态题）
    s4-fangji.js          ← 方剂学（已修复window.registerSubject）
    s5-neike.js           ← 中医内科学（已修复）
    s6-waike.js           ← 中医外科学（已修复）
    s7-fuke.js            ← 中医妇科学（已修复）
    s8-erke.js            ← 中医儿科学（已修复）
    s9-zhenjiu.js         ← 针灸学（derive 推导链，dnode/dstep 动态题）
  docs/
    2026-08-11-dynquiz-design.md  ← 动态出题引擎设计文档（批次1-5）
  DESIGN-SPEC-ZHONGJI-CONTENT.md  ← 中基内容设计规范
  ZHONGJI-OPTIMIZATION-PLAN.md    ← 中基执行计划（全部完成）
```

---

## 三、localStorage 键名（动态出题相关）

| key | 类型 | 说明 |
|-----|------|------|
| `dynHistory` | 对象 {sig: rec} | 动态题做题记录（批次2）。rec: count/correct/consecCorrect/lastCorrect/lastSeen。软上限 2000。 |
| `wrongBook` | 数组 | 错题本（批次3）。每条含 sig/type/pointId/question/options/answer/explanation/dyn/wrongCount/lastWrong/consecCorrect/resolved。软上限 500。 |
| `perf` | 对象 {pointId: {total,correct,lastCorrect,lastSeen}} | 知识点正确率（v2，三池加权用） |
| `quizHistory` | 数组 | 做题记录（最近 200） |
| `syllabus_v4_quiz_session` | 对象 | 未完成练习会话恢复 |

题签名规则：
- 动态题：`q.sig`（DynQuiz 生成时计算，= hash(pointId + '|' + 题型代号 + '|' + 问句片段)）
- 静态题：`wrongSig(q)` = `hash(pointId|type|question)`（app.js 内联 djb2 hash）
- "再练一次"重做题携带原 `sig`，确保错题本匹配；动态题来源重做题带 `dyn:true` 同步更新 dynHistory

---

## 四、BUG修复记录（app.js）

| 修复 | 位置 | 改动 |
|------|------|------|
| registerQuestions null过滤 | line 21 | `qs[i] != null` 过滤后再push |
| questionBank.filter null保护 | lines 517, 661, 1233 | 加 `q &&` 前缀 |
| 双加号 → NaN | lines 579, 743 | `+ +` → `+` |

---

## 五、验证命令

```bash
# 语法校验
node -c D:/Work/syllabus/subjects/s1-zhongji.js

# 运行时检查
node -e "global.window={_SUBJECTS:[],_QUESTIONS:[],registerSubject:function(s){global.window._SUBJECTS.push(s)},registerQuestions:function(qs){global.window._QUESTIONS.push.apply(global.window._QUESTIONS,qs)}};eval(require('fs').readFileSync('D:/Work/syllabus/subjects/s1-zhongji.js','utf8'));var s=global.window._SUBJECTS[0];var tot=0;s.units.forEach(function(u){u.subunits.forEach(function(sub){tot+=sub.points.length})});console.log('Points:',tot,'| Qs:',global.window._QUESTIONS.length);"
# 期望：Points: 142 | Qs: 63
```

---

## 六、开发规范

1. **单文件内修改要谨慎**：s1-zhongji.js 的 content 字段用单引号包裹，任何未转义的单引号都会破坏 JS 解析
2. **每次修改后立即验证**：`node -c` → `node -e` 两步
3. **大段替换用 Python 脚本**，精确匹配 old_string，一次成功后立即保存并验证
4. **备份先行**：`cp s1-zhongji.js s1-zhongji.js.bak` 后再改
5. **浏览器缓存**：完全关闭浏览器再打开，或 Ctrl+Shift+R 硬刷新
6. **app.js 大文件修改**：app.js 约 69KB，**任何修改必须用 Python via bash**（读->替换->写回），禁用 Write/Edit 工具直接改 app.js。每个替换 `assert s.count(old)==1` 保证唯一。改完必跑 `node --check app.js`。dynquiz.js 较小可用 Edit。
7. **动态出题白名单**：`dynquiz.js` 的 `ENABLED_SUBJECTS` 控制启用科目。新增科目前先统计素材（`<p>` 供 concept 题、classic-quote 供原文题），无素材则产出 0，不要启用。
8. **预览验收**：`.claude/launch.json` 已配 python 静态服务器（端口 8000）。用 preview_start 启动，preview_eval 注入 localStorage 数据测交互。
