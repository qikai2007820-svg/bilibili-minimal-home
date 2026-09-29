# bilibili极简主页-隐藏b站(哔哩哔哩)主页推荐

Chrome / Edge Manifest V3 扩展。仅在 `https://www.bilibili.com/` 根首页启用，其他路径保持原样。项目没有构建步骤、外部依赖或额外权限。

这是独立开发的非官方扩展，与 Bilibili 无关联。

## 功能

- 将首页推荐流、Banner、频道导航隐藏，改成中央搜索布局，并按浏览器的明暗模式自动切换配色。
- 原样保留 Bilibili 的搜索表单、输入框、按钮和下拉层；搜索历史、自动补全、联想、键盘行为和跳转由 Bilibili 自身处理。
- 搜索框占位文字显示“你所热爱的，就是你的生活。”；输入和搜索行为仍由原生组件处理。
- 只隐藏下拉层里的“bilibili热搜”区域。
- 没有搜索历史时，热搜隐藏后不显示空白下拉框。
- 复用右侧原生账户入口，包括头像/登录、大会员、消息、动态、收藏、历史、创作中心、投稿；隐藏左侧单独的动态入口。账户状态和角标由 Bilibili 提供。
- 未登录时的原生登录浮层在悬停登录入口时显示，避免遮住首页中央标题。
- 仅在根首页隐藏 Bilibili 的插件影响提示条和多余页头占位。
- 首页开始加载时先显示主题背景，等原生搜索和账户组件就绪再显示极简布局，避免推荐页短暂闪现；若原生组件一直未出现，8 秒后自动恢复网站页面。

## 安装

1. 打开 Chrome 的 `chrome://extensions/` 或 Edge 的 `edge://extensions/`。
2. 打开右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择本目录 `bilibili-minimal-home`（包含 `manifest.json` 的目录）。
4. 打开或刷新 `https://www.bilibili.com/`。如果已有首页标签页，安装后也需要刷新一次。

## 调试

1. 在扩展管理页确认扩展已启用。修改 `content.js`、`style.css` 或 `manifest.json` 后，点击扩展卡片上的“重新加载”，然后刷新 Bilibili 页面。
2. 在 Bilibili 首页按 `F12` 打开 DevTools。Elements 面板中，`<html>` 应带有 `bmh-active`；页面里应只有一个 `#bmh-hero`。搜索表单仍应是 Bilibili 的 `#nav-searchform`。
3. 点击搜索框，检查历史记录和联想；热搜区域不应出现。输入关键词后用方向键和 Enter 验证原生键盘操作及搜索跳转。
4. 打开 `https://www.bilibili.com/video/`、视频详情页或搜索页，确认没有 `bmh-active`，页面保持 Bilibili 原样。用站内跳转返回首页时也应再次启用。
5. 在系统或浏览器设置中切换明暗模式，确认页面配色随 `prefers-color-scheme` 变化。
6. 如果 Bilibili 将来修改首页 DOM，先检查 `#nav-searchform`、`.center-search-container` 和 `.right-entry__main` 是否仍存在，再调整 `content.js` 中的定位逻辑及对应 CSS。

扩展只重排和隐藏页面已有元素，不读取账号信息、不保存搜索记录，也不主动发起搜索请求。Bilibili 改版或未登录状态下，原生组件的显示和功能以网站自身为准。
