### 1、优雅的处理 try...catch 嵌套地狱问题
为了捕获 await 后面 Promise 的reject状态，我们必须将代码包裹在 try...catch 块中。让我们来看一个典型的例子，比如从服务器获取用户信息：
```javascript
import { fetchUserById } from './api';

async function displayUser(userId) {
    try {
        const user = await fetchUserById(userId);
        console.log('用户信息:', user.name);
        // ... 更多基于 user 的操作
    } catch(error) {
        console.error('获取用户失败:', error);
        // ... 相应的错误处理逻辑，比如显示一个提示
    }
}
```
这段代码本身没有问题，它能正常工作。但问题在于，如果你的业务逻辑稍微复杂一点，比如需要连续请求多个接口，代码就会变成这样：
```javascript
async function loadPageData(userId) {
 try {  
     const user = await fetchUserById(userId);
     console.log('用户信息:', user.name);

        try {
            const posts = await fetchPostsByUserId(user.id);
            console.log('用户文章:', posts);

            try {
                const comments = await fetchCommentsForPosts(posts[0].id);
                console.log('文章评论:', comments);
             } catch (commentError) {
                console.error('获取评论失败:', commentError);
             }
         } catch (postError) {
            console.error('获取文章失败:', postError);
         }
     }catch (userError) {
        console.error('获取用户失败:', userError);
     }
}
```
可以看到，上述代码有以下问题：代码冗余、可读性差、关注点混合

***优雅的解决方案：Go 语言风格的错误处理：***
<br />
我们可以借鉴 Go 语言的错误处理模式。在 Go 中，函数通常会返回两个值：result 和 error。调用者通过检查 error 是否为 nil 来判断操作是否成功。
<br />
我们可以将这种思想引入到 JavaScript 的 async/await 中。创建一个辅助函数（我们称之为 to），它接收一个 Promise作为参数，并且永远不会被 reject。相反，它总是 resolve 一个数组，格式为 [error, data]。如果 Promise 成功 resolve，它返回 [null, data]。如果 Promise 失败 reject，它返回 [error, null]。
<br />
实现辅助函数 to：
```javascript
// utils/promise.js
export function to(promise) {
    return promisethen(data => [null, data])
    ecatch(err => [err, oundefined]);
}
```
重构上面 loadPageData 函数：
```javascript
import{ to } from "./utils/promise";
//...import APIS

async function loadPageData(userId){
    const [userError,user]= await to(fetchUserById(userId));
    if(userError || !user){
        return console.error('获取用户失败: ',userError);
    }
    console.log('用户信息:',user.name);
    
    const [postsError, posts]= await to(fetchPostsByUserId(user.id));
    if(postsError || !posts){
        return console.error('获取文章失败:',postsError);
    }
    console.log('用户文章:',posts);
    
        
    const [commentsError,comments]= await to(fetchCommentsForPosts(posts[0].id));
    if(commentsError || !comments) {
        return console.error('获取评论失败:',commentsError);
    }
    console.log('文章评论:，comments');
}
```
可以看到 代码更扁平、更清晰；减少样板代码：将错误处理逻辑封装在可复用的 to 函数中。
<br />

同样，也可以配合 Promise.all()使用：
```javascript
async function loadDashboard(userId) {
    const [
     [userError, userData],
     [settingsError, settingsData]
    ] = await Promise.all([
        to(fetchUser(userId)), 
        to(fetchUserSettings(userId))
    ]);

    if (userError) {
        console.error('加载用户数据失败');
        // 处理用户错误
    }

    if (settingsError) {
        console.error('加载用户设置失败');
        // 处理设置错误
     }

    // 即使其中一个失败，另一个成功的数据依然可用
    if (userData) {
        // ...
     }
    if (settingsData) {
        // ...
    }
}
```

