import { reactive } from 'vue'

// 所有頁面共用同一份本機資料，不依賴額外狀態管理套件。
const STORAGE_KEY = 'babyapp.data.v1'
const DEFAULT_DATA = () => ({ periods: [], cycleLengthDays: 28, stamps: 0 })

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

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved || typeof saved !== 'object') return DEFAULT_DATA()

    return {
      periods: Array.isArray(saved.periods) ? saved.periods.filter(isValidPeriod) : [],
      cycleLengthDays: Number.isInteger(saved.cycleLengthDays) && saved.cycleLengthDays > 0
        ? saved.cycleLengthDays
        : 28,
      stamps: Number.isInteger(saved.stamps) ? Math.min(15, Math.max(0, saved.stamps)) : 0,
    }
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
  if (babyAppData.stamps >= 15) return { added: false, saved: true }
  babyAppData.stamps += 1
  return { added: true, saved: persistData() }
}

export function startNewStampCard() {
  if (babyAppData.stamps < 15) return { reset: false, saved: true }
  babyAppData.stamps = 0
  return { reset: true, saved: persistData() }
}
