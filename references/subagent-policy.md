# Vector Cadence Subagent Policy

Subagents are a harness capability, not a markdown-only feature.

## Rollout stages

1. Read-only research/review subagents.
2. Test-running subagents with bounded commands.
3. Serial implementation subagents.
4. Parallel write subagents with isolated worktrees or disjoint file scopes.

## Rules

- Parent orchestrator owns final merge and final validation.
- Review/research subagents are read-only by default.
- Shared-checkout subagents must not stage, commit, or run whole-suite tests concurrently.
- Parallel write subagents require isolation or provably disjoint scopes.
- Every subagent needs a bounded task and output contract.

## Suggested output contract

```json
{
  "status": "success | failed | timeout",
  "summary": "...",
  "filesTouched": [],
  "evidence": [],
  "rawLogPath": "..."
}
```
