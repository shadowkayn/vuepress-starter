### 前端开发中最核心、最能提升你代码质量的 5 个 设计模式

#### 1、策略模式(Strategy Pattern)（解决代码里的“屎山” if-else，最简单且立竿见影）
它解决什么问题？ 当你发现你的代码里出现了超过 3 层以上的 if...else 或者 switch...case，而且逻辑非常类似时，代码就会变得难以维护（改一处错全身）。策略模式就是要把**“判断逻辑”和“执行逻辑”**分开。
##### 1.1、业务场景
假设你正在写一个“年终奖计算”的函数。根据员工的表现等级（S、A、B），发放不同的奖金倍数：
- S 级：4 倍工资
- A 级：3 倍工资
- B 级：2 倍工资
##### 1.2、普通写法（“屎山”雏形）
这种写法不仅难看，而且如果以后增加了 C 级，或者 S 级的倍数改了，你得不停地修改这个函数内部。
```js
const calculateBonus = (level, salary) => {
  if (level === 'S') {
    return salary * 4;
  }
  if (level === 'A') {
    return salary * 3;
  }
  if (level === 'B') {
    return salary * 2;
  }
};

console.log(calculateBonus('S', 10000)); // 40000
```
##### 1.3、策略模式写法（优雅进阶）
把“判断”的动作交给一个映射对象，函数只负责“执行”。
```js
// 1. 定义策略对象（所有的逻辑都在这里，非常清晰）
const bonusStrategies = {
  "S": (salary) => salary * 4,
  "A": (salary) => salary * 3,
  "B": (salary) => salary * 2,
  "C": (salary) => salary * 1, // 以后加等级，直接在这里加一行就行
};

// 2. 执行函数（这一行代码永远不需要改动）
const calculateBonus = (level, salary) => {
  return bonusStrategies[level](salary);
};

console.log(calculateBonus('S', 10000)); // 40000
```
##### 1.4、前端实战：表单验证
这是策略模式在前端最经典的用法。不要在提交表单时写一堆 if (!value) { ... }，而是定义一套校验规则。
```js
// 校验策略
const rules = {
  isNonEmpty: (value, errorMsg) => {
    if (value === '') return errorMsg;
  },
  minLength: (value, length, errorMsg) => {
    if (value.length < length) return errorMsg;
  },
  isEmail: (value, errorMsg) => {
    if (!/^\w+@\w+\.\w+$/.test(value)) return errorMsg;
  }
};
// 使用时只需要调用对应的策略名即可
```


#### 2、单例模式(Singleton Pattern)（理解全局唯一实例的概念，处理全局状态）
在前端开发中，这个模式的出现频率极高，甚至你可能已经在不知不觉中用过它了。
##### 2.1、什么是单例模式？
单例模式的定义： 确保一个类只有一个实例，并提供一个访问它的全局访问点。

通俗点说： 有些东西在整个应用运行期间，有且只能有一个。比如：
- 登录弹窗： 不管用户点多少次，页面上只应该弹出一个登录框，而不是叠罗汉。
- 全局状态管理 (Vuex / Redux)： 整个应用只能有一个 Store，否则数据就乱套了。
- 购物车： 同一个用户的购物车，在整个购物流程中应该是同一个对象。

##### 2.2、为什么需要它？
如果不使用单例，每次需要这些功能时都 new 一个新对象，会造成：
- 性能浪费： 频繁创建/销毁重量级对象（比如 DOM 节点、数据库连接）。
- 数据不同步： 如果有两个 Store 实例，你在 A 存了钱，B 里的余额却没变，这很致命。

##### 2.3、代码演练：写一个全局唯一的“Loading 遮罩层”
假设你要做一个全局的 Loading 效果。

