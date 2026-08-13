# 工作令 C — 模块五（PWA 离线化 + 移动端适配）

> 本文件配合 `DESIGN_MASTER.md` 使用。开工前先读 DESIGN_MASTER.md，再读本文件，再读 PROJECT_HANDOVER.md。
>
> **依赖**：阶段 A 和 B 均已完成。阶段 C 需要读取 A 和 B 的成果来对齐 index.html 中的 Tab 栏、容器 ID 和 script 引用。

---

## 总览

阶段 C 负责 PWA 改造和移动端适配。核心是让应用在手机上可用、可安装、完全离线可运行。

**新增文件**：
- `manifest.json` — PWA 应用清单（~500 字节）
- `sw.js` — Service Worker 缓存策略（~2KB）

**修改文件**：
- `index.html` — 引入 manifest、注册 Service Worker、CSS 响应式适配、新增 DOM 容器和 script 引用（为窗口 A/B 预留）

## 前置约束

- 阶段 C 独占 index.html 写权限
- 开工前必须读完阶段 A 和 B 的最终交付物，确认 app.js 中的 Tab 名称数组、practical-exam.js 的入口函数签名
- 修改 index.html 时需为阶段 A、B 的成果补齐 DOM 容器和 script 引用

---

## 任务一：新增 `manifest.json`

路径：`D:\Work\syllabus\manifest.json`

```json
{
  "name": "中医出师考核备考工具",
  "short_name": "出师备考",
  "description": "传统医学出师考核一站式学习工具",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#f5f0eb",
  "theme_color": "#8b4513",
  "orientation": "any",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**注意**：如果暂时没有图标文件，可以先不设置 icons 数组，或者用 emoji 生成临时 SVG 图标。建议后续制作正式图标。

临时方案（无图标文件的降级）：
```json
{
  "name": "中医出师考核备考工具",
  "short_name": "出师备考",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#f5f0eb",
  "theme_color": "#8b4513"
}
```

---


---

## 任务二：新增 `sw.js`

路径：`D:\Work\syllabus\sw.js`

```js
var CACHE_NAME = 'tcm-exam-v1';
var CACHE_URLS = [
  './',
  './index.html',
  './app.js',
  './mini-quiz-patch.js'
];

// 安装：预缓存核心文件
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // 预先缓存已知的核心文件
      return Promise.all(
        CACHE_URLS.map(function(url) {
          return fetch(url).then(function(response) {
            if (response.ok) return cache.put(url, response);
          }).catch(function() {
            // 网络不可用时跳过
          });
        })
      );
    })
  );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
});

