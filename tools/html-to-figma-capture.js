/*
 * HTML to Figma layout capture — run in a page's browser DevTools console.
 * It downloads a deterministic snapshot of computed geometry and styles.
 */
(() => {
  const px = (value) => Number.parseFloat(value) || 0;
  const visible = (element, style, box) =>
    style.display !== "none" && style.visibility !== "hidden" && px(style.opacity) > 0 && box.width >= 0.5 && box.height >= 0.5;
  const color = (value) => value || "rgba(0, 0, 0, 0)";
  const named = (element) => {
    const id = element.id ? `#${element.id}` : "";
    const className = typeof element.className === "string" && element.className.trim()
      ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
    return `${element.tagName.toLowerCase()}${id}${className}`.slice(0, 80);
  };
  const styleOf = (style) => ({
    display: style.display, position: style.position, overflow: style.overflow,
    backgroundColor: color(style.backgroundColor), borderColor: color(style.borderTopColor), borderWidth: style.borderTopWidth,
    borderRadius: style.borderTopLeftRadius, paddingTop: style.paddingTop, paddingRight: style.paddingRight,
    paddingBottom: style.paddingBottom, paddingLeft: style.paddingLeft, flexDirection: style.flexDirection,
    flexWrap: style.flexWrap, gap: style.gap, justifyContent: style.justifyContent, alignItems: style.alignItems,
    color: color(style.color), fontFamily: style.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
    fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight === "normal" ? "0" : style.lineHeight,
    letterSpacing: style.letterSpacing === "normal" ? "0" : style.letterSpacing, textAlign: style.textAlign,
  });
  const directText = (element) => [...element.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).join(" ");
  // SVG masks and clip paths are defined through internal IDs. Keep the whole
  // SVG tree together and inline computed paint properties so CSS classes do
  // not disappear when it leaves the browser document.
  const serializeSvg = (svg) => {
    const clone = svg.cloneNode(true);
    const sourceNodes = [svg, ...svg.querySelectorAll("*")];
    const cloneNodes = [clone, ...clone.querySelectorAll("*")];
    sourceNodes.forEach((source, index) => {
      const target = cloneNodes[index];
      if (!target) return;
      const style = getComputedStyle(source);
      ["fill", "stroke", "stroke-width", "opacity", "fill-opacity", "stroke-opacity", "stop-color", "stop-opacity", "clip-path", "mask"].forEach((property) => {
        const value = style.getPropertyValue(property);
        if (value && value !== "none" && value !== "normal") target.style.setProperty(property, value);
      });
    });
    return clone.outerHTML;
  };
  const capture = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const box = { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
    if (!visible(element, style, box)) return null;
    if (element instanceof SVGSVGElement) {
      return { kind: "svg", tag: "svg", name: named(element), box, style: styleOf(style), svg: serializeSvg(element) };
    }
    const item = { kind: "element", tag: element.tagName.toLowerCase(), name: named(element), box, style: styleOf(style), children: [] };
    const text = directText(element);
    if (text) item.children.push({ kind: "text", name: "Text", text, box: { ...box }, style: styleOf(style) });
    for (const child of element.children) {
      const captured = capture(child);
      if (captured) item.children.push(captured);
    }
    return item;
  };
  const root = capture(document.body);
  const payload = { version: 1, capturedAt: new Date().toISOString(), url: location.href, viewport: { width: innerWidth, height: innerHeight, devicePixelRatio }, root };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `figma-layout-${Date.now()}.json` });
  link.click(); URL.revokeObjectURL(link.href);
  console.info("HTML-to-Figma snapshot downloaded", { nodes: document.querySelectorAll("*").length, payload });
})();
