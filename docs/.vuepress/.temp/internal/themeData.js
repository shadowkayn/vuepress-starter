export const themeData = JSON.parse("{\"lang\":\"zh-CN\",\"title\":\"KAYN Blogs\",\"description\":\"个人博客-用来学习记录\",\"logo\":\"/images/logo.jpg\",\"enhanceAppFiles\":[{\"name\":\"prism-theme\",\"content\":\"\\n            import 'prism-themes/themes/prism-material-dark.css';\\n          \"}],\"navbar\":[{\"text\":\"Home\",\"link\":\"/\"},{\"text\":\"React\",\"link\":\"/react/README.md\"},{\"text\":\"建设中\",\"prefix\":\"/loading\",\"children\":[{\"text\":\"Github\",\"link\":\"https://github.com/mqyqingfeng\"},{\"text\":\"掘金\",\"link\":\"https://juejin.cn/user/712139234359182/posts\"}]}],\"sidebar\":{\"/\":[{\"text\":\"欢迎回来\"},{\"text\":\"CSS\",\"collapsible\":false,\"children\":[{\"text\":\"日常问题\",\"link\":\"/css/daily.md\"},{\"text\":\"知识点\",\"link\":\"/css/knowledge.md\"}]},{\"text\":\"JavaScript\",\"collapsable\":true,\"children\":[{\"text\":\"日常问题\",\"link\":\"/JavaScript/daily.md\"},{\"text\":\"知识点\",\"link\":\"/JavaScript/knowledge.md\"}]},{\"text\":\"工程化\",\"collapsable\":false,\"children\":[{\"text\":\"建设中\",\"link\":\"/Engineering/knowledge.md\"}]}],\"/react\":[{\"text\":\"碎片化知识\",\"link\":\"\"}]},\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
