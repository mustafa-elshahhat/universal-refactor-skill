#!/usr/bin/env node
// Executable entrypoint for `universal-refactor-skill`.
//
// It delegates to the CLI's main() and maps the returned exit code onto the
// process so non-zero results (bad args, unknown command) propagate to shells
// and CI. Every code path here guarantees *visible* output: a thrown error is
// printed to stderr, and a missing/non-numeric exit code is normalised. This
// file is committed (never a generated dist artifact) so installs from GitHub
// always have a runnable binary.
import { main } from '../src/cli.js';

main(process.argv.slice(2))
  .then((code) => {
    process.exitCode = typeof code === 'number' ? code : 0;
  })
  .catch((err) => {
    // Never exit silently: surface the failure on stderr and fail non-zero.
    const message = err && err.stack ? err.stack : String(err);
    console.error(`universal-refactor-skill: ${message}`);
    process.exitCode = 1;
  });
