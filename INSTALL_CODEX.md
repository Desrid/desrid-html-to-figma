# Desrid HTML to Figma — Codex

Codex can install this repository as a Git-backed plugin marketplace. Node.js 18+ and Figma Desktop are required.

## Install from GitHub

```bash
codex plugin marketplace add Desrid/desrid-html-to-figma --ref main
codex plugin add desrid-html-to-figma@desrid-html-to-figma
```

Then start a new Codex task. The installed plugin contributes the `desrid_html_to_figma` MCP server and the `desrid-html-to-figma` workflow skill.

To update later:

```bash
codex plugin marketplace upgrade desrid-html-to-figma
codex plugin add desrid-html-to-figma@desrid-html-to-figma
```

## Connect Figma once

1. Clone or download this repository so the Figma development plugin has a stable local path.
2. In Figma Desktop choose **Plugins → Development → Import plugin from manifest…**.
3. Select `src/claude_mcp_plugin/manifest.json` from the clone.
4. Run `start-figma-socket.cmd` and leave it open.
5. Open **Plugins → Development → Desrid HTML to Figma** in Figma.
6. Click **Connect bridge** and give the channel ID to Codex.

The Figma development plugin and the local WebSocket bridge are required because a Git-installed agent plugin cannot modify a Figma document directly.

## Local fallback

If the marketplace is unavailable, clone the repository and point any MCP client at the root `.mcp.json`. The legacy `scripts/install-codex.cmd` path remains available for a local checkout, but the Git marketplace is the recommended Codex installation.
