import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = await mkdtemp(join(tmpdir(), "modern-docs-skill-test-"));
const source = join(fixture, "source");
const project = join(fixture, "project");

await cp(root, source, {
  recursive: true,
  filter: (path) => !path.includes(join(root, ".git")),
});

const git = spawnSync("git", ["init", "-q", project]);
if (git.status !== 0) {
  throw new Error("Could not create the test project");
}

const skillsArguments = [
  "-y",
  "skills@1.5.23",
  "add",
  source,
  "--skill",
  "modern-docs",
  "--agent",
  "codex",
  "--copy",
  "--yes",
];
const executable =
  process.platform === "win32" ? process.env.ComSpec ?? "cmd.exe" : "npx";
const arguments_ =
  process.platform === "win32"
    ? ["/d", "/s", "/c", "npx.cmd", ...skillsArguments]
    : skillsArguments;
const install = spawnSync(executable, arguments_, {
  cwd: project,
  stdio: "ignore",
  timeout: 60_000,
});
if (install.error || install.status !== 0) {
  throw new Error("Could not install the test skill");
}

const installedSkill = join(project, ".agents", "skills", "modern-docs");
for (const file of ["LICENSE", "SKILL.md", "VERSION", "contracts.json"]) {
  await readFile(join(installedSkill, file));
}

const skill = await readFile(join(installedSkill, "SKILL.md"), "utf8");
if (!skill.includes("Never update this skill automatically.")) {
  throw new Error("Installed skill does not require approved updates");
}
