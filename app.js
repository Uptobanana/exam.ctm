// ============================================================
// app.js — 传统医学出师考核 · 核心框架
// 通过全局变量从各科目文件读取数据：
//   window.SUBJECTS = [S1, S2, ..., S9]
//   window.QUESTION_BANK = [...]
// 各科目文件定义 SUBJECT_DATA_n 和 SUBJECT_QUESTIONS_n，
// 本文件在加载完成后从 window 聚合。
// 修改注意：showCard() 内 renderCardQuiz(p) 只出现一次，无 script 注入。
// ============================================================

(function() {
'use strict';

// ---- Wait for all subject files to load ----
// Subject files push to these arrays; we read them at the end.
window._SUBJECTS = [];
window._QUESTIONS = [];

// Exposed to global scope for subject files (which load before IIFE runs)
window.registerSubject = function(s) { window._SUBJECTS.push(s); };
window.registerQuestions = function(qs) { var clean = []; for (var i = 0; i < qs.length; i++) { if (qs[i] != null) clean.push(qs[i]); } window._QUESTIONS.push.apply(window._QUESTIONS, clean); };

// ---- Constants ----
const tagLabels = {concept:'概念',detail:'内容',apply:'应用',compare:'辨析'};
const cardClasses = {concept:'card-concept',detail:'card-detail',apply:'card-apply',compare:'card-compare'};
const typeBadgeLabels = {concept:'概念型',detail:'内容型',apply:'应用型',compare:'辨析型'};

// ---- State ----
let savedState = JSON.parse(localStorage.getItem('syllabus_v4') || '{}');
let favs = JSON.parse(localStorage.getItem('syllabus_v4_favs') || '[]');
let quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
let learnedPoints = new Set(JSON.parse(localStorage.getItem('syllabus_v4_learned') || '[]'));
let currentQuiz = [];
let quizAnswered = {};
let selectedOptions = {};
let currentTab = 'study';
let allExpanded = false;
let selectedSubjIds = [];
let quizCount = 60;

// ---- Quiz session persistence (save/resume) ----
function saveQuizSession() {
  if (currentQuiz.length === 0) return;
  var session = {
    currentQuiz: currentQuiz,
    quizAnswered: quizAnswered,
    selectedOptions: selectedOptions,
    selectedSubjIds: selectedSubjIds,
    quizCount: quizCount
  };
  localStorage.setItem('syllabus_v4_quiz_session', JSON.stringify(session));
}

function clearQuizSession() {
  localStorage.removeItem('syllabus_v4_quiz_session');
}

function loadQuizSession() {
  var raw = localStorage.getItem('syllabus_v4_quiz_session');
  if (!raw) return false;
  try {
    var session = JSON.parse(raw);
    if (!session.currentQuiz || session.currentQuiz.length === 0) return false;
    currentQuiz = session.currentQuiz;
    quizAnswered = session.quizAnswered || {};
    selectedOptions = session.selectedOptions || {};
    selectedSubjIds = session.selectedSubjIds || [];
    quizCount = session.quizCount || 60;
    return true;
  } catch(e) { return false; }
}

function save() {
  localStorage.setItem('syllabus_v4', JSON.stringify(savedState));
  localStorage.setItem('syllabus_v4_favs', JSON.stringify(favs));
  localStorage.setItem('quizHistory', JSON.stringify(quizHistory.slice(0,200)));
  localStorage.setItem('syllabus_v4_learned', JSON.stringify([...learnedPoints]));
  updateBadges();
  updateProgress();
}

// ---- DOM refs ----
const tree = document.getElementById('tree');
const mainContent = document.getElementById('mainContent');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
let subjects = [];
let questionBank = [];

// ---- Init after all scripts loaded ----
window.addEventListener('DOMContentLoaded', function() {
  // 一次性迁移：syllabus_v4_qh → quizHistory
  (function() {
    var old = localStorage.getItem('syllabus_v4_qh');
    if (old && !localStorage.getItem('quizHistory')) {
      localStorage.setItem('quizHistory', old);
    }
  })();
  // Small delay to ensure all subject scripts have run
  setTimeout(function() {
    subjects = window._SUBJECTS;
    questionBank = window._QUESTIONS;

    // Compute point IDs per subject
    subjects.forEach(function(s) { s.points = []; });
    subjects.forEach(function(s) {
      s.units.forEach(function(u) {
        u.subunits.forEach(function(sub) {
          sub.points.forEach(function(p) {
            s.points.push(p.id);
          });
        });
      });
    });

    selectedSubjIds = subjects.map(function(s) { return s.id; });

    updateBadges();
    renderTree();

    var lastTab = savedState['lastTab'];
    if (lastTab === 'quiz') switchTab('quiz');
    else if (lastTab === 'favs') switchTab('favs');
    else {
      switchTab('study');
      var activeId = savedState['activePoint'];
      if (activeId) showCard(activeId);
    }

    window.addEventListener('beforeunload', function() {
      savedState['lastTab'] = currentTab;
      save();
    });
    if (window.XLink) XLink.init();  // 跨科联动检索索引（xlink.js）
    window.showCard = showCard;  // 暴露给xlink.js(A搜索结果点击/B链接跳转调用)
    updateProgress();
  }, 50);
});

// ---- Helpers ----
var totalPoints = 0;
function getTotalPoints() {
  if (totalPoints === 0) {
    totalPoints = subjects.reduce(function(sum, s) { return sum + s.points.length; }, 0);
  }
  return totalPoints;
}

function findPoint(id) {
  for (var i = 0; i < subjects.length; i++) {
    var subj = subjects[i];
    for (var j = 0; j < subj.units.length; j++) {
      var unit = subj.units[j];
      for (var k = 0; k < unit.subunits.length; k++) {
        var sub = unit.subunits[k];
        for (var m = 0; m < sub.points.length; m++) {
          if (sub.points[m].id === id) return {point: sub.points[m], subject: subj};
        }
      }
    }
  }
  return null;
}

function getPointPath(id) {
  for (var i = 0; i < subjects.length; i++) {
    var subj = subjects[i];
    for (var j = 0; j < subj.units.length; j++) {
      var unit = subj.units[j];
      for (var k = 0; k < unit.subunits.length; k++) {
        var sub = unit.subunits[k];
        for (var m = 0; m < sub.points.length; m++) {
          if (sub.points[m].id === id) return subj.abbr + ' · ' + unit.unit + ' · ' + sub.name;
        }
      }
    }
  }
  return '';
}

// ---- Progress ----
function updateProgress() {
  var total = getTotalPoints();
  var learned = learnedPoints.size;
  var pct = total > 0 ? Math.round(learned / total * 100) : 0;
  document.getElementById('progressPercent').textContent = pct + '%';
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = '整体学习进度（' + learned + '/' + total + '）';

  subjects.forEach(function(s) {
    var sp = s.points.filter(function(id) { return learnedPoints.has(id); }).length;
    var spct = s.points.length > 0 ? Math.round(sp / s.points.length * 100) : 0;
    var el = document.querySelector('.tree-subject[data-sid="' + s.id + '"] .subj-progress');
    if (el) el.textContent = spct + '%';
  });
}

function updateBadges() {
  document.getElementById('favTabBadge').textContent = favs.length;
}

// ---- v2 perf 数据管理 ----
function getPerf() {
  return JSON.parse(localStorage.getItem('perf') || '{}');
}
function savePerf(pointId, correct) {
  var p = getPerf();
  if (!p[pointId]) p[pointId] = { total: 0, correct: 0 };
  p[pointId].total++;
  if (correct) p[pointId].correct++;
  p[pointId].lastCorrect = correct;
  p[pointId].lastSeen = Date.now();
  localStorage.setItem('perf', JSON.stringify(p));
}
// ---- 错题本（批次3）----
function getWrongBook() {
  try { return JSON.parse(localStorage.getItem('wrongBook') || '[]'); }
  catch (e) { return []; }
}
function saveWrongBook(wb) {
  try {
    if (wb.length > 500) wb = wb.slice(0, 500);
    localStorage.setItem('wrongBook', JSON.stringify(wb));
  } catch (e) {}
}
function wrongSig(q) {
  if (q.sig) return q.sig;
  var s = (q.pointId || '') + '|' + (q.type || '') + '|' + (q.question || '');
  var h = 5381;
  for (var i = 0; i < s.length; i++) { h = ((h << 5) + h) + s.charCodeAt(i); h = h & 0xffffffff; }
  return (h >>> 0).toString(36);
}
function getAccuracy(pointId) {
  var p = getPerf();
  return p[pointId] ? p[pointId].correct / p[pointId].total : null;
}
function perfBySubject() {
  var p = getPerf(), result = {};
  for (var pid in p) {
    if (!p.hasOwnProperty(pid)) continue;
    var found = findPoint(pid);
    var key = found ? found.subject.id : '_unknown';
    if (!result[key]) result[key] = { total: 0, correct: 0, count: 0 };
    result[key].total += p[pid].total;
    result[key].correct += p[pid].correct;
    result[key].count++;
  }
  return result;
}
function perfByUnit() {
  var p = getPerf(), result = {};
  for (var pid in p) {
    if (!p.hasOwnProperty(pid)) continue;
    var found = findPoint(pid);
    var key = found ? found.subject.id + '|' + found.point.id : '_unknown';
    if (!result[key]) result[key] = { total: 0, correct: 0, count: 0, sid: found ? found.subject.id : '', pid: pid };
    result[key].total += p[pid].total;
    result[key].correct += p[pid].correct;
    result[key].count++;
  }
  return result;
}

function getQuizLabel(pointId) {
  var p = getPerf();
  var data = pointId ? p[pointId] : null;
  if (!data || data.total === 0) return '<span class="qlabel qlabel-new">⭐ 新题</span>';
  var rate = data.correct / data.total;
  if (rate < 0.5) return '<span class="qlabel qlabel-review">🔄 重点复习</span>';
  if (rate >= 0.8 && data.total >= 3) return '<span class="qlabel qlabel-mastered">✅ 掌握</span>';
  return '';
}

function jumpToUnit(sid, ui) {
  var s = subjects.find(function(x) { return x.id === sid; });
  if (!s || !s.units[ui]) return false;
  var unit = s.units[ui];
  if (unit.subunits.length > 0 && unit.subunits[0].points.length > 0) {
    var pid = unit.subunits[0].points[0].id;
    switchTab('study');
    showCard(pid);
    highlightTreePoint(pid);
    return true;
  }
  return false;
}

// ---- Tree Rendering ----
function renderTree() {
  tree.innerHTML = subjects.map(function(subj) {
    var sOpen = savedState['subj_' + subj.id] !== false;
    var sp = subj.points.filter(function(id) { return learnedPoints.has(id); }).length;
    var spct = subj.points.length > 0 ? Math.round(sp / subj.points.length * 100) : 0;
    return '<div class="tree-subject ' + (sOpen?'open':'') + '" data-sid="' + subj.id + '" data-action="toggleSubject">' +
      '<div class="subj-left"><span class="arrow">▶</span> ' + subj.name + '</div>' +
      '<span class="subj-progress">' + spct + '%</span></div>' +
      '<div class="tree-unit-children ' + (sOpen?'show':'') + '" data-sid="' + subj.id + '">' +
        subj.units.map(function(unit, ui) {
          var uKey = subj.id + '_u' + ui;
          var uOpen = savedState[uKey] !== false;
          return '<div class="tree-unit ' + (uOpen?'open':'') + '" data-action="toggleUnit" data-sid="' + subj.id + '" data-ui="' + ui + '">' +
            '<span class="arrow">▶</span> ' + unit.unit + '</div>' +
            '<div class="tree-sub-children ' + (uOpen?'show':'') + '" data-sid="' + subj.id + '" data-ui="' + ui + '">' +
              unit.subunits.map(function(sub, si) {
                var sKey = subj.id + '_u' + ui + '_s' + si;
                var sOpen = savedState[sKey] !== false;
                return '<div class="tree-subunit ' + (sOpen?'open':'') + '" data-action="toggleSub" data-sid="' + subj.id + '" data-ui="' + ui + '" data-si="' + si + '">' +
                  '<span class="arrow">▶</span> ' + sub.name + '</div>' +
                  '<div class="tree-point-children ' + (sOpen?'show':'') + '">' +
                    sub.points.map(function(p) {
                      var learned = learnedPoints.has(p.id);
                      return '<a class="tree-point' + (learned?' learned':'') + '" data-id="' + p.id + '" data-type="' + p.type + '">' +
                        p.name + '<span class="tag tag-' + p.type + '">' + (tagLabels[p.type]||'') + '</span></a>';
                    }).join('') +
                  '</div>';
              }).join('') +
            '</div>';
        }).join('') +
      '</div>';
  }).join('');
  bindTreeEvents();
}

function bindTreeEvents() {
  function toggleEl(el) {
    el.classList.toggle('open');
    var child = el.nextElementSibling;
    if (child) child.classList.toggle('show');
  }
  tree.querySelectorAll('[data-action="toggleSubject"]').forEach(function(el) {
    el.addEventListener('click', function() {
      toggleEl(el);
      savedState['subj_' + el.dataset.sid] = el.nextElementSibling.classList.contains('show');
      save();
    });
  });
  tree.querySelectorAll('[data-action="toggleUnit"]').forEach(function(el) {
    el.addEventListener('click', function() {
      toggleEl(el);
      savedState[el.dataset.sid + '_u' + el.dataset.ui] = el.nextElementSibling.classList.contains('show');
      save();
    });
  });
  tree.querySelectorAll('[data-action="toggleSub"]').forEach(function(el) {
    el.addEventListener('click', function() {
      toggleEl(el);
      savedState[el.dataset.sid + '_u' + el.dataset.ui + '_s' + el.dataset.si] = el.nextElementSibling.classList.contains('show');
      save();
    });
  });
  tree.querySelectorAll('.tree-point').forEach(function(el) {
    el.addEventListener('click', function() {
      showCard(el.dataset.id);
      tree.querySelectorAll('.tree-point').forEach(function(p) { p.classList.remove('active'); });
      el.classList.add('active');
      sidebar.classList.remove('visible');
      overlay.classList.remove('show');
      switchTab('study');
    });
  });
  document.getElementById('expandAll').addEventListener('click', function() {
    allExpanded = !allExpanded;
    document.getElementById('expandAll').textContent = allExpanded ? '折叠全部' : '展开全部';
    tree.querySelectorAll('.tree-subject, .tree-unit, .tree-subunit').forEach(function(el) {
      if (allExpanded) el.classList.add('open'); else el.classList.remove('open');
    });
    tree.querySelectorAll('.tree-unit-children, .tree-sub-children, .tree-point-children').forEach(function(el) {
      if (allExpanded) el.classList.add('show'); else el.classList.remove('show');
    });
    subjects.forEach(function(subj) {
      savedState['subj_' + subj.id] = allExpanded;
      subj.units.forEach(function(unit, ui) {
        savedState[subj.id + '_u' + ui] = allExpanded;
        unit.subunits.forEach(function(sub, si) {
          savedState[subj.id + '_u' + ui + '_s' + si] = allExpanded;
        });
      });
    });
    save();
  });
}

// ---- Card Rendering ----
function showCard(id) {
  var result = findPoint(id);
  if (!result) {
    mainContent.innerHTML = '<div class="empty-state"><div class="icon">❓</div><p>未找到该知识点</p></div>';
    return;
  }
  var p = result.point;
  var isFaved = favs.indexOf(p.id) > -1;

  learnedPoints.add(p.id);
  updateStudyProgress('read', p.id);
  renderTree();
  highlightTreePoint(id);
  var activeEl = tree.querySelector('.tree-point[data-id="' + id + '"]');
  if (activeEl) { try { activeEl.scrollIntoView({block:'nearest'}); } catch(e){} }

  var cls = p.content ? cardClasses[p.type] || 'card-detail' : 'card-detail';
  mainContent.innerHTML =
    '<div class="card ' + cls + '" id="card-' + p.id + '">' +
      '<button class="fav-btn' + (isFaved?' faved':'') + '" data-favid="' + p.id + '" aria-label="收藏">' + (isFaved?'❤':'🤍') + '</button>' +
      '<span class="type-badge">' + (p.content ? typeBadgeLabels[p.type] || '' : '待完善') + '</span>' +
      '<button class="graph-btn" data-graphid="' + p.id + '" title="查看跨科知识图谱">🕸 图谱</button>' +
      '<h3>' + p.name + '</h3>' +
      '<div class="breadcrumb">' + getPointPath(p.id) + '</div>' +
      '<div class="content">' + (window.XLink && p.content ? XLink.processContent(p.content, p.id) : (p.content || '<p style="color:#a09080">该知识点的详细内容正在整理中，请先查看已有详解的单元。</p>')) + '</div>' +
	      renderCardQuiz(p) +
    '</div>';

  var favBtn = mainContent.querySelector('.fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFav(p.id, favBtn);
    });
  }
  var graphBtn = mainContent.querySelector('.graph-btn');
  if (graphBtn && window.XGraph) {
    graphBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.XGraph.open(p.id);
    });
  }
  if (p.cardQuiz) bindCardQuiz();

  savedState['activePoint'] = id;
  save();
  if (window.XLink) XLink.onShowCard(id);
}