普通写法（容易出错）
每次调用 showLoading 都创建一个新 DOM，页面会堆积无数个节点。
```js
function showLoading() {
  const div = document.createElement('div');
  div.innerHTML = '加载中...';
  document.body.appendChild(div);
}
```
单例模式写法（正解）
<br />
核心思路是：用一个变量（闭包）来保存已经创建好的实例。如果实例已经存在，就直接返回它；如果不存在，再创建。
```js
// 使用闭包来实现单例
const Loading = (function() {
  let instance = null; // 存储实例的“秘密仓库”

  return function() {
    if (!instance) {
      // 如果没有，就创建一个
      instance = document.createElement('div');
      instance.innerHTML = '加载中...';
      instance.style.display = 'none';
      document.body.appendChild(instance);
    }
    return instance; // 永远返回这同一个实例
  };
})();

// 无论调用多少次，拿到的永远是同一个 DOM 节点
const loading1 = Loading();
const loading2 = Loading();

console.log(loading1 === loading2); // true
```

##### 2.4、业务实现：电商项目中的“全局购物车数据管理器”
在很多电商应用（比如某宝、某东）里，无论你在首页、详情页，还是搜索页，右上角那个“购物车小图标”里的数字，以及你点开后的列表，都必须是实时同步且全站唯一的。

这就是对象字面量单例最发光发热的场景。

业务场景：全局购物车 (CartManager)
如果你不使用单例，而是每个页面自己管自己的购物车，那用户在详情页“加入购物车”，回到首页时发现数字还是 0，这生意就没法做了。
```js
// CartManager.js - 购物车单例
const CartManager = {
    // 1. 初始化时直接从本地读取，如果没有则为空数组
    items: JSON.parse(localStorage.getItem('my_cart') || '[]'),

    addItem(product) {
        // ... 添加逻辑 ...
        this.items.push(product);

        // 2. 状态改变后，顺手存进本地（这就是封装带来的便利）
        this._saveToLocal();
    },

    // 3. 内部私有方法，不暴露给外面（约定俗成用 _ 开头）
    _saveToLocal() {
        localStorage.setItem('my_cart', JSON.stringify(this.items));
    },

    getTotalCount() {
        return this.items.length;
    }
};

export default CartManager;
```


#### 3、工厂模式（解决“对象创建”的逻辑混乱）
##### 3.1、什么是工厂模式？
工厂模式的定义： 定义一个创建对象的接口，但让子类决定实例化哪一个类。工厂方法让类的实例化推迟到子类。

通俗点说： 你不需要自己亲手去 new 一个个复杂的对象，你只需要给“工厂”发个指令（传个参数），它就会根据你的需求，自动生产出对应的产品。

##### 3.2、为什么需要它？
在实际业务中，创建一个对象可能非常麻烦，需要配置很多参数。
- 如果不使用工厂： 你在代码的各个地方都要写一堆重复的 new 逻辑。一旦底层类名改了，或者初始化逻辑变了，你得全局搜索并修改。
- 如果使用工厂： 你只需要改“工厂”内部的一处代码，外部调用者完全无感知。这就是封装变化。

##### 3.3、代码演练：写一个“工厂”
假设一个后台管理系统，不同等级的用户看到的按钮是不一样的。创建一个“按钮工厂”，你告诉它角色，它给你成品。
```js
class ButtonFactory {
  // 这就是工厂生产线的“开关”
  static createButton(role) {
    switch (role) {
      case 'admin': return new AdminButton();
      case 'editor': return new EditorButton();
      case 'user': return new UserButton();
      default: throw new Error('未知角色');
    }
  }
}

// 业务代码里：变简洁了，且不再依赖具体的 Button 类名
const btn = ButtonFactory.createButton(role);
btn.render();
```

##### 3.4、前端实战：封装 Axios 实例
这是前端最常见的“工厂”影子。你不会在每个页面都配置一遍超时时间、请求头，而是创建一个工厂函数。
```js
function createRequest(baseUrl) {
  return axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' }
  });
}

// 生产出针对不同业务线的请求实例
const userRequest = createRequest('/api/user');
const orderRequest = createRequest('/api/order');
```