### 2、从oss下载文件直接预览或者手动保存预览
***1.首先，axios封装好api，接受文件流***
```javascript
export function downloadFile(fileName) {
    return axios({
        method: 'get',
        responseType: 'blob', // 关键点，接受的是文件流
        url: `${API_BASE_PREFIX}${url}`,
        params: params,
        headers: {
            [TOKEN_HEADER_NAME]: getToken()
        }
    });
}
```

***2.下载文件并预览***
<br />
file.js
```javascript
import { CommonApi } from '@/api/CommonApi';
import { message } from 'ant-design-vue';

// 文件下载主函数
export const downloadFile = async (blobData, fileName = '下载文件') => {
  try {
    // 创建下载链接
    const url = window.URL.createObjectURL(blobData);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName || 'download'; // 默认文件名
    // 触发下载
    document.body.appendChild(a);
    a.click();

    // 清理
    window.setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (e) {
    console.error(e);
  }
};

// 不能直接预览的文件，需强制下载
async function handleBlobDownload(blob, filename = '下载文件') {
  const blobUrl = URL.createObjectURL(blob);

  // 根据 blob.type 判断是否可预览
  const previewableTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/plain',
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ];

  if (previewableTypes.includes(blob.type)) {
    // 打开新标签页预览
    window.open(blobUrl);
  } else {
    // 不支持预览，则强制下载
    await downloadFile(blob, filename);
  }
}

// 兼容后端返回带签名的 URL 编码字符串
function extractFilename(rawFilename) {
  try {
    const decoded = decodeURIComponent(rawFilename || '');
    const withoutParams = decoded.split('?')[0];
    return withoutParams.split('/').pop() || '未命名文件';
  } catch (e) {
    console.warn('文件名解析失败，使用默认名', e);
    return '未命名文件';
  }
}

// 预览文件主函数
export async function handleFilePreview(ossUrl) {
  try {
    const response = await CommonApi.downLoadFile({ ossUrl });

    const blob = response.data;
    let filename = '未命名文件';

    const disposition = response.headers?.['content-disposition'];
    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = extractFilename(match[1]); // 提取文件名
      }
    }

    await handleBlobDownload(blob, filename);
  } catch (error) {
    console.error('文件下载失败', error);
    message.error('文件获取失败，请稍后重试');
  }
}
```

***3.使用示例：直接调用即可***
```javascript
const openPicOrVideo = async url => {
    if (url) {
        await handleFilePreview(url);
    }
};
```

### 3、上传文件api封装
```javascript
/**
 * 文件上传
 * @param url 上传地址
 * @param extraParams 额外的参数，后端需要获取的参数
 * @returns {*}
 */
export function uploadFile(url, extraParams = {}) {
    // 一般上传接口的入参格式都是formData
    const formData = new FormData();
    // 添加其他参数（如果需要）
    Object.keys(extraParams).forEach(key => {
        formData.append(key, extraParams[key]);
    });
    
    return axios({
        method: 'post',
        url: `${API_BASE_PREFIX}${url}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
            [TOKEN_HEADER_NAME]: getToken()
        }
    });
}
```

### 4、JS实现图片懒加载，10行代码实现
现代浏览器提供了 Intersection Observer API，让我们得以用一种极其高效和简洁的方式来实现懒加载。多简洁？核心逻辑只需 10 行代码。
***1、HTML结构***
<br />
懒加载的原理很简单：我们不直接将图片的 URL 放在 src 属性里，而是先放在一个自定义的 data-* 属性（如 data-src）中。src 属性可以指向一个极小的占位符图片（比如一个 1x1 像素的透明 GIF 或低质量的模糊图），以避免出现 broken image 图标。
```html
<!DOCTYPE html>
<html lang="'en'">
    <head>
        <meta charset="UTF-8">
        <title>现代图片懒加载</title>
        <style>
        /*给图片一个最小高度，以便在加载前占据空间 */
            img {
                display: block;
                margin-bottom: 50px;
                min-height: 200px;
                background-color: #f0f0f0; /*简单的占位背景色*/
            }
        </style>
    </head>
    <body>
        <h1>向下滚动查看图片懒加载效果</h1>
        <!-- 使用 class="lazy” 来标识需要懒加载的图片 -->
        <!--src 指向一个占位符，data-src存放真实图片地址 -->
        <img class="lazy" src="placeholder.gif" data-src="https://source.example.com/random/80x600?nature" alt="azy Loaded Image 1">
        <img class="lazy" src="placeholder.gif" data-src="https://source.example.com/random/800x600?city" alt="Lazy Loaded Image 2">
        <img class="lazy" src="placeholder.gif" data-src="https://source.example,com/random/800x600?people" alt="Lazy Loaded Image 3">
        <img class="lazy" src="placeholder.gif" data-src="https://source.example,com/random/800x600?tech" alt="Lazy Loaded Image 4">
        <img class="lazy" src="placeholder.gif" data-src="https://source.example.com/random/800x600?space" alt="Lazy Loaded Image 5">
        
        <script src="lazy-load.js"></script>
    </body>
