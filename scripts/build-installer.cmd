@echo off
setlocal
cd /d "%~dp0.."
call npm.cmd run build:dxt
if errorlevel 1 exit /b %errorlevel%
echo.
echo Installer created: %CD%\desrid-html-to-figma.dxt
endlocal
