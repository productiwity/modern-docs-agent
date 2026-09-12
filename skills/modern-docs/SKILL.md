---
name: modern-docs
description: Create, edit, design, review, share, comment on, and publish Modern Docs documents through the OAuth MCP server. Use for any Modern Docs document or workspace request.
license: MIT
metadata:
  author: Productiwity
  version: "1.4.0"
---

# Modern Docs

Modern Docs is a collaborative document platform for visual and source editing, stable element comments, revisions, private assets, access control, viewer links, and fixed-revision publishing. Use the connected `modern-docs` MCP server for every platform read or change.

This release supports `modern-docs-tools-2`, corrective diagnostics, creation draft versions, metadata-only reads and separate asset tools.

## Updates

Never update this skill automatically. If the user asks to update it, a newer version is known to exist, or the installed skill does not support the server's tool contract, explain why the update is needed and ask the user for explicit approval before running an update command.

After approval, determine the scope from this `SKILL.md` path. A copy inside the current project is project-scoped. A copy in the user's home-level agent or skills directory is global. For a project installation, find the nearest ancestor of this file that contains `skills-lock.json`, set that directory as the command's working directory, then run the project command. Run the global command from any directory.

Project install:

```text
npx -y skills@1.5.23 update modern-docs --project --yes
```

Global install:

```text
npx -y skills@1.5.23 update modern-docs --global --yes
```

After an approved update succeeds, read the installed `SKILL.md` again before continuing. If the user declines, continue with the installed version only when its tool contract is still supported. Otherwise stop and explain that the matching skill version is required.

## Start here

1. Confirm the MCP server is connected through OAuth with `documents:read` and `documents:write`.
2. Read [platform and tools](references/platform-and-tools.md) before choosing tools or claiming a feature exists.
3. Read [contracts](references/contracts.md) before changing source, retrying a mutation, or publishing.
4. Read [document design](references/document-design.md) before creating a document or making a visual change.
5. When the document includes charts, metrics, diagrams, or interactive figures, also read [visual evidence](references/visual-evidence.md).
6. Use the smallest workflow in [workflow examples](examples/workflows.md) that completes the request.
7. For orchestration or uploads, read [compact calls and assets](examples/compact-calls.md). For unfamiliar source patterns, read [supported source](examples/source.md).

Check the discovered schema before using optional capabilities. Use includeSource:false only if document_read advertises includeSource; otherwise use an ordinary read and summarize its result. Older servers may omit preview entirely. Use the creation receipt's draftVersion only when returned, otherwise read it. These additions share the tools-2 contract, so the contract name alone does not prove capability support. If a refreshed connector still exposes old schemas, use the compatible fallback and report the mismatch rather than repeatedly sending rejected arguments.

## Default workflow

1. Use `documents_list` to locate documents and accessible workspaces. Its limit is 1-50, default 24; follow nextCursor for more. If the user has more than one writable workspace and did not name one, ask which workspace to use. Never silently default to Personal.
2. Use `workspace_members_list` when the user refers to a teammate or asks for a direct grant. Use `document_comment` with `action: mention_candidates` for mentions.
3. Use `document_read` before editing existing content. Preserve the complete source bundle and every stable `data-md-id` that still represents the same element. For the first write into a newly created empty document, use the creation receipt's `draftVersion`; read if an older server omits it.
4. Use a fresh `operationId` for each intended mutation. Reuse it only to retry the exact same input.
5. Omit `data-md-id` on new elements; saving assigns valid ULIDs. Preserve IDs on existing elements. If you need IDs before saving for internal links, optionally use `document_ids_generate`. Never guess ULIDs or generate them by hand.
6. For new or substantially rewritten source, call `document_validate`, fix its diagnostics, then submit `document_update` with the full source bundle and exact current draft version. Do not save test fragments to discover format rules. Use the [supported source example](examples/source.md) for unfamiliar syntax.
7. Use the save receipt's draftVersion for subsequent operations. For status checks, use `document_read` with `includeSource: false` when advertised by its schema; otherwise use an ordinary read. Compact reads omit source and return preview status. A null preview means no draft build; isCurrent:false means its version differs from the draft. Before editing, use the default full read and retain canonical source, including server-assigned IDs.

