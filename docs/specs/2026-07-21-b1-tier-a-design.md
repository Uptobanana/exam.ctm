# B1 全量 Tier A 改造 · 设计文档

**日期**：2026-07-21  
**规范参考**：`DESIGN-SPEC-ZHONGJI-CONTENT.md`  
**上级计划**：`ZHONGJI-OPTIMIZATION-PLAN.md`  
**改造范围**：s1-zhongji.js 中 5-2-1~5-2-10 + 5-3-1~5-3-5，共 15 个知识点  
**目标质量**：对齐 5-1-4（肝的生理功能）标杆，全量 derive-box + classic-quote + mnem + trap-box

---

## 一、改造类型与深度

所有 15 个知识点从当前 Tier B（场景化增强：plain + clinical-case + 部分 compare-table）升级为 **Tier A**（完整 derive-box：流程图 + 分步推导 + 场景变体 + 经典原文 + 口诀 + 陷阱提示）。

对标 5-1-4 标杆，每张卡片必须包含以下元素：
- `classic-quote` — 经典原文
- `mnem` — 助记口诀
- `derive-box` — 完整的 derive-flow 流程图 + derive-step 分步详解
- `trap-box` — 考试陷阱提示
- `clinical-case` — 临床案例（已部分存在，需评估质量后决定保留/替换/增强）
- 现有 `compare-table` 和 `plain` — 保留并整合到 derive-box 中

---

## 二、分组策略

### 第一组：心相关四对关系（5-2-1~5-2-4）

| ID | 名称 | 类型 | 当前状态 | 特殊要求 |
|----|------|------|---------|---------|
| 5-2-1 | 心与肺 | detail | plain + compare-table + clinical-case | 宗气为核心展开 |
| 5-2-2 | 心与脾 | detail | plain + compare-table + clinical-case | 归脾汤为终点 |
| 5-2-3 | 心与肝 | detail | plain + clinical-case | 心肝血虚为主线 |
| 5-2-4 | 心与肾 | detail | plain + clinical-case | 水火既济为核心 |

### 第二组：肺脾肝肾六对关系（5-2-5~5-2-10）

| ID | 名称 | 类型 | 当前状态 | 特殊要求 |
|----|------|------|---------|---------|
| 5-2-5 | 肺与脾 | detail | plain + clinical-case | 展开"脾为生痰之源" |
| 5-2-6 | 肺与肝 | detail | plain + clinical-case（极薄，~150字）| 需大幅扩充，木火刑金 |
| 5-2-7 | 肺与肾 | detail | plain + compare-table + clinical-case | 肾不纳气为核心 |
| 5-2-8 | 肝与脾 | detail | plain + compare-table + clinical-case | 展开"见肝之病知肝传脾" |
| 5-2-9 | 肝与肾 | detail | plain + compare-table + clinical-case | 乙癸同源为核心 |
| 5-2-10 | 脾与肾 | detail | plain + compare-table + clinical-case | 先后天互济为核心 |

### 第三组：五脏映射（5-3-1~5-3-5）

| ID | 名称 | 类型 | 当前状态 | 特殊要求 |
|----|------|------|---------|---------|
| 5-3-1 | 五脏与五体 | detail | plain + compare-table | 步骤1差异化：体—脏的外在支架 |
| 5-3-2 | 五脏与五官九窍 | detail | plain + compare-table + clinical-case | 步骤1差异化：窍—脏的瞭望孔 |
| 5-3-3 | 五脏与五志 | detail | plain + compare-table | 步骤1差异化：志—脏的情绪签名 |
| 5-3-4 | 五脏与五液 | detail | plain（极薄，~150字）| 步骤1差异化：液—脏的信使 |
| 5-3-5 | 五脏与五时 | detail | plain（极薄，~150字）| 步骤1差异化：时—脏的生物钟 |

---

## 三、derive-box 结构规范

### 第一、二组：两脏互动型（五步结构）

**derive-flow 颜色编码**：
```
脏A功能(df-organ,红) → 互动机制(df-logic,紫) → 脏B功能(df-organ,红) → 失衡连锁(df-symptom,橙)
```

**derive-step 五步**：

| 步骤 | 标题范式 | 内容范式 | CSS |
|------|---------|---------|-----|
| 1 | 脏A的职责：为什么[脏A]是[比喻]？ | 200-300字，以生活场景锚定 + 经典原文 | ds-red |
| 2 | 脏B的职责：为什么[脏B]是[比喻]？ | 200-300字，同样以生活场景锚定 | ds-red |
| 3 | 它们是"搭档"还是"对手"？——互动机制 | 300-400字，互根互用/相生相克机制，含 ≥1 条经典原文 | ds-purple |
| 4 | 一个坏了另一个怎么跟着垮——失衡连锁反应 | 300-400字，具体症状链 + 方药方向 | ds-orange |
| 5 | 同一种关系失衡，不同人表现不同 | ≥2 个场景变体，覆盖职业/年龄/饮食/地域维度 | ds-orange |

