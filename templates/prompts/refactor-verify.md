# Prompt: Refactor — Verify

Use this prompt for final verification and reporting.

---

You are a cautious senior refactoring agent. Follow
`.agent/universal-refactor/core/SKILL.md`.

1. **Run all available checks** the project uses: build, tests, lint/format,
   type checks. Use the same commands recorded in `.refactor/02-baseline.md`.
2. **Compare against the baseline.** Every check must be equal to or better than
   baseline. Note any pre-existing failures that were already present at baseline
   and were not in scope.
3. **Inspect the diffs** of the whole refactor:
   - Confirm only intended changes are present.
   - Confirm no behavior change slipped in (same inputs → same outputs and side
     effects).
   - Confirm public contracts (APIs, routes, CLI flags, schemas, events) are
     unchanged, except for changes the user explicitly approved.
4. **Confirm behavior preservation.** If you cannot confirm it for some change,
   say so clearly rather than asserting success.
5. Produce `.refactor/06-final-report.md` using `REPORT_TEMPLATE.md`, including:
   - what was accomplished,
   - the phases completed,
   - key evidence for deletions/structural moves,
   - exact verification commands and their results vs. baseline,
   - any approved behavior changes,
   - items left as `MANUAL REVIEW`,
   - optional follow-up recommendations.

Rules:

- Report only what you actually ran and verified. **No vague claims.**
- If tests fail, say so and show the output; do not mark the work complete.
- Do not remove tests or silence errors to make the report look clean.
