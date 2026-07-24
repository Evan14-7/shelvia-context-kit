// Golden-snapshot tests: lock the render + every exporter's output against a
// committed reference so a change to formatting can never land silently. If an
// output legitimately changes, run `npm run golden:update` and commit the diff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { produceGolden, norm } from "../scripts/golden-cases.mjs";

const dir = join(dirname(fileURLToPath(import.meta.url)), "golden");

for (const [name, produced] of Object.entries(produceGolden())) {
  test(`golden: ${name} matches its committed snapshot`, () => {
    const file = join(dir, name);
    assert.ok(existsSync(file), `missing golden test/golden/${name} — run \`npm run golden:update\``);
    assert.equal(
      norm(produced),
      norm(readFileSync(file, "utf8")),
      `test/golden/${name} drifted from the committed snapshot. If the change is intended, run \`npm run golden:update\` and commit it.`,
    );
  });
}
