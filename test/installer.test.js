// Installer tests. Each test runs against a fresh temporary directory created
// with os.tmpdir() (cross-platform) and cleans up afterwards. The install/
// uninstall/doctor functions are called directly for speed and determinism.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { install } from '../src/install.js';
import { uninstall } from '../src/uninstall.js';
import { doctor } from '../src/doctor.js';
import { main } from '../src/cli.js';

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'urs-test-'));
}
function rm(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}
function read(p) {
  return fs.readFileSync(p, 'utf8');
}
function exists(p) {
  return fs.existsSync(p);
}
function gitInit(dir) {
  execFileSync('git', ['init'], { cwd: dir, stdio: 'ignore' });
}

const CORE_SKILL = '.agent/universal-refactor/core/SKILL.md';
const MARKER = /# >>> universal-refactor-skill >>>/;

test('1. installs into an empty (non-git) project', () => {
  const dir = mkTmp();
  try {
    const res = install({ target: dir });

    assert.ok(exists(path.join(dir, CORE_SKILL)), 'core SKILL.md');
    assert.ok(exists(path.join(dir, '.agent/universal-refactor/prompts/refactor-audit.md')));
    assert.ok(exists(path.join(dir, '.agent/universal-refactor/README.md')));
    assert.ok(exists(path.join(dir, '.claude/skills/universal-refactor/SKILL.md')));
    assert.ok(exists(path.join(dir, '.opencode/agents/refactor.md')));
    assert.ok(exists(path.join(dir, '.opencode/commands/refactor.md')));
    assert.ok(exists(path.join(dir, '.github/instructions/universal-refactor.instructions.md')));
    assert.ok(exists(path.join(dir, '.refactor/.gitkeep')));

    assert.equal(res.isGitRepo, false);
    assert.equal(res.ignoredVia, null);
    assert.ok(res.warnings.some((w) => /not a git repository/i.test(w)));
    assert.ok(!exists(path.join(dir, '.gitignore')), '.gitignore must not be created');
    // Root AGENTS.md must NOT be created outside commit mode.
    assert.ok(!exists(path.join(dir, 'AGENTS.md')));
  } finally {
    rm(dir);
  }
});

test('2. installs into a git project and writes .git/info/exclude', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    const res = install({ target: dir });

    assert.equal(res.isGitRepo, true);
    assert.equal(res.ignoredVia, '.git/info/exclude');

    const exclude = read(path.join(dir, '.git/info/exclude'));
    assert.match(exclude, MARKER);
    assert.match(exclude, /\.agent\/universal-refactor\//);
    assert.match(exclude, /^\.refactor\/$/m);
    assert.ok(!exists(path.join(dir, '.gitignore')), '.gitignore must be untouched');
  } finally {
    rm(dir);
  }
});

test('3. does not duplicate ignore entries on re-run (idempotent)', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    install({ target: dir });
    install({ target: dir });

    const exclude = read(path.join(dir, '.git/info/exclude'));
    assert.equal((exclude.match(MARKER) || []).length, 1, 'one managed block');
    assert.equal((exclude.match(/^\.refactor\/$/gm) || []).length, 1, 'one .refactor/ entry');
  } finally {
    rm(dir);
  }
});

test('4. does not overwrite existing files without --force', () => {
  const dir = mkTmp();
  try {
    install({ target: dir });
    const file = path.join(dir, CORE_SKILL);
    fs.writeFileSync(file, 'MODIFIED', 'utf8');

    const res = install({ target: dir });
    assert.equal(read(file), 'MODIFIED', 'user edit preserved');
    assert.ok(res.skipped.includes(CORE_SKILL));
    assert.ok(!res.overwritten.includes(CORE_SKILL));
  } finally {
    rm(dir);
  }
});

test('5. --force overwrites installed files', () => {
  const dir = mkTmp();
  try {
    install({ target: dir });
    const file = path.join(dir, CORE_SKILL);
    fs.writeFileSync(file, 'MODIFIED', 'utf8');

    const res = install({ target: dir, force: true });
    assert.notEqual(read(file), 'MODIFIED');
    assert.match(read(file), /Universal Project Refactor Skill/);
    assert.ok(res.overwritten.includes(CORE_SKILL));
  } finally {
    rm(dir);
  }
});

