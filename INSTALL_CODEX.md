# Desrid tools — Codex

Codex can install this repository as a Git-backed plugin marketplace. The repository contributes two independent skills:

- `desrid-html-to-figma` for measured HTML-to-Figma work through the bundled MCP server;
- `prototype-design-system-migrator` for conservative design-system audits and migrations of existing web prototypes.

## Install from GitHub

```bash
codex plugin marketplace add Desrid/desrid-html-to-figma --ref main
codex plugin add desrid-html-to-figma@desrid-html-to-figma
```

Then start a new Codex task. The plugin exposes all skill folders under `skills/` and contributes the `desrid_html_to_figma` MCP server.

To update later:

```bash
codex plugin marketplace upgrade desrid-html-to-figma
codex plugin add desrid-html-to-figma@desrid-html-to-figma
```

## Use Prototype Design System Migrator

This skill does not require Figma or the MCP bridge. Start conservatively:

```text
$prototype-design-system-migrator audit this existing prototype in preserve mode.
```

The default mode is `audit-only`; production UI must not be edited. Later modes are `plan`, `bootstrap-foundation`, `pilot-migration`, `rollout`, and `qa-only`.

For a project-local copy shared with Claude Code, clone the repository and run:

```bash
node skills/prototype-design-system-migrator/scripts/install-skill.mjs \
  --agent both \
  --scope project \
  --target /path/to/prototype
```

## Connect Figma for HTML-to-Figma work

Node.js 18+ and Figma Desktop are required only for the HTML-to-Figma capability.

1. Clone or download this repository so the Figma development plugin has a stable local path.
2. In Figma Desktop choose **Plugins → Development → Import plugin from manifest…**.
3. Select `src/claude_mcp_plugin/manifest.json` from the clone.
4. Run `start-figma-socket.cmd` and leave it open.
5. Open **Plugins → Development → Desrid HTML to Figma** in Figma.
6. Click **Connect bridge** and give the channel ID to Codex.

The Figma development plugin and the local WebSocket bridge are required because a Git-installed agent plugin cannot modify a Figma document directly.

## Local fallback

If the marketplace is unavailable, clone the repository and point any MCP client at the root `.mcp.json`. The legacy `scripts/install-codex.cmd` path remains available for a local checkout. The portable design-system skill can be copied independently with its installer and does not depend on MCP configuration.
