// Install logic. Pure: it performs filesystem work and returns a structured
// result, but does no printing. The CLI (and the tests) format the result.
import path from 'node:path';
import { resolveTarget } from './paths.js';
import { buildManifest } from './templates.js';
import {
  pathExists,
  copyTemplate,
  writeFileEnsured,
  upsertIgnoreBlock,
} from './file-utils.js';

const IGNORE_COMMENT_LOCAL = 'Universal Refactor Skill local files';
const IGNORE_COMMENT_REPORTS = 'Universal Refactor Skill generated reports';

/**
 * Install the skill pack into a target project.
 *
 * @param {object} [options]
 * @param {string} [options.target] Target project dir (default: cwd).
 * @param {boolean} [options.force] Overwrite existing installed files.
 * @param {boolean} [options.updateGitignore] Write ignore rules to .gitignore.
 * @param {boolean} [options.commit] Install files intended to be committed.
 * @param {object} [options.adapters] Per-adapter enable flags.
 */
export function install(options = {}) {
  const target = resolveTarget(options.target);
  const force = !!options.force;
  const committed = !!options.commit;
  const updateGitignore = !!options.updateGitignore;
  const manifestMode = committed ? 'commit' : 'local';

  const { files, ignoreEntries } = buildManifest({
    mode: manifestMode,
    adapters: options.adapters,
  });

  const created = [];
  const skipped = [];
  const overwritten = [];
  const warnings = [];

  for (const entry of files) {
    const absDest = path.resolve(target, entry.dest);
    const exists = pathExists(absDest);

    if (exists && !force) {
      skipped.push(entry.dest);
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(entry, 'content')) {
      writeFileEnsured(absDest, entry.content);
    } else {
      copyTemplate(entry.src, absDest);
    }

    if (exists) overwritten.push(entry.dest);
    else created.push(entry.dest);
  }

  // Decide where ignore entries go.
  const isGitRepo = pathExists(path.join(target, '.git'));
  const comment = committed ? IGNORE_COMMENT_REPORTS : IGNORE_COMMENT_LOCAL;
  let ignoredVia = null;

  if (updateGitignore) {
    upsertIgnoreBlock(path.join(target, '.gitignore'), ignoreEntries, comment);
    ignoredVia = '.gitignore';
  } else if (isGitRepo) {
    upsertIgnoreBlock(
      path.join(target, '.git', 'info', 'exclude'),
      ignoreEntries,
      comment,
    );
    ignoredVia = '.git/info/exclude';
  } else {
    warnings.push(
      'Not a Git repository: skipped local Git exclude. ' +
        'Run "git init" first, or use --update-gitignore to write a .gitignore.',
    );
  }

  let modeLabel;
  if (committed) modeLabel = 'commit (files intended to be committed)';
  else if (updateGitignore) modeLabel = 'local (.gitignore)';
  else modeLabel = 'local-only';

  return {
    target,
    modeLabel,
    committed,
    isGitRepo,
    created,
    skipped,
    overwritten,
    ignoredVia,
    ignoreEntries,
    warnings,
  };
}
