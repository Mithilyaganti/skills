# Changelog

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
