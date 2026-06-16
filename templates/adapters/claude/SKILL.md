---
name: universal-refactor
description: >-
  Perform a real, safe, evidence-based full-project refactor on any stack —
  remove proven dead code, prune unused dependencies, fix architecture boundary
  violations, reduce complexity, and split oversized modules while preserving
  behavior. Use when the user asks to refactor, clean up, restructure,
  de-duplicate, simplify, reorganize, or improve the maintainability of a
  codebase. Not for formatting or import-sorting only.
---

# Universal Refactor Skill for Claude Code

Use the core instructions in `.agent/universal-refactor/core/`.

Follow `.agent/universal-refactor/core/SKILL.md` as the source of truth.

Do not perform cosmetic-only cleanup. Perform real, evidence-based refactor only.

## How to run it

1. **Audit (read-only).** Follow `.agent/universal-refactor/prompts/refactor-audit.md`.
   Detect the stack, record a baseline, and write
   `.refactor/01-project-map.md`, `02-baseline.md`, `03-audit-report.md`.
   Do not edit or delete anything in this phase.
2. **Plan.** Follow `.agent/universal-refactor/prompts/refactor-plan.md` to write
   `.refactor/04-refactor-plan.md` — small, safe, risk-rated phases with evidence.
3. **Implement.** Follow `.agent/universal-refactor/prompts/refactor-implement.md`
   one phase at a time, verifying after each and logging to
   `.refactor/05-implementation-log.md`.
4. **Verify.** Follow `.agent/universal-refactor/prompts/refactor-verify.md` and
   write `.refactor/06-final-report.md`.

## Non-negotiable rules

- Do not guess; if usage cannot be proven, mark it `MANUAL REVIEW`.
- Do not delete anything that is not proven unused
  (`.agent/universal-refactor/core/DEAD_CODE_CHECKLIST.md`).
- Do not change intended behavior unless a bug is proven or the user asks.
- No big-bang rewrites, no new frameworks, no unjustified dependencies.
- Never remove tests or silence errors to make checks pass.
- Re-run the project's build/tests/lint after every phase; results must not get
  worse than the baseline.

If anything here seems to conflict with the core `SKILL.md`, the core file wins.
