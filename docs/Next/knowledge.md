## knowledge

### 1、Next.js 基础
1) [Next.js](https://nextjs.org/)
2) Next.js ≠ SSR 框架，Next.js 是基于 Node 的全栈应用框架，SSR只是其中一个能力
3) 创建 Next.js 项目
```bash
pnpm create next-app next-node-project
```

### 2、Next.js 基本语法
1) Route Handler ≈ Express Router，即：文件路径 = 路由路径
例如在 Express 中写的是：
```js
app.get('/user/users', controller)
```
在 Next.js App Router 中写是：
先在  `src/app` 下创建文件：
```txt
app/api/user/list/route.ts
```
在 `route.ts` 中写：
```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    code: 0,
    message: "success",
    data: [
      { id: 1, username: "kayn" },
      { id: 2, username: "leo" }
    ]
  });
}
```
浏览器或Postman访问：
```bash
GET http://localhost:3000/api/user/list
```

### 3、Next.js 接入 MongoDB
1) 在next项目安装 mongodb
```bash
pnpm add mongoose 
```
2) 创建 src/lib/db.ts 连接数据库
```ts
// src/lib/db.ts
import * as mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local",
    );
}

// 防止开发环境重复连接
// Next.js 开发模式会频繁热更新
// 不缓存连接 = MongoDB 被打爆
// 这段代码是 Next.js 官方级写法
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    // 如果已经存在连接，则直接返回
    if (cached.conn) {
        return cached.conn;
    }

    // 如果没有正在建立的连接，则创建新的连接
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }

    // 等待连接建立并缓存结果
    cached.conn = await cached.promise;
    return cached.conn;
}
```
3) 创建模型 `model` *src/models/user.model.ts*
```ts
// src/models/user.model.ts

import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    age: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

// models.User || ... 是为了解决 Next.js 热更新重复注册模型的问题
const User = models.User || mongoose.model("User", UserSchema);

export default User;
```
4) 修改之前的接口文件 `src/app/api/user/list/route.ts`
```ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  await connectDB();

  const list = await User.find();

  return NextResponse.json({
    code: 0,
    message: "success",
    data: list
  });
}

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const user = await User.create(body);

  return NextResponse.json({
    code: 0,
    message: "用户创建成功",
    data: user
  });
}
```
5) 配置环境变量 `.env.local`
<br>
写入数据库连接地址,最后面名称（next_ db）就是 数据库名称：
```bash
MONGODB_URI=mongodb+srv://kayn:li854527@cluster0.i9uh5eo.mongodb.net/next_db
```
6) 运行项目
<br>
使用 Postman 测试接口：使用`GET`访问 `http://localhost:3000/api/user/list` ，再使用`POST`访问 `http://localhost:3000/api/user/list` ；在compass中检测数据是否创建：
![''](/images/nodeImages/img1.png)

### 4、统一响应处理（工程化）
所有接口返回统一格式; 错误不是随便 throw; 业务错误 / 系统错误可区分; Route Handler 看起来干净
<br>
1) 创建 `src/lib/response.ts`
```ts
// src/lib/response.ts

import { NextResponse } from "next/server";

export function success(data: any = null, message: string = "success") {
    return NextResponse.json({
        code: 200,
        data,
        message,
    });
}

export function error(message: string = "error", code: number = 500) {
    return NextResponse.json({
        code,
        message,
    });
}
```
2) 定义 "业务错误" 类
```ts
// src/lib/httpError.ts

export class HttpError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
```
3) 修改接口文件 `src/app/api/user/list/route.ts`
```ts
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { success, error } from "@/lib/response";
import { HttpError } from "@/lib/httpError";

export async function GET() {
  try {
    await connectDB();
    const list = await User.find();
    return success(list);
  } catch (e: any) {
    return error(e.message);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.username) {
      // 这一步的意义是：
      // 不再 throw new Error("xxx")
      // 而是 throw new HttpError("xxx", 400)
      throw new HttpError("username is required", 400);
    }

    const user = await User.create(body);

    return success(user, "用户创建成功");
  } catch (e: any) {
    const status = e.statusCode || 500;
    return error(e.message, status);
  }
}
```

### 5、Server Action：Next.js 的真正核心能力
在前端渲染中，通常是下面模式：
```scss
前端表单
  ↓
fetch('/api/xxx')
  ↓
Node Controller
  ↓
数据库
```
在 next.js 中，使用 `Server Action`：
```scss
表单 submit
  ↓
Server Action（Node）
  ↓
数据库
```
Server Action 只在 Node 服务器运行；永远不会被打包进浏览器，和 Route Handler 一样安全
<br>
Server Action 可以连数据库，可以写业务逻辑，可以 throw Error，可以复用你写的 Node 工具
<br>
创建一个 Service Action, `src/app/api/user/action.ts`
```ts
"use server";

import { connectDB } from "@/lib/db";
import UserModel from "@/models/user.model";
import { HttpError } from "@/lib/httpError";

export async function createUser(formData: FormData) {
    try {
        await connectDB();
        const username = formData.get("username");
        const password = formData.get("password");
        const email = formData.get("email");
        const phone = formData.get("phone");

        if (!username) {
            throw new HttpError("username 字段不能为空", 400);
        }

        if (!password) {
            throw new HttpError("password 字段不能为空", 400);
        }

        if (!email) {
            throw new HttpError("email 字段不能为空", 400);
        }

        if (!phone) {
            throw new HttpError("phone 字段不能为空", 400);
        }

        await UserModel.create({
            username,
            password,
            email,
            phone,
        });
    } catch (e: any) {
        throw new HttpError(e.message, e.statusCode);
    }
}
```
**关键点:**
- `use server` 就是 Node 环境声明
- `Server Action` 写的就是 Controller

