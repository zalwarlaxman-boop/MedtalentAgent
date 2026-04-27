# Medtalent Agent Index 页面设计重构规范 (Apple 级极简科技风)

## 1. 核心设计理念 (Visual Thesis)
**"以克制的留白、清透的医疗蓝绿渐变与丝滑的滚动体验，传递现代医学的纯净、高端与可靠。"**

告别传统 B 端后台系统的左右分栏布局，转向类似苹果产品落地页（Apple-style Landing Page）的全宽屏沉浸式体验。以大字体、大留白、精致的光影和模糊材质（Glassmorphism）来凸显“AI + 医疗”的尖端科技感。

## 2. 布局与结构 (Composition & Layout)
* **抛弃左侧固定黑底边栏**：将现有的侧边栏改为**顶部悬浮导航栏（Sticky Header）**。
* **毛玻璃材质导航**：导航栏背景采用半透明模糊效果（`backdrop-filter: blur(20px)`），在页面滚动时提供高级的视觉穿透感。
* **全屏宽幅（Full-bleed）**：Hero 区不再限制于中间的定宽盒子，而是延展至屏幕边缘，利用超大字体和居中排版吸引眼球。
* **分区分块**：以大面积的白色/极浅灰色交替作为各 Section 的背景，用空间和对齐代替边框与卡片（Cardless design）。

## 3. 色彩系统 (Color Palette)
* **背景色（Backgrounds）**：
  * 主背景：纯白 `#FFFFFF`
  * 浅色区：极浅灰蓝 `#F7F9FC`
* **主品牌色（Primary）**：
  * 医疗青蓝渐变：`linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)`
  * 强调色：科技青 `#00E676` (用于状态点或成功提示)
* **文本色（Typography Colors）**：
  * 大标题/主文本：深空灰 `#1A1D20`
  * 副文本：中级灰 `#5C6670`
  * 辅助文本：浅灰 `#8B95A1`

## 4. 字体与排版 (Typography)
* **字体栈**：优先使用系统级无衬线现代字体，剔除传统的宋体。
  `font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif;`
* **层级（Hierarchy）**：
  * Hero 大标题：56px+，字重 700，超紧凑行高（1.1），可能配合渐变色文字（`-webkit-background-clip: text`）。
  * 二级标题：32px-40px，字重 600，负字间距（letter-spacing: -0.5px）。
  * 正文：16px-18px，行高 1.6，颜色为次级灰，保持极高的可读性。

## 5. 组件与元素细节 (Elements)
* **阴影（Shadows）**：摒弃生硬的小阴影，使用大范围、高透明度的弥散阴影，营造悬浮感。
  `box-shadow: 0 20px 40px -10px rgba(0, 114, 255, 0.08)`
* **圆角（Radii）**：增大组件圆角，统一使用 `24px` 到 `32px`，消除尖锐感。
* **Logo 处理**：
  * 顶部导航栏左侧使用带有文字的“透明底公司logo.png”（因背景为白/毛玻璃，使用原图颜色或加滤镜变为深色）。
  * 各个 Section 标题前的修饰符统一移除，改用中心对称排版或纯粹的留白。
* **按钮（Buttons）**：
  * 胶囊形状（`border-radius: 999px`），饱满的 padding（如 `16px 32px`）。
  * 主按钮使用品牌渐变色，hover 时配合轻微的缩放（`transform: scale(1.02)`）和阴影扩散。

## 6. 动效与交互 (Motion)
* **入场动画（Entrance）**：页面加载和 Tab 切换时，内容块采用平滑的上浮渐现（Fade up & in，`transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`）。
* **微交互（Micro-interactions）**：Hover 卡片时，无需边框变色，而是卡片本身轻微上浮，同时阴影变得更柔和、更宽广。

## 7. 内容迁移与映射 (Content Mapping)
现有 `index.html` 中的 6 个 Tab 内容将被平滑迁移至新的全宽结构中：
1. **首页（Home）**：超大 Hero 标语 + 核心价值观，居中对齐，极简排版。
2. **1+N 智能体矩阵（Overview）**：利用网格系统展示核心场景，移除现有粗糙的边框卡片，改用微阴影大圆角区块。
3. **OS 底座（OS）**：保留现有的 L1-L5 工作流演示，但将其视觉重构为水平展开的横向节点图。
4. **知识引擎（Knowledge）**：搜索演示框升级为类似 Spotlight / 苹果搜索框的极致极简形态，居中超大输入框配模糊背景。
5. **大众端 & 医生端入口**：将其打造为高品质的落地页模块（Hero Banner 级），配备大号胶囊按钮直达系统。