function renderCardQuiz(p) {
  if (!p.cardQuiz || p.cardQuiz.length === 0) return '';
  return '<div class="card-quiz"><div class="cq-title">📝 随学随练 (' + p.cardQuiz.length + '题)</div>' +
    p.cardQuiz.map(function(cq, i) {
      return '<div class="cq-item" data-cqi="' + i + '">' +
        '<div class="cq-q">' + (i+1) + '. ' + cq.q + '</div>' +
        '<div class="cq-opts">' + cq.opts.map(function(o, oi) {
          return '<div class="cq-opt" data-cqi="' + i + '" data-oi="' + oi + '">' + 'ABCD'[oi] + '. ' + o + '</div>';
        }).join('') + '</div>' +
        '<div class="cq-result" data-cqi="' + i + '">' +
          '<span class="result-text"></span>' +
          '<div style="font-size:.72rem;color:#8a7358;margin-top:3px">💡 ' + cq.expl + '</div>' +
        '</div></div>';
    }).join('') + '</div>';
}

function bindCardQuiz() {
  mainContent.querySelectorAll('.cq-opt').forEach(function(opt) {
    opt.addEventListener('click', function() {
      var cqi = parseInt(opt.dataset.cqi);
      var oi = parseInt(opt.dataset.oi);
      var item = mainContent.querySelector('.cq-item[data-cqi="' + cqi + '"]');
      if (item.classList.contains('done')) return;
      item.classList.add('done');

      var card = mainContent.querySelector('.card');
      var pointId = card.id.replace('card-','');
      var result = findPoint(pointId);
      if (!result || !result.point.cardQuiz) return;
      var cq = result.point.cardQuiz[cqi];

      item.querySelectorAll('.cq-opt').forEach(function(o) {
        var oi2 = parseInt(o.dataset.oi);
        if (oi2 === cq.ans) o.classList.add('correct');
        else if (oi2 === oi && oi !== cq.ans) o.classList.add('wrong');
        o.style.pointerEvents = 'none';
      });
      var resultDiv = item.querySelector('.cq-result');
      resultDiv.classList.add('show');
      var isCorrect = oi === cq.ans;
      resultDiv.classList.add(isCorrect ? 'right' : 'wrong');
      resultDiv.querySelector('.result-text').textContent = isCorrect ? '✅ 正确！' : '❌ 错误。正确答案是 ' + 'ABCD'[cq.ans];
      // 检查该知识点下所有 cardQuiz 是否已完成
      var cqCard = document.querySelector('#card-' + pointId);
      if (cqCard) {
        var allDone = true;
        cqCard.querySelectorAll('.cq-item').forEach(function(ci) {
          if (!ci.classList.contains('done')) allDone = false;
        });
        if (allDone) updateStudyProgress('cardQuizDone', pointId);
      }
    });
  });
}

