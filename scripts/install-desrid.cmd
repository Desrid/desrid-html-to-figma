@echo off
setlocal
cd /d "%~dp0.."
if not exist "desrid-html-to-figma.dxt" (
  echo Building the Desrid installer...
  call scripts\build-installer.cmd
  if errorlevel 1 exit /b %errorlevel%
)
echo Opening native Claude Desktop installer...
start "" "%CD%\desrid-html-to-figma.dxt"
echo Then import src\claude_mcp_plugin\manifest.json in Figma Desktop.
endlocal
