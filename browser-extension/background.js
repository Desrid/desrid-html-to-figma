async function ensureOffscreenDocument() {
  const url = chrome.runtime.getURL("offscreen.html");
  const contexts = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"], documentUrls: [url] });
  if (contexts.length === 0) await chrome.offscreen.createDocument({ url: "offscreen.html", reasons: ["BLOBS"], justification: "Create a local JSON download containing the page capture." });
}

chrome.runtime.onMessage.addListener((message, _sender, respond) => {
  if (message.type !== "DESRID_DOWNLOAD") return;
  (async () => {
    await ensureOffscreenDocument();
    respond(await chrome.runtime.sendMessage({ type: "DESRID_WRITE_DOWNLOAD", payload: message.payload }));
  })().catch((error) => respond({ ok: false, error: error.message }));
  return true;
});
