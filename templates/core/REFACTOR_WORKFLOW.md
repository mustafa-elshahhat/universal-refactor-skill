# Refactor Workflow

Follow these nine steps in order. Do not skip the baseline (step 3) or the
per-phase verification (step 8). Audit, plan, and reports are written to
`.refactor/` using `REPORT_TEMPLATE.md`.

---

## 1. Repository inspection

- Read the root: `README`, top-level folders, license, and any `CONTRIBUTING`
  or architecture docs.
- Identify what the project *is* (library, service, CLI, app, monorepo) and who
  consumes it.
- Note monorepo/workspace layouts (multiple packages, apps, services).
- **Output:** start `.refactor/01-project-map.md`.

## 2. Stack detection

Detect the stack from files actually present — never assume a framework. Look for:

- JavaScript/TypeScript: `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
- .NET: `*.csproj`, `*.sln`
- Java/JVM: `pom.xml`, `build.gradle`, `build.gradle.kts`
- Python: `requirements.txt`, `pyproject.toml`, `setup.py`, `Pipfile`
- Go: `go.mod`
- Rust: `Cargo.toml`
- PHP: `composer.json`
- Containers/CI: `Dockerfile`, `docker-compose.yml`, `.github/workflows/`, other CI config

From these, determine the **build**, **test**, and **lint/format** commands the
project already uses. Prefer the project's own scripts/tasks over inventing new
ones. Record them in `01-project-map.md`.

## 3. Baseline verification

Before changing anything, capture the current state so you can prove you did not
make things worse.

- Run the detected build, test, and lint commands.
- Record pass/fail, counts, and any pre-existing failures verbatim.
- If the project does not build or test cleanly at baseline, note it — you must
  not later claim to have "fixed" something that was already broken unless you
  truly fixed it.
- **Output:** `.refactor/02-baseline.md`. **Do not edit source code yet.**

## 4. Project inventory

- List source files grouped by area/module/layer.
- Identify entrypoints (`main`, server bootstrap, CLI, exported package surface,
  routes, scheduled jobs, message handlers).
- Map dependencies between modules and note obvious responsibilities.
- Flag oversized files and folders that look like dumping grounds.
- **Output:** finish `.refactor/01-project-map.md`.

## 5. Deep audit (no code changes)

Work through every checklist and record findings with evidence:

- `AUDIT_CHECKLIST.md` — general smells.
- `DEAD_CODE_CHECKLIST.md` — unused files/symbols/deps with proof.
- `COMPLEXITY_CHECKLIST.md` — complexity hotspots.
- `ARCHITECTURE_CHECKLIST.md` — boundary violations.
- `DEPENDENCY_CHECKLIST.md` — dependency hygiene.

For each finding capture: location, the problem, the **evidence**, and a
proposed action. Anything you cannot prove → mark `MANUAL REVIEW`.

- **Output:** `.refactor/03-audit-report.md`. **No edits in this phase.**

## 6. Refactor plan

Turn the audit into an ordered, phased plan.

- Split work into small phases that can each be implemented and verified
  independently. Prefer the safest, highest-value changes first (e.g. proven
  dead-code removal before structural moves).
- For each proposed change include: rationale, evidence reference, affected
  files, expected behavior impact (should be none), and a **risk rating**
  (low / medium / high).
- Keep behavior-preserving and behavior-changing work separate. Behavior changes
  require explicit user approval.
- **Output:** `.refactor/04-refactor-plan.md`.

## 7. Incremental implementation

- Implement **one phase at a time**.
- Make the smallest change that achieves the phase goal. No drive-by edits
  outside the phase.
- Keep public contracts stable unless a breaking change was approved.
- Update imports/usages when you move or rename things.
- **Output:** append to `.refactor/05-implementation-log.md` after each phase.

## 8. Phase verification

After **every** phase:

- Re-run the same build, test, and lint commands from the baseline.
- Compare against `02-baseline.md`. Results must be equal or better.
- Inspect the diff to confirm only intended changes are present.
- If a phase regresses anything, revert that phase and re-plan — do not patch
  over it or weaken tests.

## 9. Final report

- Summarize each phase, the evidence, and the verification outcomes.
- List items left as `MANUAL REVIEW` and why.
- State the exact commands run and their results.
- Confirm intended behavior is preserved (or list approved behavior changes).
- **Output:** `.refactor/06-final-report.md`.

---

### Loop guard

If at any point you cannot prove a change is safe, stop and record it as
`MANUAL REVIEW` rather than guessing. A smaller, fully-verified refactor is
better than a large, unverified one.
