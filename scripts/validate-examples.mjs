#!/usr/bin/env node
/**
 * validate-examples.mjs — validate every example pack against the schema.
 *
 * Uses ajv (declared in devDependencies). Run `npm install` first. If ajv is
 * missing it prints a friendly hint instead of a stack trace. ajv-formats is
 * optional: when present, "uri" / "date-time" are checked; when absent they are
 * treated as annotations so the script still runs.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let Ajv;
try {
  ({ default: Ajv } = await import("ajv"));
} catch {
  console.error("Missing dev dependency 'ajv'. Run `npm install`, then retry.");
  process.exit(1);
}

let addFormats = null;
try {
  ({ default: addFormats } = await import("ajv-formats"));
} catch {
  console.log("(ajv-formats not installed — 'uri'/'date-time' treated as annotations)\n");
}

const schema = JSON.parse(readFileSync(join(ROOT, "schema/context-pack.schema.json"), "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
if (addFormats) addFormats(ajv);
const validate = ajv.compile(schema);

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
  if (validate(data)) {
    console.log(`  PASS  ${rel}`);
  } else {
    fail++;
    console.log(`  FAIL  ${rel}`);
    for (const err of validate.errors ?? []) {
      console.log(`          ${err.instancePath || "/"} ${err.message}`);
    }
  }
}

console.log(`\n${packs.length - fail}/${packs.length} example packs conform to the schema.`);
process.exit(fail > 0 ? 1 : 0);