</html>
```
***2、js代码如下***
```javascript
// 1.获取所有需要懒加载的图片
const lazyImages =document.querySelectorAll('.lazy');

// 2.创建-个 Intersection0bserver 实例
const callback = (entries,observer)=>{
    // 3.遍历所有被观察的元素
    entries.forEach(entry=>{
        // 4.如果元素进入视口
        if(entry.isIntersecting) {
            const img = entry.target;
            // 5.将data-src 的值赋给 
            srcimg.src = img.dataset.src;
            // 6.移除'lazy'类，可选，但便于管理
            img.classList.remove('lazy');
            // 7.停止观察该图片，释放资源
            observer.unobserve(img);
        }
    })
}
const observer = new Intersection0bserver(callback);

// 8.让 observer 开始观察所有懒加载图片
lazyImages.forEach(image => {
    observer.observe(image);
});
```

***3.优化：预加载***
<br />
Intersection Observer 还允许我们传入一个配置对象，来更精细地控制“交叉”的定义。其中 rootMargin 属性非常有用。
<br />
rootMargin 可以在视口（root）的每一边添加一个“外边距”，提前或延迟触发回调。例如，我们可以让图片在距离进入视口还有 200px 时就开始加载。
```javascript
const options = {
    root: null, // 使用浏览器视口作为根
    rootMargin: '0px 0px 200px 0px', //在底部增加 200px 的外边距
    threshold: 0 //只要有 1 像素交叉就触发
};
const observer = new Intersection0bserver(callback, options);
```

### 5、后端接口太慢，前端如何优雅地实现一个“请求队列”，避免并发打爆服务器？
***有这样一些场景：***
- 页面一加载，需要同时发 10 个请求，结果页面卡住，服务器也快崩了。
- 用户可以批量操作，一次点击触发了几十个上传文件的请求，浏览器直接转圈圈。

当后端处理不过来时，前端一股脑地把请求全发过去，只会让情况更糟。

核心思想就一句话：<font color='#f08d49'> ***不要一次性把所有请求都发出去，让它们排队，一个一个来，或者一小批一小批来。*** </font>

***如何解决？可以封装一个即插即用的请求队列，让这些请求一个一个执行***
```javascript
/**
 * 一个简单的请求池/请求队列，用于控制并发
 * @example
 * const requestPool = new RequestPool(3);
 * requestPool.add(() => fetch('https://api.example.com/data1'));
 * requestPool.add(() => fetch('https://api.example.com/data2'));
 */
class RequestPool {
    constructor(limit = 3) {
        this.limit = limit; // 并发限制数
        this.queue = []; // 等待的请求队列
        this.running = 0; // 当前正在运行的请求数
    }

    /**
     * 添加一个请求到请求队列中
     * @param {Function} requestFunc - 一个返回 Promise 的函数
     * @returns {Promise<unknown>}
     */
    add(requestFunc) {
        return new Promise((resolve, reject) => {
            this.queue.push({ requestFunc, resolve, reject });
            this._run(); // 每次添加后，都尝试运行
        });
    }

