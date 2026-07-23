# 侠小然的灵感工坊

思路与创意的设计空间。

## 功能

用来记录和展示各种个人创意。不管是桌游设计、旅行攻略，还是其他什么奇奇怪怪的想法，都可以在这里写成文档、整理归档，方便以后回顾或者找人一起讨论。

- 按分类浏览创意项目，每个创意带有设计阶段标记
- 每个创意可以包含多篇 Markdown 文档，支持内容目录导航
- 暗色主题

## 技术

- 基于 Vue 3 组合式 API + 约定式路由构建
- 纯前端，零后端依赖，内容以 Markdown 文件管理
- 自研 Markdown 渲染插件，增加了自定义样式的扩展：
  - alert 提示块
  - class-view 自定义样式区块
  - validity-tag 时效性标签
  - meta 元数据区块

## 许可协议

本项目采用**双重许可**：

- **源代码和文档**（`src/ideas/` 目录除外）：基于 [MIT License](./LICENSE) 授权
- **创意内容**（`src/ideas/` 目录下的所有文件）：基于 [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) 授权，详见 [`src/ideas/LICENSE`](./src/ideas/LICENSE)
