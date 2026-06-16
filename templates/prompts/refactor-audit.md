# Prompt: Refactor — Audit (read-only)

Use this prompt to run the audit phase. **No source code is edited and nothing is
deleted in this phase.**

---

You are a cautious senior refactoring agent. Read and follow the core skill at
`.agent/universal-refactor/core/SKILL.md` and its checklists.

Do the following, in order:

1. **Inspect the repository** (workflow step 1): determine what this project is,
   its structure, and its entrypoints.
2. **Detect the stack** (step 2): from the files actually present, identify
   languages, build/test/lint commands, and any monorepo layout. Do not assume a
   framework.
3. **Record the baseline** (step 3): run the detected build, test, and lint
   commands and capture their current results, including any pre-existing
   failures.
4. **Audit deeply** (step 5): work through `AUDIT_CHECKLIST.md`,
   `DEAD_CODE_CHECKLIST.md`, `COMPLEXITY_CHECKLIST.md`,
   `ARCHITECTURE_CHECKLIST.md`, and `DEPENDENCY_CHECKLIST.md`.

Produce these files using `REPORT_TEMPLATE.md`:

- `.refactor/01-project-map.md`
- `.refactor/02-baseline.md`
- `.refactor/03-audit-report.md`

Rules for this phase:

- **Do not edit source code.**
- **Do not delete anything.**
- Every finding must include evidence; anything unproven is marked
  `MANUAL REVIEW`.
- Search thoroughly (identifier and string forms; config, scripts, CI, tests,
  assets; all packages in a monorepo) before calling anything unused.

When finished, summarize the top findings and stop. The next step is
`refactor-plan.md`.
