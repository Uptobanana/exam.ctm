// xgraph.js - 跨科知识图谱渲染层（纯 SVG，零依赖，离线可用）
// 依赖：xlink.js（提供 XLink.getSubgraph / _OUTBOUND / _INBOUND / _EXTRA_REL / findPoint）
// 暴露：window.XGraph.open(pointId)
(function () {
  var XGraph = window.XGraph = {};
  var SVGNS = 'http://www.w3.org/2000/svg';
  var SUBJECT_COLORS = {
    s1: '#8d6e63', s2: '#6d4c41', s3: '#2e7d32', s4: '#c62828', s5: '#1565c0',
    s6: '#00838f', s7: '#ad1457', s8: '#f9a825', s9: '#5e35b1'
  };
  var SUBJECT_NAMES = { s1: '中基', s2: '中诊', s3: '中药', s4: '方剂', s5: '内科', s6: '外科', s7: '妇科', s8: '儿科', s9: '针灸' };

  var overlay = null, svgEl = null, viewport = null, tip = null;
  var scale = 1, tx = 0, ty = 0;

  function el(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function trunc(s, n) { s = s || ''; return s.length > n ? s.slice(0, n) + '…' : s; }

  function injectStyles() {
    if (document.getElementById('xgraph-styles')) return;
    var css =
      '.xgraph-overlay{position:fixed;inset:0;z-index:200;background:rgba(40,30,20,.45);display:flex;align-items:center;justify-content:center}' +
      '.xgraph-panel{background:#fffdf8;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.3);width:min(860px,94vw);height:min(640px,92vh);display:flex;flex-direction:column;overflow:hidden}' +
      '.xgraph-head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #ece0cb;background:#fbf3e4}' +
      '.xgraph-title{font-size:1rem;font-weight:700;color:#5b3a29}' +
      '.xgraph-sub{font-size:.7rem;color:#a89060;margin-left:auto}' +
      '.xgraph-close{cursor:pointer;border:none;background:#efe3cd;color:#6b4a2e;border-radius:8px;width:30px;height:30px;font-size:1.1rem;line-height:1}' +
      '.xgraph-close:hover{background:#e3d2b0}' +
      '.xgraph-legend{display:flex;flex-wrap:wrap;gap:6px 14px;padding:8px 16px;font-size:.68rem;color:#6b4a2e;border-bottom:1px solid #f0e8dc}' +
      '.xgraph-legend span{display:inline-flex;align-items:center;gap:4px}' +
      '.xgraph-legend i{width:10px;height:10px;border-radius:50%;display:inline-block}' +
      '.xgraph-body{flex:1;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 45%,#fff 0%,#fbf4e8 100%)}' +
      '.xgraph-svg{width:100%;height:100%;display:block;cursor:grab}' +
      '.xgraph-svg.grabbing{cursor:grabbing}' +
      '.xg-node circle{cursor:pointer;transition:r .12s}' +
      '.xg-node:hover circle{r:28}' +
      '.xg-node text{pointer-events:none;text-anchor:middle}' +
      '.xg-edge{stroke:#bba77e;stroke-width:1.6}' +
      '.xg-edge.in{stroke-dasharray:5 4;stroke:#c9b48a}' +
      '.xg-tip{position:absolute;pointer-events:none;background:#3a2e15;color:#fff;padding:6px 9px;border-radius:7px;font-size:.7rem;max-width:240px;line-height:1.45;opacity:0;transition:opacity .1s;z-index:5}' +
      '.xg-tip.show{opacity:1}' +
      '.graph-btn{position:absolute;top:18px;right:60px;z-index:5;cursor:pointer;border:1px solid #e0cfa6;background:#fdf6e6;color:#7a5a30;border-radius:18px;padding:2px 11px;font-size:.74rem;line-height:1.7}' +
      '.graph-btn:hover{background:#f7e9c4}';
    var s = document.createElement('style'); s.id = 'xgraph-styles'; s.textContent = css; document.head.appendChild(s);
  }

  function legendHtml() {
    var h = '';
    for (var k in SUBJECT_COLORS) h += '<span><i style="background:' + SUBJECT_COLORS[k] + '"></i>' + (SUBJECT_NAMES[k] || k) + '</span>';
    return h + '<span><i style="background:#7a6a4a;border-radius:0"></i>实线=本点引用 虚线=被引用</span>';
  }

  function onKey(e) { if (e.key === 'Escape') close(); }
  function close() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null; svgEl = null; viewport = null; tip = null;
    document.removeEventListener('keydown', onKey);
  }

  XGraph.open = function (centerId) {
    injectStyles();
    if (!centerId || !(window.XLink && XLink.findPoint(centerId))) { alert('未找到该知识点，无法绘制图谱'); return; }
    scale = 1; tx = 0; ty = 0;
    if (!overlay) buildShell();
    if (!overlay.parentNode) document.body.appendChild(overlay);
    render(centerId);
    document.addEventListener('keydown', onKey);
  };

  function buildShell() {
    overlay = document.createElement('div'); overlay.className = 'xgraph-overlay';
    overlay.innerHTML =
      '<div class="xgraph-panel">' +
        '<div class="xgraph-head"><span class="xgraph-title">🕸 跨科知识图谱</span>' +
        '<span class="xgraph-sub">滚轮缩放 · 拖拽平移 · 点击节点切换中心</span>' +
        '<button class="xgraph-close" title="关闭">×</button></div>' +
        '<div class="xgraph-legend">' + legendHtml() + '</div>' +
        '<div class="xgraph-body"><div class="xg-tip"></div></div>' +
      '</div>';
    svgEl = el('svg', { 'class': 'xgraph-svg' });
    svgEl.setAttribute('viewBox', '0 0 760 520');
    viewport = el('g', { id: 'xg-viewport' });
    var defs = el('defs');
    [{ id: 'arrow-out', c: '#7a6a4a' }, { id: 'arrow-in', c: '#c9b48a' }].forEach(function (m) {
      var mk = el('marker', { id: m.id, markerWidth: 9, markerHeight: 9, refX: 7, refY: 3, orient: 'auto', markerUnits: 'userSpaceOnUse' });
      mk.appendChild(el('path', { d: 'M0,0 L7,3 L0,6 Z', fill: m.c }));
      defs.appendChild(mk);
    });
    svgEl.appendChild(defs);
    svgEl.appendChild(viewport);
    overlay.querySelector('.xgraph-body').insertBefore(svgEl, overlay.querySelector('.xg-tip'));
    tip = overlay.querySelector('.xg-tip');
    overlay.querySelector('.xgraph-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    bindPanZoom();
  }

  function applyTransform() {
    if (viewport) viewport.setAttribute('transform', 'translate(' + tx + ',' + ty + ') scale(' + scale + ')');
  }

  function render(centerId) {
    var sg = XLink.getSubgraph(centerId, 1, 30);
    var nodeMap = {};
    sg.nodes.forEach(function (n) { nodeMap[n.id] = n; });
    var cp = XLink.findPoint(centerId);
    if (cp && !nodeMap[centerId]) nodeMap[centerId] = { id: centerId, name: cp.point.name, sid: cp.subject.id, sname: cp.subject.name };
    if (!nodeMap[centerId]) return;

    var outSet = {}; (XLink._OUTBOUND[centerId] || []).forEach(function (t) { outSet[t] = true; });
    var neighbors = Object.keys(nodeMap).filter(function (id) { return id !== centerId; });
    neighbors.sort(function (a, b) {
      var ao = outSet[a] ? 1 : 0, bo = outSet[b] ? 1 : 0;
      if (ao !== bo) return bo - ao;
      return (nodeMap[a].name || '').localeCompare(nodeMap[b].name || '');
    });
    if (neighbors.length > 30) neighbors = neighbors.slice(0, 30);

    while (viewport.firstChild) viewport.removeChild(viewport.firstChild);
    applyTransform();

    var W = 760, H = 520, cx = W / 2, cy = H / 2;
    var n = neighbors.length;
    var R = Math.max(110, Math.min(210, 80 + n * 9));

    neighbors.forEach(function (id, i) {
      var ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
      var x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      var isOut = !!outSet[id];
      var color = SUBJECT_COLORS[nodeMap[id].sid] || '#999';
      var edge = el('line', { 'class': 'xg-edge' + (isOut ? '' : ' in'), x1: cx, y1: cy, x2: x, y2: y });
      edge.setAttribute('marker-end', isOut ? 'url(#arrow-out)' : 'url(#arrow-in)');
      viewport.appendChild(edge);

      var g = el('g', { 'class': 'xg-node' });
      g.appendChild(el('circle', { cx: x, cy: y, r: 24, fill: color, stroke: '#fff', 'stroke-width': 2 }));
      var label = el('text', { x: x, y: y + 4, 'font-size': 12, fill: '#3a2e15' });
      label.textContent = trunc(nodeMap[id].name, 6);
      g.appendChild(label);
      var sub = el('text', { x: x, y: y + 38, fill: '#8a7358', 'font-size': 10 });
      sub.textContent = nodeMap[id].sname || '';
      g.appendChild(sub);
      g.addEventListener('click', function () { XGraph.open(id); });
      g.addEventListener('mouseenter', function (e) { showTip(id); moveTip(e); });
      g.addEventListener('mousemove', moveTip);
      g.addEventListener('mouseleave', hideTip);
      viewport.appendChild(g);
    });

    if (n === 0) {
      var hint = el('text', { x: cx, y: cy + 95, fill: '#a09080', 'font-size': 13, 'text-anchor': 'middle' });
      hint.textContent = '该知识点暂无跨科引用链接（可在 concept-links.js 中补充关联）';
      viewport.appendChild(hint);
    }

    var cColor = SUBJECT_COLORS[nodeMap[centerId].sid] || '#5b3a29';
    var cg = el('g', { 'class': 'xg-node xg-center' });
    cg.appendChild(el('circle', { cx: cx, cy: cy, r: 30, fill: cColor, stroke: '#fff', 'stroke-width': 3 }));
    var cl = el('text', { x: cx, y: cy + 5, 'font-size': 13, fill: '#fff', 'font-weight': 700 });
    cl.textContent = trunc(nodeMap[centerId].name, 7);
    cg.appendChild(cl);
    var cs = el('text', { x: cx, y: cy + 48, fill: '#5b3a29', 'font-weight': 700, 'font-size': 11 });
    cs.textContent = (nodeMap[centerId].sname || '') + '·中心';
    cg.appendChild(cs);
    cg.addEventListener('mouseenter', function (e) { showTip(centerId); moveTip(e); });
    cg.addEventListener('mousemove', moveTip);
    cg.addEventListener('mouseleave', hideTip);
    viewport.appendChild(cg);

    var t = overlay.querySelector('.xgraph-title');
    if (t) t.textContent = '🕸 跨科图谱 · ' + nodeMap[centerId].sname + '「' + nodeMap[centerId].name + '」';
  }

  function showTip(id) {
    var pm = XLink.findPoint(id); if (!pm) return;
    var inDeg = (XLink._INBOUND[id] || []).length, outDeg = (XLink._OUTBOUND[id] || []).length;
    var html = '<strong>' + pm.subject.name + '</strong> · ' + pm.point.name + '<br>入度 ' + inDeg + ' · 出度 ' + outDeg;
    var rel = XLink._EXTRA_REL && XLink._EXTRA_REL[id];
    tip.innerHTML = html; tip.classList.add('show');
  }
  function moveTip(e) {
    if (!tip || !svgEl) return;
    var r = svgEl.getBoundingClientRect();
    tip.style.left = (e.clientX - r.left + 12) + 'px';
    tip.style.top = (e.clientY - r.top + 12) + 'px';
  }
  function hideTip() { if (tip) tip.classList.remove('show'); }

  function bindPanZoom() {
    var dragging = false, lx = 0, ly = 0;
    svgEl.addEventListener('wheel', function (e) {
      e.preventDefault();
      var f = e.deltaY < 0 ? 1.1 : 0.9;
      scale = Math.max(0.5, Math.min(3, scale * f));
      applyTransform();
    }, { passive: false });
    svgEl.addEventListener('mousedown', function (e) { dragging = true; lx = e.clientX; ly = e.clientY; svgEl.classList.add('grabbing'); });
    window.addEventListener('mouseup', function () { dragging = false; if (svgEl) svgEl.classList.remove('grabbing'); });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      tx += e.clientX - lx; ty += e.clientY - ly; lx = e.clientX; ly = e.clientY; applyTransform();
    });
  }
})();
