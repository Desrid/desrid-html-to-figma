@echo off
REM Запуск WebSocket-моста между Codex/Claude и плагином Figma (порт 3055).
REM Держи это окно открытым, пока работаешь с редактированием макетов Figma.
cd /d "%~dp0"
echo Запускаю Figma WebSocket сервер на http://localhost:3055 ...
node.exe dist\socket-node.cjs
pause
