# Universal Refactor Skill

Agent-agnostic, evidence-based **project refactor skill pack** that installs into
any repository and works with multiple coding agents.

> **This package does not refactor your code by itself. It installs a strict,
> reusable refactor skill pack that coding agents can follow inside your
> project.**

[![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## What it is

A small CLI that drops a **canonical refactor skill** (plus per-agent adapters)
into your project. The skill instructs any coding agent to perform a **real,
safe, evidence-based refactor** on any stack — remove proven dead code, prune
unused dependencies, fix architecture boundary violations, reduce complexity, and
split oversized modules — **while preserving intended behavior**.

By default the installed files are **local-only** and ignored from version
control, so they never pollute your repository history unless you opt in.

## What it is **not**

- It is **not** a formatter, linter, or import sorter.
- It is **not** an autonomous bot that edits your code on its own — *you* run an
  agent against the installed skill.
- It does **not** lock you into a single vendor — it is agent-agnostic.

## Supported agents

| Agent | Installed adapter |
| --- | --- |
| Claude Code | `.claude/skills/universal-refactor/SKILL.md` |
| OpenCode | `.opencode/agents/refactor.md`, `.opencode/commands/refactor.md` (`/refactor`) |
| GitHub Copilot | `.github/instructions/universal-refactor.instructions.md` |
| Generic / any markdown-aware agent | `.agent/universal-refactor/` (+ `AGENTS.md` in commit mode) |

All adapters point back to one canonical core at
`.agent/universal-refactor/core/SKILL.md`, so behavior never conflicts.

## Installation

From npm:

```bash
npx universal-refactor-skill@latest install
```

From GitHub:

```bash
npx --yes --package github:mustafa-elshahhat/universal-refactor-skill universal-refactor-skill install
```

Run it from the root of the project you want to add the skill to.

## Default ignore behavior

By default the install is **local-only**:

- Files are installed into the target project.
- Ignore rules are added to **`.git/info/exclude`** (created if missing) when the
  target is a Git repository — entries are wrapped in a managed, de-duplicated
  block.
- **`.gitignore` is not modified.**
- **No tracked source files are modified**, and no tracked files are created
  (root `AGENTS.md` is only written in `--commit` mode).

If the target is not a Git repository, files are still installed and a warning is
printed (use `--update-gitignore` to write a `.gitignore` instead).

See [`docs/ignore-behavior.md`](docs/ignore-behavior.md) for details.

## Install modes

```bash
# Default: local-only install, ignored through .git/info/exclude
npx universal-refactor-skill install

# Local install AND write ignore rules into .gitignore
npx universal-refactor-skill install --update-gitignore

# Team/repository mode: install files intended to be committed
#   (skill files are NOT ignored; only .refactor/ reports are)
npx universal-refactor-skill install --commit

# Overwrite previously installed files
npx universal-refactor-skill install --force
```

Other flags: `--target <path>`, `--no-claude`, `--no-opencode`, `--no-copilot`,
`--no-generic`. See [`docs/install.md`](docs/install.md).

The installer is **idempotent** — running it again creates only what's missing,
never duplicates ignore entries, and never overwrites your edits without
`--force`.

## Usage

### Claude Code

The skill is auto-discoverable. Just ask:

```bash
claude "Use the universal refactor skill installed in this repository. Run the audit first, create a refactor plan, then implement safe evidence-based refactors phase by phase."
```

### OpenCode

```text
/refactor
```

### GitHub Copilot

Copilot picks up `.github/instructions/universal-refactor.instructions.md`
automatically. Ask it to "refactor this repository following the universal
refactor instructions". (Your own `.github/copilot-instructions.md` is never
overwritten — an optional snippet to merge is shipped in the package.)

### Any other agent

```text
Read .agent/universal-refactor/core/SKILL.md and follow the workflow.
```

## What counts as a real refactor

A valid refactor must improve **at least one** of: proven dead-code removal,
proven unused-dependency removal, complexity reduction, splitting oversized
units, moving misplaced logic, fixing architecture boundaries, reducing
duplication, or simplifying over-engineering — **while preserving behavior**.

Formatting, import sorting, comment edits, and rename-only changes **do not
count** on their own. See
[`.agent/universal-refactor/core/REAL_REFACTOR_CONTRACT.md`](templates/core/REAL_REFACTOR_CONTRACT.md).

## Safety model

The skill enforces strict rules:

- Do not guess; if usage cannot be proven, mark it **`MANUAL REVIEW`** instead of
  deleting.
- Delete only what is **proven** unused (imports, exports, dynamic/reflection/
  string usage, routes, config, assets, tests all checked).
- Preserve intended behavior and public contracts unless the user approves a
  change.
- No big-bang rewrites, no new frameworks, no unjustified dependencies.
- Never remove tests or silence errors to make checks pass.
- Capture a **baseline** before changes and re-verify after **every** phase.

## Generated report files

When an agent runs the skill, it writes its working artifacts to `.refactor/`
(ignored by default):

```text
.refactor/
├─ 01-project-map.md
├─ 02-baseline.md
├─ 03-audit-report.md
├─ 04-refactor-plan.md
├─ 05-implementation-log.md
└─ 06-final-report.md
```

## Doctor

Check installation status at any time:

```bash
npx universal-refactor-skill doctor
```

## Uninstall

```bash
npx universal-refactor-skill uninstall            # removes installed files + ignore block
npx universal-refactor-skill uninstall --keep-reports   # keep .refactor/
```

Uninstall removes only files this package installed and never touches unrelated
user files.

## Documentation

- [`docs/install.md`](docs/install.md) — commands and flags
- [`docs/supported-agents.md`](docs/supported-agents.md) — per-agent details
- [`docs/ignore-behavior.md`](docs/ignore-behavior.md) — how ignoring works
- [`docs/examples.md`](docs/examples.md) — end-to-end examples

## Development

```bash
npm test       # node --test (installer tests)
npm run lint   # node --check on all source files
node bin/cli.js --help
```

No runtime dependencies — pure Node.js standard library, cross-platform
(Windows, macOS, Linux).

## License

[MIT](LICENSE) © Mustafa Elshahhat
