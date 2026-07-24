#!/usr/bin/env node
// Consumer install smoke: prove the PUBLISHED package actually installs and
// works — not just that the local ../dist/ imports. The unit + golden tests
// import dist/ directly and would stay green even if `files`, `exports`, or
// `bin` were misconfigured and the published tarball shipped broken. This packs
// the repo, installs the tarball into a throwaway project, then:
//   1. imports "@shelviahq/context-pack" and validates + exports a pack, and
//   2. runs the installed bin (dist + the ajv dependency must resolve).
// No network beyond npm's registry for the transitive deps of the tarball.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const log = (m) => process.stdout.write(`${m}\n`);
// npm is a .cmd shim on Windows, so it needs a shell; the node binary must NOT
// go through a shell — its path ("C:\Program Files\...") contains a space that
// cmd.exe would split on.
const runNpm = (args, cwd) => execFileSync(npm, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
const runNode = (args, cwd) => execFileSync(process.execPath, args, { cwd, stdio: "inherit" });

const work = mkdtempSync(join(tmpdir(), "ctxpack-consumer-"));
try {
  // 1. Build + pack -> a real tarball, exactly what `npm publish` would upload.
  runNpm(["run", "build"], root);
  const packOut = execFileSync(npm, ["pack", "--pack-destination", work], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  const tarball = packOut.trim().split(/\r?\n/).pop().trim();
  const tarballPath = join(work, tarball);
  log(`packed: ${tarball}`);

  // 2. A throwaway ESM consumer project that installs the tarball.
  const consumer = join(work, "consumer");
  mkdirSync(consumer, { recursive: true });
  runNpm(["init", "-y"], consumer);
  const pj = JSON.parse(readFileSync(join(consumer, "package.json"), "utf8"));
  pj.type = "module";
  writeFileSync(join(consumer, "package.json"), JSON.stringify(pj, null, 2));
  runNpm(["install", tarballPath], consumer);

  // 3. Import the package entry point from the consumer + use it.
  writeFileSync(join(consumer, "pack.json"), readFileSync(GOLDEN_INPUT(), "utf8"));
  writeFileSync(
    join(consumer, "use.mjs"),
    [
      `import { validateContextPack, exportPack, EXPORT_TARGETS } from "@shelviahq/context-pack";`,
      `import { readFileSync } from "node:fs";`,
      `const pack = JSON.parse(readFileSync(new URL("./pack.json", import.meta.url), "utf8"));`,
      `const { valid, errors } = validateContextPack(pack);`,
      `if (!valid) { console.error("import validate FAILED", errors); process.exit(1); }`,
      `for (const t of EXPORT_TARGETS) if (!exportPack(pack, t).trim()) { console.error("empty export", t); process.exit(1); }`,
      `console.log("consumer import: OK");`,
    ].join("\n"),
  );
  runNode([join(consumer, "use.mjs")], consumer);

  // 4. Run the installed bin (proves the tarball shipped bin/ + dist/ and that
  //    the ajv dependency resolves from the install).
  const installedBin = join(consumer, "node_modules", "@shelviahq", "context-pack", "bin", "cli.mjs");
  const res = spawnSync(process.execPath, [installedBin, "validate", join(consumer, "pack.json")], {
    cwd: consumer,
    encoding: "utf8",
  });
  if (res.status !== 0 || !/valid Context Pack/.test(res.stdout ?? "")) {
    console.error("consumer bin FAILED", { status: res.status, stdout: res.stdout, stderr: res.stderr });
    process.exit(1);
  }
  log("consumer bin: OK");
  log("CONSUMER SMOKE PASSED");
} finally {
  rmSync(work, { recursive: true, force: true });
}

function GOLDEN_INPUT() {
  return join(root, "examples", "basic", "context-pack.json");
}