test('6. --update-gitignore writes the block to .gitignore', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules/\n', 'utf8');

    const res = install({ target: dir, updateGitignore: true });
    assert.equal(res.ignoredVia, '.gitignore');

    const gi = read(path.join(dir, '.gitignore'));
    assert.match(gi, /node_modules\//, 'existing content preserved');
    assert.match(gi, MARKER);
    assert.match(gi, /\.agent\/universal-refactor\//);

    const excludePath = path.join(dir, '.git/info/exclude');
    const exclude = exists(excludePath) ? read(excludePath) : '';
    assert.ok(!MARKER.test(exclude), 'block not written to exclude');
  } finally {
    rm(dir);
  }
});

test('7. --commit ignores only .refactor/ and writes root AGENTS.md', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    const res = install({ target: dir, commit: true });

    assert.equal(res.committed, true);
    assert.ok(exists(path.join(dir, 'AGENTS.md')), 'AGENTS.md written in commit mode');
    assert.ok(exists(path.join(dir, CORE_SKILL)));

    const exclude = read(path.join(dir, '.git/info/exclude'));
    assert.match(exclude, /^\.refactor\/$/m);
    assert.ok(!/\.agent\/universal-refactor\//.test(exclude), 'skill files not ignored');
    assert.ok(!/\.claude\/skills/.test(exclude));
  } finally {
    rm(dir);
  }
});

test('8. uninstall removes installed files and ignore block, keeps user files', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    fs.writeFileSync(path.join(dir, 'keep-me.txt'), 'important', 'utf8');
    install({ target: dir });

    const res = uninstall({ target: dir });

    assert.ok(!exists(path.join(dir, CORE_SKILL)));
    assert.ok(!exists(path.join(dir, '.agent')), '.agent pruned');
    assert.ok(!exists(path.join(dir, '.claude/skills/universal-refactor/SKILL.md')));
    assert.ok(!exists(path.join(dir, '.opencode/commands/refactor.md')));
    assert.ok(!exists(path.join(dir, '.github/instructions/universal-refactor.instructions.md')));
    assert.ok(!exists(path.join(dir, '.refactor')), 'reports removed by default');

    assert.ok(exists(path.join(dir, 'keep-me.txt')), 'unrelated user file preserved');

    const exclude = read(path.join(dir, '.git/info/exclude'));
    assert.ok(!MARKER.test(exclude), 'ignore block removed');
    assert.ok(res.removed.length > 0);
  } finally {
    rm(dir);
  }
});

test('9. doctor reports installation status', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);

    const before = doctor({ target: dir });
    assert.equal(before.coreInstalled, false);

    install({ target: dir });

    const after = doctor({ target: dir });
    assert.equal(after.coreInstalled, true);
    assert.equal(after.claude, true);
    assert.equal(after.opencode, true);
    assert.equal(after.copilot, true);
    assert.equal(after.generic, true);
    assert.equal(after.reports, true);
    assert.equal(after.ignoredInExclude, true);
    assert.equal(after.isGitRepo, true);
  } finally {
    rm(dir);
  }
});

// --- Extra coverage beyond the required nine ---

test('10. uninstall --keep-reports keeps generated reports', () => {
  const dir = mkTmp();
  try {
    install({ target: dir });
    fs.writeFileSync(path.join(dir, '.refactor/03-audit-report.md'), '# audit', 'utf8');

    uninstall({ target: dir, keepReports: true });
    assert.ok(exists(path.join(dir, '.refactor/03-audit-report.md')), 'report kept');
    assert.ok(!exists(path.join(dir, '.agent')), 'skill still removed');
  } finally {
    rm(dir);
  }
});

test('11. --no-claude skips the Claude adapter and its ignore entry', () => {
  const dir = mkTmp();
  try {
    gitInit(dir);
    install({ target: dir, adapters: { claude: false } });

    assert.ok(!exists(path.join(dir, '.claude/skills/universal-refactor/SKILL.md')));
    assert.ok(exists(path.join(dir, CORE_SKILL)), 'core still installed');

    const exclude = read(path.join(dir, '.git/info/exclude'));
    assert.ok(!/\.claude\/skills\/universal-refactor\//.test(exclude));
  } finally {
    rm(dir);
  }
});

test('12. cli main: help -> 0, unknown -> 1, version -> 0', async () => {
  const origLog = console.log;
  const origErr = console.error;
  console.log = () => {};
  console.error = () => {};
  try {
    assert.equal(await main(['help']), 0);
    assert.equal(await main(['definitely-not-a-command']), 1);
    assert.equal(await main(['--version']), 0);
  } finally {
    console.log = origLog;
    console.error = origErr;
  }
});