function toggleFav(id, btn) {
  var idx = favs.indexOf(id);
  if (idx > -1) { favs.splice(idx,1); if (btn) { btn.classList.remove('faved'); btn.textContent = '🤍'; } }
  else { favs.push(id); if (btn) { btn.classList.add('faved'); btn.textContent = '❤'; } }
  save();
}

// ---- Favorites ----
function showFavorites() {
  if (favs.length === 0) {
    mainContent.innerHTML = '<div class="empty-state"><div class="icon">⭐</div><p>还没有收藏任何知识点<br>在学习卡片中点击 🤍 即可收藏</p></div>';
    return;
  }
  var html = '<h2 style="margin-bottom:14px;color:#5b3a29;font-size:1rem">⭐ 我的收藏 (' + favs.length + ')</h2><div class="fav-list">';
  favs.forEach(function(id) {
    var result = findPoint(id);
    if (!result) return;
    var p = result.point;
    html += '<div class="fav-item" data-favid="' + id + '">' +
      '<div class="fav-info" data-clickid="' + id + '">' +
        '<div class="fav-title">' + p.name + ' <span class="tag tag-' + p.type + '">' + (tagLabels[p.type]||'') + '</span></div>' +
        '<div class="fav-path">' + getPointPath(p.id) + '</div></div>' +
      '<div class="fav-del" data-delfav="' + id + '">✕</div></div>';
  });
  html += '</div>';
  mainContent.innerHTML = html;

  mainContent.querySelectorAll('.fav-info, .fav-item').forEach(function(el) {
    el.addEventListener('click', function(e) {
      var id = el.dataset.clickid || el.closest('.fav-item').dataset.favid;
      if (id) { showCard(id); highlightTreePoint(id); switchTab('study'); }
    });
  });
  mainContent.querySelectorAll('.fav-del').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      favs = favs.filter(function(f) { return f !== el.dataset.delfav; });
      save(); showFavorites();
    });
  });
}

function highlightTreePoint(id) {
  tree.querySelectorAll('.tree-point').forEach(function(p) { p.classList.remove('active'); });
  var el = tree.querySelector('.tree-point[data-id="' + id + '"]');
  if (!el) return;
  el.classList.add('active');
  var parent = el.closest('.tree-point-children');
  while (parent) {
    parent.classList.add('show');
    var trigger = parent.previousElementSibling;
    if (trigger) trigger.classList.add('open');
    parent = parent.parentElement ? parent.parentElement.closest('.tree-point-children, .tree-sub-children, .tree-unit-children') : null;
  }
}

// ---- Quiz ----
function startSmartReview() {
  // 跨科目智能复习：汇总所有科目中正确率最低的 80 个知识点的题目
  var perf = getPerf();
  var pointAcc = [];
  for (var pid in perf) {
    if (perf.hasOwnProperty(pid)) {
      var p = perf[pid];
      pointAcc.push({ id: pid, rate: p.correct / p.total, total: p.total });
    }
  }
  // Sort by accuracy ascending, prefer those attempted at least once
  pointAcc.sort(function(a, b) { return a.rate - b.rate; });
  var weakPoints = pointAcc.slice(0, 80).map(function(x) { return x.id; });

  // Filter question bank to those points
  var pool = questionBank.filter(function(q) { return q && q.pointId && weakPoints.indexOf(q.pointId) > -1; });
  if (pool.length === 0) { alert('暂无足够的练习数据，请先做一些练习题'); return; }

  // Use weighted selection from the pool
  var reviewP = [], consolidP = [], explorP = [];
  pool.forEach(function(q) {
    var p = q.pointId ? perf[q.pointId] : null;
    if (!p || p.total === 0) { explorP.push(q); return; }
    var rate = p.correct / p.total;
    if (rate < 0.5 || !p.lastCorrect) reviewP.push(q);
    else if (rate < 0.8) consolidP.push(q);
    else explorP.push(q);
  });

  function shuffle(arr) {
    for (var si = arr.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var tmp = arr[si]; arr[si] = arr[sj]; arr[sj] = tmp;
    }
    return arr;
  }
  shuffle(reviewP); shuffle(consolidP); shuffle(explorP);

  var targetCount = Math.min(80, pool.length);
  var rc = Math.round(targetCount * 0.6);
  var cc = Math.round(targetCount * 0.3);
  var ec = targetCount - rc - cc;
  if (explorP.length < ec) { cc += ec - explorP.length; ec = explorP.length; }
  if (consolidP.length < cc) { rc += cc - consolidP.length; cc = consolidP.length; }
  if (reviewP.length < rc) { ec += rc - reviewP.length; rc = reviewP.length; }
  if (rc < 0) rc = 0; if (cc < 0) cc = 0; if (ec < 0) ec = 0;

  currentQuiz = reviewP.slice(0, rc).concat(consolidP.slice(0, cc)).concat(explorP.slice(0, ec));
  shuffle(currentQuiz);
  quizAnswered = {};
  selectedOptions = {};
  clearQuizSession();
  // Set quiz display without allowing tab name override
  // Temporarily set quiz count for display
  quizCount = targetCount;
  // Don't track as selectedSubjIds since it's cross-subject
  showSmartQuiz();
}

function showSmartQuiz() {
  if (currentQuiz.length === 0) { showQuizSetup(); return; }
  var html = '<div class="quiz-container"><h2 style="margin-bottom:6px;color:#5b3a29;font-size:1rem">🧠 智能复习卷 (' + currentQuiz.length + '题)</h2>' +
    '<div class="quiz-controls" style="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap">' +
    '<button class="btn-secondary btn-small" onclick="window._regenerateQuiz()">🔄 重新出题</button>' +
    '<button class="btn-secondary btn-small" onclick="window._showQuizSetup()">📋 返回选择</button>' +
    '<button class="btn-primary btn-small" onclick="window._submitQuiz()">✅ 提交答案</button></div>';
  html += renderQuizCards(currentQuiz);
  html += '</div>';
  mainContent.innerHTML = html;
}

// Extract quiz card rendering to a reusable function
function renderQuizCards(quiz) {
  var html = '';
  quiz.forEach(function(q, i) {
    html += '<div class="quiz-card" id="qcard-' + i + '">' +
      '<div class="q-num">第 ' + (i+1) + ' 题 <span class="q-type-label qtype-' + q.type + '">' +
        (q.type==='choice'?'单选':q.type==='fill'?'填空':'连线') + '</span>' + (q.dyn ? '<span class="q-type-label qtype-dyn">✨ 动态</span>' : '') +
      getQuizLabel(q.pointId) +
      '<a class="q-link" onclick="event.preventDefault();window._showCardFromQuiz(\' + q.pointId + \')">📖 知识点</a></div>' +
      '<div class="q-text">' + q.question + '</div>';

    if (q.type === 'choice') {
      var opts = q.options.map(function(o,oi){return {text:o,orig:oi};}).sort(function(){return Math.random()-0.5;});
      html += opts.map(function(opt,oi){
        return '<div class="option" data-qi="' + i + '" data-oi="' + opt.orig + '" onclick="window._selectOption(' + i + ',' + opt.orig + ',this)">' + 'ABCD'[oi] + '. ' + opt.text + '</div>';
      }).join('');
    } else if (q.type === 'fill') {
      html += '<input class="fill-input" id="fill-' + i + '" placeholder="请输入答案..." data-qi="' + i + '">';
    } else if (q.type === 'match') {
      html += '<div class="match-grid"><div class="match-col"><div class="match-header">左列</div>' +
        q.left.map(function(item,mi){return '<div class="match-row"><span class="match-num">'+(mi+1)+'.</span> '+item+'</div>';}).join('') +
        '</div><div class="match-col"><div class="match-header">请选择对应项</div>' +
        q.left.map(function(_,mi){
          return '<div class="match-row"><span class="match-num">'+(mi+1)+'.</span>' +
            '<select id="match-' + i + '-' + mi + '"><option value="">-- 请选择 --</option>' +
            q.right.map(function(r,ri){return '<option value="'+ri+'">'+r+'</option>';}).join('') +
            '</select></div>';
        }).join('') + '</div></div>';
    }
    html += '<div class="quiz-explanation" id="expl-' + i + '"><strong>💡 解析：</strong>' + (q.explanation || q.expl || '（暂无解析）') + '</div></div>';
  });
  return html;
}

function showQuizSetup() {
  var html = '<div class="quiz-container"><h2 style="margin-bottom:8px;color:#5b3a29;font-size:1.05rem">✏ 练习题</h2>' +
    '<p style="font-size:.78rem;color:#a09080;margin-bottom:14px">选择科目后随机出题，每次50-80道，提交后即时判分并展示解析</p>' +
    '<div class="quiz-subj-select"><h3>选择出题科目</h3><div class="quiz-subj-grid" id="quizSubjGrid">' +
      subjects.map(function(s) {
        return '<div class="quiz-subj-chip ' + (selectedSubjIds.indexOf(s.id)>-1?'selected':'') + '" data-sid="' + s.id + '">' + s.name + '</div>';
      }).join('') +
    '</div>' +
    '<div style="margin-top:8px"><span class="btn-secondary btn-small" onclick="window._selectAllSubj(true)" style="margin-right:6px">全选</span>' +
    '<span class="btn-secondary btn-small" onclick="window._selectAllSubj(false)">取消全选</span></div>' +
    '<div class="quiz-count-row"><label>出题数量：</label><select id="quizCountSelect" onchange="window._setQuizCount(this.value)">' +
      '<option value="50"' + (quizCount===50?' selected':'') + '>50题</option>' +
      '<option value="60"' + (quizCount===60?' selected':'') + '>60题</option>' +
      '<option value="70"' + (quizCount===70?' selected':'') + '>70题</option>' +
      '<option value="80"' + (quizCount===80?' selected':'') + '>80题</option>' +
    '</select><button class="btn-primary" onclick="window._startQuiz()">🚀 开始做题</button></div>' +
    '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #e8ddd0"><button class="btn-secondary" onclick="window._startSmartReview()" style="width:100%;padding:10px">🧠 全局智能复习（自动组卷·聚焦薄弱点）</button></div></div></div>';
  mainContent.innerHTML = html;

  document.querySelectorAll('.quiz-subj-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      var sid = chip.dataset.sid;
      chip.classList.toggle('selected');
      var idx = selectedSubjIds.indexOf(sid);
      if (chip.classList.contains('selected')) {
        if (idx === -1) selectedSubjIds.push(sid);
      } else {
        if (idx > -1) selectedSubjIds.splice(idx, 1);
      }
    });
  });
}

