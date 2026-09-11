@echo off
chcp 65001 >nul
title 本地网页服务
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-local.ps1"
if errorlevel 1 (
  echo.
  echo 启动失败，按任意键关闭此窗口。
  pause >nul
)
