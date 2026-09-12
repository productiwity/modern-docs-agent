# Compact calls and assets

## Retain source across calls

In orchestration environments with fresh JavaScript isolates, a const does not survive the next call. Use the environment's persistent store/load helpers, or validate and save in the same call. These examples use functions.exec helpers; adapt them to your client's equivalent rather than assuming they exist everywhere.

Discover only the needed tools. In functions.exec, return matching names first:

```javascript
text(ALL_TOOLS.filter(t => /modern_docs_document_(create|validate|update)$/.test(t.name)).map(t => t.name));
```

Store the exact intended bundle and the returned document ID/version. The source below is deliberately small to demonstrate orchestration, not a design template:

```javascript
store('brief-source', {
  html: '<main class="brief"><h1>Project brief</h1><p>Start with one focused pilot.</p></main>',
  css: '.brief{max-width:900px;margin:0 auto;padding:32px;color:#172b3a;background:#fffdf6}',
  javascript: null,
  settings: {}
});
```

After discovering the tool schemas, use the actual tool names and returned IDs:

```javascript
const source = load('brief-source');
const documentId = load('brief-document-id');
const version = load('brief-draft-version');
const result = await tools.mcp__codex_apps__modern_docs_document_validate({ documentId, source });
const checked = result.structuredContent ?? JSON.parse(result.content.find(c => c.type === 'text').text);
text(checked);
if (checked.valid) {
  const saved = await tools.mcp__codex_apps__modern_docs_document_update({
    documentId, expectedDraftVersion: version,
    operationId: 'brief-first-save-unique-to-this-task', source
  });
  text(saved.structuredContent ?? saved.content);
}
```

On diagnostics, change the stored source, validate again and use a new mutation key for changed input. On a version conflict, read the current source and merge the intended edit before retrying. Never regenerate source after successful validation merely to send the save call.

## Edit the canonical bundle, not a rewritten copy

After the first save, replace the stored authoring bundle with the server's canonical source before editing. This example changes one sentence without retyping the rest of the document or losing generated IDs. Use the actual discovered tool names:

```javascript
const result = await tools.mcp__codex_apps__modern_docs_document_read({
  documentId: load('brief-document-id'), includeSource: true
});
if (result.isError) throw new Error('Read failed; do not edit the old bundle');
const read = result.structuredContent ?? JSON.parse(result.content.find(c => c.type === 'text').text);
if (typeof read.html !== 'string' || typeof read.css !== 'string' || !read.settings) {
  throw new Error('Canonical source is missing; inspect this result before editing');
}
store('brief-source', { html: read.html, css: read.css, javascript: read.javascript, settings: read.settings });
store('brief-draft-version', read.draftVersion);
const source = load('brief-source');
const before = 'Start with one focused pilot.';
const after = 'Start with a two-week pilot.';
if (source.html.split(before).length !== 2) throw new Error('Expected exactly one matching sentence; inspect the current HTML');
source.html = source.html.replace(before, after);
if (source.html.includes(before) || !source.html.includes(after)) throw new Error('Correction did not apply');
store('brief-source', source);
```

Validate this stored bundle, then pass that same bundle to update as shown above. A failed replacement is not a reason to rewrite the whole source. For a CSS fix, change only the relevant CSS value and preserve HTML and JavaScript. For an uncertain transport outcome, retry identical input with the original operationId. If the save succeeded but preview failed, source is already saved: inspect the returned build diagnostics before any further mutation.

Print structuredContent once, using text content only when structured content is absent. Keep a source read in storage and print only the fields needed for your next decision, such as draftVersion, role and currentRevisionId. Do not print the full catalog or both copies of an MCP result.

When only checking status, call document_read with includeSource:false. It returns no HTML, CSS, JavaScript or settings. preview is null before a draft build; otherwise it contains buildId, draftVersion, status and isCurrent. This cannot replace a full source read before editing or merging a version conflict.

## Upload small reusable images

List existing assets first. Upload complete base64 without whitespace or a data-URL prefix. The MCP limit is 4,000,000 encoded characters; terminal output limits may be much smaller. Inspect the result for truncation before sending it to MCP. A permissive decoder can accept truncated input, so check the expected byte count too.

When Node is available, encode with Buffer.from(bytes).toString('base64'); do not assume btoa exists in the orchestration runtime. If bytes must cross a terminal-output boundary, resize/compress first or read bounded chunks and combine them programmatically without printing their contents to the conversation. Never pass truncation markers to the upload tool. Use the web upload if the file cannot fit the available transport.

In a Node runtime with filesystem access, keep encoding and the upload in the same process when the client supports it:

```javascript
const bytes = await readFile(filePath); // from node:fs/promises
const base64 = bytes.toString('base64');
if (base64.length > 4_000_000) throw new Error('Compress or resize before uploading');
if (Buffer.from(base64, 'base64').byteLength !== bytes.byteLength) throw new Error('Incomplete asset');
// Pass base64 directly to the upload call. Print only the returned asset ID and byteSize.
```

If using bounded chunks across a tool boundary, retain the original byte count, combine all chunks in order, and check the decoded byte count again after transfer. A successful check before transfer does not detect later truncation. Do not print the payload to ask the model to reconstruct it.

SVG needs a positive viewBox. Explicit positive width and height are recommended; omitted dimensions are derived from viewBox and any supplied dimension. RGB/HSL colors are normalized to hex. It supports geometric shapes and paths, not visible text, images, scripts or embedded styles. title and desc may contain plain text only, never nested tags. Export visible text as paths or use PNG. Omit the XML declaration. Start from this complete small SVG and adapt the shapes:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
  <title>Green mountain mark</title>
  <desc>A green triangular mountain on a cream background.</desc>
  <rect width="160" height="120" fill="#fffdf6"/>
  <path d="M20 100 L80 20 L140 100 Z" fill="#245c43"/>
</svg>
```

Use the returned asset ID as asset:<asset-id> in an img src with descriptive alt text. Never use storage keys or private provider URLs. For failures, fix all returned diagnostics before retrying with a new operationId. SVG inspection returns up to 50 independent errors, but malformed XML or resource limits can stop inspection early. invalid_base64, unsupported_svg_element and media_type_mismatch require different corrections.
