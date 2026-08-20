#!/usr/bin/env node
/**
 * export-to-obsidian.js
 * 把本项目的 9 科 ~664 个知识点导出为可直接拖进 Obsidian vault 的笔记。
 *
 * 用法:
 *   node export-to-obsidian.js            # 方案A: 正文保留 HTML + 附赠 CSS 片段(默认/推荐)
 *   node export-to-obsidian.js --callout  # 方案B: 正文转成 Obsidian 原生 Callout
 *
 * 产出: ./obsidian-export/
 *   00-中基/ 01-中诊/ 02-中药/ 03-方剂/ 04-内科/ 05-外科/ 06-妇科/ 07-儿科/ 08-针灸/
 *   每个知识点一个笔记: <id> <名称>.md (带 frontmatter + [[wikilink]] + 自测 + 跨科关联)
 *   tcm-content.css  (方案A 的样式片段，放进 vault 的 .obsidian/snippets/ 并启用)
 *   README.md
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = __dirname;
const SUBJECTS_DIR = path.join(ROOT, 'subjects');
const MODE = process.argv.includes('--callout') ? 'callout' : 'html';
const OUT_DIR = path.join(ROOT, MODE === 'callout' ? 'obsidian-export-callout' : 'obsidian-export');

// ---------- 工具 ----------
function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function stripTags(s) { return (s || '').replace(/<[^>]+>/g, ''); }
function sanitizeName(s) {
  return (s || '').replace(/[\/\\:*?"<>|]/g, '').replace(/^\.+/, '').replace(/\s+$/, '').trim();
}

// ---------- 1. 读取 9 个生产科目文件 ----------
const files = fs.readdirSync(SUBJECTS_DIR)
  .filter(f => /^s[1-9]-.+\.js$/.test(f))
  .filter(f => !f.includes('.bak') && !f.includes('.withB1fix') && !f.includes('.fixed'))
  .map(f => path.join(SUBJECTS_DIR, f))
  .sort();

function loadSubject(file) {
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = {
    window: {
      registerSubject: (s) => { sandbox.__subject = s; },
      registerQuestions: (q) => { sandbox.__questions = q; },
    },
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  return { subject: sandbox.__subject, questions: sandbox.__questions || [] };
}

const subjects = [];
const allQuestions = [];
for (const file of files) {
  const { subject, questions } = loadSubject(file);
  if (!subject) { console.warn('跳过(无 subject):', file); continue; }
  subjects.push(subject);
  for (const q of questions) allQuestions.push(q);
}

// ---------- 2. 构建 ID -> 信息 映射 ----------
const idMap = {}; // id -> {name, abbr, subjectName, type, unit, subunit, subjectId}
const prefixByNum = {}; // 科目号(如5) -> ID前缀(如 nk)，用于把测验题的相对 pointId 映射到知识点 id
for (const subject of subjects) {
  const abbr = subject.abbr, subjectName = subject.name, sid = subject.id;
  const num = parseInt(String(sid).replace(/\D/g, ''), 10);
  const sample = (subject.points && subject.points[0])
    || (subject.units && subject.units[0] && subject.units[0].subunits && subject.units[0].subunits[0] && subject.units[0].subunits[0].points && subject.units[0].subunits[0].points[0]);
  if (num && sample && sample.id) prefixByNum[num] = sample.id.split('-')[0];
  const collect = (pts, unitName, subunitName) => {
    for (const p of (pts || [])) {
      if (!p || !p.id) continue;
      idMap[p.id] = {
        name: p.name, abbr, subjectName, type: p.type,
        unit: unitName, subunit: subunitName, subjectId: sid, point: p,
      };
    }
  };
  collect(subject.points, '', '');
  for (const u of (subject.units || [])) {
    const unitName = u.unit;
    for (const su of (u.subunits || [])) collect(su.points, unitName, su.name);
  }
}

function linkFor(id) {
  const info = idMap[id];
  if (!info) return null;
  const safe = sanitizeName(info.name);
  return { target: `${id} ${safe}`, display: info.name };
}

// ---------- 3. 把正文里的 [ID] 标记转成 [[wikilink]] ----------
const ID_RE = /\[([a-z]+(?:-\d+[a-z]?)+)\]/g;
// 捕获"标记前紧邻的中文名"作为链接别名（方剂等是复合点，name 是一长串，别名用你写的那个药名更准）
const PRE_RE = /(?<=^|[^一-鿿])([一-鿿]{2,24})\[([a-z]+(?:-\d+[a-z]?)+)\]/g;
function convertLinks(html) {
  let out = html || '';
  // 名称[ID] -> [[ID 复合点名|名称]]：别名用你写的中文名，目标指向复合点笔记
  out = out.replace(PRE_RE, (m, name, id) => {
    const lk = linkFor(id);
    return lk ? `[[${lk.target}|${name}]]` : m;
  });
  // 残留裸 [ID] -> [[ID 复合点名]]（无别名）
  out = out.replace(ID_RE, (m, id) => {
    const lk = linkFor(id);
    return lk ? `[[${lk.target}]]` : m;
  });
  return out;
}

// ---------- 4. 方案B: HTML -> Obsidian Callout ----------
function parseCompareCol(inner) {
  const lines = [];
  const blocks = [...inner.matchAll(/<h4>([\s\S]*?)<\/h4>\s*<p>([\s\S]*?)<\/p>/g)];
  if (blocks.length) {
    for (const b of blocks) { lines.push('**' + stripTags(b[1]).trim() + '**'); lines.push(stripTags(b[2]).trim()); }
  } else {
    const ps = [...inner.matchAll(/<p>([\s\S]*?)<\/p>/g)];
    for (const p of ps) lines.push(stripTags(p[1]).trim());
  }
  return lines;
}
function convertCompare(inner) {
  const leftM = inner.match(/<div class="ct-left">([\s\S]*?)<\/div>/);
  const rightM = inner.match(/<div class="ct-right">([\s\S]*?)<\/div>/);
  const left = parseCompareCol(leftM ? leftM[1] : '');
  const right = parseCompareCol(rightM ? rightM[1] : '');
  let md = '| 对比 | |\n|---|---|\n';
  const n = Math.max(left.length, right.length);
  for (let i = 0; i < n; i++) md += `| ${left[i] || ''} | ${right[i] || ''} |\n`;
  return md;
}
function convertDerive(inner) {
  let out = '';
  const flow = inner.match(/<div class="derive-flow">([\s\S]*?)<\/div>/);
  if (flow) {
    const nodes = [...flow[1].matchAll(/<span class="df-node[^"]*">([\s\S]*?)<\/span>/g)]
      .map(x => stripTags(x[1]).replace(/\n/g, '').trim());
    out += '\n推导流：' + nodes.join(' → ') + '\n';
  }
  const steps = [...inner.matchAll(/<div class="derive-step[^"]*">([\s\S]*?)<\/div>/g)];
  for (const st of steps) {
    const titleM = st[1].match(/<span class="ds-title">([\s\S]*?)<\/span>/);
    const bodyM = st[1].match(/<div class="ds-body">([\s\S]*?)<\/div>/);
    const title = titleM ? stripTags(titleM[1]).trim() : '';
    const body = bodyM ? stripTags(bodyM[1]).replace(/\n+/g, ' ').trim() : '';
    out += `> [!note] ${title}\n> ${body}\n`;
  }
  return out;
}
function calloutBlock(cls, label, inner) {
  return `> [!${cls}] ${label}\n> ${stripTags(inner).replace(/\n+/g, ' ').trim().replace(/\n/g, '\n> ')}\n`;
}
function htmlToCallout(html) {
  let s = html || '';
  s = s.replace(/<div class="classic-quote">([\s\S]*?)<\/div>/g, (m, i) => calloutBlock('quote', '经典引用', i));
  s = s.replace(/<div class="mnem">([\s\S]*?)<\/div>/g, (m, i) => calloutBlock('tip', '口诀', i));
  s = s.replace(/<div class="trap-box">([\s\S]*?)<\/div>/g, (m, i) => calloutBlock('warning', '易错点', i));
  s = s.replace(/<div class="clinical-case">([\s\S]*?)<\/div>/g, (m, i) => calloutBlock('example', '临床案例', i));
  s = s.replace(/<div class="derive-box">([\s\S]*?)<\/div>/g, (m, i) => convertDerive(i));
  s = s.replace(/<div class="compare-table"[^>]*>([\s\S]*?)<\/div>/g, (m, i) => convertCompare(i));
  s = s.replace(/<div class="mini-quiz">[\s\S]*?<\/div>/g, '> [!question] 一分钟诊室\n> (交互测验，可在原网页 App 中作答)\n');
  s = s.replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**');
  s = s.replace(/<p>([\s\S]*?)<\/p>/g, (m, i) => stripTags(i).trim() + '\n');
  s = s.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
  s = s.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');
  s = stripTags(s);
  return s.trim();
}

// ---------- 5. 自测题 ----------
function collectQuiz(point) {
  const res = [];
  if (Array.isArray(point.cardQuiz)) {
    for (const c of point.cardQuiz) res.push({ q: c.q, opts: c.opts, ans: c.ans });
  }
  for (const q of allQuestions) {
    if (!q || !q.pointId) continue;
    const parts = String(q.pointId).split('-');
    const num = parseInt(parts[0], 10);
    const prefix = prefixByNum[num];
    const fullId = prefix ? [prefix, ...parts.slice(1)].join('-') : q.pointId;
    if (fullId === point.id) {
      if (q.type === 'choice') res.push({ q: q.question, opts: q.options, ans: q.answer });
      else if (q.type === 'fill') res.push({ q: q.question, fill: true, ans: q.answer });
    }
  }
  return res;
}
function renderQuiz(list) {
  const lines = ['## 自测'];
  list.forEach((it, i) => {
    lines.push(`### Q${i + 1}: ${it.q}`);
    if (it.fill) lines.push(`- 答案：**${it.ans}**`);
    else (it.opts || []).forEach((o, idx) => lines.push(`- ${o}${idx === it.ans ? ' ✓' : ''}`));
    lines.push('');
  });
  return lines.join('\n');
}

// ---------- 6. 99 条精选跨科链接 (从 git 历史恢复) ----------
const seedByFrom = {};
try {
  const raw = execSync('git show 3714cad:subjects/concept-links.js', { cwd: ROOT, encoding: 'utf8' });
  const m = raw.match(/window\.XLINK_EXTRA\s*=\s*(\[[\s\S]*?\]);/);
  if (m) {
    const arr = eval(m[1]);
    let used = 0, dead = 0;
    for (const e of arr) {
      if (idMap[e.from] && idMap[e.to]) { (seedByFrom[e.from] = seedByFrom[e.from] || []).push(e); used++; }
      else dead++;
    }
    console.log(`精选跨科链接: 生效 ${used} / 跳过(死链) ${dead}`);
  }
} catch (e) {
  console.warn('精选跨科链接跳过:', e.message);
}
function renderSeeds(list) {
  const lines = ['## 跨科关联（精选）'];
  for (const e of list) {
    const t = linkFor(e.to);
    lines.push(`- ${t ? `[[${t.target}|${t.display}]]` : e.to} — ${e.rel}`);
  }
  return lines.join('\n');
}

// ---------- 7. 生成笔记 ----------
function buildNote(info) {
  const p = info.point;
  const fm = [
    '---',
    `id: ${p.id}`,
    `subject: ${info.subjectName}`,
    `abbr: ${info.abbr}`,
    `type: ${info.type || 'unknown'}`,
    `unit: ${info.unit || ''}`,
    `subunit: ${info.subunit || ''}`,
    `tags: [${info.abbr}, ${info.type || 'unknown'}]`,
    '---',
    '',
    `# ${p.name}`,
    '',
  ];
  let body = convertLinks(p.content || '');
  if (MODE === 'callout') body = htmlToCallout(body);
  const blocks = [fm.join('\n'), body];
  const quizzes = collectQuiz(p);
  if (quizzes.length) blocks.push(renderQuiz(quizzes));
  const seeds = seedByFrom[p.id] || [];
  if (seeds.length) blocks.push(renderSeeds(seeds));
  return blocks.join('\n\n');
}

// ---------- 8. 写出 ----------
try { fs.rmSync(OUT_DIR, { recursive: true, force: true }); } catch (e) { /* 首次运行目录不存在，忽略 safe-delete shim 报错 */ }
let total = 0, linkCount = 0, deadLinks = 0;
for (const subject of subjects) {
  const num = parseInt(String(subject.id).replace(/\D/g, ''), 10) || 0;
  const folder = path.join(OUT_DIR, `${String(num).padStart(2, '0')}-${subject.abbr}`);
  fs.mkdirSync(folder, { recursive: true });
  const write = (pts, unitName, subunitName) => {
    for (const p of (pts || [])) {
      if (!p || !p.id) continue;
      const info = idMap[p.id];
      if (!info) continue;
      const safe = sanitizeName(p.name);
      const file = path.join(folder, `${p.id} ${safe}.md`);
      fs.writeFileSync(file, buildNote(info), 'utf8');
      total++;
      const m = (p.content || '').match(ID_RE);
      if (m) for (const tok of m) {
        const id = tok.slice(1, -1);
        if (idMap[id]) linkCount++; else deadLinks++;
      }
    }
  };
  write(subject.points, '', '');
  for (const u of (subject.units || [])) for (const su of (u.subunits || [])) write(su.points, u.unit, su.name);
}

