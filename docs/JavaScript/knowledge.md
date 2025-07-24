### 1、模板字符串高阶用法
#### 标签模板
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

### 2、异步数据竞争态问题解决
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


### 3、常用的一些实用的JavaScript语法糖
空值合并运算符 ??
```javascript
// 传统写法
const name = user.name !== null && user.name !== undefined ? user.name : 'default';

// 简写方式
const name =user.name ??'default';
```
快速取整 ~~
```javascript
// 传统写法
const floor = Math.floor(4.9);

// 简写方式
const floor = ~~4.9;
```
合并对象
```javascript
// 传统写法
const merged = Object.assign({}, obj1, obj2);

// 简写方式
const merged = {...obj1, ...obj2};
```
短路求值
```javascript
// 传统写法
if (condition) {
    doSomething();
}

// 简写方式
condition && doSomething();
```
字符串转数字
```javascript
// 传统写法
const num = Number('123');

// 简写方式
const num =+ '123';
```
多重条件判断
```javascript
// 传统写法
if(value ===1 || value===2 || value === 3){
    // ...
}
// 简写方式
if([1,2,3].includes(value)){
    // ...
}
```
快速幂运算
```javascript
// 传统写法
Math.pow(2,3);

// 简写方式
2 ** 3;
```
交换变量值
```javascript
// 传统写法
let temp = a;
a = b;
b = temp;

// 简写方式
[a,b]= [b,a];
```


### 4、五个场景务必使用function
****箭头函数并不能完全替代传统的 function 关键字。过度滥用箭头函数，尤其是在不理解其工作原理的情况下，会导致难以追踪的 bug 和意外行为。this 的指向是 JavaScript 中最核心也最容易混淆的概念之一，而箭头函数和传统 function 在 this 的处理上有着本质区别。****
<br />
****核心区别速记：****
- function: this 的值是在函数被调用时动态决定的，取决于谁调用了它。
- => (箭头函数): 它没有自己的 this。它会捕获其定义时所在上下文的 this 值，这个绑定是固定的，不会改变。

<br />

***场景一：对象的方法 (Object Methods)***
```javascript
// 错误示范
const person = {
    name: '老王',
    age: 30,
    sayHi: () => {
        // 这里的 this 继承自全局作用域 (在浏览器中是 window)，而不是 person 对象
        console.log(`大家好，我是 ${this.name}`);
    }
};

person.sayHi(); // 输出: "大家好，我是 " (或者 "大家好，我是 undefined")


// 正确示范（使用function）
const person = {
    name: '老王',
    age: 30,
    sayHi: function() {
        // 这里的 this 在调用时被动态绑定为 person 对象
        console.log(`大家好，我是 ${this.name}`);
    },
    // ES6 对象方法简写形式，本质上也是一个 function
    sayHiShorthand() {
        console.log(`大家好，我是 ${this.name}`);
    }
};

person.sayHi(); // 输出: "大家好，我是 老王"
person.sayHiShorthand(); // 输出: "大家好，我是 老王"


// 结论： 当我们为对象定义一个需要引用该对象自身属性的方法时，请使用 function 或 ES6 方法简写。
```

***场景二：DOM 事件监听器 (Event Listeners)***
在使用 addEventListener 为 DOM 元素绑定事件时，我们常常需要访问触发该事件的元素本身（例如，修改它的样式、内容等）。传统 function 会自动将 this 绑定到该 DOM 元素上。
```javascript
// 错误示范
// 箭头函数再次从外部作用域捕获 this，导致我们无法直接操作点击的按钮。
const button = document.getElementById('myButton');

button.addEventListener('click', () => {
    // 这里的 this 依然是 window 或 undefined，而不是 button 元素
    this.classList.toggle('active'); // TypeError: Cannot read properties of undefined (reading 'classList')
});

// 正确的写法
const button = document.getElementById('myButton');

button.addEventListener('click', function() {
    // 在这里，this 被正确地绑定为触发事件的 button 元素
    console.log(this); // <button id="myButton">...</button>
    this.classList.toggle('active'); // 正常工作
});

// 结论： 在 DOM 事件监听回调中，如果我们需要用 this 来引用触发事件的元素，请使用 function。
```

