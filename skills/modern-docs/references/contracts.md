# Modern Docs contracts

The machine-readable versions are in [`contracts.json`](../contracts.json). Client packages must declare the tool contract they support and should refuse an unknown major contract instead of guessing.

## Source bundle

Every source update replaces one complete bundle:

- HTML using `md-html-1`
- CSS using `md-css-2`
- optional JavaScript using `md-js-2`
- settings using `md-settings-1`, which currently accepts only `{}`

Stored HTML elements use stable uppercase ULIDs in `data-md-id`. Omit the attribute on new elements and the server assigns it when saving. Preserve existing IDs when the element still represents the same content. Empty, invalid, or duplicate supplied IDs are rejected. No matching occurs across versions. Use comment anchor discovery for comments.

When an ID is needed before saving, `document_ids_generate` accepts `count` from 1 to 500 and returns `{ ids: [...] }`. This is optional, creates no records, and reserves nothing. Ask only for the number needed for internal links or ID-specific selectors. A newly generated ID is not an existing comment anchor.

`document_validate` accepts `source` and optional `documentId`, with no operation ID or draft version. It allows absent IDs and checks the size of the eventual saved source. With documentId it also checks read access and referenced assets. It returns `{ valid, diagnostics, diagnosticCount, truncated }`, never the complete HTML. It saves nothing and creates no preview or history. Successful validation does not guarantee write access, current draft version, a successful build, or visual quality.

Use `asset:<asset-id>` references for uploaded assets. SVG uploads are accepted only after the `md-svg-1` inspector normalizes them. The hosted MCP tool accepts base64 assets up to 3 MB; use the web app for larger files.

The server validates and canonicalizes the whole bundle. Validation and failed saves return up to 50 diagnostics with code, field, message, and locations where available. Fix those specific problems and validate again. Use a new operation ID for changed mutation input. Preserve requested content and interactions; report any unresolved limitation instead of silently removing features.

## Mutations

Every mutation has an `operationId` of 1 to 128 characters with no leading or trailing whitespace. The same ID and same input replay the stored result. Reusing the ID with changed input returns an idempotency conflict.

Action-based tools advertise one object with an action enum. Some fields appear optional because they apply only to certain actions. Follow each field's action requirements; the server rejects missing fields and fields belonging to another action. Comment create requires operationId, documentId, elementId and body. anchorId is not a field.

Draft writes require `expectedDraftVersion`. A version conflict means the agent must read the document again, merge the requested change with the current source, and submit a new operation.

Invitation and expiring viewer-link actions use an absolute ISO 8601 `expiresAt` value. Reuse that exact value on retry.

Invitation expiry must be in the future and within 7 days; viewer-link expiry can be omitted or be within 365 days. Do not guess the current time. Checkpoint names are at most 80 characters after trimming. Comment bodies are at most 16,384 UTF-8 bytes, not characters. Field-specific errors include a reason/message and may include actual/expected values or retryAfterSeconds. Fix that condition before retrying.

## Access

OAuth grants `documents:read` and `documents:write`. Modern Docs resolves the current user and agent actor from the token. Tool calls never accept a caller-supplied role or owner identity.

Read access does not imply edit, comment, share, or publish access. Treat access-denied and unavailable results as final unless the user changes sharing in the web app.

## People and mentions

`workspace_members_list` returns active members of an accessible workspace in stable user-ID order. Follow `nextCursor` to continue. Search matches a current name or email address.

`document_comment` with `action: mention_candidates` returns human actors for the active owner, commenters, and editors who can read document comments. It also returns the connected user's own agent actor. It excludes viewer-only users and every other user's agent, needs comment permission rather than share-management permission, and does not expose collaborator email addresses.

Comment `create` and `reply` accept at most 20 unique `mentionedActorIds`. Each ID must be a returned human actor or the connected user's own agent actor. Put a visible `@Name` in the comment body as well. List `mentionedActorIds` in the same left-to-right order as their visible tokens, which is required when actors share a display name. A text-only tag is not a mention. Human mentions create notifications, while agent mentions are exposed in comment reads with `isCurrentActor` so the connected agent can recognize work directed to it.
