# 木吾木同 平台整合项目设计文档 (Design Spec)

## 1. 项目背景与目标
当前项目包含三个独立部分：
1. `index.html`：原生 HTML/CSS 编写的落地页，包含 6 个 Tab（含 2 个模拟演示区）。
2. `demo`：医生端（Tab 5）的真实前端应用，技术栈为 React 18 + TypeScript + Tailwind v3。
3. `zheli-wutong`：大众端（Tab 4）的真实前端应用，技术栈为 React 19 + JavaScript + Tailwind v4。

**整合目标**：将三者彻底合并为一个单一的 React 项目。以 `zheli-wutong` 为主基座，将 `index.html` 的结构用 React 重写作为外层容器，并在 Tab 4 和 Tab 5 中分别使用“电脑外壳”和“手机外壳”真实挂载大众端和医生端的组件，按比例缩放，并保证两者路由独立（MemoryRouter 隔离）。

---

## 2. 架构与技术栈选择
- **主基座**：`zheli-wutong` (React 19 + Vite)
- **样式**：Tailwind CSS v4 (基座自带) + CSS Modules / 作用域 CSS (隔离原生 index.html 样式)
- **语言**：JavaScript (主基座) + TypeScript (混编支持 demo 的代码)
- **路由方案**：
  - **外层主路由**：普通 React State 切换（因为是单页 Tab 形式，也可选 HashRouter，这里为了还原 index.html 体验，使用 State 控制 Active Tab 最为平滑）。
  - **内层子应用路由**：使用 `react-router-dom` 的 `<MemoryRouter>`。由于 Tab 4 和 Tab 5 是在模拟窗口中运行，使用内存路由可以保证子应用内部页面跳转时，浏览器的真实 URL 不发生改变，互不干扰。

---

## 3. 合并执行步骤

### 步骤一：基座环境改造 (初始化)
1. 在 `zheli-wutong` 项目中，配置 `vite.config.js` 增加对 TypeScript 的支持（如 `@vitejs/plugin-react`）。
2. 添加 `tsconfig.json`（可从 `demo` 复制并精简）。
3. 将 `demo/package.json` 中的关键依赖（`tesseract.js`, `lucide-react`, `framer-motion` 等）合并至 `zheli-wutong`，执行 `npm install`。

### 步骤二：重构原生 index.html 容器
1. 将 `index.html` 的 HTML 骨架转换为 React 组件（如 `MainLayout.jsx`）。
2. 将原生 CSS（包含 Sidebar、Hero、Tab 等）抽离为 `src/styles/portal.css`。为了防止与内部子应用的 Tailwind 样式产生冲突，给外层容器增加一个命名空间类名（如 `.portal-root`），并在 CSS 中限定作用域（`.portal-root .card { ... }`）。
3. Tab 1, 2, 3, 6 的静态内容直接转写为对应的静态 React 组件。

### 步骤三：迁移与挂载大众端 (Tab 4: zheli-wutong)
1. **现有架构调整**：将 `zheli-wutong` 原有的 `<AppLayout>` 和页面组件从入口提出来。
2. **模拟框封装**：新建 `<MacbookMockup>` 组件，模拟电脑屏幕，并支持传入 `scale` 属性按比例缩放（`transform: scale(...)`）。
3. **挂载**：在 Tab 4 的内容区中，引入 `<MacbookMockup>`，其 `children` 为包有 `<MemoryRouter>` 的大众端应用路由组件 `<PatientApp>`。

### 步骤四：迁移与挂载医生端 (Tab 5: demo)
1. **代码迁移**：将 `/workspace/demo/src` 下的所有内容拷贝至 `/workspace/zheli-wutong/src/doctor-demo`。
2. **处理依赖差异**：确保 `demo` 中引用的 `cn` 工具类和 Tailwind 类名在 Tailwind v4 下正常工作（可能需要微调少数废弃的工具类）。
3. **模拟框封装**：新建 `<MobileMockup>` 组件，复用并优化原有的 `.mobile-mockup` CSS，支持缩放。
4. **挂载**：在 Tab 5 中，引入 `<MobileMockup>`，其 `children` 为包有 `<MemoryRouter>` 的医生端应用路由组件 `<DoctorApp>`。

---

## 4. 关键挑战与解决方案

1. **Tailwind 版本冲突（v3 vs v4）**：
   - 方案：`demo` 使用的是 v3，`zheli-wutong` 使用的是 v4。我们统一使用 v4。迁移时如果遇到 v3 特有的配置（如 `tailwind.config.js` 中的自定义颜色），需要转移到 v4 的 CSS 变量体系中（`@theme`）。
2. **原生 CSS 污染 React 组件**：
   - 方案：`index.html` 原有大量的标签选择器（如 `table`, `h1`, `p`）。必须将其包裹在一个严格的父类选择器下（如 `.portal-root p { ... }`），防止污染内部嵌的 React 组件。
3. **Mockup 内部组件缩放导致交互偏移**：
   - 方案：使用 `transform: scale()` 进行缩放时，结合 `transform-origin: top center;`。对于大多数标准交互（点击、滚动），现代浏览器对 transform 缩放的支持已经很完善。如有绝对定位弹窗，需确保其相对父容器（而非 window）定位。

---

## 5. 文件结构调整后预览
```text
/workspace/zheli-wutong/
  ├── src/
  │    ├── main.jsx             # 新的入口文件，挂载 MainLayout
  │    ├── portal/              # 原 index.html 转换的页面组件
  │    │    ├── MainLayout.jsx
  │    │    ├── TabHome.jsx
  │    │    ├── TabOverview.jsx
  │    │    ├── portal.css      # 作用域限定的原生样式
  │    │    └── components/     # Mockup 框组件 (MacbookMockup, MobileMockup)
  │    ├── patient-app/         # 原 zheli-wutong 的代码 (大众端)
  │    │    ├── App.jsx         # 内部使用 MemoryRouter
  │    │    ├── pages/
  │    │    └── ...
  │    ├── doctor-demo/         # 原 demo 的代码迁移过来 (医生端, TSX)
  │    │    ├── App.tsx         # 内部使用 MemoryRouter
  │    │    ├── pages/
  │    │    └── ...
  ├── vite.config.js            # 配置 TS 和 React 插件
  ├── package.json              # 合并后的依赖
  └── ...
```