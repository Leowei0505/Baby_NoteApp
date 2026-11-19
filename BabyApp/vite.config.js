import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 設定檔的官方參考文件：https://vite.dev/config/
export default defineConfig({
  // 啟用 Vue 單檔元件（.vue）的編譯支援。
  plugins: [vue()],
  resolve: {
    alias: {
      // 讓程式可用 @/ 開頭的路徑引用 src 內檔案。
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
