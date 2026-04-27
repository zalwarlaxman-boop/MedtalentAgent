# 大前端工程合并 (Merge Apps) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `demo` (React 18/TS), `zheli-wutong` (React 19/JS) 和原生的 `index.html` 落地页整合为单一的 React 19 + Vite + Tailwind v4 项目基座（支持 JS/TS 混编），使用 React Router 进行无缝路由切换。

**Architecture:**
以 `zheli-wutong` 为核心基座，在其内部搭建支持 `.tsx` 的编译环境。引入 `react-router-dom` 重写原生 `index.html` 的布局和路由。将 `zheli-wutong` 的业务代码移动到 `src/patient-app`，将 `demo` 的业务代码移动到 `src/doctor-app`。抽取原生 CSS 为全局样式以保持页面外观一致。

**Tech Stack:** React 19, React Router v7, Vite, Tailwind CSS v4, TypeScript.

---

### Task 1: 初始化基座并配置 TypeScript 支持

**Files:**
- Modify: `/workspace/zheli-wutong/package.json`
- Create: `/workspace/zheli-wutong/tsconfig.json`
- Modify: `/workspace/zheli-wutong/vite.config.js`

- [ ] **Step 1: 安装必要依赖**
```bash
cd /workspace/zheli-wutong
npm install react-router-dom framer-motion lucide-react tesseract.js clsx tailwind-merge
npm install -D typescript @types/react @types/react-dom
```

