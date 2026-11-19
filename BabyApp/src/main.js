// 載入整個應用共用的重設樣式與設計色彩。
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 建立 Vue 應用，並在掛載前啟用頁面路由。
const app = createApp(App)

app.use(router)

// 將 Vue 應用掛載到 index.html 的 #app 節點。
app.mount('#app')
