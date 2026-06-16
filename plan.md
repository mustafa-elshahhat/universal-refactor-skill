# Universal Refactor Skill Pack — Implementation Plan

## Goal

Build a publishable, agent-agnostic **Universal Refactor Skill Pack** that can be installed inside any software project and used by different coding agents such as Claude Code, OpenCode, GitHub Copilot, Aider-like agents, and generic CLI coding agents.

The skill must guide agents to perform a real, safe, evidence-based full-project refactor across any stack. It must not be limited to formatting, import cleanup, or shallow code edits.

The installed skill files must be local and ignored by default so they do not pollute the target repository Git history unless the user explicitly opts into committing them.

---

## Execution Instructions for the Coding Agent

You are implementing this repository. Do not treat this as a brainstorming task.

Work in the current repository. If the repository is empty, create the full project. If files already exist, inspect them first, preserve useful existing content, and update the project to match this plan.

Do not ask for confirmation before implementing. Make reasonable implementation decisions when details are missing, but keep the implementation simple, maintainable, cross-platform, and well documented.

At the end, run available checks and provide a concise final report containing changed files, created files, verification commands, and any known limitations.

---

## Product Name

Use this package name unless the existing repository already has a better matching name:

```txt
universal-refactor-skill
```

CLI command name:

```txt
universal-refactor-skill
```

Main install command:

```bash
npx universal-refactor-skill@latest install
```

GitHub direct install command example:

```bash
npx github:mustafa-elshahhat/universal-refactor-skill install
```

---

## Core Requirements

### 1. Agent-agnostic design

The package must not depend on Claude only.

It must install a shared core skill plus adapters for common coding agents:

- Claude Code
- OpenCode
- GitHub Copilot
- Generic Markdown-aware agents

The shared core content must live in one canonical template folder. Agent-specific files should reference or mirror the core instructions without creating conflicting behavior.

### 2. Stack-agnostic refactor workflow

The skill must work with any project stack by instructing the agent to detect the stack from repository files, such as:

- `package.json`
- `pnpm-lock.yaml`
- `yarn.lock`
- `package-lock.json`
- `.csproj`
- `.sln`
- `pom.xml`
- `build.gradle`
- `requirements.txt`
- `pyproject.toml`
- `go.mod`
- `Cargo.toml`
- `composer.json`
- Docker files
- CI configuration

The skill must not assume React, .NET, Node, Python, Java, or any specific framework.

### 3. Real refactor, not cosmetic cleanup

The installed skill must clearly define that a valid refactor must improve at least one of the following:

- Remove proven unused files.
- Remove proven unused functions, classes, components, services, constants, types, helpers, routes, or modules.
- Remove proven unused dependencies.
- Reduce excessive complexity.
- Split oversized files, functions, classes, services, hooks, components, or modules.
- Move misplaced logic to the correct folder, layer, module, or responsibility area.
- Fix architecture boundary violations.
- Reduce duplicated logic without creating unnecessary abstraction.
- Simplify over-engineered patterns.
- Improve naming, organization, discoverability, and maintainability.
- Preserve intended behavior while making the project easier to understand and modify.

The skill must explicitly say that formatting, import sorting, comment edits, or renaming alone are not enough to count as real refactor.

### 4. Safety-first behavior

The skill must enforce these rules:

- Do not guess.
- Do not delete anything unless it is proven unused.
- Do not change intended behavior unless a bug is proven or the user explicitly requests it.
- Do not perform a big-bang rewrite.
- Do not introduce new frameworks.
- Do not add dependencies unless necessary and justified.
- Do not remove tests to make checks pass.
- Do not silence errors without fixing the cause.
- Do not replace the architecture just because another style is popular.
- If usage cannot be proven, mark the item as manual-review instead of deleting it.

### 5. Ignored by default

When installed inside a target project, skill files and generated refactor reports must be ignored by default.

Default behavior must be local-only:

- Install files into the target project.
- Add ignore rules to `.git/info/exclude` when the target project is a Git repository.
- Do not modify `.gitignore` by default.
- Do not modify tracked source files during installation.
- Do not create tracked project files unless the user passes an explicit flag.

Supported install modes:

```bash
# Default: local-only install, ignored through .git/info/exclude
npx universal-refactor-skill install

# Local install and write ignore rules into .gitignore
npx universal-refactor-skill install --update-gitignore

# Team/repository mode: install files intended to be committed
npx universal-refactor-skill install --commit

# Overwrite previously installed files
npx universal-refactor-skill install --force
```

