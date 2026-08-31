# Install the Modern Docs skill

The public source is [`skills/modern-docs`](https://github.com/ShreyAmbesh/modern-docs-agent/tree/main/skills/modern-docs).

## Install from skills.sh

```bash
npx skills add ShreyAmbesh/modern-docs-agent --skill modern-docs
```

Choose the agent clients where you want to install the skill. Then add this remote MCP server through the client's MCP settings:

```text
https://moderndocs.app/mcp
```

Complete Clerk OAuth and approve `documents:read` and `documents:write`. Ask the client to use the Modern Docs skill, list documents, and create one test document.

Do not put credentials in the skill folder or client configuration. OAuth tokens belong to the client credential store.

## Update

The skill runs this update once at the start of each conversation:

```bash
npx -y skills update modern-docs --yes
```

The update is silent when the client allows network and skill-directory writes. A client security prompt can still require user approval. Check `contracts.json` before changing the MCP tool contract. A new major tool contract requires a matching skill release.