***场景三：构造函数 (Constructor Functions)***
箭头函数在设计上就不能作为构造函数使用。如果我们尝试用 new 关键字来调用一个箭头函数，JavaScript 会直接抛出错误。这是因为构造函数需要有自己的 this 来指向新创建的实例，并且需要一个 prototype 属性，而箭头函数两者都不具备。
```javascript
// 错误示例
constCar=(brand)=>this.brand = brand;
const myCar = new Car('Tesla');// Uncaught TypeError: Car is not a constructor

// 正确示例
// 使用function 作为构造函数
function Car(brand){
    this.brand = brand;
}

const myCar = new Car('Tesla');
console.log(myCar.brand);   //输出:"Tesla"
// 或者使用现代的 class 语法(其 constructor'也是一个特殊的方法
class Bike {
    constructor(brand){
        this.brand = brand;
    }
}
const myBike = new Bike('Giant');
console.log(myBike.brand);  //输出:"Giant"

// 结论： 永远不要用箭头函数作为构造函数。请使用 function 或 class。
```

***场景四：原型方法 (Prototype Methods)***
与对象方法类似，当我们为构造函数的原型 prototype 添加方法时，我们也希望 this 指向调用该方法的实例。
```javascript
// 错误示范
function Person(name){
    this.name = name;
}

Person.prototype.greet = ()=>{
    // this 捕获的是定义 greet 时的全局作用aScrp
    console.log(`Hello,my name is ${this.name}`);
}
const alice = new Person('Alice');
alice.greet();  //输出:"Hello,my name is"


// 正确示范
function Person(name){
    this.name = name;
}

Person.prototype.greet = function(){
    // this 指向调用 greet 方法的实例(alice)
    console.log(`Hello,my name is ${this.name}`);
};

const alice = new Person('Alice');
alice.greet();  //输出:"Hello, my name is Alice'

// 结论： 在 prototype 上定义方法时，请使用 function，以确保 this 指向类的实例。
```

***场景五：需要 arguments 对象的函数***
箭头函数没有自己的 arguments 对象。arguments 是一个类数组对象，包含了函数被调用时传入的所有参数。如果我们在箭头函数内部访问 arguments，它只会访问到外层（如果存在）传统函数的 arguments 对象。
```javascript
// 错误示范
const myFunc=()=>{
    console.log(arguments);  // Uncaught ReferenceError: arguments is not defined
}
myFunc(1,2,3);

// 正确示范
function myFunc(){
    console.log(arguments);  // 输出:Arguments(3)[1, 2,3,callee: f, Symbol(ymbol.iterator): f]
    // 可以像数组一样操作它
    const args = Array.from(arguments);
    console.log(args.join(','));    // 输出:"1，2，3"
}
    
myFunc(1,2,3);
```

***注意：使用剩余参数，箭头函数也可以***
```javascript
const myFuncWithRest=(...args)=>{
    console.log(args);  // 输出: [1,2,3]
}
myFuncwithRest(1,2,3)
```

***最佳使用场景***
- 回调函数：尤其是在 map, filter, forEach 等数组方法中，或者在 setTimeout, Promise.then 内部，当我们需要保持外部 this 上下文时。

```javascript
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      // 这里的 this 正确地指向 timer 对象，因为箭头函数捕获了 start 方法的 this
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};

timer.start();
```

### 5、这些常见的数组操作，可能导致性能瓶颈
我们每天都在使用 <font color="#f08d49"> `map` </font>, <font color="#f08d49"> `filter` </font>, <font color="#f08d49"> `reduce` </font> 等方法，享受着函数式编程带来的便利和优雅。
<br />
然而，优雅的背后可能隐藏着性能的潜在风险。在处理小规模数据时，这些问题微不足道，但当我们的应用需要处理成百上千，甚至数万条数据时，一些看似无害的操作可能会变成压垮骆驼的最后一根稻草，导致页面卡顿、响应迟缓。
<br />
**1. 不必要的循环和中间数组**
<br />
这是最常见也最容易被忽视的问题。考虑这样一个场景：我们需要从一个用户列表中，筛选出所有激活状态（isActive）的用户，并且只提取他们的名字（name）。
<br />
很多开发者会这样写：
```javascript
const users = [/* ... 一个包含 10,000 个用户的数组 ... */];

// 写法一：链式调用
const activeUserNames = users
    .filter(user => user.isActive) // 第一次循环，生成一个中间数组
    .map(user => user.name);       // 第二次循环，在中间数组上操作

console.log(activeUserNames.length);
```
这段代码清晰、易读，但它存在一个性能问题：它循环了两次，并创建了一个临时的中间数组。
<br />
- `filter` 方法会遍历所有 10,000 个用户，创建一个新的数组（比如包含 5,000 个激活用户）。
<br />
- `map` 方法会再次遍历这个包含 5,000 个用户的中间数组，提取名字，并最终生成结果数组。总共的迭代次数是 10,000 + 5,000 = 15,000 次。



