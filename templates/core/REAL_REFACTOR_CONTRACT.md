# Real Refactor Contract

This contract defines what counts as a real refactor under this skill. If a
proposed change does not satisfy it, it is not a refactor — do not present it as
one.

---

## A valid refactor MUST improve at least one of these

- Remove **proven** unused files.
- Remove **proven** unused functions, classes, components, services, constants,
  types, helpers, hooks, routes, or modules.
- Remove **proven** unused dependencies.
- Reduce excessive complexity (long functions, deep nesting, tangled
  conditionals, high parameter counts).
- Split oversized files, functions, classes, services, hooks, components, or
  modules into focused units.
- Move misplaced logic to the correct folder, layer, module, or responsibility.
- Fix architecture boundary violations.
- Reduce duplicated logic **without** creating unnecessary abstraction.
- Simplify over-engineered patterns.
- Improve naming, organization, discoverability, and maintainability as part of
  one of the above — not on its own.

In all cases the refactor must **preserve intended behavior** while making the
project easier to understand, change, and test.

---

## These do NOT count as a real refactor on their own

- **Formatting-only changes** (whitespace, line length, quote style, running a
  formatter).
- **Import cleanup alone** (sorting or grouping imports).
- **Rename-only changes** (renaming a variable/file with no structural benefit).
- **Comment edits** (adding, removing, or rewording comments).
- Reordering members with no behavioral or structural improvement.
- Swapping one equivalent syntax for another for taste.
- Adding abstraction layers, indirection, or configuration "just in case".

These may accompany a real refactor, but they can never be the whole of it. If
the only thing you can offer is cosmetic, say so plainly and stop — do not pad
the report to look like substantive work.

---

## The behavior-preservation rule

A refactor changes **structure**, not **behavior**.

- Same inputs must produce the same outputs and the same observable side effects.
- Public contracts (exported APIs, routes, CLI flags, DB schema, events,
  serialized formats) stay stable unless the user explicitly approves a breaking
  change.
- If you discover a real bug, do not silently "fix" it inside a refactor. Note
  it separately and let the user decide.

---

## Definition of done for any change

A change is done only when:

1. It improves at least one item from the "MUST improve" list.
2. It preserves intended behavior (or implements an explicitly approved change).
3. Its evidence is recorded (for deletions and structural moves).
4. The project's build, tests, and lint pass at least as well as the baseline.
5. The diff contains only the intended change.
