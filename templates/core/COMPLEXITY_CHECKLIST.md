# Complexity Checklist

Find complexity hotspots and reduce them **without changing behavior** and
**without adding unnecessary abstraction**. Every reduction must keep the same
inputs → same outputs and side effects. Record findings in
`.refactor/03-audit-report.md`.

---

## Complexity smells to look for

- **Long functions** — functions/methods that do many steps and are hard to read
  top-to-bottom. Consider extracting cohesive steps into well-named helpers.
- **Deeply nested conditionals / loops** — pyramids of `if`/`for`. Consider
  guard clauses, early returns, and flattening.
- **High parameter count** — many positional parameters, especially several of
  the same type. Consider grouping related parameters into a single object/struct
  *when it genuinely clarifies* (not as ceremony).
- **Boolean flag parameters that switch behavior** — a function that does two
  different things based on a boolean. Consider splitting into two functions.
- **Repeated condition chains** — the same `if/else` or `switch` on the same
  value duplicated across the codebase. Consider centralizing the decision.
- **Large components / classes / services** — types that have grown to cover many
  responsibilities. Split along responsibility lines.
- **Excessive abstraction** — layers, interfaces, factories, or generics that add
  indirection without a second real implementation or a real need. Inlining can
  *reduce* complexity.
- **Single-use abstraction** — an interface/base class/wrapper with exactly one
  implementation and one caller. Often safe to inline.
- **Unclear side effects** — functions that look pure but mutate shared state, do
  I/O, or throw unexpectedly. Make the seam explicit; separate decisions from
  effects.
- **Mixed responsibilities** — a unit that parses, validates, computes, and
  persists all at once. Separate the concerns.

---

## Safe-reduction rules

1. **Behavior first.** Before extracting/inlining, be sure you can show the
   transformation is behavior-preserving. If coverage is thin around a hotspot,
   note that a characterization test should come first.
2. **Reduce, don't relocate.** Don't move complexity behind a new layer and call
   it simpler. Fewer moving parts is the goal.
3. **No speculative generality.** Do not add config, hooks, or extension points
   for needs that do not exist yet.
4. **Keep names honest.** Extracted helpers must be named for what they do.
5. **Small steps.** One hotspot per change, verified before the next.

---

## Anti-pattern: complexity theater

Adding interfaces, dependency injection, design patterns, or generics to a place
that does not need them is **not** a complexity reduction — it is added
complexity. Removing such over-engineering is a valid refactor; adding it is not.
