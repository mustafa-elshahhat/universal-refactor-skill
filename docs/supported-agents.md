# Supported Agents

Every adapter points back to the single canonical core at
`.agent/universal-refactor/core/SKILL.md`, so there is never conflicting
guidance. You can disable any adapter at install time with the matching `--no-*`
flag.

## Claude Code

- **Installed to:** `.claude/skills/universal-refactor/SKILL.md`
- **How it loads:** Claude Code auto-discovers skills under `.claude/skills/`.
  The adapter has YAML frontmatter (`name`, `description`) so it triggers when you
  ask to refactor / clean up / restructure.
- **Use it:**
  ```bash
  claude "Use the universal refactor skill installed in this repository. Run the audit first, create a refactor plan, then implement safe evidence-based refactors phase by phase."
  ```

## OpenCode

- **Installed to:** `.opencode/agents/refactor.md` and
  `.opencode/commands/refactor.md`
- **How it loads:** OpenCode reads project agents and commands from `.opencode/`.
  The command runs the `refactor` agent.
- **Use it:**
  ```text
  /refactor
  ```

## GitHub Copilot

- **Installed to:** `.github/instructions/universal-refactor.instructions.md`
- **How it loads:** Copilot applies path-scoped instruction files
  (`applyTo: "**"`). Your existing `.github/copilot-instructions.md` is **never**
  overwritten.
- **Optional:** the package ships an opt-in snippet
  (`templates/adapters/copilot/copilot-instructions.md`) you can manually merge
  into your repo-wide `copilot-instructions.md`.

## Generic / any markdown-aware agent

- **Installed to:** `.agent/universal-refactor/` (core + prompts + a README
  entrypoint). In `--commit` mode a root `AGENTS.md` is also written.
- **Use it:** tell your agent:
  ```text
  Read .agent/universal-refactor/core/SKILL.md and follow the workflow.
  ```

## Adding another agent

Because the core is plain Markdown, supporting a new agent is just a matter of
adding a small adapter file (in this package's `templates/adapters/`) that tells
that agent to read `.agent/universal-refactor/core/SKILL.md` and follow the
workflow. PRs welcome.
