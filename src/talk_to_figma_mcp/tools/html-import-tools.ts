import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToFigma } from "../utils/websocket";
import { coerceJson } from "../utils/schema-helpers";

/** Imports a computed-style browser capture without LLM geometry guesses. */
export function registerHtmlImportTools(server: McpServer): void {
  server.tool(
    "import_html_snapshot",
    "Create an editable Figma hierarchy from a computed-style HTML snapshot. Snapshots may include a rendered pixel-reference layer for CSS masks, pseudo-elements and effects that Figma cannot express as editable nodes.",
    {
      snapshot: coerceJson(z.unknown()).describe("JSON produced by tools/html-to-figma-capture.js"),
      parentId: z.string().optional().describe("Optional Figma page or frame ID. Defaults to the current page."),
      x: z.coerce.number().optional().describe("Canvas X position of the imported root; defaults to 0."),
      y: z.coerce.number().optional().describe("Canvas Y position of the imported root; defaults to 0."),
      name: z.string().optional().describe("Optional name for the imported root frame."),
    },
    async ({ snapshot, parentId, x, y, name }) => {
      try {
        const result = await sendCommandToFigma("import_html_snapshot", { snapshot, parentId, x, y, name });
        const typed = result as { id: string; importedNodes: number; skippedNodes: number; warnings: string[] };
        return { content: [{ type: "text", text: `Imported HTML snapshot as ${typed.id}: ${typed.importedNodes} editable nodes, ${typed.skippedNodes} skipped.${typed.warnings.length ? ` Warnings: ${typed.warnings.join(" ")}` : ""}` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error importing HTML snapshot: ${error instanceof Error ? error.message : String(error)}` }] };
      }
    }
  );
}
