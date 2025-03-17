import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/react/index.html.vue"
const data = JSON.parse("{\"path\":\"/react/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"React\",\"slug\":\"react\",\"link\":\"#react\",\"children\":[{\"level\":3,\"title\":\"一、redux基本使用\",\"slug\":\"一、redux基本使用\",\"link\":\"#一、redux基本使用\",\"children\":[]},{\"level\":3,\"title\":\"二、redux中间件\",\"slug\":\"二、redux中间件\",\"link\":\"#二、redux中间件\",\"children\":[]}]}],\"git\":{\"contributors\":[{\"name\":\"shadowkayn\",\"username\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":2,\"url\":\"https://github.com/shadowkayn\"}],\"changelog\":[{\"hash\":\"d264eba2464cee840f28282b2363b09edfbcc558\",\"time\":1732958783000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"},{\"hash\":\"500c1ba8cfe477b60b7726a575e002162d141716\",\"time\":1731944050000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"}]},\"filePathRelative\":\"react/README.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
