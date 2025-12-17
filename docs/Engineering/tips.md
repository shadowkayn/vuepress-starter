### **1、nvm管理工具**
#### **1、官网下载nvm安装包**
安装过程第一个路径设置是nvm安装地址，第二个路径设置是nodejs安装地址

[Windows 版本](https://github.com/coreybutler/nvm-windows)

[Linux/macOS 版本](https://github.com/nvm-sh/nvm)

#### **2、配置nvm镜像地址**
打开 nvm 配置文件
- 按 Win + R，输入 %APPDATA%\nvm\settings.txt 并回车。
- 也可以手动找到路径：
`
C:\Users\你的用户名\AppData\Roaming\nvm\settings.txt
`

找到 node_mirror 配置项，修改为：
```shell
node_mirror=https://npmmirror.com/mirrors/node/
```
（如果没有 node_mirror 这一行，可以手动添加。）

#### **3、安装node**
```shell
nvm -v  #查看nvm是否安装
nvm install 18  #安装node18
nvm list  #已安装的node
nvm use 18  #使用node18
```


### **2、配置ssh连接github、gitlab等代码管理仓库**
#### **1.为 GitHub 和 GitLab 生成不同的 SSH 密钥**
默认情况下，SSH 密钥存储在 ~/.ssh/id_rsa，但你可以为不同的账户创建单独的密钥。

为 GitHub 生成 SSH 密钥
```shell
ssh-keygen -t rsa -b 4096 -C "your_github_email@example.com"
```

当提示输入存储路径时，输入：
```shell
C:\Users\你的用户名\.ssh\id_rsa_github
```
然后按回车继续。

为 GitLab 生成 SSH 密钥
```shell
ssh-keygen -t rsa -b 4096 -C "your_gitlab_email@example.com"
```
存储路径：
```shell
C:\Users\你的用户名\.ssh\id_rsa_gitlab
```
然后按回车继续。

这样，你的 .ssh 目录下会有两个 SSH 密钥：
```
id_rsa_github（GitHub 私钥）

id_rsa_github.pub（GitHub 公钥）

id_rsa_gitlab（GitLab 私钥）

id_rsa_gitlab.pub（GitLab 公钥）
```
#### **2. 启动 ssh-agent 并添加密钥**
在 Git Bash 运行：
```shell
eval "$(ssh-agent -s)"
```
然后分别添加密钥：
```shell
ssh-add ~/.ssh/id_rsa_github
ssh-add ~/.ssh/id_rsa_gitlab
```
#### **3. 配置 SSH 让 GitHub 和 GitLab 使用不同的密钥**
在 Git Bash 运行：
```shell
nano ~/.ssh/config
```
然后输入以下内容：
```shell
# GitHub 账户
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_github

# GitLab 账户
Host gitlab.com
HostName gitlab.com
User git
IdentityFile ~/.ssh/id_rsa_gitlab
```
按 Ctrl + X，然后 Y（确认保存），最后 Enter。

如果 nano 不可用，你也可以在 Windows 资源管理器里找到：

`
C:\Users\你的用户名\.ssh\config
`
用 记事本 或 VS Code 编辑。

#### **4.添加 SSH 公钥到 GitHub 和 GitLab**
在 Git Bash 运行：
```shell
cat ~/.ssh/id_rsa_github.pub
cat ~/.ssh/id_rsa_gitlab.pub
```
然后：

复制 `id_rsa_github.pub` 内容，添加到 GitHub：

进入 `GitHub SSH` 设置
`New SSH Key → 粘贴 → Add SSH Key`

复制 `id_rsa_gitlab.pub` 内容，添加到 GitLab：
进入 GitLab SSH 设置
`Add SSH Key → 粘贴 → Add Key`
#### **5. 测试 SSH 连接**
```shell
ssh -T git@github.com
ssh -T git@gitlab.com
```
如果成功，你会看到：
GitHub:
```shell
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```
GitLab:
```shell
Welcome to GitLab, @username!
```
#### **6. 使用 SSH 克隆仓库**
现在可以直接克隆仓库了：
```shell
git clone git@github.com:your_github_username/repository.git
git clone git@gitlab.com:your_gitlab_username/repository.git
```
如果已有仓库但之前使用的是 HTTPS，可以改为 SSH：
```shell
git remote set-url origin git@github.com:your_github_username/repository.git
git remote set-url origin git@gitlab.com:your_gitlab_username/repository.git
```
这样你就可以在 Windows 上使用不同的 SSH 密钥来管理 GitHub 和 GitLab 账户了 🎉！






### **3、本地分支关联远程分支**
#### **1. 将本地分支关联到远程已有的分支**
假设你已经有一个远程分支（比如 origin/main），你希望将本地分支（例如 dev_newStyle）与它关联。

切换到本地分支： 如果你还没有切换到目标本地分支，可以使用以下命令切换：
```shell
git checkout dev_newStyle
```
设置上游分支： 使用 git branch --set-upstream-to 来将本地分支与远程分支关联。例如，将 dev_newStyle 与 origin/main 关联：
```shell
git branch --set-upstream-to=origin/main dev_newStyle
```
验证设置： 设置好后，可以使用以下命令来查看当前本地分支的上游分支：
```shell
git status
```
或者：
```shell
git branch -vv
```
你应该看到类似如下的信息：
```shell
* dev_newStyle        abc1234 [origin/main] Your commit message
```

#### **2. 将本地新分支推送到远程并关联**
如果本地分支是新创建的，还没有在远程仓库中创建对应的分支，你可以使用 git push -u 命令将本地分支推送到远程，并同时设置远程跟踪分支。

创建并切换到本地新分支： 如果你还没有创建本地分支，可以使用以下命令创建并切换：
```shell
git checkout -b dev_newStyle
```
将本地分支推送到远程并设置上游分支： 使用以下命令将本地分支推送到远程仓库，并设置上游分支：
```shell
git push -u origin dev_newStyle
```
-u 参数会将本地分支与远程分支关联。以后你可以直接使用 git pull 和 git push 来同步本地和远程分支。

验证设置： 再次使用 git status 或 git branch -vv 查看关联的远程分支：
```shell
git status
```
输出类似：
```shell
On branch dev_newStyle
Your branch is up to date with 'origin/dev_newStyle'.
```
#### **3. 将本地分支与远程分支关联后使用 git pull 和 git push**
一旦本地分支与远程分支关联好，你可以使用以下命令同步代码：

拉取远程代码：
```shell
git pull
```
推送本地更改到远程：
```shell
git push
```
#### **4. 查看本地和远程分支的关联**
你可以使用以下命令查看本地分支和远程分支的关联情况：
```shell
git branch -vv
```
输出类似：
```shell
* dev_newStyle        abc1234 [origin/dev_newStyle] Last commit message
```

### 4、git基本知识
1) `git init` 创建一个空的 Git 仓库
2) `git add .` 添加所有文件到暂存区
3) `git rm -r --cached node_modules` 删除暂存区中的文件(node_modules)
4) `git commit -m "first commit"` 提交暂存区中的文件(初始化提交)
5) `git remote add origin <你刚才复制的远程仓库地址>` 添加远程仓库
6) `git branch -M main` （可选）重命名主分支 现在的 Git 默认主分支名通常是 main，如果你的本地显示是 master，可以统一一下
7) `git push -u origin main` 推送到远程仓库
8) `git push -u origin main --force` 强行推送； 这条命令会直接用你本地的内容替换掉远程的内容(在创建远程仓库时，可能勾选了README 文件，代码冲突)。
