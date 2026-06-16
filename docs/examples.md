# Examples

End-to-end walkthroughs. Replace paths and agent commands with your own.

## 1. Try it locally without touching Git history

```bash
cd my-project
npx universal-refactor-skill@latest install
# -> files installed, ignored via .git/info/exclude, nothing tracked changed

npx universal-refactor-skill doctor
# -> shows what's installed and where ignores live
```

Then, with your agent:

```bash
claude "Use the universal refactor skill installed in this repository. Start with the audit only; do not edit code yet."
```

Inspect `.refactor/03-audit-report.md`, then continue with the plan and
implementation phases.

## 2. Commit the skill for your whole team

```bash
cd my-project
npx universal-refactor-skill install --commit
git add .agent .claude .opencode .github AGENTS.md
git commit -m "Add universal refactor skill pack"
```

Now every contributor and their agent shares the same refactor rules. Only
`.refactor/` (generated reports) stays ignored.

## 3. Use a project-level .gitignore instead of .git/info/exclude

```bash
npx universal-refactor-skill install --update-gitignore
```

The managed block is added to `.gitignore`.

## 4. Install only one adapter

```bash
# Claude Code only
npx universal-refactor-skill install --no-opencode --no-copilot --no-generic
```

## 5. Install into a different directory

```bash
npx universal-refactor-skill install --target ../other-repo
```

## 6. Re-run safely (idempotent)

```bash
npx universal-refactor-skill install        # creates missing files only
npx universal-refactor-skill install --force # overwrite installed files with latest templates
```

## 7. A typical agent session

```text
1. /refactor                      (OpenCode)  — or ask Claude to use the skill
2. Agent runs the AUDIT prompt    -> .refactor/01..03 created, no code changed
3. You review the audit + plan    -> approve phases
4. Agent runs IMPLEMENT phase 1   -> verifies vs baseline, logs result
5. ... repeat per phase ...
6. Agent runs VERIFY              -> .refactor/06-final-report.md
```

## 8. Uninstall

```bash
npx universal-refactor-skill uninstall              # remove everything we added
npx universal-refactor-skill uninstall --keep-reports  # keep .refactor/
```