// Expose to inline handlers
window._selectAllSubj = function(sel) {
  selectedSubjIds = sel ? subjects.map(function(s){return s.id;}) : [];
  document.querySelectorAll('.quiz-subj-chip').forEach(function(chip) {
    if (sel) chip.classList.add('selected'); else chip.classList.remove('selected');
  });
};
window._setQuizCount = function(v) { quizCount = parseInt(v); };
window._startQuiz = function() { startQuiz(); };
window._startSmartReview = function() { startSmartReview(); };

function startQuiz() {
  if (selectedSubjIds.length === 0) { alert('请至少选择一个科目'); return; }
  quizCount = parseInt(document.getElementById('quizCountSelect') ? document.getElementById('quizCountSelect').value : 60);

  var subjPointIds = new Set();
  var selSubjects = [];
  selectedSubjIds.forEach(function(sid) {
    var s = subjects.find(function(s) { return s.id === sid; });
    if (s) { selSubjects.push(s); s.points.forEach(function(id) { subjPointIds.add(id); }); }
  });

  var pool = questionBank.filter(function(q) { return q && q.pointId && subjPointIds.has(q.pointId); });

  // 动态出题：白名单科目启用时，70% 动态题 + 30% 静态题混合出卷
  var dynEnabled = (typeof DynQuiz !== 'undefined') && selSubjects.some(function(s) { return DynQuiz.isEnabled(s.id); });
  if (pool.length === 0 && !dynEnabled) { alert('没有匹配的题目，请选择其他科目'); return; }

  var dynamicQs = [];
  if (dynEnabled) {
    var dynTarget = Math.round(quizCount * 0.7);
    dynamicQs = DynQuiz.generate(selSubjects, dynTarget);
  }
  var staticCount = Math.min(quizCount - dynamicQs.length, pool.length);
  if (staticCount < 0) staticCount = 0;

  // v2 三池加权出题（静态题部分，按 staticCount 配额）
  var perf = getPerf();
  var reviewPool = [], consolidatePool = [], explorePool = [];
  pool.forEach(function(q) {
    var p = q.pointId ? perf[q.pointId] : null;
    if (!p || p.total === 0) {
      explorePool.push(q);
    } else {
      var rate = p.correct / p.total;
      if (rate < 0.5 || !p.lastCorrect) {
        reviewPool.push(q);
      } else if (rate < 0.8) {
        consolidatePool.push(q);
      } else {
        explorePool.push(q);
      }
    }
  });

  // Shuffle each pool
  function shuffle(arr) {
    for (var si = arr.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var tmp = arr[si]; arr[si] = arr[sj]; arr[sj] = tmp;
    }
    return arr;
  }
  shuffle(reviewPool);
  shuffle(consolidatePool);
  shuffle(explorePool);

  // 60% review, 30% consolidate, 10% explore
  var reviewCount = Math.round(staticCount * 0.6);
  var consolidateCount = Math.round(staticCount * 0.3);
  var exploreCount = staticCount - reviewCount - consolidateCount;

  // If a pool is short, redistribute to next priority pool
  if (explorePool.length < exploreCount) {
    consolidateCount += exploreCount - explorePool.length;
    exploreCount = explorePool.length;
  }
  if (consolidatePool.length < consolidateCount) {
    reviewCount += consolidateCount - consolidatePool.length;
    consolidateCount = consolidatePool.length;
  }
  if (reviewPool.length < reviewCount) {
    exploreCount += reviewCount - reviewPool.length;
    reviewCount = reviewPool.length;
  }
  if (exploreCount < 0) exploreCount = 0;
  if (consolidateCount < 0) consolidateCount = 0;
  if (reviewCount < 0) reviewCount = 0;

  currentQuiz = dynamicQs
    .concat(reviewPool.slice(0, reviewCount))
    .concat(consolidatePool.slice(0, consolidateCount))
    .concat(explorePool.slice(0, exploreCount));
  // Final shuffle to mix dynamic + static pools together
  shuffle(currentQuiz);

  quizAnswered = {};
  selectedOptions = {};
  clearQuizSession();
  showQuiz();
}

function showQuiz() {
  if (currentQuiz.length === 0) { showQuizSetup(); return; }

  var html = '<div class="quiz-container"><h2 style="margin-bottom:6px;color:#5b3a29;font-size:1rem">✏ 练习题 (' + currentQuiz.length + '题)</h2>' +
    '<div class="quiz-controls" style="display:flex;gap:8px;margin:10px 0;flex-wrap:wrap">' +
    '<button class="btn-secondary btn-small" onclick="window._regenerateQuiz()">🔄 重新出题</button>' +
    '<button class="btn-secondary btn-small" onclick="window._showQuizSetup()">📋 选择科目</button>' +
    '<button class="btn-primary btn-small" onclick="window._submitQuiz()">✅ 提交答案</button></div>';

  currentQuiz.forEach(function(q, i) {
    html += '<div class="quiz-card" id="qcard-' + i + '">' +
      '<div class="q-num">第 ' + (i+1) + ' 题 <span class="q-type-label qtype-' + q.type + '">' +
        (q.type==='choice'?'单选':q.type==='fill'?'填空':'连线') + '</span>' + (q.dyn ? '<span class="q-type-label qtype-dyn">✨ 动态</span>' : '') +
      '<a class="q-link" onclick="event.preventDefault();window._showCardFromQuiz(\'' + q.pointId + '\')">📖 知识点</a></div>' +
      getQuizLabel(q.pointId) +
      '<div class="q-text">' + q.question + '</div>';

    if (q.type === 'choice') {
      var opts = q.options.map(function(o,oi){return {text:o,orig:oi};}).sort(function(){return Math.random()-0.5;});
      html += opts.map(function(opt,oi){
        return '<div class="option" data-qi="' + i + '" data-oi="' + opt.orig + '" onclick="window._selectOption(' + i + ',' + opt.orig + ',this)">' + 'ABCD'[oi] + '. ' + opt.text + '</div>';
      }).join('');
    } else if (q.type === 'fill') {
      html += '<input class="fill-input" id="fill-' + i + '" placeholder="请输入答案..." data-qi="' + i + '">';
    } else if (q.type === 'match') {
      html += '<div class="match-grid"><div class="match-col"><div class="match-header">左列</div>' +
        q.left.map(function(item,mi){return '<div class="match-row"><span class="match-num">'+(mi+1)+'.</span> '+item+'</div>';}).join('') +
        '</div><div class="match-col"><div class="match-header">请选择对应项</div>' +
        q.left.map(function(_,mi){
          return '<div class="match-row"><span class="match-num">'+(mi+1)+'.</span>' +
            '<select id="match-' + i + '-' + mi + '"><option value="">-- 请选择 --</option>' +
            q.right.map(function(r,ri){return '<option value="'+ri+'">'+r+'</option>';}).join('') +
            '</select></div>';
        }).join('') + '</div></div>';
    }
    html += '<div class="quiz-explanation" id="expl-' + i + '"><strong>💡 解析：</strong>' + (q.explanation || q.expl || '（暂无解析）') + '</div></div>';
  });
  html += '</div>';
  mainContent.innerHTML = html;
}

window._selectOption = function(qi, oi, el) {
  if (quizAnswered[qi]) return;
  var card = document.getElementById('qcard-'+qi);
  if (card) {
    card.querySelectorAll('.option').forEach(function(o){o.classList.remove('selected');});
  }
  el.classList.add('selected');
  selectedOptions[qi] = {type:'choice', answer:oi};
  saveQuizSession();
  saveQuizSession();
};
window._regenerateQuiz = function() { selectedOptions = {}; clearQuizSession(); startQuiz(); };
window._resumeQuiz = function() { if (currentQuiz.length > 0) showQuiz(); };
window._discardQuizSession = function() { clearQuizSession(); showQuizSetup(); };
window._showQuizSetup = function() { showQuizSetup(); };
window._showCardFromQuiz = function(id) { showCard(id); switchTab('study'); };

