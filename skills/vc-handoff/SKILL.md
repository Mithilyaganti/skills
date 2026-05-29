---
name: vc-handoff
description: Compact session, plan, debug, review, implementation, or subagent state into a durable handoff for another agent or future session. Use when pausing work, switching agents, context is getting full, resuming later, or preparing bounded subagent/orchestrator context.
---

# Vector Cadence Handoff

## Purpose

Transfer useful state without dumping the whole conversation. A fresh agent should know what happened, what matters, and exactly what to do next.

## Operating model

Reference existing artifacts instead of duplicating them, preserve failed attempts, redact sensitive data, and end with a concrete next action.

## When to use

Use when:

- context is getting full,
- switching agents or harnesses,
- pausing work,
- handing review findings to a resolver,
- preparing a subagent brief,
- leaving a debug or implementation session mid-stream.

## When to skip

Skip when:

- the task is complete and summarized normally,
- there are no decisions, artifacts, or next actions worth preserving,
- a source artifact already fully captures the state.

## Handoff types

| Type | Use for |
|---|---|
| Alignment | after alignment before planning |
| Plan | after planning before execution |
| Execution | mid-implementation |
| Debug | diagnosis or stuck investigation |
| Review | unresolved findings |
| Harness | agent/tool/harness decisions |
| Subagent brief | bounded delegated task |

## Workflow

### 1. Gather state

Collect only what matters:

- user goal,
- current branch/worktree,
- relevant artifact paths,
- decisions made,
- open questions,
- files changed or relevant,
- tests/commands run and results,
- blockers,
- next recommended action.

### 2. Redact and de-risk

Remove secrets, tokens, PII, private customer data, raw sensitive logs, and irrelevant conversation. Reference secure locations instead of copying sensitive details.

### 3. Write compact handoff

Default local path:

```text
docs/handoffs/YYYY-MM-DD-<slug>-handoff.md
```

If temporary-only is requested, provide in chat or outside the repo.

## Templates

### General handoff

```markdown
# Handoff — <topic>

## Goal
## Current state
## Decisions made
## Artifacts
## Files changed / relevant
## Validation so far
## Open questions / blockers
## Next recommended action
## Warnings
```

### Subagent brief

```markdown
# Subagent Brief — <task>

## Role
## Task
## Context artifacts
## Allowed tools / permissions
## Files in scope
## Files out of scope
## Output contract
## Constraints
```

## Output

```markdown
## Handoff Ready

**Path:** ... or provided in chat
**Type:** ...
**Next action:** ...
**Risks:** ...
**Recommended next skill:** depends on handoff type
```

## Guardrails

- Do not duplicate large artifacts already saved.
- Do not include secrets or raw private data.
- Do not hide failed attempts.
- Do not produce a vague “continue from here” handoff.
