# BUG 分析：练习栏目「开始做题」无反应

## 问题定位

经过对 `index.html` 和 `app.js` 完整代码的审查，调用链如下：

1. 用户点击 tab 栏「✏️ 练习」→ 触发 `switchTab('quiz')`
2. `switchTab('quiz')` 检查是否有未完成练习（`loadQuizSession()`）→ 无 → 调用 `showQuizSetup()`
3. `showQuizSetup()` 渲染出题设置面板，包含「🚀 开始做题」按钮，`onclick="window._startQuiz()"`
4. `window._startQuiz()` → 调用 `startQuiz()`
5. `startQuiz()` 核心逻辑：按选中科目构建题库 → 三池加权选题 → 渲染题目

**这段代码在逻辑上没有问题。** 按钮绑定 `window._startQuiz()` 的代码也在 `showQuizSetup()` 外面：

```js
window._startQuiz = function() { startQuiz(); };
```

## 真正的原因

问题出在 JS 文件加载时序，而非业务逻辑。`index.html` 中引用了一组外部 JS：

```html
<script src="app.js"></script>
<script src="mini-quiz-patch.js"></script>
<script src="subjects/s1-zhongji.js"></script>
<script src="subjects/s2-zhongzhen.js"></script>
...
```

但是上传到这里的 **只有 index.html 一个文件**（uploads 目录下没有 app.js、没有 subjects/、没有 mini-quiz-patch.js）。

当你单独打开这个 index.html 时：

- 控制台会出现多个 404 错误（app.js、mini-quiz-patch.js 等全部加载失败）
- `subjects`、`questionBank`、`selectedSubjIds` 全部为空/未初始化
- `showQuizSetup()` 不会执行（`subjects` 为空，生成的界面可能是空的或无反应）
- 实际上连 `switchTab()` 都不会定义——整个 app.js 都没加载

**这就是「点击无反应」的根本原因：所有 JS 文件缺失，页面失去全部交互功能。**

## 解决办法

你的本地项目在 `D:\Work\syllabus\` 是正确的完整项目，包含所有 JS 依赖：

- `app.js`
- `mini-quiz-patch.js`
- `practical-exam.js`
- `subjects/s1~s9 的 9 个 JS 文件`

**正确做法：不要单独打开 index.html，保证所有文件在同一目录下，用浏览器打开 `index.html` 即可。** 因为 `script src` 是相对路径引用，只要所有文件在同一目录结构下，浏览器就能正常加载。

如果你是通过某个服务器或 PWA 来访问，确保部署时把所有 JS 文件一并带上。可以做一个快速检查：在浏览器 DevTools → Console / Network 标签中，确认是否有 JS 404 错误。
