# Universal Refactor Skill (installed locally)

This folder contains a strict, reusable, **agent-agnostic** refactor skill pack
for this repository. Any markdown-aware coding agent can use it.

> This skill does not refactor your code by itself. It tells a coding agent
> exactly how to perform a real, safe, evidence-based refactor in this project.

## Start here

Read **`core/SKILL.md`** — it is the source of truth. Then follow the workflow in
`core/REFACTOR_WORKFLOW.md`, using the checklists alongside it.

```
core/
  SKILL.md                  <- read this first
  REFACTOR_WORKFLOW.md      <- the 9-step workflow
  REAL_REFACTOR_CONTRACT.md <- what counts as a real refactor
  AUDIT_CHECKLIST.md
  ARCHITECTURE_CHECKLIST.md
  DEAD_CODE_CHECKLIST.md
  COMPLEXITY_CHECKLIST.md
  DEPENDENCY_CHECKLIST.md
  REPORT_TEMPLATE.md
prompts/
  refactor-audit.md         <- phase 1: audit (read-only)
  refactor-plan.md          <- phase 2: plan
  refactor-implement.md     <- phase 3: implement
  refactor-verify.md        <- phase 4: verify
```

## How to run it (any agent)

1. Tell the agent: *"Read `.agent/universal-refactor/core/SKILL.md` and follow
   the workflow. Start with the audit; do not edit code yet."*
2. Have it work through the four prompts in `prompts/`, in order.
3. The agent writes its working artifacts to `.refactor/`:
   `01-project-map.md`, `02-baseline.md`, `03-audit-report.md`,
   `04-refactor-plan.md`, `05-implementation-log.md`, `06-final-report.md`.

## The rules in one paragraph

A valid refactor improves architecture, maintainability, simplicity, dead-code
removal, dependency hygiene, or complexity — while preserving intended behavior.
Nothing is deleted unless it is **proven** unused; unproven items are marked
`MANUAL REVIEW`. No big-bang rewrites, no new frameworks, no unjustified
dependencies, and tests are never removed or errors silenced to make checks pass.
Formatting, import sorting, and rename-only edits do not count as a refactor.

## Agent adapters

If installed, these point back to this core:

- Claude Code: `.claude/skills/universal-refactor/SKILL.md`
- OpenCode: `.opencode/agents/refactor.md`, `.opencode/commands/refactor.md` (`/refactor`)
- GitHub Copilot: `.github/instructions/universal-refactor.instructions.md`

These files are local by default and ignored from version control. See the
package README for install modes (`--update-gitignore`, `--commit`).
