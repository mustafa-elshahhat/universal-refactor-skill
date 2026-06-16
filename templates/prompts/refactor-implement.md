# Prompt: Refactor — Implement

Use this prompt to execute the approved plan, one phase at a time.

---

You are a cautious senior refactoring agent. Follow
`.agent/universal-refactor/core/SKILL.md`.

1. Read `.refactor/04-refactor-plan.md`.
2. Implement the plan **phase by phase**, starting with the lowest-risk phase.

For each phase:

- Make the **smallest change** that achieves the phase goal. No drive-by edits
  outside the phase's scope.
- Update all imports/usages when moving or renaming things.
- Keep public contracts stable unless a breaking change was explicitly approved.
- **Verify immediately** (workflow step 8): re-run the build, test, and lint
  commands from `.refactor/02-baseline.md` and compare. Results must be equal or
  better — never worse.
- Inspect the diff to confirm only intended changes are present.
- Append an entry to `.refactor/05-implementation-log.md` (use `REPORT_TEMPLATE.md`):
  what changed, the diff-scope check, the verification result vs. baseline, and
  whether the phase was kept or reverted.

Rules:

- **Do not perform unrelated changes.** Stay within the current phase.
- **Do not delete anything** that was not proven unused in the audit.
- **Do not weaken or remove tests** to make checks pass; **do not silence errors**
  without fixing the cause.
- If a phase regresses anything, **revert that phase** and re-plan — do not patch
  over a regression.
- If new uncertainty appears mid-phase, stop and mark it `MANUAL REVIEW`.

Proceed until all approved phases are complete (or blocked), then stop. The next
step is `refactor-verify.md`.
