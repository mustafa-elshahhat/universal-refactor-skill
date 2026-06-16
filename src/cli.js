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

const HELP = `universal-refactor-skill — agent-agnostic project refactor skill pack

USAGE
  universal-refactor-skill <command> [options]

COMMANDS
  install      Install the refactor skill pack into a project (default: cwd).
  uninstall    Remove files this package installed from a project.
  doctor       Report installation status for a project.
  help         Show this help.

INSTALL OPTIONS
  --target <path>      Install into a specific project path (default: cwd).
  --force              Overwrite existing installed files.
  --update-gitignore   Write ignore rules into .gitignore instead of only
                       .git/info/exclude.
  --commit             Install files intended to be committed to the repo.
                       (Skill files are NOT ignored; only .refactor/ is.)
  --no-claude          Skip the Claude Code adapter.
  --no-opencode        Skip the OpenCode adapter.
  --no-copilot         Skip the GitHub Copilot adapter.
  --no-generic         Skip the generic AGENTS.md-style adapter.

UNINSTALL OPTIONS
  --target <path>      Uninstall from a specific project path (default: cwd).
  --keep-reports       Keep the .refactor/ reports directory.

GLOBAL OPTIONS
  -h, --help           Show this help.
  -v, --version        Print the version.

EXAMPLES
  # Default: local-only install, ignored via .git/info/exclude
  npx universal-refactor-skill install

  # Local install, ignore rules written into .gitignore
  npx universal-refactor-skill install --update-gitignore

  # Team mode: install files intended to be committed
  npx universal-refactor-skill install --commit

  # Overwrite a previous install
  npx universal-refactor-skill install --force

This package does not refactor your code by itself. It installs a strict,
reusable refactor skill pack that coding agents can follow inside your project.`;

const USAGE_FOOTER = `Usage:
Claude Code:
  claude "Use the universal refactor skill installed in this repository. Run the audit first, create a refactor plan, then implement safe evidence-based refactors phase by phase."
OpenCode:
  /refactor
Generic:
  Read .agent/universal-refactor/core/SKILL.md and follow the workflow.`;

function bullet(list, indent = '- ') {
  return list.map((item) => `${indent}${item}`).join('\n');
}

function formatInstall(res) {
  const out = [];
  out.push('Universal Refactor Skill installed.');
  out.push('');
  out.push(`Mode: ${res.modeLabel}`);
  out.push(`Target: ${res.target}`);
  out.push('');

  if (res.created.length) {
    out.push('Created:');
    out.push(bullet(res.created));
    out.push('');
  }
  if (res.overwritten.length) {
    out.push('Overwritten:');
    out.push(bullet(res.overwritten));
    out.push('');
  }
  if (res.skipped.length) {
    out.push('Skipped (already present — use --force to overwrite):');
    out.push(bullet(res.skipped));
    out.push('');
  }

  if (res.ignoredVia) {
    out.push('Ignored through:');
    out.push(`- ${res.ignoredVia}`);
    out.push(bullet(res.ignoreEntries, '    '));
    out.push('');
  }

  if (res.committed) {
    out.push('NOTE: --commit mode — skill files are intended to be COMMITTED.');
    out.push('Only .refactor/ (generated reports) is ignored.');
  } else {
    out.push('No tracked project files were modified.');
  }
  out.push('');

  for (const w of res.warnings) out.push(`! ${w}`);
  if (res.warnings.length) out.push('');

  out.push(USAGE_FOOTER);
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
      console.log(formatInstall(result));
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