window._submitQuiz = function() {
  var correct = 0, total = currentQuiz.length;
  var wb = getWrongBook();
  var wbIdx = {};
  for (var _wi = 0; _wi < wb.length; _wi++) wbIdx[wb[_wi].sig] = _wi;
  currentQuiz.forEach(function(q, i) {
    var userAnswer = null, isCorrect = false;
    if (q.type === 'choice') {
      if (selectedOptions[i]) userAnswer = selectedOptions[i].answer;
      isCorrect = userAnswer === q.answer;
    } else if (q.type === 'fill') {
      var input = document.getElementById('fill-'+i);
      if (input) userAnswer = input.value.trim();
      isCorrect = userAnswer === q.answer;
    } else if (q.type === 'match') {
      userAnswer = {};
      var allFilled = true;
      q.left.forEach(function(_, mi) {
        var sel = document.getElementById('match-'+i+'-'+mi);
        if (!sel || sel.value === '') { allFilled = false; return; }
        userAnswer[mi] = q.right[parseInt(sel.value)];
      });
      if (!allFilled) { quizAnswered[i] = {correct:false, userAnswer:null, correctAnswer:q.answer}; return; }
      isCorrect = Object.keys(q.answer).every(function(k) {
        var expected = q.answer[k];
        return typeof expected === 'number' ? q.right[expected] === userAnswer[parseInt(k)] : expected === userAnswer[parseInt(k)];
      }) && Object.keys(userAnswer).length === Object.keys(q.answer).length;
    }
    quizAnswered[i] = {correct:isCorrect, userAnswer:userAnswer, correctAnswer:q.answer};
    if (isCorrect) correct++;
    if (q.pointId) savePerf(q.pointId, isCorrect);
    if (q.dyn && q.sig && typeof DynQuiz !== 'undefined' && DynQuiz.recordResult) DynQuiz.recordResult(q.sig, isCorrect);

    // 错题本记录（批次3）
    var _sig = wrongSig(q);
    var _widx = wbIdx[_sig];
    if (!isCorrect) {
      if (_widx != null && wb[_widx]) {
        var _r = wb[_widx];
        _r.wrongCount = (_r.wrongCount || 0) + 1;
        _r.lastWrong = Date.now();
        _r.consecCorrect = 0;
        _r.resolved = false;
        _r.dyn = !!q.dyn;
        _r.question = q.question; _r.options = q.options; _r.answer = q.answer;
        _r.explanation = q.explanation || q.expl || _r.explanation || '';
      } else {
        wb.push({ sig: _sig, type: q.type, pointId: q.pointId, question: q.question,
          options: q.options, answer: q.answer, dyn: !!q.dyn,
          explanation: q.explanation || q.expl || '',
          wrongCount: 1, lastWrong: Date.now(), consecCorrect: 0, resolved: false });
        wbIdx[_sig] = wb.length - 1;
      }
    } else if (_widx != null && wb[_widx]) {
      wb[_widx].consecCorrect = (wb[_widx].consecCorrect || 0) + 1;
      if (wb[_widx].consecCorrect >= 2) wb[_widx].resolved = true;
    }

    var expl = document.getElementById('expl-'+i);
    if (expl) expl.classList.add('show');

    if (q.type === 'choice' && !isCorrect) {
      var card = document.getElementById('qcard-'+i);
      if (card) {
        card.querySelectorAll('.option').forEach(function(opt){
          if (parseInt(opt.dataset.oi) === q.answer) opt.classList.add('correct');
          if (parseInt(opt.dataset.oi) === userAnswer && userAnswer !== q.answer) opt.classList.add('wrong');
        });
      }
    }
    if (q.type === 'fill') {
      var inp = document.getElementById('fill-'+i);
      if (inp) {
        inp.style.borderColor = isCorrect ? '#27ae60' : '#e74c3c';
        inp.style.background = isCorrect ? '#eafaf1' : '#fdedec';
        inp.readOnly = true;
        if (!isCorrect) inp.value += ' (正确答案: ' + q.answer + ')';
      }
    }
    if (q.type === 'match') {
      q.left.forEach(function(_, mi) {
        var sel = document.getElementById('match-'+i+'-'+mi);
        if (!sel) return;
        sel.disabled = true;
        var expected = q.answer[mi];
        var correctVal = typeof expected === 'number' ? String(expected) : String(q.right.indexOf(expected));
        if (sel.value === correctVal) { sel.style.borderColor='#27ae60'; sel.style.background='#eafaf1'; }
        else { sel.style.borderColor='#e74c3c'; sel.style.background='#fdedec'; }
      });
    }

    quizHistory.unshift({
      time: new Date().toISOString(), pointId: q.pointId, type: q.type,
      question: q.question, userAnswer: userAnswer, correctAnswer: q.answer,
      correct: isCorrect, explanation: (q.explanation || q.expl || '（暂无解析）')
    });
  });
  if (quizHistory.length > 200) quizHistory.length = 200;
  save();
  saveWrongBook(wb);

  var pct = Math.round(correct/total*100);
  var container = document.querySelector('.quiz-container');
  if (container) {
    container.insertAdjacentHTML('afterbegin', '<div class="quiz-result">' +
      '<div class="score">' + correct + '/' + total + ' (' + pct + '%)</div>' +
      '<div class="msg">' + (pct>=90?'🎉 优秀！':pct>=70?'👍 良好！':pct>=50?'📚 还需努力！':'💪 建议回顾知识点后重做！') + '</div>' +
      '<button class="btn-primary btn-small" style="margin-top:6px" onclick="window._regenerateQuiz()">🔄 重新出题</button></div>');
  }
};

// ---- History ----
function showHistory() {
  if (quizHistory.length === 0) {
    mainContent.innerHTML = '<div class="empty-state"><div class="icon">📋</div><p>还没有做题记录</p></div>';
    return;
  }
  var html = '<h2 style="margin-bottom:12px;color:#5b3a29;font-size:1rem">📋 做题记录 (' + quizHistory.length + ')</h2>' +
    '<button class="btn-secondary btn-small" style="margin-bottom:12px" onclick="if(confirm(\'确认清空？\')){window._clearHistory()}">清空记录</button>';
  quizHistory.forEach(function(h) {
    html += '<div class="history-item"><div class="h-q">' + h.question +
      ' <span class="h-badge ' + (h.correct?'h-badge-right':'h-badge-wrong') + '">' + (h.correct?'✓正确':'✗错误') + '</span></div>' +
      '<div class="h-meta">' + (h.type==='choice'?'单选':h.type==='fill'?'填空':'连线') + ' · ' + new Date(h.time).toLocaleString('zh-CN') +
      ' · <a href="#" onclick="event.preventDefault();window._showCardFromQuiz(\''+h.pointId+'\')" style="color:#c9a87c">查看知识点</a></div></div>';
  });
  mainContent.innerHTML = html;
}
window._clearHistory = function() { quizHistory = []; save(); showHistory(); };

// ---- Tabs ----
function switchTab(tab) {
  if (tab === 'learn') tab = 'study'; // v2 兼容旧 index.html 按钮和 localStorage
  currentTab = tab;
  document.querySelectorAll('.tabbar .tab').forEach(function(t){t.classList.remove('active');});
  var tabEl = document.querySelector('.tabbar .tab[data-tab="'+tab+'"]');
  if (tabEl) tabEl.classList.add('active');

  if (tab === 'study') {
    document.getElementById('layout').classList.remove('layout-no-sidebar');
    document.getElementById('layout').style.display = 'flex';
    // 重置侧栏内联display(清理practical等设的display:none残留,否则折叠/展开按钮失效)
    var sbEl = document.getElementById('sidebar');
    if (sbEl) sbEl.style.display = '';
    var activeId = savedState['activePoint'];
    if (activeId) showCard(activeId);
    else mainContent.innerHTML = '<div class="empty-state"><div class="icon">&#x1f448;</div><p>从左侧大纲选择一个要点<br>即可查看知识详解</p></div>';
  } else {
    document.getElementById('layout').classList.add('layout-no-sidebar');
    document.getElementById('layout').style.display = 'block';
    overlay.classList.remove('show');
    if (tab === 'quiz') {
      var resumed = loadQuizSession();
      if (resumed) {
        var total = currentQuiz.length;
        var answered = 0;
        Object.keys(quizAnswered).forEach(function(k) { answered++; });
        var html = '<div class="quiz-container" style="padding:20px"><h2 style="margin-bottom:12px;color:#5b3a29">✏ 继续做题</h2>' +
          '<p style="margin-bottom:16px;color:#6b5a49">检测到上次未完成的练习：已答 <b>' + answered + '</b>/' + total + ' 题</p>' +
          '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
          '<button class="btn-primary" onclick="window._resumeQuiz()">&#x25b6; 继续答题</button>' +
          '<button class="btn-secondary" onclick="window._discardQuizSession()">&#x1f504; 重新出题</button></div></div>';
        mainContent.innerHTML = html;
      } else {
        showQuizSetup();
      }
    } else if (tab === 'favs') showFavorites();
    else if (tab === 'history') showHistory();
    else if (tab === 'studyPlan') renderStudyPlan();
    else if (tab === 'wrongBook') renderWrongBook();
    else if (tab === 'stats') renderStats();
    else if (tab === 'practical') renderPractical();
  }
  document.getElementById('headerTitle').textContent =
    tab==='study'?'📖 出师考核':
    tab==='studyPlan'?'📈 学习路线':
    tab==='quiz'?'✏️ 练习题':
    tab==='wrongBook'?'📓 错题本':
    tab==='stats'?'📊 统计':
    tab==='favs'?'⭐ 我的收藏':
    tab==='practical'?'🏥 实践备考':'📋 做题记录';
  updateCollapseBtns();
}

document.querySelectorAll('.tabbar .tab').forEach(function(tab){
  tab.addEventListener('click', function(){switchTab(tab.dataset.tab);});
});

// ---- Mobile ----
menuToggle.addEventListener('click', function(){sidebar.classList.toggle('visible');overlay.classList.toggle('show');});
overlay.addEventListener('click', function(){sidebar.classList.remove('visible');overlay.classList.remove('show');});

// ---- Sidebar collapse toggle ----
(function initCollapseToggle() {
  var sCb = document.getElementById('sidebarCollapseBtn');
  var sEt = document.getElementById('sidebarExpandTab');
  if (!sCb || !sEt) { setTimeout(initCollapseToggle, 200); return; }
  sCb.addEventListener('click', function() {
    sidebar.classList.add('collapsed');
    var pe = document.querySelector('.pe-sidebar');
    if (pe) pe.classList.add('collapsed');
    sCb.classList.remove('show');
    sEt.classList.add('show');
    sEt.style.display = 'flex';
  });
  sEt.addEventListener('click', function() {
    sidebar.classList.remove('collapsed');
    var pe = document.querySelector('.pe-sidebar');
    if (pe) pe.classList.remove('collapsed');
    sEt.classList.remove('show');
    sEt.style.display = 'none';
    sCb.classList.add('show');
  });
  // Ensure initial state
  sCb.classList.add('show');
  sCb.style.display = 'flex';
  sEt.style.display = 'none';
})();

