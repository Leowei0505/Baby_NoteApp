<template>
  <main class="page rewards-page">
    <header class="rewards-heading">
      <div>
        <p class="eyebrow">每集滿一張卡，送自己一份小獎勵 ♡</p>
        <h1>獎勵商店</h1>
      </div>
      <img src="/7.png" alt="" aria-hidden="true" />
    </header>

    <section class="voucher-card" aria-label="可用兌換券">
      <span>我的兌換券</span>
      <strong>{{ babyAppData.vouchers }} <small>張</small></strong>
      <p>集滿 15 枚印章，就能獲得一張兌換券。</p>
    </section>

    <form class="reward-composer" @submit.prevent="addNewReward">
      <label for="new-reward-title">新增想兌換的獎勵</label>
      <div class="reward-input-row">
        <input id="new-reward-title" v-model="draftTitle" maxlength="60" autocomplete="off" placeholder="例如：一杯喜歡的飲料" />
        <button type="submit" aria-label="新增獎勵">＋</button>
      </div>
    </form>

    <p v-if="notice" class="reward-notice" role="status" aria-live="polite">{{ notice }}</p>

    <section class="reward-section" aria-labelledby="reward-list-title">
      <div class="reward-section-heading">
        <h2 id="reward-list-title">可以兌換</h2><span>{{ babyAppData.rewards.length }} 項</span>
      </div>
      <p v-if="!babyAppData.rewards.length" class="reward-empty">新增一個喜歡的小獎勵吧！</p>
      <ul v-else class="reward-list">
        <li v-for="reward in babyAppData.rewards" :key="reward.id" class="reward-item">
          <div class="reward-item-main">
            <span class="reward-icon" aria-hidden="true">✦</span>
            <strong>{{ reward.title }}</strong>
            <button type="button" class="reward-delete" :aria-label="`刪除獎勵：${reward.title}`" @click="removeReward(reward.id)">×</button>
          </div>
          <div v-if="confirmId === reward.id" class="reward-confirm">
            <span>使用 1 張兌換券？</span>
            <button type="button" class="reward-cancel" @click="confirmId = ''">取消</button>
            <button type="button" class="reward-accept" @click="confirmRedemption(reward.id)">確認兌換</button>
          </div>
          <button v-else type="button" class="reward-redeem" :disabled="!babyAppData.vouchers" @click="confirmId = reward.id">
            {{ babyAppData.vouchers ? '用 1 張券兌換' : '尚無兌換券' }}
          </button>
        </li>
      </ul>
    </section>

    <section v-if="babyAppData.redemptions.length" class="reward-section" aria-labelledby="redemption-title">
      <div class="reward-section-heading"><h2 id="redemption-title">兌換紀錄</h2></div>
      <ul class="redemption-list">
        <li v-for="record in babyAppData.redemptions" :key="record.id">
          <span>{{ record.title }}</span><time :datetime="record.redeemedAt">{{ formatDate(record.redeemedAt) }}</time>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { babyAppData, createReward, deleteReward, redeemReward } from '../composables/useBabyAppData'

const draftTitle = ref('')
const confirmId = ref('')
const notice = ref('')

function addNewReward() {
  const result = createReward(draftTitle.value)
  if (!result.added) {
    notice.value = result.reason === 'empty' ? '請先輸入獎勵名稱。' : '目前無法保存，請確認裝置儲存空間。'
    return
  }
  draftTitle.value = ''
  notice.value = '已新增獎勵。'
}

function removeReward(id) {
  if (!deleteReward(id)) {
    notice.value = '目前無法刪除獎勵，請再試一次。'
    return
  }
  if (confirmId.value === id) confirmId.value = ''
  notice.value = '已刪除獎勵，過去的兌換紀錄仍會保留。'
}

function confirmRedemption(id) {
  const result = redeemReward(id)
  if (result.redeemed) {
    confirmId.value = ''
    notice.value = '兌換成功，已使用一張兌換券！'
  } else if (result.reason === 'no-voucher') notice.value = '兌換券不足，集滿一張集點卡就能獲得。'
  else if (result.reason === 'not-found') notice.value = '這項獎勵已不存在，請重新選擇。'
  else notice.value = '目前無法保存兌換紀錄，兌換券尚未扣除。'
}

function formatDate(value) {
  return new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(value))
}
</script>

<style scoped src="./RewardsView.css"></style>
