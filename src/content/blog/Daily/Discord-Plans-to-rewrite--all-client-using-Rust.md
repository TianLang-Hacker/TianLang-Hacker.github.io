---
title: Discord 放弃使用 Election 技术栈使用 Rust 和 Rust 的 GPUI 重构客户端
description: Discord 使用 Rust 重构客户端
pubDate: 2026-11-18
categories:
  - Daily
tags:
  - Discord
  - Rust
---

## 前情提要
当我在网上冲浪的时候发现 Discord Preview 在 X（Twitter）上发布了一条帖子，说要重写 Discord 客户端，从 Election 迁移到使用 Rust 开发的
原生客户端，Discord 的 CTO Stanislav 也在补充说到他们在 2018 年就已经在使用 Rust 了。他们的终极目标是将整个客户端全部迁移到 Rust 上，
移动端与桌面端共享应用代码，但移动端保留原生UI。

<img src="/image/Discord/Discord_Previews.png" width="876.5" height="484">

*原帖：https://x.com/svishnevskiy/status/2118081920194203799*

## 内存占用

与部分使用的所谓 Rust 技术栈的客户端（前端 Tauri，后端 Rust）不一样，这次使用的是 Zed 编辑器开发的 GPUI 作为前端去编写UI，图上也告诉我
们了抛弃了 Election 转而使用原生 Rust 编写的 GPUI 后内存占用的效果。众所周知平时使用 Discord 的时候随便打开几个对话客户端的内存占用就
会以指数级增长，就跟内存泄漏了一样（虽然一直都有这问题）。这次使用了原生的 Rust 语言去写前端，无须使用 Webview 使用UI（Tauri），无须额外
打包一个浏览器进去（Election）。由于抛弃了这些贵物之后软件响应速度，启动速度均有大幅度提升、内存占用也大幅度下降。Rust 有着严格的内存
管理机制，一旦不再需要内存则会立即释放，不需要手动管理内存或者让多余的内存白白占用掉空间，编译器会处理好一切，几乎可以大幅改善内存泄露
的问题。

## 性能问题

由于是从 Election 迁移到 GPUI，GPUI 的特性就是 GPU 直接绘制 UI，而不是像大部分所谓的浏览器套壳软件一样要使用 Chromium 内核或系统自带的
 Webview一样套个中间层绘制UI，这对于游戏的帧率有很大的帮助。尤其是在高性能笔记本上可以用更协调的电源管理去把功耗分给游戏而不是额外从游
戏分出来点功耗让客户端流畅运行造成游戏卡顿。

## 当下环境
现在全球的生成式人工智能（AI）发展特别迅速，一些企业为了部署本地 AI 大模型，疯狂的去抢购 HBM 内存和通用计算卡，市场需求这么大但产能非常
有限，内存和显卡的价格也水涨船高，为了降低内存占用现在就连微软都在为 Windows 11 27H2 优化内存占用，替换掉那些依赖 Webview 的组件采用了
原生 WinUI 开发（例如 Windows Search、反馈中心等等）。虽然现在 Vibe Coding 已经大众化了，是个人都可以通过 Vibe Coding 来写一个属于自己的
小工具和使用 Vibe Coding 进行辅助开发，大幅缩短开发时间。但也是因为 Vive Coding 流行起来，基于 Rust 技术栈的项目如雨后春笋般冒出，例如
Open Revo(机械革命第三方控制台)、Open Logi（第三方Logitech Options+）、Letcode（基于 Rust 的 命令行 AI Coding Agent）。而这些项目的性能普
遍还算不错，而现在 Windows 的 WinUI 也支持使用 Rust 编写 UI 了，无需 C#/XAML 组合，这对于性能至上的项目来说是个好消息。