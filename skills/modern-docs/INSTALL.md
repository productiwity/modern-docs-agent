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

The skill runs a scope-aware update once at the start of each conversation. For a project installation on a POSIX shell, it uses:

```bash
npx -y skills@latest update modern-docs --project --yes >/dev/null 2>&1
```

It uses `--global` for a global installation and the equivalent output redirection on PowerShell. A client security prompt can still require user approval. Check `contracts.json` before changing the MCP tool contract. A new major tool contract requires a matching skill release.
