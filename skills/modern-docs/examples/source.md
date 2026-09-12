# Supported source patterns

Modern Docs accepts a constrained HTML fragment with exactly one main root, not an entire web page. Use classes for styling; do not emit html, head, body, style, script, inline style attributes, or ordinary id attributes. New elements can omit data-md-id. Keep supplied IDs from the source you are editing.

Common supported tags include main, section, header, footer, article, aside, div, span, headings, p, strong, em, b, i, time, cite, lists, a, figure, img, blockquote, and tables. time accepts datetime. Tables need explicit tbody/tr/td structure. Tags such as button, input, label, details, summary, dl, canvas, and inline svg are not part of this profile. Use supported sections for expandable content and inspected SVG assets for diagrams. scroll-margin-top is supported on section targets.

Use main or a class instead of body or :root. Use grid/flex, bounded widths, and width-based media queries. Avoid pseudo-elements and generated content. Set visual state with classes instead of element.style. Check unfamiliar CSS or JavaScript with document_validate rather than guessing the whole accepted grammar.

Supported additions include `.card:not(.hidden)`, `:is(.card,.note)`, `:where(.muted)`, and `text-wrap:balance`. Every selector inside these wrappers must itself be supported. For live status text, use `<p role="status" aria-live="polite">Ready</p>`. External font imports and @font-face remain unsupported; use `font-family:system-ui,sans-serif` or another system font stack.

This small bundle validates without any supplied IDs:

```json
{
  "html": "<main class=\"brief\"><header><p>Field notes</p><h1>A clear next step</h1></header><section><h2>The decision</h2><p>Start with one focused trial and measure the result.</p></section></main>",
  "css": ".brief{max-width:960px;margin:0 auto;padding:48px 24px;color:#172b3a;background:#fffdf6}h1{font-size:clamp(36px,6vw,72px);line-height:1.05}section{margin-top:40px}@media(max-width:640px){.brief{padding:24px 16px}}",
  "javascript": null,
  "settings": {}
}
```

For interactions, use local event listeners and classList/textContent. The following is a validated keyboard-driven pattern; pair it with visible instructions and a section with class extra. Focus the preview before testing keys:

```javascript
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') document.querySelector('.extra')?.classList.add('visible');
  if (event.key === 'ArrowLeft') document.querySelector('.extra')?.classList.remove('visible');
});
```

Use `.extra{display:none}.extra.visible{display:block}` for the state. For link-based navigation or click controls, use `document_ids_generate` to obtain the referenced target ID, then supply it as data-md-id and use `href="#<returned-id>"`. A hash reference must target a supplied existing ID; do not invent semantic IDs such as #pricing. Add local listeners to the anchor as needed. Do not use network calls, browser storage, innerHTML, or dynamic code evaluation.

## Section links and action controls

For a real document, replace the demonstration target ID below with an ID returned by the server. A section link scrolls inside the document. An action link calls preventDefault so it changes content without scrolling:

```json
{
  "html": "<main class=\"brief\"><nav><a href=\"#01J00000000000000000000001\">Details</a> <a class=\"choose\" href=\"#01J00000000000000000000001\">Choose this option</a></nav><section data-md-id=\"01J00000000000000000000001\"><h1>Details</h1><p class=\"answer\">No option selected.</p></section></main>",
  "css": ".brief{padding:24px}a{color:#245c43}a:focus-visible{outline:2px solid #245c43}",
  "javascript": "document.querySelector('.choose').addEventListener('click', (event) => { event.preventDefault(); document.querySelector('.answer').textContent = 'Option selected.'; });",
  "settings": {}
}
```

## Proportional bars

Use a fixed-height plotting area with labels outside it. Disable bar shrinking. Calculate percentages from a shared maximum; the example compares 20 and 40 on a zero-based scale:

```json
{
  "html": "<main><h1>Orders</h1><div class=\"chart\"><div><div class=\"plot\"><div class=\"bar half\"></div></div><p>Monday: 20</p></div><div><div class=\"plot\"><div class=\"bar full\"></div></div><p>Tuesday: 40</p></div></div><p>Illustrative orders, zero baseline, maximum 40.</p></main>",
  "css": "main{padding:24px}.chart{display:flex;gap:24px}.plot{height:200px;display:flex;align-items:flex-end}.bar{width:60px;flex-shrink:0;background:#245c43}.half{height:50%}.full{height:100%}",
  "javascript": null,
  "settings": {}
}
```

For asset encoding and SVG examples, read [compact calls and assets](compact-calls.md). These examples establish compatible syntax, not the visual ambition of the finished document.
