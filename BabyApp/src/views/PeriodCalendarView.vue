<template>
  <main class="page period-page">
    <header class="page-heading">
      <div>
        <h1>經期日曆</h1>
        <p class="eyebrow">照自己的步調，記下每個週期</p>
      </div>
      <img class="heading-art" src="/4.png" alt="" aria-hidden="true" />
    </header>

    <section class="cycle-status" aria-live="polite" aria-label="週期狀態">
      <div class="cycle-overview">
        <div class="cycle-details">
          <p class="cycle-badge">目前週期</p>
          <h2>{{ referencePeriod ? `${viewedDateLabel}・${currentCycleDay <= viewedPeriodLength ? '生理期' : '週期'}第 ${currentCycleDay} 天` : '開始記錄你的週期' }}</h2>
          <p class="phase-label">
            <svg class="detail-icon period-drop" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5S5.4 10.4 5.4 15.1a6.6 6.6 0 0 0 13.2 0C18.6 10.4 12 2.5 12 2.5Z" /></svg>
            {{ activePeriod?.startDate > todayKey ? `經期預計 ${formatShortDate(activePeriod.startDate)} 開始` : currentPhase }}
          </p>
          <p class="conception-level">受孕機率：<strong :class="{
            'level-high': conceptionLevel === '高',
            'level-medium': conceptionLevel === '中',
            'level-low': conceptionLevel === '低',
          }">{{ conceptionLevel }}</strong></p>
          <p class="cycle-reminder-line">
            <svg class="detail-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17" /></svg>
            <template v-if="viewedOvulationDistance !== null">
              {{ viewedOvulationDistance > 0 ? `預估排卵日：${viewedOvulationDistance} 天之後` : viewedOvulationDistance === 0 ? '預估排卵日：今天' : `預估排卵日已過： ${Math.abs(viewedOvulationDistance)} 天` }}
            </template>
            <template v-else>記錄經期後會顯示排卵日估算。</template>
          </p>
          <p class="cycle-reminder-line">
            <svg class="detail-icon sprout-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20v-8M12 13C7 13 5 10 5 6c4 0 7 2 7 7ZM12 16c0-4 2-7 7-7 0 4-2 7-7 7Z" /></svg>
            <template v-if="viewedNextPeriodDistance !== null">
              {{ viewedNextPeriodDistance > 0 ? `下次經期預測：${viewedNextPeriodDistance} 天之後` : viewedNextPeriodDistance === 0 ? '下次經期預測：今天' : `下次經期估算已過 ${Math.abs(viewedNextPeriodDistance)} 天` }}
            </template>
            <template v-else>點選日曆設定經期開始日。</template>
          </p>
        </div>
        <div
          class="cycle-ring"
          :role="cycleProgress ? 'progressbar' : undefined"
          :style="{ '--cycle-progress': cycleProgress ? `${Math.min(cycleProgress.currentDay, cycleProgress.totalDays) / cycleProgress.totalDays * 100}%` : '0%' }"
          :aria-valuemin="cycleProgress ? 1 : undefined"
          :aria-valuemax="cycleProgress?.sliderMax"
          :aria-valuenow="cycleProgress?.currentDay"
          :aria-label="cycleProgress ? `週期第 ${cycleProgress.currentDay} 天，共 ${cycleProgress.totalDays} 天` : undefined"
        >
          <div class="cycle-ring-inner">
            <span>週期天數</span>
            <strong>{{ cycleProgress?.currentDay ?? '—' }}<small> / {{ cycleProgress?.totalDays ?? cycleLength }} 天</small></strong>
            <svg class="ring-drop" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5S5.4 10.4 5.4 15.1a6.6 6.6 0 0 0 13.2 0C18.6 10.4 12 2.5 12 2.5Z" /></svg>
          </div>
        </div>
      </div>
    </section>

    <section v-if="cycleProgress" class="cycle-progress-card" aria-label="週期進度">
        <div class="progress-heading">
          <h3>週期進度</h3>
          <span>第 {{ cycleProgress.currentDay }} / {{ cycleProgress.totalDays }} 天</span>
        </div>
        <div
          class="cycle-track"
          role="progressbar"
          :aria-valuemin="1"
          :aria-valuemax="cycleProgress.sliderMax"
          :aria-valuenow="cycleProgress.currentDay"
          :aria-label="`${viewedDateLabel}，週期第 ${cycleProgress.currentDay} 天，平均週期估算 ${cycleProgress.totalDays} 天`"
        >
          <span class="track-period" :style="{ width: `${cycleProgress.periodWidth}%` }"></span>
          <span class="track-fertile" :style="{ left: `${cycleProgress.fertileLeft}%`, width: `${cycleProgress.fertileWidth}%` }"></span>
          <span class="track-next-period" :style="{ width: `${cycleProgress.nextPeriodWidth}%` }"></span>
          <span class="track-ovulation" :style="{ left: `${cycleProgress.ovulationPosition}%` }" aria-label="預估排卵日"></span>
          <span class="track-today" :style="{ left: `${cycleProgress.todayPosition}%` }" aria-label="今天"></span>
          <span class="track-selected" :style="{ left: `${cycleProgress.selectedPosition}%` }"><i>{{ viewedDate === todayKey ? '今天' : `第 ${cycleProgress.currentDay} 天` }}</i></span>
          <input
            class="cycle-slider"
            type="range"
            min="1"
            :max="cycleProgress.sliderMax"
            :value="cycleProgress.currentDay"
            :aria-label="`滑動查看週期日期，目前${viewedDateLabel}，第${cycleProgress.currentDay}天`"
            @input="setCycleDay"
          />
        </div>
        <div class="progress-legend" aria-label="進度圖例">
          <span><i class="legend-period"></i>經期</span>
          <span><i class="legend-fertile"></i>易受孕期</span>
          <span><i class="legend-ovulation"></i>排卵日</span>
          <span><i class="legend-next-period"></i>預測經期</span>
        </div>
      </section>

    <section class="calendar-panel" aria-label="月曆">
      <div class="month-controls">
        <button type="button" aria-label="上個月" @click="moveMonth(-1)">‹</button>
        <h2>{{ monthTitle }}</h2>
        <button type="button" aria-label="下個月" @click="moveMonth(1)">›</button>
      </div>
      <div class="calendar-grid weekday-row" aria-hidden="true">
        <span v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">{{ day }}</span>
      </div>
      <div class="calendar-grid date-grid" role="grid" :aria-label="monthTitle">
        <div v-for="(cell, index) in calendarCells" :key="cell?.date || `empty-${index}`" class="calendar-slot" role="gridcell">
          <button
            v-if="cell"
            type="button"
            class="calendar-cell"
            :class="{
              'is-period': cell.isPeriod,
              'is-period-preview': cell.isPeriodPreview,
              'is-period-estimate': cell.isEstimatedPeriod,
              'is-fertile': cell.isFertile,
              'is-ovulation': cell.isOvulation,
              'is-next-period': cell.isNextPeriod,
              'is-today': cell.isToday,
              'is-selected': cell.isSelected,
            }"
            :disabled="activePeriod && cell.date < activePeriod.startDate"
            :aria-label="`${cell.date}${cell.isPeriod ? '，經期紀錄' : ''}${cell.isPeriodPreview ? '，7 天經期預覽，尚未儲存' : ''}${cell.isEstimatedPeriod ? '，預估經期' : ''}${cell.isFertile ? '，預估易受孕期' : ''}${cell.isOvulation ? '，預估排卵日' : ''}${cell.isNextPeriod ? '，預估下次經期' : ''}`"
            @click="selectDate(cell.date)"
          >
            <span>{{ cell.day }}</span>
            <i v-if="cell.isOvulation" class="day-marker marker-ovulation" aria-hidden="true"></i>
            <i v-else-if="cell.isFertile" class="day-marker marker-fertile" aria-hidden="true"></i>
            <i v-else-if="cell.isNextPeriod" class="day-marker marker-next-period" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div class="calendar-legend" aria-label="日期圖例">
        <span><i class="legend-period"></i>經期紀錄</span>
        <span v-if="!activePeriod"><i class="legend-period-preview"></i>經期預覽（未儲存）</span>
        <span><i class="legend-period-estimate"></i>經期預測</span>
        <span><i class="legend-fertile"></i>易受孕期</span>
        <span><i class="legend-ovulation"></i>排卵日</span>
        <span><i class="legend-next-period"></i>下次經期</span>
      </div>
      <div class="calendar-actions">
        <p v-if="notice" class="storage-notice" role="status">{{ notice }}</p>
        <button class="period-action-button" type="button" :disabled="activePeriod && !selectedDate" @click="saveSelectedPeriod">
          {{ activePeriod
            ? selectedDate > todayKey ? '預測結束日' : '結束經期'
            : selectedDate > todayKey ? '預約開始日' : '開始經期' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { addDaysToKey, babyAppData, dateToKey, parseDateKey, savePeriod } from '../composables/useBabyAppData'

const PERIOD_DAYS = 7
const todayKey = dateToKey(new Date())
const visibleMonth = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12))
const selectedDate = ref('')
const selectedCycleDay = ref(null)
const notice = ref('')

