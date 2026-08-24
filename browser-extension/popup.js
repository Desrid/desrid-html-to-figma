const status = document.getElementById("status");
document.getElementById("capture").addEventListener("click", async () => {
  status.textContent = "Захватываю страницу…";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    const screenshot = document.getElementById("reference").checked ? await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }) : null;
    let payload;
    try {
      payload = await chrome.tabs.sendMessage(tab.id, { type: "DESRID_CAPTURE", screenshot });
    } catch (error) {
      if (!String(error.message).includes("Receiving end does not exist")) throw error;
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
      payload = await chrome.tabs.sendMessage(tab.id, { type: "DESRID_CAPTURE", screenshot });
    }
    const download = await chrome.runtime.sendMessage({ type: "DESRID_DOWNLOAD", payload });
    if (!download.ok) throw new Error(download.error || "Download failed");
    status.textContent = "Snapshot скачан. Перетащите JSON в чат Codex.";
  } catch (error) { status.textContent = `Не удалось захватить страницу: ${error.message}`; }
});
