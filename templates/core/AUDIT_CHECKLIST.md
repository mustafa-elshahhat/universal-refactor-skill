# Audit Checklist

Use during workflow step 5 (Deep audit). Record every finding in
`.refactor/03-audit-report.md` with: location, problem, **evidence**, proposed
action, and risk. Do not edit code in this phase. Anything unproven →
`MANUAL REVIEW`.

---

## Unused files

- Source files with no importers and not referenced by entrypoints, build
  globs, routes, or config.
- Leftover scratch files, `*.bak`, `*.old`, `copy of *`, commented-out modules.
- Confirm against `DEAD_CODE_CHECKLIST.md` before proposing deletion.

## Unused code

- Exported/declared symbols (functions, classes, components, types, constants,
  routes) with no references anywhere.
- Unreachable branches and dead conditionals.
- Feature flags that are permanently on or off and their dead branches.

## Duplicated logic

- The same algorithm, validation, mapping, or constant copied in multiple
  places.
- Near-duplicate functions that differ only by small parameters.
- Note: only consolidate when it genuinely reduces maintenance cost — do not
  create an awkward abstraction just to remove duplication.

## Oversized modules

- Files, functions, classes, services, components, or hooks that are far larger
  than their neighbors or do many unrelated things.
- Candidates for splitting along responsibility lines.

## Misplaced responsibilities

- Logic living in the wrong layer/folder (e.g. business rules in a UI file,
  data access in a controller).
- Utilities that actually belong to a specific feature, or feature code that
  belongs in shared.

## Inconsistent patterns

- Multiple ways of doing the same thing (error handling, data fetching,
  configuration, logging) within one codebase.
- Mixed conventions that increase cognitive load.

## Missing tests around risky areas

- Complex or frequently-changed code with little or no test coverage.
- Areas you intend to refactor that lack a safety net — note where adding a
  characterization test first would de-risk the change.

## Unclear naming

- Names that mislead, are overly generic (`data`, `manager`, `util`, `helper`),
  or no longer match what the code does.
- Only rename as part of a structural improvement (see the contract).

## Stale docs / config

- README/docs that describe removed features or wrong commands.
- Config keys, environment variables, or settings no longer read by the code.
- Dead CI steps, scripts, or build targets.

## Generated / committed-by-accident files

- Build output, coverage, caches, `node_modules`, vendored artifacts, lockfiles
  in the wrong place, large binaries, or secrets accidentally committed.
- Propose ignoring (and, where safe and intended, removing) rather than editing.

---

For each category, prefer **proof over suspicion**. The audit's value is an
honest, evidence-backed map of what is safe to change — not a long list of
guesses.