#### 4、观察者/发布订阅模式（前端通信的底层逻辑，必学）
##### 4.1、什么是观察者模式(Observer Pattern)？
定义： 定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

通俗点说： 它就像**“订阅公众号”**。
- 发布者（Subject）： 比如“人民日报”公众号。
- 观察者（Observer）： 比如你、我、他。
- 动作： 我们点击了“关注”。当公众号发文章时，它不需要一个个给粉丝打电话，它只需要群发一次，所有粉丝手机都会响。

##### 4.2、为什么需要它？
前端是事件驱动的。如果没有观察者模式，前端开发几乎无法进行：
- DOM 事件： btn.addEventListener('click', fn)。你就是观察者，按钮是发布者。
- Vue/React 的响应式： 数据变了（发布者），页面组件（观察者）自动重新渲染。
- 组件通信： 两个完全没关系的组件 A 和 B，A 想告诉 B 一件事。

##### 4.3、代码演练：手写一个简单的“发布订阅机”
```js
class EventEmitter {
    constructor() {
        // 仓库：存放所有的订阅关系
        // 格式：{ '事件名': [回调函数1, 回调函数2] }
        this.events = {};
    }

    // 1. 订阅（关注公众号）
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    // 2. 发布（给公众号发文章）
    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                // 通知所有关注的人
                callback(...args)
            });
        }
    }
    
    // 3. 取消订阅（取消关注公众号）
    off(type, handler) {
        if (this.events[type]) {
            this.events[type] = this.events[type].filter(h => h !== handler);
        }
    }
}

// --- 实战使用 ---
const bus = new EventEmitter();

// 组件 A：订阅“天气变化”
bus.on('weather_change', (info) => {
    console.log('组件 A 收到通知：今天天儿不错，是 ' + info);
});

// 组件 B：订阅“天气变化”
bus.on('weather_change', (info) => {
    console.log('组件 B 收到通知：赶紧收衣服，外面 ' + info);
});

// 某个时刻，天气真的变了（发布消息）
bus.emit('weather_change', '大暴雨');
```

##### 4.4、思考？如果一个组件被销毁了（比如用户离开了当前页面），但它之前订阅的消息没有被取消（off），会发生什么后果？
***结论：组件销毁，订阅绝不会自动消失！这是造成前端内存泄漏的最主要原因之一***
- 原理： 当你在组件里执行了 bus.on('event', callback)，这个 callback 函数会被存入 EventEmitter 实例（那个单例）的 events 数组里。
- 后果： 即使你的组件在页面上被销毁了，只要 EventEmitter 这个全局单例还在，它就一直拽着这个 callback 不放。因为函数闭包的存在，这个 callback 又拽着组件里的变量不放。
- 结局： 垃圾回收机制（GC）发现这个组件还有人“引用”着，就不敢回收它。久而久之，你的网页占用的内存会越来越大，最后直接卡死。

所以： 必须在组件销毁的生命周期（如 Vue 的 beforeUnmount 或 React 的 useEffect 的 return 中）手动调用 bus.off()。

##### 4.5、实战举例
实战一：全站的主题换肤（暗黑模式切换）
<br />
第一步：写一个全局事件总线
```js
const EventBus = {
  events: {},
  // 订阅
  on(type, handler) {
    if (!this.events[type]) this.events[type] = [];
    this.events[type].push(handler);
  },
  // 发布
  emit(type, data) {
    if (this.events[type]) {
      this.events[type].forEach(handler => handler(data));
    }
  },
  // 取消订阅
  off(type, handler) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(h => h !== handler);
    }
  }
};
```
第二步：在“侧边栏及其他组件”里使用
```js
// Sidebar.vue
function onThemeChange(newTheme) {
  console.log('侧边栏：收到！我也要变' + newTheme + '色了');
  // 执行具体的改色逻辑
}

// 1. 组件挂载时：订阅
onMounted(() => {
  EventBus.on('theme-update', onThemeChange);
});

// 2. 组件销毁时：取消订阅（防止内存泄漏！）
onUnmounted(() => {
  EventBus.off('theme-update', onThemeChange);
});
```
第三步：在“设置页面”里触发
```js
// SettingPage.vue

function toggleTheme() {
const theme = 'dark';
// 喊一嗓子，全站所有订阅了 'theme-update' 的组件都会动起来
EventBus.emit('theme-update', theme);
}
```

