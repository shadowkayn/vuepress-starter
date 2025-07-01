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

***核心思想就一句话：不要一次性把所有请求都发出去，让它们排队，一个一个来，或者一小批一小批来。***

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