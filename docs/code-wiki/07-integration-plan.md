# 医疗智能体平台整合部署实施方案

**目标**：将根目录的单页展示与两个 React 子项目（`demo` 医生端定制，`zheli-wutong` 大众端平台）进行生产级路由整合。

**架构**：基于 Nginx 的静态资源与代理路由分发方案。
- `/`：根目录 `index.html` 落地页。
- `/demo/`：医生端定制应用（React 18 Vite）。
- `/wutong/`：大众端平台（React 19 Vite）。
- `/api/deepseek/`：统一流式 API 代理，解决前端跨域与密钥暴露问题。

## 实施内容总结

1. **入口修改**：已将 `index.html` 中 Tab 4 和 Tab 5 原本用假数据的模拟演示区域，替换为了醒目的**入口引导按钮**，分别跳转至 `/wutong/` 和 `/demo/`。
2. **构建基座配置**：
   - 修改了 `demo/vite.config.ts` 增加 `base: '/demo/'`。
   - 修改了 `zheli-wutong/vite.config.js` 增加 `base: '/wutong/'`。
3. **统一部署脚本**：在根目录新增了 `package.json` 和 `scripts/prepare-deploy.js`。
   - 运行 `npm run build:all` 会自动构建两个子项目，并将静态产物组装到统一的 `/dist` 目录下：
     - `/dist/root/index.html`
     - `/dist/demo/*`
     - `/dist/wutong/*`
4. **Nginx 配置生成**：在根目录生成了 `nginx.conf` 模板文件，实现了多路由静态分发和 DeepSeek 接口的跨域代理。

## 本地开发与联调方式

因为我们采用了方案B（Nginx生产级路由整合），所以在本地开发时，推荐使用 Nginx 本地反代，或者使用统一脚本拉起：

```bash
# 安装根目录工具
npm install

# 一键启动根页面和两个子系统的 Dev Server
npm run dev:all
```
*(注意：此模式下本地会存在 3 个独立端口。如需体验完整的 `/wutong` 路由跳转，需使用下方的构建部署模式)*

## 生产部署步骤

1. **一键构建**：
```bash
npm run install:all
npm run build:all
```
2. **Nginx 部署**：
将生成的 `dist/` 目录内容拷贝到 Nginx 服务器，并挂载刚刚生成的 `nginx.conf` 配置。
