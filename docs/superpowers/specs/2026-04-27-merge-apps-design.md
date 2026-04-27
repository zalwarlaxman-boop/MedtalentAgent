# 整合方案设计：统一大前端工程基座

## 1. 目标
将原有的独立三部分：`index.html`（原生静态页，包含 6 个 Tab）、`demo`（基于 React 18 + TS + Tailwind v3，医生端业务）、`zheli-wutong`（基于 React 19 + JS + Tailwind v4，大众端业务），彻底合并为一个单一的 React Monorepo/项目。

目标：实现从官网首页导航到子应用时的无缝 React 组件挂载，而不是通过 Iframe 或 Nginx 路由强跳转。

## 2. 基础架构决策
*   **主基座**：选择 `zheli-wutong` 现有的环境为核心基座（React 19 + Vite + Tailwind CSS v4），因为它采用最新的构建工具和 CSS 引擎。
*   **语言支持**：在 `zheli-wutong` 中接入 TypeScript 编译能力（引入 `@types/react`，配置 `tsconfig.json`），允许 `.jsx` 与 `.tsx` 混编。这让我们能够将 `demo` 中的 TS 文件直接无缝复制进来。
*   **UI 与样式体系**：
    *   将 `index.html` 原有的 CSS（根作用域、动画、卡片样式）抽取为全局 CSS 文件。
    *   保留 `zheli-wutong` 和 `demo` 各自的 Tailwind 原子类。由于 Tailwind v4 是即时编译且向下兼容，大多数类名会直接生效。
*   **路由管理 (React Router)**：
    *   使用一套全局的 HashRouter 或者是 BrowserRouter 来接管 `index.html` 原本靠 JS 显隐 Tab 的行为。
    *   `Layout`: 负责渲染原先的 Sidebar 和 主体容器（Main Content）。
    *   `Routes`: 
        *   `/` 或 `/home`: 对应 Tab 0 首页内容。
        *   `/overview`: 对应 Tab 1 内容。
        *   `/os`: 对应 Tab 2 内容。
        *   `/knowledge`: 对应 Tab 3 内容。
        *   `/patient/*`: 挂载 `zheli-wutong` 的原入口 `<AppLayout />`（包含内部的 Dashboard / Chat / 体重管理 路由）。
        *   `/doctor/*`: 挂载 `demo` 的原入口 `<Layout />`（包含内部的 Copilot / PopSci / 交互页）。

## 3. 核心改造步骤

### 3.1 环境初始化与基座升格
1. 在 `zheli-wutong` 项目中安装 TS 依赖：`npm install -D typescript @types/react @types/react-dom`
2. 建立 `tsconfig.json`（支持 `src` 下的混合编译）
3. 确保 `vite.config.js` 能够同时处理 `.js`, `.jsx`, `.ts`, `.tsx`。
4. 将 `index.html` 迁移重写为 `src/layout/MainPortalLayout.jsx`（负责侧边栏渲染）。

### 3.2 合并代码文件
1. **移植 demo 代码**：将 `demo/src` 目录重命名并迁移到 `zheli-wutong/src/doctor-app` 下。
2. **重构 zheli-wutong 代码层级**：将原 `zheli-wutong/src/pages` 等归纳到 `zheli-wutong/src/patient-app` 下，并重构其内部路由。
3. **合并依赖**：将 `demo/package.json` 中的关键依赖（如 `tesseract.js`, `lucide-react`, `framer-motion`）合并进基座的 `package.json` 并执行安装。

### 3.3 路由与状态整合
创建顶层路由文件 `src/App.jsx`：
```jsx
<Routes>
    <Route path="/" element={<MainPortalLayout />}>
        {/* 静态页 */}
        <Route index element={<HomeTab />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="os" element={<OsTab />} />
        <Route path="knowledge" element={<KnowledgeTab />} />

        {/* 大众端平台 (Zheli Wutong) */}
        <Route path="patient/*" element={
            <HealthDataProvider>
                <PatientAppRoutes />
            </HealthDataProvider>
        } />

        {/* 医生端定制 (Demo) */}
        <Route path="doctor/*" element={<DoctorAppRoutes />} />
    </Route>
</Routes>
```

### 3.4 处理 Tailwind 与 CSS 冲突
1. 检查 `demo` 中是否有自定义在 `tailwind.config.js` 中的颜色或插件（比如特定的蓝色主色调）。将这些定制变量迁移到 `zheli-wutong/src/index.css`（遵循 Tailwind v4 的 `@theme` 写法）。
2. 将原 `index.html` 的 CSS 手动拷贝到全局样式中。为防止污染子应用的样式，可以使用 CSS Module 或者通过增加一个类前缀（如 `.portal-wrapper`）来限制原生 CSS 作用域。

## 4. 验证标准
* 根目录下执行 `npm run dev`（基座），访问主页能够看到原有的侧边栏与静态页面。
* 点击侧边栏导航能够切换页面内容。
* 点击“大众端平台”进入原 `zheli-wutong` 界面，各项功能（聊天、OCR、状态共享）正常工作。
* 点击“医生端定制”进入原 `demo` 界面，各项功能（科普、报告识别）正常工作。
* 浏览器控制台无严重的 React 报错与路由冲突警告。
