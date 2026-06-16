---
description: Run the universal, evidence-based refactor workflow on this project.
agent: refactor
---

Run the **Universal Refactor** workflow on this repository.

Source of truth: `.agent/universal-refactor/core/SKILL.md` (read it and the
checklists beside it first).

Execute the phases in order, stopping for approval before any behavior-changing
work:

1. **Audit (read-only)** — follow
   `.agent/universal-refactor/prompts/refactor-audit.md`. Detect the stack,
   capture a baseline, and produce `.refactor/01-project-map.md`,
   `.refactor/02-baseline.md`, and `.refactor/03-audit-report.md`. Do not edit or
   delete anything yet.
2. **Plan** — follow `.agent/universal-refactor/prompts/refactor-plan.md` and
   produce `.refactor/04-refactor-plan.md` (small, safe, risk-rated phases with
   evidence).
3. **Implement** — follow
   `.agent/universal-refactor/prompts/refactor-implement.md`, one phase at a
   time, verifying after each and logging to
   `.refactor/05-implementation-log.md`.
4. **Verify** — follow `.agent/universal-refactor/prompts/refactor-verify.md` and
   produce `.refactor/06-final-report.md`.

Rules: do not guess; delete only proven-unused code; preserve behavior; no
big-bang rewrites or new frameworks; never remove tests or silence errors to
make checks pass. Cosmetic-only changes do not count as a refactor.

$ARGUMENTS
