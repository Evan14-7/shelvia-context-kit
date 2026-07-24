#!/usr/bin/env node
// Regenerate the committed golden snapshots (test/golden/*.md). This is the
// ONLY writer — the test only reads. Run after an intentional exporter/render
// change: `npm run golden:update`, then review the diff and commit.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { produceGolden, norm } from "./golden-cases.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "test", "golden");
mkdirSync(dir, { recursive: true });
for (const [name, content] of Object.entries(produceGolden())) {
  writeFileSync(join(dir, name), norm(content), "utf8");
  process.stdout.write(`wrote test/golden/${name}\n`);
}