- [ ] **Step 2: 创建 tsconfig.json 支持混合编译**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowJs": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": false,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 调整 Vite 配置以支持别名和 TSX**
修改 `/workspace/zheli-wutong/vite.config.js`，加入 `path` 解析：
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      }
    }
  }
})
```

### Task 2: 迁移与重构代码目录结构

**Files:**
- Move: `/workspace/demo/src/*` -> `/workspace/zheli-wutong/src/doctor-app/`
- Move: `/workspace/zheli-wutong/src/pages/`, `/workspace/zheli-wutong/src/components/`, `/workspace/zheli-wutong/src/layout/`, `/workspace/zheli-wutong/src/context/`, `/workspace/zheli-wutong/src/utils/` -> `/workspace/zheli-wutong/src/patient-app/`

- [ ] **Step 1: 整理 patient-app 目录**
```bash
cd /workspace/zheli-wutong/src
mkdir -p patient-app
mv pages components layout context utils patient-app/
```

- [ ] **Step 2: 迁移 demo 代码为 doctor-app**
```bash
cd /workspace/zheli-wutong/src
mkdir -p doctor-app
cp -r /workspace/demo/src/* doctor-app/
```
*Note: 在这步操作后，原 `demo` 内部的相对引用（例如 `import { cn } from '../lib/utils'`）大部分依然有效，因为它们是一起平移的。但如果使用了相对于 `src` 的绝对路径，可能需要在后续步骤中修复。*

### Task 3: 重构全局路由与 MainPortalLayout (替代 index.html)

**Files:**
- Create: `/workspace/zheli-wutong/src/MainPortalLayout.jsx`
- Modify: `/workspace/zheli-wutong/src/App.jsx`
- Modify: `/workspace/zheli-wutong/src/main.jsx`
- Create: `/workspace/zheli-wutong/src/portal.css`

- [ ] **Step 1: 抽取原生 CSS 到 portal.css**
将原 `/workspace/index.html` 中的 `<style>` 标签内容完整拷贝到 `/workspace/zheli-wutong/src/portal.css` 中。为防止污染全局 Tailwind，给主体包裹一个 `.portal-wrapper` 作用域类（仅对内部生效）。并在文件开头引入 `@import "tailwindcss";`。

- [ ] **Step 2: 编写 MainPortalLayout.jsx**
编写一个包含侧边栏（Sidebar）的 React 组件。利用 `react-router-dom` 的 `NavLink` 或 `useNavigate` 处理菜单点击：
```jsx
import { Outlet, NavLink } from 'react-router-dom';
import './portal.css';

export default function MainPortalLayout() {
  return (
    <div className="portal-wrapper">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"></div>木吾木同 Agent
        </div>
        <ul className="nav-menu">
          <li><NavLink to="/" className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>🏠 首页</NavLink></li>
          <li><NavLink to="/overview" className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>🌐 1+N 智能体矩阵</NavLink></li>
          <li><NavLink to="/os" className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>⚙️ Agent OS 底座</NavLink></li>
          <li><NavLink to="/knowledge" className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>📚 智能健康知识引擎</NavLink></li>
          <li><NavLink to="/patient" className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>👥 面向大众端场景 - 自有平台</NavLink></li>
          <li><NavLink to="/doctor" className={({isActive}) => \`nav-item \${isActive ? 'active' : ''}\`}>⚕️ 面向医生端场景 - 专项定制</NavLink></li>
        </ul>
        <div className="sidebar-footer">
            <p>© 2026 Medtalent Inc.</p>
            <p>生活方式医学 AI 平台</p>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 提取 Tab 0-3 静态组件**
在 `/workspace/zheli-wutong/src/portal-pages/` 目录下创建 `HomeTab.jsx`, `OverviewTab.jsx`, `OsTab.jsx`, `KnowledgeTab.jsx`，将原 `index.html` 中对应的 `<div id="tab-xxx">` HTML 代码转换为 JSX。

- [ ] **Step 4: 配置全局 App.jsx 路由**
修改 `/workspace/zheli-wutong/src/App.jsx`：
```jsx
import { Routes, Route } from 'react-router-dom';
import MainPortalLayout from './MainPortalLayout';
import HomeTab from './portal-pages/HomeTab';
import OverviewTab from './portal-pages/OverviewTab';
import OsTab from './portal-pages/OsTab';
import KnowledgeTab from './portal-pages/KnowledgeTab';
import { HealthDataProvider } from './patient-app/context/HealthDataContext';
import PatientAppLayout from './patient-app/layout/AppLayout';
import Dashboard from './patient-app/pages/Dashboard';
import Interaction from './patient-app/pages/Interaction';
import HealthProfile from './patient-app/pages/HealthProfile';
import WeightTracking from './patient-app/pages/WeightTracking';
import DoctorAppLayout from './doctor-app/components/Layout';
import Copilot from './doctor-app/pages/Copilot';
import Interact from './doctor-app/pages/Interact';
import PopSci from './doctor-app/pages/PopSci';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPortalLayout />}>
        <Route index element={<HomeTab />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="os" element={<OsTab />} />
        <Route path="knowledge" element={<KnowledgeTab />} />
        
        {/* 大众端 (原 zheli-wutong) */}
        <Route path="patient/*" element={
          <HealthDataProvider>
            <PatientAppLayout />
          </HealthDataProvider>
        }>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Interaction />} />
          <Route path="profile" element={<HealthProfile />} />
          <Route path="weight" element={<WeightTracking />} />
        </Route>

        {/* 医生端 (原 demo) */}
        <Route path="doctor/*" element={<DoctorAppLayout />}>
          <Route index element={<Copilot />} />
          <Route path="interact" element={<Interact />} />
          <Route path="popsci" element={<PopSci />} />
          {/* 其他 doctor 路由... */}
        </Route>
      </Route>
    </Routes>
  );
}
```

- [ ] **Step 5: 修改入口 main.jsx**
确保包裹了 `BrowserRouter` 或者是 `HashRouter`。推荐 `BrowserRouter` 配合 Vite。
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './portal.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### Task 4: 解决相对路径与 Tailwind 样式冲突

**Files:**
- Modify: `/workspace/zheli-wutong/src/doctor-app/components/Layout.tsx`
- Modify: `/workspace/zheli-wutong/src/patient-app/layout/AppLayout.jsx`

- [ ] **Step 1: 修复 doctor-app (原 demo) 内部路由**
`demo` 原本的路由是注册在它的 `App.tsx` 中的。现在我们需要将那些嵌套路由移出，并确保 `doctor-app/components/Layout.tsx` 中的导航链接基准路径变为 `/doctor/...`。
例如修改 `<Link to="/">` 为 `<Link to="/doctor">`。

- [ ] **Step 2: 修复 patient-app (原 zheli-wutong) 内部路由**
同样，将 `AppLayout.jsx` 中的导航链接修正为 `/patient/...` 基准。

- [ ] **Step 3: Tailwind CSS 兼容处理**
由于 `demo` 用的是 v3（有些自定义主题色），而我们目前在 `zheli-wutong` 用的是 v4。如果在 `demo/tailwind.config.js` 中有颜色定义（例如 `primary`, `muted` 等），需要在 `portal.css` 的顶部使用 `@theme` 指令进行补充：
```css
@import "tailwindcss";

@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  /* 迁移 demo/tailwind.config.js 里的内容 */
}
```

### Task 5: 清理与构建验证

- [ ] **Step 1: 清理无用文件**
删除原 `/workspace/demo` 目录（已迁移）。
删除原 `/workspace/index.html` 的备份（已重写）。

- [ ] **Step 2: 运行与验证测试**
```bash
cd /workspace/zheli-wutong
npm run dev
```
测试：
1. 访问 `http://localhost:5173/`，验证原生静态页是否正常显示。
2. 侧边栏点击“大众端平台”，URL 变为 `/patient`，页面主体无刷新加载原 `zheli-wutong` Dashboard。
3. 侧边栏点击“医生端定制”，URL 变为 `/doctor`，页面主体无刷新加载原 `demo` Copilot。
4. 验证 `doctor-app` 中 OCR 和流式打字效果是否由于 TS 编译出错而中断（通常不会）。

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: merge demo and zheli-wutong into a single React 19 Monorepo architecture"
```
