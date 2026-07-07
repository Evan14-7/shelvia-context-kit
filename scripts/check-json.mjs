#!/usr/bin/env node
/**
 * check-json.mjs — parse every JSON file in the repo and report.
 *
 * Zero dependencies. Confirms the schema, examples, and package manifest are
 * well-formed before anything else runs. Exits non-zero on the first bad file.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP = new Set(["node_modules", ".git"]);

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

const files = walk(ROOT);
let bad = 0;

for (const f of files) {
  const rel = relative(ROOT, f);
  try {
    JSON.parse(readFileSync(f, "utf8"));
    console.log(`  ok    ${rel}`);
  } catch (e) {
    bad++;
    console.log(`  FAIL  ${rel} :: ${e.message}`);
  }
}

console.log(`\n${files.length - bad}/${files.length} JSON files parsed cleanly.`);
process.exit(bad > 0 ? 1 : 0);
