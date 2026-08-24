# Desrid HTML to Figma — Claude Desktop (опционально)

Основная инструкция для Codex: [`INSTALL_CODEX.md`](INSTALL_CODEX.md). Этот сценарий нужен только если команда также использует Claude Desktop.

## 1. Нативная установка MCP для Claude Desktop

Запустите `npm.cmd run build:dxt` в корне проекта. Полученный файл `desrid-html-to-figma.dxt` — нативный пакет Claude Desktop: двойной клик открывает системный экран установки расширения.

## 2. Установка Figma-плагина

Figma требует отдельного developer-import для локальных плагинов. В Figma Desktop выберите **Plugins → Development → Import plugin from manifest…** и укажите `src/claude_mcp_plugin/manifest.json`. Затем запустите **Desrid HTML to Figma** из меню Plugins.

## 3. Первый перенос

1. Запустите `start-figma-socket.cmd` и не закрывайте его.
2. В окне Figma-плагина нажмите **Connect bridge**, скопируйте channel ID.
3. В Claude вызовите `join_channel` с этим ID.
4. На нужной HTML-странице выполните `tools/html-to-figma-capture.js` в DevTools Console.
5. Передайте содержимое JSON в `import_html_snapshot`.

После первого импорта сравнивайте Figma export и исходную страницу при одинаковом viewport. Это обязательный QA-шаг для pixel-perfect результата.
