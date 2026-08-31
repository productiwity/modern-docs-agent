# Modern Docs contracts

The machine-readable versions are in [`contracts.json`](../contracts.json). Client packages must declare the tool contract they support and should refuse an unknown major contract instead of guessing.

## Source bundle

Every source update replaces one complete bundle:

- HTML using `md-html-1`
- CSS using `md-css-2`
- optional JavaScript using `md-js-2`
- settings using `md-settings-1`, which currently accepts only `{}`

Each HTML element uses a stable uppercase ULID in `data-md-id`. Keep existing IDs when the element still represents the same content. Generate a new ID for a new element. Use comment anchor discovery instead of extracting or inventing IDs for comments.

Use `asset:<asset-id>` references for uploaded assets. SVG uploads are accepted only after the `md-svg-1` inspector normalizes them. The hosted MCP tool accepts base64 assets up to 3 MB; use the web app for larger files.

The server validates and canonicalizes the whole bundle. On a validation error, change the source named by the returned diagnostic and retry with a new operation ID unless the previous command did not start.

## Mutations

Every mutation has an `operationId` of 1 to 128 characters with no leading or trailing whitespace. The same ID and same input replay the stored result. Reusing the ID with changed input returns an idempotency conflict.

Draft writes require `expectedDraftVersion`. A version conflict means the agent must read the document again, merge the requested change with the current source, and submit a new operation.

Invitation and expiring viewer-link actions use an absolute ISO 8601 `expiresAt` value. Reuse that exact value on retry.

## Access

OAuth grants `documents:read` and `documents:write`. Modern Docs resolves the current user and agent actor from the token. Tool calls never accept a caller-supplied role or owner identity.

Read access does not imply edit, comment, share, or publish access. Treat access-denied and unavailable results as final unless the user changes sharing in the web app.

## People and mentions

`workspace_members_list` returns active members of an accessible workspace in stable user-ID order. Follow `nextCursor` to continue. Search matches a current name or email address.

`document_comment` with `action: mention_candidates` returns human actors for the active owner, commenters, and editors who can read document comments. It also returns the connected user's own agent actor. It excludes viewer-only users and every other user's agent, needs comment permission rather than share-management permission, and does not expose collaborator email addresses.

Comment `create` and `reply` accept at most 20 unique `mentionedActorIds`. Each ID must be a returned human actor or the connected user's own agent actor. Put a visible `@Name` in the comment body as well. List `mentionedActorIds` in the same left-to-right order as their visible tokens, which is required when actors share a display name. A text-only tag is not a mention. Human mentions create notifications, while agent mentions are exposed in comment reads with `isCurrentActor` so the connected agent can recognize work directed to it.