### 6. Cross-platform

The CLI must work on:

- Windows
- macOS
- Linux

Use Node.js standard libraries where possible. Do not rely on Bash-only behavior.

### 7. Idempotent installer

Running the installer multiple times must be safe.

The installer must:

- Create missing directories.
- Create missing files.
- Avoid duplicate ignore entries.
- Avoid overwriting user-modified files unless `--force` is passed.
- Print clear output about what was created, skipped, overwritten, or ignored.

---

## Expected Repository Structure

Create or update the project to use this structure:

```txt
universal-refactor-skill/
├─ README.md
├─ LICENSE
├─ package.json
├─ bin/
│  └─ universal-refactor-skill.js
├─ src/
│  ├─ cli.js
│  ├─ install.js
│  ├─ uninstall.js
│  ├─ doctor.js
│  ├─ paths.js
│  ├─ file-utils.js
│  └─ templates.js
├─ templates/
│  ├─ core/
│  │  ├─ SKILL.md
│  │  ├─ REFACTOR_WORKFLOW.md
│  │  ├─ REAL_REFACTOR_CONTRACT.md
│  │  ├─ AUDIT_CHECKLIST.md
│  │  ├─ ARCHITECTURE_CHECKLIST.md
│  │  ├─ DEAD_CODE_CHECKLIST.md
│  │  ├─ COMPLEXITY_CHECKLIST.md
│  │  ├─ DEPENDENCY_CHECKLIST.md
│  │  └─ REPORT_TEMPLATE.md
│  ├─ adapters/
│  │  ├─ claude/
│  │  │  └─ SKILL.md
│  │  ├─ opencode/
│  │  │  ├─ agents/
│  │  │  │  └─ refactor.md
│  │  │  └─ commands/
│  │  │     └─ refactor.md
│  │  ├─ copilot/
│  │  │  ├─ copilot-instructions.md
│  │  │  └─ universal-refactor.instructions.md
│  │  └─ generic/
│  │     ├─ AGENTS.md
│  │     └─ UNIVERSAL_REFACTOR.md
│  └─ prompts/
│     ├─ refactor-audit.md
│     ├─ refactor-plan.md
│     ├─ refactor-implement.md
│     └─ refactor-verify.md
├─ test/
│  ├─ installer.test.js
│  └─ fixtures/
│     └─ empty-project/
└─ docs/
   ├─ install.md
   ├─ supported-agents.md
   ├─ ignore-behavior.md
   └─ examples.md
```

If a simpler structure is already present, keep it only if it fully satisfies this plan.

---

## Target Project Installation Layout

When installed into another project, create the following local files by default:

```txt
.agent/
└─ universal-refactor/
   ├─ core/
   │  ├─ SKILL.md
   │  ├─ REFACTOR_WORKFLOW.md
   │  ├─ REAL_REFACTOR_CONTRACT.md
   │  ├─ AUDIT_CHECKLIST.md
   │  ├─ ARCHITECTURE_CHECKLIST.md
   │  ├─ DEAD_CODE_CHECKLIST.md
   │  ├─ COMPLEXITY_CHECKLIST.md
   │  ├─ DEPENDENCY_CHECKLIST.md
   │  └─ REPORT_TEMPLATE.md
   ├─ prompts/
   │  ├─ refactor-audit.md
   │  ├─ refactor-plan.md
   │  ├─ refactor-implement.md
   │  └─ refactor-verify.md
   └─ README.md

.refactor/
└─ .gitkeep
```

Also install agent adapters when applicable:

```txt
.claude/
└─ skills/
   └─ universal-refactor/
      └─ SKILL.md

.opencode/
├─ agents/
│  └─ refactor.md
└─ commands/
   └─ refactor.md

.github/
└─ instructions/
   └─ universal-refactor.instructions.md
```

Default ignore entries:

```gitignore
# Universal Refactor Skill local files
.agent/universal-refactor/
.refactor/
.claude/skills/universal-refactor/
.opencode/agents/refactor.md
.opencode/commands/refactor.md
.github/instructions/universal-refactor.instructions.md
```

By default, add these entries to:

```txt
.git/info/exclude
```

Only add them to `.gitignore` when the user passes:

