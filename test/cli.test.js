// CLI-level tests. These exercise the user-facing command surface: argument
// parsing, exit codes, and — critically — the *visible output* each command
// prints. They guard against the "exits silently with no output" regression by
// capturing stdout/stderr and by running the real bin/cli.js entrypoint end to
// end via a child process.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import { main } from '../src/cli.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLI_BIN = path.resolve(HERE, '..', 'bin', 'cli.js');

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'urs-cli-'));
}
function rm(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}
function gitInit(dir) {
  execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' });
}

// Run main() with stdout/stderr captured. Returns { code, out, err }.
async function run(argv) {
  const origLog = console.log;
  const origErr = console.error;
  let out = '';
  let err = '';
  console.log = (...a) => { out += a.join(' ') + '\n'; };
  console.error = (...a) => { err += a.join(' ') + '\n'; };
  try {
    const code = await main(argv);
    return { code, out, err };
  } finally {
    console.log = origLog;
    console.error = origErr;
  }
}

test('--help prints usage and exits 0', async () => {
  const { code, out } = await run(['--help']);
  assert.equal(code, 0);
  assert.match(out, /^Universal Refactor Skill/);
  assert.match(out, /Usage:/);
  assert.match(out, /universal-refactor-skill install \[options\]/);
  assert.match(out, /--update-gitignore/);
  assert.match(out, /--commit/);
  assert.match(out, /--force/);
  assert.match(out, /--verbose/);
  assert.match(out, /-h, --help/);
});

test('-h prints the same usage as --help', async () => {
  const long = await run(['--help']);
  const short = await run(['-h']);
  assert.equal(short.code, 0);
  assert.equal(short.out, long.out);
});

test('no arguments still prints usage (never silent)', async () => {
  const { code, out } = await run([]);
  assert.equal(code, 0);
  assert.match(out, /Universal Refactor Skill/);
  assert.match(out, /Usage:/);
  assert.notEqual(out.trim(), '');
});

test('install executes the installer and writes files', async () => {
  const dir = mkTmp();
  try {
    const { code } = await run(['install', '--target', dir]);
    assert.equal(code, 0);
    assert.ok(fs.existsSync(path.join(dir, '.agent/universal-refactor/core/SKILL.md')));
  } finally {
    rm(dir);
  }
});

test('install prints the visible success output', async () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    const { code, out } = await run(['install', '--target', dir]);
    assert.equal(code, 0);
    assert.match(out, /Universal Refactor Skill installed locally\./);
    assert.match(out, /Installed:/);
    assert.match(out, /- \.agent\/universal-refactor\//);
    assert.match(out, /Ignored locally through:/);
    assert.match(out, /- \.git\/info\/exclude/);
    assert.match(out, /No tracked project files were modified\./);
  } finally {
    rm(dir);
  }
});

test('install updates .git/info/exclude with the managed ignore block', async () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    const { code } = await run(['install', '--target', dir]);
    assert.equal(code, 0);

    const excludePath = path.join(dir, '.git', 'info', 'exclude');
    assert.ok(fs.existsSync(excludePath), '.git/info/exclude exists');
    const exclude = fs.readFileSync(excludePath, 'utf8');
    assert.match(exclude, /# >>> universal-refactor-skill >>>/);
    assert.match(exclude, /# <<< universal-refactor-skill <<</);
    assert.match(exclude, /\.agent\/universal-refactor\//);
    assert.match(exclude, /^\.refactor\/$/m);

    // No .gitignore is created in the default local-only mode.
    assert.ok(!fs.existsSync(path.join(dir, '.gitignore')));

    // Re-running does not duplicate the managed block.
    await run(['install', '--target', dir]);
    const after = fs.readFileSync(excludePath, 'utf8');
    assert.equal((after.match(/# >>> universal-refactor-skill >>>/g) || []).length, 1);
  } finally {
    rm(dir);
  }
});

test('install --verbose lists every installed file', async () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    const { code, out } = await run(['install', '--target', dir, '--verbose']);
    assert.equal(code, 0);
    assert.match(out, /Mode: local-only/);
    assert.match(out, /core\/SKILL\.md/);
    assert.match(out, /\.claude\/skills\/universal-refactor\/SKILL\.md/);
  } finally {
    rm(dir);
  }
});

test('unknown command prints an error and usage, exits non-zero', async () => {
  const { code, out, err } = await run(['frobnicate']);
  assert.equal(code, 1);
  assert.match(err, /Unknown command: frobnicate/);
  assert.match(err, /Usage:/); // usage is printed (to stderr) for unknown cmds
  assert.equal(out, '', 'nothing written to stdout for an error');
});

test('invalid option prints an error and usage, exits non-zero', async () => {
  const { code, err } = await run(['install', '--definitely-not-an-option']);
  assert.equal(code, 1);
  assert.match(err, /Error:/);
  assert.match(err, /Usage:/);
});

// --- End-to-end: the real committed bin entrypoint must produce output. ---

test('bin/cli.js --help produces visible stdout and exit 0', () => {
  const out = execFileSync(process.execPath, [CLI_BIN, '--help'], {
    encoding: 'utf8',
  });
  assert.match(out, /Universal Refactor Skill/);
  assert.match(out, /universal-refactor-skill install \[options\]/);
  assert.notEqual(out.trim(), '');
});

test('bin/cli.js install produces visible success output and exit 0', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    const out = execFileSync(
      process.execPath,
      [CLI_BIN, 'install', '--target', dir],
      { encoding: 'utf8' },
    );
    assert.match(out, /Universal Refactor Skill installed locally\./);
    assert.match(out, /Ignored locally through:/);
    assert.match(out, /No tracked project files were modified\./);
  } finally {
    rm(dir);
  }
});

test('bin/cli.js unknown command exits non-zero with stderr output', () => {
  let threw = false;
  try {
    execFileSync(process.execPath, [CLI_BIN, 'frobnicate'], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (e) {
    threw = true;
    assert.equal(e.status, 1, 'exit code is non-zero');
    assert.match(String(e.stderr), /Unknown command: frobnicate/);
  }
  assert.ok(threw, 'unknown command must fail');
});

test('bin/cli.js starts with the node shebang', () => {
  const src = fs.readFileSync(CLI_BIN, 'utf8');
  assert.ok(src.startsWith('#!/usr/bin/env node'), 'shebang on first line');
});
