import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/Engineering/knowledge.html.vue"
const data = JSON.parse("{\"path\":\"/Engineering/knowledge.html\",\"title\":\"engineering...\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[],\"git\":{\"updatedTime\":1741084150000,\"contributors\":[{\"name\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":1}]},\"filePathRelative\":\"Engineering/knowledge.md\"}")
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
