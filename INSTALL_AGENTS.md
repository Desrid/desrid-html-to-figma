# Install Desrid HTML to Figma in AI agents

Desrid HTML to Figma is a standard local `stdio` MCP server. The same server works with Codex, Claude Desktop, Claude Code, Cursor, Windsurf, Cline, Roo Code, VS Code integrations, and other clients that support local MCP servers.

## Shared prerequisites

- Node.js 18 or newer
- Figma Desktop
- A stable clone of this repository for the Figma development plugin

```bash
git clone https://github.com/Desrid/desrid-html-to-figma.git
cd desrid-html-to-figma
npm install
npm run build:win
```

In Figma Desktop, import `src/claude_mcp_plugin/manifest.json` through **Plugins → Development → Import plugin from manifest…**. Start the bridge with `npm run socket`, open the Figma plugin, click **Connect bridge**, and keep the bridge running while an agent works.

## Codex from the Git repository

```bash
codex plugin marketplace add Desrid/desrid-html-to-figma --ref main
codex plugin add desrid-html-to-figma@desrid-html-to-figma
```

Start a new Codex task after installation. See `INSTALL_CODEX.md` for the full flow.

## Claude Desktop

Download `desrid-html-to-figma.dxt` from the repository's GitHub Releases page and open it with Claude Desktop. The DXT contains the same MCP server. The Figma development plugin and bridge steps above are still required.

## Claude Code and other MCP clients

Clients that accept a local MCP JSON file can use the repository root `.mcp.json`. For a configuration that resolves the server directly from GitHub, use:

```json
{
  "mcpServers": {
    "desrid_html_to_figma": {
      "command": "npx",
      "args": [
        "--yes",
        "--package=git+https://github.com/Desrid/desrid-html-to-figma.git",
        "desrid-html-to-figma-server"
      ]
    }
  }
}
```

On Windows, use `npx.cmd` if the client does not resolve `npx` automatically. Clients with a GUI for MCP servers should receive the same command and argument list as separate fields.

For a pinned, reproducible installation, append a tag or commit to the Git package spec, for example `git+https://github.com/Desrid/desrid-html-to-figma.git#v1.1.1`.

## Update

- Codex marketplace: `codex plugin marketplace upgrade desrid-html-to-figma`, then reinstall the plugin.
- Git clone: `git pull`, `npm install`, and `npm run build:win`.
- Git-backed `npx`: pin a new release tag or clear the client's package cache if it keeps an older build.

## Architecture

The agent talks MCP over stdio to `dist/talk_to_figma_mcp/server.cjs`. That process talks WebSocket to the local bridge on port 3055. The bridge relays commands to the Figma development plugin. No Claude- or Codex-specific implementation is used for the design operations themselves.
