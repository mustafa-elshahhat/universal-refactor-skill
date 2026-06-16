# Ignore Behavior

The installer is designed so that, by default, it never changes your tracked
project files or your committed Git history.

## The managed block

Ignore entries are written inside a clearly delimited, de-duplicated block:

```gitignore
# >>> universal-refactor-skill >>>
# Universal Refactor Skill local files
.agent/universal-refactor/
.refactor/
.claude/skills/universal-refactor/
.opencode/agents/refactor.md
.opencode/commands/refactor.md
.github/instructions/universal-refactor.instructions.md
# <<< universal-refactor-skill <<<
```

Because the block is delimited by markers, the installer can:

- add it once (idempotent — re-running never duplicates entries),
- update it in place if the set of entries changes,
- remove it cleanly on `uninstall` without touching your other rules.

Adapters you skip with `--no-*` are not added to the block.

## Default mode (local-only)

When the target is a Git repository:

- The block is written to **`.git/info/exclude`** (created if missing).
- **`.gitignore` is not touched.**

When the target is **not** a Git repository:

- Files are still installed.
- A warning is printed that the local Git exclude could not be updated.
- `.gitignore` is **not** created (use `--update-gitignore` if you want one).

## `--update-gitignore`

- The block is written to **`.gitignore`** instead of `.git/info/exclude`.
- Existing `.gitignore` content is preserved; the block is appended (or updated
  in place if already present).

## `--commit`

- Skill files are installed as normal, **tracked** repository files (nothing
  added to ignore for them).
- **`.refactor/` is still ignored**, because the six report files are generated
  run outputs, not source.
- A root `AGENTS.md` is written (merge into your own if present).
- A warning is printed that the files are intended to be committed.

You can combine `--commit --update-gitignore` to write the `.refactor/`-only
ignore rule into `.gitignore` instead of `.git/info/exclude`.

## Why `.git/info/exclude` by default?

`.git/info/exclude` is a per-clone, untracked ignore file. Using it means the
skill files are invisible to Git **for you**, without changing anything other
contributors would see — the cleanest possible default for a tool you may want to
try without committing anything.