const periodsNewestFirst = computed(() => [...babyAppData.periods].sort((a, b) => b.startDate.localeCompare(a.startDate)))
const activePeriod = computed(() => periodsNewestFirst.value.find((period) =>
  period.startDate > todayKey || !period.endDate || period.endDate >= todayKey,
) || null)
if (!activePeriod.value) selectedDate.value = todayKey
const latestPeriod = computed(() => periodsNewestFirst.value[0] || null)
const referencePeriod = computed(() => activePeriod.value || latestPeriod.value)
const cycleLength = computed(() => Math.max(1, babyAppData.cycleLengthDays || 28))
const periodExtensionDays = computed(() => referencePeriod.value?.endDate
  ? Math.max(0, daysBetween(referencePeriod.value.startDate, referencePeriod.value.endDate) + 1 - PERIOD_DAYS)
  : 0)
const estimatedCycleLength = computed(() => cycleLength.value + periodExtensionDays.value)
const nextPeriodStart = computed(() => referencePeriod.value
  ? addDaysToKey(referencePeriod.value.startDate, estimatedCycleLength.value)
  : null)
const ovulationDate = computed(() => nextPeriodStart.value ? addDaysToKey(nextPeriodStart.value, -14) : null)
const fertileStart = computed(() => ovulationDate.value ? addDaysToKey(ovulationDate.value, -5) : null)
const fertileEnd = computed(() => ovulationDate.value ? addDaysToKey(ovulationDate.value, 1) : null)
const cycleDay = computed(() => referencePeriod.value ? daysBetween(referencePeriod.value.startDate, todayKey) + 1 : null)
const currentCycleDay = computed(() => Math.max(1, selectedCycleDay.value || cycleDay.value || 1))
const viewedDate = computed(() => referencePeriod.value
  ? addDaysToKey(referencePeriod.value.startDate, currentCycleDay.value - 1)
  : todayKey)
