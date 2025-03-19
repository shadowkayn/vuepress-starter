<script setup>
import { ref, computed } from 'vue';
import { usePageData } from '@vuepress/client'

// 获取当前页面的数据
const page = usePageData()

// 解析 headers，只显示 H2 和 H3 标题
const headers = computed(() =>
    (page.value.headers || []).filter(h => h.level === 2 || h.level === 3)
)

// 监听滚动，让当前标题高亮
const activeHeader = ref('')
const onScroll = () => {
  const scrollPosition = window.scrollY + 100
  for (const header of headers.value) {
    const el = document.getElementById(header.slug)
    if (el && el.offsetTop <= scrollPosition) {
      activeHeader.value = header.slug
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onScroll)
}
</script>

<template>
  <div class="toc-container">
    <h3>目录</h3>
    <ul>
      <li v-for="header in headers" :key="header.slug">
        <a :href="'#' + header.slug" :class="{ active: activeHeader === header.slug }">
          {{ header.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.toc-container {
  position: fixed;
  top: 80px;
  right: 20px; /* 改成 left: 20px 可以固定在左上角 */
  width: 200px;
  max-height: 70vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.toc-container h3 {
  margin-top: 0;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.toc-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-container li {
  margin: 5px 0;
}

.toc-container a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: color 0.2s;
}

.toc-container a:hover {
  color: #42b983;
}

.toc-container a.active {
  font-weight: bold;
  color: #42b983;
}
</style>
