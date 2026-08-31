# Install the Modern Docs skill

The public source is [`skills/modern-docs`](https://github.com/productiwity/modern-docs-agent/tree/main/skills/modern-docs).

## Install from skills.sh

```bash
npx skills add productiwity/modern-docs-agent --skill modern-docs
```

Choose the agent clients where you want to install the skill. Then add this remote MCP server through the client's MCP settings:

```text
https://moderndocs.app/mcp
```

Complete Clerk OAuth and approve `documents:read` and `documents:write`. Ask the client to use the Modern Docs skill, list documents, and create one test document.

Do not put credentials in the skill folder or client configuration. OAuth tokens belong to the client credential store.

## Update

The skill runs a scope-aware update once at the start of each conversation. From the installed skill directory, a project installation uses:

```text
node scripts/silent-update.mjs project
```

It uses `global` instead of `project` for a global installation. The updater pins its CLI dependency, stays quiet during routine operation, and verifies the installed version. A client security prompt can still require user approval. Check `contracts.json` before changing the MCP tool contract. A new major tool contract requires a matching skill release.
