# 01. 整体概览

## 技术栈摘要

- 前端框架：React
  - demo：React 18 + TypeScript（[demo/package.json](file:///workspace/demo/package.json)）
  - zheli-wutong：React 19 + JavaScript（[zheli-wutong/package.json](file:///workspace/zheli-wutong/package.json)）
- 构建工具：Vite（两者均为独立 Vite 工程）
- 样式体系：Tailwind CSS
  - demo：Tailwind v3（[demo/package.json](file:///workspace/demo/package.json#L13-L46)）
  - zheli-wutong：Tailwind v4 + Vite 插件（[zheli-wutong/package.json](file:///workspace/zheli-wutong/package.json#L12-L38)，[vite.config.js](file:///workspace/zheli-wutong/vite.config.js#L1-L20)）
- 路由：react-router-dom
  - demo：BrowserRouter（[App](file:///workspace/demo/src/App.tsx#L1-L49)）
  - zheli-wutong：HashRouter（[main.jsx](file:///workspace/zheli-wutong/src/main.jsx#L1-L13)）
- OCR：tesseract.js（两个项目均有图片→文字能力）
- AI 对话：DeepSeek Chat Completions API
  - demo：在页面内直接 `fetch("https://api.deepseek.com/chat/completions")` 流式解析（[Interact](file:///workspace/demo/src/pages/Interact.tsx#L144-L248)）
  - zheli-wutong：集中封装在 `utils/deepseek.js`（[deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L1-L298)）

## 目录结构

```text
/workspace
  README.md                  # 标题占位
  index.html                 # 静态演示/宣传页（非 Vite 子项目）
  demo/                      # 前端应用 A（React+TS）
    src/
      App.tsx                # 路由入口
      pages/                 # 页面
      components/            # 通用组件（Layout/Splash 等）
      hooks/                 # 自定义 Hook（本地状态）
      data/                  # 本地静态数据（catalog）
      lib/                   # 工具函数
  zheli-wutong/              # 前端应用 B（React+JS）
    src/
      main.jsx               # 入口（HashRouter）
      App.jsx                # 路由入口
      layout/                # 布局（侧边栏/移动端抽屉）
      pages/                 # 页面（Dashboard、Interaction 等）
      context/               # 全局状态（健康画像/体重/聊天）
      utils/                 # 算法/存储/DeepSeek/OCR 封装
```

## 产品形态（从代码推断）

- 根目录 [index.html](file:///workspace/index.html) 是一个“演示平台/介绍页”，用于展示“1+N 智能体矩阵、Agent OS、知识引擎、C 端/B 端场景”的交互式文案与纯前端演示逻辑。
- demo 子项目更接近“移动端单页 Demo”：
  - 以“科普内容 + AI 互动 + OCR 解读报告 + 服务/商品推荐”组成闭环
  - 数据以本地 catalog 形式维护（无后端）
- zheli-wutong 子项目更接近“健康管理平台 Demo”：
  - 健康画像（profile）+ 体重记录/目标 + AI 互动 +（好物/医院/专家/营养师等页面壳）
  - 以 Context + localStorage 作为“准数据层”，便于快速原型验证

