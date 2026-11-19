import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 集中管理應用程式的網址與頁面元件對應。
const router = createRouter({
  // 使用網址路徑管理頁面，支援瀏覽器上一頁與深層連結。
  history: createWebHistory(import.meta.env.BASE_URL),
  // 首頁直接載入；關於頁採延遲載入以分開輸出檔案。
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      // 集點頁使用本機印章卡，採路由切換避免載入時增加首頁負擔。
      path: '/points',
      name: 'points',
      component: () => import('../views/PointsView.vue'),
    },
    {
      // 經期日曆與紀錄只保存在目前瀏覽器。
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/PeriodCalendarView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 提供給 main.js 註冊到 Vue 應用。
export default router
