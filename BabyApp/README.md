# BabyApp

BabyApp 是以 iPhone 手機版面為核心的 Vue Progressive Web App（PWA），提供經期日曆、週期預估與集點任務。

## 功能

- **首頁**：查看集點進度與常用功能入口。
- **集點任務**：按下蓋章按鈕累積印章，集滿 15 枚完成集點卡。
- **經期日曆**：記錄經期開始與結束日期，查看週期進度、易受孕期、排卵日及下次經期預估。
- **手機優先介面**：以窄版手機螢幕為主要設計尺寸，桌面瀏覽器會置中顯示手機寬度版面。
- **可安裝與離線開啟**：支援加入手機主畫面，並快取正式版頁面資源以供離線瀏覽。

週期與排卵資訊依使用者記錄及週期長度估算，僅供個人日期追蹤參考，不作醫療判斷。

## 開發環境

- Node.js：`package.json` 指定 `^22.18.0` 或 `>=24.12.0`
- npm

## 安裝與啟動

```sh
npm install
npm run dev
```

Vite 啟動後，依終端機顯示的網址開啟本機預覽。修改程式時，開發伺服器會自動更新畫面。

## 常用指令

```sh
npm run dev      # 啟動本機開發伺服器
npm run build    # 建置正式版至 dist/
npm run preview  # 預覽正式版建置結果
npm run generate-pwa-assets # 從 public/7.png 重新產生 PWA 圖示
```

## 在手機安裝

網站需透過 HTTPS 提供（本機開發的 `localhost` 例外），手機才能安裝 PWA。部署完成後：

- **iPhone**：用 Safari 開啟網站，點「分享」→「加入主畫面」；若出現「以網頁 App 開啟」選項，請開啟。
- **Android**：用 Chrome 開啟網站，選擇「安裝應用程式」或「加入主畫面」。

PWA 服務工作者會在正式版中啟用。第一次連線載入完成後，已快取的頁面資源可在離線時開啟。週期與集點資料仍只保存在該裝置的瀏覽器本機。

## 專案結構

```text
src/
  components/    共用元件
  composables/   共用日期與本機資料邏輯
  router/        Vue Router 路由設定
  views/         首頁、集點、經期日曆與介紹頁
  assets/        全域樣式與字體
public/          圖片與公開靜態檔案
```

頁面樣式各自放在對應的 CSS 檔案，例如 `HomeView.vue` 使用 `HomeView.css`。

## 資料保存

經期紀錄、週期長度與集點數保存在目前瀏覽器的 `localStorage`，不會自動同步到其他裝置或瀏覽器。清除網站資料也會刪除這些本機紀錄。

## 部署

推送到 `master` 分支後，GitHub Actions 會建置並發布到 GitHub Pages。部署網址為 `https://leowei0505.github.io/Baby_NoteApp/`。

此專案使用 Vue Router HTML5 History 模式；部署流程會將 `index.html` 複製為 `404.html`，讓重新整理子頁路徑時仍能載入應用程式。正式版檔案位於 `dist/`。
