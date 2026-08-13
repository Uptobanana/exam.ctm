// xlink.js - 跨科联动检索模块（A搜索+B链接+C图谱的共享基础设施）
// 依赖：app.js 先加载（提供 window._SUBJECTS）；本文件在 app.js 之后加载
// 暴露：window.XLink = { init, findPoint, searchPoints, renderSearchResults, bindSearchInput, processContent, onShowCard, getNeighbors, getSubgraph }
(function () {
  var XLink = window.XLink = window.XLink || {};
  var POINT_MAP = {};
  var SEARCH_INDEX = [];
  var XLINK_NAMES = {};
  var NAMES_BY_ID = {};
  var OUTBOUND = {};
  var INBOUND = {};
  var MARKER_RE = /\[(zji|dx|zy|fj|nk|wk|fk|ek|zj)-[a-z0-9-]+\]/g;
  var TAG_RE = /<[^>]+>/g;

  function iterPoints(fn) {
    var subjects = window._SUBJECTS || [];
    for (var i = 0; i < subjects.length; i++) {
      var s = subjects[i];
      var units = s.units || [];
      for (var j = 0; j < units.length; j++) {
        var subs = units[j].subunits || [];
        for (var k = 0; k < subs.length; k++) {
          var pts = subs[k].points || [];
          for (var m = 0; m < pts.length; m++) fn(pts[m], s, units[j], subs[k]);
        }
      }
    }
  }

  function buildSearchIndex() {
    POINT_MAP = {}; SEARCH_INDEX = [];
    iterPoints(function (p, s, unit, sub) {
      if (!p || !p.id) return;
      POINT_MAP[p.id] = { point: p, subject: s };
      var path = (s.abbr || s.name || '') + ' · ' + (unit.unit || '') + ' · ' + (sub.name || '');
      var text = (p.content || '').replace(TAG_RE, '').replace(MARKER_RE, '');
      SEARCH_INDEX.push({ id: p.id, name: p.name || '', content: p.content || '', sid: s.id, sname: s.name, path: path, text: text });
    });
  }

  function buildXlinkNames() {
    XLINK_NAMES = {}; NAMES_BY_ID = {};
    iterPoints(function (p, s) {
      if (s.id !== 's4') return;
      if (!p.id || p.id.indexOf('fj-') !== 0) return;
      if (p.id.indexOf('fj-1-') === 0) return;
      var part = (p.name || '').split('的')[0];
      var cands = part.split('、');
      for (var i = 0; i < cands.length; i++) {
        var c = cands[i].trim();
        if (!c) continue;
        if (!XLINK_NAMES[c]) XLINK_NAMES[c] = p.id;
        if (!NAMES_BY_ID[p.id]) NAMES_BY_ID[p.id] = [];
        if (NAMES_BY_ID[p.id].indexOf(c) < 0) NAMES_BY_ID[p.id].push(c);
      }
    });
  }

  function buildMarkerIndex() {
    OUTBOUND = {}; INBOUND = {};
    iterPoints(function (p, s) {
      if (!p || !p.content || !p.id) return;
      var matches = p.content.match(MARKER_RE);
      if (!matches) return;
      for (var i = 0; i < matches.length; i++) {
        var inner = matches[i].slice(1, -1);
        if (!POINT_MAP[inner]) continue;
        if (!OUTBOUND[p.id]) OUTBOUND[p.id] = [];
        if (OUTBOUND[p.id].indexOf(inner) < 0) OUTBOUND[p.id].push(inner);
        if (!INBOUND[inner]) INBOUND[inner] = [];
        if (INBOUND[inner].indexOf(p.id) < 0) INBOUND[inner].push(p.id);
      }
    });
  }

  function injectStyles() {
    if (document.getElementById("xlink-styles")) return;
    var css = ".search-wrap{position:sticky;top:0;z-index:30;background:#fff!important;border-bottom:1px solid #f0e8dc;padding:8px 10px 6px!important}" +
      ".sr-group{margin-bottom:6px}" +
      ".sr-group-title{font-size:.8rem;color:#5b3a29;font-weight:600;padding:6px 8px;cursor:pointer;border-radius:5px;background:#f5ede0;border:1px solid #e8dcc4;display:flex;align-items:center;gap:5px;user-select:none}" +
      ".sr-group-title:hover{background:#ede0cc}" +
      ".sr-group-title::before{content:'▸';color:#c9a87c;font-size:.7rem;display:inline-block}" +
      ".sr-group.open .sr-group-title::before{content:'▾'}" +
      ".sr-group-items{display:none!important;padding:2px 0 4px}" +
      ".sr-group.open .sr-group-items{display:block!important}" +
      ".sr-cnt{color:#a89060;font-weight:400;font-size:.7rem;margin-left:auto;background:#fff;border:1px solid #e8dcc4;border-radius:8px;padding:0 6px}" +
      ".sr-item{display:block;padding:8px 10px;border-radius:8px;cursor:pointer;background:#faf7f0;border:1px solid #e8dcc4;margin-bottom:4px;transition:all .15s;text-decoration:none}" +
      ".sr-item:hover{background:#fdf3d8;border-color:#d4a84b;box-shadow:0 1px 3px rgba(0,0,0,.08)}" +
      ".sr-item-name{font-size:.84rem;color:#3a2e15;font-weight:500}" +
      ".sr-item-path{font-size:.68rem;color:#a09080;margin-top:2px}" +
      ".sr-tier-label{font-size:.66rem;color:#b8860b;font-weight:600;padding:5px 2px 3px;letter-spacing:1px}" +
      ".sr-item-mention{opacity:.72;background:#f5f2ea}" +
      ".sr-more{font-size:.7rem;color:#b8860b;cursor:pointer;padding:4px 8px;text-align:center;border:1px dashed #ecd99e;border-radius:6px;margin:3px 0;background:#fdf8ec}" +
      ".sr-more:hover{background:#f5e3a8}";
    var s = document.createElement("style");
    s.id = "xlink-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }
  XLink.init = function () {
    try {
      buildSearchIndex();
      buildXlinkNames();
      buildMarkerIndex();
      var outCnt = 0, inCnt = 0;
      for (var k in OUTBOUND) outCnt += OUTBOUND[k].length;
      for (var j in INBOUND) inCnt += INBOUND[j].length;
      console.log('[XLink] 索引构建完成: 知识点' + SEARCH_INDEX.length + ', 方剂名' + Object.keys(XLINK_NAMES).length + ', 出站边' + outCnt + ', 入站边' + inCnt);
      XLink._POINT_MAP = POINT_MAP; XLink._SEARCH_INDEX = SEARCH_INDEX;
      XLink._XLINK_NAMES = XLINK_NAMES; XLink._NAMES_BY_ID = NAMES_BY_ID;
      XLink._OUTBOUND = OUTBOUND; XLink._INBOUND = INBOUND;
      injectStyles();
      XLink.bindSearchInput();
      XLink.bindXLinkClicks();
    } catch (e) { console.error('[XLink] init失败:', e); }
  };

  XLink.findPoint = function (id) { return POINT_MAP[id] || null; };

  XLink.getNeighbors = function (id) {
    return { inbound: INBOUND[id] ? INBOUND[id].slice() : [], outbound: OUTBOUND[id] ? OUTBOUND[id].slice() : [] };
  };
  XLink.getSubgraph = function (centerId, depth, cap) {
    depth = depth || 1; cap = cap || 30;
    var nodeSet = {}; var edges = [];
    var queue = [{ id: centerId, d: 0 }];
    nodeSet[centerId] = true;
    while (queue.length) {
      var cur = queue.shift();
      if (cur.d >= depth) continue;
      var nb = XLink.getNeighbors(cur.id);
      var all = nb.inbound.concat(nb.outbound);
      for (var i = 0; i < all.length; i++) {
        var t = all[i];
        edges.push({ from: cur.id, to: t });
        if (!nodeSet[t] && POINT_MAP[t]) { nodeSet[t] = true; queue.push({ id: t, d: cur.d + 1 }); }
        if (edges.length >= cap * 6) break;
      }
      if (edges.length >= cap * 6) break;
    }
    var nodeList = Object.keys(nodeSet).map(function (id) {
      var pm = POINT_MAP[id];
      return pm ? { id: id, name: pm.point.name, sid: pm.subject.id, sname: pm.subject.name } : { id: id };
    });
    return { nodes: nodeList, edges: edges };
  };

  XLink.searchPoints = function (kw) {
    kw = (kw || '').trim().toLowerCase();
    if (!kw) return { groups: [], total: 0, related: [] };
    var groups = {};
    for (var i = 0; i < SEARCH_INDEX.length; i++) {
      var p = SEARCH_INDEX[i];
      var nameL = (p.name || '').toLowerCase();
      var textL = (p.text || '').toLowerCase();
      var inName = nameL.indexOf(kw) >= 0;
      var inText = textL.indexOf(kw) >= 0;
      if (!inName && !inText) continue;
      // 相关性评分(方案A): 名称>标记target>高频>低频, 举例上下文降权
      var score = inName ? 100 : 0;
      var cnt = 0, lastIdx = -1;
      for (var idx0 = 0; (idx0 = textL.indexOf(kw, idx0)) >= 0; idx0 += kw.length) { cnt++; lastIdx = idx0; }
      // 标记target: 该知识点content中kw是跨科标记引用(如 麻黄[zy-5-1])
      var isMarker = textL.indexOf(kw + '[') >= 0;
      if (!inName) {
        if (isMarker) score = 80;                 // 真药材引用(麻黄[zy-...])
        else if (cnt >= 3) score = 60;            // 高频提及
        else if (cnt >= 2) score = 40;            // 中频
        else score = 20;                          // 低频提及(可能举例)
      }
      // 举例上下文降权: 如"如麻黄"/"麻黄等"/"例如麻黄"
      var textForEx = textL;
      var exLike = /(如|例如|比如|譬如)[^。；，]{0,4}/g; var isEx = false;
      if (lastIdx >= 0) {
        var ctx = textForEx.slice(Math.max(0, lastIdx - 6), lastIdx);
        if (/[如例比]/.test(ctx)) isEx = true;
      }
      if (isEx && !inName && !isMarker && cnt < 3) score = Math.max(score, 10) - 5;
      var tier = (inName || isMarker) ? 'precise' : 'mention';   // 精准/提及分层
      var snippet = '';
      if (inText) {
        var idxs = lastIdx >= 0 ? lastIdx : textL.indexOf(kw);
        var s = Math.max(0, idxs - 30), e = Math.min(textL.length, idxs + kw.length + 30);
        snippet = (s > 0 ? '…' : '') + p.text.slice(s, e) + (e < textL.length ? '…' : '');
      }
      if (!groups[p.sid]) groups[p.sid] = { sid: p.sid, sname: p.sname, items: [], precise: 0, mention: 0 };
      var g = groups[p.sid];
      g.items.push({ id: p.id, name: p.name, path: p.path, snippet: snippet, score: score, tier: tier, cnt: cnt });
      if (tier === 'precise') g.precise++; else g.mention++;
    }
    var groupArr = [];
    for (var sid in groups) {
      groups[sid].items.sort(function (a, b) { return (a.tier===b.tier?0:(a.tier==='precise'?-1:1)) || (b.score - a.score) || (a.name || '').localeCompare(b.name || ''); });
      groupArr.push(groups[sid]);
    }
    groupArr.sort(function (a, b) { return b.items.length - a.items.length; });
    var related = [];
    for (var nm in XLINK_NAMES) {
      if (nm.toLowerCase().indexOf(kw) >= 0) {
        var fid = XLINK_NAMES[nm];
        related.push({ name: nm, targetId: fid, refCount: (INBOUND[fid] || []).length });
      }
    }
    var total = 0;
    groupArr.forEach(function (g) { total += g.items.length; });
    return { groups: groupArr, total: total, related: related };
  };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function renderItem(it, kw) {
    return '<div class="sr-item' + (it.tier === 'mention' ? ' sr-item-mention' : '') + '" data-id="' + esc(it.id) + '">' +
      '<div class="sr-item-name">' + hl(it.name, kw) + '</div>' +
      '<div class="sr-item-path">' + esc(it.path) + '</div>' +
      '</div>';
  }
  function hl(s, kw) {
    s = esc(s);
    if (!kw) return s;
    var kwe = esc(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return s.replace(new RegExp(kwe, 'gi'), function (m) { return '<mark>' + m + '</mark>'; });
  }

  XLink.renderSearchResults = function (kw) {
    var tree = document.getElementById('tree');
    var sr = document.getElementById('searchResults');
    if (!sr) return;
    if (tree) tree.style.display = 'none';
    sr.style.display = 'block';
    var res = XLink.searchPoints(kw);
    var html = '';
    if (res.groups.length === 0) {
      html = '<div class="sr-empty">未找到与"' + esc(kw) + '"相关的知识点</div>';
    } else {
      html += '<div class="sr-summary">找到 ' + res.total + ' 个结果 · ' + res.groups.length + ' 个科目</div>';
      if (res.related && res.related.length) {
        html += '<div class="sr-related">';
        res.related.slice(0, 5).forEach(function (r) {
          html += '<span class="sr-related-tag" data-rid="' + esc(r.targetId) + '">' + hl(r.name, kw) + '（跨科引用' + r.refCount + '）</span>';
        });
        html += '</div>';
      }
      res.groups.forEach(function (g, gi) {
        html += '<div class="sr-group' + (gi === 0 ? ' open' : '') + '"><div class="sr-group-title">' + esc(g.sname) + ' <span class="sr-cnt">' + g.items.length + '</span></div><div class="sr-group-items">';
        var precises = [], mentions = [];
        g.items.forEach(function (it) { (it.tier === 'precise' ? precises : mentions).push(it); });
        if (precises.length) {
          html += '<div class="sr-tier-label">精准命中</div>';
          precises.forEach(function (it) { html += renderItem(it, kw); });
        }
        if (mentions.length) {
          html += '<div class="sr-tier-label">提及</div>';
          var MAX_MENTION = 5;
          mentions.slice(0, MAX_MENTION).forEach(function (it) { html += renderItem(it, kw); });
          if (mentions.length > MAX_MENTION) {
            html += '<div class="sr-more" data-more="' + gi + '" data-cnt="' + (mentions.length - MAX_MENTION) + '">还有 ' + (mentions.length - MAX_MENTION) + ' 条提及…</div>';
            html += '<div class="sr-more-items" id="srm-' + gi + '" style="display:none">';
            mentions.slice(MAX_MENTION).forEach(function (it) { html += renderItem(it, kw); });
            html += '</div>';
          }
        }
        html += '</div></div>';
      });
    }
    sr.innerHTML = html;
    var nodes = sr.querySelectorAll('.sr-item');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        if (window.showCard) window.showCard(id);
        XLink._restoreTree();
        var box = document.getElementById('searchBox'); if (box) box.value = '';
      });
    }
    var titles = sr.querySelectorAll('.sr-group-title');
    for (var ti = 0; ti < titles.length; ti++) {
      titles[ti].addEventListener('click', function () {
        var grp = this.parentNode;
        if (grp) grp.classList.toggle('open');
      });
    }
    var mores = sr.querySelectorAll('.sr-more');
    for (var mi = 0; mi < mores.length; mi++) {
      mores[mi].addEventListener('click', function () {
        var gidx = this.getAttribute('data-more');
        var boxEl = document.getElementById('srm-' + gidx);
        if (boxEl) { var hid = boxEl.style.display === 'none'; boxEl.style.display = hid ? 'block' : 'none'; this.textContent = hid ? '收起提及…' : '还有 ' + (parseInt(this.getAttribute('data-cnt')||'0',10)) + ' 条提及…'; }
      });
    }
    var rtags = sr.querySelectorAll('.sr-related-tag');
    for (var j = 0; j < rtags.length; j++) {
      rtags[j].addEventListener('click', function () {
        var rid = this.getAttribute('data-rid');
        if (window.showCard) window.showCard(rid);
        XLink._restoreTree();
        var box = document.getElementById('searchBox'); if (box) box.value = '';
      });
    }
  };

  XLink._restoreTree = function () {
    var tree = document.getElementById('tree');
    var sr = document.getElementById('searchResults');
    if (tree) tree.style.display = '';
    if (sr) { sr.style.display = 'none'; sr.innerHTML = ''; }
  };

  XLink.bindSearchInput = function () {
    var box = document.getElementById('searchBox');
    if (!box) return;
    box.addEventListener('input', function () {
      var v = box.value;
      if (v && v.trim()) XLink.renderSearchResults(v);
      else XLink._restoreTree();
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) { box.value = ''; XLink._restoreTree(); box.blur(); }
    });
  };

  XLink.processContent = function (html, id) {
    if (!html) return html;
    var RE = /([\u4e00-\u9fa5]*)\[((?:zji|dx|zy|fj|nk|wk|fk|ek|zj)-[a-z0-9-]+)\]/g;
    var result = '';
    var lastEnd = 0;
    var m;
    while ((m = RE.exec(html)) !== null) {
      result += html.substring(lastEnd, m.index);
      var preCh = m[1], inner = m[2];
      lastEnd = m.index + m[0].length;
      if (!POINT_MAP[inner]) { result += m[0]; continue; }
      var prefix = preCh, name = '';
      var names = NAMES_BY_ID[inner];
      if (names && names.length) {
        var best = '';
        for (var i = 0; i < names.length; i++) {
          var n = names[i];
          if (n.length > best.length && preCh.length >= n.length && preCh.slice(preCh.length - n.length) === n) best = n;
        }
        if (best) { name = best; prefix = preCh.slice(0, preCh.length - best.length); }
      } else if (preCh) {
        name = preCh; prefix = '';
      }
      var ls = '<a class="xlink" style="color:#b8860b;font-weight:600;text-decoration:underline;background:#fff8e1;padding:0 2px;border-radius:2px;cursor:pointer" data-xid="' + inner + '">';
      var le = '</a>';
      if (name) { result += prefix + ls + esc(name) + le; continue; }
      if (preCh && preCh.length >= 2) { result += ls + esc(preCh) + le; continue; }
      // preCh为空: 用html+m.index回溯找</xx>前的中文(如 </strong>小青龙汤[标记])
      if (!preCh) {
        var before = html.substring(Math.max(0, m.index - 40), m.index);
        // 先找最后的</标签>, 取标签前的中文
        var closeTag = before.lastIndexOf('</');
        if (closeTag >= 0) {
          var beforeTag = before.substring(0, closeTag);
          // 从beforeTag末尾往前找>或非中文, 取最后的连续中文段
          var cn = '';
          for (var ci = beforeTag.length - 1; ci >= 0; ci--) {
            var cc = beforeTag.charCodeAt(ci);
            if (cc >= 0x4e00 && cc <= 0x9fa5) { cn = beforeTag.charAt(ci) + cn; }
            else break;
          }
          if (cn.length >= 2) { result += ls + esc(cn) + le; continue; }
        }
      }
      result += ls + '[' + inner + ']' + le;
    }
    result += html.substring(lastEnd);
    return result;
  };

  XLink.bindXLinkClicks = function () {
    var mc = document.getElementById('mainContent');
    if (!mc || mc._xlinkBound) return;
    mc._xlinkBound = true;
    mc.addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== mc) {
        if (el.classList && el.classList.contains('xlink')) {
          var xid = el.getAttribute('data-xid');
          if (xid && window.showCard) window.showCard(xid);
          return;
        }
        el = el.parentNode;
      }
    });
  };

  var navHistory = [];
  XLink.onShowCard = function (id) {
    var pm = POINT_MAP[id];
    if (!pm) { renderBreadcrumb(); return; }
    var nm = pm.point.name || '';
    if (nm.length > 10) nm = nm.slice(0, 10) + '…';
    var label = (pm.subject.abbr || pm.subject.name || '') + '·' + nm;
    if (navHistory.length === 0 || navHistory[navHistory.length - 1].id !== id) {
      navHistory.push({ id: id, label: label });
      if (navHistory.length > 12) navHistory.shift();
    }
    renderBreadcrumb();
  };
  function renderBreadcrumb() {
    var mc = document.getElementById('mainContent');
    if (!mc) return;
    var old = mc.querySelector('.nav-breadcrumb');
    if (old) old.remove();
    if (navHistory.length < 2) return;
    var html = '<div class="nav-breadcrumb"><button class="nav-back" title="返回上一知识点">← 返回</button>';
    var start = Math.max(0, navHistory.length - 6);
    if (start > 0) html += '<span class="nav-ellipsis">…</span>';
    for (var i = start; i < navHistory.length; i++) {
      if (i > start) html += '<span class="nav-sep">›</span>';
      var isLast = (i === navHistory.length - 1);
      html += '<span class="nav-crumb' + (isLast ? ' current' : '') + '" data-idx="' + i + '">' + esc(navHistory[i].label) + '</span>';
    }
    html += '</div>';
    mc.insertAdjacentHTML('afterbegin', html);
    var back = mc.querySelector('.nav-back');
    if (back) back.addEventListener('click', function () { XLink._goBack(); });
    var crumbs = mc.querySelectorAll('.nav-crumb');
    for (var j = 0; j < crumbs.length; j++) {
      crumbs[j].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        XLink._jumpTo(idx);
      });
    }
  }
  XLink._goBack = function () {
    if (navHistory.length < 2) return;
    navHistory.pop();
    var prev = navHistory[navHistory.length - 1];
    if (prev && window.showCard) window.showCard(prev.id);
  };
  XLink._jumpTo = function (idx) {
    if (idx < 0 || idx >= navHistory.length) return;
    navHistory.length = idx + 1;
    var target = navHistory[navHistory.length - 1];
    if (target && window.showCard) window.showCard(target.id);
  };
  XLink._navHistory = navHistory;
})();
