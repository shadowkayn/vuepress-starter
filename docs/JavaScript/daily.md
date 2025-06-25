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