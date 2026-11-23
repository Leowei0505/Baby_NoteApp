import { reactive } from 'vue'

// 所有頁面共用同一份本機資料，不依賴額外狀態管理套件。
const STORAGE_KEY = 'babyapp.data.v1'
const DEFAULT_DATA = () => ({
  periods: [], cycleLengthDays: 28, stamps: 0, pendingStamps: 0, tasks: [],
  vouchers: 0, fullCardRewardIssued: false, rewards: [], redemptions: [],
})

export function dateToKey(date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) || dateToKey(date) !== value ? null : date
}

export function addDaysToKey(value, days) {
  const date = parseDateKey(value)
  if (!date || !Number.isSafeInteger(days)) return null
  date.setDate(date.getDate() + days)
  return Number.isNaN(date.getTime()) ? null : dateToKey(date)
}

function isValidPeriod(period) {
  if (!period || typeof period.id !== 'string' || !parseDateKey(period.startDate)) return false
  if (period.endDate === null) return true
  const endDate = parseDateKey(period.endDate)
  return Boolean(endDate && period.endDate >= period.startDate)
}

function isValidTask(task) {
  return Boolean(
    task &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    task.title.trim() &&
    typeof task.completed === 'boolean',
  )
}

function isValidReward(reward) {
  return Boolean(reward && typeof reward.id === 'string' && typeof reward.title === 'string' && reward.title.trim())
}

function isValidRedemption(redemption) {
  return Boolean(redemption && typeof redemption.id === 'string' &&
    typeof redemption.title === 'string' && redemption.title.trim() &&
    typeof redemption.redeemedAt === 'string' && !Number.isNaN(Date.parse(redemption.redeemedAt)))
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return DEFAULT_DATA()

    const stamps = Number.isInteger(saved.stamps) ? Math.min(15, Math.max(0, saved.stamps)) : 0
    // 舊版已滿卡但沒有發券標記時，只在首次讀取時補發一張。
    const legacyFullCard = stamps === 15 && typeof saved.fullCardRewardIssued !== 'boolean'
    const data = {
      periods: Array.isArray(saved.periods) ? saved.periods.filter(isValidPeriod) : [],
      cycleLengthDays: Number.isInteger(saved.cycleLengthDays) && saved.cycleLengthDays > 0
        ? saved.cycleLengthDays
        : 28,
      stamps,
      pendingStamps: Number.isSafeInteger(saved.pendingStamps) && saved.pendingStamps > 0 ? saved.pendingStamps : 0,
      tasks: Array.isArray(saved.tasks) ? saved.tasks.filter(isValidTask) : [],
      vouchers: (Number.isSafeInteger(saved.vouchers) && saved.vouchers >= 0 ? saved.vouchers : 0) + Number(legacyFullCard),
      fullCardRewardIssued: stamps === 15 && (legacyFullCard || saved.fullCardRewardIssued === true),
      rewards: Array.isArray(saved.rewards) ? saved.rewards.filter(isValidReward) : [],
      redemptions: Array.isArray(saved.redemptions) ? saved.redemptions.filter(isValidRedemption) : [],
    }
    if (legacyFullCard) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* 下次開啟時再試保存補發結果。 */ }
    }
    return data
  } catch {
    return DEFAULT_DATA()
  }
}

export const babyAppData = reactive(loadData())

function persistData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(babyAppData))
    return true
  } catch {
    return false
  }
}

// 先寫入本機資料，再更新 Vue 狀態，避免保存失敗時畫面顯示未保存內容。
function saveNextData(nextData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    Object.assign(babyAppData, nextData)
    return true
  } catch {
    return false
  }
}