每张卡片收尾元素：
```
mnem → trap-box → clinical-case → compare-table（如有保留）
```

### 第三组：正向映射+反向诊断型（四步结构）

**derive-flow 颜色编码**：
```
五脏体系(df-concept,蓝) → 正向映射(df-organ,红) → 体外窗口(df-symptom,橙) → 反向诊断(df-logic,紫)
```

**derive-step 四步**：

| 步骤 | 标题范式 | 内容范式 | CSS |
|------|---------|---------|-----|
| 1 | 差异化标题（见下方） | 200-250字，为什么[五体/五窍/五志/五液/五时]能成为五脏的体外窗口 | ds-blue |
| 2 | 逐条映射：五条线，一条一条走 | 300-400字，心→X，肺→X……每线有现实诊断信号 | ds-red |
| 3 | 反向推导：从体外信号找到病根在哪个脏 | 250-350字，考试高频——给出信号→反问是哪个脏的问题 | ds-purple |
| 4 | 同一个信号，不同的根 | ≥2 个场景变体，同一个体外表现可能指向不同脏 | ds-orange |

**步骤 1 差异化标题**：

| 知识点 | 步骤 1 标题 |
|--------|------------|
| 5-3-1 五体 | 为什么"体"是脏的外在支架？——有诸内必形诸外 |
| 5-3-2 五窍 | 为什么"窍"是脏的瞭望孔？——五脏的精气都往哪里送 |
| 5-3-3 五志 | 为什么情绪会"伤"到内脏？——不是隐喻，是真伤 |
| 5-3-4 五液 | 为什么身体的每一种液体都归一个脏管？——液体不是废物是信使 |
| 5-3-5 五时 | 为什么每个季节有一个脏"值班"？——身体有自己的日历 |

---

## 四、执行流程

### 第一组：5-2-1~5-2-4

1. 撰写 Python 脚本 `b1-group1.py`，以字典存储四个知识点的完整新 content
2. 脚本逻辑：读取 s1-zhongji.js → 正则定位每个 ID 的 content 字段 → 替换 → 检查逗号 → 写回
3. 执行：`python3 b1-group1.py`
4. 校验：`node -c s1-zhongji.js` 零错误
5. 运行时校验：`node -e "..."` 确认 subjects=1, questions 数量无减少
6. 修复单元间逗号（如有）

### 第二组：5-2-5~5-2-10

同上流程，脚本文件 `b1-group2.py`

### 第三组：5-3-1~5-3-5

同上流程，脚本文件 `b1-group3.py`

### 最终验收

- [ ] `node -c s1-zhongji.js` 零错误
- [ ] 运行时加载正常，subjects=1, questions 数量 ≥ 改造前
- [ ] 浏览器渲染：derive-flow 流程图颜色正确、derive-step 分步清晰、移动端响应式正常
- [ ] 每个知识点含 ≥2 个场景变体
- [ ] 每个知识点含 classic-quote + mnem + trap-box

---

## 五、技术约束

- **文件大小**：当前 232KB → 预计 250-260KB（增量 ~24-30KB）
- **引号规则**：s1-zhongji.js 使用单引号包裹 content 字符串。Python 脚本中用三引号或转义处理 HTML 中的单引号（HTML 属性使用双引号，避免冲突）
- **跨行问题**：content 字符串不能跨行。Python 脚本中需用 `replace('\n', '')` 或类似方法确保最终 content 为单行
- **单元间逗号**：替换后自动检查 `]}]}{unit:` 并补逗号
- **语法校验**：每组执行后立即 `node -c`，问题就地修复
- **备份策略**：每组执行前复制原始文件为 `.bak`

---

## 六、风险与对策

| 风险 | 概率 | 对策 |
|------|------|------|
| content 字符串太长导致 Python 处理慢 | 低 | 每组脚本独立，单次处理 ≤6 个知识点 |
| HTML 中的单引号导致 JS 语法错误 | 中 | HTML 属性统一用双引号；内容文字中的单引号需在 Python 中处理 |
| 现有 compare-table 与新 derive-box 内容重复 | 中 | derive-box 的步骤 4/5 用场景化展开，compare-table 保留做结构化速查，两者互补不重复 |
| 某知识点 content 替换后 ID 匹配失败 | 低 | 用 `content:'` 前的 `id:'5-2-X'` 做精确锚点定位 |
