// Single source of truth for the golden snapshot cases, shared by the golden
// generator (scripts/gen-golden.mjs, the only writer) and the golden test
// (test/golden.test.mjs, the only reader/comparator). Runs against the built
// dist/ so it exercises exactly what consumers get.
//
// The produced files ARE the visible per-example outputs
// (examples/<name>/outputs/*): the documentation a visitor reads and the
// regression fixtures the test locks are one and the same — no duplicate tree.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { renderMarkdown, exportPack, EXPORT_TARGETS } from "../dist/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Every example pack that anchors golden snapshots. */
export const GOLDEN_EXAMPLES = [
  "basic",
  "software-project",
  "paystack-webhook",
  "research-decision",
  "grant-application",
  "cross-ai-handoff",
  "team-decision",
  "product-launch",
];

/** Exporter target -> output filename, matching each tool's real convention. */
const TARGET_FILE = { chatgpt: "chatgpt.md", claude: "claude.md", cursor: "cursor.mdc", codex: "AGENTS.md" };

/** repo-relative path -> produced output, for the neutral render + every export
 *  target, across every example. */
export function produceGolden() {
  const out = {};
  for (const name of GOLDEN_EXAMPLES) {
    const pack = JSON.parse(readFileSync(join(root, "examples", name, "context-pack.json"), "utf8"));
    const base = `examples/${name}/outputs`;
    out[`${base}/neutral.md`] = renderMarkdown(pack);
    for (const target of EXPORT_TARGETS) {
      const file = TARGET_FILE[target] ?? `export-${target}.md`;
      out[`${base}/${file}`] = exportPack(pack, target);
    }
  }
  return out;
}

/** Normalize line endings so a Windows checkout (CRLF) and a Linux one (LF)
 *  compare equal — the snapshot is about content, not the OS that wrote it. */
export const norm = (s) => s.replace(/\r\n/g, "\n");
