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

8、文件上传、下载
<br>
1）文件上传：
<br>
安装 multer
```bash
pnpm add multer
```
在路由文件 file.js 添加：
```js
// /src/router/file.js

// 配置存储规则（文件名和存储位置）
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const fullPath = path.join(__dirname, '../../uploads/images');
        console.log('上传路径:', fullPath);
        cb(null, fullPath)
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
})

const upload = multer({ storage });

const { uploadFunc, downloadFunc } = require('../controller/file.controller.js');

// 上传接口
router.post('/upload',upload.single('file'), uploadFunc)
```

`file.controller.js` 文件
```js
const path = require('path');

function uploadFunc(req, res) {
    const file = req.file;
    res.json({
        message:'上传成功',
        filename: file.filename,
        url: `/images/${file.filename}`  // 返回可访问的 URL
    })
}
```
配置静态资源访问
在 `app.js` 文件中添加：
```js
// 让浏览器可以访问上传后的图片
// 这里第一个参数是访问路径，第二个参数是静态资源路径，和上传路径一致
app.use('/images', express.static(path.join(__dirname, '../uploads/images')));
```

2）文件下载：
<br>
在路由文件 file.js 添加：
```js
router.get('/download/:filename', downloadFunc)
```
在 `file.controller.js` 文件：

```js
function downloadFunc(req, res) {
    const { filename } = req.params;
    // 根据项目静态资源位置，拼接路径
    // 注意这里路径是根目录下面的 用来存储上传文件的文件夹
    const filePath = path.join(__dirname, '../../uploads/images', filename);
    console.log('下载路径:', filePath,filename)

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('下载错误：', err);
            if (!res.headersSent) {
                res.status(404).json({
                    code: 404,
                    message: '文件不存在',
                })
            }
        }
    })
}
```
然后可以直接访问，就可以下载：
```bash
http://localhost:3000/file/download/1709992291820.png
```

9、分页接口
<br>
在路由文件 user.js 添加：
```js
router.get('/list', getUserPageList)
```
在`user.controller.js` 文件添加：
```js
// 获取分页
function getUserPageList(req, res) {
    let { page, pageSize } = req.query;
    page = Number(page);
    pageSize = Number(pageSize);

    /**
     * 分页公式
     * start = (page - 1) * pageSize
     * end   = start + pageSize
     */
    const start = (page - 1) * pageSize;
    const end = start + pageSize

    const allUsers = userService.getAllList();
    const list = allUsers.slice(start, end);

    res.json({
        code: 200,
        message:'success',
        list,
        total: allUsers.length,
        page,
        pageSize
    })
}
```
在`user.service.js` 文件添加：
```js
function getAllList() {
    const users = Array.from({ length: 100 }).map((_, index) => ({
        id: index + 1,
        name: `用户${index + 1}`,
        age: 20 + (index % 10)
    }));
    return users.sort((a, b) => b.age - a.age);
}
```
调用接口：
```bash
http://localhost:3000/user/list?page=2&pageSize=20
```


### 6、安装MongoDB 
#### 6.1、 本地安装MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```
安装完成后启动数据库服务：
```bash
brew services start mongodb-community@7.0
```
查看服务状态：
```bash
brew services list | grep mongodb
```
如果看到：
```bash
mongodb-community@7.0  started
```
说明已成功运行。
<br>
#### 6.2、 创建数据库
在node 项目安装 mongoose
```bash
pnpm add mongoose
```
创建数据库连接模块,创建：`/src/db/mongo.js`
```js
const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "mydb",        // 指定数据库名
            maxPoolSize: 10,       // 连接池数量
            serverSelectionTimeoutMS: 5000, // 等待连接超时时间
        });

        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:',err.message)
        process.exit(1);
    }
}

module.exports = { connectDB };
```
在项目入口文件 `app.js` 中添加：
```js
const { connectDB } = require('./db/mongo.js');

// 注意：需要在路由前调用数据库连接
connectDB();
```
启动服务，如果看见 `MongoDB connected successfully`,说明已成功连接数据库。
<br>
在官网 MongoDB Atlas 创建一个数据库，并连接。地址：https://cloud.mongodb.com/v2/693bb2714bc01e7d1b841688#/overview
<br>
客户端可安装 `MongoDB Compass`

### 7、 MongoDB CRUD 实战（直接工程化写法）
#### 7.1、创建数据库模型
新增 `/src/models/user.modle.js`
```js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    age: {
        type: Number,
        default: 18,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
    // 软删除
    isDeleted: {
        type: Boolean,
    },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
```

