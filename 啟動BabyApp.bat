@echo off
setlocal
title BabyApp - Frontend
rem 將工作目錄切換到專案資料夾，確保 npm 指令在正確位置執行。
cd /d "%~dp0BabyApp"

rem 若專案路徑不正確，顯示錯誤並保留視窗供檢查。
if not exist package.json (
  echo Cannot find BabyApp\package.json.
  goto failed
)

rem 確認電腦已安裝 Node.js，否則無法執行 Vite。
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js, then run this file again.
  goto failed
)

rem 第一次啟動時先安裝依賴；後續啟動可直接略過。
if not exist node_modules (
  echo Installing BabyApp dependencies...
  call npm install
  if errorlevel 1 goto failed
)

rem 啟動 Vite 開發伺服器並自動開啟瀏覽器。
call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 goto failed
goto :eof

:failed
echo.
pause
exit /b 1
