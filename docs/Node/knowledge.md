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