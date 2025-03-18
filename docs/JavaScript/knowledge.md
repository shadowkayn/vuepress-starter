### 一、模板字符串高阶用法
#### 1、标签模板
有如下代码：
```javascript
function tag(strings, ...values) {
  console.log(strings); // ["Hello, ", "! You are ", " years old."]
  console.log(values);  // ["Alice", 25]
  return `${strings[0]}${values[0].toUpperCase()}${strings[1]}${values[1]}${strings[2]}`;
}

const name = "Alice";
const age = 25;
console.log(tag`Hello, ${name}! You are ${age} years old.`);
```
当调用 tag 函数时，JS 引擎会 拆分模板字符串：
- strings（模板的静态部分）
```javascript
["Hello, ", "! You are ", " years old."]
```
- values（插值部分）
```javascript
["Alice", 25]
```
- 拼接返回值
```javascript
return `${strings[0]}${values[0].toUpperCase()}${strings[1]}${values[1]}${strings[2]}`;
// "Hello, ALICE! You are 25 years old."
```
由此，可以联通想到另一种场景，给元素添加样式：
```javascript
const cssFunc = function (values, ...args) {
    console.log(values);  // 打印模板中静态部分 ['background-color: ', ';color: white;']
    console.log(args);    // 打印模板中动态部分 ['red']
};

const color = 'red';
const style = cssFunc`background-color: ${color};color: white;`
```
这样一来就可以灵活的处理css样式，动态的生成带有插值的样式内容<br>

这也就是大名鼎鼎的 [Styled-Component](https://styled-components.com/docs) 第三方库的实现原理，react框架 **CSS-in-JS 方案** 

除此之外 react 在使用动态类名时，也会用到 **clsx** 方案
```javascript
// Tailwind 配合 clsx
import clsx from "clsx";

const isPrimary = true;
const btnClass = clsx("p-4", isPrimary && "bg-blue-500");

function MyComponent() {
  return <button className={btnClass}>Click</button>;
}
```

### 二、异步数据竞争态问题解决
有一种场景，当多个tab页频繁切换过快时，会造成返回数据的顺序和请求的顺序不一致，导致数据错误<br>
例如，在页面A中发起请求，快速切换页面，在页面B中发起请求，当页面A和页面B都返回数据时，页面A的数据会覆盖页面B的数据，导致页面A的数据错误
![](/images/jsImages/1.jpg)
```javascript
const NOOP = () => {};

// 封装一个取消请求的高阶函数，用来取消上一次异步请求
function ceateCancelTask(asyncTask) {
    // 1、首先创建一个空函数cancel
    let cancel = NOOP; 
    return (...args) => {
        return new Promise((resolve, reject) => {
            // 3、在这个时候取消上一次请求
            // 也就是当上一次请求还没完成时,又收到了新的请求,这个时候重新调用ceateCancelTask请求
            // 代码执行到这里时,执行取消上次请求,也就是执行cancel()
            cancel();
            // 2、给空函数赋值，用于取消上一次的请求，怎么取消？如下，将resolve 和 reject 置为 NOOP 就行
            cancel = () => {
                resolve = reject = NOOP;
            };
            asyncTask(...args).then(
                (res) => resolve(res),
                (err) => reject(err)
            ) 
        })
    }
}

// 模拟封装的请求
export const fetchData = ceateCancelTask(async (type) => {
    return fetch(`http://xxx?type=${type}`).then(res => res.json())
})

fetchData('1').then((res) => {
    console.log(res)
})
fetchData('2').then((res) => {
    console.log(res)
})
```


