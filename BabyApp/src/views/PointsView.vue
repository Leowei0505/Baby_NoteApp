<template>
  <main class="page points-page">
    <header class="points-heading">
      <div class="points-heading-copy">
        <h1>集點卡</h1>
        <p class="eyebrow">一個一個收集，慢慢集滿 ♡</p>
      </div>
      <img class="points-heading-art" src="/7.png" alt="" aria-hidden="true" />
    </header>

    <!-- 15 格印章卡固定為三排、每排五格。 -->
    <section class="stamp-card-page" aria-labelledby="stamp-card-title">
      <div class="stamp-card-title-row">
        <div>
          <h2 id="stamp-card-title">我的集點卡</h2>
          <p><strong>{{ babyAppData.stamps }}</strong> / 15 枚印章</p>
        </div>
        <img src="/8.png" alt="" aria-hidden="true" />
      </div>

      <div class="stamp-grid" role="list" aria-label="15 格集點卡">
        <div
          v-for="(isStamped, index) in stamps"
          :key="index"
          class="stamp-cell"
          :class="{ 'is-stamped': isStamped }"
          role="listitem"
          :aria-label="`第 ${index + 1} 格${isStamped ? '已蓋章' : '尚未蓋章'}`"
        >
          <span v-if="isStamped">章</span>
          <span v-else aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        </div>
      </div>

      <p v-if="full" class="stamp-complete" role="status">集滿 15 枚印章，完成囉！</p>
      <p v-else class="stamp-hint">按下按鈕，就能再蓋上一個章。</p>
      <button class="stamp-button" type="button" :disabled="full" @click="stampOnce">
        {{ full ? '已集滿' : '蓋一個章' }}
      </button>
      <p class="stamp-notice" role="status" aria-live="polite">{{ notice }}</p>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { addStamp, babyAppData } from '../composables/useBabyAppData'

// 集點卡固定 15 格，每次按鈕操作新增一枚印章。
const stamps = computed(() => Array.from({ length: 15 }, (_, index) => index < babyAppData.stamps))
const full = computed(() => babyAppData.stamps >= 15)
const notice = ref('')

function stampOnce() {
  const result = addStamp()
  if (!result.added) return
  notice.value = result.saved ? '已蓋上一個印章。' : '已暫時更新，但瀏覽器無法保存資料。'
}
</script>


<!-- 集點卡有獨立樣式，不影響其他頁面。 -->
<style scoped src="./PointsView.css"></style>
