# Architecture Checklist

Common boundary violations across stacks. Identify the **intended** architecture
first (from docs, folder structure, and conventions already in the repo), then
look for code that breaks it. Do not impose a new architecture; enforce the one
the project already intends. Record findings in `.refactor/03-audit-report.md`.

---

## Layering violations

- **UI / presentation directly accessing persistence** — components, views, or
  templates running queries or touching the database/ORM directly instead of
  going through a service/repository.
- **Controllers / routes / handlers containing heavy business logic** — request
  handlers that should delegate but instead implement core rules inline.
- **Domain / business layer depending on infrastructure** when the architecture
  intends the reverse (dependencies should point inward toward the domain, not
  outward to frameworks, drivers, or transport).

## Mixed responsibilities

- **Services that mix** validation, persistence, formatting, transport, and
  business rules in one unit. Each of these is a separable concern.
- Functions that both decide *and* perform side effects without a clear seam.

## Shared / common dumping grounds

- `shared/`, `common/`, `utils/`, `helpers/`, `core/` folders that have become
  unrelated grab-bags. Propose moving feature-specific code back to its feature
  and keeping shared truly generic.

## Dependency direction & cycles

- **Circular dependencies** between modules, packages, or layers.
- **Feature code importing from unrelated features** without a stable, intended
  boundary (reach-through coupling). Prefer a defined interface or a shared
  module over deep cross-feature imports.
- Lower layers importing from higher layers.

## Boundaries & contracts

- Internal implementation details leaking across module/package boundaries
  instead of a small, intentional public surface.
- Inconsistent or missing boundaries between apps/packages in a monorepo.

## Tests coupled to implementation

- Tests that assert on private internals, exact call sequences, or structure
  rather than observable behavior, making safe refactors impossible.
- Note these: they often need loosening *before* a structural refactor.

---

## How to act on architecture findings

1. Name the **specific boundary** and the rule it violates.
2. Show the **evidence** (the offending import/call and the direction it points).
3. Propose the **minimal** move/extraction that restores the boundary.
4. Rate the **risk** — architecture moves are often medium/high; sequence them
   carefully and verify after each.
5. Never replace the architecture wholesale because another style is popular.
   Fix violations of the *intended* design.
