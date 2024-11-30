import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/react/react.html.vue"
const data = JSON.parse("{\"path\":\"/react/react.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"React\",\"slug\":\"react\",\"link\":\"#react\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"react/react.md\"}")
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
