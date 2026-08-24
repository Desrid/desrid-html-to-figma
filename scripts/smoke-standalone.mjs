import { copyFile, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const tempRoot = await mkdtemp(path.join(os.tmpdir(), "desrid-html-to-figma-"));
const source = path.resolve("dist/talk_to_figma_mcp/server.cjs");
const standalone = path.join(tempRoot, "server.cjs");

try {
  await copyFile(source, standalone);

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [standalone],
    cwd: tempRoot,
    stderr: "pipe",
  });
  const client = new Client(
    { name: "desrid-standalone-smoke", version: "1.0.0" },
    { capabilities: {} },
  );

  const stderr = [];
  transport.stderr?.on("data", (chunk) => stderr.push(chunk.toString()));

  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    const requiredTools = ["join_channel", "get_document_info", "import_html_snapshot"];
    const names = new Set(tools.map((tool) => tool.name));
    const missing = requiredTools.filter((name) => !names.has(name));
    if (missing.length > 0) {
      throw new Error(`Standalone MCP is missing tools: ${missing.join(", ")}`);
    }
    console.log(`Standalone MCP smoke passed: ${tools.length} tools`);
  } catch (error) {
    const diagnostics = stderr.join("").trim();
    if (diagnostics) console.error(diagnostics);
    throw error;
  } finally {
    await client.close();
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
