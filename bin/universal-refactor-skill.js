#!/usr/bin/env node
// Executable entrypoint. Delegates to the CLI and maps the returned exit code
// onto the process, so non-zero results (bad args, unknown command) propagate
// to shells and CI.
import { main } from '../src/cli.js';

main()
  .then((code) => {
    process.exitCode = code ?? 0;
  })
  .catch((err) => {
    console.error(err && err.stack ? err.stack : String(err));
    process.exitCode = 1;
  });
