# HTML to Figma: measured, editable imports

This workflow creates editable Figma frames and text from the page's actual browser layout. It does not infer geometry from HTML source or a screenshot.

## Team workflow

1. For pages you control, open the page at the required breakpoint, wait for fonts, images and animations to settle, then run [`tools/html-to-figma-capture.js`](tools/html-to-figma-capture.js) in DevTools Console.
2. For pages without source access, install the unpacked folder `browser-extension` in Chrome's `chrome://extensions` page, then use **Desrid HTML to Figma Capture**. It captures the active page without adding a tag or changing source code.
3. In the Claude/Codex session connected to Figma, join the desired bridge channel and call `import_html_snapshot` with the JSON file's contents. Pass canvas `x`/`y` if needed.
4. Compare the source and Figma export at the same viewport. The root frame is selected after import for immediate review.

## Fidelity contract

The importer keeps measured boxes for ordinary layout, maps `display:flex` to Figma Auto Layout (direction, padding, gap, alignment and wrapping), and creates editable text with captured size, alignment, color, font family, weight, line-height and letter-spacing. It maps flat background, border and corner-radius styles. Inline SVG is imported as editable vectors; its complete `<defs>` tree, including `mask`, `clipPath` and compound paths, is kept together. Extension captures include a locked rendered reference layer for CSS masks, pseudo-elements and compositing effects; toggle that layer only after visual QA.

CSS Grid, pseudo-elements, CSS gradients/filters, transforms, canvas, video, web fonts unavailable in Figma, image fills and complex rich text need a review pass; they are intentionally not flattened into a screenshot. This preserves a truthful editable result instead of pretending those features are pixel-perfect.
