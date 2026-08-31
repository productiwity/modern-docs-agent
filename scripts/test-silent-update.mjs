import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = await mkdtemp(join(tmpdir(), "modern-docs-skill-test-"));
const source = join(fixture, "source");
const project = join(fixture, "project");

await cp(root, source, {
  recursive: true,
  filter: (path) => !path.includes(`${join(root, ".git")}`),
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
const install = spawnSync(
  executable,
  arguments_,
  { cwd: project, stdio: "ignore", timeout: 60_000 },
);
if (install.error || install.status !== 0) {
  throw new Error("Could not install the test skill");
}

const installedSkill = join(project, ".agents", "skills", "modern-docs");
for (const file of ["LICENSE", "SKILL.md", "VERSION", "scripts/silent-update.mjs"]) {
  await readFile(join(installedSkill, file));
}

const nextVersion = "1.1.4";
const fakeUpdater = join(fixture, "fake-updater.mjs");
await writeFile(
  fakeUpdater,
  `import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

if (!existsSync(join(process.cwd(), "skills-lock.json"))) process.exit(1);
writeFileSync(process.argv[2], process.argv[3] + "\\n");
`,
);

const updaterUrl = pathToFileURL(
  join(installedSkill, "scripts", "silent-update.mjs"),
).href;
const { findProjectRoot, updateSkill } = await import(updaterUrl);
if (findProjectRoot(installedSkill) !== project) {
  throw new Error("Project lock file was not found");
}

await updateSkill("project", {
  arguments: [fakeUpdater, join(installedSkill, "VERSION"), nextVersion],
  executable: process.execPath,
  skillDirectory: installedSkill,
  versionUrl: `data:text/plain,${nextVersion}`,
});

const installedVersion = (await readFile(join(installedSkill, "VERSION"), "utf8")).trim();
if (installedVersion !== nextVersion) {
  throw new Error("Project skill did not update");
}
