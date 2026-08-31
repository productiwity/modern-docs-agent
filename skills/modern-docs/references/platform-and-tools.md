# Platform and MCP tools

Modern Docs combines a visual editor with canonical HTML, CSS, optional JavaScript, and settings. Documents support private assets, stable element comments, access roles, viewer links, immutable revisions, activity history, and public URLs pinned to an exact revision.

OAuth identifies the connected user. The server derives the agent actor and checks current access on every call. Never send a role, owner identity, or storage credential that did not come from a Modern Docs tool.

## Tool catalog

| Tool | Scope | Use |
| --- | --- | --- |
| `documents_list` | Read | List recent, owned, shared, archived, or trashed documents. Search and paginate results. It also returns accessible workspaces. |
| `workspace_members_list` | Read | Search and paginate active members of an accessible workspace. Returns stable user IDs, names, emails, avatars, and workspace roles for mentions and direct sharing. |
| `document_read` | Read | Read one authorized document, including title, role, status, draft version, current revision, and complete canonical source. |
| `document_create` | Write | Create an empty document in an accessible workspace with a title and operation ID. |
| `document_update` | Write | Replace the complete source bundle at an exact draft version and build its preview. Set `checkpoint` only when the user wants a revision at the same time. |
| `document_revision` | Read or write | `list` history, `checkpoint` the current draft with a name, or `restore` an exact revision into a new current draft. |
| `document_asset` | Read or write | `list` ready assets or `upload` an image or WOFF2 font as base64. Use returned asset IDs in source. |
| `document_comment` | Read or write | `anchors`, `list`, `mention_candidates`, `create`, `reply`, or `resolve` a stable-element thread. Create and reply accept up to 20 `mentionedActorIds`. |
| `document_share` | Read or write | `overview`, `invite`, `grant`, `revoke`, `cancel_invitation`, `set_editors_can_share`, `create_viewer_link`, or `revoke_viewer_link`. |
| `document_publish` | Read or write | Read `status`, `publish` an exact revision after a successful build, or `unpublish`. |

This is the complete `modern-docs-tools-2` tool set. Rename, duplicate, archive, Trash, permanent deletion, ownership transfer, activity-history browsing, billing, and account settings currently remain web-app actions. Do not imply that the MCP can perform them.

## Finding people and mentioning them

Use `workspace_members_list` when the user names someone for sharing. Search by name or email and keep following `nextCursor` when more results exist. For comment mentions, use `document_comment` with `action: mention_candidates` to resolve people and the connected user's own agent to stable actor IDs.

For a comment mention:

1. Resolve the person or own agent to one returned `actorId` with `mention_candidates`.
2. Use `document_comment` with `action: anchors` and choose the exact element.
3. Put a readable `@Display Name` in `body`.
4. Put the same actor ID in `mentionedActorIds`.

The server accepts active owners, commenters, editors, and the connected user's own agent. Viewer-only users and other people's agents are not mentionable. It stores mention metadata and returns mentions with each comment. Human mentions create an in-app notification. Agent mentions return `isCurrentActor: true` when that agent reads the thread. Do not mention someone by adding text alone.

## Access and sharing

Roles are `viewer`, `commenter`, and `editor`. Owners have full document control. An editor can manage non-owner sharing only when the owner enabled editor sharing. Viewer links are read-only. Public publishing serves one immutable revision and does not grant source access.

Always read `document_share` overview before changing access. Use `invite` for an email address that may not yet have an account. Use `grant` only with a returned user ID. Do not create a viewer link or publish a revision unless the user asked to widen access.

## Revisions and publishing

A draft is the current editable source. A checkpoint creates an immutable revision. Restore copies a historical revision into a new draft and keeps history unchanged. Publishing requires an exact revision and creates or reuses its build. Read publication status after publishing when the user needs the public URL.

## Assets

List existing assets before upload. Upload only a supported PNG, JPEG, GIF, WebP, AVIF, SVG, or WOFF2 file within the tool limit. The server inspects and stores it privately. Source must refer to `asset:<asset-id>`, never a private provider URL or storage key.

## Errors and retries

- On a draft version conflict, read again, merge with the current source, and use a new operation ID.
- On validation failure, fix the named source field. Do not weaken the document to bypass the validator.
- On access denial, stop unless the user changes access.
- On an uncertain transport result, retry the exact same input with the same operation ID.
- On changed intent or changed input, use a new operation ID.