## Before writing source

- Use one main root with separate CSS and JavaScript fields and settings: {}. No whole-page markup, inline styles, ordinary id attributes or inline SVG.
- Use semantic text tags including strong/em, b/i, time with datetime, and cite. Use classes instead of custom data-* attributes. aria-live accepts off/polite/assertive; role accepts a limited set such as status, note, img and region. Validate unfamiliar roles.
- Section links need href="#<returned ULID>" and that exact data-md-id on the target. Do not use #schedule or href="#". Action links should preventDefault before changing state.
- Style main or classes, not body or :root. :not(), :is() and :where() accept supported selectors; pseudo-elements and generated content remain unsupported. Use system font stacks, not @import or @font-face. Change classes and textContent, not innerHTML or element.style. Read [source patterns](examples/source.md) for compatible interactions.

Retain the source bundle before validation. Submit that same stored object when validation succeeds; do not rewrite it for the save. In functions.exec, use store/load across calls because local variables do not survive a fresh call. A typical sequence is store('source', bundle), validate(load('source')), then update with source: load('source'). If diagnostics require edits, update the stored bundle and validate again. See [the complete example](examples/compact-calls.md).

For assets, encode actual file bytes programmatically. Do not hand-copy or generate base64. Check the original byte count against decoded bytes and keep payloads out of printed output. The upload limit is 4,000,000 base64 characters; shrink images before transfer when needed. Read [asset transport guidance](examples/compact-calls.md) before uploading.

Use the workspace named by the user. A quota failure is not permission to switch workspaces or overwrite another document. Report that blocker.

For tool discovery, search names containing `modern_docs` or `modern-docs` and return names first, then inspect only the needed tool descriptions. Avoid broad searches for `document` across every connector. When orchestrating calls, print `result.structuredContent` when available, otherwise the text content, not both copies.

## Correcting and verifying

When validation fails, inspect the stored source at the reported location before editing. For scripted replacements, check that the expected old text exists and the intended replacement occurred. Merge new class names into an existing class attribute; never add a duplicate attribute. If the same diagnostic returns, inspect the updated source instead of repeating the same replacement. Revalidate and save that exact stored bundle.

For an interactive chart, start with [the complete tested bundle](examples/interactive-chart.json), adapt it, and validate again. Replace its demonstration target ID with a generated one. The example checks source compatibility, not your finished design.

Use document_assets_list and document_asset_upload. Upload requires operationId, documentId, name, mediaType and base64, with no action field. The combined asset tool has been removed. If the split tools are absent, ask the user to refresh the MCP connection.

Successful saves return: "VVIP: Read canonical source before your next edit to preserve generated IDs". Read the saved source before the next edit, even if you retained the original source for validation. That original bundle does not contain IDs generated by the save.

Browser testing is optional. Only use a browser after explicit user approval for browser testing. A request to create a document, verify MCP, or run an agent evaluation does not grant that approval. Without it, use MCP source validation and preview status only. Report "Source valid; preview ready" when those checks pass. Do not claim visual or interaction verification from compilation alone.

## Collaboration

- Discover comment anchors with `document_comment` and `action: anchors`. Never invent an anchor ID.
- To mention a person or the connected user's agent, use `document_comment` with `action: mention_candidates`. Write the visible `@Name` in the comment body and include its stable `actorId` in `mentionedActorIds`. Only the connected user's own agent is returned.
- Use IDs returned by tools for grants, invitations, links, threads, revisions, assets, and publications. Do not guess or extract private identifiers.
- Treat read, comment, edit, share, and publish permissions as separate. An access error is final unless the user changes access.

## Output and privacy

Check the result against the user's requested features and disclose anything missing. A ready build means source compiled. Browser checks require explicit user approval even when browser tools are available. Do not silently replace an ambitious design with a plain text shell to satisfy validation.

Report what changed, the document title, and the next useful action. Include a public or invitation URL only when the user requested it and the tool returned it. Never print OAuth tokens, invitation tokens, viewer-link tokens, private asset URLs, internal storage keys, or raw base64 data.
