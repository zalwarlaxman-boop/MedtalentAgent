# 05. 依赖与配置

## Node / 包管理

- 两个子项目都使用 npm（存在 `package-lock.json`）
- Node 版本未在仓库中锁定（未发现 `.nvmrc` / `volta` / `engines` 字段）

建议：

- 本地开发优先使用较新的 Node LTS（与 Vite 6/8 兼容）
- 使用 `npm ci` 可确保与 lockfile 一致

## 第三方依赖（按子项目）

### demo（[demo/package.json](file:///workspace/demo/package.json)）

业务相关：

- `react`, `react-dom`
- `react-router-dom`
- `tesseract.js`：OCR
- `react-markdown` + `remark-gfm`：渲染 AI 输出 markdown
- `framer-motion`：动效
- `lucide-react`：图标
- `zustand`：已安装但当前代码未见明显使用点（可作为后续状态扩展）

工程相关：

- `typescript` + `typescript-eslint`
- `tailwindcss@3` + `postcss` + `autoprefixer`
- `vite` + `@vitejs/plugin-react` + `vite-tsconfig-paths`

### zheli-wutong（[zheli-wutong/package.json](file:///workspace/zheli-wutong/package.json)）

业务相关：

- `react`, `react-dom`
- `react-router-dom`
- `tesseract.js`：OCR
- `react-markdown`：渲染 AI 输出 markdown
- `framer-motion`：动效
- `lucide-react`：图标
- `recharts`：Dashboard / WeightTracking 的图表

工程相关：

- `tailwindcss@4` + `@tailwindcss/vite`（Vite 插件形态接入 Tailwind）
- `vite` + `@vitejs/plugin-react`

## 环境变量（Vite）

两个子项目均采用 Vite 的 `import.meta.env` 注入。

### DeepSeek API Key

- demo：`VITE_DEEPSEEK_API_KEY`（[Interact](file:///workspace/demo/src/pages/Interact.tsx#L56)）
- zheli-wutong：`VITE_DEEPSEEK_API_KEY`（[deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L5-L7)）

### DeepSeek Base URL / 代理

zheli-wutong 的 DeepSeek 访问路径区分环境：

- DEV：`BASE_URL = '/api/deepseek'`（[deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L5-L7)）
- PROD：`BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL`（同上）
- DEV 代理：将 `/api/deepseek/*` 代理到 `https://api.deepseek.com/*`（[vite.config.js](file:///workspace/zheli-wutong/vite.config.js#L11-L18)）

demo 未配置 dev 代理，直接请求公网域名（[Interact](file:///workspace/demo/src/pages/Interact.tsx#L167-L186)）。

## OCR 语言数据

- demo：使用 `createWorker(['chi_sim','eng'])`（[Interact](file:///workspace/demo/src/pages/Interact.tsx#L94-L127)）
  - 项目根目录包含 `chi_sim.traineddata / eng.traineddata`（[demo/](file:///workspace/demo)），但当前代码未指定 `langPath`，由 tesseract.js 默认策略处理
- zheli-wutong：显式指定 `langPath: https://tessdata.projectnaptha.com/4.0.0`（[deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L233-L242)，[Interaction](file:///workspace/zheli-wutong/src/pages/Interaction.jsx#L389-L408)）

## 部署相关配置

- demo 提供 nginx 单页应用刷新兼容示例：
  - [nginx-config.txt](file:///workspace/demo/nginx-config.txt)
  - [nginx.conf.example](file:///workspace/demo/nginx.conf.example)

