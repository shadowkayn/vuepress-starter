import comp from "E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/home/home.html.vue"
const data = JSON.parse("{\"path\":\"/home/home.html\",\"title\":\"KAYN Blogs\",\"lang\":\"en-US\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"网站使用vuePress搭建，具体可参考VuePress快速上手\",\"slug\":\"网站使用vuepress搭建-具体可参考vuepress快速上手\",\"link\":\"#网站使用vuepress搭建-具体可参考vuepress快速上手\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"home/home.md\"}")
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
