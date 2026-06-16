// Uninstall logic. Removes only files this package installs (derived from the
// manifest) plus the managed ignore block, then prunes directories that become
// empty. Never deletes unrelated user files.
import fs from 'node:fs';
import path from 'node:path';
import { resolveTarget } from './paths.js';
import { buildManifest, SKILL_HOME, REPORTS_DIR } from './templates.js';
import {
  pathExists,
  removeFileIfExists,
  pruneEmptyDirs,
  removeIgnoreBlock,
} from './file-utils.js';

// Directories the installer may create; pruned (only if empty) on uninstall.
const OWNED_DIRS = [
  `${SKILL_HOME}/core`,
  `${SKILL_HOME}/prompts`,
  SKILL_HOME,
  '.agent',
  '.claude/skills/universal-refactor',
  '.claude/skills',
  '.claude',
  '.opencode/agents',
  '.opencode/commands',
  '.opencode',
  '.github/instructions',
];

const IGNORE_FILES = ['.git/info/exclude', '.gitignore'];

/**
 * Uninstall the skill pack from a target project.
 *
 * @param {object} [options]
 * @param {string} [options.target] Target project dir (default: cwd).
 * @param {boolean} [options.keepReports] Keep the .refactor/ reports directory.
 */
export function uninstall(options = {}) {
  const target = resolveTarget(options.target);
  const keepReports = !!options.keepReports;
  const removed = [];
  const kept = [];
  const warnings = [];

  // Consider every file the installer could have written (all adapters, commit
  // mode so root AGENTS.md is included as a removal candidate).
  const { files } = buildManifest({ mode: 'commit', adapters: {} });

  for (const entry of files) {
    if (entry.id === 'reports-keep' && keepReports) {
      kept.push(entry.dest);
      continue;
    }
    const abs = path.resolve(target, entry.dest);
    if (removeFileIfExists(abs)) removed.push(entry.dest);
  }

  // Generated reports directory.
  const reportsAbs = path.resolve(target, REPORTS_DIR);
  if (pathExists(reportsAbs)) {
    if (keepReports) {
      kept.push(`${REPORTS_DIR}/`);
    } else {
      fs.rmSync(reportsAbs, { recursive: true, force: true });
      removed.push(`${REPORTS_DIR}/`);
    }
  }

  // Remove directories we own, only while empty.
  for (const dir of OWNED_DIRS) {
    pruneEmptyDirs(path.resolve(target, dir), target);
  }

  // Remove our managed ignore block wherever it was written.
  for (const file of IGNORE_FILES) {
    const result = removeIgnoreBlock(path.resolve(target, file));
    if (result.action === 'removed') removed.push(`${file} (ignore block)`);
  }

  return { target, removed, kept, warnings };
}
