import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const defaultSkillDirectory = dirname(dirname(scriptPath));

export function findProjectRoot(startDirectory) {
  const root = parse(startDirectory).root;
  let directory = startDirectory;

  while (directory !== root) {
    if (existsSync(resolve(directory, "skills-lock.json"))) {
      return directory;
    }
    directory = dirname(directory);
  }

  return null;
}

export async function updateSkill(scope, options = {}) {
  if (scope !== "project" && scope !== "global") {
    throw new Error("Invalid installation scope");
  }

  const skillDirectory = options.skillDirectory ?? defaultSkillDirectory;
  const versionUrl =
    options.versionUrl ??
    "https://raw.githubusercontent.com/productiwity/modern-docs-agent/main/VERSION";
  const response = await fetch(
    versionUrl,
    { cache: "no-store", signal: AbortSignal.timeout(10_000) },
  );
  if (!response.ok) {
    throw new Error("Could not read the canonical skill version");
  }

  const expectedVersion = (await response.text()).trim();
  if (!/^\d+\.\d+\.\d+$/.test(expectedVersion)) {
    throw new Error("Canonical skill version is invalid");
  }

  const projectRoot = findProjectRoot(skillDirectory);
  if (scope === "project" && !projectRoot) {
    throw new Error("Could not find skills-lock.json");
  }

  const skillsArguments = [
    "-y",
    "skills@1.5.23",
    "update",
    "modern-docs",
    `--${scope}`,
    "--yes",
  ];
  const executable =
    options.executable ??
    (process.platform === "win32" ? process.env.ComSpec ?? "cmd.exe" : "npx");
  const arguments_ =
    options.arguments ??
    (process.platform === "win32"
      ? ["/d", "/s", "/c", "npx.cmd", ...skillsArguments]
      : skillsArguments);
  const result = spawnSync(
    executable,
    arguments_,
    {
      cwd: scope === "project" ? projectRoot : undefined,
      stdio: "ignore",
      timeout: options.timeout ?? 60_000,
    },
  );
  if (result.error || result.status !== 0) {
    throw new Error("Skill update failed");
  }

  const installedVersion = (
    await readFile(resolve(skillDirectory, "VERSION"), "utf8")
  ).trim();
  if (installedVersion !== expectedVersion) {
    throw new Error("Installed skill version does not match the canonical version");
  }

  return installedVersion;
}

let isDirect = false;
try {
  isDirect = Boolean(
    process.argv[1] && realpathSync(process.argv[1]) === realpathSync(scriptPath),
  );
} catch {}

if (isDirect) {
  try {
    await updateSkill(process.argv[2]);
  } catch {
    process.exit(1);
  }
}
