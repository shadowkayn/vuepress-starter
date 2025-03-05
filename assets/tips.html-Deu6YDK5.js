import{_ as n,e as a,f as e,o as i}from"./app-CpzuHnQ3.js";const l={};function t(r,s){return i(),a("div",null,s[0]||(s[0]=[e(`<h3 id="一、nvm管理工具" tabindex="-1"><a class="header-anchor" href="#一、nvm管理工具"><span><strong>一、nvm管理工具</strong></span></a></h3><h4 id="_1、官网下载nvm安装包" tabindex="-1"><a class="header-anchor" href="#_1、官网下载nvm安装包"><span><strong>1、官网下载nvm安装包</strong></span></a></h4><p>安装过程第一个路径设置是nvm安装地址，第二个路径设置是nodejs安装地址</p><p><a href="https://github.com/coreybutler/nvm-windows" target="_blank" rel="noopener noreferrer">Windows 版本</a></p><p><a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener noreferrer">Linux/macOS 版本</a></p><h4 id="_2、配置nvm镜像地址" tabindex="-1"><a class="header-anchor" href="#_2、配置nvm镜像地址"><span><strong>2、配置nvm镜像地址</strong></span></a></h4><p>打开 nvm 配置文件</p><ul><li>按 Win + R，输入 %APPDATA%\\nvm\\settings.txt 并回车。</li><li>也可以手动找到路径： <code>C:\\Users\\你的用户名\\AppData\\Roaming\\nvm\\settings.txt</code></li></ul><p>找到 node_mirror 配置项，修改为：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token assign-left variable">node_mirror</span><span class="token operator">=</span>https://npmmirror.com/mirrors/node/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>（如果没有 node_mirror 这一行，可以手动添加。）</p><h4 id="_3、安装node" tabindex="-1"><a class="header-anchor" href="#_3、安装node"><span><strong>3、安装node</strong></span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">nvm <span class="token parameter variable">-v</span>  <span class="token comment">#查看nvm是否安装</span></span>
<span class="line">nvm <span class="token function">install</span> <span class="token number">18</span>  <span class="token comment">#安装node18</span></span>
<span class="line">nvm list  <span class="token comment">#已安装的node</span></span>
<span class="line">nvm use <span class="token number">18</span>  <span class="token comment">#使用node18</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二、配置ssh连接github、gitlab等代码管理仓库" tabindex="-1"><a class="header-anchor" href="#二、配置ssh连接github、gitlab等代码管理仓库"><span><strong>二、配置ssh连接github、gitlab等代码管理仓库</strong></span></a></h3><h4 id="_1-为-github-和-gitlab-生成不同的-ssh-密钥" tabindex="-1"><a class="header-anchor" href="#_1-为-github-和-gitlab-生成不同的-ssh-密钥"><span><strong>1.为 GitHub 和 GitLab 生成不同的 SSH 密钥</strong></span></a></h4><p>默认情况下，SSH 密钥存储在 ~/.ssh/id_rsa，但你可以为不同的账户创建单独的密钥。</p><p>为 GitHub 生成 SSH 密钥</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-b</span> <span class="token number">4096</span> <span class="token parameter variable">-C</span> <span class="token string">&quot;your_github_email@example.com&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>当提示输入存储路径时，输入：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span>你的用户名<span class="token punctuation">\\</span>.ssh<span class="token punctuation">\\</span>id_rsa_github</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后按回车继续。</p><p>为 GitLab 生成 SSH 密钥</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-b</span> <span class="token number">4096</span> <span class="token parameter variable">-C</span> <span class="token string">&quot;your_gitlab_email@example.com&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>存储路径：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span>你的用户名<span class="token punctuation">\\</span>.ssh<span class="token punctuation">\\</span>id_rsa_gitlab</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后按回车继续。</p><p>这样，你的 .ssh 目录下会有两个 SSH 密钥：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">id_rsa_github（GitHub 私钥）</span>
<span class="line"></span>
<span class="line">id_rsa_github.pub（GitHub 公钥）</span>
<span class="line"></span>
<span class="line">id_rsa_gitlab（GitLab 私钥）</span>
<span class="line"></span>
<span class="line">id_rsa_gitlab.pub（GitLab 公钥）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-启动-ssh-agent-并添加密钥" tabindex="-1"><a class="header-anchor" href="#_2-启动-ssh-agent-并添加密钥"><span><strong>2. 启动 ssh-agent 并添加密钥</strong></span></a></h4><p>在 Git Bash 运行：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token builtin class-name">eval</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>ssh-agent <span class="token parameter variable">-s</span><span class="token variable">)</span></span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后分别添加密钥：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">ssh-add ~/.ssh/id_rsa_github</span>
<span class="line">ssh-add ~/.ssh/id_rsa_gitlab</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-配置-ssh-让-github-和-gitlab-使用不同的密钥" tabindex="-1"><a class="header-anchor" href="#_3-配置-ssh-让-github-和-gitlab-使用不同的密钥"><span><strong>3. 配置 SSH 让 GitHub 和 GitLab 使用不同的密钥</strong></span></a></h4><p>在 Git Bash 运行：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">nano</span> ~/.ssh/config</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后输入以下内容：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># GitHub 账户</span></span>
<span class="line">Host github.com</span>
<span class="line">HostName github.com</span>
<span class="line">User <span class="token function">git</span></span>
<span class="line">IdentityFile ~/.ssh/id_rsa_github</span>
<span class="line"></span>
<span class="line"><span class="token comment"># GitLab 账户</span></span>
<span class="line">Host gitlab.com</span>
<span class="line">HostName gitlab.com</span>
<span class="line">User <span class="token function">git</span></span>
<span class="line">IdentityFile ~/.ssh/id_rsa_gitlab</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按 Ctrl + X，然后 Y（确认保存），最后 Enter。</p><p>如果 nano 不可用，你也可以在 Windows 资源管理器里找到：</p><p><code>C:\\Users\\你的用户名\\.ssh\\config</code> 用 记事本 或 VS Code 编辑。</p><h4 id="_4-添加-ssh-公钥到-github-和-gitlab" tabindex="-1"><a class="header-anchor" href="#_4-添加-ssh-公钥到-github-和-gitlab"><span><strong>4.添加 SSH 公钥到 GitHub 和 GitLab</strong></span></a></h4><p>在 Git Bash 运行：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">cat</span> ~/.ssh/id_rsa_github.pub</span>
<span class="line"><span class="token function">cat</span> ~/.ssh/id_rsa_gitlab.pub</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后：</p><p>复制 <code>id_rsa_github.pub</code> 内容，添加到 GitHub：</p><p>进入 <code>GitHub SSH</code> 设置 <code>New SSH Key → 粘贴 → Add SSH Key</code></p><p>复制 <code>id_rsa_gitlab.pub</code> 内容，添加到 GitLab： 进入 GitLab SSH 设置 <code>Add SSH Key → 粘贴 → Add Key</code></p><h4 id="_5-测试-ssh-连接" tabindex="-1"><a class="header-anchor" href="#_5-测试-ssh-连接"><span><strong>5. 测试 SSH 连接</strong></span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@github.com</span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@gitlab.com</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果成功，你会看到： GitHub:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">Hi username<span class="token operator">!</span> You&#39;ve successfully authenticated, but GitHub does not provide shell access.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>GitLab:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">Welcome to GitLab, @username<span class="token operator">!</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_6-使用-ssh-克隆仓库" tabindex="-1"><a class="header-anchor" href="#_6-使用-ssh-克隆仓库"><span><strong>6. 使用 SSH 克隆仓库</strong></span></a></h4><p>现在可以直接克隆仓库了：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> clone git@github.com:your_github_username/repository.git</span>
<span class="line"><span class="token function">git</span> clone git@gitlab.com:your_gitlab_username/repository.git</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果已有仓库但之前使用的是 HTTPS，可以改为 SSH：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> remote set-url origin git@github.com:your_github_username/repository.git</span>
<span class="line"><span class="token function">git</span> remote set-url origin git@gitlab.com:your_gitlab_username/repository.git</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样你就可以在 Windows 上使用不同的 SSH 密钥来管理 GitHub 和 GitLab 账户了 🎉！</p><h3 id="三、本地分支关联远程分支" tabindex="-1"><a class="header-anchor" href="#三、本地分支关联远程分支"><span><strong>三、本地分支关联远程分支</strong></span></a></h3><h4 id="_1-将本地分支关联到远程已有的分支" tabindex="-1"><a class="header-anchor" href="#_1-将本地分支关联到远程已有的分支"><span><strong>1. 将本地分支关联到远程已有的分支</strong></span></a></h4><p>假设你已经有一个远程分支（比如 origin/main），你希望将本地分支（例如 dev_newStyle）与它关联。</p><p>切换到本地分支： 如果你还没有切换到目标本地分支，可以使用以下命令切换：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> checkout dev_newStyle</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>设置上游分支： 使用 git branch --set-upstream-to 来将本地分支与远程分支关联。例如，将 dev_newStyle 与 origin/main 关联：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> branch --set-upstream-to<span class="token operator">=</span>origin/main dev_newStyle</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>验证设置： 设置好后，可以使用以下命令来查看当前本地分支的上游分支：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> status</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>或者：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-vv</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>你应该看到类似如下的信息：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">* dev_newStyle        abc1234 <span class="token punctuation">[</span>origin/main<span class="token punctuation">]</span> Your commit message</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_2-将本地新分支推送到远程并关联" tabindex="-1"><a class="header-anchor" href="#_2-将本地新分支推送到远程并关联"><span><strong>2. 将本地新分支推送到远程并关联</strong></span></a></h4><p>如果本地分支是新创建的，还没有在远程仓库中创建对应的分支，你可以使用 git push -u 命令将本地分支推送到远程，并同时设置远程跟踪分支。</p><p>创建并切换到本地新分支： 如果你还没有创建本地分支，可以使用以下命令创建并切换：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> checkout <span class="token parameter variable">-b</span> dev_newStyle</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>将本地分支推送到远程并设置上游分支： 使用以下命令将本地分支推送到远程仓库，并设置上游分支：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> push <span class="token parameter variable">-u</span> origin dev_newStyle</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>-u 参数会将本地分支与远程分支关联。以后你可以直接使用 git pull 和 git push 来同步本地和远程分支。</p><p>验证设置： 再次使用 git status 或 git branch -vv 查看关联的远程分支：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> status</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>输出类似：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">On branch dev_newStyle</span>
<span class="line">Your branch is up to <span class="token function">date</span> with <span class="token string">&#39;origin/dev_newStyle&#39;</span><span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-将本地分支与远程分支关联后使用-git-pull-和-git-push" tabindex="-1"><a class="header-anchor" href="#_3-将本地分支与远程分支关联后使用-git-pull-和-git-push"><span><strong>3. 将本地分支与远程分支关联后使用 git pull 和 git push</strong></span></a></h4><p>一旦本地分支与远程分支关联好，你可以使用以下命令同步代码：</p><p>拉取远程代码：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> pull</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>推送本地更改到远程：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> push</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_4-查看本地和远程分支的关联" tabindex="-1"><a class="header-anchor" href="#_4-查看本地和远程分支的关联"><span><strong>4. 查看本地和远程分支的关联</strong></span></a></h4><p>你可以使用以下命令查看本地分支和远程分支的关联情况：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> branch <span class="token parameter variable">-vv</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>输出类似：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">* dev_newStyle        abc1234 <span class="token punctuation">[</span>origin/dev_newStyle<span class="token punctuation">]</span> Last commit message</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,95)]))}const d=n(l,[["render",t],["__file","tips.html.vue"]]),c=JSON.parse('{"path":"/Engineering/tips.html","title":"","lang":"en-US","frontmatter":{},"headers":[{"level":3,"title":"一、nvm管理工具","slug":"一、nvm管理工具","link":"#一、nvm管理工具","children":[]},{"level":3,"title":"二、配置ssh连接github、gitlab等代码管理仓库","slug":"二、配置ssh连接github、gitlab等代码管理仓库","link":"#二、配置ssh连接github、gitlab等代码管理仓库","children":[]},{"level":3,"title":"三、本地分支关联远程分支","slug":"三、本地分支关联远程分支","link":"#三、本地分支关联远程分支","children":[]}],"git":{"updatedTime":1741191346000,"contributors":[{"name":"shadowkayn","username":"shadowkayn","email":"1669080561@qq.com","commits":1,"url":"https://github.com/shadowkayn"}],"changelog":[{"hash":"2b6a6a1e5048ff11b2e7a33b045a11a11c225edb","date":1741191346000,"email":"1669080561@qq.com","author":"shadowkayn","message":"feat 环境配置相关"}]},"filePathRelative":"Engineering/tips.md"}');export{d as comp,c as data};