// 折叠/展开按钮仅在学习(study)与实践(practical) tab 显示（BUG1 修复；
// practical 复用该按钮折叠 .pe-sidebar 考点目录，故须保留）
function updateCollapseBtns() {
  var sCb = document.getElementById('sidebarCollapseBtn');
  var sEt = document.getElementById('sidebarExpandTab');
  if (!sCb || !sEt) return;
  if (currentTab === 'study') {
    var collapsed = sidebar.classList.contains('collapsed');
    sCb.classList.toggle('show', !collapsed);
    sEt.classList.toggle('show', collapsed);
    sCb.style.display = collapsed ? 'none' : 'flex';
    sEt.style.display = collapsed ? 'flex' : 'none';
  } else if (currentTab === 'practical') {
    // practical：强制展开考点目录（renderPractical 可能先按 sCb 状态折叠了 pe-sidebar），
    // 显示折叠按钮；用户可点击折叠后再展开
    var peSb = document.querySelector('.pe-sidebar');
    if (peSb) peSb.classList.remove('collapsed');
    sCb.classList.add('show');
    sCb.style.display = 'flex';
    sEt.classList.remove('show');
    sEt.style.display = 'none';
  } else {
    sCb.classList.remove('show');
    sEt.classList.remove('show');
    sCb.style.display = 'none';
    sEt.style.display = 'none';
  }
}


// ---- v2 学习路径导航 ----
function updateStudyProgress(type, id) {
  // type: 'read'（已读知识点）或 'cardQuizDone'（已完成 cardQuiz）
  var sp = JSON.parse(localStorage.getItem('studyProgress') || '{"readPoints":[],"cardQuizDone":[],"stageUnlocked":1,"lastAccess":0}');
  if (type === 'read') {
    if (sp.readPoints.indexOf(id) === -1) sp.readPoints.push(id);
  } else if (type === 'cardQuizDone') {
    if (sp.cardQuizDone.indexOf(id) === -1) sp.cardQuizDone.push(id);
  }
  sp.lastAccess = Date.now();
  localStorage.setItem('studyProgress', JSON.stringify(sp));
  return sp;
}

