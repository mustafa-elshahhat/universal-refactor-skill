# Report Templates

The skill writes its working artifacts to `.refactor/`. These are local,
generated outputs (ignored by default). Create them in order; use the headings
below so reports stay consistent and reviewable.

```txt
.refactor/
├─ 01-project-map.md       (steps 1, 4)
├─ 02-baseline.md          (step 3)
├─ 03-audit-report.md      (step 5)
├─ 04-refactor-plan.md     (step 6)
├─ 05-implementation-log.md (step 7)
└─ 06-final-report.md      (step 9)
```

---

## 01-project-map.md

```md
# Project Map

## What this project is
<library / service / CLI / app / monorepo; who consumes it>

## Stack detected
- Languages:
- Package manager / build tool:
- Detected commands: build=<...> test=<...> lint=<...>

## Structure
<top-level folders and their responsibilities>

## Entrypoints
<main / server / CLI / exported surface / routes / jobs / handlers>

## Notable observations
<oversized areas, dumping grounds, monorepo layout, etc.>
```

## 02-baseline.md

```md
# Baseline (captured before any change)

## Commands run
- build: <command> -> <pass/fail, summary>
- test:  <command> -> <pass/fail, counts>
- lint:  <command> -> <pass/fail, counts>

## Pre-existing failures / warnings
<verbatim; these are NOT introduced by the refactor>

## Notes
<environment, versions, anything that affects reproducibility>
```

## 03-audit-report.md

```md
# Audit Report (no code changed)

For each finding:

### <short title>
- Location: <path[:line]>
- Category: dead-code | duplication | complexity | architecture | dependency | other
- Problem: <what is wrong>
- Evidence: <searches run / references found / boundary violated>
- Proposed action: <delete / split / move / consolidate / simplify / keep>
- Risk: low | medium | high
- Status: actionable | MANUAL REVIEW
```

## 04-refactor-plan.md

```md
# Refactor Plan

## Ordering principle
<safest, highest-value first; behavior-preserving before behavior-changing>

## Phase 1: <name>  (risk: low)
- Goal:
- Changes: <files / symbols>
- Evidence: <ref to audit finding>
- Expected behavior impact: none
- Verification: <commands to run after this phase>

## Phase 2: <name>  (risk: ...)
...

## Behavior changes requiring approval
<list anything that would alter behavior or public contracts — do NOT do these
without explicit user sign-off>

## Deferred / manual review
<items not safe to automate>
```

## 05-implementation-log.md

```md
# Implementation Log

## Phase 1: <name>  —  <done / reverted>
- Changes made: <summary + files>
- Diff scope check: <only intended changes? yes/no>
- Verification: build=<...> test=<...> lint=<...> (vs baseline: equal/better/worse)
- Result: <kept / reverted and why>

## Phase 2: ...
```

## 06-final-report.md

```md
# Final Report

## Summary
<what was accomplished, in plain language>

## Phases completed
<list with one-line outcome each>

## Evidence highlights
<key proofs for deletions / structural moves>

## Verification
- build: <command> -> <result vs baseline>
- test:  <command> -> <result vs baseline>
- lint:  <command> -> <result vs baseline>
- Behavior preserved: yes | approved changes listed below

## Approved behavior changes (if any)
<...>

## Left as MANUAL REVIEW
<items + why they were not safe to change automatically>

## Follow-ups / recommendations
<optional next steps>
```
