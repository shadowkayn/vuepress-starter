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