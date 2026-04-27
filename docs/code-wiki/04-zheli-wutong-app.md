# 04. zheli-wutong 子项目（React + JavaScript）

目录：[zheli-wutong/](file:///workspace/zheli-wutong)

## 定位与特性

该子项目更偏“健康管理平台 Demo”，特点：

- 统一的全局健康数据模型（画像/体重/目标/对话）
- 强调“画像驱动”与“趋势/评分/提醒”的派生计算
- DeepSeek 接入封装成可复用工具（支持流式）
- 图片多模态交互：上传图片 → OCR → 将识别文字拼入提示词交给 AI

## 启动入口与路由

- React 入口： [main.jsx](file:///workspace/zheli-wutong/src/main.jsx#L1-L13)（HashRouter）
- 路由入口： [App.jsx](file:///workspace/zheli-wutong/src/App.jsx#L1-L34)

路由结构要点：

- 顶层包裹 [HealthDataProvider](file:///workspace/zheli-wutong/src/context/HealthDataContext.jsx#L139-L208)，向全站提供 `state/dispatch` 与派生指标
- `Route element={<AppLayout/>}`：所有页面共享布局（侧边栏/移动端抽屉）
- 核心页面：
  - `/`：总览（[Dashboard](file:///workspace/zheli-wutong/src/pages/Dashboard.jsx#L58-L316)）
  - `/interaction`：多模态互动（[Interaction](file:///workspace/zheli-wutong/src/pages/Interaction.jsx#L242-L704)）
  - `/profile`：健康画像录入 + OCR 结构化录入（[HealthProfile](file:///workspace/zheli-wutong/src/pages/HealthProfile.jsx#L296-L687)）
  - `/tracking/weight`：体重跟踪、目标、趋势、干预建议（[WeightTracking](file:///workspace/zheli-wutong/src/pages/WeightTracking.jsx#L28-L561)）
  - `/tracking/agents`：智能体集群（页面壳，见 [AgentCluster](file:///workspace/zheli-wutong/src/pages/AgentCluster.jsx)）
  - `/goods`、`/hospital`、`/experts`、`/dietitians`：周边入口页面壳

## 组件与模块职责

### context/

- [HealthDataContext](file:///workspace/zheli-wutong/src/context/HealthDataContext.jsx#L1-L219)
  - 数据模型 `initialState`：profile / weightRecords / weightGoal / chatMessages / notifications 等
  - Reducer：集中处理用户行为（`UPDATE_PROFILE`、`ADD_WEIGHT_RECORD`、`ADD_CHAT_MESSAGE`…）
  - 持久化：分别写入 localStorage（profile/records/chat/goal）
  - 派生计算（useMemo）：
    - `bmi`：`calculateBMI`
    - `healthScore`：`calculateHealthScore`
    - `weightTrend`：`analyzeWeightTrend`
    - `weightStats`：`calculateWeightStats`
    - `weightAlerts`：`getWeightAlerts`
  - Hook：`useHealthData()` 强制要求在 Provider 内调用

### utils/

- [storage.js](file:///workspace/zheli-wutong/src/utils/storage.js#L1-L33)
  - localStorage 的 `getStorage/setStorage/removeStorage`，并集中维护 key（`STORAGE_KEYS`）
- [healthCalc.js](file:///workspace/zheli-wutong/src/utils/healthCalc.js)
  - 一组纯函数算法：BMI、健康评分、体重趋势、统计、提醒、干预建议等
  - `generateInterventions(trend,bmi,profile)` 是 WeightTracking 页面生成“饮食/运动/代谢”建议的核心（[WeightTracking](file:///workspace/zheli-wutong/src/pages/WeightTracking.jsx#L61-L68)）
- [deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L1-L298)
  - DeepSeek API 封装：
    - `chatCompletion()`：非流式
    - `chatCompletionStream()`：流式（解析 `data:` 行）
    - `healthChat()` / `healthChatStream()`：带系统提示词 + 可注入画像摘要做个性化
  - OCR 结构化抽取：
    - `ocrMedicalReport(imageBase64)`：Tesseract OCR → DeepSeek 让模型输出 JSON 指标（[deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L225-L298)）

### layout/

- [AppLayout](file:///workspace/zheli-wutong/src/layout/AppLayout.jsx#L39-L224)
  - Desktop：左侧 sidebar，hover 展开/收起（`expanded`）
  - Mobile：抽屉式 sidebar（`mobileOpen`）
  - 主内容：`<Outlet />` 渲染页面

### lib/

- [cn](file:///workspace/zheli-wutong/src/lib/cn.js#L1-L6)
  - `clsx + tailwind-merge` 的 className 合并工具（与 demo 的 `cn` 同类）

## 关键流程说明

### 画像驱动对话（Interaction → deepseek → 全局 chatMessages）

- 消息写入：`dispatch({ type: 'ADD_CHAT_MESSAGE', ... })`（[HealthDataContext](file:///workspace/zheli-wutong/src/context/HealthDataContext.jsx#L83-L99)）
- 流式对话：
  - 页面侧：`healthChatStream(chatHistory, userText, onChunk, state.profile)`（[Interaction.jsx:L296-L305](file:///workspace/zheli-wutong/src/pages/Interaction.jsx#L296-L305)）
  - 工具侧：系统提示词 + 画像摘要拼接（[deepseek.js](file:///workspace/zheli-wutong/src/utils/deepseek.js#L176-L223)）

### 体检报告 OCR 结构化录入（HealthProfile）

入口： [HealthProfile](file:///workspace/zheli-wutong/src/pages/HealthProfile.jsx#L141-L291)

- OCR 的“第二步结构化”不是页面实现，而是复用 `ocrMedicalReport()`：
  - Tesseract OCR 取得文字
  - DeepSeek 将文字提取为严格 JSON（收缩压/舒张压/血糖/血脂/尿酸等）
- 确认后写入 `profile.medicalReport`（[HealthProfile.jsx:L324-L329](file:///workspace/zheli-wutong/src/pages/HealthProfile.jsx#L324-L329)）

### 体重跟踪（WeightTracking）

入口： [WeightTracking](file:///workspace/zheli-wutong/src/pages/WeightTracking.jsx#L28-L561)

- `ADD_WEIGHT_RECORD` / `DELETE_WEIGHT_RECORD` / `SET_WEIGHT_GOAL` 统一走 reducer（[HealthDataContext](file:///workspace/zheli-wutong/src/context/HealthDataContext.jsx#L50-L81)）
- 趋势分析与提醒：
  - `weightTrend = analyzeWeightTrend(records, days)`
  - `weightAlerts = getWeightAlerts(records, goal)`
- 干预建议：
  - `generateInterventions(weightTrend, bmi, state.profile)` 生成建议列表

