@echo off
setlocal
chcp 65001 >nul
title BabyApp - Frontend

cd /d "%~dp0BabyApp"
if errorlevel 1 (
  echo Could not open the BabyApp folder.
  goto failed
)

if not exist package.json (
  echo Could not find BabyApp\package.json.
  goto failed
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js, then run this file again.
  goto failed
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is required. Reinstall Node.js with npm, then run this file again.
  goto failed
)

if not exist node_modules\.bin\vite.cmd (
  echo Installing BabyApp dependencies...
  call npm install
  if errorlevel 1 goto failed
)

call npm run dev -- --host 127.0.0.1 --open
if errorlevel 1 goto failed
goto :eof

:failed
echo.
pause
exit /b 1

