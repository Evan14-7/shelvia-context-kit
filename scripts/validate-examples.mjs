#!/usr/bin/env node
/**
 * validate-examples.mjs — validate every example pack with the package's own
 * validateContextPack(), so the examples are checked by the exact code we ship.
 * Requires a build first (npm run build); `npm run validate:examples` and the
 * CI workflow build before calling this.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let validateContextPack;
try {
  ({ validateContextPack } = await import(new URL("../dist/index.js", import.meta.url)));
} catch {
  console.error("Build first: run `npm run build`, then retry `npm run validate:examples`.");
  process.exit(1);
}

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

const packs = walk(join(ROOT, "examples"));
if (packs.length === 0) {
  console.error("No example packs found under examples/.");
  process.exit(1);
}

let fail = 0;
for (const f of packs) {
  const rel = relative(ROOT, f);
  const data = JSON.parse(readFileSync(f, "utf8"));
  const { valid, errors } = validateContextPack(data);
  if (valid) {
    console.log(`  PASS  ${rel}`);
  } else {
    fail++;
    console.log(`  FAIL  ${rel}`);
    for (const err of errors) console.log(`          ${err.path} ${err.message}`);
  }
}

console.log(`\n${packs.length - fail}/${packs.length} example packs conform to the schema.`);
process.exit(fail > 0 ? 1 : 0);
