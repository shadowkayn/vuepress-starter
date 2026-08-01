### 1、:focus-within伪类
表示当元素或其任意后代元素被聚焦时，将匹配该元素
![''](/images/cssImages/1.png)

### 2、::first-letter伪元素
表示将样式应用于区块容器第一行的第一个字母，但仅当其前面没有其他内容（例如图像或行内表格）时才有效。
![''](/images/cssImages/2.png)

### 3、::selection伪元素
表示文档中被用户高亮的部分
```css
p::selection {
    background: #ff0000;
}
```

### 4、Tailwind CSS v4 核心指令与现代 CSS 架构学习指南
> **前言**：Tailwind CSS v4 (2025) 引入了全新的 **CSS-First** 架构。废弃了传统的 `tailwind.config.js` 配置文件，改为直接在 CSS 文件中使用标准的 CSS 指令和 Tailwind 专有扩展指令进行全局配置。

---

## 目录
1. [核心概念：CSS-First 架构](#1-核心概念css-first-architecture)
2. [5 大核心指令详解（CSS 定义 ➡️ HTML 使用）](#2-5-大核心指令详解)
    - [`@theme`（定义主题变量）](#1-theme定义主题变量)
    - [`@custom-variant`（自定义条件前缀）](#2-custom-variant自定义条件前缀)
    - [`@utility`（自定义工具类）](#3-utility自定义工具类)
    - [`@apply`（打包工具类）](#4-apply打包工具类)
    - [`@layer`（控制层级与优先级）](#5-layer控制层级与优先级)
3. [深度剖析：`@custom-variant` 工作原理](#3-深度剖析-custom-variant-工作原理)
4. [核心指令快速速查表](#4-核心指令快速速查表)

---

## 1. 核心概念：CSS-First Architecture

在 Tailwind v4 中，所有的主题定义、变体扩展和自定义工具类均写在主 CSS 文件（如 `src/index.css`）中。

- **原生 W3C 标准指令**：`@import`, `@layer`
- **Tailwind v4 引擎指令**：`@theme`, `@custom-variant`, `@utility`, `@apply`

---

## 2. 5 大核心指令详解

### 1. `@theme`（定义主题变量）

#### 📘 作用
用于定义 Design Tokens（设计变量）。你在 `@theme` 块内定义的后缀变量，Tailwind 会**自动为你生成一整套对应的工具类名**（如 `bg-*`, `text-*`, `border-*` 等）。

#### 📝 CSS 定义写法 (`src/index.css`)
```css
@import 'tailwindcss';

@theme {
  /* 1. 颜色变量 (格式: --color-名称) */
  --color-sea-blue: #0984e3;
  --color-mint: #55efc4;

  /* 2. 圆角变量 (格式: --radius-名称) */
  --radius-liquid: 32px;

  /* 3. 字体变量 (格式: --font-名称) */
  --font-title: 'Comic Sans MS', cursive;
}
```

#### 💡 HTML / React JSX 使用写法
```html
<!-- 自动生成 bg-sea-blue, text-mint, border-sea-blue -->
<div class="bg-sea-blue text-mint border-2 border-sea-blue">
  <!-- 自动生成 rounded-liquid -->
  <button class="rounded-liquid bg-mint text-slate-800 px-6 py-2">
    <!-- 自动生成 font-title -->
    <h1 class="font-title text-xl">海蓝小清新</h1>
  </button>
</div>
```

---

### 2. `@custom-variant`（自定义条件前缀）

#### 📘 作用
用于定义自定义条件前缀（如 `dark:`, `admin:`, `mobile:`）。它接受一个**前缀绰号**和一个**触发条件的 CSS 选择器**。

#### 📝 CSS 定义写法 (`src/index.css`)
```css
/* 定义暗黑模式前缀 "dark:" */
@custom-variant dark (&:is(.dark *));

/* 定义管理员模式前缀 "admin:" */
@custom-variant admin (&:is(.is-admin-mode *));
```

#### 💡 HTML / React JSX 使用写法
```html
<!-- 当父容器带有 .is-admin-mode 类名时，激活 admin: 后的样式 -->
<div class="app-container is-admin-mode">
  <button class="border-transparent admin:border-red-500 admin:bg-red-50">
    敏感操作
  </button>
</div>
```

---

### 3. `@utility`（自定义工具类）

#### 📘 作用
用于编写自定义的原生工具类。最强大之处在于：**用 `@utility` 声明的类名会自动无缝支持 Tailwind 的所有变体前缀**（如 `hover:`, `dark:`, `md:`）。

#### 📝 CSS 定义写法 (`src/index.css`)
```css
/* 定义发光字工具类 */
@utility text-glow {
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 4px rgba(45, 212, 191, 0.6);
}

/* 定义水滴边框工具类 */
@utility glass-edge {
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
```

#### 💡 HTML / React JSX 使用写法
```html
<!-- 1. 直接当原生类名使用 -->
<h1 class="text-glow font-bold">常亮发光标题</h1>

<!-- 2. 自动支持 hover: 等前缀！ -->
<div class="glass-edge hover:text-glow transition-all">
  鼠标悬停时发光
</div>
```

---

### 4. `@apply`（打包工具类）

#### 📘 作用
在普通 CSS 选择器内嵌入并打包多个 Tailwind 工具类，使 HTML 更加整洁。

#### 📝 CSS 定义写法 (`src/index.css`)
```css
.btn-primary {
  @apply rounded-2xl bg-teal-400 px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105;
}
```

#### 💡 HTML / React JSX 使用写法
```html
<!-- 简短干净的 HTML 写法 -->
<button class="btn-primary">
  提交按钮
</button>
```

---

### 5. `@layer`（控制层级与优先级）

#### 📘 作用
利用 W3C 标准的级联层（Cascade Layers）管理 CSS 优先级。解决全局默认样式（Base）覆盖不了属性在 HTML 里写 Tailwind 类名的传统 CSS 冲突。

按优先级从低到高分为：
1. **`base`**：底层重置与默认标签样式（优先级最低，极易被覆盖）
2. **`components`**：复合组件样式（中优先级）
3. **`utilities`**：原子工具类（最高优先级）

#### 📝 CSS 定义写法 (`src/index.css`)
```css
@layer base {
  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #334155;
  }
}
```

#### 💡 HTML / React JSX 使用写法
```html
<!-- 1. 默认继承 base 层定义的暗灰色 -->
<h1>默认标题</h1>

<!-- 2. 随时可以用 Tailwind 工具类覆盖 base 里的样式，因为 utilities 层优先级高于 base -->
<h1 class="text-red-500">红色覆盖标题</h1>
```

---

## 3. 深度剖析：`@custom-variant` 工作原理

很多初学者容易混淆 `@custom-variant` 的**前缀绰号**与**触发选择器**：

```css
@custom-variant admin (&:is(.is-admin-mode *));
/*               ▲                 ▲          */
/*           【前缀绰号】     【触发的 CSS 选择器】 */
```

### 核心解构表

| 组成部分 | 示例 | 说明 |
| :--- | :--- | :--- |
| **CSS 声明** | `@custom-variant admin ...` | 在 `@custom-variant` 后紧跟的第一个单词 `admin` 就是前缀。 |
| **HTML 调用** | `admin:border-red-500` | 在 HTML 中，格式必须固定为 `前缀:Tailwind类名`。 |
| **条件判断** | `&` 表示当前元素，`.is-admin-mode *` 表示祖先容器类名 | 当且仅当当前元素的某个上级节点包含 `.is-admin-mode` 时激活。 |

---

## 4. 核心指令快速速查表

| 指令 (At-Rule) | 类别 | 核心用途 | 典型场景 |
| :--- | :--- | :--- | :--- |
| **`@import`** | 原生 CSS | 引入模块包 | `@import 'tailwindcss';` |
| **`@theme`** | Tailwind v4 | 全局 Design Tokens 变量定义 | `--color-brand`, `--radius-card` |
| **`@custom-variant`** | Tailwind v4 | 自定义条件前缀 (变体) | `dark:`, `admin:`, `mobile:` |
| **`@utility`** | Tailwind v4 | 编写可组合前缀的原生工具类 | `@utility text-glow { ... }` |
| **`@apply`** | Tailwind v4 | 在 CSS 中复用 Tailwind 工具类 | `.card { @apply bg-white p-4; }` |
| **`@layer`** | W3C 原生标准 | 管理全局 CSS 规则覆盖优先级 | `@layer base { h1 { ... } }` |

---

> 📄 **文件生成时间**：2026-08-01  
> 🏷️ **归档分类**：Tailwind CSS v4 / 现代 CSS 架构学习笔记
