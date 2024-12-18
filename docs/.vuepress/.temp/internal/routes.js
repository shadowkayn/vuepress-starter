export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"KAYN Blogs"} }],
  ["/css/daily.html", { loader: () => import(/* webpackChunkName: "css_daily.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/daily.html.js"), meta: {"title":"Q&A"} }],
  ["/css/knowledge.html", { loader: () => import(/* webpackChunkName: "css_knowledge.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/css/knowledge.html.js"), meta: {"title":"Knowledge"} }],
  ["/react/", { loader: () => import(/* webpackChunkName: "react_index.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/react/index.html.js"), meta: {"title":""} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"E:/blogs/vuepress-starter/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);
