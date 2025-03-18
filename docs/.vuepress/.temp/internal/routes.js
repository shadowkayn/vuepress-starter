export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"KAYN Blogs"} }],
  ["/components/", { loader: () => import(/* webpackChunkName: "components_index.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/components/index.html.js"), meta: {"title":""} }],
  ["/css/daily.html", { loader: () => import(/* webpackChunkName: "css_daily.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/daily.html.js"), meta: {"title":""} }],
  ["/css/knowledge.html", { loader: () => import(/* webpackChunkName: "css_knowledge.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/knowledge.html.js"), meta: {"title":""} }],
  ["/react/", { loader: () => import(/* webpackChunkName: "react_index.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/react/index.html.js"), meta: {"title":""} }],
  ["/Engineering/knowledge.html", { loader: () => import(/* webpackChunkName: "Engineering_knowledge.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/Engineering/knowledge.html.js"), meta: {"title":"engineering..."} }],
  ["/Engineering/tips.html", { loader: () => import(/* webpackChunkName: "Engineering_tips.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/Engineering/tips.html.js"), meta: {"title":""} }],
  ["/JavaScript/daily.html", { loader: () => import(/* webpackChunkName: "JavaScript_daily.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/JavaScript/daily.html.js"), meta: {"title":"Q&A"} }],
  ["/JavaScript/knowledge.html", { loader: () => import(/* webpackChunkName: "JavaScript_knowledge.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/JavaScript/knowledge.html.js"), meta: {"title":""} }],
  ["/Vue/daily.html", { loader: () => import(/* webpackChunkName: "Vue_daily.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/Vue/daily.html.js"), meta: {"title":""} }],
  ["/Vue/knowledge.html", { loader: () => import(/* webpackChunkName: "Vue_knowledge.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/Vue/knowledge.html.js"), meta: {"title":"Q&A"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
