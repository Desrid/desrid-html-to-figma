import http from "node:http";
import { WebSocket, WebSocketServer } from "ws";

type Client = WebSocket & { desrid?: { id: string; channels: Set<string> } };

const channels = new Map<string, Set<Client>>();
const requests = new Map<string, Client>();
const stats = { totalConnections: 0, activeConnections: 0, messagesSent: 0, messagesReceived: 0 };

const send = (client: Client, payload: unknown) => {
  if (client.readyState === WebSocket.OPEN) { client.send(JSON.stringify(payload)); stats.messagesSent++; }
};

const server = http.createServer((req, res) => {
  if (req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify({ status: "running", uptime: process.uptime(), stats, channels: channels.size }));
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
  res.end("Desrid HTML to Figma bridge is running.");
});

const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (request, socket, head) => wss.handleUpgrade(request, socket, head, (ws) => wss.emit("connection", ws, request)));

wss.on("connection", (raw) => {
  const client = raw as Client;
  client.desrid = { id: `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, channels: new Set() };
  stats.totalConnections++; stats.activeConnections++;
  send(client, { type: "system", message: "Join a channel to start communicating with Figma" });

  client.on("message", (buffer) => {
    stats.messagesReceived++;
    let data: any;
    try { data = JSON.parse(buffer.toString()); } catch { send(client, { type: "error", message: "Invalid JSON" }); return; }
    const channel = data.channel;

    if (data.type === "join") {
      if (!channel || typeof channel !== "string") { send(client, { type: "error", message: "Channel name is required" }); return; }
      if (!channels.has(channel)) channels.set(channel, new Set());
      channels.get(channel)!.add(client); client.desrid!.channels.add(channel);
      send(client, { type: "system", channel, message: { id: data.id, result: `Connected to channel: ${channel}` } });
      return;
    }

    if (!channel || !channels.get(channel)?.has(client)) { send(client, { type: "error", message: "You must join a channel first" }); return; }
    const message = data.message || {};
    const requestId = message.id || data.id;
    const isResponse = message.result !== undefined || message.error !== undefined;

    if (isResponse && requestId && requests.has(requestId)) {
      send(requests.get(requestId)!, { type: "broadcast", channel, sender: "User", message });
      requests.delete(requestId);
      return;
    }
    if (data.type === "progress_update" && requestId && requests.has(requestId)) { send(requests.get(requestId)!, data); return; }
    if (message.command && requestId) requests.set(requestId, client);

    for (const peer of channels.get(channel)!) {
      if (peer !== client) send(peer, { type: "broadcast", channel, sender: "User", message });
    }
  });

  client.on("close", () => {
    stats.activeConnections--;
    for (const channel of client.desrid?.channels || []) {
      const members = channels.get(channel); if (!members) continue;
      members.delete(client); if (members.size === 0) channels.delete(channel);
    }
    for (const [id, owner] of requests) if (owner === client) requests.delete(id);
  });
});

server.listen(3055, "127.0.0.1", () => console.log("Desrid HTML to Figma bridge listening on http://localhost:3055"));
