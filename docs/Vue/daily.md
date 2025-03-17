### 一、命令式调用的Dialog弹窗
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
