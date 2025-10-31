### 1、命令式调用的Dialog弹窗
#### 1、在 utils 目录新建一个 dialog.js 文件
```javascript
import { ElDialog } from 'element-plus';
import { createApp, h, ref } from 'vue';
import { loadPlugins } from '@/utils/plugins';

/**
 * 命令式调用的Dialog弹窗
 * @param component default插槽组件
 * @param props 默认插槽组件的props
 * @param modelProps Dialog组件的props
 * @param footerComponent footer插槽组件
 * @returns {{unmount: unmount}} 将关闭弹窗方法返回出去，在某些场景可能会用到
 */
export default function renderDialog(component, props, modelProps, footerComponent = null, submitCallback = () => {}) {
  const visible = ref(true);
  const formInstance = ref();

  const dialog = () => h(ElDialog, {
    ...modelProps,
    modelValue: visible.value
  },
  {
    default: () => h(component, { ...props, ref: formInstance }),
    footer: () => h(footerComponent, {
      onCancel() {
        unmount();
      },
      onSubmit() {
        submitCallback && submitCallback(formInstance.value);
      }
    })
  });

  const app = createApp(dialog);
  loadPlugins(app);
  const div = document.createElement('div');
  document.body.appendChild(div);
  app.mount(div);

  function unmount() {
    visible.value = false;
    setTimeout(() => {
      app.unmount();
      document.body.removeChild(div);
    }, 1000);
  }

  return { unmount };
};

```
#### 2、在dialog.js同级目录创建 plugins.js 文件
loadPlugins是一个用来注册ElementPlus组件库的文件
```javascript
import ElementPlus from 'element-plus';

export function loadPlugins(app) {
  app.use(ElementPlus);
}
```

#### 3、在需要调用的组件中引入并调用
```vue
<script setup>
// import { h } from 'vue';
import renderDialog from '@/utils/dialog';
import LoginForm from '@/views/tabs/LoginForm.vue';
import DialogFooter from '@/views/tabs/DialogFooter.vue';

// 一些简单的自定义组件，可以直接渲染，不用封装
// const LoginForm = {
//   props: ['msg'],
//   render() {
//     return h('div', [
//       h('p', this.msg), // 显示 props 中的 msg
//       h('input', { type: 'text', placeholder: '用户名' }),
//       h('input', { type: 'password', placeholder: '密码' }),
//     ]);
//   },
// };

const openDialog = () => {
  const { unmount } =  renderDialog(
    LoginForm,
    { msg: '欢迎登录我们系统' },
    { title: '登录', closeOnClickModal: false }, DialogFooter,
    (formInstance) => {
      formInstance?.submitForm?.(unmount);
    }
  );
};

</script>

<template>
  <el-button @click="openDialog">命令式弹窗</el-button>
</template>

<style scoped></style>
```

#### 4、子组件
LoginForm组件
```vue
<template>
  {{ msg }}
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    :size="formSize"
    class="demo-ruleForm"
    label-width="auto"
    status-icon
    style="max-width: 600px"
  >
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="ruleForm.userName" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';

interface RuleForm {
  userName: string;
  password: string;
}

defineProps({
  msg: {
    type: String,
    default: ''
  }
});


const formSize = ref<ComponentSize>('default');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  userName: '',
  password: ''
});


const rules = reactive<FormRules<RuleForm>>({
  userName: [
    { required: true, message: 'Please input userName', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' }
  ]

});

const submitForm = async (callback: () => void) => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      alert('submit');
      callback && callback();
    } else {
      // some errors submit codes
    }
  });
};

const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
};

defineExpose({ submitForm });
</script>
```

DialogFooter组件
```vue
<template>
  <div class="dialog-footer">
    <el-button @click="cancel">Cancel</el-button>
    <el-button type="primary" @click="submit">
      Confirm
    </el-button>
  </div>
</template>

<script setup>
const emit = defineEmits([
  'submit',
  'cancel'
]);

const cancel = () => {
  emit('cancel');
};

const submit = () => {
  emit('submit');
};
</script>
```


### 2、封装一个全局loading指令,可绑定在任意容器上
#### 1、在 src/components 目录下新建一个 Loading.vue 组件
```vue
<template>
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup></script>

<style scoped>
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ccc;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
```

