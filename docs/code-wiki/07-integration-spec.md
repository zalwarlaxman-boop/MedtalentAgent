# 项目整合设计文档 (Integration Spec)

## 1. 目标
将现有的 `index.html`（含 6 个原生 Tab 的落地页）、`demo` (React 18 + TS + Tailwind v3) 和 `zheli-wutong` (React 19 + JS + Tailwind v4) 彻底合并为一个单一的 React 19 应用基座。

核心要求：
1. **基座选择**：以 `zheli-wutong` 的 React 19 + Vite 为主基座，增加 TypeScript 支持。
2. **页面重构**：将根目录的 `index.html` 重写为 React 布局组件（保留左侧菜单和右侧内容区），Tab 切换通过状态或路由实现。
3. **应用内嵌显示**：
   - Tab 4 (大众端平台，原 mock 区域)：将 `zheli-wutong` 整个应用作为组件树，挂载进一个**模拟电脑浏览器**的容器（Desktop Mockup）中。
   - Tab 5 (医生端定制，原 mock 区域)：将 `demo` 整个应用作为组件树，挂载进一个**模拟手机**的容器（Mobile Mockup）中。
4. **混编兼容**：保留 `demo` 源码的 `.tsx` 和 TS 类型，让 TS 和 JS 代码在同一个 Vite 环境下和谐共存。

## 2. 架构设计

### 2.1 目录结构重组
我们将在基座（现 `zheli-wutong`）的 `src/` 下创建隔离的目录：
```text
/src
  /landing            # 重写自 index.html 的落地页组件（含 Tab、Layout、外壳容器）
  /apps
    /wutong          # 原 zheli-wutong 的业务代码（JS），包含自己的 Context/Router
    /doctor-demo     # 原 demo 的业务代码（TSX），包含自己的 Context/Router
  App.jsx            # 新的根组件：负责渲染 Landing 页
```

### 2.2 路由与状态隔离 (重要！)
由于 `demo` 和 `zheli-wutong` 都有自己独立的路由（React Router `BrowserRouter` 或 `HashRouter`）和全局状态（Context），如果它们被同时挂载或在一个单页中切换，**最容易出现的问题是路由冲突（URL 栏抢占）**。

**解决方案（内存路由 MemoryRouter）**：
- 当 `zheli-wutong` 或 `demo` 作为“桌面/手机壳内的子应用”展示时，它们内部的路由引擎必须改为 **`MemoryRouter`**。
- 这样，它们各自内部的页面跳转不会改变真实浏览器地址栏的 URL，避免了和外部落地页 Tab 切换逻辑的冲突。

### 2.3 Tailwind 与 CSS 作用域冲突
- `demo` 使用的是 Tailwind v3 语法和一些特定的 CSS 重置。
- `zheli-wutong` 使用的是 Tailwind v4。
- **解决方案**：统一升级使用基座的 Tailwind v4。因为 v4 很大程度上向后兼容 v3 的原子类，大部分 `demo` 里的类名（如 `flex`, `p-4`, `text-blue-500`）都能正常工作。对于 v3 特有的配置（如 `tailwind.config.js` 里的自定义颜色），我们需要将其提取并合并到 v4 的 `index.css` 变量系统中。
- 为防止子应用污染外层落地页，外层容器将采用隔离的 className 或 CSS Module。

## 3. 实施步骤规划 (Implementation Plan)

1. **环境与基座准备**
   - 在 `zheli-wutong` 中安装 TS 依赖：`typescript`, `@types/react`, `@types/react-dom`。
   - 增加 `tsconfig.json`。
2. **源码迁移**
   - 把 `demo/src` 整体复制到 `zheli-wutong/src/apps/doctor-demo`。
   - 把 `zheli-wutong/src` 的核心业务（非 `main.jsx`）整理到 `zheli-wutong/src/apps/wutong`。
3. **改造入口与路由引擎**
   - 修改 `wutong` 和 `doctor-demo` 的根组件（`App.jsx/tsx`），将它们顶层的 `BrowserRouter`/`HashRouter` 替换为 `MemoryRouter`。
4. **重构落地页 (Landing Page)**
   - 根据 `index.html`，用 React 编写左侧边栏（Sidebar）和右侧内容区（ContentArea）。
   - 编写 `DesktopMockup` 容器组件，将 `wutong` 的 `<App />` 作为 children 传入。
   - 编写 `MobileMockup` 容器组件，将 `doctor-demo` 的 `<App />` 作为 children 传入。
5. **处理样式和静态资源**
   - 将 `demo` 和原 `index.html` 用到的图片/视频资源移动到基座的 `public` 目录下。
   - 合并全局 CSS。
6. **最终调试**
   - 清理冲突，确保 Tab 切换顺畅，两个壳内的子应用均可独立交互（比如点击手机壳内的按钮跳转内部详情页不影响外部）。

