import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/JavaScript/knowledge.html.vue"
const data = JSON.parse("{\"path\":\"/JavaScript/knowledge.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[],\"git\":{\"contributors\":[{\"name\":\"shadowkayn\",\"username\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":3,\"url\":\"https://github.com/shadowkayn\"},{\"name\":\"shadowKayn\",\"username\":\"shadowKayn\",\"email\":\"li.yuan@zcits.com\",\"commits\":1,\"url\":\"https://github.com/shadowKayn\"}],\"changelog\":[{\"hash\":\"6f7bba59ad9f85b2cbd3bda8b4c454b62edd5ca8\",\"time\":1742183158000,\"email\":\"li.yuan@zcits.com\",\"author\":\"shadowKayn\",\"message\":\"feat vue、css\"},{\"hash\":\"e13f0380ebd01d8840d5ee3d36cf5f47b690384a\",\"time\":1741084150000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"add modules\"},{\"hash\":\"d264eba2464cee840f28282b2363b09edfbcc558\",\"time\":1732958783000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"},{\"hash\":\"500c1ba8cfe477b60b7726a575e002162d141716\",\"time\":1731944050000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"}]},\"filePathRelative\":\"JavaScript/knowledge.md\"}")
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