#### 7.2、创建错误统一处理高阶函数
1) 新增 `/src/utils/error.catchAsync.js`
```js
// 如果不统一处理错误，会有以下问题：
// 1、每个 controller 都要写 try/catch（重复）
// 2、错误处理分散，难以统一格式
// 3、无法区分「业务错误 / 系统错误」
// 4、日志、监控、报警都不好接
/**
 * 这是一个高阶函数，用于包装异步路由处理函数。
 * 它可以自动捕获函数中抛出的任何错误，并将错误传递给 Express 的 next() 函数，
 * 从而触发全局的错误处理中间件。
 * * @param {Function} fn 异步的 Express 路由处理函数 (req, res, next) => Promise
 */
const catchAsync = (fn) => {
    // 返回一个新的 Express 路由处理函数
    return (req, res, next) => {
        // 执行原始的异步函数 fn。
        // 如果 fn 内部出现 await 失败或抛出异常，.catch(next) 会自动调用 next(err)。
        fn(req, res, next).catch(next);
    };
};

module.exports = { catchAsync };
```

2) 创建错误处理类
```js
// 创建自定义错误类

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // 标识是否为操作性错误

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
```
根据业务需求扩展更多具体错误类型,新增 `/src/utils/error.js`
```js
// 根据业务需求扩展更多具体错误类型

const AppError = require("./AppError.js");

class CustomError extends AppError {
    constructor(message, statusCode) {
        super(message, statusCode);
    }
}

// 无权限
class UnauthorizedError extends CustomError {
    constructor(message = "无权限") {
        super(message, 401);
    }
}

// 接口不存在
class NotFoundError extends CustomError {
    constructor(message = "接口不存在") {
        super(message, 404);
    }
}

// 字段缺失
class MissingFieldError extends CustomError {
    constructor(fieldName) {
        super(`${fieldName}字段缺失`, 400);
        this.fieldName = fieldName;
    }
}

module.exports = {
    CustomError,
    UnauthorizedError,
    NotFoundError,
    MissingFieldError,
};
```
创建异常处理高阶函数，使用时，只需包裹对应的 控制器 即可,例如：
```js
const { CustomError, MissingFieldError } = require("../utils/error.js");
const { catchAsync } = require("../utils/error.catchAsync.js");
const { success } = require("../utils/response.js");

// 获取用户详情
const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new MissingFieldError("id"));
    }

    const user = await UserModel.findById(id);

    if (!user) {
        return next(new CustomError("用户不存在", 404));
    }
    success(res, "查询成功", user);
});
```

3) 响应统一处理,新增 `/src/utils/response.js`
```js
function success(res, data = {}, message = "success") {
    res.json({
        code: 200,
        message,
        data,
    });
}

module.exports = {
    success,
};
```

