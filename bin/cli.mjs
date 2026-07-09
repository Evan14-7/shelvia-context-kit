#!/usr/bin/env node
// Thin executable wrapper. The real logic lives in the compiled dist/cli.js so
// the CLI, the library, and the tests share one implementation.
import { run } from "../dist/cli.js";

run(process.argv.slice(2))
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(`${e instanceof Error ? e.stack || e.message : String(e)}\n`);
    process.exit(1);
  });
