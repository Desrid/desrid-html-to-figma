---
name: desrid-html-to-figma
description: Connect an AI agent to the Desrid Figma bridge, capture measured HTML geometry, import it into Figma, and verify the editable result. Use for HTML-to-Figma transfer, Figma document inspection, or edits through the Desrid MCP tools.
---

# Desrid HTML to Figma

Use the bundled `desrid_html_to_figma` MCP server for Figma reads and writes.

## Connection preflight

1. Confirm Node.js 18 or newer is available.
2. Check `http://localhost:3055/status` before using write tools.
3. If the bridge is offline, ask the user to run `start-figma-socket.cmd` from a stable clone of the repository, or run `node dist/socket-node.cjs` from the plugin root when the host permits local background processes.
4. Ask the user to open the **Desrid HTML to Figma** development plugin in Figma and click **Connect bridge**.
5. Join the exact channel ID returned by the Figma plugin. Do not guess or reuse an old channel.
6. Read document information before the first write and confirm the intended Figma page or selection.

## HTML import workflow

1. Open the source page at the agreed viewport and state.
2. Capture measured geometry with `tools/html-to-figma-capture.js` or the bundled browser extension.
3. Use a unique capture/import ID for each page or viewport.
4. Call `import_html_snapshot` with the captured payload and poll until the operation reports completion.
5. Keep repeated UI structures editable. Use Auto Layout where it preserves the measured result; do not flatten the page into a bitmap.

## Verification

Before reporting completion, verify the imported frame dimensions, visible overflow, text hierarchy, key spacing, and editable child structure. Treat a completed import response as transport evidence, not visual acceptance. Report any missing fonts, inaccessible assets, disconnected Figma plugin, or blocked browser capture explicitly.
