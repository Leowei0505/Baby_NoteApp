<template>
  <main class="page home-page">
    <!-- 今天日期與角色插圖構成首頁問候區。 -->
    <header class="home-greeting">
      <p class="home-date">{{ todayLabel }}</p>
      <div class="home-greeting-main">
        <div class="home-greeting-copy">
          <h1>今天過得好嗎~ ♡</h1>
          <p>和烏薩奇一起記錄每一天！</p>
        </div>
        <img class="home-greeting-art" src="/5.png" alt="" aria-hidden="true" />
      </div>
    </header>

    <!-- 週期卡直接帶往經期日曆，並依現有紀錄顯示狀態。 -->
    <RouterLink class="cycle-card" to="/calendar" aria-label="前往經期日曆">
      <div class="cycle-card-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8S5.5 10.5 5.5 15a6.5 6.5 0 0 0 13 0c0-4.5-6.5-12.2-6.5-12.2Z" /></svg>
        <span>我的週期</span>
      </div>
      <div class="cycle-card-copy">
        <h2>{{ latestPeriod ? `週期第 ${cycleDay} 天` : '尚未開始記錄' }}</h2>
        <p>{{ latestPeriod ? '點開日曆查看週期進度 ♡' : '記錄第一次經期，開始了解自己的週期 ♡' }}</p>
      </div>
      <img class="cycle-card-art" src="/4.png" alt="" aria-hidden="true" />
      <span class="cycle-card-action">{{ latestPeriod ? '查看經期日曆' : '開始記錄經期' }}<span aria-hidden="true">›</span></span>
    </RouterLink>

    <!-- 集點摘要連到集點卡；心情卡可新增並保留今天的選擇。 -->
    <section class="home-summary-grid" aria-label="今日摘要">
      <RouterLink class="summary-card points-summary" to="/points" aria-label="查看集點進度">
        <span class="summary-card-heading">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.7 1.6 3.1.1.8 3 2 2.4-1.2 2.9.4 3-2.7 1.5-1.7 2.6-3-.7-3 .7-1.7-2.6-2.7-1.5.4-3-1.2-2.9 2-2.4.8-3 3.1-.1L12 2.8Z" /><path d="m9.5 12 1.6 1.6 3.5-3.5" /></svg>
          <span>集點進度</span>
        </span>
        <strong class="summary-number">{{ babyAppData.stamps }}<small> / 15</small></strong>
        <span class="summary-progress" role="progressbar" aria-label="印章收集進度" aria-valuemin="0" aria-valuemax="15" :aria-valuenow="babyAppData.stamps">
          <i :style="{ width: `${stampProgress}%` }"></i>
        </span>
        <img src="/8.png" alt="" aria-hidden="true" />
      </RouterLink>

      <section class="summary-card mood-summary" aria-labelledby="mood-card-title">
        <div class="summary-card-heading">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8.5 14s1.1 2 3.5 2 3.5-2 3.5-2m-6-4h.01M14.5 10h.01" /></svg>
          <h2 id="mood-card-title">今天的心情</h2>
          <span class="mood-heart" aria-hidden="true">♡</span>
        </div>
        <p class="mood-summary-text">{{ todayMood ? `${moodById[todayMood]?.emoji} ${moodById[todayMood]?.label}` : '還沒有記錄' }}</p>
        <button class="mood-action" type="button" @click="openSheet('mood')">{{ todayMood ? '重新記錄' : '去記錄' }}<span aria-hidden="true">›</span></button>
      </section>
    </section>

    <!-- 回憶相簿入口與更多功能按鈕都有明確的點擊行為。 -->
    <section class="home-places" aria-labelledby="home-places-title">
      <div class="home-places-heading">
        <h2 id="home-places-title">我的小天地</h2>
        <button class="more-functions" type="button" @click="openSheet('more')">更多功能 <span aria-hidden="true">›</span></button>
      </div>
      <button class="memory-card" type="button" @click="openSheet('album')">
        <svg class="memory-art" viewBox="0 0 54 48" aria-hidden="true"><rect x="7" y="9" width="28" height="30" rx="3" transform="rotate(-12 7 9)" /><rect x="18" y="5" width="28" height="30" rx="3" transform="rotate(8 18 5)" /><path d="m22 27 7-7 6 5 4-4 5 8H22Z" /><circle cx="31" cy="14" r="2.4" /></svg>
        <span class="memory-card-copy"><strong>回憶相簿</strong><small>收藏生活裡的小幸福 ♡</small></span>
        <span class="memory-count">{{ homeJournal.memories.length }}<small>則</small></span>
        <span class="memory-arrow" aria-hidden="true">›</span>
      </button>
    </section>
  </main>

  <!-- 功能以底部工作表呈現，維持手機 App 的操作脈絡。 -->
  <Teleport to="body">
    <div v-if="activeSheet" class="home-sheet-backdrop" @click.self="closeSheet" @contextmenu.prevent>
      <section class="home-sheet" role="dialog" aria-modal="true" :aria-labelledby="`sheet-title-${activeSheet}`">
        <button class="sheet-close" type="button" aria-label="關閉" @click="closeSheet">×</button>

        <template v-if="activeSheet === 'mood'">
          <h2 id="sheet-title-mood">記錄今天的心情</h2>
          <p class="sheet-description">選一個最接近現在的感受，記錄只保存在這台裝置。</p>
          <div class="mood-options">
            <button v-for="mood in moodOptions" :key="mood.id" class="mood-option" :class="{ 'is-selected': todayMood === mood.id }" type="button" @click="saveMood(mood.id)">
              <span>{{ mood.emoji }}</span><strong>{{ mood.label }}</strong>
            </button>
          </div>
          <p v-if="sheetNotice" class="sheet-notice" role="status">{{ sheetNotice }}</p>
        </template>

        <template v-else-if="activeSheet === 'album'">
          <h2 id="sheet-title-album">回憶相簿</h2>
          <p class="sheet-description">留下照片或一句小幸福，內容只保存在這台裝置。</p>
          <div class="memory-composer">
            <label class="photo-picker">{{ memoryImage ? '更換照片' : '選擇照片' }}<input type="file" accept="image/*" @change="selectMemoryImage" /></label>
            <img v-if="memoryImage" class="memory-preview" :src="memoryImage" alt="回憶照片預覽" />
            <textarea v-model="memoryCaption" maxlength="120" rows="2" placeholder="今天想收藏什麼小幸福？"></textarea>
            <button class="sheet-primary-action" type="button" :disabled="!memoryCaption.trim() && !memoryImage" @click="saveMemory">收藏回憶</button>
            <p v-if="sheetNotice" class="sheet-notice" role="status">{{ sheetNotice }}</p>
          </div>
          <div v-if="homeJournal.memories.length" class="memory-list">
            <article v-for="memory in homeJournal.memories" :key="memory.id" class="memory-entry">
              <img v-if="memory.image" :src="memory.image" alt="" />
              <div><time>{{ formatMemoryDate(memory.date) }}</time><p>{{ memory.caption }}</p></div>
              <button type="button" :aria-label="`刪除 ${formatMemoryDate(memory.date)} 的回憶`" @click="deleteMemory(memory.id)">刪除</button>
            </article>
          </div>
          <p v-else class="memory-empty">還沒有收藏的回憶，從今天開始留下小幸福吧 ♡</p>
        </template>

        <template v-else>
          <h2 id="sheet-title-more">更多功能</h2>
          <p class="sheet-description">前往 BabyApp 的其他小天地。</p>
          <div class="more-actions">
            <RouterLink to="/calendar" @click="closeSheet">經期日曆 <span aria-hidden="true">›</span></RouterLink>
            <RouterLink to="/points" @click="closeSheet">集點任務 <span aria-hidden="true">›</span></RouterLink>
            <button type="button" @click="openSheet('album')">回憶相簿 <span aria-hidden="true">›</span></button>
            <RouterLink to="/about" @click="closeSheet">認識 BabyApp <span aria-hidden="true">›</span></RouterLink>
          </div>
        </template>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { babyAppData, dateToKey, parseDateKey } from '../composables/useBabyAppData'