**优化方案：一次循环搞定**

我们可以使用 `reduce` 或者一个简单的 `for循环`，只遍历一次数组就完成所有工作。
```javascript
// 使用reduce
const activeUserNames = users.reduce((acc, user) => {
    if (user.isActive) {
        acc.push(user.name);
    }
    return acc;
},[]);

// 使用 for...of (通常性能更好，更易读)
const activeUserNames = [];
for (const user of users) {
    if (user.isActive) {
        activeUserNames.push(user.name);
    }
}

// 这两种优化方法都只进行了 10,000 次迭代，并且没有创建任何不必要的中间数组。在数据量巨大时，性能提升非常显著。
```

<br />

**2. <font color='#f08d49'> `unshift` </font> 和 <font color='#f08d49'> `shift` </font> —— 数组头部的“昂贵”操作**
我们需要在数组的开头添加或删除元素时，很自然地会想到 `unshift` 和 `shift`。
<br />
但这两个操作在性能上非常“昂贵”。JavaScript 的数组在底层是以连续的内存空间存储的。
- 当我们 `unshift` 一个新元素时，为了给这个新元素腾出位置，数组中所有现有元素都需要向后移动一位。
- 同样，当我们 `shift` 删除第一个元素时，为了填补空缺，所有后续元素都需要向前移动一位。
<br />
想象一下在电影院里，我们坐在第一排，然后一个新人要挤到我们左边的 0 号位置。整排的人都得挪动屁股！数据量越大，这个“挪动”的成本就越高。

```javascript
const numbers=[/*···100,000个数字..·*/];
// 极其缓慢的操作!
for (let i = 0; i < 1000; i++){
 numbers.unshift(i); //每次操作都要移动所有现有元素
}
```

**优化方案：用 `push` 和 `pop`，或者先 `reverse`**    
- **从尾部操作**：`push` 和 `pop`  只操作数组的末尾，不需要移动其他元素，因此速度极快（O(1) 复杂度）。如果业务逻辑允许，尽量将操作改为在数组尾部进行。
- **先收集，再反转**：如果我们确实需要在开头添加一堆元素，更好的办法是先把它们 `push` 进一个临时数组，然后通过 `concat` 或扩展语法合并，或者最后进行一次 `reverse`。
```javascript
const numbers = [/* ... 100,000 个数字 ... */];
const newItems = [];

for (let i = 0; i < 1000; i++) {
    newItems.push(i);   // 在新数组尾部添加，非常快
}

// 最终合并，比 1000 次 unshift 快得多
const finalArray = newItems.reverse().concat(numbers);
```


<br />

**3. 滥用<font color='#f08d49'> `includes` </font>,<font color='#f08d49'> `indexOf` </font>,<font color='#f08d49'> `find` </font>**
在循环中查找一个元素是否存在于另一个数组中，是一个非常常见的需求
```javascript
const productIds = [/*1,000个ID.-*/];
const productsInStock = [/*:5,000个有库存的产品对象”。*/];
// 性能糟糕的写法
const availableProducts = productsInStock.filter(product => 
    productIds.includes(product,id) //每次 filter 都要在 productIds 中搜索一遍
) 
```
这段代码的问题在于，`filter` 每遍历一个库存产品，`includes` 就要从头到尾搜索 `productIds` 数组来查找匹配项。如果 `productIds` 很大，这个嵌套循环的计算量将是 <font color='#f08d49'> `5000 * 1000` </font>，非常恐怖