```bash
--update-gitignore
```

In `--commit` mode, do not add the installed skill files to ignore. However, still ignore `.refactor/` because generated reports are local run outputs by default.

---

## CLI Requirements

Implement a Node.js CLI.

### package.json

Required behavior:

```json
{
  "name": "universal-refactor-skill",
  "version": "0.1.0",
  "description": "Agent-agnostic universal project refactor skill pack with safe local installation.",
  "bin": {
    "universal-refactor-skill": "bin/universal-refactor-skill.js"
  },
  "type": "module"
}
```

Add scripts:

```json
{
  "scripts": {
    "test": "node --test",
    "lint": "node --check bin/universal-refactor-skill.js && node --check src/cli.js && node --check src/install.js && node --check src/uninstall.js && node --check src/doctor.js"
  }
}
```

Use no external dependencies unless there is a clear reason.

### Commands

Implement these commands:

```bash
universal-refactor-skill install
universal-refactor-skill uninstall
universal-refactor-skill doctor
universal-refactor-skill help
```

### install options

```bash
--target <path>          Install into a specific project path. Default: current working directory.
--force                  Overwrite existing installed files.
--update-gitignore       Write ignore rules into .gitignore instead of only .git/info/exclude.
--commit                 Install files as repository files intended to be committed.
--no-claude              Skip Claude adapter.
--no-opencode            Skip OpenCode adapter.
--no-copilot             Skip Copilot adapter.
--no-generic             Skip generic AGENTS.md-style adapter.
```

### uninstall options

```bash
--target <path>          Uninstall from a specific project path. Default: current working directory.
--keep-reports           Keep .refactor/ reports.
```

Uninstall must remove files created by the installer when safe. It must not remove user files that are not part of this package.

### doctor command

The doctor command must inspect the current project and report:

- Whether `.agent/universal-refactor/` exists.
- Whether Claude adapter exists.
- Whether OpenCode adapter exists.
- Whether Copilot adapter exists.
- Whether ignore entries exist in `.git/info/exclude` or `.gitignore`.
- Whether `.refactor/` exists.
- Suggested usage commands.

---

## Core Template Content Requirements

### templates/core/SKILL.md

Create a concise but strong entrypoint file.

It must include:

- Skill identity.
- When to use the skill.
- Absolute safety rules.
- Required workflow.
- Evidence requirements.
- Verification requirements.
- Link/reference to the supporting files installed beside it.

The content must be direct and command-oriented.

Required opening concept:

```md
# Universal Project Refactor Skill

You are a cautious senior refactoring agent.

Your task is to perform a real, evidence-based project refactor while preserving intended behavior.

This is not a formatting cleanup skill. A valid refactor must improve architecture, maintainability, simplicity, dead-code removal, dependency hygiene, or complexity.
```

### templates/core/REAL_REFACTOR_CONTRACT.md

Define what counts and what does not count as real refactor.

Must explicitly state:

- Formatting-only changes are not enough.
- Import cleanup alone is not enough.
- Rename-only changes are not enough.
- A valid refactor must improve structure, behavior preservation, maintainability, complexity, architecture boundaries, or dead-code removal.

### templates/core/REFACTOR_WORKFLOW.md

Must define this sequence:

1. Repository inspection.
2. Stack detection.
3. Baseline verification.
4. Project inventory.
5. Deep audit.
6. Refactor plan.
7. Incremental implementation.
8. Phase verification.
9. Final report.

### templates/core/AUDIT_CHECKLIST.md

Must cover:

- unused files
- unused code
- duplicated logic
- oversized modules
- misplaced responsibilities
- inconsistent patterns
- missing tests around risky areas
- unclear naming
- stale docs/config
- generated files accidentally committed

### templates/core/ARCHITECTURE_CHECKLIST.md

Must cover common architecture violations across stacks:

- UI/presentation layer directly accessing persistence.
- Controllers/routes containing heavy business logic.
- Domain/business layer depending on infrastructure when architecture intends the reverse.
- Services mixing validation, persistence, formatting, transport, and business rules.
- Shared folders becoming dumping grounds.
- Circular dependencies.
- Feature code importing from unrelated features without a stable boundary.
- Tests depending on implementation details too tightly.

### templates/core/DEAD_CODE_CHECKLIST.md

Must define evidence required before deleting:

