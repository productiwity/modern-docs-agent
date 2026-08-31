# Modern Docs agent integration

[![skills.sh](https://skills.sh/b/productiwity/modern-docs-agent)](https://skills.sh/productiwity/modern-docs-agent)
[![Validate](https://github.com/productiwity/modern-docs-agent/actions/workflows/validate.yml/badge.svg)](https://github.com/productiwity/modern-docs-agent/actions/workflows/validate.yml)

The official skill and provider packages for [Modern Docs](https://moderndocs.app). They teach supported agents how to create, design, edit, review, share, comment on, and publish Modern Docs documents through the hosted OAuth MCP server.

## Install

```bash
npx skills add productiwity/modern-docs-agent --skill modern-docs
```

Then add the hosted MCP server to your client:

```text
https://moderndocs.app/mcp
```

Complete OAuth and approve `documents:read` and `documents:write`.

The repository works with agents supported by the [skills CLI](https://www.skills.sh/docs), including Codex, Claude Code, Cursor, GitHub Copilot, and Gemini CLI.

## Provider packages

The same repository is ready for each provider. The canonical skill stays in `skills/modern-docs`; provider manifests only describe how that skill and the hosted MCP server are installed.

- OpenAI: `.codex-plugin/plugin.json` and `.mcp.json`
- Claude Code: `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
- Cursor and other Agent Plugin clients: `plugin.json` and `mcp.json`

For an independent Claude Code install:

```text
/plugin marketplace add productiwity/modern-docs-agent
/plugin install modern-docs@modern-docs
```

Public provider listings are submitted from this repository:

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)
- [Claude plugin submission](https://platform.claude.com/plugins/submit)
- [Cursor Marketplace submission](https://cursor.com/marketplace/publish)

The provider listing forms are the publish step. A Git tag publishes the source release but does not submit or approve a marketplace listing.

## Updates

The skill never updates itself automatically. The agent must explain the update and get the user's approval first. After approval, it runs this command from the project root that contains `skills-lock.json`:

```text
npx -y skills@1.5.23 update modern-docs --project --yes
```

Global installations use `--global` instead of `--project`. The agent reads the updated `SKILL.md` before continuing.

## Versioning

Releases use semantic versioning. `VERSION`, the skill metadata, `contracts.json`, and provider manifests must always match. The validation workflow rejects a mismatch.

- Patch: wording, examples, and compatible workflow fixes
- Minor: new compatible workflows or MCP capabilities
- Major: incompatible skill behavior or MCP tool contract

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## Security

The skill contains instructions and public contract documentation only. It contains no credentials. OAuth tokens stay in the agent client's credential store. See [SECURITY.md](SECURITY.md) to report a vulnerability.

## License

[MIT](LICENSE)
