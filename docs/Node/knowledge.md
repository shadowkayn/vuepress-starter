## knowledge

### 1、process 模块
#### 1.1、使用 `process.argv` 获取命令行参数
```javascript
    const args = process.argv.slice(2);
    const [lang = "en", name = "kayn"] = args;
    if (lang === "en") {
        console.log(`Hello, ${name}`);
    } else if (lang === "jp") {
        console.log(`こんにちは、${name}`);
    } else if (lang === "zh") {
        console.log(`你好，${name}`);
    } else {
        console.log(`language "${lang}" is not supported yet`);
    }
```
#### 1.2、配合 `dotenv` 查看环境信息，使用 `process.env` 获取环境变量
```javascript
const dotenv = require("node:dotenv");
const os = require("node:os");

console.log("--- 环境信息 ---");
console.log("系统平台", process.platform);
console.log("Node版本", process.version);
console.log("项目端口号", process.env.PORT);
console.log("当前环境", process.env.NODE_ENV);
console.log("项目根目录", process.cwd());
console.log("CPU信息", os.cpus());
console.log("内存信息", os.totalmem());

console.log("--- 系统信息 ---");
console.log("CPU 核心数量", os.cpus().length);
console.log("系统名称", os.hostname());
console.log("系统时间", os.uptime());
console.log("系统信息", os.type());
console.log("用户信息", os.userInfo());
console.log("系统版本", os.version());
console.log("系统架构", os.arch());
```


### 2、path 模块
#### 2.1、常用一些API
```javascript
// commonJs 写法
const path = require("node:path");

// ES Module 写法
// 当前文件路径（ESModule 中没有 __dirname，需要自己构造）
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log("当前文件路径：", __filename);
// console.log("当前目录路径：", __dirname);

const { renameFiles } = require("../utils/fileTools");

/**
 * path模块 常用方法
 */

console.log("--- path模块 ---");
// 当前目录
console.log("当前目录", path.resolve());
// 路径拼接
console.log("拼接路径", path.join("src", "index.js"));
// 转化为结对路径
console.log("绝对路径", path.resolve("src/demos/testFiles"));
// 获取文件名
console.log("文件名", path.basename("src/index.js"));
// 获取文件扩展名
console.log("扩展名", path.extname("src/index.html"));
// 获取上级目录
console.log("上级目录", path.dirname("src/demo/index.js"));

const targetFolder = "src/demos/testFiles";
renameFiles(targetFolder);
```

#### 2.2、使用 `path` 模块
##### 2.2.1 批量重命名文件
```javascript
const fs = require("node:fs");
const path = require("node:path");

/**
 * 批量重命名文件
 * @param folderPath 文件夹路径
 */
function renameFiles(folderPath) {
    const files = fs.readdirSync(folderPath);
    console.log("files", files);
    files.forEach((file, index) => {
        const ext = path.extname(file);
        const newName = `${index + 1}${ext}`;
        const oldPath = path.join(folderPath, file);
        const newPath = path.join(folderPath, newName);

        console.log("oldPath", oldPath, "newPath", newPath);
        fs.renameSync(oldPath, newPath);
    });
}
```


### 3、fs 模块

#### 3.1、常用一些API
| 方法                | 作用       | 同步版                  |
| ----------------- | -------- | -------------------- |
| `fs.readFile()`   | 异步读取文件内容 | `fs.readFileSync()`  |
| `fs.writeFile()`  | 异步写入文件   | `fs.writeFileSync()` |
| `fs.readdir()`    | 读取文件夹内容  | `fs.readdirSync()`   |
| `fs.stat()`       | 获取文件信息   | `fs.statSync()`      |
| `fs.existsSync()` | 判断文件是否存在 | —                    |
| `fs.mkdir()`      | 创建文件夹    | `fs.mkdirSync()`     |
| `fs.unlink()`     | 删除文件     | `fs.unlinkSync()`    |
| `fs.rename()`     | 重命名文件    | `fs.renameSync()`    |