const viewedOvulationDistance = computed(() => ovulationDate.value ? daysBetween(viewedDate.value, ovulationDate.value) : null)
const viewedNextPeriodDistance = computed(() => nextPeriodStart.value ? daysBetween(viewedDate.value, nextPeriodStart.value) : null)
const isViewedFertile = computed(() => Boolean(fertileStart.value && viewedDate.value >= fertileStart.value && viewedDate.value <= fertileEnd.value))
const viewedPeriodLength = computed(() => activePeriod.value
  ? activePeriod.value.endDate
    ? daysBetween(activePeriod.value.startDate, activePeriod.value.endDate) + 1
    : PERIOD_DAYS
  : referencePeriod.value?.endDate
    ? daysBetween(referencePeriod.value.startDate, referencePeriod.value.endDate) + 1
    : PERIOD_DAYS)
const currentPhase = computed(() => {
  if (!referencePeriod.value) return '記錄經期後開始估算週期'
  if (currentCycleDay.value <= viewedPeriodLength.value) return activePeriod.value ? '生理期（含預估）' : '生理期'
  if (viewedDate.value === ovulationDate.value) return '排卵日'
  if (isViewedFertile.value) return '易受孕期'
  return '週期中'
})
const conceptionLevel = computed(() => {
  if (!ovulationDate.value) return '尚無資料'
  const distance = Math.abs(daysBetween(viewedDate.value, ovulationDate.value))
  if (distance <= 1) return '高'
  if (isViewedFertile.value) return '中'
  return '低'
})
const viewedDateLabel = computed(() => new Intl.DateTimeFormat('zh-TW', {
  month: 'long',
  day: 'numeric',
}).format(parseDateKey(viewedDate.value)))
const monthTitle = computed(() => `西元${new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
}).format(visibleMonth.value)}`)

