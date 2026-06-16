---
applyTo: "**"
description: Universal evidence-based refactor instructions for GitHub Copilot.
---

# Universal Refactor Instructions (GitHub Copilot)

When the user asks you to refactor, clean up, restructure, de-duplicate,
simplify, or improve the maintainability of this repository, follow the core
skill installed locally at `.agent/universal-refactor/core/SKILL.md` and the
checklists beside it. That file is the source of truth.

## Do this

- Detect the stack from the repository's files (no framework assumptions).
- Record a baseline of build/test/lint **before** changing anything.
- Audit using the checklists; write findings with evidence to `.refactor/`.
- Plan small, risk-rated, behavior-preserving phases.
- Implement one phase at a time and re-run build/test/lint after each.
- Produce the reports described in
  `.agent/universal-refactor/core/REPORT_TEMPLATE.md`.

## Never do this

- Never delete code, files, or dependencies that are not **proven** unused
  (`.agent/universal-refactor/core/DEAD_CODE_CHECKLIST.md`). Unproven →
  `MANUAL REVIEW`.
- Never change intended behavior or public contracts unless the user explicitly
  approves it.
- Never do a big-bang rewrite, introduce a new framework, or add unjustified
  dependencies.
- Never remove tests or silence errors/warnings to make checks pass.
- Never present formatting, import sorting, or rename-only edits as a refactor
  (`.agent/universal-refactor/core/REAL_REFACTOR_CONTRACT.md`).

A valid refactor improves architecture, maintainability, simplicity,
dead-code removal, dependency hygiene, or complexity — while preserving behavior.