**优化方案：使用 `Set` 或 `Map` 创建查找表**
`Set` 和 `Map` 数据结构在查找元素方面具有天然的性能优势。它们的查找时间复杂度接近 O(1)，几乎是瞬时的，无论集合有多大。
<br />
我们可以先把用于查找的数组转换成一个 `Set`。
```javascript
const productIds = [/* ... 1,000 个 ID ... */];
const productsInStock = [/* ... 5,000 个有库存的产品对象 ... */];

// 1. 创建一个 Set 用于快速查找
const idSet = new Set(productIds);  // 这一步很快

// 2. 在 filter 中使用 Set.has()
const availableProducts = productsInStock.filter(product =>
     idSet.has(product.id)  // .has() 操作近乎瞬时完成
);

// 通过一次性的转换，将一个嵌套循环的性能问题，优化成了一个单次循环，性能提升是数量级的。
```

### 6、Array.from() 的 几个好用用法，彻底告别 for 循环初始化！
**用法一：创建数字序列（替代 `for` 循环）**
```javascript
// 需求:创建一个长度为 5，值为[0，1，2，3,4]的数组
// 老办法:for 循环
const arr1 = [];
for( let i = 0; i<5; i++ ) { 
    arr1.push(i);
}

//神仙用法:Array.from()
const arr2 = Array.from({ length:5 },(value, index) => index);
console.log(arr2);  // [0,1，2，3，4]
```

**用法二：生成特定规则的数组**
`for` 循环能做的，`Array.from()` 都能做得更漂亮。比如，生成一个由偶数组成的数组，或者一个平方数序列。
```javascript
// 需求 1：创建一个包含 5 个偶数的数组 [0, 2, 4, 6, 8]
const evens = Array.from({ length: 5 }, (_, i) => i * 2);
console.log(evens); // [0, 2, 4, 6, 8]

// 需求 2：创建一个包含 1 到 5 的平方的数组 [1, 4, 9, 16, 25]
const squares = Array.from({ length: 5 }, (_, i) => (i + 1) ** 2);
console.log(squares); // [1, 4, 9, 16, 25]

// 需求 3：创建 5 个内容相同的元素
const fives = Array.from({ length: 5 }, () => 5);
console.log(fives); // [5, 5, 5, 5, 5]
```

**用法三：快速初始化对象数组**
```javascript
// 需求:创建一个包含 3 个用户的数组，每个用户有 id 和一个随机分数
const users = Array.from({length:3},(_,i) => ({
    id: i + 1,
    score: Math.floor(Math.random() * 101), //0-100的随机分
}));
console.log(users);
/**
 [
   { id: 1, score: 42 },
   { id: 2, score: 78 },
   { id: 3, score: 56 }
 ]
 */
```

**用法四：复制并深度处理数组**
`Array.from()` 不仅能从零创建，还能基于现有数组进行“深加工”。它在转换的同时进行映射，一步到位，避免了先 `map` 再 `filter` 等可能产生的中间数组。
```javascript
const original = [1, '2', 3, null, '4', 5];

// 需求：从一个混合数组中，只提取出数字，并将非数字转为 0
// 返回 [1, 0, 3, 0, 0, 5]

const processed = Array.from(original, item => {
    const num = Number(item);
    return isNaN(num) ? 0 : num;
});

console.log(processed); // [1, 2, 3, 0, 4, 5]   <-- 修正：Number('2') 是 2，Number(null) 是 0


// 需求：将所有数字乘以2，非数字项保持为 null
const processedV2 = Array.from(original, item => {
    return typeof item === 'number' ? item * 2 : null;
});
console.log(processedV2); // [2, null, 6, null, null, 10]
```

**用法五：巧妙生成字母序列**
谁说只能处理数字？`Array.from()` 结合字符编码，可以轻松生成字母表。
```javascript
// 需求：生成一个从 'A' 到 'Z' 的字母数组

const alphabet = Array.from({ length: 26 }, (_, i) => {
    // 'A' 的 ASCII 码是 65
    return String.fromCharCode(65 + i);
});

console.log(alphabet);
// ["A", "B", "C", ..., "Z"]
```