// 首頁私密日記獨立存放，避免改動既有經期與集點資料格式。
const JOURNAL_STORAGE_KEY = 'babyapp.home-journal.v1'
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const MAX_MEMORIES = 20

const moodOptions = [
  { id: 'happy', label: '開心', emoji: '😊' },
  { id: 'calm', label: '平靜', emoji: '😌' },
  { id: 'okay', label: '普通', emoji: '🙂' },
  { id: 'tired', label: '疲憊', emoji: '😴' },
  { id: 'low', label: '低落', emoji: '🥺' },
]
const moodById = Object.fromEntries(moodOptions.map((mood) => [mood.id, mood]))
const today = new Date()
const todayKey = dateToKey(today)
const todayLabel = `${today.getMonth() + 1}月${today.getDate()}日・${WEEKDAYS[today.getDay()]}`
const activeSheet = ref('')
const sheetNotice = ref('')
const memoryCaption = ref('')
const memoryImage = ref('')

// 載入並檢查本機心情和相簿資料，忽略格式不完整的舊項目。
function loadJournal() {
  const empty = { moods: {}, memories: [] }
  try {
    const saved = JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return empty

    const moods = Object.fromEntries(Object.entries(saved.moods || {}).filter(([date, mood]) => parseDateKey(date) && moodById[mood]))
    const memories = Array.isArray(saved.memories)
      ? saved.memories.filter((memory) => memory && typeof memory.id === 'string' && parseDateKey(memory.date) && typeof memory.caption === 'string' && typeof memory.image === 'string').slice(0, MAX_MEMORIES)
      : []
    return { moods, memories }
  } catch {
    return empty
  }
}

