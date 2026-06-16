# Dead Code Checklist

Deletion is the highest-risk action in a refactor. **Never delete on suspicion.**
A symbol or file may be removed only when every applicable check below passes.
If any check cannot be satisfied, mark the item `MANUAL REVIEW` and leave it.

---

## Required evidence before deleting

For the file/symbol in question, confirm:

- [ ] **No imports** — nothing imports/requires/includes the file or symbol.
- [ ] **No exports used by entrypoints** — it is not part of the package's public
      surface and not reached transitively from any entrypoint (`main`, server
      bootstrap, CLI, exported index, scheduled jobs, message handlers).
- [ ] **No dynamic references** — not loaded via dynamic import, lazy loading,
      service locator, dependency-injection container, or plugin registry.
- [ ] **No route references** — not wired to any HTTP/RPC/CLI/event route or
      handler table.
- [ ] **No config references** — not named in configuration, environment
      variables, feature flags, or settings files read at runtime.
- [ ] **No test references** — not referenced by tests or test fixtures (and if
      the only references are tests for the symbol itself, removing both may be
      valid — record that explicitly).
- [ ] **No asset references** — not referenced by templates, stylesheets, HTML,
      manifests, or static asset pipelines.
- [ ] **No reflection / string-based usage** — for stacks where it applies
      (reflection, annotations/decorators, `getattr`/`getmethod`, string keys,
      auto-discovery by name/convention, code generation), search for the symbol
      name as a **string**, not just as an identifier.

---

## How to search thoroughly

- Search the whole repository for the identifier **and** its string form.
- Include config, CI, scripts, docs, templates, and lockfiles in the search.
- Check build globs and bundler entry patterns (a file matched by a glob is
  "used" even with no explicit import).
- For monorepos, search **all** packages/apps, not just the current one.
- Consider public/published surfaces: a library's exports may be used by external
  consumers you cannot see — treat removal of public API as a breaking change
  requiring user approval.

---

## Decision rule

```
If ALL applicable checks pass  -> safe to delete (record the evidence).
If ANY check is uncertain      -> MANUAL REVIEW (do not delete).
If the symbol is public API    -> requires explicit user approval to remove.
```

Record, for each deletion, exactly which checks were run and what proved
non-use. "I didn't see it used" is not evidence; "searched X, Y, Z for the
identifier and string form, zero references" is.
