<template>
  <main class="page home-page">
    <!-- 首頁問候與角色插圖。 -->
    <header class="home-greeting">

      <div class="home-greeting-left">
        <h1>烏薩奇寶寶的歡樂天地</h1>
        <p>今天想做點什麼？</p>
      </div>

      <div class="home-greeting-right">
        <img src="/5.png" alt="" aria-hidden="true" />
      </div>

    </header>

    <!-- 集點摘要連到可操作的 15 格印章卡。 -->
    <section class="stamp-summary" aria-label="集點進度">
      <div class="stamp-summary-heading">
        <div>
          <p class="stamp-summary-label">我的烏薩奇集點卡</p>
          <p class="stamp-total"><strong>{{ babyAppData.stamps }}</strong><span> / 15 枚印章</span></p>
        </div>
        <RouterLink class="summary-arrow" to="/points" aria-label="前往集點任務">›</RouterLink>
      </div>

      <div
        class="stamp-progress-track"
        role="progressbar"
        aria-label="印章收集進度"
        aria-valuemin="0"
        aria-valuemax="15"
        :aria-valuenow="babyAppData.stamps"
      >
        <span :style="{ width: `${stampProgress}%` }"></span>
      </div>

      <RouterLink class="stamp-summary-action" to="/points">前往集點任務</RouterLink>
    </section>

    <!-- 只有經期日曆與集點任務會導向新頁面。 -->
    <section class="home-places" aria-labelledby="home-places-title">
      <h2 id="home-places-title">我的小天地</h2>
      <div class="home-tile-grid">
        <RouterLink class="home-tile tile-calendar" to="/calendar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 9h16M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></svg>
          <span>經期日曆</span>
        </RouterLink>
        <RouterLink class="home-tile tile-points" to="/points">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" /><circle cx="12" cy="12" r="5" /></svg>
          <span>集點任務</span>
        </RouterLink>
        <div class="home-tile tile-mood" aria-disabled="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M9 14s1 2 3 2 3-2 3-2m-5-4h.01M14 10h.01" /></svg>
          <span>每日心情</span>
        </div>
        <div class="home-tile tile-memory" aria-disabled="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 5-4 3 2 3-3 4 4" /></svg>
          <span>回憶相簿</span>
        </div>
      </div>
    </section>

    <!-- 心情提示目前只有展示，不會儲存或導向新頁面。 -->
    <aside class="home-note">
      <p class="home-note-title">今日的小情緒</p>
      <p>今天也要記得好好照顧自己。</p>
    </aside>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { babyAppData } from '../composables/useBabyAppData'

// 首頁摘要只讀取集點頁共用的印章數。
const stampProgress = computed(() => Math.round((babyAppData.stamps / 15) * 100))
</script>

<!-- 首頁儀表板樣式獨立維護。 -->
<style scoped src="./HomeView.css"></style>
