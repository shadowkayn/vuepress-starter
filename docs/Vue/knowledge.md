### **1、组件支持vue上下文问题**
如果你的弹窗是通过函数式调用（如 renderDialog）动态创建的，那么直接在弹窗组件内部调用 router.push 可能会报错，因为函数式组件可能没有正确的 Vue 应用上下文（即 useRouter() 无法获取到正确的 router 实例）。
<br/>
**如何解决？**
<br/>
***方法一：在父组件中获取 router 实例，并作为 prop 传递给弹窗组件***
```vue
<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter(); // 在父组件获取 router
  const handleView = (record) => {
    const formProps = {
      row: record,
      router, // 将 router 作为 prop 传入弹窗
    };
    renderDialog(InspectionTaskDetail, formProps, { title: '巡检任务详情', width: 600 });
  };
</script>
```
子组件中：
```vue
<script setup>
const props = defineProps({
  row: Object,
  router: Object, // 接收父组件传入的 router
});

const goDetail = () => {
  props.router.push('/some-path'); // 使用传入的 router
};
</script>
```
***方法二：子组件抛出自定义事件emit，在父组件中完成后续逻辑***
在子组件中：
```vue
<script setup>
    const goDetail = item => {
        const { title } = item;
        const { taskCode: dataCode } = detailObj.value;
        sessionStorage.setItem(taskCode, dataCode);
        const path = warnPageUrlMap.get(title);
        props.router?.push({ path });
        // 抛出事件
        emits('closeDetail');
    };
</script>
```
在父组件中
```vue
<script setup>
    const handleView = record => {
        const formProps = {
            row: record,
            router,
            onCloseDetail: () => {
                unmount();
            }
        };
        const { unmount } = renderDialog(InspectionTaskDetail, { ...formProps }, { title: '巡检任务详情', width: 600 }, null);
    };
</script>
```


### **2、vue2、vue3全局上下文区别**
**vue2获取全局上线文**
<br/>
通过 Vue 构造函数：
```vue
<script setup>
  import Vue from 'vue'

  // 全局配置
  Vue.config.silent = true

  // 全局组件
  Vue.component('my-component', { /* ... */ })

  // 全局指令
  Vue.directive('focus', { /* ... */ })

  // 全局混入
  Vue.mixin({ /* ... */ })
</script>
```
在组件内部：
```vue
<script setup>
  export default {
    created() {
      // 访问根实例
      const root = this.$root
      // 访问父组件实例
      const parent = this.$parent
      // 访问子组件实例
      const children = this.$children
      // 访问 Vuex store
      const store = this.$store
      // 访问路由器
      const router = this.$router
    }
  }
</script>
```
<br/>

**vue3获取全局上线文**
<br/>
通过 createApp 创建的 app 实例：
```vue
<script setup>
  import { createApp } from 'vue'
  const app = createApp({})

  // 全局配置
  app.config.globalProperties.$myGlobal = 'value'

  // 全局组件
  app.component('my-component', { /* ... */ })

  // 全局指令
  app.directive('focus', { /* ... */ })

  // 全局混入
  app.mixin({ /* ... */ })
</script>
```

<br/>
在组件内部

```vue
<script setup>
  import { getCurrentInstance } from 'vue'

  export default {
    setup() {
      // 获取当前组件实例
      const instance = getCurrentInstance()

      // 访问根实例
      const root = instance.appContext.config.globalProperties

      // 访问父组件实例
      const parent = instance.parent

      // 访问 Vuex store (需要手动注入)
      // const store = useStore()

      // 访问路由器 (需要手动注入)
      // const router = useRouter()

      return {}
    }
  }
</script>
```

***主要区别：***
<br />

1、全局配置方式：
- Vue2：直接通过 Vue 构造函数
- Vue3：通过 createApp 创建的 app 实例
<br />

2、全局属性：
- Vue2：Vue2：直接添加到 Vue.prototype 上
- Vue3：通过 app.config.globalProperties 添加
<br />

3、组件实例访问：
- Vue2：直接通过 this.$xxx 访问
- Vue3：组合式 API 中需要通过 getCurrentInstance() 获取
<br />

4、多实例支持：
- Vue2：基本上是单例模式
- Vue3：支持多个应用实例，每个实例有自己的配置和上下文
<br />

5、插件安装：
- Vue2：Vue.use(plugin)
- Vue3：app.use(plugin)
<br />