### 7、Array.prototype.with(index, value) 让数组操作性能翻倍！
在前端开发中，尤其是在使用 React 或 Vue 等现代框架时，我们被反复告知一个黄金法则：<font color='#f08d49'> **不要直接修改状态（Don’t mutate state）** </font> 。这意味着，当我们需要更新一个数组中的某个元素时，我们不能这样做：
```javascript
// ❌ 错误的做法！这会直接修改原始数组
const state = ['a', 'b', 'c', 'd'];
state[2] = 'x'; // 这是一个“突变” (mutation)
```
为什么？因为这会破坏状态的可预测性，让框架的变更检测机制“失灵”，导致各种难以追踪的 Bug。
<br />
为了遵循“不可变性”（Immutability）原则，我们多年来一直依赖一些经典的“曲线救国”方案。但浏览器已经悄悄地支持了一个全新的原生 API，它不仅让代码更优雅，还能在某些场景下让性能得到显著提升。
它就是 —— <font color='#f08d49'> **Array.prototype.with(index, value)** </font> 。
<br />
在 `with()` 出现之前，要“不可变地”更新数组中的一个元素，我们通常有两种主流方法：
<br />
方法一：使用 `map()`
```javascript
const oldArray = ['apple','banana','orange','grape'];
const newArray = oldArray.map((item,index) => {
    if(index === 2) {
        return 'mango'; //在指定位置返回新值
    }
    return item;    // 其他位置返回原值});
});
console.log(newArray);  //['apple','banana','mango'，'grape']
console.log(oldArray);  //['apple','banana','orange'，'grape'](未被改变)

// 优点：非常直观，函数式编程的典范。
// 缺点：性能开销大。即使我们只改变一个元素，map() 依然会遍历整个数组，从头到尾创建一个新数组。当数组包含成千上万个元素时，这种浪费是显而易见的。
```
方法二：使用展开语法 `...` 或 `slice()`
```javascript
const oldArray = ['apple', 'banana', 'orange', 'grape'];

// 使用展开语法
const newArray = [...oldArray]; // 1. 创建一个浅拷贝
newArray[2] = 'mango'; // 2. 修改拷贝后的数组

// 或者使用 slice()
// const newArray = oldArray.slice();
// newArray[2] = 'mango';

console.log(newArray); // ['apple', 'banana', 'mango', 'grape']
console.log(oldArray); // ['apple', 'banana', 'orange', 'grape'] (未被改变)

// 优点：比 map() 更直接，意图更清晰。
// 缺点：代码有点啰嗦，需要两步操作（先复制，再赋值）。而且，它同样需要完整地遍历并复制整个原始数组，性能瓶颈依然存在。
```
现在，让我们看看 `with()` 是如何将上述操作简化为一步的。
<br />
`with(index, value)` 方法接收两个参数：要替换的元素的索引和新值。它会返回一个全新的数组，其中指定索引处的元素已被替换，而原始数组保持不变。
```javascript
const oldArray = ['apple', 'banana', 'orange', 'grape'];

const newArray = oldArray.with(2, 'mango');

console.log(newArray); // ['apple', 'banana', 'mango', 'grape']
console.log(oldArray); // ['apple', 'banana', 'orange', 'grape'] (完美！原始数组安然无恙)
```

<br />

总结：<font color='#f08d49'>`with()`</font> 向 JavaScript 引擎传递了一个更明确的信号。当我们使用 <font color='#f08d49'>`[...oldArray]`</font>  时，我们告诉引擎：“我需要一个这个数组的完整克隆品，所有元素都得复制一遍。” 引擎只能老老实实地分配新内存，然后遍历拷贝。而当我们使用  <font color='#f08d49'>`oldArray.with(2, 'mango')`</font> 时，我们告诉引擎：“我需要一个和 <font color='#f08d49'>`oldArray`</font> 几乎一样的新数组，只有一个位置不同。”

对于一个包含 100 万个元素的数组，`map()` 和 `slice()` 需要复制 100 万个元素引用，而 `with()` 的理想开销接近于只处理 1 个元素。这就是“性能翻倍”说法的底气所在。