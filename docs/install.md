# Install & CLI Reference

The CLI has four commands: `install`, `uninstall`, `doctor`, and `help`. It is
pure Node.js (no dependencies) and runs the same on Windows, macOS, and Linux.

## Running it

```bash
# via npm
npx universal-refactor-skill@latest <command> [options]

# via GitHub
npx github:mustafa-elshahhat/universal-refactor-skill <command> [options]

# from a clone
node bin/universal-refactor-skill.js <command> [options]
```

If installed globally (`npm i -g universal-refactor-skill`), the command
`universal-refactor-skill` is available directly.

## `install`

Installs the skill pack into a project (default: current directory).

| Option | Description |
| --- | --- |
| `--target <path>` | Install into a specific project path. Default: cwd. |
| `--force` | Overwrite existing installed files. |
| `--update-gitignore` | Write ignore rules into `.gitignore` instead of only `.git/info/exclude`. |
| `--commit` | Install files intended to be committed (skill files are **not** ignored; only `.refactor/` is). |
| `--no-claude` | Skip the Claude Code adapter. |
| `--no-opencode` | Skip the OpenCode adapter. |
| `--no-copilot` | Skip the GitHub Copilot adapter. |
| `--no-generic` | Skip the generic adapter (`.agent/.../README.md` and, in commit mode, root `AGENTS.md`). |

What gets installed (default):

```text
.agent/universal-refactor/
├─ core/      (SKILL.md + workflow + checklists + report template)
├─ prompts/   (audit, plan, implement, verify)
└─ README.md  (generic entrypoint)
.refactor/.gitkeep
.claude/skills/universal-refactor/SKILL.md
.opencode/agents/refactor.md
.opencode/commands/refactor.md
.github/instructions/universal-refactor.instructions.md
```

In `--commit` mode, a root `AGENTS.md` is also written (merge it into your own if
you already have one).

The installer is **idempotent**: it creates only what is missing, skips existing
files (unless `--force`), and never duplicates ignore entries.

## `uninstall`

Removes files this package installed (default: current directory).

| Option | Description |
| --- | --- |
| `--target <path>` | Uninstall from a specific project path. Default: cwd. |
| `--keep-reports` | Keep the `.refactor/` reports directory. |

Uninstall also removes the managed ignore block from `.git/info/exclude` and/or
`.gitignore`, and prunes now-empty directories it created. It never removes
unrelated user files.

## `doctor`

Reports installation status for a project: which adapters are present, whether
the reports directory exists, and whether ignore rules are in place. Accepts
`--target <path>`.

## `help`

Prints usage. Also available as `-h` / `--help`. `-v` / `--version` prints the
version.

## Exit codes

`0` on success; `1` on a bad/unknown command or invalid arguments.
