(function() {
  'use strict';
  /* ============================================================
   * 动态出题引擎 DynQuiz（v5）
   * 六类生成器均为 choice 格式，与现有题库一致，额外携带 dyn:true 与 sig。
   * - 概念辨析型 (concept)：给四个真实表述，选属于该知识点的。素材来自卡片说明段 <p>，
   *   干扰项取其他知识点说明段（优先同单元）。
   * - 原文理解型 (qdef)：给经典原文选其阐释的概念（知识点名作答）
   * - 出处匹配 (src)：给原文选出处经典
   * - 原文接龙 (quote)：给上半句选下半句，仅取≤24字经典短句
   * - 推导节点理解型 (dnode)：给 derive-flow 节点选其阐释的知识点（s3/s9 推导链型卡片）
   * - 推导步骤辨析型 (dstep)：给四个 ds-title 选属于该知识点的
   * 单元分层加权：5-8单元权重3，3/4/12单元权重2，其余1。
   * 解析联动：explanation 追加来源卡片 .mnem 助记口诀（批次4）。
   * ============================================================ */

  var ENABLED_SUBJECTS = { 's1': true, 's2': true, '3': true, 's4': true, 's5': true, 's6': true, 's7': true, 's8': true, 's9': true };
  // 注：s3 中药学在数据文件中 id 为 '3'（缺 s 前缀，历史遗留），此处按实际 id 启用。
  // s3/s9 为推导链型卡片，由 genDeriveNode/genDeriveStep（基于 derive-flow 节点与 derive-step 标题）覆盖。
  // s4/s6/s7/s8 无 classic-quote/mnem，仅产 concept + dstep 型动态题（解析无口诀），属可接受降级。

  function stripTags(html) {
    if (!html) return '';
    return String(html)
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ').trim();
  }
  function hashStr(s) {
    var h = 5381; s = String(s);
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h) + s.charCodeAt(i); h = h & 0xffffffff; }
    return (h >>> 0).toString(36);
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function pick(arr) { return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }

  function unitWeight(ui) {
    if (ui >= 4 && ui <= 7) return 3;
    if (ui === 2 || ui === 3 || ui === 11) return 2;
    return 1;
  }

  // ---------- 去重与降权（dynHistory，批次2） ----------
  function getDynHistory() {
    try { return JSON.parse(localStorage.getItem('dynHistory') || '{}'); }
    catch (e) { return {}; }
  }
  function saveDynHistory(h) {
    try { localStorage.setItem('dynHistory', JSON.stringify(h)); } catch (e) {}
  }
  // 动态题权重：从未见过最高(20)，连续答对3次以上最低(1，几乎不再出)
  function dynWeight(rec) {
    if (!rec || rec.count === 0) return 20;        // 从未见过
    if (rec.consecCorrect >= 3) return 1;           // 连续答对3次以上 -> 熟题
    if (!rec.lastCorrect) return 16;                // 上次答错 -> 没掌握，多练
    if (rec.consecCorrect >= 2) return 3;           // 连续答对2次
    return 6;                                       // 连续答对1次
  }
  function recordResult(sig, correct) {
    if (!sig) return;
    var h = getDynHistory();
    var rec = h[sig] || { count: 0, correct: 0, consecCorrect: 0, lastCorrect: false, lastSeen: 0 };
    rec.count++;
    if (correct) { rec.correct++; rec.consecCorrect++; } else { rec.consecCorrect = 0; }
    rec.lastCorrect = !!correct;
    rec.lastSeen = Date.now();
    h[sig] = rec;
    var keys = Object.keys(h);
    if (keys.length > 2000) {  // 软上限：超量删最旧 200 条
      keys.sort(function(a, b) { return (h[a].lastSeen || 0) - (h[b].lastSeen || 0); });
      for (var i = 0; i < 200; i++) delete h[keys[i]];
    }
    saveDynHistory(h);
  }
  // 错题本联动（批次3）：来源知识点存在未掌握错题的动态题加权
  function getWrongPointIds() {
    try {
      var wb = JSON.parse(localStorage.getItem('wrongBook') || '[]');
      var s = {};
      wb.forEach(function(r) { if (!r.resolved && r.pointId) s[r.pointId] = 1; });
      return s;
    } catch (e) { return {}; }
  }
  function nameParts(name) {
    if (!name) return [];
    return name.split(/[的与和及之·\-\s，、：:（）()]+/).filter(function(s) { return s.length >= 2; });
  }
  // 点名主体（去掉尾部"的XX"），用于剔除复述点名的句子
  function nameCore(name) {
    if (!name) return '';
    var core = name.replace(/的[^的]*$/, '').trim();
    return core.length >= 2 ? core : '';
  }

  // ---------- 内容解析器 ----------
  function extractQuotes(content) {
    var out = [], re = /<div class="classic-quote">(.*?)<\/div>/g, m;
    while ((m = re.exec(content)) !== null) {
      var block = m[1];
      var src = '';
      var srcM = /<span class="src">(.*?)<\/span>/.exec(block);
      if (srcM) { src = stripTags(srcM[1]).replace(/^[-–—]+/, '').trim(); }
      var quoteText = block.replace(/<span class="src">[\s\S]*?<\/span>/, '');
      quoteText = stripTags(quoteText).trim();
      out.push({ quote: quoteText, src: src });
    }
    return out;
  }
  function extractSentences(quoteText) {
    var out = [], m;
    var re = /"([^"]+)"/g;
    while ((m = re.exec(quoteText)) !== null) { var s = m[1].trim(); if (s.length >= 4) out.push(s); }
    if (out.length === 0) {
      re = /“([^”]+)”/g;
      while ((m = re.exec(quoteText)) !== null) { var s2 = m[1].trim(); if (s2.length >= 4) out.push(s2); }
    }
    return out;
  }

  // 从卡片说明段 <p> 抽取概念性表述（用于概念辨析型）
  function extractConceptStatements(content, name) {
    var out = [];
    var core = nameCore(name);
    var pRe = /<p>(.*?)<\/p>/g, m;
    while ((m = pRe.exec(content)) !== null) {
      var text = stripTags(m[1]).trim();
      var sentences = text.split(/[。；;]/);
      sentences.forEach(function(s) {
        s = s.trim();
        if (s.length < 6 || s.length > 40) return;
        if (!/[一-鿿]/.test(s)) return;
        if (/[①②③④⑤⑥⑦⑧⑨⑩]/.test(s)) return;                    // 编号片段
        if (/^(包括|即|其中|二是|三是|四是|核心功能|表现|场景|这是|两者|它)/.test(s)) return; // 片段开头
        if (/--|->|▶|▸/.test(s)) return;                            // 含符号/箭头
        if (/[汤丸散丹饮膏煎方片剂胶]$/.test(s)) return;            // 方剂名结尾
        if (/(场景|患者|表现：|证见|治以|方用|代表方|案例)/.test(s)) return; // 临床/治疗
        if (name && s.indexOf(name) > -1) return;                   // 含完整点名
        if (core && s.indexOf(core) > -1) return;                   // 复述点名主体（如"肝与胆相表里"）
        out.push(s);
      });
    }
    return out;
  }

  // 提取卡片助记口诀（.mnem）纯文本，用作动态题解析的卡片摘要（批次4）
  function extractMnem(content) {
    var m = /<div class="mnem">(.*?)<\/div>/.exec(content);
    if (!m) return '';
    var t = stripTags(m[1]).trim();
    return t.length >= 4 ? t : '';
  }
  // 在原"答案说明"后追加来源卡片的助记口诀（若有）
  function withMnem(expl, point) {
    var m = extractMnem(point.content);
    return m ? expl + '\n\n🎵 助记口诀：' + m : expl;
  }

  // 提取 derive-flow 节点（兼容有无引号 class，批次5 为 s3/s9 推导链型卡片）
  function extractDeriveNodes(content) {
    var out = [], re = /<span class=["']?df-node df-(\w+)["']?>(.*?)<\/span>/g, m;
    while ((m = re.exec(content)) !== null) {
      var t = stripTags(m[2]).replace(/&#34;/g, '"').trim();
      if (t.length >= 3) out.push({ type: m[1], text: t });
    }
    return out;
  }
  // 提取 derive-step 标题（ds-title），剥离"前缀："保留内容
  function extractDeriveTitles(content) {
    var out = [], re = /<span class=["']?ds-title["']?>(.*?)<\/span>/g, m;
    while ((m = re.exec(content)) !== null) {
      var t = stripTags(m[1]).replace(/&#34;/g, '"').trim();
      var ci = t.indexOf('：');
      if (ci > 0 && ci < 10) t = t.substring(ci + 1).trim();  // 剥离"概念溯源："等前缀
      if (t.length >= 4 && t.length <= 40) out.push(t);
    }
    return out;
  }

  // ---------- 科目级上下文 ----------
  function buildContext(subject) {
    var points = [];
    var allSentences = [];
    var allSrcs = [];
    var pointNames = [];
    var statementPool = [];   // {text, unitIdx, pointId} 概念辨析型素材
    var srcSet = {};
    var sentCount = {};
    var allDeriveNodes = [];  // {text, type, unitIdx, pointId} 推导节点（批次5）
    var nodeCount = {};       // 跨卡重复检测
    var deriveTitlePool = []; // {text, unitIdx, pointId} 推导步骤标题
    subject.units.forEach(function(unit, ui) {
      unit.subunits.forEach(function(sub) {
        sub.points.forEach(function(p) {
          if (!p || !p.content) return;
          points.push({ point: p, unitIdx: ui });
          if (p.name) pointNames.push({ name: p.name, unitIdx: ui, pointId: p.id });
          extractConceptStatements(p.content, p.name).forEach(function(st) {
            statementPool.push({ text: st, unitIdx: ui, pointId: p.id });
          });
          extractQuotes(p.content).forEach(function(q) {
            extractSentences(q.quote).forEach(function(s) {
              allSentences.push({ text: s, unitIdx: ui, pointId: p.id });
              sentCount[s] = (sentCount[s] || 0) + 1;
            });
            if (q.src && !srcSet[q.src]) { srcSet[q.src] = 1; allSrcs.push({ src: q.src, unitIdx: ui }); }
          });
          extractDeriveNodes(p.content).forEach(function(n) {
            allDeriveNodes.push({ text: n.text, type: n.type, unitIdx: ui, pointId: p.id });
            nodeCount[n.text] = (nodeCount[n.text] || 0) + 1;
          });
          extractDeriveTitles(p.content).forEach(function(tt) {
            deriveTitlePool.push({ text: tt, unitIdx: ui, pointId: p.id });
          });
        });
      });
    });
    return { points: points, allSentences: allSentences, allSrcs: allSrcs,
             pointNames: pointNames, sentCount: sentCount, statementPool: statementPool,
             allDeriveNodes: allDeriveNodes, nodeCount: nodeCount, deriveTitlePool: deriveTitlePool };
  }

  function pickDistractorNames(ctx, point, n) {
    var myUnit = -1;
    for (var i = 0; i < ctx.points.length; i++) {
      if (ctx.points[i].point.id === point.id) { myUnit = ctx.points[i].unitIdx; break; }
    }
    var same = [], other = [];
    ctx.pointNames.forEach(function(pn) {
      if (pn.pointId === point.id || pn.name === point.name) return;
      (pn.unitIdx === myUnit ? same : other).push(pn.name);
    });
    var pool = same.length >= n ? same : same.concat(other);
    var out = [];
    pool.forEach(function(nm) { if (out.indexOf(nm) === -1) out.push(nm); });
    shuffle(out);
    return out.length >= n ? out.slice(0, n) : null;
  }

  function leaksName(text, point) {
    var parts = nameParts(point.name);
    for (var i = 0; i < parts.length; i++) {
      if (text.indexOf(parts[i]) > -1) return true;
    }
    return false;
  }

  // ---------- 题型生成器 ----------
  // 1. 概念辨析型 (choice)：四个真实表述，选属于该知识点的
  function genConcept(point, ctx) {
    var stmts = extractConceptStatements(point.content, point.name);
    if (stmts.length === 0) return null;
    var correct = pick(stmts);
    var myUnit = -1;
    for (var i = 0; i < ctx.points.length; i++) {
      if (ctx.points[i].point.id === point.id) { myUnit = ctx.points[i].unitIdx; break; }
    }
    var same = [], other = [];
    ctx.statementPool.forEach(function(s) {
      if (s.pointId === point.id) return;
      if (s.text === correct) return;
      if (point.name && s.text.indexOf(point.name) > -1) return;
      // 排除干扰项中含本卡点名主体的（避免与正确项混淆）
      var core = nameCore(point.name);
      if (core && s.text.indexOf(core) > -1) return;
      (s.unitIdx === myUnit ? same : other).push(s.text);
    });
    var pool = same.length >= 3 ? same : same.concat(other);
    var distractors = [];
    pool.forEach(function(t) { if (distractors.indexOf(t) === -1 && t !== correct) distractors.push(t); });
    if (distractors.length < 3) return null;
    shuffle(distractors);
    distractors = distractors.slice(0, 3);
    var options = [correct].concat(distractors);
    shuffle(options);
    return {
      type: 'choice', pointId: point.id, _gen: 'concept',
      question: '关于【' + point.name + '】，下列哪项属于其内容？',
      options: options, answer: options.indexOf(correct),
      explanation: withMnem('【' + point.name + '】的内容包括：' + correct, point),
      dyn: true, sig: hashStr(point.id + '|concept|' + correct.substring(0, 16))
    };
  }

  // 2. 原文理解型 (choice)：给经典原文选其阐释的概念
  function genQuoteDef(point, ctx) {
    var sens = [];
    extractQuotes(point.content).forEach(function(q) {
      extractSentences(q.quote).forEach(function(s) { sens.push(s); });
    });
    if (sens.length === 0) return null;
    var stem = pick(sens);
    if (stem.length < 4) return null;
    if (leaksName(stem, point)) return null;
    if ((ctx.sentCount[stem] || 1) > 1) return null;
    var distractors = pickDistractorNames(ctx, point, 3);
    if (!distractors) return null;
    var options = [point.name].concat(distractors);
    shuffle(options);
    return {
      type: 'choice', pointId: point.id, _gen: 'qdef',
      question: '下列经典原文主要阐释的中医学概念是？「' + stem + '」',
      options: options, answer: options.indexOf(point.name),
      explanation: withMnem('该原文阐释【' + point.name + '】。', point),
      dyn: true, sig: hashStr(point.id + '|qdef|' + stem.substring(0, 16))
    };
  }

  // 3. 出处匹配 (choice)
  function genSourceMatch(point, ctx) {
    var qs = extractQuotes(point.content).filter(function(q) { return q.src; });
    if (qs.length === 0) return null;
    var chosen = pick(qs);
    var sens = extractSentences(chosen.quote);
    var stem = sens.length ? pick(sens) : chosen.quote.replace(/^《[^》]+》：?/, '').trim();
    if (stem.length < 4) return null;
    var correct = chosen.src;
    var distractors = [];
    ctx.allSrcs.forEach(function(o) {
      if (o.src !== correct && distractors.indexOf(o.src) === -1) distractors.push(o.src);
    });
    if (distractors.length < 3) return null;
    shuffle(distractors);
    distractors = distractors.slice(0, 3);
    var options = [correct].concat(distractors);
    shuffle(options);
    return {
      type: 'choice', pointId: point.id, _gen: 'src',
      question: '下列原文出自哪部经典？「' + stem + '」',
      options: options, answer: options.indexOf(correct),
      explanation: withMnem('该句出自' + correct, point),
      dyn: true, sig: hashStr(point.id + '|src|' + stem.substring(0, 16))
    };
  }

  // 4. 原文接龙 (choice)：≤24字经典短句
  function genQuoteMatch(point, ctx) {
    var sens = [];
    extractQuotes(point.content).forEach(function(q) {
      extractSentences(q.quote).forEach(function(s) { sens.push({ s: s, src: q.src }); });
    });
    var splittable = sens.filter(function(x) {
      return x.s.indexOf('，') > 0 && x.s.length >= 8 && x.s.length <= 24;
    });
    if (splittable.length === 0) return null;
    var chosen = pick(splittable);
    var idx = chosen.s.indexOf('，');
    var first = chosen.s.substring(0, idx);
    var second = chosen.s.substring(idx + 1).replace(/。$/, '');
    if (second.length < 2) return null;
    var distractors = [];
    ctx.allSentences.forEach(function(o) {
      if (o.pointId === point.id) return;
      var ci = o.text.indexOf('，');
      if (ci < 0) return;
      var sec = o.text.substring(ci + 1).replace(/。$/, '');
      if (sec.length >= 2 && sec.length <= 20 && sec !== second && distractors.indexOf(sec) === -1) distractors.push(sec);
    });
    if (distractors.length < 3) return null;
    shuffle(distractors);
    distractors = distractors.slice(0, 3);
    var options = [second].concat(distractors);
    shuffle(options);
    return {
      type: 'choice', pointId: point.id, _gen: 'quote',
      question: '原文接龙："' + first + '，____"',
      options: options, answer: options.indexOf(second),
      explanation: withMnem('完整原文：' + chosen.s + (chosen.src ? '（' + chosen.src + '）' : ''), point),
      dyn: true, sig: hashStr(point.id + '|quote|' + first)
    };
  }

  // 5. 推导节点理解型 (choice)：给 derive-flow 节点选其阐释的知识点（s3/s9 推导链型卡片）
  function genDeriveNode(point, ctx) {
    var nodes = extractDeriveNodes(point.content);
    if (nodes.length === 0) return null;
    var stem = pick(nodes).text;
    if (stem.length < 4) return null;
    if (leaksName(stem, point)) return null;
    if ((ctx.nodeCount[stem] || 1) > 1) return null;  // 跨卡重复跳过
    var distractors = pickDistractorNames(ctx, point, 3);
    if (!distractors) return null;
    var options = [point.name].concat(distractors);
    shuffle(options);
    return {
      type: 'choice', pointId: point.id, _gen: 'dnode',
      question: '下列推导节点主要阐释的中医学概念是？「' + stem + '」',
      options: options, answer: options.indexOf(point.name),
      explanation: withMnem('该推导节点阐释【' + point.name + '】。', point),
      dyn: true, sig: hashStr(point.id + '|dnode|' + stem.substring(0, 16))
    };
  }

  // 6. 推导步骤辨析型 (choice)：给四个 ds-title 选属于该知识点的
  function genDeriveStep(point, ctx) {
    var titles = extractDeriveTitles(point.content);
    if (titles.length === 0) return null;
    var correct = pick(titles);
    var myUnit = -1;
    for (var i = 0; i < ctx.points.length; i++) {
      if (ctx.points[i].point.id === point.id) { myUnit = ctx.points[i].unitIdx; break; }
    }
    var same = [], other = [];
    ctx.deriveTitlePool.forEach(function(s) {
      if (s.pointId === point.id) return;
      if (s.text === correct) return;
      if (point.name && s.text.indexOf(point.name) > -1) return;
      (s.unitIdx === myUnit ? same : other).push(s.text);
    });
    var pool = same.length >= 3 ? same : same.concat(other);
    var distractors = [];
    pool.forEach(function(t) { if (distractors.indexOf(t) === -1 && t !== correct) distractors.push(t); });
    if (distractors.length < 3) return null;
    shuffle(distractors);
    distractors = distractors.slice(0, 3);
    var options = [correct].concat(distractors);
    shuffle(options);
    return {
      type: 'choice', pointId: point.id, _gen: 'dstep',
      question: '关于【' + point.name + '】，下列哪项属于其推导步骤？',
      options: options, answer: options.indexOf(correct),
      explanation: withMnem('【' + point.name + '】的推导步骤包括：' + correct, point),
      dyn: true, sig: hashStr(point.id + '|dstep|' + correct.substring(0, 16))
    };
  }

  var GENERATORS = [genConcept, genQuoteDef, genSourceMatch, genQuoteMatch, genDeriveNode, genDeriveStep];

  function selectWeighted(cands, n, used, hist) {
    var wrongPids = getWrongPointIds();
    var weighted = [];
    cands.forEach(function(c) {
      if (used[c.sig]) return;
      var w = unitWeight(c._unitIdx) * dynWeight(hist && hist[c.sig]);
      if (wrongPids[c.pointId]) w *= 2;  // 错题本联动：未掌握错题的来源知识点加权
      if (w < 1) w = 1;
      for (var k = 0; k < w; k++) weighted.push(c);
    });
    shuffle(weighted);
    var out = [];
    for (var i = 0; i < weighted.length && out.length < n; i++) {
      if (used[weighted[i].sig]) continue;
      used[weighted[i].sig] = 1;
      out.push(weighted[i]);
    }
    return out;
  }

  function generate(selectedSubjects, count) {
    var byType = { concept: [], qdef: [], src: [], quote: [], dnode: [], dstep: [] };
    selectedSubjects.forEach(function(subject) {
      if (!ENABLED_SUBJECTS[subject.id]) return;
      // 除 s1/s9 外，其余科目偏实践应用、经典考点少，不产原文类题型（qdef/src/quote）
      var skipClassic = !(subject.id === 's1' || subject.id === 's9');
      var ctx = buildContext(subject);
      ctx.points.forEach(function(p) {
        GENERATORS.forEach(function(g) {
          if (skipClassic && (g === genQuoteDef || g === genSourceMatch || g === genQuoteMatch)) return;
          try {
            var q = g(p.point, ctx);
            if (q) { q._unitIdx = p.unitIdx; byType[q._gen].push(q); }
          } catch (e) {}
        });
      });
    });
    var mix = { concept: 0.25, qdef: 0.25, src: 0.20, quote: 0.10, dnode: 0.10, dstep: 0.10 };
    var used = {};
    var result = [];
    var hist = getDynHistory();  // 批次2：按做题记录降权
    Object.keys(mix).forEach(function(t) {
      result = result.concat(selectWeighted(byType[t], Math.round(count * mix[t]), used, hist));
    });
    if (result.length < count) {
      var rest = [];
      Object.keys(byType).forEach(function(t) { byType[t].forEach(function(q) { if (!used[q.sig]) rest.push(q); }); });
      result = result.concat(selectWeighted(rest, count - result.length, used, hist));
    }
    result = result.slice(0, count);
    result.forEach(function(q) { delete q._unitIdx; delete q._gen; });
    shuffle(result);
    return result;
  }

  window.DynQuiz = {
    version: 5,
    generate: generate,
    recordResult: recordResult,
    getHistory: getDynHistory,
    enable: function(sid) { ENABLED_SUBJECTS[sid] = true; },
    disable: function(sid) { delete ENABLED_SUBJECTS[sid]; },
    isEnabled: function(sid) { return !!ENABLED_SUBJECTS[sid]; }
  };
})();
