# bilibili极简主页

**简体中文** · [English](README.en.md) · [日本語](README.ja.md)

一个适用于 Chrome 和 Edge 的非官方扩展：把 Bilibili 根首页变成以搜索为中心的简洁页面，同时保留网站原生的搜索和账户入口。

> 本项目与 Bilibili 无关联，也不代表其官方立场。

## 效果预览

| 浅色模式 | 暗色模式 |
| --- | --- |
| ![浅色模式下的极简首页](store-assets/screenshot-1280x800.png) | ![暗色模式下的极简首页](store-assets/screenshot-dark-1280x800.png) |

## 它做了什么

- 仅调整 `https://www.bilibili.com/` 根首页；其他路径保持网站原样。
- 隐藏推荐流、横幅和频道导航，保留并重排原生搜索框、搜索历史、联想和账户入口。
- 隐藏搜索下拉层中的热搜区域；没有历史记录时也不会留下空白下拉框。
- 跟随浏览器的明暗模式。若原生组件未能加载，8 秒后恢复网站原页面。

搜索输入、联想和跳转仍由 Bilibili 网站处理。扩展没有自己的账户系统、统计服务或网络请求。

## 下载与安装

从 [GitHub Releases 下载 v1.2.2 安装包](https://github.com/qikai2007820-svg/bilibili-minimal-home/releases/download/v1.2.2/bilibili-minimal-home-1.2.2.zip)，解压后：

1. 打开 Chrome 的 `chrome://extensions/` 或 Edge 的 `edge://extensions/`。
2. 开启“开发者模式”，点击“加载已解压的扩展程序”。
3. 选择解压后**直接包含 `manifest.json`** 的文件夹。
4. 打开或刷新 Bilibili 根首页。

也可以直接下载本仓库源码，并选择 [`bilibili-minimal-home`](bilibili-minimal-home/) 文件夹加载。更详细的调试说明见[扩展目录 README](bilibili-minimal-home/README.md)。

## 隐私与兼容性

扩展只在浏览器本地检查页面结构和当前地址，不读取搜索框输入值或账户资料，也不保存或上传这些信息。完整说明见[隐私政策](https://qikai2007820-svg.github.io/bilibili-minimal-home/store-assets/privacy-policy.html)。

布局依赖 Bilibili 当前的页面结构；网站改版后可能需要更新选择器。发现问题可在本仓库提交 Issue。
