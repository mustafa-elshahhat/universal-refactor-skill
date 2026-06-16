# Prompt: Refactor — Plan

Use this prompt to turn the audit into a safe, phased implementation plan. **No
source code is edited in this phase.**

---

You are a cautious senior refactoring agent. Follow
`.agent/universal-refactor/core/SKILL.md`.

1. Read the audit outputs:
   - `.refactor/01-project-map.md`
   - `.refactor/02-baseline.md`
   - `.refactor/03-audit-report.md`
2. Produce `.refactor/04-refactor-plan.md` using `REPORT_TEMPLATE.md`.

The plan must:

- **Split work into small, independently verifiable phases.** Each phase should
  be safe to implement and verify on its own.
- **Order by safety and value:** proven dead-code/dependency removal first, then
  complexity reductions, then structural/architecture moves.
- For **each** proposed change include: rationale, a reference to the audit
  evidence, the affected files, the expected behavior impact (normally none), the
  verification commands, and a **risk rating** (low / medium / high).
- **Separate behavior-preserving work from behavior-changing work.** Anything
  that would alter behavior or a public contract goes in a dedicated section and
  requires explicit user approval before implementation.
- List anything that should remain `MANUAL REVIEW` and why.

Rules:

- Do not edit source code.
- Do not propose cosmetic-only changes as if they were refactors (see
  `REAL_REFACTOR_CONTRACT.md`).
- Do not propose framework swaps or architecture replacement; fix violations of
  the project's *intended* design only.

When finished, present the phase list with risk ratings and stop. The next step
is `refactor-implement.md`.
