@echo off
setlocal
set "DESRID_ROOT=%~dp0.."
set "CODEX_CONFIG=%USERPROFILE%\.codex\config.toml"

if not exist "%CODEX_CONFIG%" (
  echo Codex config was not found: %CODEX_CONFIG%
  echo Install and open Codex Desktop once, then run this file again.
  exit /b 1
)

findstr /C:"[mcp_servers.desrid_html_to_figma]" "%CODEX_CONFIG%" >nul
if not errorlevel 1 (
  echo Desrid HTML to Figma is already configured for Codex.
  echo Restart Codex Desktop and use /mcp in a new chat to confirm it.
  exit /b 0
)

>> "%CODEX_CONFIG%" echo.
>> "%CODEX_CONFIG%" echo [mcp_servers.desrid_html_to_figma]
>> "%CODEX_CONFIG%" echo command = 'C:\Program Files\nodejs\node.exe'
>> "%CODEX_CONFIG%" echo args = ['%DESRID_ROOT%\dist\talk_to_figma_mcp\server.js']
>> "%CODEX_CONFIG%" echo cwd = '%DESRID_ROOT%'
>> "%CODEX_CONFIG%" echo startup_timeout_sec = 20
>> "%CODEX_CONFIG%" echo tool_timeout_sec = 300
>> "%CODEX_CONFIG%" echo default_tools_approval_mode = 'prompt'

echo Desrid HTML to Figma was added to Codex.
echo Fully restart Codex Desktop, then type /mcp in a new chat.
endlocal
