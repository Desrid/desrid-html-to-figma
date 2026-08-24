(() => {
  const px = (value) => Number.parseFloat(value) || 0;
  const visible = (style, box) => style.display !== "none" && style.visibility !== "hidden" && px(style.opacity) > 0 && box.width >= .5 && box.height >= .5;
  const name = (element) => {
    const id = element.id ? `#${element.id}` : "";
    const classes = typeof element.className === "string" && element.className ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
    return `${element.tagName.toLowerCase()}${id}${classes}`.slice(0, 80);
  };
  const styleOf = (style) => ({
    display:style.display, position:style.position, overflow:style.overflow, backgroundColor:style.backgroundColor, borderColor:style.borderTopColor, borderWidth:style.borderTopWidth, borderRadius:style.borderTopLeftRadius,
    paddingTop:style.paddingTop, paddingRight:style.paddingRight, paddingBottom:style.paddingBottom, paddingLeft:style.paddingLeft, flexDirection:style.flexDirection, flexWrap:style.flexWrap, gap:style.gap, justifyContent:style.justifyContent, alignItems:style.alignItems,
    color:style.color, fontFamily:style.fontFamily.split(",")[0].replace(/["']/g, "").trim(), fontSize:style.fontSize, fontWeight:style.fontWeight, lineHeight:style.lineHeight === "normal" ? "0" : style.lineHeight, letterSpacing:style.letterSpacing === "normal" ? "0" : style.letterSpacing, textAlign:style.textAlign
  });
  const serializeSvg = (svg) => {
    const clone = svg.cloneNode(true); const source = [svg, ...svg.querySelectorAll("*")]; const target = [clone, ...clone.querySelectorAll("*")];
    source.forEach((node, index) => { const copy = target[index]; if (!copy) return; const css = getComputedStyle(node); ["fill","stroke","stroke-width","opacity","fill-opacity","stroke-opacity","stop-color","stop-opacity","clip-path","mask"].forEach((property) => { const value = css.getPropertyValue(property); if (value && value !== "none" && value !== "normal") copy.style.setProperty(property, value); }); });
    return clone.outerHTML;
  };
  const directText = (element) => [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.replace(/\s+/g," ").trim()).filter(Boolean).join(" ");
  const capture = (element) => {
    const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); const box = { x:rect.left + scrollX, y:rect.top + scrollY, width:rect.width, height:rect.height };
    if (!visible(style, box)) return null;
    if (element instanceof SVGSVGElement) return { kind:"svg", tag:"svg", name:name(element), box, style:styleOf(style), svg:serializeSvg(element) };
    const item = { kind:"element", tag:element.tagName.toLowerCase(), name:name(element), box, style:styleOf(style), children:[] };
    const text = directText(element); if (text) item.children.push({ kind:"text", name:"Text", text, box:{...box}, style:styleOf(style) });
    for (const child of element.children) { const childSnapshot = capture(child); if (childSnapshot) item.children.push(childSnapshot); }
    return item;
  };
  chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message.type !== "DESRID_CAPTURE") return;
    const root = capture(document.body);
    const payload = { version:2, capturedAt:new Date().toISOString(), url:location.href, viewport:{ width:innerWidth, height:innerHeight, scrollX, scrollY, devicePixelRatio }, root };
    if (message.screenshot) payload.pixelReference = { dataUrl:message.screenshot, width:innerWidth, height:innerHeight, opacity:1, scope:"viewport", note:"Rendered reference for masks, pseudo-elements and compositing effects" };
    respond(payload);
  });
})();
