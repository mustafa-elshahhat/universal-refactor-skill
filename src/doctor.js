// Doctor logic. Inspects a target project and reports installation status as a
// structured object. The CLI renders it for humans.
import path from 'node:path';
import { resolveTarget } from './paths.js';
import { SKILL_HOME, REPORTS_DIR } from './templates.js';
import { pathExists, readFileSafe, IGNORE_BLOCK_START } from './file-utils.js';

/**
 * Inspect a target project for an existing installation.
 *
 * @param {object} [options]
 * @param {string} [options.target] Target project dir (default: cwd).
 */
export function doctor(options = {}) {
  const target = resolveTarget(options.target);
  const has = (rel) => pathExists(path.resolve(target, rel));

  const coreInstalled = has(`${SKILL_HOME}/core/SKILL.md`);
  const claude = has('.claude/skills/universal-refactor/SKILL.md');
  const opencode =
    has('.opencode/commands/refactor.md') || has('.opencode/agents/refactor.md');
  const copilot = has('.github/instructions/universal-refactor.instructions.md');
  const generic = has(`${SKILL_HOME}/README.md`);
  const reports = has(REPORTS_DIR);
  const isGitRepo = has('.git');

  const exclude = readFileSafe(path.resolve(target, '.git/info/exclude')) || '';
  const gitignore = readFileSafe(path.resolve(target, '.gitignore')) || '';
  const ignoredInExclude = exclude.includes(IGNORE_BLOCK_START);
  const ignoredInGitignore = gitignore.includes(IGNORE_BLOCK_START);

  return {
    target,
    isGitRepo,
    installed: coreInstalled,
    coreInstalled,
    claude,
    opencode,
    copilot,
    generic,
    reports,
    ignoredInExclude,
    ignoredInGitignore,
  };
}