#### 7.3、下面是一个完整CURD示例：`/src/controllers/user.controller.js`
```js
// 控制器负责接收请求并返回响应

const { UserModel } = require("../models/user.model.js");
const { catchAsync } = require("../utils/catchAsync.js");
const { CustomError, MissingFieldError } = require("../utils/error.js");
const { success } = require("../utils/response.js");

// 新增校验函数
async function validateFields(req, next) {
    const { username, password, email, phone, avatar, age, createAt } = req.body;

    // user、password、email、phone 必填字段
    const requiredFields = { username, password, email, phone };
    const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (missingFields.length > 0) {
        return next(new MissingFieldError(missingFields.join(", ")));
    }
    // user 唯一性
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
        return next(new CustomError("用户名已存在", 400));
    }
    // email 和 phone 唯一性
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
        return next(new CustomError("邮箱已存在", 400));
    }
    const existingPhone = await UserModel.findOne({ phone });
    if (existingPhone) {
        return next(new CustomError("手机号已存在", 400));
    }
}

// 编辑校验函数
// 优化版本 - 减少数据库查询
async function validateUpdateFields(req, next) {
    const { id, username, password, email, phone, avatar, age, createAt } =
        req.body;

    if (!id) {
        return next(new MissingFieldError("id"));
    }

    // 一次性获取当前用户信息
    const currentUser = await UserModel.findById(id);
    if (!currentUser) {
        return next(new CustomError("用户不存在", 404));
    }

    // 只有当字段被修改时才进行唯一性校验
    if (username && currentUser.username !== username) {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return next(new CustomError("用户名已存在", 400));
        }
    }

    if (email && currentUser.email !== email) {
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return next(new CustomError("邮箱已存在", 400));
        }
    }

    if (phone && currentUser.phone !== phone) {
        const existingPhone = await UserModel.findOne({ phone });
        if (existingPhone) {
            return next(new CustomError("手机号已存在", 400));
        }
    }
}

// 新增用户
async function addUser(req, res, next) {
    try {
        await validateFields(req, next);

        const user = await UserModel.create({
            username,
            password,
            email,
            phone,
            avatar,
            age,
            createAt,
        });

        success(res, "用户创建成功", user);
    } catch (e) {
        // 捕获到 Mongoose 错误后，将其交给 Express 的下一个处理函数。
        // 因为这是异步操作，所以必须显式地调用 next(e)
        return next(e);
    }
}

// 如前所述，在每个异步路由中重复写 try...catch 和 return next(e) 会非常繁琐。最好的方法是使用一个高阶函数（High-Order Function）来包装您的异步路由函数，从而实现错误集中处理。
// 下面是优化后的写法，后面接口都采用优化后的写法

// 新增用户 (现在它不再需要 try...catch 块)
// const addUser = catchAsync(async (req, res, next) => {
//     // 注意：这里不再需要显式使用 next，因为错误会被 catchAsync 捕获
//
//     const { username, password, email, phone, avatar, age, createAt } = req.body;
//
//     // 数据库操作：如果失败 (例如 Mongoose 验证失败)，错误会被自动抛出并被 catchAsync 捕获
//     const user = await UserModel.create({
//         username,
//         password,
//         email,
//         phone,
//         avatar,
//         age,
//         createAt
//     });
//
//     res.json({
//         code: 200,
//         message:'success',
//         data: user
//     });
// });

// 获取所有用户 + 分页
const getUserList = catchAsync(async (req, res, next) => {
    let { page, pageSize } = req.query;

    page = Number(page);
    pageSize = Number(pageSize);

    // 参数校验
    if (page < 1) page = 1;
    if (pageSize < 1 || pageSize > 100) pageSize = 10;

    // 计算总数（排除软删除）
    const total = await UserModel.countDocuments({ isDeleted: false });

    // 分页查询（排除软删除）
    const list = await UserModel.find({ isDeleted: false })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ createAt: -1 });

    const data = {
        list,
        total,
        page,
        pageSize,
    };
    success(res, "分页查询成功", data);
});

// 更新用户
const updateUser = catchAsync(async (req, res, next) => {
    await validateUpdateFields(req, next);

    const { id, username, password, email, phone, avatar, age, createAt } =
        req.body;

    const user = await UserModel.findByIdAndUpdate(
        id,
        {
            username,
            password,
            email,
            phone,
            avatar,
            age,
            createAt,
            updateAt: Date.now(),
        },
        // 返回更新后的用户数据，这样做的好处是能够立即获取到更新后的用户信息，而不需要再次查询数据库。
        { new: true },
    );
    success(res, "更新成功", user);
});

// 删除用户
const deleteUser = catchAsync(async (req, res, next) => {
    const { ids } = req.body;

    if (!ids) {
        return next(new MissingFieldError("id"));
    }

    // 物理删除
    // await UserModel.findByIdAndDelete(id);
    // 批量软删除
    const idsArr = ids.split(",");
    await UserModel.updateMany(
        { _id: { $in: idsArr } },
        { isDeleted: true, deleteAt: Date.now() },
    );

    success(res, "删除成功");
});

// 获取用户详情
const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new MissingFieldError("id"));
    }

    const user = await UserModel.findById(id);

    if (!user) {
        return next(new CustomError("用户不存在", 404));
    }
    success(res, "查询成功", user);
});

module.exports = {
    addUser,
    getUserList,
    updateUser,
    deleteUser,
    getUserById,
};
```

