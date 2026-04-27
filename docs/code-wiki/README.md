# Code Wiki（MedtalentAgent）

本 Wiki 面向仓库维护者/二次开发者，目标是用“代码视角”解释清楚该仓库的结构、关键模块与运行方式，便于快速上手定位与扩展。

## 仓库概览

该仓库由三部分组成：

- 根目录静态演示页：[/workspace/index.html](file:///workspace/index.html)
- 前端应用 A（移动端风格单页，React + TS）：[/workspace/demo](file:///workspace/demo)
- 前端应用 B（健康管理平台单页，React + JS）：[/workspace/zheli-wutong](file:///workspace/zheli-wutong)

两个子项目互相独立（各自的 `package.json`、依赖、构建产物、启动命令），当前仓库未发现后端服务代码。

## 文档导航

- [01-整体概览](file:///workspace/docs/code-wiki/01-overview.md)
- [02-架构与核心流程](file:///workspace/docs/code-wiki/02-architecture.md)
- [03-demo 子项目（React+TS）](file:///workspace/docs/code-wiki/03-demo-app.md)
- [04-zheli-wutong 子项目（React+JS）](file:///workspace/docs/code-wiki/04-zheli-wutong-app.md)
- [05-依赖与配置](file:///workspace/docs/code-wiki/05-dependencies.md)
- [06-运行与部署](file:///workspace/docs/code-wiki/06-runbook.md)

## 约定

- 代码链接统一使用 `file://` 形式，便于在 IDE/浏览器中直达源码。
- 本仓库的 AI 能力依赖 DeepSeek 接口，Key 通过 Vite 环境变量注入；文档中不会记录任何真实密钥。

