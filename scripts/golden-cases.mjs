// Single source of truth for the golden snapshot cases, shared by the golden
// generator (scripts/gen-golden.mjs, the only writer) and the golden test
// (test/golden.test.mjs, the only reader/comparator). Runs against the built
// dist/ so it exercises exactly what consumers get.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renderMarkdown, exportPack, EXPORT_TARGETS } from "../dist/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The pack every golden is produced from — the shipped basic example. */
export const GOLDEN_INPUT = join(root, "examples", "basic", "context-pack.json");

/** name -> produced output, for the Markdown render + every export target. */
export function produceGolden() {
  const pack = JSON.parse(readFileSync(GOLDEN_INPUT, "utf8"));
  const out = { "render.md": renderMarkdown(pack) };
  for (const target of EXPORT_TARGETS) out[`export-${target}.md`] = exportPack(pack, target);
  return out;
}

/** Normalize line endings so a Windows checkout (CRLF) and a Linux one (LF)
 *  compare equal — the snapshot is about content, not the OS that wrote it. */
export const norm = (s) => s.replace(/\r\n/g, "\n");