#### 7.4、中间件校验
先不用 joi / zod ，先自己实现一套轻量校验，理解原理
```js
// src/middlewares/validate.middleware.js

function validate(rules) {
    return function (req, res, next) {
        try {
            for (const rule of rules) {
                const { field, location = "body", required, type } = rule;

                const value = req[location][field];

                if (required && (value === undefined || value === "")) {
                    const err = new Error(`${field} 是必填项`);
                    err.statusCode = 400;
                    throw err;
                }

                if (type && value !== undefined) {
                    if (type === "number" && isNaN(Number(value))) {
                        const err = new Error(`${field} 必须是数字`);
                        err.statusCode = 400;
                        throw err;
                    }
                }
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = validate;
```
然后在注册路由时，使用校验中间件：
```js
// src/routes/user.js

const validate = require("../middlewares/validate.middleware");

router.post(
    "/add",
    validate([
        { field: "username", required: true },
        { field: "age", type: "number" }
    ]),
    addUser
);
```
#### 7.5、配置环境文件
1) 在根目录创建 .env.development 和 .env.production
```env
NODE_ENV=development
PORT=3000
TOKEN_SECRET=kayn-854527
JWT_SECRET=kayn-854527
MONGODB_URL=mongodb+srv://kayn:li854527@cluster0.i9uh5eo.mongodb.net/
```
2) 修改`seriver.js`, 根据环境变量获取端口号和数据库连接字符串(注意环境变量加载时机)
```js
const path = require("node:path");
// 根据环境变量决定使用哪个配置文件
// 注意这里必须在app之前加载，否则 dotenv 环境变量无法加载
const env = process.env.NODE_ENV || "development";
require("dotenv").config({
    path: path.resolve(process.cwd(), `.env.${env}`),
});

const app = require("./src/app.js");

const PROT = process.env.PORT;

app.listen(PROT, () => {
    console.log(`🚀 服务已启动：http://localhost:${PROT}`);
});
```
3) 修改 `package.json`
```json
"scripts": {
  "dev": "NODE_ENV=development nodemon server.js",
  "start": "NODE_ENV=production node server.js"
}
```

### 8、日志系统
没有日志的后端，本质上是“盲飞”。
<br>
1) 安装日志库 winston
```bash
pnpm add winston
```
2) 新建 `src/utils/logger.js` , 写入
```js
const { createLogger, format, transports } = require("winston");

// 创建一个 Winston 日志记录器实例
// 配置包括时间戳、错误堆栈跟踪和 JSON 格式化
const logger = createLogger({
    level: "info", // 设置日志级别为 info
    format: format.combine(
        // 组合多种格式化选项
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 添加时间戳格式
        format.errors({ stack: true }), // 记录错误时包含堆栈信息
        format.json(), // 以 JSON 格式输出日志
    ),
    transports: [
        // 定义日志传输目标
        new transports.Console(), // 控制台输出
        new transports.File({ filename: "logs/error.log", level: "error" }), // 错误日志文件
        new transports.File({ filename: "logs/combined.log" }), // 综合日志文件
    ],
});

module.exports = logger;
```
3) 替换之前写的 console.log、console.error等等, 例如在 `service.js` 中使用日志系统:
```js
app.listen(PROT, () => {
    logger.info(`🚀 服务已启动：http://localhost:${PROT}`);
});
```
然后会在项目根目录下生成 logs 文件夹，里面有 error.log 和 combined.log 两个文件，分别记录了错误和综合日志。
<br>
控制台会输出这种日志：
```bash
{"level":"info","message":"🚀 服务已启动：http://localhost:3000","timestamp":"2025-12-17 09:51:57"}
```
### 9、安全基础
1) 跨域访问控制
跨域访问控制，即同源策略，是浏览器为了安全而设置的限制，限制了不同源的脚本访问不同源的资源。
```bash
pnpm add cors
```
在 `app.js` 中添加 cors 中间件：
```js
const cors = require("cors");

app.use(
  cors({
      // 指定允许访问的源（域名+端口），只允许这两个本地开发地址访问
      // http://localhost:3000 通常是 React/Vue 等前端开发服务器端口
      // http://localhost:5173 通常是 Vite 开发服务器端口
      origin: ["http://localhost:3000", "http://localhost:5173"],
      // 允许跨域请求携带认证信息（如 cookies、HTTP认证等）
      credentials: true
  })
);
```

2) 基础安全头 Helmet
防止最基础的 XSS / Clickjacking
```bash
pnpm add helmet
```
在 `app.js` 中添加 helmet 中间件：
```js
const helmet = require("helmet");

app.use(helmet());
```

3) 简单限流器
防止脚本刷接口、防止误操作压垮服务
```bash
pnpm add express-rate-limit 
```
在 `app.js` 中添加 express-rate-limit 中间件：
```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 分钟内最多请求 100 次
    max: 100,
})

app.use(limiter);
```