实战二：一个 “多人在线文档编辑”（像腾讯文档、Google Docs）。当用户 A 修改了第一段文字，服务器推过来一条消息。如何利用发布订阅模式，让页面上负责显示的组件自动更新？
在“多人在线文档”这个场景下：
- 订阅者（Observer/Subscriber）：不是“用户”，而是页面上的具体组件（比如：编辑器组件、协作列表组件、评论区组件）。
- 发布者（Publisher）：是那个负责和服务器打交道的 WebSocket 管理模块。

完整的逻辑链路应该是这样的：
- 建立频道： 你的前端应用启动一个 WebSocket 单例，它专门负责监听服务器的哨声。
- 组件订阅： “编辑器组件”在加载时，告诉事件总线：“如果有 content-update（内容更新）的消息，请叫我，并执行我的 updateText 方法”。
- 消息到达： 用户 A 修改了文档，服务器通过 WebSocket 发送了一个包给用户 B。
- 触发发布（Emit）： WebSocket 模块收到包，它不直接去改 DOM，而是调用 EventBus.emit('content-update', data)。
- 自动更新： 事件总线（EventBus）立刻翻开小本子，发现“编辑器组件”订阅了，于是执行它的回调函数。编辑器组件拿到新数据，更新画面。

为什么要这么转一道手？直接在 WebSocket 收到消息时改组件不行吗？
<br />
不行。 因为：

解耦： WebSocket 模块只需要负责收发消息，它不需要知道页面上有哪些组件，也不需要知道组件叫什么名字。
- 多重响应： 同样一条服务器消息（比如“用户 A 下线了”），可能需要同时触发：1. 协作列表里头像变灰；2. 聊天框显示“某某退出”；3. 弹出气泡提醒。
- 发布订阅模式让你只需要 emit 一次，剩下的活儿由各个组件自己领回去做。

实战三：在一个SaaS系统里，全局“消息通知”系统，无论用户是在“个人设置”里修改了头像，还是在“消息页面”收到了新私信，或者“系统后台”推送了强制下线指令，你都需要在页面的右上角弹出一个 Toast（气泡通知）。
<br />
如果不写这个模式，你必须在每个可能触发消息的组件里去手动引入 Notification 组件并调用它。如果有一天你想把气泡通知换成弹窗通知，你需要改 100 个地方。
```js
// --- EventBus.js (核心调度中心) ---
class EventEmitter {
    constructor() { this.handlers = {}; }
    on(type, handler) {
        if (!this.handlers[type]) this.handlers[type] = [];
        this.handlers[type].push(handler);
    }
    emit(type, data) {
        if (this.handlers[type]) {
            this.handlers[type].forEach(h => h(data));
        }
    }
    off(type, handler) {
        if (this.handlers[type]) {
            this.handlers[type] = this.handlers[type].filter(h => h !== handler);
        }
    }
}
export const authBus = new EventEmitter();

// --- Navbar.vue (导航栏组件) ---
import { authBus } from './EventBus';
// 组件挂载时订阅
const onLogout = () => { userAvatar.value = ''; };
authBus.on('logout', onLogout);
// 组件销毁前取消订阅（防止内存泄漏！）
onUnmounted(() => authBus.off('logout', onLogout));

// --- Settings.vue (设置页面) ---
import { authBus } from './EventBus';
const handleLogout = () => {
    localStorage.removeItem('token');
    // 喊一嗓子，所有订阅了 logout 的组件都会感知并执行逻辑
    authBus.emit('logout');
};


// 1. 全局事件总线 (EventBus.js)
const bus = new EventEmitter(); // 使用我们之前写的那个类

// 2. 消息通知组件 (Toast.vue / Toast.jsx)
// 这个组件在 App 根目录挂载一次，静静等待“哨声”
bus.on('show-message', (data) => {
  renderToast(data.text, data.type); // type 可以是 'success' 或 'error'
});

// 3. 业务组件 A：修改个人资料
function updateProfile() {
  // ... 异步请求逻辑
  bus.emit('show-message', { text: '资料修改成功！', type: 'success' });
}

// 4. 业务组件 B：网络拦截器 (Axios Interceptor)
// 只要接口报错，统一喊一嗓子
instance.interceptors.response.use(res => res, error => {
  bus.emit('show-message', { text: '网络开小差了', type: 'error' });
  return Promise.reject(error);
});
```



