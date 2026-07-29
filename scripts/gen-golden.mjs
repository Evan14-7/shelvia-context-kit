#!/usr/bin/env node
// Regenerate the committed golden snapshots — the per-example outputs under
// examples/<name>/outputs/*. This is the ONLY writer; the test only reads. Run
// after an intentional exporter/render change or a new/changed example:
// `npm run golden:update`, then review the diff and commit.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { produceGolden, norm } from "./golden-cases.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const [name, content] of Object.entries(produceGolden())) {
  const target = join(root, name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, norm(content), "utf8");
  process.stdout.write(`wrote ${name}\n`);
}
