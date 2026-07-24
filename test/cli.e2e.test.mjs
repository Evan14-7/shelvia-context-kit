// End-to-end tests for the `shelvia-context-pack` CLI. These run the real
// bin/cli.mjs as a child process (the way a user runs it) and assert on exit
// code + stdout/stderr — the wrapper, arg parsing, and process contract that
// the library-level unit tests never exercise. Runs against the built dist/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = join(root, "bin", "cli.mjs");
const BASIC = join(root, "examples", "basic", "context-pack.json");

function cli(args) {
  const r = spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8" });
  return { code: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

test("validate: a valid pack exits 0 and reports OK", () => {
  const { code, stdout } = cli(["validate", BASIC]);
  assert.equal(code, 0);
  assert.match(stdout, /OK — .* is a valid Context Pack/);
});

test("validate: a nonexistent file exits 1 with a readable error", () => {
  const { code, stderr } = cli(["validate", join(root, "does-not-exist.json")]);
  assert.equal(code, 1);
  assert.match(stderr, /Could not read file/);
});

test("validate: well-formed JSON that isn't a pack exits 1 with validation errors", () => {
  const { code, stderr } = cli(["validate", join(root, "package.json")]);
  assert.equal(code, 1);
  assert.match(stderr, /is not a valid Context Pack/);
});

test("render: emits Markdown to stdout and exits 0", () => {
  const { code, stdout } = cli(["render", BASIC]);
  assert.equal(code, 0);
  assert.ok(stdout.startsWith("# "), "render should start with a Markdown H1");
});

for (const target of ["chatgpt", "claude", "cursor", "codex"]) {
  test(`export --target ${target}: exits 0 with non-empty stdout`, () => {
    const { code, stdout } = cli(["export", BASIC, "--target", target]);
    assert.equal(code, 0);
    assert.ok(stdout.trim().length > 0, `${target} export was empty`);
  });
}

test("export: an unknown target exits 1", () => {
  const { code, stderr } = cli(["export", BASIC, "--target", "notatool"]);
  assert.equal(code, 1);
  assert.match(stderr, /--target must be one of/);
});

test("export: a missing --target exits 1", () => {
  const { code } = cli(["export", BASIC]);
  assert.equal(code, 1);
});

test("--help exits 0 and prints usage", () => {
  const { code, stdout } = cli(["--help"]);
  assert.equal(code, 0);
  assert.match(stdout, /Usage:/);
});

test("no arguments exits 1 but still prints usage", () => {
  const { code, stdout } = cli([]);
  assert.equal(code, 1);
  assert.match(stdout, /Usage:/);
});

test("an unknown command exits 1", () => {
  const { code, stderr } = cli(["frobnicate"]);
  assert.equal(code, 1);
  assert.match(stderr, /Unknown command/);
});
