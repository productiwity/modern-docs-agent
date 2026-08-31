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

The skill never updates itself automatically. The agent must explain the update and get the user's approval first. After approval, it runs this command from the project root that contains `skills-lock.json`:

```text
npx -y skills@1.5.23 update modern-docs --project --yes
```

It uses `--global` instead of `--project` for a global installation. Check `contracts.json` before changing the MCP tool contract. A new major tool contract requires a matching skill release.
