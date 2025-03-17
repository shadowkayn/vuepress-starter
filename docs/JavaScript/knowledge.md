#### 一、模板字符串高阶用法
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