#### 3.2、使用 `fs` 模块
##### 3.2.1 基础`读写`功能
```javascript
const fs = require("node:fs");
const path = require("node:path");

const filePath = path.join(__dirname, "/fsFiles/testFiles/hello.txt");

console.log("--- 文件系统 ---", filePath);

// 确保目录存在
const dirPath = path.dirname(filePath);
console.log("目录路径：", dirPath);
// return;
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// ✏️ 写入文件
fs.writeFileSync(filePath, "Hello Node.js!\n学习文件操作", "utf8");
console.log("写入成功");

// 📖 读取文件（同步）
console.time("sync read");
const content = fs.readFileSync(filePath, "utf-8");
console.log("文件内容：\n", content);
console.timeEnd("sync read");

// 📖 异步读取文件
console.time("async read");
fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return console.error("❌ 读取失败：", err);
    console.log("异步读取内容：\n", data);
    console.timeEnd("async read");
});
```

##### 3.2.2 读取、写入Json文件
```javascript
const fs = require("node:fs");
const path = require("node:path");

const jsonPath = path.join(__dirname, "./testFiles/data.json");
console.log("jsonPath:", jsonPath);

const user = {
    name: "kayn",
    age: 25,
    skills: ["js", "vue", "react", "node"],
};

fs.writeFileSync(jsonPath, JSON.stringify(user, null, 2), "utf-8");
console.log("Json文件 写入成功!");

const jsonStr = fs.readFileSync(jsonPath, "utf-8");
console.log("Json文件 读取结果：", JSON.parse(jsonStr));
```

##### 3.2.3 读取文件目录信息 工具函数
```javascript
/**
 * 递归统计文件夹信息
 * @param dirPath
 */
// 判断命令行参数
const processArgs = process.argv[2];
// 如果传入的是相对路径，则转为绝对路径,反之默认整个项目根目录
const folder = processArgs
    ? path.resolve(process.cwd(), processArgs)
    : process.cwd();

let totalSize = 0;
const fileTypeCount = {};

function analyzeDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        try {
            // 获取文件信息
            const stats = fs.statSync(fullPath);
            if (stats.isFile()) {
                totalSize += stats.size;
                const ext = path.extname(file) || "noExt";
                fileTypeCount[ext] = (fileTypeCount[ext] || 0) + 1;
            } else if (stats.isDirectory()) {
                // 如果是目录，则递归调用，且跳过 node_modules 、idea 等目录
                if (
                    !file.startsWith(".") &&
                    !file.startsWith("node_modules") &&
                    !file.startsWith("idea")
                ) {
                    analyzeDir(fullPath);
                }
            }
        } catch (e) {
            console.warn("无法访问", e);
        }
    });
}

analyzeDir(folder);
console.log("📂 文件夹：", folder);
console.log(
    "📄 总文件数：",
    Object.values(fileTypeCount).reduce((a, b) => a + b, 0),
);
console.log("📊 各类型统计：", fileTypeCount);
console.log("📦 文件总大小：", (totalSize / 1024).toFixed(2), "KB");
```


### 4、http 模块
#### 4.1、http 基础
| 知识点                   | 说明                          |
| --------------------- | --------------------------- |
| `http.createServer()` | 创建一个服务器                     |
| `req`                 | 请求对象（包含 url、method、headers） |
| `res.writeHead()`     | 设置状态码与响应头                   |
| `res.end()`           | 结束并返回响应内容                   |
| `url.parse()`         | 解析请求路径与参数                   |
| `JSON 与 HTML 返回`        | 设置不同的 `Content-Type`        |

直接看例子：
```javascript
// httpBasic.js

require("dotenv").config();
const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");
const dirPath = require('node:path')

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    switch (path) {
        // 首页
        case "/":
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Hello World! 欢迎来到首页！");
            break;

        // 读取文件
        case "/text":
            const filePath = dirPath.join(__dirname, "../demos/fsFiles/testFiles/hello.txt");
            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                    res.end("读取文件失败");
                } else {
                    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                    res.end(data);
                }
            });
            break;

        // html页面
        case "/html":
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(`
            <html lang="en">
                <head><title>Node Server</title></head>
                <body>
                    <h1>你好 node.js!</h1>
                    <p>这是来自 Node 原生 HTTP 服务的 HTML 页面。</p>
                </body>
            </html>
        `);
            break;

        // 接口 返回Json数据
        case "/api/info":
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.write("info 接口");
            const data = {
                name: "张三",
                age: 18,
            };
            res.end(JSON.stringify(data));
            break;
        default:
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
            break;
    }
});

server.listen(process.env.PORT, () => {
    console.log(`服务启动成功，端口：${process.env.PORT}`);
    console.log(`✅ 服务器运行中：http://localhost:${process.env.PORT}`);
});
```

### 5、express 框架

#### 5.1 、express 基础
```javascript
// expressBasic.js