- No imports.
- No exports used by entrypoints.
- No dynamic references found.
- No route references.
- No config references.
- No test references.
- No asset references.
- No reflection/string-based usage found for stacks where relevant.

If not proven, mark as manual review.

### templates/core/COMPLEXITY_CHECKLIST.md

Must cover:

- long functions
- deeply nested conditionals
- high parameter count
- boolean flag behavior switches
- repeated condition chains
- large components/classes/services
- excessive abstraction
- single-use abstraction
- unclear side effects
- mixed responsibilities

### templates/core/DEPENDENCY_CHECKLIST.md

Must cover:

- unused dependencies
- duplicated libraries for same purpose
- dev dependency vs production dependency placement
- dependency used for trivial code
- outdated config packages that are not referenced
- package scripts that no longer match the project

### templates/core/REPORT_TEMPLATE.md

Must define final reports under `.refactor/`:

```txt
.refactor/
├─ 01-project-map.md
├─ 02-baseline.md
├─ 03-audit-report.md
├─ 04-refactor-plan.md
├─ 05-implementation-log.md
└─ 06-final-report.md
```

Each report must have a clear template with headings.

---

## Prompt Templates Requirements

Create these prompt files:

### templates/prompts/refactor-audit.md

Purpose: audit only, no code changes.

Must instruct the agent to:

- inspect the repository
- create `.refactor/01-project-map.md`
- create `.refactor/02-baseline.md`
- create `.refactor/03-audit-report.md`
- not edit source code
- not delete anything

### templates/prompts/refactor-plan.md

Purpose: turn audit into implementation plan.

Must instruct the agent to:

- read the audit reports
- create `.refactor/04-refactor-plan.md`
- split work into safe phases
- include evidence for each proposed change
- classify risk

### templates/prompts/refactor-implement.md

Purpose: execute the plan.

Must instruct the agent to:

- read `.refactor/04-refactor-plan.md`
- implement phase by phase
- verify after each phase
- update `.refactor/05-implementation-log.md`
- not perform unrelated changes

### templates/prompts/refactor-verify.md

Purpose: final verification.

Must instruct the agent to:

- run available checks
- inspect diffs
- ensure behavior preservation
- create `.refactor/06-final-report.md`

---

## Agent Adapter Requirements

### Claude adapter

Install into:

```txt
.claude/skills/universal-refactor/SKILL.md
```

The Claude adapter should be concise and point to the canonical local core:

```md
# Universal Refactor Skill for Claude Code

Use the core instructions in `.agent/universal-refactor/core/`.

Follow `.agent/universal-refactor/core/SKILL.md` as the source of truth.

Do not perform cosmetic-only cleanup. Perform real, evidence-based refactor only.
```

If Claude Code requires the full skill content in the adapter, duplicate the essential core content safely. Avoid contradiction.

### OpenCode adapter

Install:

```txt
.opencode/agents/refactor.md
.opencode/commands/refactor.md
```

The OpenCode command must instruct OpenCode to run the full workflow using the core skill files.

### Copilot adapter

Install:

```txt
.github/instructions/universal-refactor.instructions.md
```

The Copilot instructions must be repository-local and direct Copilot to follow the core skill files.

Do not overwrite an existing `.github/copilot-instructions.md` by default. If needed, create a separate instructions file instead.

### Generic adapter

Install:

```txt
.agent/universal-refactor/README.md
```

Optionally install or update `AGENTS.md` only in `--commit` mode. Do not create root `AGENTS.md` by default in local-only mode if it would become tracked.

---

## Ignore Behavior Requirements

Implement robust ignore handling.

### Default mode

When a `.git/` directory exists:

- Add ignore entries to `.git/info/exclude`.
- Create `.git/info/exclude` if missing.
- Do not duplicate entries.
- Do not modify `.gitignore`.

When `.git/` does not exist:

- Install files.
- Print a warning that local Git exclude could not be updated because this is not a Git repository.
- Do not create `.gitignore` unless `--update-gitignore` is passed.

### `--update-gitignore`

- Add ignore entries to `.gitignore`.
- Do not duplicate entries.
- Preserve existing `.gitignore` content.
- Add a clear comment block.

### `--commit`

- Install skill files as commit-friendly repository files.
- Do not add skill paths to ignore.
- Still ignore `.refactor/` by default because reports are generated outputs.
- Print a clear warning that files are intended to be committed.

---

