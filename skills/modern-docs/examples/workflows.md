# Workflow examples

These are tool sequences, not fixed scripts. Use the smallest sequence that completes the user's request.

## Create a designed document

1. Use `documents_list` to find the target workspace. If more than one writable workspace is available and the user did not choose one, ask before creating the document.
2. Create the document with `document_create`.
3. Read [document design](../references/document-design.md) and write a short design brief. If the document includes charts, metrics, diagrams, or interactive figures, also read [visual evidence](../references/visual-evidence.md).
4. Use `document_read`, then `document_update` with the complete responsive source bundle and exact draft version. The update also builds the document preview.
5. Read the saved source again and fix any weak hierarchy, filler copy, overflow risk, or validation issue.

## Add an asset

1. Use `document_asset` with `action: list` to avoid duplicate uploads.
2. Upload only when needed.
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
