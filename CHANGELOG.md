# Changelog

## 0.3.0

- Added DeepSeek Harness (DSH) installer support: `--dsh` installs to `$DSH_HOME/skills/` (`~/.dsh/skills/`) for DSH Desktop, Terminal, TUI, and headless profiles, and `--dsh-local` installs to `.dsh/skills/` for the current project.
- Added shared-agent installer support: `--agents` installs to `~/.agents/skills/` and `--agents-local` to `.agents/skills/`, matching the additional roots DSH scans.
- Included the DSH targets in `--all` and in the no-argument installer tips.
- Added `scripts/verify-dsh.mjs` (`npm run verify:dsh`), which loads DSH's own skill provider and name grammar from a local install and runs the real discovery path over the installed root.
- Extended `scripts/validate-skills.mjs` with DeepSeek Harness frontmatter rules: kebab-case names, flat frontmatter, canonical invocation keys (`disable-model-invocation`, `user-invocable`), `whenToUse` shape, and the 500-character catalog description cap.
- Documented DSH discovery precedence, slash invocation, and compatibility in the README.
- Added `.dsh/` and `.agents/` to `.gitignore`.

## 0.2.1

- Added ZCode installer support with global (`--zcode`) and project-local (`--zcode-local`) targets (`~/.zcode/skills/` and `.zcode/skills/`).
- Updated README and CLAUDE.md with ZCode installation commands and documentation.

## 0.2.0

- Added Grok Build installer support with global (`--grok`) and project-local (`--grok-local`) targets.
- Changed Claude Code installer: `--claude` now installs globally to `~/.claude/skills/`; use `--claude-local` for project-scoped installs.
- Updated README and CLAUDE.md with global vs project-local install documentation.

## 0.1.3

- Updated folder target configurations for Codex CLI (`.codex/skills`), OpenCode (`.opencode/skills`), Pi (`.pi/skills`), and Claude Code (`CLAUDE.md`).

## 0.1.2

- Expanded installer to support deploying rules to various agent environments: Cursor, Claude Code, Pi/Codex, and Oh-My-Pi/OpenCode.

## 0.1.1

- Added installation CLI binary (`scripts/bin.js`) and `plugin.json` for NPM package distribution.

## 0.1.0

- Added initial production-ready Vector Cadence integrated skill suite.
- Added setup, orient, align, plan, slice, triage, prototype, execute, debug, review, architecture, learn, handoff, harness architect, and skill author skills.
- Added README, comprehensive documentation, architecture overview, and source integration map.
- Added templates for `AGENTS.md`, `CONTEXT.md`, and `.vc-budget.yml`.
- Added machine-readable `skills.json` index.
- Added validation script for skill metadata, links, legacy command leakage, and line-count warnings.
