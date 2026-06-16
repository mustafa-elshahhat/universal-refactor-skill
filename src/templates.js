// Single source of truth for what the installer writes into a target project.
// install.js, uninstall.js, and doctor.js all derive their behaviour from the
// manifest produced here, so they can never drift apart.
//
// Destination paths use forward slashes. They are safe to pass to
// path.resolve()/path.join() on Windows (Node normalises them) and they double
// as Git ignore entries, which always use forward slashes.
import { templatePath } from './paths.js';

/** Root of the installed, canonical skill content inside a target project. */
export const SKILL_HOME = '.agent/universal-refactor';
/** Directory where the skill writes its generated refactor reports. */
export const REPORTS_DIR = '.refactor';

const CORE_FILES = [
  'SKILL.md',
  'REFACTOR_WORKFLOW.md',
  'REAL_REFACTOR_CONTRACT.md',
  'AUDIT_CHECKLIST.md',
  'ARCHITECTURE_CHECKLIST.md',
  'DEAD_CODE_CHECKLIST.md',
  'COMPLEXITY_CHECKLIST.md',
  'DEPENDENCY_CHECKLIST.md',
  'REPORT_TEMPLATE.md',
];

const PROMPT_FILES = [
  'refactor-audit.md',
  'refactor-plan.md',
  'refactor-implement.md',
  'refactor-verify.md',
];

function normalizeAdapters(adapters = {}) {
  return {
    claude: adapters.claude !== false,
    opencode: adapters.opencode !== false,
    copilot: adapters.copilot !== false,
    generic: adapters.generic !== false,
  };
}

/**
 * Build the install manifest.
 *
 * @param {object} options
 * @param {'local'|'commit'} [options.mode] Selects file set + ignore entries.
 * @param {object} [options.adapters] Per-adapter enable flags (default: all on).
 * @returns {{ files: Array<{id:string, dest:string, src?:string, content?:string}>, ignoreEntries: string[] }}
 */
export function buildManifest(options = {}) {
  const mode = options.mode === 'commit' ? 'commit' : 'local';
  const want = normalizeAdapters(options.adapters);
  const files = [];

  // Canonical core content — always installed.
  for (const f of CORE_FILES) {
    files.push({ id: `core/${f}`, src: templatePath('core', f), dest: `${SKILL_HOME}/core/${f}` });
  }

  // Workflow phase prompts — always installed.
  for (const f of PROMPT_FILES) {
    files.push({ id: `prompts/${f}`, src: templatePath('prompts', f), dest: `${SKILL_HOME}/prompts/${f}` });
  }

  // Keep the (otherwise empty) reports directory present in checkouts.
  files.push({ id: 'reports-keep', content: '', dest: `${REPORTS_DIR}/.gitkeep` });

  // Generic adapter: a local README/entrypoint for any markdown-aware agent.
  if (want.generic) {
    files.push({
      id: 'generic/readme',
      src: templatePath('adapters', 'generic', 'UNIVERSAL_REFACTOR.md'),
      dest: `${SKILL_HOME}/README.md`,
    });
  }

  // Claude Code adapter.
  if (want.claude) {
    files.push({
      id: 'claude/skill',
      src: templatePath('adapters', 'claude', 'SKILL.md'),
      dest: '.claude/skills/universal-refactor/SKILL.md',
    });
  }

  // OpenCode adapter (agent + slash command).
  if (want.opencode) {
    files.push({
      id: 'opencode/agent',
      src: templatePath('adapters', 'opencode', 'agents', 'refactor.md'),
      dest: '.opencode/agents/refactor.md',
    });
    files.push({
      id: 'opencode/command',
      src: templatePath('adapters', 'opencode', 'commands', 'refactor.md'),
      dest: '.opencode/commands/refactor.md',
    });
  }

  // GitHub Copilot adapter (repo-local instructions, never clobbers the user's
  // own copilot-instructions.md).
  if (want.copilot) {
    files.push({
      id: 'copilot/instructions',
      src: templatePath('adapters', 'copilot', 'universal-refactor.instructions.md'),
      dest: '.github/instructions/universal-refactor.instructions.md',
    });
  }

  // Root AGENTS.md is a conventionally *tracked* file, so it is only written in
  // commit mode where the user has opted into committing the skill.
  if (want.generic && mode === 'commit') {
    files.push({
      id: 'generic/agents',
      src: templatePath('adapters', 'generic', 'AGENTS.md'),
      dest: 'AGENTS.md',
    });
  }

  // Ignore entries. In commit mode only the generated reports are ignored.
  let ignoreEntries;
  if (mode === 'commit') {
    ignoreEntries = [`${REPORTS_DIR}/`];
  } else {
    ignoreEntries = [`${SKILL_HOME}/`, `${REPORTS_DIR}/`];
    if (want.claude) ignoreEntries.push('.claude/skills/universal-refactor/');
    if (want.opencode) ignoreEntries.push('.opencode/agents/refactor.md', '.opencode/commands/refactor.md');
    if (want.copilot) ignoreEntries.push('.github/instructions/universal-refactor.instructions.md');
  }

  return { files, ignoreEntries };
}
