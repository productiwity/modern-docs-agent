# Contributing

Open an issue before making a large behavior change. Small corrections can go directly to a pull request.

## Validate a change

```bash
python3 scripts/validate.py
```

Keep the instructions short, concrete, and tied to behavior supported by the public Modern Docs MCP server. Never add credentials, private URLs, user data, or internal storage identifiers.

When releasing, update `VERSION`, the version in `SKILL.md`, the `skillVersion` in `contracts.json`, and `CHANGELOG.md` together.
