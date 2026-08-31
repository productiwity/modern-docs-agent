# Modern Docs agent skill

[![skills.sh](https://skills.sh/b/productiwity/modern-docs-agent)](https://skills.sh/productiwity/modern-docs-agent)
[![Validate](https://github.com/productiwity/modern-docs-agent/actions/workflows/validate.yml/badge.svg)](https://github.com/productiwity/modern-docs-agent/actions/workflows/validate.yml)

The official agent skill for [Modern Docs](https://moderndocs.app). It teaches supported agents how to create, design, edit, review, share, comment on, and publish Modern Docs documents through the hosted OAuth MCP server.

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

## Automatic updates

The skill tells the agent to run a scope-aware update once per conversation. A project installation on a POSIX shell uses:

```bash
npx -y skills@latest update modern-docs --project --yes >/dev/null 2>&1
```

Global installations use `--global`, and PowerShell uses its native output redirection. This updates a skills CLI-managed installation without asking the user or printing routine output. The host application can still show a security prompt when it blocks network access or writes to the skill directory. No skill can bypass the host's security policy.

## Versioning

Releases use semantic versioning. `VERSION`, the skill metadata, and `contracts.json` must always match. The validation workflow rejects a mismatch.

- Patch: wording, examples, and compatible workflow fixes
- Minor: new compatible workflows or MCP capabilities
- Major: incompatible skill behavior or MCP tool contract

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## Security

The skill contains instructions and public contract documentation only. It contains no credentials. OAuth tokens stay in the agent client's credential store. See [SECURITY.md](SECURITY.md) to report a vulnerability.

## License

[MIT](LICENSE)
