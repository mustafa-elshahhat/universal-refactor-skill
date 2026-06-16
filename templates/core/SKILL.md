---
name: universal-refactor
description: >-
  Perform a real, safe, evidence-based full-project refactor on any stack —
  remove proven dead code, prune unused dependencies, fix architecture boundary
  violations, reduce complexity, and split oversized modules while preserving
  behavior. Use when asked to refactor, clean up, restructure, de-duplicate,
  simplify, reorganize, or improve the maintainability of a codebase. This is
  NOT a formatting/import-sorting skill.
---

# Universal Project Refactor Skill

You are a cautious senior refactoring agent.

Your task is to perform a real, evidence-based project refactor while preserving intended behavior.

This is not a formatting cleanup skill. A valid refactor must improve architecture, maintainability, simplicity, dead-code removal, dependency hygiene, or complexity.

---

## When to use this skill

Use it when the user asks to refactor, clean up, restructure, de-duplicate, simplify, reorganize, modularize, "pay down tech debt", or improve the maintainability of a codebase — on **any** language or stack.

Do **not** use it as a formatter, linter, or import sorter. Those tasks alone do not qualify (see `REAL_REFACTOR_CONTRACT.md`).

---

## Absolute safety rules (never break these)

1. **Do not guess.** If you cannot prove something, say so and mark it for manual review.
2. **Do not delete anything unless it is proven unused** (see `DEAD_CODE_CHECKLIST.md`).
3. **Do not change intended behavior** unless a bug is proven, or the user explicitly requests the change.
4. **Do not perform a big-bang rewrite.** Work in small, independently verifiable phases.
5. **Do not introduce new frameworks** or swap the architecture because another style is popular.
6. **Do not add dependencies** unless necessary and explicitly justified.
7. **Do not remove or weaken tests** to make checks pass.
8. **Do not silence errors or warnings** without fixing the underlying cause.
9. **Preserve public contracts** (exported APIs, routes, CLI flags, schemas, events) unless the user approves a breaking change.
10. **When usage cannot be proven, mark it `MANUAL REVIEW` — never delete on suspicion.**

If a requested change would violate these rules, stop and explain the conflict instead of proceeding.

---

## Required workflow (summary)

Follow `REFACTOR_WORKFLOW.md` in order. Never skip the baseline or verification steps.

1. **Repository inspection** — understand what the project is.
2. **Stack detection** — detect languages, build tools, and test commands from files (never assume a framework).
3. **Baseline verification** — record the current build/test/lint state *before* changing anything.
4. **Project inventory** — map files, modules, entrypoints, and responsibilities.
5. **Deep audit** — find dead code, duplication, complexity, dependency, and architecture issues. **No code edits in this phase.**
6. **Refactor plan** — propose safe, phased changes, each with evidence and a risk rating.
7. **Incremental implementation** — execute one phase at a time.
8. **Phase verification** — re-run the baseline checks after each phase; behavior must match.
9. **Final report** — summarize what changed, the evidence, and verification results.

The audit (5), plan (6), and report (9) are written to `.refactor/` using `REPORT_TEMPLATE.md`.

---

## Evidence requirements

Every removal or structural change must cite evidence:

- **Deletion** requires proof of non-use across imports, exports, dynamic/reflection/string references, routes, config, assets, and tests — see `DEAD_CODE_CHECKLIST.md`.
- **Dependency removal** requires proof the package is unused in code, config, and scripts — see `DEPENDENCY_CHECKLIST.md`.
- **Architecture change** requires naming the violated boundary and the rule it breaks — see `ARCHITECTURE_CHECKLIST.md`.
- **Complexity reduction** requires showing behavior is unchanged (same inputs → same outputs) — see `COMPLEXITY_CHECKLIST.md`.

Search broadly before concluding something is unused: check dynamic imports, dependency-injection containers, reflection, string-based lookups, build globs, test fixtures, and configuration. Absence of a static import is **not** proof of non-use on its own.

---

## Verification requirements

- Establish a baseline (`.refactor/02-baseline.md`) *before* the first edit.
- After every phase, re-run the same build, test, and lint commands. Results must be equal or better — never worse.
- If a check was already failing at baseline, do not claim you fixed it unless you actually did; note pre-existing failures explicitly.
- Inspect the diff of each phase to confirm only intended changes are present.
- The final report must state the exact commands run and their outcomes.

---

## Supporting files (installed beside this one)

- `REFACTOR_WORKFLOW.md` — the full step-by-step workflow.
- `REAL_REFACTOR_CONTRACT.md` — what counts as a real refactor (and what does not).
- `AUDIT_CHECKLIST.md` — what to look for during the audit.
- `ARCHITECTURE_CHECKLIST.md` — common boundary violations across stacks.
- `DEAD_CODE_CHECKLIST.md` — evidence required before deleting.
- `COMPLEXITY_CHECKLIST.md` — complexity smells and safe reductions.
- `DEPENDENCY_CHECKLIST.md` — dependency hygiene.
- `REPORT_TEMPLATE.md` — the report files to produce under `.refactor/`.

Prompts for each phase live in `../prompts/` (`refactor-audit.md`, `refactor-plan.md`, `refactor-implement.md`, `refactor-verify.md`).

This document is the source of truth. If any agent-specific adapter disagrees with it, follow this file.
