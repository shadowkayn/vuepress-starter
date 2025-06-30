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