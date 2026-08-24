chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type !== "DESRID_WRITE_DOWNLOAD") return;
  const blob = new Blob([JSON.stringify(message.payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: `desrid-figma-${Date.now()}.json`, saveAs: true }, () => {
    URL.revokeObjectURL(url);
    respond(chrome.runtime.lastError ? { ok: false, error: chrome.runtime.lastError.message } : { ok: true });
  });
  return true;
});