const express = require("express");
const app = express();
// 添加解析JSON的中间件
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello Express!');
})

app.get('/api/json', (req, res) => {
    res.json({
        name: 'Kayn',
        msg: 'Express JSON 返回成功！'
    });
})

app.get('/api/search', (req, res) => {
    const { keyword,limit } = req.query;
    res.json({ keyword,limit });
})

app.get('/user/:id',(req, res) => {
    res.json({
        id: req.params.id,
        message:'获取到用户ID'
    })
})

app.post('/api/login', (req, res) => {
    const { username, password} = req.body;
    res.json({
        username,
        password,
        message: '登录信息已接收！'
    })
})

app.listen(3000, () => {
    console.log('🚀 Express 服务已启动：http://localhost:3000');
});
```

#### 5.2、express 路由工程化
1、先创建一个模块，例如创建一个user模块
```javascript
// user.js

// 路由分模块管理，这是其中一个user模块；下面是一个完整的增删改查案例
const express = require('express')
const router = express.Router()

// 模拟数据
let users = [
    { id: 1, name: 'Kayn' },
    { id: 2, name: 'Leo' },
];

router.get('/', (req, res) => {
    res.json(users)
})

router.get('/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id))
    if (!user) res.status(404).send('用户不存在')
    res.json(user || {})
})

router.post('/add', (req, res) => {
    const { name } = req.body;
    const newUser = { id: Date.now(), name };
    users.push(newUser);
    res.json(newUser);
})

router.put('/edit', (req, res) => {
    const { id } = req.body;
    const user = users.find(user => user.id === parseInt(id))
    if (!user) res.status(404).send('用户不存在')
    user.name = req.body.name
    res.json(user)
})

router.delete('/delete', (req, res) => {
    const { id } = req.body;
    const user = users.find(user => user.id === parseInt(id))
    if (!user) res.status(404).send('用户不存在')
    const index = users.indexOf(user)
    users.splice(index, 1)
    res.json(user)
})
// 导出这个路由
module.exports = router
```

2、创建一个app.js文件，这个作为主路由文件，并引入其他模块
```javascript
// app.js

// 路由分模块管理，这是主路由文件
const express = require("express");
const app = express();
app.use(express.json());

// 在主路由文件引入其他路由模块，例如user.js
const userRouter = require("./user.js");
app.use('/users', userRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

#### 5.3、express 进阶用法
1、静态资源托管
```pgsql
[//]: # (创建目录)
public/
  ├── index.html
  └── logo.png
```
```javascript
// 在express主文件中添加静态资源托管
app.use(express.static('public'));
```
```bash
// 可访问
http://localhost:3000/index.html
http://localhost:3000/logo.png
```
2、处理跨域
```bash
pnpm add cors
```
```js
import cors from 'cors';
app.use(cors());

// 也可以配置白名单，具体如下：
app.use(cors({
    origin: ['http://localhost:5173', 'https://example.com']
}));
```
3、全局错误处理中间件
```js
app.use((err, req, res, next) => {
  console.error('❌ 错误信息：', err.message);
  res.status(500).json({
    code: 500,
    msg: '服务器内部错误',
    error: err.message
  });
});

// 然后任何路由中
throw new Error('数据库连接失败');

// 这样就会触发全局错误处理中间件，并返回错误信息给客户端。
```

4、dotenv 环境变量管理
dotenv 是一个 Node.js 库，用于加载环境变量。把敏感配置放到 .env：
```ini
PORT=3000
DB_URL=mongodb://localhost:27017/test
TOKEN_SECRET=kayn-123456
```
在入口文件 service.js 中引入 dotenv：
```javascript
import 'dotenv/config';

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`服务器运行在 ${PORT}`));
```

5、nodemon 自动重启
```bash
pnpm add nodemon -D
```
在package.json中添加scripts：
```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

6、JWT 实现用户认证
```bash
pnpm add jsonwebtoken
```
```js
// 1、生成 Token
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    const user = { id: 1, name: 'Kayn' };
    const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

// 2、验证 Token（中间件）
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ msg: '未登录' });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ msg: 'Token 无效' });
    }
}

