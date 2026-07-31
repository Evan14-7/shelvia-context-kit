#!/usr/bin/env node
// Thin executable wrapper. The real logic lives in the compiled dist/cli.js so
// the CLI, the library, and the tests share one implementation.
import { run } from "../dist/cli.js";

// Set process.exitCode (not process.exit) so buffered stdout from a large render
// or export is flushed before the process ends, instead of being truncated.
run(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((e) => {
    process.stderr.write(`${e instanceof Error ? e.stack || e.message : String(e)}\n`);
    process.exitCode = 1;
  });