    _run() {
        // 只有当 正在运行的请求数 < 限制数 且 队列中有等待的请求时，才执行
        while (this.running < this.limit && this.queue.length > 0) {
            // 取出队首的任务
            const { requestFunc, resolve, reject } = this.queue.shift();
            this.running++;

            requestFunc()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--; // 请求完成，空出一个位置
                    this._run(); // 尝试运行下一个
                });
        }
    }
}
```

***使用如下：***
```javascript
// 1.模拟一个请求比较慢的接口
function mockApi(id) {
    const delay = Math.random() * 1000 + 500;
    console.log(`[${id}] 🚀 请求开始... `);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`[${id}] ✅ 请求完成!`);
            resolve(`任务${id}的结果 ✅`);
        }, delay);
    });
}

// 2.创建一个请求池，限制并发为 2
const pool = new RequestPool(2);

// 3.将请求添加到请求池中
for (let i = 1; i <= 6; i++) {
    pool
        .add(() => mockApi(i))
        .then((result) => {
            console.log(`[${i}]收到结果:${result}`);
        });
}
```
运行上面代码，输出结果大致这样：
```
[1] 🚀 请求开始...
[2] 🚀 请求开始...
// (此时 3, 4, 5, 6 在排队)

[1] ✅ 请求完成!
[1] 收到结果: 任务 1 的结果
[3] 🚀 请求开始...   // 1号完成，3号立刻补上

[2] ✅ 请求完成!
[2] 收到结果: 任务 2 的结果
[4] 🚀 请求开始...   // 2号完成，4号立刻补上
```


### 6、无感刷新Token：如何做到让用户“永不掉线”
首先，我们要理解为什么需要刷新 Token。
<br />
我们通常使用 `Access Token` 来验证用户的每一次 API 请求。为了安全，`Access Token` 的生命周期被设计得很短（例如 30 分钟或 1 小时）。如果有效期太长，一旦泄露，攻击者就能在很长一段时间内冒充用户进行操作，风险极高。
<br />
这就产生了一个矛盾：
- 安全性要求：`Access Token` 有效期要短。
- 用户体验要求：用户不想频繁地被强制重新登录。
<br />
为了解决这个矛盾，`Refresh Token` 应运而生。

**核心理念：双 Token 认证系统**
无感刷新机制的核心在于引入了两种类型的 Token：
<br />
1.<font color='#f08d49'>**Access Token（访问令牌）**</font>
- 用途：用于访问受保护的 API 资源，附加在每个请求的 `Header` 中。
- 特点：生命周期短（如 1 小时），无状态，服务器无需存储。
- 存储：通常存储在客户端内存中（如 Vuex/Redux），因为需要频繁读取。
<br />

2.<font color='#f08d49'>**Refresh Token（刷新令牌）**</font>
- 用途：当 `Access Token` 过期时，专门用于获取一个新的 `Access Token`。
- 特点：生命周期长（如 7 天或 30 天），与特定用户绑定，服务器需要安全存储其有效性记录。
- 存储：必须安全存储。最佳实践是存储在 `HttpOnly Cookie` 中，这样可以防止客户端 JavaScript 脚本（如 XSS 攻击）读取它。
<br />

`Access Token` 通常是无状态的，服务器无需记录它，也导致 JWT 无法主动吊销，而 `Refresh Token` 是有状态的，服务器需要一个列表（数据库中的“白名单”或“吊销列表”）来记录哪些 `Refresh Token` 是有效的，当用户更改密码、或从某个设备上“主动登出”时，服务器端可以主动将对应的 `Refresh Token` 设为无效。

**无感刷新的详细工作流**
1. 首次登录：用户使用用户名和密码登录。服务器验证成功后，返回一个 `Access Token` 和一个 `Refresh Token`。
2. 正常请求：客户端将 `Access Token` 存储起来，并在后续的每次 API 请求中，通过 `Authorization` 请求头将其发送给服务器。
3. Token 过期：当 `Access Token` 过期后，客户端再次用它请求 API。服务器会拒绝该请求，并返回一个特定的状态码，通常是 `401 Unauthorized`。
4. 拦截 401 错误：客户端的请求层（如 Axios 拦截器）会捕获这个 `401` 错误。此时，它不会立即通知用户“你已掉线”，而是暂停这个失败的请求。
5. 发起刷新请求：拦截器使用 `Refresh Token` 去调用一个专门的刷新接口（例如 `/api/auth/refresh`）。
6. 处理刷新结果：
 - 刷新成功：服务器验证 `Refresh Token` 有效，生成一个新的 `Access Token`（有时也会返回一个新的 `Refresh Token`，这被称为“刷新令牌旋转”策略，可以提高安全性），并将其返回给客户端。
 - 刷新失败：如果 `Refresh Token` 也过期了或无效，服务器会返回错误（如 `403 Forbidden`）。这意味着用户的登录会话彻底结束。
7. 重试与终结：
 - 若刷新成功：客户端用新的 `Access Token` 自动重发刚才失败的那个 API 请求。用户完全感觉不到任何中断，数据操作无缝衔接。
 - 若刷新失败：客户端清除所有认证信息，强制用户登出，并重定向到登录页面。

**实战演练：使用 Axios 拦截器实现无感刷新**
1. ***创建 Axios 实例***
```javascript
// api/request.js
import axios from 'axios';

