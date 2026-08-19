# GitHub Pages 部署指南

以下是手动部署到 GitHub Pages 的步骤，你直接在 Windows 电脑上操作。

---

## 第一步：在 GitHub 上创建一个新仓库

1. 打开浏览器，登录 GitHub（https://github.com）
2. 点击右上角 `+` → `New repository`
3. 仓库名填写：`tcm-exam`（或任何你喜欢的名字）
4. 设为 **Public**
5. 不要勾选任何初始化选项（README、.gitignore、license 都不勾）
6. 点击 `Create repository`

## 第二步：推送本地文件

打开 **命令提示符（CMD）** 或 **PowerShell**，执行：

```bash
cd D:\Work\syllabus

git init
git add .
git commit -m "初始提交：四个阶段全部完成"

git remote add origin https://github.com/你的用户名/tcm-exam.git
git branch -M main
git push -u origin main
```

> 把 `你的用户名` 替换成你的 GitHub 用户名。
> 推送时可能会弹出 GitHub 登录窗口，按提示登录即可。

## 第三步：开启 GitHub Pages

1. 在浏览器中打开你的仓库页面：`https://github.com/你的用户名/tcm-exam`
2. 点击顶部标签栏的 `Settings`
3. 左侧菜单找到 `Pages`（在 `Code and automation` 分类下）
4. 在 **Branch** 下拉框中选择 `main`
5. 文件夹保持 `/ (root)`
6. 点击 `Save`

## 第四步：访问

等待 1-2 分钟，你的页面就会发布在：

```
https://你的用户名.github.io/tcm-exam/
```

用手机浏览器打开这个地址即可访问。PWA 的 `添加到主屏幕` 功能也会正常工作。

---

## 补充说明

- **PWA 离线可用（现已真正生效）**：`index.html` 已注册 Service Worker，`sw.js` 预缓存全部 19 个静态资源（含 9 个科目 js、2 个 json 与核心脚本）。首次通过 **HTTPS 或 localhost** 访问后，断网也能正常使用，且可被「添加到主屏幕」安装为独立应用。
  - ⚠️ **必须用网址打开**：双击 `index.html` 以 `file://` 方式打开时，Service Worker 不会激活（非安全上下文），离线功能将失效。请通过部署后的 https 域名或本地 `localhost` 静态服务器访问。
- **更新内容**：本地改完后，再次执行 `git add . && git commit -m "更新说明" && git push` 即可自动更新
- **HTTPS**：GitHub Pages 自动提供 HTTPS，PWA 所需条件均已满足
