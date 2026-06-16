# AGENTS.md

Guidance for AI coding agents working in this repository.

> This file is installed by the Universal Refactor Skill Pack in **commit mode**.
> If your repository already has an `AGENTS.md`, merge the section below into it
> rather than replacing your own content.

## Refactoring

When asked to refactor, clean up, restructure, de-duplicate, simplify,
reorganize, or improve the maintainability of this repository, follow the local
skill at `.agent/universal-refactor/core/SKILL.md`. It is the source of truth and
applies to any language or stack.

Workflow (`.agent/universal-refactor/core/REFACTOR_WORKFLOW.md`):

1. Inspect the repo and detect the stack from its files (no framework
   assumptions).
2. Record a build/test/lint **baseline** before any change.
3. Audit with the checklists; write findings (with evidence) to `.refactor/`.
4. Plan small, risk-rated, behavior-preserving phases.
5. Implement one phase at a time; re-run build/test/lint after each.
6. Verify and write `.refactor/06-final-report.md`.

Hard rules:

- Do not guess. Delete only **proven**-unused code/files/dependencies; otherwise
  mark `MANUAL REVIEW`.
- Preserve intended behavior and public contracts unless the user approves a
  change.
- No big-bang rewrites, no new frameworks, no unjustified dependencies.
- Never remove tests or silence errors to make checks pass.
- Formatting, import sorting, or rename-only edits do not count as a refactor
  (`.agent/universal-refactor/core/REAL_REFACTOR_CONTRACT.md`).
