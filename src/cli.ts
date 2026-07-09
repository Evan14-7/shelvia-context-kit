/**
 * CLI implementation for `shelvia-context-pack`. The bin wrapper (bin/cli.mjs)
 * calls run() and exits with its return code.
 *
 *   shelvia-context-pack validate <file>
 *   shelvia-context-pack render <file>
 *   shelvia-context-pack export <file> --target chatgpt|claude|cursor|codex
 *
 * Exit code 0 on success, non-zero on any failure. Messages are human-readable.
 */

import { readFileSync } from "node:fs";
import { validateContextPack } from "./validate.js";
import { renderMarkdown } from "./render.js";
import { exportPack, EXPORT_TARGETS } from "./index.js";
import type { ContextPack, ExportTarget } from "./types.js";

const USAGE = `shelvia-context-pack — validate, render, and export Context Packs

Usage:
  shelvia-context-pack validate <file>
  shelvia-context-pack render <file>
  shelvia-context-pack export <file> --target <chatgpt|claude|cursor|codex>

Options:
  -h, --help    Show this help.`;

function err(msg: string): void {
  process.stderr.write(`${msg}\n`);
}

function readPack(file: string): { pack?: ContextPack; errorCode?: number } {
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    err(`Could not read file: ${file}`);
    return { errorCode: 1 };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    err(`${file} is not valid JSON: ${e instanceof Error ? e.message : "parse error"}`);
    return { errorCode: 1 };
  }
  const { valid, errors } = validateContextPack(parsed);
  if (!valid) {
    err(`${file} is not a valid Context Pack:`);
    for (const e of errors) err(`  ${e.path} ${e.message}`);
    return { errorCode: 1 };
  }
  return { pack: parsed as ContextPack };
}

export async function run(argv: string[]): Promise<number> {
  const [command, ...rest] = argv;

  if (!command || command === "-h" || command === "--help" || command === "help") {
    process.stdout.write(`${USAGE}\n`);
    return command ? 0 : 1;
  }

  const file = rest.find((a) => !a.startsWith("-"));

  if (command === "validate") {
    if (!file) {
      err("Usage: shelvia-context-pack validate <file>");
      return 1;
    }
    const { pack, errorCode } = readPack(file);
    if (!pack) return errorCode ?? 1;
    process.stdout.write(`OK — ${file} is a valid Context Pack (spec ${pack.spec_version}).\n`);
    return 0;
  }

  if (command === "render") {
    if (!file) {
      err("Usage: shelvia-context-pack render <file>");
      return 1;
    }
    const { pack, errorCode } = readPack(file);
    if (!pack) return errorCode ?? 1;
    process.stdout.write(renderMarkdown(pack));
    return 0;
  }

  if (command === "export") {
    if (!file) {
      err("Usage: shelvia-context-pack export <file> --target <chatgpt|claude|cursor|codex>");
      return 1;
    }
    const ti = rest.indexOf("--target");
    const target = ti >= 0 ? rest[ti + 1] : undefined;
    if (!target || !EXPORT_TARGETS.includes(target as ExportTarget)) {
      err(`--target must be one of: ${EXPORT_TARGETS.join(", ")}`);
      return 1;
    }
    const { pack, errorCode } = readPack(file);
    if (!pack) return errorCode ?? 1;
    process.stdout.write(exportPack(pack, target as ExportTarget));
    return 0;
  }

  err(`Unknown command: ${command}\n\n${USAGE}`);
  return 1;
}