#### 2、在src/directives/loadingDirective.js中注册指令
```javascript
import { createApp } from 'vue';
import Loading from '@/components/layout/Loading.vue';

const loadingDirective = {
  mounted(el, binding) {
    console.log(el, binding, 'el');
    // 创建一个 Loading 实例
    const app = createApp(Loading);
    const instance = app.mount(document.createElement('div'));

    // 绑定到元素的 `_loadingInstance` 属性，方便后续操作
    el._loadingInstance = instance.$el;
    el._loadingInstance.style.position = 'absolute';

    // 确保父元素是 relative 以正确显示 loading
    const position = getComputedStyle(el).position;
    console.log(position, 'position');
    if (position === 'static' || !position) {
      el.style.position = 'relative';
    }

    // 初次绑定时，根据绑定值显示或隐藏 loading
    if (binding.value) {
      el.appendChild(el._loadingInstance);
    }
  },
  updated(el, binding) {
    // 只有值发生变化时才执行
    if (binding.value !== binding.oldValue) {
      // 显示 loading
      if (binding.value) {
        el.appendChild(el._loadingInstance);
      } else {
        // 隐藏 loading
        el._loadingInstance.remove();
      }
    }
  },
  unmounted(el) {
    // 指令卸载时，移除 loading 实例
    el._loadingInstance?.remove();
    delete el._loadingInstance;
  }
};

export default loadingDirective;
```

#### 3、在src/directives/index.js中导出指令,所有封装指令都可以在这里导出，然后在main.js中统一注册
```javascript
import loadingDirective from '@/directives/laodingDirective';

export default {
    // 这里使用 install 方法，让 directives/index.js 作为一个 Vue 插件，方便在 main.js 中注册。
    install(app) {
        app.directive('loading', loadingDirective);
    }
};
```


#### 4、在main.js文件里面引入
```javascript
// 引入指令
import directives from './directives';

const app = createApp(App);
app.use(directives);
app.mount('#app');
```

#### 5、在需要的地方只是使用即可
```vue
<!--自定义指令loading-->
<div class="loading-section">
  <el-button @click="toggleLoading">切换 Loading</el-button>
  <div class="loading-box" v-loading="isLoading">
    <p>加载中的内容</p>
  </div>
</div>
```
v-loading指令用于显示或隐藏一个加载中的动画。它接收一个布尔值作为参数，表示是否显示加载中的动画。
![](/images/vueImages/1.png)


### 3、树节点数据treeData筛选过滤
树节点数据treeData筛选过滤，可以通过递归的方式实现。以下是一个简单的示例：

以ant-vue组件库举例，封装一个通用的树节点选择器；筛选时可以根据节点的title进行筛选，过滤与关键字不相符的节点，且父节点自动展开
```vue
<script setup>
import { SearchOutlined } from '@ant-design/icons-vue';
import { debounce } from 'lodash-es';

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  fieldNamesObj: {
    type: Object,
    default: () => ({
      title: 'title',
      key: 'key',
      children: 'children'
    })
  },
  treeData: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(['filterSearch']);
const searchValue = ref('');
const filterTreeData = ref([]);
const expandedKeys = defineModel('expandedKeys', { type: Array, default: () => [] });
const selectedKeys = defineModel('selectedKeys', { type: Array, default: () => [] });
const checkedKeys = defineModel('checkedKeys', { type: Array, default: () => [] });

watch(
  () => props.treeData,
  newData => {
    filterTreeData.value = newData;
  },
  {
    immediate: true
  }
);

const handleSearch = debounce(e => {
  const keyword = e.target?.value;

  if (!keyword.trim()) {
    expandedKeys.value = [];
    filterTreeData.value = props.treeData;
    emits('filterSearch', '');
    return;
  }

  const { title, key, children } = props.fieldNamesObj;
  // 存储匹配的节点 key（用于展开）
  const matchedKeys = new Set();

  // 递归过滤树数据，只保留匹配的节点
  const filterNodes = nodes => {
    return nodes.reduce((acc, node) => {
      const isMatched = node[title].includes(keyword);

      // 检查子节点是否有匹配
      let filteredChildren = [];
      if (node[children]) {
        filteredChildren = filterNodes(node[children]);
      }

      // 如果当前节点或子节点匹配，则保留
      if (isMatched || filteredChildren.length > 0) {
        const newNode = {
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : undefined
        };

        // 记录匹配的 key
        if (isMatched) matchedKeys.add(node[key]);
        if (filteredChildren.length > 0) matchedKeys.add(node[key]); // 父节点也要展开

        acc.push(newNode);
      }

      return acc;
    }, []);
  };

  // 更新过滤后的树数据
  filterTreeData.value = filterNodes(props.treeData);
  // 展开所有匹配的节点
  expandedKeys.value = Array.from(matchedKeys);

  emits('filterSearch', keyword);
}, 200);
</script>

<template>
  <div>
    <a-input
      v-if="showSearch"
      v-model:value="searchValue"
      placeholder="请输入关键字搜索"
      class="search-input"
      style="margin-bottom: 8px"
      allow-clear
      @change="handleSearch"
    >
      <template #prefix>
        <search-outlined />
      </template>
    </a-input>
    <a-tree
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      v-bind="$attrs"
      checkable
      :tree-data="filterTreeData"
      :field-names="fieldNamesObj"
    />
  </div>
</template>

<style scoped lang="less"></style>
```
核心方法：***filterNodes()***

