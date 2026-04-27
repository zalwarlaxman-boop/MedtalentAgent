# 06. 运行与部署

## 0. 根目录静态演示页

根目录 [index.html](file:///workspace/index.html) 是一个纯静态页面（带少量 JS 交互演示），运行方式：

- 本地：直接用浏览器打开即可
- 线上：放到任意静态站点托管（nginx / OSS / GitHub Pages）即可

该页面不依赖子项目构建产物。

## 1. demo 子项目（React + TS）

目录：[demo/](file:///workspace/demo)

### 安装依赖

```bash
cd /workspace/demo
npm ci
```

### 开发启动

```bash
npm run dev
```

### 构建与预览

```bash
npm run build
npm run preview
```

### 环境变量

在 `demo/` 下创建 `.env.local`（不要提交密钥）：

```bash
VITE_DEEPSEEK_API_KEY=your_key_here
```

代码读取点： [Interact](file:///workspace/demo/src/pages/Interact.tsx#L56)

注意：

- Vite 会在构建时将 `VITE_*` 注入到前端 bundle，属于“前端可见”的密钥；若需要生产级安全，建议改为后端代理或使用可控的短期 token。

### 部署（静态站点）

构建后产物在 `demo/dist/`，可用 nginx 直接托管。demo 已提供 SPA 刷新 404 兼容配置示例：

- [nginx-config.txt](file:///workspace/demo/nginx-config.txt)
- [nginx.conf.example](file:///workspace/demo/nginx.conf.example)

## 2. zheli-wutong 子项目（React + JS）

目录：[zheli-wutong/](file:///workspace/zheli-wutong)

### 安装依赖

```bash
cd /workspace/zheli-wutong
npm ci
```

### 开发启动（含 DeepSeek 代理）

```bash
npm run dev
```

该项目在开发环境通过 Vite proxy 转发 DeepSeek 请求（避免浏览器直连跨域/统一管理请求路径）：

- 代理规则： [vite.config.js](file:///workspace/zheli-wutong/vite.config.js#L11-L18)
- 工具侧 BASE_URL： [deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L5-L7)

### 构建与预览

```bash
npm run build
npm run preview
```

### 环境变量

在 `zheli-wutong/` 下创建 `.env.local`：

```bash
VITE_DEEPSEEK_API_KEY=your_key_here
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
```

说明：

- DEV 环境下 `VITE_DEEPSEEK_BASE_URL` 不参与（因为走 `/api/deepseek` 代理）
- PROD 环境下必须提供 `VITE_DEEPSEEK_BASE_URL`（否则 `BASE_URL` 可能为 `undefined`）

### 路由与部署注意事项

- 该项目使用 HashRouter（[main.jsx](file:///workspace/zheli-wutong/src/main.jsx#L1-L13)），静态站点部署时刷新不会触发服务器 404
- 构建产物在 `zheli-wutong/dist/`

## 3.（可选）本地校验命令建议

demo：

```bash
cd /workspace/demo
npm run lint
npm run check
```

zheli-wutong：

```bash
cd /workspace/zheli-wutong
npm run lint
```

