// Tests for @shelviahq/context-pack. Run against the compiled dist/ via
// `npm test` (which builds first). Uses Node's built-in test runner.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateContextPack,
  validateAndExportPack,
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

// --- 1.0.1 hardening ---

test("spec_version is enforced — an unknown version is rejected", () => {
  assert.equal(validateContextPack({ ...basic, spec_version: "9.9" }).valid, false);
  assert.equal(validateContextPack({ ...basic, spec_version: "banana" }).valid, false);
  assert.equal(validateContextPack({ ...basic, spec_version: "0.1" }).valid, true);
});

test("required text rejects empty strings (minLength)", () => {
  const bad = {
    ...basic,
    version_history: [{ label: "", status: "" }],
  };
  assert.equal(validateContextPack(bad).valid, false);
});

test("hostile source label/URL can't break out of the Markdown link", () => {
  const pack = {
    ...basic,
    sources: [
      { label: "evil] (injected)(x", url: "https://example.com/a b(c)", trust_grade: "reputable" },
    ],
  };
  const md = renderMarkdown(pack);
  // The label's ] is escaped, and the space/paren URL is wrapped in <> — so the
  // link destination is a single angle-bracketed token, not terminated early.
  assert.ok(md.includes("[evil\\] (injected)(x](<https://example.com/a b(c)>)"), md);
});

test("validateAndExportPack: exports a valid pack, throws on an invalid one", () => {
  assert.ok(validateAndExportPack(basic, "claude").length > 0);
  assert.throws(() => validateAndExportPack({ spec_version: "0.1" }, "claude"));
});
