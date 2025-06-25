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