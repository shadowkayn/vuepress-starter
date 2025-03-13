import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/daily.html.vue"
const data = JSON.parse("{\"path\":\"/css/daily.html\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"1、纯css实现多行文本省略展示，省略号后跟随按钮，按钮可以展开/收起文本\",\"slug\":\"_1、纯css实现多行文本省略展示-省略号后跟随按钮-按钮可以展开-收起文本\",\"link\":\"#_1、纯css实现多行文本省略展示-省略号后跟随按钮-按钮可以展开-收起文本\",\"children\":[]}],\"git\":{\"updatedTime\":1732958783000,\"contributors\":[{\"name\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":1}]},\"filePathRelative\":\"css/daily.md\"}")
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