#### 5、装饰器模式（进阶必备，优雅地给代码“打补丁”）
##### 5.1、什么是装饰器模式？  
定义： 在不改变原对象的基础上，动态地给对象添加功能。

通俗点说： 它就像**“给手机套个壳”**。
- 你的手机（原对象）原本只能打电话。
- 你套个“带支架的壳”：手机多了支架功能。
- 你套个“防水壳”：手机多了防水功能。
- 核心： 你没有把手机拆开去改里面的零件，手机还是那个手机。

##### 5.2、前端实战场景：给“老代码”加新功能
实战一：假设你公司有一个写了 3 年的旧函数 submitForm，逻辑非常乱，你不敢乱动里面的代码。现在老板要求：在每次提交前，都要加一个“埋点统计”逻辑。

痛苦写法：
直接进到 submitForm 内部，在第一行塞入统计代码。这违背了“开闭原则”（对修改关闭），万一你手抖删了个分号，整个提交功能就挂了。

装饰器写法：
```js
// 1. 原有的老函数（不敢乱动）
function submitForm() {
  console.log('正在执行极其复杂的提交逻辑...');
  // ... 500 行老代码
}

// 2. 编写一个装饰器函数
function withLog(fn) {
  return function(...args) {
    console.log('--- 埋点统计：用户点击了提交按钮 ---'); // 新加的功能
      
    return fn.apply(this, args); // 执行原有的逻辑
  };
}

// 3. 包装一下
const smartSubmit = withLog(submitForm);

// 4. 调用（功能增强了，但原函数没变）
smartSubmit();
```

实战二：后端接口有时会不稳定（比如网络抖动），我们希望某些关键接口（比如提交订单）如果失败了，能自动重新尝试 3 次，而不是直接给用户报错。

这时候就需要用到装饰器模式了。
```js
// --- Decorators.js (工具函数) ---
/**
 * @param {Function} fn 原函数
 * @param {number} retries 重试次数
 */
export function withRetry(fn, retries = 3) {
  return async function(...args) {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`第 ${i + 1} 次尝试...`);
        return await fn.apply(this, args); // 执行原函数
      } catch (err) {
        lastError = err;
        // 如果是最后一次尝试也失败了，就抛出错误
        if (i === retries - 1) throw lastError;
      }
    }
  };
}

// --- api.js (业务逻辑) ---
import { withRetry } from './Decorators';

// 1. 原始的请求逻辑：只管发请求，不关心重试
const rawGetOrderData = async (id) => {
  const res = await axios.get(`/api/order/${id}`);
  return res.data;
};

// 2. 装饰一下：赋予它“失败自动重试 3 次”的能力
export const getOrderData = withRetry(rawGetOrderData, 3);

// --- 页面使用 ---
// 如果网络波动，控制台会打印“第 1 次尝试...”，失败了会自动来第 2 次
const data = await getOrderData(123);
```


##### 5.3、核心总结
- 它和工厂模式的区别： 工厂是创建一个新对象；装饰器是包装一个老对象。
- 它的最大好处： 极大地提高了代码的可复用性。你可以写一个 @checkAuth 装饰器，然后把它套在任何需要权限的方法上，就像贴贴纸一样方便。


