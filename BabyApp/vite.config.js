import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// Vite 設定檔的官方參考文件：https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 專案網站需帶上儲存庫路徑作為部署基底。
  base: '/Baby_NoteApp/',
  // 啟用 Vue 單檔元件（.vue）的編譯支援。
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/Baby_NoteApp/',
        name: 'BabyApp',
        short_name: 'BabyApp',
        description: '以 iPhone 使用體驗為核心的經期日曆與集點應用程式。',
        theme_color: '#faf5ee',
        background_color: '#faf5ee',
        display: 'standalone',
        start_url: '/Baby_NoteApp/',
        scope: '/Baby_NoteApp/',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  resolve: {
    alias: {
      // 讓程式可用 @/ 開頭的路徑引用 src 內檔案。
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