在页面中使用刚才创建的 `Server Action`，创建 `src/app/user/page.tsx`
```tsx
import { createUser } from "@/app/api/user/action";

export default function UserPage() {
  return (
    <form action={createUser}>
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <input name="email" placeholder="email" />
      <input name="phone" placeholder="phone" />
      <button type="submit">创建用户</button>
    </form>
  );
}
```
当点击提交按钮时：
- 浏览器提交表单
- Next.js 自动调用 createUser
- createUser 在 Node 服务器运行
- 数据写入 MongoDB
- 页面自动刷新（或可控跳转）

### 6、Server / Client 边界 + 错误反馈（全栈闭环）
目前为止，只考虑了 Node 层，没有考虑前端的错误反馈
- ❓ 用户提交错误时怎么提示？
- ❓ 哪些代码必须在 Client？
- ❓ Server 和 Client 如何配合？

Next.js 的核心边界：
| 文件                    | 运行环境    |
| --------------------- | ------- |
| page.tsx / layout.tsx | Server  |
| actions.ts            | Server  |
| `"use client"`        | Browser |

让 Server Action 的错误显示在页面上
<br>
方案：useFormState（官方推荐）
修改 `src/app/user/action.ts`，返回状态：
```ts
"use server";

import { connectDB } from "@/lib/db";
import UserModel from "@/models/user.model";

export async function createUser(prevState: any, formData: FormData) {
  try {
    await connectDB();
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    const phone = formData.get("phone");

    // 这里需要吧错误抛出去
    if (!username) {
      return { error: "username 字段不能为空" };
    }

    if (!password) {
      return { error: "password 字段不能为空" };
    }

    if (!email) {
      return { error: "email 字段不能为空" };
    }

    if (!phone) {
      return { error: "phone 字段不能为空" };
    }

    await UserModel.create({
      username,
      password,
      email,
      phone,
    });

    return { success: true };
  } catch (e: any) {
    return { error: e.message || "服务器错误" };
  }
}
```
Client Component 接收错误（关键）：
将表单拆分出去，新建 `src/app/user/UserForm.tsx`
```tsx
"use client";

import { useFormState } from "react-dom";
import { createUser } from "@/app/api/user/action";

const initialState = {} as any;

export default function UserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <input name="username" placeholder="username" />
      <input name="password" placeholder="password" />
      <input name="email" placeholder="email" />
      <input name="phone" placeholder="phone" />

      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}

      <button type="submit">创建用户</button>
    </form>
  );
}
```
然后在 Server Page 使用 Client Component
```tsx
// src/app/user/page.tsx

import UserForm from "@/app/user/UserForm";

export default function UserPage() {
    return <UserForm />;
}
```
再次点击表单提交，错误会显示在页面上，流程是这样：
- 用户提交表单
- Client 调用 Server Action
- Server 执行业务逻辑
- 返回状态对象
- Client 接收状态对象，渲染结果

![''](/images/nodeImages/img2.png)

### 7、Next.js Middleware（请求级 Node 能力）
Next.js Middleware 不是用来写业务的, 是一个请求级 Node 能力，可以在请求到达 Node 服务器之前执行代码，
<br>
在Express中：
```txt
请求 → middleware → router → controller
```
在Next.js中：
```txt
请求 → middleware.ts → Route Handler / Server Action / Page
```
✅ 适合放在 Middleware 的事情:

- 鉴权（是否登录）
- 权限判断（能不能访问）
- 重定向
- 日志（轻量）
- 请求拦截（黑名单 / 白名单）

❌ 绝对不该放的事情:

- 数据库操作
- 复杂业务逻辑
- 调用模型
- 长时间计算

在根目录创建 `src/middleware.ts`
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLogin = false; // 模拟未登录

  if (!isLogin && request.nextUrl.pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```
限制 middleware 作用范围（非常重要）， 配置 matcher
```ts
// 只拦截 /user 相关路径; 不影响 API / 静态资源
export const config = {
  matcher: ["/user/:path*"]
};
```
和 Express middleware 的关键差异（面试高频）：
| 对比点    | Express | Next Middleware |
| ------ | ------- | --------------- |
| 运行时    | Node    | Edge            |
| 能访问 DB等数据库 | ✅       | ❌               |
| 能修改响应  | ✅       | 部分              |
| 适合逻辑   | 业务      | 鉴权 / 拦截         |