// 3、受保护路由中间加入 JWT中间件，这样访问受保护的路由时，会先经过 JWT 中间件进行验证，验证成功后才能访问。 
app.get('/profile', authMiddleware, (req, res) => {
    res.json({ msg: '个人信息', user: req.user });
});
```


7、项目结构优化（模块化）
创建一个模块化结构，将路由、控制器、模型、服务、工具等模块进行分类管理，并使用 require 引入。
创建目录结构：
```pgsql
project/
├── src/
│   ├── app.js             # express 核心 app
│   ├── router/            # 路由
│   │   ├── user.router.js  # 用户路由
│   │   ├── auth.router.js  # 认证路由
│   ├── controller/        # 控制器
│   │   ├── user.controller.js  # 用户控制器
│   │   ├── auth.controller.js  # 认证控制器
│   ├── service/           # 服务
│   │   ├── user.service.js  # 用户服务
│   └── utils/
│       └── db.js (可选)
└── server.js              # 入口文件 
```

下面是一个全面的示例：
<br/>
1）入口文件 service.js
```javascript
// service.js

require('dotenv').config();
const app = require('./src/app.js');

const PROT = process.env.PORT;

app.listen(PROT, () => {
    console.log(`🚀 服务已启动：http://localhost:${PROT}`);
});
```
2）核心文件 app.js
```javascript
// /src/app.js

const express = require('express');
const cors = require('cors');
const routers = require('./router/index.js')

const app = express();

// 循环挂载路由
Object.keys(routers).forEach(key => {
    app.use(key, routers[key]);
})

// 错误处理中间件； 中间件要放在路由后面
app.use((err, req, res, next) => {
    console.error('❌ 错误信息：', err.message);
    res.status(500).json({
        code: 500,
        msg: '服务器内部错误',
        error: err.message
    });
});

// 静态资源托管
app.use(express.static('public'))

// 解决跨域
app.use(cors());
// 可选：配置白名单
app.use(cors({
    origin: ['http://localhost:3000/', 'http://127.0.0.1:8080'],
}))

module.exports = app;
```

3）路由文件
<br>
主路由文件
```javascript
// /src/router/index.js 主路由文件

// 在主路由文件引入其他路由模块，例如user.js
const userRouter = require("./user.js");
const authRouter = require("./login.js");

// 注册路由路径
const routerObject = {
    '/users': userRouter,
    '/auth': authRouter
}

module.exports = routerObject;
```
用户路由文件、认证路由文件
```javascript
// /src/router/user.js 用户路由文件
const express = require('express')
const router = express.Router()
const { getUserList, getUserById,getProfile } = require('../controller/user.controller')
const { authMiddleware } = require('../controller/auth.controller')

router.get('/', getUserList);
router.get('/:id', getUserById);
// 这个接口需要登录才能访问
router.get('/get/profile',authMiddleware, getProfile)

module.exports = router


// /src/router/auth.js 认证路由文件
const express = require('express');
const router = express.Router();
const { login } = require('../controller/login.controller');

router.get('/', login)

module.exports = router;
```

4）控制器文件
<br>
控制器负责接收请求并返回响应：
```js
// /src/controller/user.controller.js

const userService = require('../service/user.service');

function getUserList(req, res) {
    const userList = userService.getAll();
    res.json(userList)
}

function getUserById(req,res) {
    const id = req.params.id;
    const user = userService.getById(id);
    res.json(user)
}

// 获取需要登录才能访问的接口
function getProfile(req, res) {
    const info = { name:'unknow', age:18, skills:'nothing', tips:'u fool!!!' }
    res.json({ message:'个人信息',info })
}

module.exports = {
    getUserList,
    getUserById,
    getProfile
}


// /src/controller/auth.controller.js

const jwt = require('jsonwebtoken')

function login(req, res) {
    const user = { id: 1, name: 'Kayn' }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
}

// 验证token中间件
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = {
    login,
    authMiddleware
}
```

5）服务文件
<br>
服务负责处理业务逻辑,数据处理逻辑集中在这里：
```js
// /src/service/user.service.js

const userService = {
    getAll(){
        return [
            { id: 1, name: 'Kayn' },
            { id: 2, name: 'Leo' }
        ]
    },
    getById(id){
        return { id, name: 'User ' + id  }
    },
}

module.exports = userService;
```
