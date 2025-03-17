import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/knowledge.html.vue"
const data = JSON.parse("{\"path\":\"/css/knowledge.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"1、:focus-within伪类\",\"slug\":\"_1、-focus-within伪类\",\"link\":\"#_1、-focus-within伪类\",\"children\":[]},{\"level\":3,\"title\":\"2、::first-letter伪元素\",\"slug\":\"_2、-first-letter伪元素\",\"link\":\"#_2、-first-letter伪元素\",\"children\":[]},{\"level\":3,\"title\":\"3、::selection伪元素\",\"slug\":\"_3、-selection伪元素\",\"link\":\"#_3、-selection伪元素\",\"children\":[]}],\"git\":{\"contributors\":[{\"name\":\"shadowkayn\",\"username\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":3,\"url\":\"https://github.com/shadowkayn\"}],\"changelog\":[{\"hash\":\"89977d65370760fcfee49f17375d3e80d457f96b\",\"time\":1741878940000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"feat：css\"},{\"hash\":\"d264eba2464cee840f28282b2363b09edfbcc558\",\"time\":1732958783000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"},{\"hash\":\"500c1ba8cfe477b60b7726a575e002162d141716\",\"time\":1731944050000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"}]},\"filePathRelative\":\"css/knowledge.md\"}")
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
