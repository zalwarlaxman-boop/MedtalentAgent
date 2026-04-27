# 木吾木同 平台整合项目 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将原生 HTML (index.html) 转换为 React 应用，并在其内部的模拟设备框中使用 `MemoryRouter` 分别挂载大众端 (zheli-wutong) 和医生端 (demo) 两个子应用。

**Architecture:** 以 `zheli-wutong` 为主基座，升级其构建配置以兼容 TS (供 demo 使用)。将 `index.html` 转换为 React 的 `MainLayout`，其 CSS 限定在 `.portal-root` 作用域内。分别重构两个子应用的入口使用 `MemoryRouter`，然后将它们嵌入到 `MainLayout` 中。

**Tech Stack:** React 19, Vite, Tailwind CSS v4, React Router DOM, JavaScript, TypeScript

---

### Task 1: 初始化基座环境与依赖合并

**Files:**
- Modify: `/workspace/zheli-wutong/package.json`
- Modify: `/workspace/zheli-wutong/vite.config.js`
- Create: `/workspace/zheli-wutong/tsconfig.json`

- [ ] **Step 1: 合并依赖到 zheli-wutong/package.json**

将 `demo` 中的关键依赖加入到 `zheli-wutong`，包括 `typescript`, `@types/react`, `@types/react-dom`, `lucide-react`, `framer-motion`, `tesseract.js`, `clsx`, `tailwind-merge`, `react-router-dom`。

```bash
cd /workspace/zheli-wutong
npm install lucide-react framer-motion tesseract.js clsx tailwind-merge react-router-dom
npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react
```

- [ ] **Step 2: 升级 vite.config.js 兼容 TS**

修改 `/workspace/zheli-wutong/vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, '')
      }
    }
  }
})
```

- [ ] **Step 3: 添加 tsconfig.json**