// 请求拦截：Cache-First 策略
self.addEventListener('fetch', function(event) {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 对 HTML 页面优先网络（Network-First），其他资源优先缓存（Cache-First）
  var isHtml = event.request.headers.get('accept') && 
               event.request.headers.get('accept').indexOf('text/html') !== -1;

  if (isHtml) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        // 返回缓存，同时后台更新
        var fetchPromise = fetch(event.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
          return response;
        }).catch(function() {});

        return cached || fetchPromise;
      })
    );
  }
});
```

---

## 任务三：修改 index.html

### 3.1 在 `<head>` 中添加 PWA 支持

```html
<link rel="manifest" href="./manifest.json">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#8b4513">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="出师备考">
```

### 3.2 在 `</body>` 前添加 Service Worker 注册

```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(function(reg) { console.log('SW registered'); })
    .catch(function(err) { console.log('SW failed:', err); });
}
</script>
```

### 3.3 CSS 响应式适配

在现有 `<style>` 块末尾添加媒体查询（断点 768px）：

```css
@media (max-width: 768px) {
  /* 整体容器 */
  body { padding: 8px; font-size: 15px; }

  /* 顶部标题栏 */
  .header h1 { font-size: 20px; }

  /* Tab 栏 */
  .tabs { flex-wrap: wrap; gap: 4px; }
  .tabs button { padding: 8px 12px; font-size: 13px; min-width: unset; flex: 1 1 auto; }

  /* 知识卡片 */
  .card { padding: 12px; margin: 8px 0; }
  .card-title { font-size: 16px; }

  /* 练习选项：增大点击区域 */
  .q-option { padding: 14px 12px; margin: 6px 0; min-height: 44px; font-size: 15px; }

  /* 侧边栏改为顶部下拉或隐藏 */
  .sidebar { width: 100%; max-width: none; position: static; }
  .content { margin-left: 0; }

  /* 表格横向滚动 */
  .compare-table, table { display: block; overflow-x: auto; }

  /* 统计图表 */
  .bar-chart .bar-label { font-size: 12px; }

  /* 错题本卡片 */
  .wrong-card { padding: 10px; margin: 6px 0; }

  /* 阶段卡片 */
  .stage-card { padding: 12px; margin: 8px 0; }
}
```

完整的响应式适配需要根据 index.html 的实际 CSS 结构调整。上述为基础框架，实际修改时需阅读 index.html 当前样式做针对性适配。

**核心原则：**
- 触控目标最小 44×44px（Apple HIG 标准）
- 字号不小于 14px（iOS 自动缩放阈值）
- 避免 `position: fixed` 在小屏上的遮挡问题
- 横向溢出的表格和宽内容需要 `overflow-x: auto`

### 3.4 适配已完成阶段的成果

阶段 C 开工时，阶段 A 和 B 已交付。需根据实际交付物做以下适配：

**适配阶段 A 的 Tab 按钮和容器：**

查看 app.js 中实际的 Tab 名称数组，在 index.html 的 Tab 栏中添加对应的按钮（放在现有 Tab 之后）。预期结构：
```html
<button onclick="switchTab('study')" class="tab-btn" id="tab-study">📖 学习</button>
<button onclick="switchTab('studyPlan')" class="tab-btn" id="tab-studyPlan">📋 学习路线</button>
<button onclick="switchTab('quiz')" class="tab-btn" id="tab-quiz">📝 练习</button>
<button onclick="switchTab('wrongBook')" class="tab-btn" id="tab-wrongBook">📕 错题本</button>
<button onclick="switchTab('stats')" class="tab-btn" id="tab-stats">📊 统计</button>
<button onclick="switchTab('practical')" class="tab-btn" id="tab-practical">🏥 实践备考</button>
```

在主内容区域添加对应的容器 div。预期结构：
```html
<div id="tab-study" class="tab-content"></div>
<div id="tab-studyPlan" class="tab-content"><div id="study-plan-container"></div></div>
<div id="tab-quiz" class="tab-content"></div>
<div id="tab-wrongBook" class="tab-content"><div id="wrong-book-container"></div></div>
<div id="tab-stats" class="tab-content"><div id="stats-container"></div></div>
<div id="tab-practical" class="tab-content"><div id="practical-tab"></div></div>
```

**适配阶段 B 的 script 引用：**

在 index.html 底部引入 B 的渲染引擎和 A 的 JSON 数据：
```html
<script src="practical-exam.js"></script>
```

如果阶段 A 选择用 fetch 方式加载 study-plan.json，则无需额外处理。如果选择用 `window.STUDY_PLAN` 全局变量，则在此处内联加载。

## 阶段 C 与阶段 A 的协调

阶段 A 完工后 app.js 中的 switchTab 函数已处理所有新增 Tab 名称。阶段 C 在 index.html 中建立的 Tab 按钮 onclick 和容器 ID 必须与阶段 A 交付的 Tab 名称完全一致。开工第一步：读 app.js，确认 `tabs` 数组中的确切 Tab 名称，以此为准调整 HTML。

---

## 验证清单

- [ ] `manifest.json` JSON 语法合法
- [ ] `sw.js` JS 语法合法（`node --check sw.js`）
- [ ] `index.html` 浏览器中正常打开
- [ ] Chrome DevTools → Application → Manifest 显示正确
- [ ] Chrome DevTools → Application → Service Workers 显示已注册
- [ ] 手机端（或 Chrome DevTools 移动模拟）打开：布局正常，Tab 可切换
- [ ] 断网测试：关闭网络后刷新，所有内容仍可访问
- [ ] 「添加到主屏幕」提示出现（或手动操作可添加）