const cycleProgress = computed(() => {
  if (!referencePeriod.value) return null
  const totalDays = estimatedCycleLength.value
  const dayPosition = (day) => Math.max(0, Math.min(100, ((day - 0.5) / totalDays) * 100))
  const dayNumber = (date) => daysBetween(referencePeriod.value.startDate, date) + 1
  const fertileStartDay = Math.max(1, dayNumber(fertileStart.value))
  const fertileEndDay = Math.min(totalDays, dayNumber(fertileEnd.value))
  const periodDays = activePeriod.value
    ? activePeriod.value.endDate
      ? daysBetween(activePeriod.value.startDate, activePeriod.value.endDate) + 1
      : PERIOD_DAYS
    : referencePeriod.value.endDate
      ? daysBetween(referencePeriod.value.startDate, referencePeriod.value.endDate) + 1
      : PERIOD_DAYS

  return {
    totalDays,
    sliderMax: Math.max(totalDays, cycleDay.value || totalDays),
    currentDay: currentCycleDay.value,
    selectedPosition: dayPosition(currentCycleDay.value),
    todayPosition: dayPosition(cycleDay.value),
    periodWidth: Math.min(periodDays, totalDays) / totalDays * 100,
    fertileLeft: (fertileStartDay - 1) / totalDays * 100,
    fertileWidth: Math.max(0, fertileEndDay - fertileStartDay + 1) / totalDays * 100,
    ovulationPosition: dayPosition(dayNumber(ovulationDate.value)),
    nextPeriodWidth: Math.min(PERIOD_DAYS, totalDays) / totalDays * 100,
  }
})

const calendarCells = computed(() => {
  const year = visibleMonth.value.getFullYear()
  const month = visibleMonth.value.getMonth()
  const offset = new Date(year, month, 1, 12).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const hasFutureForecast = Boolean(nextPeriodStart.value && nextPeriodStart.value >= todayKey)

  const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - offset + 1
    if (day < 1 || day > daysInMonth) return null
    const date = dateToKey(new Date(year, month, day, 12))
    const period = periodAtDate(date)
    const estimatedPeriodEnd = activePeriod.value
      ? selectedDate.value && selectedDate.value >= activePeriod.value.startDate
        ? selectedDate.value
        : activePeriod.value.endDate || addDaysToKey(activePeriod.value.startDate, PERIOD_DAYS - 1)
      : null
    const previewPeriodEnd = !activePeriod.value && selectedDate.value ? addDaysToKey(selectedDate.value, PERIOD_DAYS - 1) : null
    return {
      date,
      day,
      isPeriod: Boolean(period && date <= todayKey),
      isPeriodPreview: Boolean(previewPeriodEnd && date >= selectedDate.value && date <= previewPeriodEnd),
      isEstimatedPeriod: Boolean(activePeriod.value && date > todayKey
        && date >= activePeriod.value.startDate
        && date <= (activePeriod.value.endDate || estimatedPeriodEnd)),
      isFertile: Boolean(hasFutureForecast && date >= fertileStart.value && date <= fertileEnd.value),
      isOvulation: Boolean(hasFutureForecast && date === ovulationDate.value),
      isNextPeriod: Boolean(hasFutureForecast && date >= nextPeriodStart.value
        && date < addDaysToKey(nextPeriodStart.value, PERIOD_DAYS)),
      isToday: date === todayKey,
      isSelected: date === selectedDate.value,
      isFuture: date > todayKey,
    }
  })
})

