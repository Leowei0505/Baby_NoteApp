<template>
  <!-- 專案介紹頁，簡述目前使用的前端技術。 -->
  <main class="page about-page">
    <p class="eyebrow">關於這個小小的開始</p>
    <h1>為日常，<br />留一個位置。</h1>
    <p class="intro">BabyApp 是一個以 iPhone 使用體驗為核心的 Vue 專案起點。</p>

    <!-- 使用獨立區塊呈現專案初始化資訊。 -->
    <section class="about-note">
      <h2>專案已準備就緒</h2>
      <p>Vue 3、Vite 與 Vue Router 已經設定完成。你可以從首頁開始，逐步加入想要的功能。</p>
    </section>

    <RouterLink class="text-link" to="/">
      回到首頁
      <span aria-hidden="true">→</span>
    </RouterLink>
  </main>
</template>

<!-- 關於頁樣式只作用於此頁。 -->
<style scoped src="./AboutView.css"></style>
