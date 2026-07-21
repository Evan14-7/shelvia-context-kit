// Tests for shelvia-context-pack. Run against the compiled dist/ via
// `npm test` (which builds first). Uses Node's built-in test runner.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateContextPack,
  renderMarkdown,
  exportPack,
  EXPORT_TARGETS,
  exportCodex,
  exportCursor,
} from "../dist/index.js";

const basic = JSON.parse(
  readFileSync(new URL("../examples/basic/context-pack.json", import.meta.url), "utf8")
);

test("a valid pack passes validation", () => {
  const { valid, errors } = validateContextPack(basic);
  assert.equal(valid, true);
  assert.deepEqual(errors, []);
});

test("a missing required field fails with a readable error", () => {
  const bad = { ...basic };
  delete bad.project_summary;
  const { valid, errors } = validateContextPack(bad);
  assert.equal(valid, false);
  assert.ok(errors.length > 0);
  assert.ok(errors.some((e) => /project_summary/.test(e.message) || e.path === "/"));
});

test("an unknown property fails (additionalProperties: false)", () => {
  const bad = { ...basic, not_a_real_field: true };
  const { valid, errors } = validateContextPack(bad);
  assert.equal(valid, false);
  assert.ok(errors.some((e) => /not_a_real_field/.test(e.message)));
});

test("a bad enum value fails", () => {
  const bad = { ...basic, category: "banana" };
  assert.equal(validateContextPack(bad).valid, false);
});

test("render produces Markdown with the key sections", () => {
  const md = renderMarkdown(basic);
  for (const heading of ["Project summary", "Key decisions", "Trusted sources", "Next steps"]) {
    assert.ok(md.includes(heading), `render is missing "${heading}"`);
  }
  assert.ok(md.startsWith("# "));
});

test("every exporter returns non-empty Markdown", () => {
  for (const target of EXPORT_TARGETS) {
    const out = exportPack(basic, target);
    assert.ok(typeof out === "string" && out.trim().length > 0, `${target} exporter was empty`);
  }
});

test("codex exporter emits AGENTS.md; cursor emits frontmatter", () => {
  assert.ok(exportCodex(basic).startsWith("# AGENTS.md"));
  assert.ok(exportCursor(basic).startsWith("---"));
});

test("exporters do not invent facts (project summary is carried verbatim)", () => {
  assert.ok(exportPack(basic, "chatgpt").includes(basic.project_summary));
});

test("exportPack throws on an unknown target", () => {
  assert.throws(() => exportPack(basic, "notatool"));
});
