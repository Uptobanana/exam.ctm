// mini-quiz-patch.js — 传统医学出师考核 · 模拟诊室交互
// 反馈内容从知识点数据的 <template> 元素读取，完全数据驱动。
// 使用 MutationObserver 自动绑定，不依赖 app.js 注入的 script 标签
(function() {
  'use strict';

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mut) {
      mut.addedNodes.forEach(function(node) {
        if (node.querySelectorAll) {
          var quizzes = node.querySelectorAll('.mini-quiz');
          if (quizzes.length > 0) {
            quizzes.forEach(bindQuiz);
          }
          if (node.classList && node.classList.contains('mini-quiz')) {
            bindQuiz(node);
          }
        }
      });
    });
  });

  function startObserving() {
    var main = document.getElementById('mainContent');
    if (main) {
      observer.observe(main, { childList: true, subtree: true });
      var existing = main.querySelectorAll('.mini-quiz');
      existing.forEach(bindQuiz);
    } else {
      setTimeout(startObserving, 300);
    }
  }
  startObserving();

  function bindQuiz(mq) {
    if (mq.classList.contains('mq-bound')) return;
    mq.classList.add('mq-bound');

    mq.querySelectorAll('.mq-opt').forEach(function(opt) {
      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        if (mq.classList.contains('mq-done')) return;
        mq.classList.add('mq-done');

        var right = opt.dataset.ans === 'right';
        opt.classList.add(right ? 'chosen-right' : 'chosen-wrong');
        mq.querySelectorAll('.mq-opt').forEach(function(o) {
          o.style.pointerEvents = 'none';
        });

        var fb = mq.querySelector('.mq-feedback');
        if (!fb) return;
        fb.style.display = 'block';

        var template = fb.querySelector(right ? '.fb-right' : '.fb-wrong');
        if (template) {
          fb.className = 'mq-feedback ' + (right ? 'fb-right' : 'fb-wrong');
          // 清空容器后，克隆 template 内容填入
          fb.innerHTML = '';
          fb.appendChild(template.content.cloneNode(true));
        }
      });
    });
  }
})();
