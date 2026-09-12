# Workflow examples

These are tool sequences, not fixed scripts. Use the smallest sequence that completes the user's request.

## Create a designed document

1. Use `documents_list` to find the target workspace. If more than one writable workspace is available and the user did not choose one, ask before creating the document.
2. Create the document with `document_create`.
3. Read [document design](../references/document-design.md) and write a short design brief. If the document includes charts, metrics, diagrams, or interactive figures, also read [visual evidence](../references/visual-evidence.md).
4. Use the creation receipt's draftVersion for the first update. Read if existing source or its IDs are needed, or an older server omitted the version. Preserve IDs on existing content and omit IDs on new elements. If you need a new ID before saving, optionally call `document_ids_generate` for only the number needed.
5. Call `document_validate` on the complete responsive source bundle. Fix the returned diagnostics and validate again. Then call `document_update` with the same source and exact draft version. The update builds the preview and assigns missing IDs.
6. Check preview status through MCP. Browser testing is optional and requires explicit user approval before opening or operating a browser. Before the next edit, read canonical source to preserve server-generated IDs.

## Add an asset

1. Use `document_assets_list` to avoid duplicate uploads.
2. Use `document_asset_upload` only when needed. If these tools are absent, ask the user to refresh the MCP connection.
3. Read the document, then update source using the returned `asset:<asset-id>` reference.

## Mention someone in a comment

1. Use `document_comment` with `action: mention_candidates` to find a person or the connected user's own agent.
2. Use `document_comment` with `action: anchors` to find the exact element.
3. Create or reply with visible `@Name` text and the same actor ID in `mentionedActorIds`.
4. List the thread to confirm the mention metadata and comment.

## Share

1. Use `document_share` with `action: overview`.
2. Use `workspace_members_list` for a direct grant or `invite` for an email that may not have an account.
3. Grant, revoke, cancel an invitation, or manage a viewer link with returned IDs.
4. Keep an absolute `expiresAt` unchanged on an exact retry.

## Revisions, restore, and publishing

1. Use `document_revision` with `action: list`.
2. Checkpoint the current draft when it is the intended release.
3. Restore only with the selected revision and current draft version.
4. Publish the exact revision, then read publication status for the pinned revision and URL.

Restore does not rebuild a preview or change the published edition. To rebuild the restored draft, read and save its unchanged bundle at the returned draftVersion. To change the public edition, explicitly publish the chosen revision. A buildOperationId is a fresh caller-created retry key, not a build ID.
