import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"KAYN Blogs\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"网站使用vuePress搭建，具体可参考VuePress快速上手\",\"slug\":\"网站使用vuepress搭建-具体可参考vuepress快速上手\",\"link\":\"#网站使用vuepress搭建-具体可参考vuepress快速上手\",\"children\":[]}],\"git\":{\"contributors\":[{\"name\":\"shadowkayn\",\"username\":\"shadowkayn\",\"email\":\"1669080561@qq.com\",\"commits\":2,\"url\":\"https://github.com/shadowkayn\"}],\"changelog\":[{\"hash\":\"d264eba2464cee840f28282b2363b09edfbcc558\",\"time\":1732958783000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"},{\"hash\":\"500c1ba8cfe477b60b7726a575e002162d141716\",\"time\":1731944050000,\"email\":\"1669080561@qq.com\",\"author\":\"shadowkayn\",\"message\":\"initial commit\"}]},\"filePathRelative\":\"README.md\"}")
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