function daysBetween(start, end) {
  const startDate = parseDateKey(start)
  const endDate = parseDateKey(end)
  return startDate && endDate ? Math.round((endDate - startDate) / 86400000) : 0
}

function periodAtDate(dateKey) {
  return babyAppData.periods.find((period) => dateKey >= period.startDate
    && dateKey <= (period.endDate || todayKey)) || null
}

function formatShortDate(value) {
  const date = parseDateKey(value)
  return date ? new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric' }).format(date) : ''
}

function moveMonth(offset) {
  visibleMonth.value = new Date(visibleMonth.value.getFullYear(), visibleMonth.value.getMonth() + offset, 1, 12)
}

function selectDate(dateKey) {
  selectedDate.value = dateKey
  notice.value = ''
}

function saveSelectedPeriod() {
  const isEndingPeriod = Boolean(activePeriod.value)
  if (isEndingPeriod && !selectedDate.value) {
    notice.value = '請先在日曆選擇經期實際結束日。'
    return
  }
  const dateKey = selectedDate.value || todayKey
  const periodStartDate = isEndingPeriod ? activePeriod.value.startDate : null
  const matchedPeriod = periodAtDate(dateKey)
  const input = isEndingPeriod
    ? { id: activePeriod.value.id, startDate: periodStartDate, endDate: dateKey }
    : { id: matchedPeriod?.id, startDate: dateKey, endDate: matchedPeriod?.endDate || null }
  const result = savePeriod(input)

  if (!result.ok) {
    notice.value = result.reason === 'overlap'
      ? '這個日期會與其他經期紀錄重疊，請調整日期。'
      : isEndingPeriod
        ? '結束日期不能早於開始日，或晚於今天。'
        : '請選擇有效的經期開始日期。'
    return
  }

  const endedDays = isEndingPeriod ? daysBetween(periodStartDate, dateKey) + 1 : 0
  const delayDays = Math.max(0, endedDays - PERIOD_DAYS)
  notice.value = result.saved
    ? isEndingPeriod
      ? dateKey > todayKey
        ? delayDays
          ? `已預約 ${formatShortDate(dateKey)} 結束；排卵與下次經期估算延後 ${delayDays} 天。`
          : `已預約 ${formatShortDate(dateKey)} 為經期結束日。`
        : delayDays
          ? `經期已結束，實際共 ${endedDays} 天；排卵與下次經期估算延後 ${delayDays} 天。`
          : `經期已結束，實際共 ${endedDays} 天。`
      : dateKey > todayKey
        ? `經期開始日已鎖定為 ${formatShortDate(dateKey)}，預估 7 天（至 ${formatShortDate(addDaysToKey(dateKey, PERIOD_DAYS - 1))}）。`
        : `經期已開始，先預估 7 天（至 ${formatShortDate(addDaysToKey(dateKey, PERIOD_DAYS - 1))}）；你可自行設定實際結束日。`
    : '紀錄已更新，但瀏覽器未能保存；重整後可能會消失。'
  selectedDate.value = ''
  selectedCycleDay.value = null
}

function setCycleDay(event) {
  selectedCycleDay.value = Number(event.target.value)
}

</script>

<!-- 經期日曆的樣式維持獨立檔案，方便單頁調整。 -->
<style scoped src="./PeriodCalendarView.css"></style>