使用时如下：
```vue
<template>
  <CommonTreeSelect
      v-model:expandedKeys="expandedKeys"
      v-model:checkedKeys="checkedKeys"
      :tree-data="treeData"
      :fieldNamesObj="{ title: 'label', key: 'value', children: 'children' }"
      @check="handleCheck"
  />
</template>
```

### 4、循环表单校验
循环表单校验，使用场景：表单数据为动态生成，需要校验的表单数据为动态生成，且数量未知。
<br />
如果使用的是 [element-ui](https://element-plus.gitee.io/#/zh-CN/component/installation)
```vue
<template>
  <div v-for="(item, index) in formList" :key="index">
    <div
        style="
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
    >
      {{ index + 1 }}
      <img
          src="@/assets/image/operation/icon_delete.png"
          alt=""
          style="cursor: pointer"
          v-if="formList.length > 1"
          @click="handleDeleteLineGroup(index)"
      />
    </div>
    <el-form
        :ref="`ruleForm_${index}`"
        :rules="rules"
        :model="item"
        size="mini"
        :key="`form_${index}`"
    >
      <el-form-item label-width="80px" label="经度：" prop="jd">
        <el-input placeholder="请输入" v-model="item.jd" type="number" />
      </el-form-item>
      <el-form-item label-width="80px" label="纬度：" prop="wd">
        <el-input placeholder="请输入" v-model="item.wd" type="number" />
      </el-form-item>
    </el-form>
  </div>
  <div class="add-btn">
    <img
        src="@/assets/image/add_duty.png"
        alt=""
        @click="addLineItem"
        style="cursor: pointer"
    />
  </div>
</template>

<script>
    export default {
      methods: {
        // 校验单个表单
        validateForm(index) {
          return new Promise((resolve) => {
            const formEl = this.$refs[`ruleForm_${index}`][0];
            formEl.validate((valid) => {
              resolve(valid);
            });
          });
        },

        // 校验所有表单
        async validateAllForms() {
          const results = await Promise.all(
              this.formList.map((_, index) => this.validateForm(index))
          );
          return results.every((valid) => valid);
        },

        // 表单提交
        async handleSubmitLineGroup() {
          const isValid = await this.validateAllForms();
          if (isValid) {
            this.$emit("addLineGroup", this.formList);
            this.lineGroupvisible = false;
            this.formList = [{ jd: "", wd: "" }];
          }
        },

        // 表单删除
        handleDeleteLineGroup(val) {
          this.formList.splice(val, 1);
        },
        
        // 表单添加
        addLineItem() {
          this.formList.push({
            jd: "",
            wd: "",
          });
        },
      }
    }
</script>
```
<br />

如果使用的是AntDesign Vue 组件，那么需要使用FormItem组件进行包裹，并设置rules属性进行校验。

```vue
<template>
  <a-form ref="formRef" name="basic" :model="formState" layout="inline" autocomplete="off">
    <div class="inspection-time-box">
      <div
          v-for="(item, index) in formState.inspectionTimeArr"
          :key="`inspection_time_${index}`"
          :ref="el => setInspectionFormRef(el, index)"
      >
        <a-form-item label-width="0" :name="['inspectionTimeArr', index, 'inspectionTime']" :rules="rules.inspectionTime">
          <a-time-picker v-model:value="item.inspectionTime" :locale="locale" value-format="HH:mm:ss" />
          <div class="operate-btn">
            <img v-if="index === 0" src="@/assets/table/add.svg" alt="" @click="addInspectionTime" />
            <img
                v-if="formState.inspectionTimeArr.length > 1"
                src="@/assets/deleteimg.png"
                alt=""
                @click="delInspectionTime(index)"
            />
          </div>
        </a-form-item>
      </div>
    </div>
  </a-form>  
</template>
```
el-form-item 标签外面包裹一层div 用来循环字段，关键点在于name属性  **:name="['inspectionTimeArr', index, 'inspectionTime']"** , index为当前循环的索引，name属性为当前字段的属性名称，inspectionTimeArr为循环数组


### 5、css动画实现容器内元素 “无线循环滚动”
核心思路：`copy一份数据` 用来循环滚动；纯 CSS 动画，避免频繁 DOM 操作；
<br />
定义动画：
```css
.scroll-list.animate {
  animation: scroll-up 10s linear infinite;
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
```
<br />

直接看例子，下面是个自定义无限滚动表格：
```vue
// VerticalLoopScroll.vue

<template>
  <div class="rescue-service-table">
    <table class="table-container">
      <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
      </tr>
      </thead>
    </table>
    <div class="scroll-wrapper">
      <table class="table-container">
        <tbody
            v-if="data?.length"
            ref="scrollListRef"
            class="scroll-list"
            :class="{ animate: shouldScroll }"
            :style="{ '--scroll-duration': scrollDuration + 's' }"
            @mouseenter="pauseScroll"
            @mouseleave="resumeScroll"
        >
        <tr v-for="(item, idx) in data" :key="idx">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="item" :col="col" :rowIndex="idx">
              {{ item[col.key] }}
            </slot>
          </td>
        </tr>
        <template v-if="data?.length > showLength">
          <tr v-for="(item, idx) in data" :key="`copy_${idx}`">
            <td v-for="col in columns" :key="col.key">
              <slot :name="col.key" :row="item" :col="col" :rowIndex="idx">
                {{ item[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
        </tbody>

        <div v-else class="null-data">
          <img src="~@/assets/zlt-img/gfsj_no_data.png" alt="" />
        </div>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommonScrollTable",
    props: {
      columns: {
        type: Array,
        required: true, // [{ label: '地市', key: 'areaName' }, ...]
      },
      data: {
        type: Array,
        default: () => [],
      },
      showLength: {
        type: Number,
        default: 4,
      },
      scrollSpeed: {
        type: Number,
        default: 3, // 默认每项滚动时间3秒
      },
    },
    watch: {
      data: {
        handler() {
          this.$nextTick(this.setScrollAnimation);
        },
        immediate: true,
        deep: true,
      },
    },
    computed: {
      scrollDuration() {
        // 计算总滚动时间：数据项数 × 每项滚动时间
        return this.data?.length * this.scrollSpeed || 0;
      },
    },
    data() {
      return {
        shouldScroll: false,
      };
    },
    methods: {
      setScrollAnimation() {
        if (!this.$refs.scrollListRef) {
          return;
        }
        this.shouldScroll = false;
        this.$nextTick(() => {
          if (this.data?.length > this.showLength) {
            this.shouldScroll = true;
          } else {
            this.$refs.scrollListRef.style.transform = "translateY(0)";
          }
        });
      },
      pauseScroll() {
        this.$refs.scrollListRef.style.animationPlayState = "paused";
      },
      resumeScroll() {
        this.$refs.scrollListRef.style.animationPlayState = "running";
      },
    },
  };
</script>

<style scoped lang="scss">
  .rescue-service-table {
    font-family: Arial, sans-serif;
    color: #fff;
    background-color: rgba(36, 39, 41, 0.1);
    height: 100%;
  }

  .table-container {
    width: 100%;
    border-collapse: collapse;
    background-color: rgba(0, 0, 0, 0.1);
    table-layout: fixed;
    &:has(.null-data) {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: unset;
    }
  }

  .table-container th,
  .table-container td {
    padding: 1rem 0.8rem;
    font-size: 1.4rem;
  }

  .table-container th {
    background-color: rgba(0, 149, 255, 0.1);
    color: #b0e0ff;
    font-weight: bold;
    text-align: center;
  }

  .table-container {
    thead {
      background: linear-gradient(
          90deg,
          transparent 0%,
          #2fa7e2 20%,
          #2fa7e2 80%,
          transparent 100%
      );
      background-size: 100% 1px;
      background-repeat: no-repeat;
      background-position: bottom;
      z-index: 99;

      tr th {
        font-size: 1.4rem;
        color: #b0e0ff;
        font-weight: normal;
      }
    }
  }

  .table-container {
    tbody {
      tr {
        &:nth-child(2n) {
          background-color: rgba(35, 79, 131, 0.2);
        }
        margin: 0.5rem 0;
        td {
          text-align: center;
        }
      }
    }
  }

  @keyframes scroll-up {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  .scroll-wrapper {
    /* 设定滚动区域的高度 */
    height: calc(100% - 4rem);
    overflow: hidden;
  }

  .scroll-list {
    &.animate {
      animation: scroll-up var(--scroll-duration, 20s) linear infinite;
    }
  }
</style>
```


### 6、"fabric.js" 实现简单图片编辑（对图片进行简单的框选并标注操作）
```vue
// 直接看代码，代码开箱即用

<template>
  <el-dialog
      title="事件标记"
      :visible.sync="visible"
      width="1100px"
      :before-close="handleClose"
      :destroy-on-close="true"
      id="event-mark-dialog"
  >
    <div class="event-mark-content">
      <canvas id="canvas" width="100%" height="560"></canvas>
    </div>

    <template slot="footer">
      <div class="btn-group">
        <el-button @click="handleClose" size="middle">取 消</el-button>
        <el-button
            v-if="hasMarked"
            type="warning"
            @click="handleRemark"
            size="middle"
        >
          重新标记
        </el-button>
        <el-button type="primary" @click="handleSubmit" size="middle">
          确 定
        </el-button>
      </div>
    </template>

    <el-dialog
        title="信息补充"
        width="450px"
        :visible.sync="dialogVisible"
        append-to-body
        class="event-mark-select-dialog"
        @close="cancelLabel"
    >
      <div class="mark-info-select">
        <div class="label">事件类型</div>
        <JDictSelectTag
            ref="eventTypeSelectRef"
            type="select"
            placeholder="请选择"
            v-model="selectedValue"
            dict-code="sj_lb"
            clearable
            @input="getEventTypeByOptions"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLabel">取消</el-button>
        <el-button type="primary" @click="confirmLabel">确定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { defineComponent } from "vue";
  import * as fabric from "fabric";
  import JDictSelectTag from "@/components/dict/JDictSelectTag.vue";
  import { uploadAction } from "@/api/manage";

  export default defineComponent({
    name: "EventMarkDialog",
    components: { JDictSelectTag },
    props: {
      imgUrl: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        visible: false,
        canvas: null,
        imgObj: null,
        isDrawing: false,
        rect: null,
        startX: 0,
        startY: 0,
        dialogVisible: false,
        selectedLabel: "",
        selectedValue: "",
        currentRect: null,
        selectedColor: "#ff0000",
        hasMarked: false, // 标记是否已完成
      };
    },
    methods: {
      // 将base64数据转化为blob格式
      dataURLtoBlob(dataURL, type) {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1] || type;
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      },
        
      getEventTypeByOptions(val) {
        const options = this.$refs.eventTypeSelectRef.getCurrentDictOptions();
        this.selectedLabel = options.find((item) => item.value === val)?.text;
      },

      /**
       * 打开对话框并加载图片
       * @param {string} url - 从父组件传入的图片地址，也可以不传，直接使用 props 中的 imgUrl
       */
      handleOpen(url) {
        this.visible = true;
        // 确保 dialog 渲染完成后再初始化 canvas
        this.$nextTick(() => {
          this.initCanvas(url || this.imgUrl);
        });
      },

      handleClose() {
        this.visible = false;
        this.selectedLabel = "";
        this.selectedValue = "";
        this.hasMarked = false;
        this.canvas.dispose(); // 销毁 canvas 实例以释放内存和事件监听
      },

      // 初始化 Canvas 和加载图片
      initCanvas(url) {
        // 获取容器尺寸
        const container = document.querySelector(
            "#event-mark-dialog .event-mark-content"
        );
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        if (this.canvas) {
          this.canvas.dispose();
        }

        const canvasEl = document.querySelector("#canvas");
        this.canvas = new fabric.Canvas(canvasEl, {
          width: containerWidth,
          height: containerHeight,
        });

        // 确保 canvas 实例已创建，
        if (!this.canvas) {
          console.error("Canvas 实例未创建！");
          return;
        }

        // 绑定 Canvas 事件
        this.bindCanvasEvents();
        // 清空 Canvas
        this.canvas.clear();

        const nativeImg = new Image();
        nativeImg.crossOrigin = "anonymous"; // 设置跨域

        // 原生 Image 加载成功的回调
        nativeImg.onload = () => {
          const fabricImage = new fabric.Image(nativeImg);

          // 等比缩放
          // const imgWidth = nativeImg.naturalWidth;
          // const imgHeight = nativeImg.naturalHeight;
          // const scale = Math.min(
          //   this.canvas.width / imgWidth,
          //   this.canvas.height / imgHeight
          // );
          //
          // fabricImage.set({ scaleX: scale, scaleY: scale });
          // 将图片放置在 Canvas 左上角 (0, 0)
          fabricImage.set({ left: 0, top: 0 });
          this.canvas.add(fabricImage);
          fabricImage.selectable = false;
          this.imgObj = fabricImage;
          this.canvas.centerObject(fabricImage);
          this.canvas.renderAll();
        };

        // 原生 Image 加载失败的回调
        nativeImg.onerror = (e) => {
          console.error("原生 Image 加载失败！", e);
        };

        // 设置 URL 开始加载
        nativeImg.src = url;
      },

      bindCanvasEvents() {
        const minSize = 10; // 设置最小框选尺寸阈值，可以根据需要调整

        this.canvas.on("mouse:down", (opt) => {
          // 如果点击的对象是一个可以被拖动、修改的标记组，则不进行新的绘制。
          // 通过检查对象的类型来判断，确保只对标记组生效。
          if (opt.target && opt.target.type === "group") {
            return;
          }

          // 如果用户点击的是图片本身或者空白处，继续执行绘制逻辑
          if (!this.imgObj) return;
          const pointer = this.canvas.getPointer(opt.e);
          this.isDrawing = true;
          this.startX = pointer.x;
          this.startY = pointer.y;

          this.rect = new fabric.Rect({
            left: this.startX,
            top: this.startY,
            width: 0,
            height: 0,
            stroke: this.selectedColor,
            strokeWidth: 2,
            fill: "transparent",
            opacity: 0.3,
            selectable: false,
          });
          this.canvas.add(this.rect);
        });

        this.canvas.on("mouse:move", (opt) => {
          if (!this.isDrawing || !this.rect) return;
          const pointer = this.canvas.getPointer(opt.e);
          // 确保宽度和高度为正值，以便正确绘制矩形
          const newWidth = pointer.x - this.startX;
          const newHeight = pointer.y - this.startY;

          // 调整矩形的 left 和 top，以支持反向绘制
          if (newWidth < 0) {
            this.rect.set({ left: pointer.x });
          }
          if (newHeight < 0) {
            this.rect.set({ top: pointer.y });
          }

          this.rect.set({
            width: Math.abs(newWidth),
            height: Math.abs(newHeight),
          });
          this.canvas.renderAll();
        });

        this.canvas.on("mouse:up", () => {
          this.isDrawing = false;

          // 检查矩形尺寸是否大于最小阈值
          if (
              this.rect &&
              this.rect.width > minSize &&
              this.rect.height > minSize
          ) {
            this.currentRect = this.rect;
            this.rect = null;
            this.dialogVisible = true; // 框选有效，弹出选择弹窗
          } else {
            // 如果框选无效，直接移除这个小矩形
            if (this.rect) {
              this.canvas.remove(this.rect);
            }
            this.rect = null;
          }
        });
      },

      confirmLabel() {
        if (this.selectedLabel && this.currentRect) {
          const rectColor = this.currentRect.stroke;
          const padding = 5;

          // 1. 创建文字对象
          const text = new fabric.Text(this.selectedLabel, {
            fontSize: 16,
            fill: "white",
          });

          text.set({
            left: padding, // 设置文字的 left，与背景左边距对齐
            top: padding, // 设置文字的 top，与背景上边距对齐
          });

          // 2. 创建文字背景矩形，尺寸根据文字和内边距计算
          const textBackground = new fabric.Rect({
            width: text.width + padding * 2,
            height: text.height + padding * 2,
            fill: rectColor,
            selectable: false,
          });

          // 3. 将文字和背景组合成一个 Group
          const textGroup = new fabric.Group([textBackground, text], {
            // 这个 left 和 top 是整个 Group 相对于 canvas 的位置
            left: 0,
            top: 0,
          });

          let textGroupLeft = this.currentRect.left;
          let textGroupTop;

          // 检查文字标签是否会超出画布顶部
          if (this.currentRect.top - textGroup.height < 0) {
            // 如果会超出，放在矩形框的下方
            textGroupTop = this.currentRect.top + this.currentRect.height;
          } else {
            // 否则，放在矩形框的上方
            textGroupTop = this.currentRect.top - textGroup.height;
          }

          // 检查文字标签是否会超出画布左侧或右侧
          if (textGroupLeft + textGroup.width > this.canvas.width) {
            // 如果超出右侧，将文字组右对齐到画布右侧
            textGroupLeft = this.canvas.width - textGroup.width;
          }
          if (textGroupLeft < 0) {
            // 如果超出左侧，将文字组左对齐到画布左侧
            textGroupLeft = 0;
          }

          // 设置最终 Group 的位置
          textGroup.set({
            left: textGroupLeft,
            top: textGroupTop,
          });

          // 4. 将文字组和边框组合成最终的 Group
          const finalGroup = new fabric.Group([this.currentRect, textGroup], {
            selectable: true,
          });

          this.canvas.add(finalGroup);
          this.canvas.renderAll();
          // 标记成功后设置状态为 true
          this.hasMarked = true;
        }
        this.dialogVisible = false;
        this.selectedLabel = "";
        this.selectedValue = "";
        this.currentRect = null;
      },

      cancelLabel() {
        this.dialogVisible = false;
        this.selectedLabel = "";

        // 关键改动：如果存在正在绘制的矩形，就移除它
        if (this.currentRect) {
          this.canvas.remove(this.currentRect);
        }

        // 清空所有相关的临时状态
        this.currentRect = null;
        this.rect = null;
      },

      handleRemark() {
        // 1. 保留背景图片，清空所有其他对象
        this.canvas.getObjects().forEach((obj) => {
          // 检查对象是否为图片，如果是，则不移除
          if (obj !== this.imgObj) {
            this.canvas.remove(obj);
          }
        });

        // 2. 重新绑定鼠标事件，恢复标注功能
        this.bindCanvasEvents();

        this.canvas.renderAll();
        this.hasMarked = false; // 重新标记时重置状态
      },

      handleSubmit() {
        this.$confirm(
            "确认后原始图片将被覆盖且无法取消标记，确定该操作吗？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
        )
            .then(() => {
              if (!this.canvas) return;

              // 导出图片为 Base64 或其他格式
              const dataURL = this.canvas.toDataURL({
                format: "png",
                quality: 1.0,
              });

              const blob = this.dataURLtoBlob(dataURL, "image/png");

              // 创建 FormData 对象来构建 multipart/form-data 请求体
              const formData = new FormData();

              // 'biz' 字段是固定的，可以直接写死，如果动态，可以从别处获取
              formData.append("biz", "highQuality");
              formData.append("file", blob, "marked_image.png"); // 'marked_image.png' 是文件名

              const uploadUrl = "/sys/common/upload";
              uploadAction(uploadUrl, formData)
                  .then((res) => {
                    if (res?.success) {
                      this.$emit("confirm", res.message);
                      this.$message.success("上传成功");
                    } else {
                      console.error("上传失败", res?.message);
                    }
                  })
                  .catch((err) => {
                    console.error("上传失败:", err);
                  });
            })
            .catch(() => {});
      },
    },
  });
</script>

<style scoped lang="scss">
  #event-mark-dialog {
    :deep(.el-dialog) {
      margin-top: 4vh !important;

      .el-dialog__body {
        padding: 10px 20px;
      }
    }

    .event-mark-content {
      width: 100%;
    }
  }
</style>

<style lang="scss">
  .event-mark-select-dialog {
    .el-dialog__body {
      padding: 20px;
      .mark-info-select {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
      }
    }
  }
</style>
```