### **3、customRef 和 shallowRef妙用**
在熟练掌握 `ref` 和 `reactive` 之后，随着复杂功能或优化性能的出现，需要在必要时“绕过”或“定制”Vue的默认深度响应式行为。
-  <font color="#f08d49">customRef</font> : 创建一个自定义的ref，并对其依赖跟踪和更新触发进行显式控制。
-  <font color="#f08d49">shallowRef</font> : 创建一个只对 `.value` 的赋值操作是响应式的ref。其内部的值不会被深层地转换为响应式对象。
- `customRef` 体现了对响应式原理的理解：响应式系统工作的两个核心是 `track()（依赖收集）` 和 `trigger()（更新触发）` 。能够使用 `customRef` 意味着我们已经从 API 使用者变成了 API “创造者”。
- `shallowRef` 是性能优化的利器：当有大型的、不可变的数据结构时（例如一个巨大的JSON对象、一个第三方库的实例），使用 `ref` 会对其进行深度递归代理，造成不必要的性能开销。此时 shallowRef 就是最佳选择。
下面举两个实际例子：
1. 创建一个防抖自定义ref
```javascript
// composables/useDebouncedRef.ts;
import {customRef }from'vue';

/**
 * 创建一个防抖自定义ref
 * @param value 初始值
 * @param delay 延迟毫秒数，默认 500ms
 * @returns {Ref<T>}
 */
export function useDebouncedRef<T>(value:T,delay=500){
    let timeout:number;
    // customRef 是一个强大的API，允许我们完全控制 ref 的依赖跟踪和更新触发
    return customRef((track,trigger)=>{
        return {
            get(){
                track(); //告诉Vue，这个值被读取了，需要追踪依赖
                return value;
            },
            set(newValue: T){
                clearTimeout(timeout);
                timeout = setTimeout(()=>{
                    value = newValue;
                    trigger(); //告诉Vue，值已经改变，请更新D0M
                }, delay)
            }
        }
    })
}
```
使用 `useDebouncedRef`
```vue
<script setup lang="ts">
  import { useDebouncedRef }from'./composables/useDebouncedRef';
  
  //使用起来就像一个普通的 ref，但它自带防抖功能!
  const searchText = useDebouncedRef('',500);
</script>
```

2. 使用 `shallowRef` 优化大型数据
假设我们需要引入一个庞大的图表库实例，这个实例本身有很多内部属性，但我们只关心实例本身是否被替换。
```vue
<template>
    <div ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, triggerRef }from 'vue';
import SomeHeavyChartLibrary from 'some-heavy-chart-library';  //假设一个庞大的图表库实例

//使用 shallowRef，Vue 不会尝试代理 aChartInstance 内部的所有属性
const chartInstance = shallowRef(null);
const chartContainer = ref(null);

onMounted(()=>{
    //chartInstance 的赋值是响应式的
    chartInstance.value = new SomeHeavyChartLibrary(chartContainer.value);
});

function updateChartWithOptions(newOptions){
  if(chartInstance.value){
    // chartInstance 内部属性的改变不会触发更新
    chartInstance.value.setOptions(newOptions);
    
    // 如果我们确实需要手动强制更新，可以使用 triggerRef
    // triggerRef(chartInstance);
  }
}
</script>
```


### **4、对象映射：条件判断的 “替代品”**
传统 `switch`判断示例：
```javascript
function getStatusMessage(status) {
    switch (status) {
        case 'loading':
            return '正在加载...';
        case 'success':
            return '操作成功！';
        case 'error':
            return '操作失败，请重试';
        case 'timeout':
            return '请求超时';
        default:
            return '未知状态';
    }
}
```
使用`对象映射` ，上面的代码可以简化为：
```javascript
const statusMessages = {
    loading: '正在加载...',
    success: '操作成功！',
    error: '操作失败，请重试',
    timeout: '请求超时',
}

function getStatusMessage(status){
    return statusMessages[status] || '未知状态';
}
```
<br />

<font color="#f08d49">函数映射</font> ：处理复杂逻辑
```javascript
const userActions = {
    login: (user) => {
        console.log(`用户 ${user.name} 登录成功`);
        return { success: true, token: generateToken(user) }
    },
    logout: (user) => {
        console.log(`用户 ${user.name} 退出登录`);
        clearSession(user.id);
        return { success: true };
    },
    register: (user)=> {
        const newUser = createUser(user);
        console.log(`用户 ${newUser.name} 注册成功`);
        return { success: true, user: newUser };
    }
}

function handleUserAction(action,data) {
    const handler = userActions[action];
    if(handler) {
        return handler(data);
    }
    throw new Error(`不支持的操作:${action}`);
}

// 使用示例
handleUserAction('login',{ name:'Alice', password:'123456' });
```