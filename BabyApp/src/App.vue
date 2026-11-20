<script setup>
import { RouterLink, RouterView } from 'vue-router'

// 避免在圖片、按鈕或連結上長按時開啟系統選單或連結預覽。
function preventProtectedContextMenu(event) {
  if (event.target instanceof Element && event.target.closest('img, button, a[href], [role="button"]')) {
    event.preventDefault()
  }
}

// 阻止瀏覽器把圖片拖出頁面。
function preventImageDrag(event) {
  if (event.target instanceof Element && event.target.closest('img')) {
    event.preventDefault()
  }
}
</script>

<template>
  <!-- 全域版型：品牌列、目前路由頁面與底部分頁導覽。 -->
  <div class="app-shell" @contextmenu="preventProtectedContextMenu" @dragstart="preventImageDrag">
    
    <!-- 所有路由共用可捲動區域，讓每一頁都能在固定導覽上方捲動。 -->
    <div class="page-scroll">
      <RouterView />
    </div>

    <!-- 固定在畫面底部的主要頁面導覽。 -->
    <nav class="tab-bar" aria-label="主要導覽">
      <RouterLink class="tab-link" to="/" exact-active-class="is-active">
        <img src="/2.png" alt="" aria-hidden="true" />
        <span>首頁</span>
      </RouterLink>
      <RouterLink class="tab-link" to="/points" active-class="is-active">
        <img src="/3.png" alt="" aria-hidden="true" />
        <span>集點</span>
      </RouterLink>
      <RouterLink class="tab-link" to="/calendar" active-class="is-active">
        <img src="/1.png" alt="" aria-hidden="true" />
        <span>日曆</span>
      </RouterLink>
    </nav>
  </div>
</template>

<!-- App 外框與共用導覽樣式集中在此檔。 -->
<style src="./App.css"></style>