// ---------- 9. CSS 片段 + README ----------
if (MODE === 'html') {
  fs.writeFileSync(path.join(OUT_DIR, 'tcm-content.css'), CSS_SNIPPET(), 'utf8');
}
fs.writeFileSync(path.join(OUT_DIR, 'README.md'), README(MODE), 'utf8');

console.log(`完成(${MODE})。笔记 ${total} 个，正文内跨科链接 ${linkCount} 条，死链 ${deadLinks} 条。`);
console.log('输出目录:', OUT_DIR);

// ---------- 样式片段 ----------
function CSS_SNIPPET() { return `/* 传统医学出师考核 - Obsidian 内容样式片段
 * 用法: 复制到你的 vault 的 .obsidian/snippets/tcm-content.css，
 *       设置 → 外观 → 片段 中启用。仅在方案A(保留HTML)导出时需要。 */
.classic-quote{border-left:4px solid #7F77DD;background:#EEEDFE;padding:8px 12px;border-radius:0 8px 8px 0;margin:10px 0;color:#3C3489;font-size:.92em}
.classic-quote .src{display:block;margin-top:4px;color:#888;font-size:.85em}
.mnem{border-left:4px solid #BA7517;background:#FAEEDA;padding:8px 12px;border-radius:0 8px 8px 0;margin:10px 0;color:#633806;font-weight:500}
.derive-box{border:1px solid #d8d4e8;background:#faf9ff;border-radius:10px;padding:12px;margin:12px 0}
.derive-flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:10px}
.df-node{border:1px solid #378ADD;background:#E6F1FB;color:#0C447C;border-radius:8px;padding:3px 8px;font-size:.85em}
.df-arrow{color:#888;font-weight:700}
.derive-step{border:1px solid #ccc;border-radius:8px;padding:8px 10px;margin:8px 0}
.ds-blue{border-color:#378ADD;background:#E6F1FB}
.ds-red{border-color:#E24B4A;background:#FCEBEB}
.ds-purple{border-color:#7F77DD;background:#EEEDFE}
.ds-orange{border-color:#BA7517;background:#FAEEDA}
.ds-title{font-weight:600;color:#26215C;margin-bottom:4px}
.compare-table{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
.ct-left,.ct-right{border:1px solid #ddd;border-radius:8px;padding:8px 10px;background:#fbfbfd}
.ct-left h4,.ct-right h4{margin:0 0 6px;color:#185FA5;font-size:.95em}
.trap-box{border:1px solid #D85A30;background:#FAECE7;color:#712B13;border-radius:8px;padding:8px 10px;margin:12px 0;font-size:.9em}
.clinical-case{border:1px solid #1D9E75;background:#E1F5EE;color:#085041;border-radius:8px;padding:8px 10px;margin:12px 0;font-size:.9em}
.mini-quiz{border:1px dashed #888;border-radius:8px;padding:10px;margin:12px 0;background:#f7f7f7}
.mq-title{font-weight:600;color:#534AB7;margin-bottom:6px}
.mq-opt{padding:4px 8px;margin:4px 0;border:1px solid #ccc;border-radius:6px;cursor:pointer}
`; }