const homeJournal = reactive(loadJournal())

// 儲存成功才更新畫面，避免儲存空間不足時顯示未保存內容。
function persistJournal(nextJournal) {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(nextJournal))
    Object.assign(homeJournal, nextJournal)
    return true
  } catch {
    return false
  }
}

const stampProgress = computed(() => Math.round((babyAppData.stamps / 15) * 100))
const todayMood = computed(() => homeJournal.moods[todayKey] || '')
const latestPeriod = computed(() => babyAppData.periods
  .filter((period) => period.startDate <= todayKey)
  .sort((first, second) => second.startDate.localeCompare(first.startDate))[0] || null)
const cycleDay = computed(() => {
  if (!latestPeriod.value) return 0
  const elapsedDays = Math.floor((parseDateKey(todayKey).getTime() - parseDateKey(latestPeriod.value.startDate).getTime()) / 86400000)
  return (elapsedDays % babyAppData.cycleLengthDays) + 1
})

// 開啟或關閉首頁的功能工作表並清除上次的提示訊息。
function openSheet(name) {
  activeSheet.value = name
  sheetNotice.value = ''
}

function closeSheet() {
  activeSheet.value = ''
  sheetNotice.value = ''
  memoryCaption.value = ''
  memoryImage.value = ''
}

// 以日期為索引保存今天選擇的心情。
function saveMood(moodId) {
  const nextJournal = { ...homeJournal, moods: { ...homeJournal.moods, [todayKey]: moodId } }
  if (persistJournal(nextJournal)) closeSheet()
  else sheetNotice.value = '目前無法保存，請檢查裝置儲存空間。'
}

// 把相片縮到 900px 以內後再存入本機，避免原始照片佔用過多空間。
function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('photo-read'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('photo-decode'))
      image.onload = () => {
        const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.naturalWidth * scale)
        canvas.height = Math.round(image.naturalHeight * scale)
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('photo-canvas'))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.76))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

// 選取相片時先壓縮並顯示預覽，不會在按下收藏前保存。
async function selectMemoryImage(event) {
  const [file] = event.target.files || []
  if (!file) return
  sheetNotice.value = ''
  memoryImage.value = ''
  if (!file.type.startsWith('image/')) {
    sheetNotice.value = '請選擇圖片檔案。'
    event.target.value = ''
    return
  }
  if (file.size > 15 * 1024 * 1024) {
    sheetNotice.value = '照片太大，請選擇 15MB 以下的圖片。'
    event.target.value = ''
    return
  }
  try {
    memoryImage.value = await compressPhoto(file)
  } catch {
    sheetNotice.value = '照片讀取失敗，請換一張圖片再試。'
  }
}

// 新增相片或文字回憶，最多保留 20 則。
function saveMemory() {
  if (homeJournal.memories.length >= MAX_MEMORIES) {
    sheetNotice.value = `相簿最多保留 ${MAX_MEMORIES} 則回憶，請先刪除舊回憶。`
    return
  }
  const caption = memoryCaption.value.trim()
  if (!caption && !memoryImage.value) return
  const memory = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: todayKey,
    caption,
    image: memoryImage.value,
  }
  if (persistJournal({ ...homeJournal, memories: [memory, ...homeJournal.memories] })) {
    memoryCaption.value = ''
    memoryImage.value = ''
    sheetNotice.value = '已收藏這則小回憶。'
  } else {
    sheetNotice.value = '保存空間不足，請移除一些照片後再試。'
  }
}

// 刪除指定回憶並保留其他項目。
function deleteMemory(id) {
  const memories = homeJournal.memories.filter((memory) => memory.id !== id)
  if (!persistJournal({ ...homeJournal, memories })) sheetNotice.value = '目前無法更新相簿，請再試一次。'
}

function formatMemoryDate(dateKey) {
  const date = parseDateKey(dateKey)
  return date ? `${date.getMonth() + 1}月${date.getDate()}日` : ''
}
</script>

<!-- 首頁排版與功能工作表樣式各自維護。 -->
<style scoped src="./HomeView.css"></style>

