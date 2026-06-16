# Dependency Checklist

Dependency hygiene applies to any package manager (`package.json`, `*.csproj`,
`pom.xml`, `build.gradle`, `requirements.txt`/`pyproject.toml`, `go.mod`,
`Cargo.toml`, `composer.json`, etc.). Treat removing or changing a dependency
with the same evidence discipline as deleting code. Record findings in
`.refactor/03-audit-report.md`.

---

## What to check

- **Unused dependencies** — declared but never imported/required in code,
  config, scripts, or build. Prove non-use the same way as dead code (identifier
  **and** string search; check dynamic loading, plugins, CLI invocations in
  scripts, and CI). Mark unproven cases `MANUAL REVIEW`.
- **Duplicated libraries for the same purpose** — e.g. two date libraries, two
  HTTP clients, two test frameworks. Propose consolidating onto one, with a
  migration phase and verification.
- **Dev vs. production placement** — runtime dependencies listed as dev-only (or
  vice versa). Correct the classification.
- **Dependency used for trivial code** — a whole package pulled in for a few
  lines that the project could keep inline. Consider removing the dependency
  *only* when the inline version is clearly simpler and well-tested — do not
  reinvent complex or security-sensitive functionality.
- **Outdated config packages no longer referenced** — linters, formatters,
  build plugins, or type packages whose config/usage has been removed.
- **Stale package scripts** — scripts/tasks/targets that reference removed
  files, tools, or workflows, or that no longer match how the project is built
  and tested.

---

## Cautions

- **Transitive vs. direct.** Removing a direct dependency that is also pulled in
  transitively can still break a build if you relied on the direct version.
  Verify after removal.
- **Peer / optional / platform dependencies.** Some are intentionally not
  imported directly. Do not remove without understanding why they exist.
- **Lockfiles.** Regenerate lockfiles through the project's own tooling after
  dependency changes; do not hand-edit them.
- **Security.** Do not replace a maintained dependency with hand-rolled code for
  parsing, crypto, auth, or anything security-sensitive.

---

## Action format

For each dependency finding record: the manifest and entry, the evidence of
(non-)use, the proposed action (remove / move / consolidate / keep), the risk
rating, and the verification step that will confirm the project still builds and
tests after the change.
