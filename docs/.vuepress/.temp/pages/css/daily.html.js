import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/daily.html.vue"
const data = JSON.parse("{\"path\":\"/css/daily.html\",\"title\":\"Q&A\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[],\"git\":{\"updatedTime\":1732958783000,\"contributors\":[{\"name\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":1}]},\"filePathRelative\":\"css/daily.md\"}")
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