## Installer Output Requirements

After install, print output like:

```txt
Universal Refactor Skill installed.

Mode: local-only
Target: <target path>

Created:
- .agent/universal-refactor/core/SKILL.md
- .agent/universal-refactor/core/REFACTOR_WORKFLOW.md
- .claude/skills/universal-refactor/SKILL.md
- .opencode/agents/refactor.md
- .opencode/commands/refactor.md
- .github/instructions/universal-refactor.instructions.md

Ignored through:
- .git/info/exclude

No tracked project files were modified.

Usage:
Claude Code:
claude "Use the universal refactor skill installed in this repository. Run the audit first, create a refactor plan, then implement safe evidence-based refactors phase by phase."

OpenCode:
/refactor

Generic:
Read .agent/universal-refactor/core/SKILL.md and follow the workflow.
```

Adjust the output based on actual skipped/created/overwritten files.

---

## README Requirements

Create a strong `README.md` for the package.

It must include:

- What the tool is.
- What it is not.
- Supported agents.
- Installation from npm.
- Installation from GitHub.
- Default ignore behavior.
- Install modes.
- Usage with Claude Code.
- Usage with OpenCode.
- Usage with Copilot.
- What counts as real refactor.
- Safety model.
- Generated report files.
- Uninstall command.
- License.

Important wording:

```md
This package does not refactor your code by itself. It installs a strict, reusable refactor skill pack that coding agents can follow inside your project.
```

---

## Tests

Use Node's built-in test runner.

Create tests for:

1. Installing into an empty temporary project.
2. Installing into a temporary Git project with `.git/info/exclude`.
3. Ensuring ignore entries are not duplicated.
4. Ensuring existing files are not overwritten without `--force`.
5. Ensuring `--force` overwrites installed files.
6. Ensuring `--update-gitignore` updates `.gitignore`.
7. Ensuring `--commit` does not ignore skill files except `.refactor/`.
8. Ensuring uninstall removes installed files safely.
9. Ensuring doctor reports installation status.

Keep tests simple and deterministic.

---

## Quality Requirements

The implementation must be:

- Simple.
- Maintainable.
- Cross-platform.
- Dependency-light.
- Idempotent.
- Safe by default.
- Clear in terminal output.
- Suitable for publishing to GitHub and npm.

Do not over-engineer.

Avoid unnecessary classes, frameworks, build steps, bundlers, or complex abstractions.

---

## Verification Commands

After implementation, run:

```bash
npm test
npm run lint
node bin/universal-refactor-skill.js help
node bin/universal-refactor-skill.js doctor
```

Also manually test installation into a temporary directory if tests do not already cover it:

```bash
mkdir -p /tmp/urs-test-project
cd /tmp/urs-test-project
git init
node /path/to/universal-refactor-skill/bin/universal-refactor-skill.js install
node /path/to/universal-refactor-skill/bin/universal-refactor-skill.js doctor
```

On Windows, avoid hardcoded `/tmp` in code. Tests should use Node `os.tmpdir()`.

---

## Acceptance Criteria

The task is complete only when:

- The repository contains the CLI package.
- The install command creates the core skill files.
- The install command creates Claude, OpenCode, Copilot, and generic adapters.
- Installed files are ignored by default through `.git/info/exclude` in Git repositories.
- `.gitignore` is not modified by default.
- `--update-gitignore` works.
- `--commit` works.
- The skill content enforces real refactor, not cosmetic cleanup.
- The skill content is stack-agnostic.
- The skill content requires evidence before deletion or architecture changes.
- The skill content requires baseline, audit, plan, incremental implementation, verification, and final reports.
- The installer is idempotent.
- Existing files are not overwritten unless `--force` is used.
- Tests pass.
- README explains usage clearly.
- Final report lists all created/changed files and verification results.

---

## Final Response Required from the Coding Agent

When finished, respond with:

```txt
Implemented Universal Refactor Skill Pack.

Created/changed files:
- ...

CLI commands:
- npx universal-refactor-skill install
- npx universal-refactor-skill install --update-gitignore
- npx universal-refactor-skill install --commit
- npx universal-refactor-skill doctor
- npx universal-refactor-skill uninstall

Verification:
- npm test: <result>
- npm run lint: <result>
- manual install check: <result>

Notes:
- ...
```

Do not include vague claims. Only report what was actually implemented and verified.
