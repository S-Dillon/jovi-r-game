@echo off
title R Quest
cd /d "%~dp0"
echo Starting R Quest...
echo A browser window will open. Keep this window open while you play.
echo Close this window to stop the game.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\server.ps1"
pause
