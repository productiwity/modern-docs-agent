from pathlib import Path
import json
import os
import re
import sys


root = Path(__file__).resolve().parent.parent
skill_dir = root / "skills" / "modern-docs"
skill_file = skill_dir / "SKILL.md"
contracts_file = skill_dir / "contracts.json"
version = (root / "VERSION").read_text().strip()
errors: list[str] = []

if not re.fullmatch(r"\d+\.\d+\.\d+", version):
    errors.append("VERSION must contain strict semantic versioning")

skill_text = skill_file.read_text()
version_match = re.search(r'^  version: "([^"]+)"$', skill_text, re.MULTILINE)
if not version_match or version_match.group(1) != version:
    errors.append("SKILL.md metadata version does not match VERSION")

if not re.search(r"^license: MIT$", skill_text, re.MULTILINE):
    errors.append("SKILL.md must declare the MIT license")

if not re.search(r"^  author: Productiwity$", skill_text, re.MULTILINE):
    errors.append("SKILL.md must identify Productiwity as the publisher")

installed_version = (skill_dir / "VERSION").read_text().strip()
if installed_version != version:
    errors.append("Installed skill VERSION does not match repository VERSION")

if (skill_dir / "LICENSE").read_text() != (root / "LICENSE").read_text():
    errors.append("Installed skill LICENSE does not match repository LICENSE")

contracts = json.loads(contracts_file.read_text())
if contracts.get("skillVersion") != version:
    errors.append("contracts.json skillVersion does not match VERSION")

tag = os.environ.get("GITHUB_REF_NAME")
if os.environ.get("GITHUB_REF_TYPE") == "tag" and tag != f"v{version}":
    errors.append(f"Release tag {tag} does not match VERSION v{version}")

canonical_files = {
    root / "README.md": "https://github.com/productiwity/modern-docs-agent",
    root / "SECURITY.md": "https://github.com/productiwity/modern-docs-agent/security/advisories/new",
    skill_dir / "INSTALL.md": "https://github.com/productiwity/modern-docs-agent/tree/main/skills/modern-docs",
}
for path, expected in canonical_files.items():
    if expected not in path.read_text():
        errors.append(f"Canonical Productiwity URL is missing from {path.relative_to(root)}")

updater = (skill_dir / "scripts" / "silent-update.mjs").read_text()
if "skills@1.5.23" not in updater or "skills@latest" in updater:
    errors.append("Silent updater must use the reviewed skills CLI version")

for link in re.findall(r"\[[^]]+\]\(([^)]+)\)", skill_text):
    if link.startswith(("http://", "https://", "#")):
        continue
    if not (skill_file.parent / link).resolve().exists():
        errors.append(f"SKILL.md link does not exist: {link}")

for path in root.rglob("*"):
    if not path.is_file() or ".git" in path.parts:
        continue
    text = path.read_text(errors="ignore")
    if "[" + "TODO" in text or "<skills.sh-" + "owner>" in text:
        errors.append(f"Placeholder found in {path.relative_to(root)}")

if errors:
    for error in errors:
        print(f"error: {error}", file=sys.stderr)
    raise SystemExit(1)

print(f"Modern Docs skill {version} is valid")
