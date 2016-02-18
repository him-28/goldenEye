# goldenEye
trace analysis tool
公司的trace分析工具，可以以树形显示trace中的节点关系，并提供类似视频播放的回放跳转等功能。
页面主要使用bootstrap作为页面布局框架。
使用unslider作为标题轮播的工具。
使用Ztree插件显示树形结构。
使用fontAwe完成按钮的矢量绘制。
使用skinnytip做悬浮文字显示。
简单的table绘制。

index.html为主界面。可下载直接查看。
主要流程是接收后端发送的jason数据，存储到自定义的结构中，通过正则分析，提取所用的树形结构，
然后推送到前端页面显示。使用简单的线性存储。scripts.js中是数据处理的主要脚本。
