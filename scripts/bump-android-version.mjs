/**
 * Читает COMMIT_MESSAGE, определяет тип релиза (feat/fix/refactor + optional !),
 * обновляет versionName (semver) и versionCode (+1) в android/app/build.gradle.
 * Пишет в GITHUB_OUTPUT: changed, version_name, version_code
 */
import fs from "fs";
import path from "path";

const BUILD = path.join(process.cwd(), "android/app/build.gradle");

function setOutput(key, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    fs.appendFileSync(out, `${key}=${String(value).replace(/\r?\n/g, " ")}\n`);
  }
}

function parseSemver(s) {
  const t = s.trim();
  const m = t.match(/^(\d+)\.(\d+)(?:\.(\d+))?$/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +(m[3] ?? 0) };
}

function bumpSemver(v, kind) {
  if (kind === "major") {
    return { major: v.major + 1, minor: 0, patch: 0 };
  }
  if (kind === "minor") {
    return { major: v.major, minor: v.minor + 1, patch: 0 };
  }
  return { major: v.major, minor: v.minor, patch: v.patch + 1 };
}

function stringifySemver(v) {
  return `${v.major}.${v.minor}.${v.patch}`;
}

/**
 * Первая строка: опционально несколько токенов (префикс задачи), затем feat|fix|refactor.
 * Примеры: "MM-42 feat: x", "НАЗВАНИЕ_ЗАДАЧИ fix: x", "feat: x", "feat!: breaking"
 */
function detectBumpKind(msg) {
  if (/\[skip version\]|\[skip ci\]/i.test(msg)) {
    return null;
  }
  if (/^BREAKING CHANGE:/m.test(msg)) {
    return "major";
  }
  const first = msg.split("\n")[0].trim();
  const re = /^(?:\S+\s+)*(feat|fix|refactor)(!)?(?:\([^)]*\))?\s*:/i;
  const m = first.match(re);
  if (!m) {
    return null;
  }
  const breaking = m[2] === "!";
  const type = m[1].toLowerCase();
  if (breaking) {
    return "major";
  }
  if (type === "feat") {
    return "minor";
  }
  if (type === "fix" || type === "refactor") {
    return "patch";
  }
  return null;
}

function main() {
  const msg = process.env.COMMIT_MESSAGE ?? "";
  const kind = detectBumpKind(msg);

  if (!kind) {
    setOutput("changed", "false");
    console.log("No version bump (commit message does not match feat/fix/refactor: …).");
    return;
  }

  let content = fs.readFileSync(BUILD, "utf8");
  const codeMatch = content.match(/versionCode\s+(\d+)/);
  const nameMatch = content.match(/versionName\s+"([^"]+)"/);
  if (!codeMatch || !nameMatch) {
    console.error("Could not parse versionCode / versionName in build.gradle");
    process.exit(1);
  }

  const currentCode = parseInt(codeMatch[1], 10);
  const parsed = parseSemver(nameMatch[1]);
  if (!parsed) {
    console.error(`versionName "${nameMatch[1]}" is not semver (expected x.y or x.y.z)`);
    process.exit(1);
  }

  const nextVer = bumpSemver(parsed, kind);
  const nextName = stringifySemver(nextVer);
  const nextCode = currentCode + 1;

  content = content.replace(/versionCode\s+\d+/, `versionCode ${nextCode}`);
  content = content.replace(/versionName\s+"[^"]+"/, `versionName "${nextName}"`);

  fs.writeFileSync(BUILD, content);

  setOutput("changed", "true");
  setOutput("version_name", nextName);
  setOutput("version_code", String(nextCode));
  console.log(`Bumped to versionName=${nextName}, versionCode=${nextCode} (${kind})`);
}

main();