const service = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
    config => {
    // 在发送请求之前，从 内存 (e.g., Vuex/Pinia/Redux) 获取 token
    const accessToken = getAccessTokenFromStore();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
```

2. ***核心：响应拦截器*** （这是实现无感刷新的关键。）
```javascript
// api/request.js (续)

// 用于刷新 token 的 API
import { refreshTokenApi } from './auth';

let isRefreshing = false;   // 控制刷新状态的标志
let requestsPool = [];  // 存储因 token 过期而挂起的请求队列

service.interceptors.response.use(
    response => response, // 对成功响应直接返回
    async error => {
        const { config, response: { status } } = error;

        // 1. 如果不是 401 错误，直接返回错误
        if (status !== 401) {
            return Promise.reject(error);
        }

        // 2. 避免重复刷新：如果正在刷新 token，将后续请求暂存
        if (isRefreshing) {
            return new Promise(resolve => {
                requestsPool.push(() => resolve(service(config)));
            });
         }

        isRefreshing = true;

            try {
                // 3. 调用刷新 token 的 API
                const { newAccessToken } = await refreshTokenApi(); // 假设 refresh token 通过 HttpOnly cookie 自动发送
            
                // 4. 更新本地存储的 access token
                setAccessTokenInStore(newAccessToken);
            
                // 5. 重试刚才失败的请求
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
                // 6. 重新执行所有被挂起的请求
                requestsPool.forEach(cb => cb());
                requestsPool = []; // 清空队列
        
                return service(config); // 返回重试请求的结果
            } catch (refreshError) {
                // 7. 如果刷新 token 也失败了，则执行登出操作
                console.error('Unable to refresh token.', refreshError);
                logoutUser(); // 清除 token，重定向到登录页
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
    }
);

export default service;
```
***代码解析：***
- 并发处理：`isRefreshing` 标志和 `requests` 数组是关键。当第一个 `401` 错误触发刷新时，`isRefreshing` 变为 `true`。后续在刷新完成前到达的 401 请求，都会被推进 `requests` 队列中挂起，而不是重复发起刷新请求。当刷新成功后，再遍历队列，依次执行这些被挂起的请求。
- 原子操作：通过这种“加锁”机制，确保了刷新 Token 的操作是原子的，避免了资源浪费和潜在的竞态条件。
- 优雅降级：当 `Refresh Token` 也失效时，系统会执行 `logoutUser()`，进行清理工作并引导用户重新登录，这是一个优雅的失败处理方案。