function renderStudyPlan() {
  injectStatsCss();
  var html = '<div class="sp-container"><h2 style="margin-bottom:14px;color:#5b3a29;font-size:1rem">📈 学习路线</h2>' +
    '<p style="font-size:.75rem;color:#a09080;margin-bottom:16px">三阶段递进式学习路径——完成前一阶段达标后自动解锁下一阶段</p>';
  
  // Read studyProgress
  var sp = JSON.parse(localStorage.getItem('studyProgress') || '{"readPoints":[],"cardQuizDone":[],"stageUnlocked":1,"lastAccess":0}');
  
  // Build a lookup: subject id -> { totalPoints, cardQuizDoneCount }
  var subjectStats = {};
  subjects.forEach(function(s) {
    var totalPts = s.points.length;
    var donePts = 0;
    s.points.forEach(function(pid) {
      if (learnedPoints.has(pid)) donePts++;
    });
    subjectStats[s.id] = { total: totalPts, done: donePts };
  });
  
  // Try fetching study-plan.json, fallback to inline data
  var planData = null;
  
  function renderPlan(data) {
    data.stages.forEach(function(stage, si) {
      var stageSubjects = stage.subjects;
      
      // Calculate stage completion rate
      var totalPts = 0, donePts = 0;
      stageSubjects.forEach(function(sid) {
        var stats = subjectStats[sid];
        if (stats) {
          totalPts += stats.total;
          donePts += stats.done;
        }
      });
      var rate = totalPts > 0 ? donePts / totalPts : 0;
      var ratePct = Math.round(rate * 100);
      
      // Determine unlock status
      // stage1 always unlocked; later stages check if previous stage threshold met
      var unlocked = false;
      if (si === 0) {
        unlocked = true;
      } else {
        // Check if all previous stages' subjects meet threshold
        var prevSubjects = [];
        for (var pi = 0; pi < si; pi++) {
          data.stages[pi].subjects.forEach(function(psid) {
            if (prevSubjects.indexOf(psid) === -1) prevSubjects.push(psid);
          });
        }
        var prevTotal = 0, prevDone = 0;
        prevSubjects.concat(stageSubjects).forEach(function(sid) {
          var stats = subjectStats[sid];
          if (stats) {
            prevTotal += stats.total;
            prevDone += stats.done;
          }
        });
        var prevRate = prevTotal > 0 ? prevDone / prevTotal : 0;
        unlocked = prevRate >= stage.threshold;
      }
      
      if (unlocked) {
        if (sp.stageUnlocked < si + 1) {
          sp.stageUnlocked = si + 1;
        }
      }
      
      var stageLabels = ['基础阶段', '临床基础', '临床应用'];
      var stageIcons = ['🌱', '🌿', '🌳'];
      var subjectNames = [];
      stageSubjects.forEach(function(sid) {
        var s = subjects.find(function(x) { return x.id === sid; });
        if (s) subjectNames.push(s.name);
      });
      
      html += '<div class="sp-stage' + (unlocked ? '' : ' sp-locked') + '" data-stage="' + stage.id + '">' +
        '<div class="sp-stage-header">' +
          '<span class="sp-stage-icon">' + stageIcons[si] + '</span>' +
          '<div class="sp-stage-info">' +
            '<div class="sp-stage-name">阶段' + (si+1) + '：' + stageLabels[si] + '</div>' +
            '<div class="sp-stage-desc">' + stage.description + '</div>' +
          '</div>' +
          (unlocked ? '' : '<div class="sp-lock-badge">🔒 未解锁</div>') +
        '</div>' +
        '<div class="sp-progress-row">' +
          '<div class="sp-progress-bar-wrap">' +
            '<div class="sp-progress-bar" style="width:' + ratePct + '%"></div>' +
          '</div>' +
          '<span class="sp-progress-text">' + donePts + '/' + totalPts + ' (' + ratePct + '%)</span>' +
        '</div>' +
        '<div class="sp-subjects">' +
          '<div class="sp-subj-label">包含科目：' + subjectNames.join('、') + '</div>' +
          (unlocked ? renderSubjectDetail(stageSubjects, subjectStats) : '') +
        '</div>' +
      '</div>';
    });
    
    html += '</div>';
    mainContent.innerHTML = html;
    localStorage.setItem('studyProgress', JSON.stringify(sp));
  }
  
  function renderSubjectDetail(sidList, stats) {
    var html = '<div class="sp-subj-detail">';
    sidList.forEach(function(sid) {
      var s = subjects.find(function(x) { return x.id === sid; });
      if (!s) return;
      var sTotal = stats[sid] ? stats[sid].total : 0;
      var sDone = stats[sid] ? stats[sid].done : 0;
      var sRate = sTotal > 0 ? Math.round(sDone / sTotal * 100) : 0;
      html += '<div class="sp-subj-card">' +
        '<div class="sp-subj-header">' + s.name + 
          ' <span class="sp-weight sp-w-' + (s.id === "s5" || s.id === "s6" ? "mid" : "high") + '">' +
          (s.id === 's1' || s.id === 's2' || s.id === '3' || s.id === 's4' || s.id === 's5' ? '高频' : '中频') + '</span>' +
        '</div>' +
        '<div class="sp-subj-progress">' +
          '<div class="sp-progress-bar-wrap"><div class="sp-progress-bar sp-bar-subj" style="width:' + sRate + '%"></div></div>' +
          '<span class="sp-progress-text">' + sDone + '/' + sTotal + ' (' + sRate + '%)</span>' +
        '</div>';
      // List units
      s.units.forEach(function(unit, ui) {
        var uTotal = 0;
        var uDone = 0;
        unit.subunits.forEach(function(sub) {
          sub.points.forEach(function(p) {
            uTotal++;
            if (learnedPoints.has(p.id)) uDone++;
          });
        });
        var uRate = uTotal > 0 ? Math.round(uDone / uTotal * 100) : 0;
        html += '<div class="sp-unit-row" data-sid="' + s.id + '" data-ui="' + ui + '">' +
          '<span class="sp-unit-name">' + unit.unit + '</span>' +
          '<span class="sp-unit-rate' + (uRate >= 70 ? ' sp-rate-high' : uRate >= 40 ? ' sp-rate-mid' : ' sp-rate-low') + '">' + uRate + '%</span>' +
        '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
    return html;
  }
  
  // Attempt to load study-plan.json, fallback to hardcoded data
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'subjects/study-plan.json', false); // synchronous for simplicity
    xhr.overrideMimeType('application/json');
    xhr.send();
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      renderPlan(data);
    } else {
      throw new Error('Failed to load');
    }
  } catch(e) {
    // Fallback: use inline data
    renderPlan({
      "stages": [
        {"id":"stage1","name":"基础阶段","description":"先立根基——理论体系和辨证方法是一切临床科目的思维基础","subjects":["s1","s2"],"threshold":0.7},
        {"id":"stage2","name":"临床基础","description":"掌握武器——中药是弹药库，方剂是战术组合，两科同步推进，相互印证","subjects":["3","s4"],"threshold":0.6},
        {"id":"stage3","name":"临床应用","description":"投入战场——内科是核心临床科目，妇/外/儿分科扩宽，针灸独立成体系","subjects":["s5","s6","s7","s8","s9"],"threshold":0.6}
      ],
      "subjectWeights":{"s1":"高频","s2":"高频","3":"高频","s4":"高频","s5":"高频","s6":"中频","s7":"中频","s8":"中频","s9":"中频"}
    });
  }
  
  // Bind unit click events (delegated)
  setTimeout(function() {
    document.querySelectorAll('.sp-unit-row').forEach(function(el) {
      el.addEventListener('click', function() {
        var sid = el.dataset.sid;
        var ui = parseInt(el.dataset.ui);
        var s = subjects.find(function(x) { return x.id === sid; });
        if (!s || !s.units[ui]) return;
        var unit = s.units[ui];
        // Find first point in this unit to show
        if (unit.subunits.length > 0 && unit.subunits[0].points.length > 0) {
          showCard(unit.subunits[0].points[0].id);
          highlightTreePoint(unit.subunits[0].points[0].id);
          switchTab('study');
        }
      });
    });
  }, 50);
}
function renderWrongBook() {
  var wb = getWrongBook();
  var unresolved = wb.filter(function(r) { return !r.resolved; });
  var resolvedCnt = wb.length - unresolved.length;

  var html = '<div class="wb-container"><h2 style="margin-bottom:6px;color:#5b3a29;font-size:1rem">📓 错题本</h2>' +
    '<div style="font-size:.74rem;color:#8a7358;margin-bottom:12px">答错的题自动收录；连续答对 2 次或手动标记后移出待复习。动态出题时这些知识点的题会优先出现。</div>';

  if (unresolved.length === 0) {
    html += '<div class="empty-state"><div class="icon">&#x2705;</div><p>暂无待复习错题' + (resolvedCnt ? '（已掌握 ' + resolvedCnt + ' 题）' : '') + '</p></div>';
    if (resolvedCnt) {
      html += '<div style="text-align:center;margin-top:10px"><button class="btn-secondary btn-small" onclick="window._wbClear()">&#x1f5d1; 清空错题本</button></div>';
    }
    html += '</div>';
    mainContent.innerHTML = html;
    return;
  }

  var subjSet = {};
  unresolved.forEach(function(r) {
    var f = findPoint(r.pointId);
    if (f && f.subject) subjSet[f.subject.id] = f.subject.name;
  });
  html += '<div class="wb-filter-row" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px">' +
    '<select id="wbFilter" style="padding:6px 10px;border:1.5px solid #e8ddd0;border-radius:6px;font-size:.78rem">' +
    '<option value="all">全部科目</option>';
  Object.keys(subjSet).forEach(function(sid) {
    html += '<option value="' + sid + '">' + subjSet[sid] + '</option>';
  });
  html += '</select>' +
    '<button class="btn-secondary btn-small" onclick="window._wbReviewAll()">&#x1f504; 全部重做</button>' +
    '<button class="btn-secondary btn-small" onclick="window._wbClear()">&#x1f5d1; 清空错题本</button>' +
    (resolvedCnt ? '<span style="font-size:.72rem;color:#a09080">已掌握 ' + resolvedCnt + ' 题</span>' : '') +
    '</div>';

  unresolved.sort(function(a, b) { return (b.lastWrong || 0) - (a.lastWrong || 0); });

  html += '<div id="wbList">';
  unresolved.forEach(function(r) {
    var f = findPoint(r.pointId);
    var subjName = f && f.subject ? f.subject.name : '未知科目';
    var path = getPointPath(r.pointId);
    var timeStr = r.lastWrong ? new Date(r.lastWrong).toLocaleString('zh-CN') : '未知';
    var typeLabel = r.type === 'choice' ? '单选' : r.type === 'fill' ? '填空' : '连线';
    var sid = f && f.subject ? f.subject.id : '';
    var qPreview = String(r.question || '').replace(/<[^>]+>/g, '');
    if (qPreview.length > 60) qPreview = qPreview.substring(0, 60) + '…';
    html += '<div class="wb-item" data-sid="' + sid + '">' +
      '<div class="wb-q">' + qPreview + ' <span class="wb-type">' + typeLabel + '</span>' +
      '<span class="wb-wrongcnt">错 ' + (r.wrongCount || 1) + ' 次</span></div>' +
      '<div class="wb-meta">' + subjName + (path ? ' · ' + path : '') + ' · 最近答错：' + timeStr + '</div>' +
      '<div class="wb-actions">' +
        '<button class="btn-secondary btn-small" onclick="window._wbPractice(\'' + r.sig + '\')">📝 再练一次</button>' +
        '<button class="btn-secondary btn-small" onclick="event.stopPropagation();window._showCardFromQuiz(\'' + r.pointId + '\')">📖 知识点</button>' +
        '<button class="btn-secondary btn-small" onclick="window._wbResolve(\'' + r.sig + '\')">✅ 已掌握</button>' +
      '</div></div>';
  });
  html += '</div></div>';
  mainContent.innerHTML = html;

  document.getElementById('wbFilter').addEventListener('change', function() {
    var val = this.value;
    document.querySelectorAll('.wb-item').forEach(function(el) {
      el.style.display = (val === 'all' || el.dataset.sid === val) ? '' : 'none';
    });
  });
}

// 错题本：单题再练（批次3）
window._wbPractice = function(sig) {
  var wb = getWrongBook();
  var rec = null;
  for (var i = 0; i < wb.length; i++) { if (wb[i].sig === sig) { rec = wb[i]; break; } }
  if (!rec) { alert('题目已不存在'); return; }
  var q = { type: rec.type, pointId: rec.pointId, question: rec.question,
    options: rec.options, answer: rec.answer, explanation: rec.explanation,
    sig: rec.sig, dyn: rec.dyn || false };
  quizAnswered = {};
  selectedOptions = {};
  clearQuizSession();
  switchTab('quiz');
  currentQuiz = [q];
  showQuiz();
};

// 错题本：批量重做所有未掌握错题
window._wbReviewAll = function() {
  var wb = getWrongBook();
  var pool = wb.filter(function(r) { return !r.resolved; }).map(function(r) {
    return { type: r.type, pointId: r.pointId, question: r.question,
      options: r.options, answer: r.answer, explanation: r.explanation,
      sig: r.sig, dyn: r.dyn || false };
  });
  if (pool.length === 0) { alert('暂无待复习错题'); return; }
  pool.sort(function() { return Math.random() - 0.5; });
  currentQuiz = pool.slice(0, Math.min(60, pool.length));
  quizAnswered = {};
  selectedOptions = {};
  clearQuizSession();
  switchTab('quiz');
  showQuiz();
};

// 错题本：手动标记已掌握
window._wbResolve = function(sig) {
  var wb = getWrongBook();
  for (var i = 0; i < wb.length; i++) { if (wb[i].sig === sig) { wb[i].resolved = true; break; } }
  saveWrongBook(wb);
  renderWrongBook();
};

// 错题本：清空
window._wbClear = function() {
  if (!confirm('确认清空错题本？所有错题记录将被删除。')) return;
  saveWrongBook([]);
  renderWrongBook();
};
function injectStatsCss() {
  if (!document.getElementById('sp-styles')) {
    var spStyle = document.createElement('style');
    spStyle.id = 'sp-styles';
    spStyle.textContent = '.sp-stage{background:#fff;border-radius:10px;padding:18px 20px;margin-bottom:14px;box-shadow:0 1px 6px rgba(0,0,0,.05);border-left:4px solid #c9a87c}.sp-stage.sp-locked{opacity:.5;border-left-color:#ccc}.sp-stage-header{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}.sp-stage-icon{font-size:1.6rem;line-height:1}.sp-stage-info{flex:1}.sp-stage-name{font-size:.9rem;font-weight:700;color:#3a2210}.sp-stage-desc{font-size:.72rem;color:#a09080;margin-top:2px}.sp-lock-badge{font-size:.7rem;color:#999;white-space:nowrap;padding:3px 8px;background:#f5f5f5;border-radius:6px}.sp-progress-row{display:flex;align-items:center;gap:10px;margin:8px 0 6px 26px}.sp-progress-bar-wrap{flex:1;height:8px;background:#e8ddd0;border-radius:4px;overflow:hidden}.sp-progress-bar{height:100%;background:linear-gradient(90deg,#c9a87c,#5b3a29);border-radius:4px;transition:width .4s}.sp-bar-subj{background:linear-gradient(90deg,#a8c9a8,#5b8a5b)}.sp-progress-text{font-size:.65rem;color:#8a7358;white-space:nowrap}.sp-subjects{margin:8px 0 0 26px}.sp-subj-label{font-size:.72rem;color:#6b5a44;margin-bottom:8px}.sp-subj-detail{margin-top:6px}.sp-subj-card{background:#fdfbf8;border:1px solid #e8ddd0;border-radius:8px;padding:10px 14px;margin-bottom:8px}.sp-subj-header{font-size:.78rem;font-weight:600;color:#3a2210;margin-bottom:6px;display:flex;align-items:center;gap:6px}.sp-weight{font-size:.58rem;padding:1px 6px;border-radius:6px;font-weight:400}.sp-w-high{background:#d4e6f1;color:#1a5276}.sp-w-mid{background:#fdebd0;color:#7d6608}.sp-subj-progress{display:flex;align-items:center;gap:8px;margin-bottom:6px}.sp-unit-row{display:flex;align-items:center;justify-content:space-between;padding:5px 8px;font-size:.72rem;cursor:pointer;border-radius:4px;transition:background .12s}.sp-unit-row:hover{background:#f7f1e8}.sp-unit-rate{font-size:.6rem;padding:1px 5px;border-radius:5px;min-width:28px;text-align:center}.sp-rate-high{background:#d5f5e3;color:#145a32}.sp-rate-mid{background:#fef9e7;color:#7d6608}.sp-rate-low{background:#fdedec;color:#922b21}.qlabel{display:inline-block;font-size:.6rem;padding:1px 6px;border-radius:7px;margin-left:6px;font-weight:400}.qlabel-review{background:#fdedec;color:#922b21}.qlabel-mastered{background:#d5f5e3;color:#145a32}.qlabel-new{background:#d4e6f1;color:#1a5276}.stats-section{background:#fff;border-radius:10px;padding:16px 18px;margin-bottom:12px;box-shadow:0 1px 6px rgba(0,0,0,.05)}.stats-section-title{font-size:.82rem;color:#5b3a29;margin-bottom:10px}.sb-row{display:flex;align-items:center;gap:8px;margin-bottom:6px}.sb-label{width:40px;font-size:.72rem;color:#6b5a44;text-align:right;flex-shrink:0}.sb-bar-bg{flex:1;height:16px;background:#f0e8dc;border-radius:8px;overflow:hidden}.sb-bar-fill{height:100%;border-radius:8px;transition:width .4s;min-width:4px}.sb-value{width:30px;font-size:.68rem;font-weight:600;text-align:right}.wu-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #f0e8dc}.wu-row:last-child{border-bottom:none}.wu-name{flex:1;font-size:.78rem;color:#3a2210}.wu-rate{font-size:.7rem;font-weight:600;width:36px;text-align:right}.hist-session{padding:6px 0;border-bottom:1px solid #f0e8dc}.hist-sess-header{font-size:.75rem;color:#6b5a44}.wb-item{background:#fff;border-radius:8px;padding:12px 14px;margin-bottom:8px;border-left:3px solid #e74c3c}.wb-header{display:flex;align-items:center;justify-content:space-between}.wb-point{font-size:.8rem;font-weight:600;color:#3a2210}.wb-meta{font-size:.65rem;color:#a09080;margin-top:3px}.wb-rate{font-size:.65rem;padding:1px 6px;border-radius:5px}.wb-rate-low{background:#fdedec;color:#922b21}.wb-rate-mid{background:#fef9e7;color:#7d6608}.wb-rate-high{background:#d5f5e3;color:#145a32}';
    document.head.appendChild(spStyle);
  }
}

function renderStats() {
  injectStatsCss();
  var perf = getPerf();
  var hasPerf = Object.keys(perf).length > 0;
  var hasHistory = quizHistory.length > 0;

  var html = '<div class="stats-container"><h2 style="margin-bottom:14px;color:#5b3a29;font-size:1rem">📊 掌握度统计</h2>';

  // 1. Subject overview horizontal bars
  html += '<div class="stats-section"><h3 class="stats-section-title">科目掌握度概览</h3>';
  var bySubj = perfBySubject();
  var subjOrder = ['s1','s2','3','s4','s5','s6','s7','s8','s9'];
  var subjColors = ['#2980b9','#27ae60','#c0392b','#d4ac0d','#8e44ad','#16a085','#e67e22','#3498db','#2c3e50'];
  html += '<div class="sb-bars">';
  subjOrder.forEach(function(sid, si) {
    var s = subjects.find(function(x) { return x.id === sid; });
    if (!s) return;
    var stats = bySubj[sid];
    var rate = stats && stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
    var color = rate >= 80 ? '#27ae60' : rate >= 60 ? '#d4ac0d' : '#e74c3c';
    html += '<div class="sb-row">' +
      '<div class="sb-label">' + s.name + '</div>' +
      '<div class="sb-bar-bg"><div class="sb-bar-fill" style="width:' + rate + '%;background:' + color + '"></div></div>' +
      '<div class="sb-value" style="color:' + color + '">' + rate + '%</div>' +
    '</div>';
  });
  html += '</div></div>';

  // 2. Accuracy trend chart (SVG)
  html += '<div class="stats-section"><h3 class="stats-section-title">正确率趋势</h3>';
  if (hasHistory && quizHistory.length >= 5) {
    // Group by session (by timestamp proximity, within 5 min = same session)
    var sessions = [];
    var currentSession = [];
    var currentTime = 0;
    quizHistory.slice().reverse().forEach(function(h) { // chronological order
      var t = new Date(h.time).getTime();
      if (currentSession.length === 0 || t - currentTime < 300000) {
        currentSession.push(h);
      } else {
        sessions.push(currentSession);
        currentSession = [h];
      }
      currentTime = t;
    });
    if (currentSession.length > 0) sessions.push(currentSession);
    // Take last 15 sessions max
    if (sessions.length > 15) sessions = sessions.slice(sessions.length - 15);

    var svgW = 600, svgH = 180, pad = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartW = svgW - pad.left - pad.right;
    var chartH = svgH - pad.top - pad.bottom;
    var pts = [];
    sessions.forEach(function(sess, si) {
      var total = sess.length, correct = 0;
      sess.forEach(function(h) { if (h.correct) correct++; });
      var rate = total > 0 ? correct / total : 0;
      pts.push({ x: pad.left + si * chartW / Math.max(sessions.length - 1, 1), y: pad.top + chartH * (1 - rate), rate: Math.round(rate * 100), date: new Date(sess[0].time) });
    });

    // Build SVG polyline and circles
    var polyline = pts.map(function(p) { return p.x + ',' + p.y; }).join(' ');
    var circles = pts.map(function(p) {
      return '<circle cx="' + p.x + '" cy="' + p.y + '" r="3.5" fill="#5b3a29"><title>' + p.date.toLocaleDateString('zh-CN') + ' ' + p.rate + '%</title></circle>';
    }).join('');
    var labels = pts.map(function(p) {
      return '<text x="' + p.x + '" y="' + (svgH - 8) + '" text-anchor="middle" font-size="9" fill="#a09080">' + (p.date.getMonth()+1) + '/' + p.date.getDate() + '</text>';
    }).join('');
    var yLabels = '';
    for (var yi = 0; yi <= 4; yi++) {
      var yv = 100 - yi * 25;
      var yy = pad.top + yi * chartH / 4;
      yLabels += '<text x="' + (pad.left - 6) + '" y="' + (yy + 3) + '" text-anchor="end" font-size="9" fill="#a09080">' + yv + '%</text>';
      yLabels += '<line x1="' + pad.left + '" y1="' + yy + '" x2="' + (svgW - pad.right) + '" y2="' + yy + '" stroke="#eee" stroke-width="0.5"/>';
    }

    html += '<div style="overflow-x:auto;overflow-y:hidden">' +
      '<svg width="' + svgW + '" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '" style="display:block;margin:0 auto">' +
      yLabels +
      '<polyline points="' + polyline + '" fill="none" stroke="#c9a87c" stroke-width="2"/>' +
      circles +
      labels +
      '</svg></div>';
  } else {
    html += '<div style="text-align:center;padding:20px;color:#a09080;font-size:.78rem">完成至少5次练习后这里会出现正确率趋势图</div>';
  }
  html += '</div>';

  // 3. Weak areas highlight
  html += '<div class="stats-section"><h3 class="stats-section-title">&#x26a0; 薄弱板块</h3>';
  var perf2 = getPerf();
  var unitAcc = {};
  subjects.forEach(function(s) {
    s.units.forEach(function(u, ui) {
      var uTotal = 0, uCorrect = 0;
      u.subunits.forEach(function(sub) {
        sub.points.forEach(function(p) {
          var pd = perf2[p.id];
          if (pd && pd.total > 0) {
            uTotal += pd.total;
            uCorrect += pd.correct;
          }
        });
      });
      if (uTotal > 0) {
        unitAcc[s.id + '|' + ui] = { name: s.name + ' · ' + u.unit, rate: Math.round(uCorrect / uTotal * 100), sid: s.id, ui: ui };
      }
    });
  });
  var weakUnits = Object.keys(unitAcc).map(function(k) { return unitAcc[k]; }).sort(function(a, b) { return a.rate - b.rate; }).slice(0, 3);
  if (weakUnits.length > 0) {
    weakUnits.forEach(function(wu) {
      html += '<div class="wu-row">' +
        '<span class="wu-name">' + wu.name + '</span>' +
        '<span class="wu-rate" style="color:' + (wu.rate >= 60 ? '#d4ac0d' : '#e74c3c') + '">' + wu.rate + '%</span>' +
        '<button class="btn-secondary btn-small btn-review-unit" data-sid="' + wu.sid + '" data-ui="' + wu.ui + '">专门复习</button>' +
      '</div>';
    });
  } else {
    html += '<div style="color:#a09080;font-size:.78rem;padding:10px 0">暂无数据，先做一些练习吧</div>';
  }
  html += '</div>';

  // 4. History foldable panel
  html += '<div class="stats-section"><h3 class="stats-section-title" id="histToggle" style="cursor:pointer;user-select:none">📋 查看详细答题记录 <span id="histArrow">&#x25b6;</span></h3>' +
    '<div id="histDetail" style="display:none">';
  if (hasHistory) {
    // Group history into sessions
    var sessions2 = [];
    var cs = [];
    var ct = 0;
    quizHistory.slice().reverse().forEach(function(h) {
      var t = new Date(h.time).getTime();
      if (cs.length === 0 || t - ct < 300000) { cs.push(h); }
      else { sessions2.push(cs); cs = [h]; }
      ct = t;
    });
    if (cs.length > 0) sessions2.push(cs);
    sessions2.reverse().forEach(function(sess) {
      var total = sess.length, correct = 0, subjSet = {};
      sess.forEach(function(h) {
        if (h.correct) correct++;
        if (h.pointId) {
          var f = findPoint(h.pointId);
          if (f) subjSet[f.subject.name] = true;
        }
      });
      var subjList = Object.keys(subjSet).join(', ') || '未知';
      html += '<div class="hist-session"><div class="hist-sess-header">' +
        new Date(sess[0].time).toLocaleString('zh-CN') + ' · ' + subjList +
        ' · <span style="color:' + (correct/total >= 0.7 ? '#27ae60' : '#e74c3c') + '">' + correct + '/' + total + ' (' + Math.round(correct/total*100) + '%)</span></div></div>';
    });
  } else {
    html += '<div style="color:#a09080;font-size:.78rem">暂无答题记录</div>';
  }
  html += '</div></div></div>';

  mainContent.innerHTML = html;

  // Bind history toggle
  var histToggle = document.getElementById('histToggle');
  if (histToggle) {
    histToggle.addEventListener('click', function() {
      var detail = document.getElementById('histDetail');
      var arrow = document.getElementById('histArrow');
      if (detail.style.display === 'none') { detail.style.display = 'block'; arrow.textContent = '\u25bc'; }
      else { detail.style.display = 'none'; arrow.textContent = '\u25b6'; }
    });
  }
  // 薄弱板块"专门复习"按钮：跳转到对应单元（BUG 修复）
  document.querySelectorAll('.btn-review-unit').forEach(function(btn) {
    btn.addEventListener('click', function() {
      jumpToUnit(btn.dataset.sid, parseInt(btn.dataset.ui));
    });
  });
}



window._reviewUnit = function(sid, ui) {
  selectedSubjIds = [sid];
  startQuiz();
};
function renderPractical() {
  mainContent.innerHTML = '<div id="practical-tab" style="min-height:500px"></div>';
  if (typeof window.renderPractical === 'function') window.renderPractical();
}
})();