function hasOverlappingPeriod(candidate) {
  const candidateEnd = candidate.endDate || '9999-12-31'
  return babyAppData.periods.some((period) => {
    if (period.id === candidate.id) return false
    const periodEnd = period.endDate || '9999-12-31'
    return candidate.startDate <= periodEnd && period.startDate <= candidateEnd
  })
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function savePeriod({ id, startDate, endDate }) {
  const normalizedEnd = endDate || null

  if (!parseDateKey(startDate)) return { ok: false, reason: 'start-date' }
  if (normalizedEnd && (!parseDateKey(normalizedEnd) || normalizedEnd < startDate)) {
    return { ok: false, reason: 'end-date' }
  }

  const period = { id: id || createId(), startDate, endDate: normalizedEnd }
  if (hasOverlappingPeriod(period)) return { ok: false, reason: 'overlap' }

  const index = babyAppData.periods.findIndex((item) => item.id === period.id)
  if (index === -1) babyAppData.periods.push(period)
  else babyAppData.periods.splice(index, 1, period)
  babyAppData.periods.sort((a, b) => a.startDate.localeCompare(b.startDate))

  return { ok: true, saved: persistData() }
}

export function deletePeriod(id) {
  const index = babyAppData.periods.findIndex((period) => period.id === id)
  if (index === -1) return false
  babyAppData.periods.splice(index, 1)
  return persistData()
}

export function setCycleLengthDays(value) {
  if (!Number.isSafeInteger(value) || value < 1) return false
  babyAppData.cycleLengthDays = value
  return persistData()
}

export function addStamp() {
  if (babyAppData.stamps >= 15 || babyAppData.pendingStamps < 1) return { added: false, saved: true }
  const fillsCard = babyAppData.stamps === 14 && !babyAppData.fullCardRewardIssued
  const saved = saveNextData({
    ...babyAppData,
    stamps: babyAppData.stamps + 1,
    pendingStamps: babyAppData.pendingStamps - 1,
    vouchers: babyAppData.vouchers + Number(fillsCard),
    fullCardRewardIssued: fillsCard || babyAppData.fullCardRewardIssued,
  })
  return { added: saved, saved, voucherIssued: saved && fillsCard }
}

export function startNewStampCard() {
  if (babyAppData.stamps < 15) return { reset: false, saved: true }
  const saved = saveNextData({ ...babyAppData, stamps: 0, fullCardRewardIssued: false })
  return { reset: saved, saved }
}

export function createTask(title) {
  const normalizedTitle = typeof title === 'string' ? title.trim() : ''
  if (!normalizedTitle) return { added: false, reason: 'empty' }

  const task = { id: createId(), title: normalizedTitle, completed: false }
  const saved = saveNextData({ ...babyAppData, tasks: [...babyAppData.tasks, task] })
  return saved ? { added: true, task } : { added: false, reason: 'storage' }
}

export function completeTask(id) {
  const taskIndex = babyAppData.tasks.findIndex((task) => task.id === id)
  if (taskIndex === -1) return { completed: false, reason: 'not-found' }
  if (babyAppData.tasks[taskIndex].completed) return { completed: false, reason: 'completed' }
  const tasks = babyAppData.tasks.map((task, index) =>
    index === taskIndex ? { ...task, completed: true } : task,
  )
  const saved = saveNextData({ ...babyAppData, tasks, pendingStamps: babyAppData.pendingStamps + 1 })
  return saved ? { completed: true } : { completed: false, reason: 'storage' }
}

export function deleteTask(id) {
  if (!babyAppData.tasks.some((task) => task.id === id)) return false
  return saveNextData({
    ...babyAppData,
    tasks: babyAppData.tasks.filter((task) => task.id !== id),
  })
}

export function createReward(title) {
  const normalizedTitle = typeof title === 'string' ? title.trim() : ''
  if (!normalizedTitle) return { added: false, reason: 'empty' }
  const reward = { id: createId(), title: normalizedTitle }
  const saved = saveNextData({ ...babyAppData, rewards: [...babyAppData.rewards, reward] })
  return saved ? { added: true } : { added: false, reason: 'storage' }
}

export function deleteReward(id) {
  if (!babyAppData.rewards.some((reward) => reward.id === id)) return false
  return saveNextData({ ...babyAppData, rewards: babyAppData.rewards.filter((reward) => reward.id !== id) })
}

export function redeemReward(id) {
  const reward = babyAppData.rewards.find((item) => item.id === id)
  if (!reward) return { redeemed: false, reason: 'not-found' }
  if (babyAppData.vouchers < 1) return { redeemed: false, reason: 'no-voucher' }
  const redemption = { id: createId(), title: reward.title, redeemedAt: new Date().toISOString() }
  const saved = saveNextData({
    ...babyAppData,
    vouchers: babyAppData.vouchers - 1,
    redemptions: [redemption, ...babyAppData.redemptions],
  })
  return saved ? { redeemed: true } : { redeemed: false, reason: 'storage' }
}