function README(mode) {
  return `# 传统医学出师考核 · Obsidian 知识图谱导出

本目录由项目脚本 \`export-to-obsidian.js\` 生成，可直接**整体复制进你的 Obsidian vault**（或软链）。

## 目录结构
${subjects.map(s => `- ${String(parseInt(String(s.id).replace(/\D/g, ''), 10)).padStart(2, '0')}-${s.abbr}/  （${s.name}）`).join('\n')}

每个知识点 = 一个笔记：\`<id> <名称>.md\`，含 frontmatter、正文、自测题、跨科关联。

## 图谱怎么来的
- 正文里的 \`[方剂ID]\` / \`[中药ID]\` 标记已转成 Obsidian \`[[双向链接]]\`，构成图谱的边。
- 9 个科目文件夹在图谱里天然按色分组。
- 顶部 \`tags\` 含科目缩写与题型(concept/apply/compare)，可作图谱筛选维度。
- 额外注入 99 条精选跨科链接（病证—方剂/脏腑/腧穴等），让图谱更密。

## 使用
1. 把本目录内容复制进 vault（或把 vault 指向本目录）。
2. ${mode === 'html'
    ? '启用样式片段：把 `tcm-content.css` 复制到 vault 的 `.obsidian/snippets/` 目录，设置 → 外观 → 片段 中开启，辨证推导流/对比表/陷阱框即可还原网页样式。'
    : '方案B 已转成 Obsidian 原生 Callout，无需任何额外样式即可完美显示。'}
3. 打开 **图谱视图(Graph View)**，即可看到 664 节点 + 上千条边的跨科网络。点节点展开邻居、按文件夹着色、按标签筛选。
4. 推荐装社区插件增强：
   - **Dataview**：写查询，如 \`LIST FROM "04-内科" WHERE contains(tags,"apply")\`
   - **Graph Analysis**：算节点中心度（如八珍汤入链极多=核心方）
   - **Breadcrumbs**：建立单元/证型层级
   - **Spaced Repetition**：把笔记末尾「自测」变成记忆卡

## 重新生成
\`\`\`bash
node export-to-obsidian.js            # 方案A (默认)
node export-to-obsidian.js --callout  # 方案B
\`\`\`
`;
}
