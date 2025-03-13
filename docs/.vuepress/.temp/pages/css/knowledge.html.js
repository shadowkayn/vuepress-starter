import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/knowledge.html.vue"
const data = JSON.parse("{\"path\":\"/css/knowledge.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"1、:focus-within伪类\",\"slug\":\"_1、-focus-within伪类\",\"link\":\"#_1、-focus-within伪类\",\"children\":[]},{\"level\":3,\"title\":\"2、::first-letter伪元素\",\"slug\":\"_2、-first-letter伪元素\",\"link\":\"#_2、-first-letter伪元素\",\"children\":[]},{\"level\":3,\"title\":\"3、::selection伪元素\",\"slug\":\"_3、-selection伪元素\",\"link\":\"#_3、-selection伪元素\",\"children\":[]}],\"git\":{\"updatedTime\":1732958783000,\"contributors\":[{\"name\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":1}]},\"filePathRelative\":\"css/knowledge.md\"}")
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
