// Golden-snapshot tests: lock the neutral render + every exporter's output, for
// every example, against a committed reference (examples/<name>/outputs/*) so a
// change to formatting can never land silently. If an output legitimately
// changes, run `npm run golden:update` and commit the diff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { produceGolden, norm } from "../scripts/golden-cases.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const [name, produced] of Object.entries(produceGolden())) {
  test(`golden: ${name} matches its committed snapshot`, () => {
    const file = join(root, name);
    assert.ok(existsSync(file), `missing golden ${name} — run \`npm run golden:update\``);
    assert.equal(
      norm(produced),
      norm(readFileSync(file, "utf8")),
      `${name} drifted from the committed snapshot. If the change is intended, run \`npm run golden:update\` and commit it.`,
    );
  });
}
