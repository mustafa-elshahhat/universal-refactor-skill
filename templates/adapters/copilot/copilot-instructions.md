# Optional Copilot snippet (not installed automatically)

The installer never overwrites your `.github/copilot-instructions.md`. Instead it
installs a separate file at
`.github/instructions/universal-refactor.instructions.md`.

If you also keep a repository-wide `.github/copilot-instructions.md`, you can
**optionally** paste the block below into it so the refactor guidance applies in
chats that do not pick up the path-scoped instructions file. This is a manual,
opt-in step — copy it yourself; the installer will not touch this file.

---

## Refactoring (Universal Refactor Skill)

When asked to refactor, clean up, restructure, de-duplicate, or simplify this
repository, follow the local core skill at
`.agent/universal-refactor/core/SKILL.md` and its checklists.

- Detect the stack from the repo's files; record a build/test/lint baseline
  before changing anything.
- Delete only **proven**-unused code, files, or dependencies; otherwise mark
  `MANUAL REVIEW`.
- Preserve intended behavior and public contracts unless the user approves a
  change.
- No big-bang rewrites, no new frameworks, no unjustified dependencies, never
  remove tests or silence errors to pass checks.
- Formatting / import-sorting / rename-only changes do not count as a refactor.
- Work in small, verified phases and write reports to `.refactor/`.
