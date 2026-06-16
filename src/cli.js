// Command-line interface. Parses arguments with the built-in node:util
// parseArgs (no third-party dependency), dispatches to the install/uninstall/
// doctor modules, and renders their structured results for the terminal.
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PACKAGE_ROOT } from './paths.js';
import { readFileSafe } from './file-utils.js';
import { install } from './install.js';
import { uninstall } from './uninstall.js';
import { doctor } from './doctor.js';

const OPTIONS = {
  target: { type: 'string' },
  force: { type: 'boolean', default: false },
  'update-gitignore': { type: 'boolean', default: false },
  commit: { type: 'boolean', default: false },
  'no-claude': { type: 'boolean', default: false },
  'no-opencode': { type: 'boolean', default: false },
  'no-copilot': { type: 'boolean', default: false },
  'no-generic': { type: 'boolean', default: false },
  'keep-reports': { type: 'boolean', default: false },
  verbose: { type: 'boolean', default: false },
  help: { type: 'boolean', short: 'h', default: false },
  version: { type: 'boolean', short: 'v', default: false },
};

function getVersion() {
  try {
    const pkg = JSON.parse(readFileSafe(path.join(PACKAGE_ROOT, 'package.json')) || '{}');
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const HELP = `Universal Refactor Skill

Usage:
  universal-refactor-skill install [options]

Options:
  --update-gitignore
  --commit
  --force
  --verbose
  -h, --help`;

// Canonical install root reported to users. The installer writes several
// adapter files too, but this directory is the single source of truth users
// care about; --verbose expands the full file list.
const SKILL_HOME = '.agent/universal-refactor/';

function bullet(list, indent = '- ') {
  return list.map((item) => `${indent}${item}`).join('\n');
}

/**
 * Render the install result for the terminal.
 *
 * Produces the stable, documented success output. With `verbose` the full
 * per-file breakdown and ignore entries are shown; otherwise a concise summary.
 *
 * @param {object} res Structured result from install().
 * @param {object} [opts]
 * @param {boolean} [opts.verbose] Show the full file list and ignore entries.
 */
function formatInstall(res, opts = {}) {
  const verbose = !!opts.verbose;
  const out = [];

  out.push(res.committed
    ? 'Universal Refactor Skill installed.'
    : 'Universal Refactor Skill installed locally.');
  out.push('');

  if (verbose) {
    out.push(`Mode: ${res.modeLabel}`);
    out.push(`Target: ${res.target}`);
    out.push('');
  }

  const touched = res.created.length + res.overwritten.length;
  out.push('Installed:');
  if (verbose && touched) {
    if (res.created.length) out.push(bullet(res.created));
    if (res.overwritten.length) out.push(bullet(res.overwritten));
  } else if (touched) {
    out.push(`- ${SKILL_HOME}`);
  } else {
    out.push('- (nothing new — all files already present)');
  }
  out.push('');

  if (verbose && res.skipped.length) {
    out.push('Skipped (already present — use --force to overwrite):');
    out.push(bullet(res.skipped));
    out.push('');
  }

  if (res.ignoredVia) {
    out.push(res.committed ? 'Ignored through:' : 'Ignored locally through:');
    out.push(`- ${res.ignoredVia}`);
    if (verbose) out.push(bullet(res.ignoreEntries, '    '));
    out.push('');
  }

  if (res.committed) {
    out.push('NOTE: --commit mode — skill files are intended to be COMMITTED.');
    out.push('Only .refactor/ (generated reports) is ignored.');
  } else {
    out.push('No tracked project files were modified.');
  }

  for (const w of res.warnings) out.push(`\n! ${w}`);

  return out.join('\n');
}

function formatUninstall(res) {
  const out = [];
  out.push('Universal Refactor Skill uninstalled.');
  out.push('');
  out.push(`Target: ${res.target}`);
  out.push('');
  if (res.removed.length) {
    out.push('Removed:');
    out.push(bullet(res.removed));
  } else {
    out.push('Nothing to remove (no installed files found).');
  }
  if (res.kept.length) {
    out.push('');
    out.push('Kept:');
    out.push(bullet(res.kept));
  }
  for (const w of res.warnings) out.push(`\n! ${w}`);
  return out.join('\n');
}

function mark(ok) {
  return ok ? '[x]' : '[ ]';
}

function formatDoctor(res) {
  const out = [];
  out.push('Universal Refactor Skill — doctor');
  out.push('');
  out.push(`Target: ${res.target}`);
  out.push(`Git repository: ${res.isGitRepo ? 'yes' : 'no'}`);
  out.push('');
  out.push('Installation:');
  out.push(`  ${mark(res.coreInstalled)} core skill (.agent/universal-refactor/)`);
  out.push(`  ${mark(res.generic)} generic adapter (.agent/universal-refactor/README.md)`);
  out.push(`  ${mark(res.claude)} Claude adapter (.claude/skills/universal-refactor/)`);
  out.push(`  ${mark(res.opencode)} OpenCode adapter (.opencode/)`);
  out.push(`  ${mark(res.copilot)} Copilot adapter (.github/instructions/)`);
  out.push(`  ${mark(res.reports)} reports directory (.refactor/)`);
  out.push('');
  out.push('Ignore rules:');
  out.push(`  ${mark(res.ignoredInExclude)} .git/info/exclude`);
  out.push(`  ${mark(res.ignoredInGitignore)} .gitignore`);
  out.push('');
  if (!res.coreInstalled) {
    out.push('Not installed. Run:');
    out.push('  npx universal-refactor-skill install');
  } else {
    out.push('Suggested usage:');
    out.push('  Claude Code: ask the agent to use the universal refactor skill.');
    out.push('  OpenCode:    /refactor');
    out.push('  Generic:     read .agent/universal-refactor/core/SKILL.md');
  }
  return out.join('\n');
}

function adaptersFrom(values) {
  return {
    claude: !values['no-claude'],
    opencode: !values['no-opencode'],
    copilot: !values['no-copilot'],
    generic: !values['no-generic'],
  };
}

/**
 * Run the CLI.
 * @param {string[]} argv Arguments after `node script` (default: process.argv).
 * @returns {Promise<number>} Process exit code.
 */
export async function main(argv = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true });
  } catch (err) {
    console.error(`Error: ${err.message}\n`);
    console.error(HELP);
    return 1;
  }

  const { values, positionals } = parsed;

  if (values.version) {
    console.log(getVersion());
    return 0;
  }

  let command = positionals[0];
  if (!command) command = values.help ? 'help' : 'help';
  if (values.help && command !== 'help') {
    // `<command> --help` shows global help too.
    console.log(HELP);
    return 0;
  }

  switch (command) {
    case 'install': {
      const result = install({
        target: values.target,
        force: values.force,
        updateGitignore: values['update-gitignore'],
        commit: values.commit,
        adapters: adaptersFrom(values),
      });
      console.log(formatInstall(result, { verbose: values.verbose }));
      return 0;
    }
    case 'uninstall': {
      const result = uninstall({
        target: values.target,
        keepReports: values['keep-reports'],
      });
      console.log(formatUninstall(result));
      return 0;
    }
    case 'doctor': {
      const result = doctor({ target: values.target });
      console.log(formatDoctor(result));
      return 0;
    }
    case 'help':
      console.log(HELP);
      return 0;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.error(HELP);
      return 1;
  }
}
