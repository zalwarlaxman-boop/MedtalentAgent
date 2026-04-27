# 03. demo 子项目（React + TypeScript）

目录：[demo/](file:///workspace/demo)

## 定位与特性

该子项目更偏“移动端单页 Demo”，核心能力是：

- 科普内容浏览（文章/视频）与收藏/点赞（本地持久化）
- 互动聊天（DeepSeek 流式）
- 上传体检报告图片（OCR → 将识别文字作为隐藏文本发送给 AI）
- 互动结果后推荐内容/服务/商品（本地推荐算法）

## 启动入口与路由

- React 入口： [main.tsx](file:///workspace/demo/src/main.tsx#L1-L10)
- 路由入口： [App.tsx](file:///workspace/demo/src/App.tsx#L1-L49)

路由结构要点：

- 根路由 `/` 挂载 [Layout](file:///workspace/demo/src/components/Layout.tsx#L18-L64)，页面通过 `Outlet` 渲染
- 主要页面：
  - `/`：科普列表（[PopSci](file:///workspace/demo/src/pages/PopSci.tsx#L26-L269)）
  - `/popsci/article/:id` 与 `/popsci/video/:id`：详情（[PopSciDetail](file:///workspace/demo/src/pages/PopSciDetail.tsx#L15-L147)）
  - `/interact`：互动 + OCR（[Interact](file:///workspace/demo/src/pages/Interact.tsx#L37-L461)）
  - `/service` 与 `/service/:slug`：服务列表/详情（[Service](file:///workspace/demo/src/pages/Service.tsx#L1-L132)，[ServiceDetail](file:///workspace/demo/src/pages/ServiceDetail.tsx#L1-L73)）
  - `/faq`：FAQ（[Faq](file:///workspace/demo/src/pages/Faq.tsx#L1-L100)）
  - `/me`：个人中心（[Me](file:///workspace/demo/src/pages/Me.tsx#L20-L218)）
  - `/content/:id`：推荐内容详情（[ContentDetail](file:///workspace/demo/src/pages/ContentDetail.tsx#L14-L132)）

## 组件与模块职责

### components/

- [Layout](file:///workspace/demo/src/components/Layout.tsx#L1-L64)
  - 底部导航 + `Outlet`
  - 导出 `cn()`：`clsx + tailwind-merge` 组合的 className 合并工具
- [Splash](file:///workspace/demo/src/components/Splash.tsx)
  - 启动弹层（登录/游客模式 UI，含倒计时验证码模拟）
- [Empty](file:///workspace/demo/src/components/Empty.tsx)
  - 空态组件（多个页面复用）

### data/

该项目“数据层”以静态 catalog 形式存在，典型用途是：

- 页面展示数据来源（科普/FAQ/通知/服务）
- AI/搜索的“本地推荐兜底”与推荐卡片数据来源

关键文件：

- [popsciCatalog.ts](file:///workspace/demo/src/data/popsciCatalog.ts#L1-L97)
  - `listPopSci(type)`：按类型列出内容
  - `getPopSciItem(type, id)`：详情页查找
- [contentCatalog.ts](file:///workspace/demo/src/data/contentCatalog.ts#L1-L99)
  - `getRecommendations(input, limit)`：按关键词命中数打分，未命中时用默认推荐补齐
- [serviceCatalog.ts](file:///workspace/demo/src/data/serviceCatalog.ts)：
  - 服务入口/跳转配置（`getServiceBySlug` 等）
- [faqCatalog.ts](file:///workspace/demo/src/data/faqCatalog.ts)：
  - FAQ 列表与分类
- [noticeCatalog.ts](file:///workspace/demo/src/data/noticeCatalog.ts)：
  - 个人中心的提醒/资讯数据

### hooks/

- [usePopSciState](file:///workspace/demo/src/hooks/usePopSciState.ts#L1-L79)
  - 通过 localStorage 维护“点赞/收藏”状态（key：`popsci_state_v1`）
  - API：
    - `isLiked(type,id)` / `toggleLiked(type,id)`
    - `isSaved(type,id)` / `toggleSaved(type,id)`
  - 关键实现：将 `(type,id)` 组合为 `${type}:${id}`，避免不同类型 ID 冲突

## 关键流程说明

### 互动聊天（文本）

- 入口： [handleSend](file:///workspace/demo/src/pages/Interact.tsx#L250-L261)
- 网络：在 `fetchAIResponse()` 内直接调用 DeepSeek 公网域名（[Interact.tsx:L167-L186](file:///workspace/demo/src/pages/Interact.tsx#L167-L186)）
- 协议：SSE 风格 `data:` 行（[Interact.tsx:L201-L229](file:///workspace/demo/src/pages/Interact.tsx#L201-L229)）
- 兜底：未配置 `VITE_DEEPSEEK_API_KEY` 时，直接提示并返回本地推荐（[Interact.tsx:L152-L166](file:///workspace/demo/src/pages/Interact.tsx#L152-L166)）

### 图片 OCR 解读

- 入口： [handleImageUpload](file:///workspace/demo/src/pages/Interact.tsx#L86-L142)
- OCR：`createWorker(['chi_sim','eng'])` → `recognize(file)` → `terminate()`
- 隐藏文本：`hiddenText` 仅用于发送给 AI，不直接展示给用户（[Interact.tsx:L104-L111](file:///workspace/demo/src/pages/Interact.tsx#L104-L111)）
- 持久化清理：保存聊天记录时剥离 `imageUrl/hiddenText` 并标记 `isImagePlaceholder`，避免 localStorage 体积过大（[Interact.tsx:L70-L84](file:///workspace/demo/src/pages/Interact.tsx#L70-L84)）

