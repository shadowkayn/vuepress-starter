### **1、自动导入api和按需引入第三方组件库**
要在Vite构建的Vue3项目中自动导入ref、reactive等Composition API，你可以使用以下插件：
#### **1.1、推荐插件：unplugin-auto-import**
```shell
npm install -D unplugin-auto-import
```
配置 (vite.config.js/ts)
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
        imports: ['vue','vue-router'],
        dts: true, // 生成 TypeScript 声明文件
        eslintrc: { // 生成 ESLint 配置
            enabled: true, // 默认 false
            filepath: './.eslintrc-auto-import.json', // 生成的文件路径
            globalsPropValue: true // 设置全局变量为可读
        }
    })
  ]
})
```
然后在 .eslintrc.js 中引入生成的配置：
```javascript
module.exports = {
  // ... 其他配置
  extends: [
    // ... 其他扩展
    './.eslintrc-auto-import.json' // 添加这一行
  ]
}
```
如果你使用 eslint-plugin-vue，可以直接启用它的推荐配置：
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-essential',
    // 其他扩展...
  ],
  // 不需要手动声明 globals
}
```

#### **1.2、推荐插件：unplugin-auto-import、unplugin-vue-components**
这两个插件组合可以实现：
- unplugin-auto-import：自动导入 JavaScript/TypeScript API（如函数、组件方法）

- unplugin-vue-components：自动导入 Vue 组件（并生成对应的 components.d.ts 类型声明）

安装：
```shell
npm install -D unplugin-auto-import unplugin-vue-components
```
配置（vite.config.js）:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// 按需导入的解析器（不同 UI 库需要不同的解析器）
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
  NaiveUiResolver,
  HeadlessUiResolver,
} from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 API（如 ref, reactive, onMounted 等）
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './auto-imports.d.ts', // 生成类型声明文件
    }),
    // 自动导入 Vue 组件（UI 库）
    Components({
      dts: './components.d.ts', // 生成组件类型声明
      resolvers: [
          // Ant Design Vue 按需导入
          AntDesignVueResolver({
              importStyle: 'less', // 使用 Less 样式（默认 CSS）
              resolveIcons: true, // 自动处理图标
          }),
          // Element Plus 按需导入
          ElementPlusResolver({
              importStyle: 'sass', // 使用 Sass 样式
          }),
          VantResolver(),      // Vant
          NaiveUiResolver(),   // Naive UI
      ],
    }),
  ],
})
```
部分 UI 库（如 Ant Design Vue、Element Plus）需要额外加载样式：

(1) Ant Design Vue (Less)
```shell
npm install ant-design-vue @ant-design/icons-vue less
```
vite.config.js 配置：
```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // Ant Design Vue 需要
      },
    },
  },
})
```
(2) Element Plus (Sass)
```shell
npm install element-plus @element-plus/icons-vue sass
```
vite.config.js 配置：
```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "element-plus/theme-chalk/src/index.scss" as *;`,
      },
    },
  },
})
```

### **2、echarts模块化按需引入**
Vite + Vue3 项目的最佳实践：

#### **2.1、安装 ECharts 核心模块**
```shell
npm install echarts @types/echarts
```
#### **2.2、创建按需注册文件**
在 src/utils/echarts.ts 中集中管理模块注册：
```javascript
import * as echarts from 'echarts/core'
// 1. 按需导入图表类型
import { BarChart, LineChart, PieChart } from 'echarts/charts'
// 2. 按需导入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent
} from 'echarts/components'
// 3. 按需导入渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的模块
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  CanvasRenderer
])

export default echarts
```
#### **2.3、在组件中使用**
```vue
<template>
  <div ref="chartDom" style="width: 600px; height: 400px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import echarts from '@/utils/echarts' // 导入预配置的 echarts 实例

const chartDom = ref<HTMLElement>()
let myChart: echarts.ECharts | null = null

onMounted(() => {
  if (!chartDom.value) return
  myChart = echarts.init(chartDom.value)
  myChart.setOption({
    title: { text: '按需引入示例' },
    tooltip: {},
    xAxis: { data: ['A', 'B', 'C'] },
    yAxis: {},
    series: [{ type: 'bar', data: [10, 20, 30] }]
  })
})

onUnmounted(() => {
  myChart?.dispose()
})
</script>
```

### **3、nrm管理 npm 镜像源**
#### **3.1、安装 nrm**
```shell
npm install -g nrm
```
#### **3.2、常用 nrm 命令**
```shell
nrm ls	#列出所有可用镜像源（带 * 的是当前使用的源）
nrm use <源名称>	#切换到指定镜像源（如 taobao）
nrm test <源名称>	#测试镜像源的响应速度
nrm add <名称> <URL>	#添加自定义镜像源（如公司私有源）
nrm del <名称>	#删除某个镜像源
nrm current	#显示当前使用的镜像源
```

#### **3.3、针对特定依赖包配置镜像**
在项目文件夹中添加 .npmrc 文件,例如：
```shell
# 单独设置 electron 的镜像
electron_mirror=https://npmmirror.com/mirrors/electron/

# puppeteer 的 Chromium 镜像
puppeteer_download_host=https://npmmirror.com/mirrors/chromium-browser-snapshots/
```