创建 `/workspace/zheli-wutong/tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```
并且创建 `/workspace/zheli-wutong/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

### Task 2: 提取并重构 index.html 为 Portal 组件

**Files:**
- Create: `/workspace/zheli-wutong/src/portal/portal.css`
- Create: `/workspace/zheli-wutong/src/portal/MainLayout.jsx`
- Modify: `/workspace/zheli-wutong/src/main.jsx`
- Modify: `/workspace/zheli-wutong/index.html`

- [ ] **Step 1: 提取原生 CSS 并增加作用域**

创建 `/workspace/zheli-wutong/src/portal/portal.css`，将原 `/workspace/index.html` 中的 `<style>` 内容拷贝过来，并使用 `.portal-root` 包裹所有原生选择器以防污染。

```css
.portal-root {
  --primary: #165DFF;
  --primary-dark: #0E42D2;
  /* ...原变量... */
  font-family: var(--font-body);
  background-color: var(--bg-color);
  color: var(--text-main);
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.portal-root * { margin: 0; padding: 0; box-sizing: border-box; }
.portal-root .sidebar { /* ... */ }
/* ...其它所有原 CSS 类均加上 .portal-root 前缀... */
```

- [ ] **Step 2: 转换 HTML 为 MainLayout.jsx**

创建 `/workspace/zheli-wutong/src/portal/MainLayout.jsx`：

```jsx
import React, { useState } from 'react';
import './portal.css';

// 预留的子组件导入
// import PatientApp from '../patient-app/App';
// import DoctorApp from '../doctor-demo/App';

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('tab-home');

  const tabs = [
    { id: 'tab-home', icon: '🏠', label: '首页' },
    { id: 'tab-overview', icon: '🌐', label: '1+N 智能体矩阵' },
    { id: 'tab-os', icon: '⚙️', label: 'Agent OS 底座' },
    { id: 'tab-knowledge', icon: '📚', label: '智能健康知识引擎' },
    { id: 'tab-c-end', icon: '👥', label: '面向大众端场景 - 自有平台' },
    { id: 'tab-b-end', icon: '⚕️', label: '面向医生端场景 - 专项定制' },
  ];

  return (
    <div className="portal-root">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon"></div>木吾木同 Agent
        </div>
        <ul className="nav-menu">
          {tabs.map(tab => (
            <li 
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <p>© 2026 Medtalent Inc.</p>
          <p>生活方式医学 AI 平台</p>
        </div>
      </div>
      <div className="main-content">
        {/* 这里渲染原 Tab1-3 的静态内容，以及 Tab4/5 的动态组件 */}
        {activeTab === 'tab-home' && <div>...原tab-home内容...</div>}
        {activeTab === 'tab-c-end' && (
          <div className="tab-content active">
             {/* 占位: MacbookMockup -> PatientApp */}
          </div>
        )}
        {activeTab === 'tab-b-end' && (
          <div className="tab-content active">
             {/* 占位: MobileMockup -> DoctorApp */}
          </div>
        )}
      </div>
    </div>
  );
}
```
*(注：实际执行时需要将 `index.html` 的所有 HTML 内容转化为 JSX，替换 `class` 为 `className`，`style="xxx"` 替换为对象形式)*

- [ ] **Step 3: 更新入口文件**

修改 `/workspace/zheli-wutong/src/main.jsx`，挂载 `MainLayout`：

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MainLayout from './portal/MainLayout';
import './index.css'; // Tailwind 基础样式

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>
);
```

---

### Task 3: 迁移并封装大众端 (zheli-wutong)

**Files:**
- Create: `/workspace/zheli-wutong/src/portal/components/MacbookMockup.jsx`
- Modify: `/workspace/zheli-wutong/src/App.jsx` -> `/workspace/zheli-wutong/src/patient-app/App.jsx` (移动原有逻辑)

- [ ] **Step 1: 创建 MacbookMockup 组件**

```jsx
import React from 'react';

export default function MacbookMockup({ children }) {
  return (
    <div style={{
      width: '100%', maxWidth: '1200px', margin: '0 auto',
      background: '#e0e0e0', padding: '12px 12px 0 12px',
      borderRadius: '16px 16px 0 0', border: '2px solid #ccc',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', height: '800px'
    }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
      </div>
      <div style={{
        flex: 1, background: '#fff', borderRadius: '8px 8px 0 0',
        overflow: 'hidden', position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 整理 zheli-wutong 原有结构至 patient-app**

将原 `/workspace/zheli-wutong/src/App.jsx` 重命名并移动至 `/workspace/zheli-wutong/src/patient-app/App.jsx`。
将其中的 `HashRouter` 替换为 `MemoryRouter`：

```jsx
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import HealthProfile from '../pages/HealthProfile';
import Interaction from '../pages/Interaction';
import WeightTracking from '../pages/WeightTracking';
import { HealthDataProvider } from '../context/HealthDataContext';

function PatientApp() {
  return (
    <HealthDataProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<HealthProfile />} />
            <Route path="interaction" element={<Interaction />} />
            <Route path="weight" element={<WeightTracking />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </HealthDataProvider>
  );
}

export default PatientApp;
```

---

### Task 4: 迁移并封装医生端 (demo)

**Files:**
- Create: `/workspace/zheli-wutong/src/portal/components/MobileMockup.jsx`
- Run: `cp -r /workspace/demo/src/* /workspace/zheli-wutong/src/doctor-demo/`
- Modify: `/workspace/zheli-wutong/src/doctor-demo/App.tsx`

- [ ] **Step 1: 拷贝 demo 代码**

```bash
mkdir -p /workspace/zheli-wutong/src/doctor-demo
cp -r /workspace/demo/src/* /workspace/zheli-wutong/src/doctor-demo/
```

- [ ] **Step 2: 创建 MobileMockup 组件**

```jsx
import React from 'react';

export default function MobileMockup({ children }) {
  return (
    <div style={{
      width: '375px', height: '812px', margin: '0 auto',
      border: '14px solid #1a1a1a', borderRadius: '40px',
      background: '#fff', position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      transform: 'scale(0.9)', transformOrigin: 'top center'
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '150px', height: '30px', background: '#1a1a1a',
        borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 50
      }} />
      <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 修改 DoctorApp 入口**

修改 `/workspace/zheli-wutong/src/doctor-demo/App.tsx`，将 `BrowserRouter` 替换为 `MemoryRouter`：

```tsx
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PopSci from './pages/PopSci';
import PopSciDetail from './pages/PopSciDetail';
import Interact from './pages/Interact';
import Service from './pages/Service';
import ServiceDetail from './pages/ServiceDetail';
import ContentDetail from './pages/ContentDetail';
import Faq from './pages/Faq';
import Me from './pages/Me';

export default function DoctorApp() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PopSci />} />
          <Route path="popsci/:id" element={<PopSciDetail />} />
          <Route path="interact" element={<Interact />} />
          <Route path="service" element={<Service />} />
          <Route path="service/:id" element={<ServiceDetail />} />
          <Route path="content/:id" element={<ContentDetail />} />
          <Route path="faq" element={<Faq />} />
          <Route path="me" element={<Me />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
```

---

### Task 5: 最终组装与清理

**Files:**
- Modify: `/workspace/zheli-wutong/src/portal/MainLayout.jsx`
- Run: `npm run dev`

- [ ] **Step 1: 在 MainLayout 中引入子应用**

在 `MainLayout.jsx` 中：
```jsx
import PatientApp from '../patient-app/App';
import DoctorApp from '../doctor-demo/App';
import MacbookMockup from './components/MacbookMockup';
import MobileMockup from './components/MobileMockup';

// 在对应的 Tab 渲染处：
{activeTab === 'tab-c-end' && (
  <div className="tab-content active" style={{ padding: '40px 0' }}>
     <MacbookMockup>
        <PatientApp />
     </MacbookMockup>
  </div>
)}
{activeTab === 'tab-b-end' && (
  <div className="tab-content active" style={{ padding: '40px 0' }}>
     <MobileMockup>
        <DoctorApp />
     </MobileMockup>
  </div>
)}
```

- [ ] **Step 2: 解决类名冲突 (如 cn 工具类)**
确保 `zheli-wutong/src/doctor-demo/components/Layout.tsx` 或其引用的 `cn` (通常在 `lib/utils.ts` 中) 能够正常合并 Tailwind v4 样式。因为 `tailwind-merge` 兼容 v4，所以通常无需修改，只要保证路径正确即可。

- [ ] **Step 3: 测试并启动**
运行 `npm run dev`，检查页面结构是否完整，Tab 切换是否顺畅，内部的路由点击是否会影响外部。

---
