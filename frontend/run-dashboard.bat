@echo off
title College Engagement Dashboard
echo ========================================================
echo Starting College Engagement Dashboard...
echo ========================================================
cd /d "%~dp0"
start http://localhost:5173
npm run dev
pause
