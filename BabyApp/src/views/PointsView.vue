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

      <p class="pending-stamps">待蓋章 <strong>{{ babyAppData.pendingStamps }}</strong> 枚</p>
      <p v-if="full" class="stamp-complete" role="status">集滿 15 枚印章，完成囉！可以開始新一張了。</p>
      <p v-else class="stamp-hint">{{ babyAppData.pendingStamps ? '按下按鈕，把獲得的章蓋到卡上。' : '完成任務後，就能獲得一枚待蓋章。' }}</p>
      <button class="stamp-button" type="button" :disabled="!full && !babyAppData.pendingStamps" @click="handleStampAction">
        {{ full ? '開始新一張' : '蓋一個章' }}
      </button>
      <p class="stamp-notice" role="status" aria-live="polite">{{ notice }}</p>
    </section>

    <RouterLink class="rewards-entry" to="/rewards">
      <span class="rewards-entry-icon" aria-hidden="true">🎟</span>
      <span><strong>獎勵商店</strong><small>可用兌換券 {{ babyAppData.vouchers }} 張</small></span>
      <span class="rewards-entry-arrow" aria-hidden="true">›</span>
    </RouterLink>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { addStamp, babyAppData, startNewStampCard } from '../composables/useBabyAppData'

// 集點卡固定 15 格，每次蓋章消耗一枚完成任務獲得的待蓋章。
const stamps = computed(() => Array.from({ length: 15 }, (_, index) => index < babyAppData.stamps))
const full = computed(() => babyAppData.stamps >= 15)
const notice = ref('')

function stampOnce() {
  const result = addStamp()
  notice.value = result.voucherIssued ? '集滿 15 章！獲得一張兌換券。'
    : result.added ? '已蓋上一個印章。' : '目前無法保存印章，請再試一次。'
}

function handleStampAction() {
  if (!full.value) {
    stampOnce()
    return
  }

  const result = startNewStampCard()
  if (result.reset) notice.value = result.saved ? '新的一張集點卡開始囉！' : '新卡已開始，但瀏覽器無法保存資料。'
}
</script>


<!-- 集點卡有獨立樣式，不影響其他頁面。 -->
<style scoped src="./PointsView.css"></style>
