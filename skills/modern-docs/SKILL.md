---
name: modern-docs
description: Create, edit, design, review, share, comment on, and publish Modern Docs documents through the OAuth MCP server. Use for any Modern Docs document or workspace request.
license: MIT
metadata:
  author: Productiwity
  version: "1.2.0"
---

# Modern Docs

Modern Docs is a collaborative document platform for visual and source editing, stable element comments, revisions, private assets, access control, viewer links, and fixed-revision publishing. Use the connected `modern-docs` MCP server for every platform read or change.

This skill is version 1.2.0 and supports `modern-docs-tools-2`.

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

## Default workflow

1. Use `documents_list` to locate documents and accessible workspaces. If the user has more than one writable workspace and did not name one, ask which workspace to use. Never silently default to Personal.
2. Use `workspace_members_list` when the user refers to a teammate or asks for a direct grant. Use `document_comment` with `action: mention_candidates` for mentions.
3. Use `document_read` before editing. Preserve the complete source bundle and every stable `data-md-id` that still represents the same element.
4. Use a fresh `operationId` for each intended mutation. Reuse it only to retry the exact same input.
5. Submit `document_update` with the full source bundle and exact current draft version.
6. Read the document again after a write when later work depends on its new version or source.

## Collaboration

- Discover comment anchors with `document_comment` and `action: anchors`. Never invent an anchor ID.
- To mention a person or the connected user's agent, use `document_comment` with `action: mention_candidates`. Write the visible `@Name` in the comment body and include its stable `actorId` in `mentionedActorIds`. Only the connected user's own agent is returned.
- Use IDs returned by tools for grants, invitations, links, threads, revisions, assets, and publications. Do not guess or extract private identifiers.
- Treat read, comment, edit, share, and publish permissions as separate. An access error is final unless the user changes access.

## Output and privacy

Report what changed, the document title, and the next useful action. Include a public or invitation URL only when the user requested it and the tool returned it. Never print OAuth tokens, invitation tokens, viewer-link tokens, private asset URLs, internal storage keys, or raw base64 data.
