import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'


export default defineUserConfig({
    bundler: viteBundler(),
    base:'/vuepress-starter/',
    head: [
        ['link', { rel: 'icon', href: '/vuepress-starter/favicon.ico' }], // 添加 favicon 配置
    ],
    theme: defaultTheme({
            lang:'zh-CN',
            title: 'KAYN Blogs',
            description: '个人博客-用来学习记录',

            // Public 文件路径
            logo: '/images/logo.jpg',

            // 代码块高亮
            enhanceAppFiles: [
                {
                    name: 'prism-theme',
                    content: `
            import 'prism-themes/themes/prism-material-dark.css';
          `
                }
            ],

            // 导航栏
            navbar: [
                // NavbarLink
                {
                    text: 'Home',
                    link: '/',
                },
                {
                    text: 'React',
                    link: '/react/README.md',
                },
                {
                    text: '组件库',
                    link: '/components/README.md',
                },
                // NavbarGroup
                {
                    text: '建设中',
                    prefix: '/loading',
                    children: [
                        { text: 'Github', link: 'https://github.com/mqyqingfeng' },
                        { text: '掘金', link: 'https://juejin.cn/user/712139234359182/posts' }
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
                        text: '欢迎回来',
                    },
                    {
                        text: "CSS",
                        collapsible: false, // 不折叠
                        children: [
                            { text: "开发场景", link: "/css/daily.md" },
                            { text: "知识点", link: "/css/knowledge.md" },
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
                        text: "工程化",
                        collapsable: false, // 不折叠
                        children: [
                            { text: "建设中", link: "/Engineering/knowledge.md" },
                            { text: "dev tips", link: "/Engineering/tips.md" },
                        ],
                    },
                ],
                '/react':[
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
})

