import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
    bundler: viteBundler(),
    base:'/vuepress-starter/',
    head: [
        ['link', { rel: 'icon', href: '/vuepress-starter/favicon.ico' }], // 添加 favicon 配置
    ],
    theme: defaultTheme({
            // 启用搜索框
            search: true,
            // 搜索建议条目数（默认为 5）
            searchMaxSuggestions: 10,
            lang:'zh-CN',
            title: 'KAYN Blogs',
            description: '个人博客-用来学习记录',

            // Public 文件路径
            logo: '/images/myImages/wife2.png',

            // 导航栏
            navbar: [
                // NavbarLink
                {
                    text: 'Home',
                    link: '/',
                },
                {
                    text: 'Articles',
                    link: '/Articles/README.md',
                },
                {
                    text: 'Components',
                    link: '/components/README.md',
                },
                // NavbarGroup
                {
                    text: 'Constructing',
                    prefix: '/loading',
                    children: [
                        { text: 'Github', link: 'https://github.com/mqyqingfeng' },
                        { text: 'JueJin', link: 'https://juejin.cn/user/712139234359182/posts' }
                    ],
                },
            ],

            // gitHub仓库URL
            // 如果你按照 `organization/repository` 的格式设置它
            // 我们会将它作为一个 GitHub 仓库
            // repo: 'vuejs/vuepress',
            // 你也可以直接将它设置为一个 URL
            // repo: 'https://gitlab.com/foo/bar',

            // 侧边栏数组
            // 所有页面会使用相同的侧边栏
            sidebar:{
                '/': [
                    // SidebarItem
                    {
                        text: 'Welcome to my \nMickey Mouse House !',
                    },
                    {
                        text: "CSS",
                        collapsible: false, // 不折叠
                        children: [
                            { text: "开发场景", link: "/Css/daily.md" },
                            { text: "知识点", link: "/Css/knowledge.md" },
                        ],
                    },
                    {
                        text: "JavaScript",
                        collapsable: false, // 不折叠
                        children: [
                            { text: "开发场景", link: "/JavaScript/daily.md" },
                            { text: "知识点", link: "/JavaScript/knowledge.md" },
                        ],
                    },
                    {
                        text: "Vue",
                        collapsable: false, // 不折叠
                        children: [
                            { text: "开发场景", link: "/Vue/daily.md" },
                            { text: "知识点", link: "/Vue/knowledge.md" },
                        ],
                    },
                    {
                        text: "React",
                        collapsable: false, // 不折叠
                        children: [
                            { text: "开发场景", link: "/React/daily.md" },
                            { text: "知识点", link: "/React/knowledge.md" },
                        ],
                    },
                    {
                        text: "工程化",
                        collapsable: false, // 不折叠
                        children: [
                            { text: "开发场景", link: "/Engineering/knowledge.md" },
                            { text: "dev tips", link: "/Engineering/tips.md" },
                        ],
                    },
                ],
                '/articles':[
                    {
                        text: '碎片化知识',
                        link:'',
                    },
                ]
            },
            lastUpdated: false,
        }),
    markdown: {
        // 配置代码块高亮
        extendMarkdown: (md) => {
            md.use(require('markdown-it-prism'));
        }
    },
    // 插件注册
    plugins: [
        searchPlugin({
            // 这里的配置项和 V2 官方文档一致：
            // - hotKeys: 搜索框快捷键，默认 ['s', '/']
            // - locales: 不同路径下的 placeholder
            // - maxSuggestions: 最大结果数（默认 5）
            maxSuggestions: 10,
            // 如果你只想搜索部分页面，还可以：
            // isSearchable: page => page.path !== '/'
        }),
    ],
})

