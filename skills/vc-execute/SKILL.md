---
name: vc-execute
description: Execute a clear plan, issue, or agent brief with workspace safety, TDD, scoped subagent coordination, continuous verification, and tiered review gates. Use when implementing approved work, running an AFK loop, or turning a plan/issue into tested code.
---

# Vector Cadence Execute

## Purpose

Implement approved work safely. This skill assumes the target is clear enough to code; if not, route back to alignment, planning, triage, or debugging.

## Operating model

Use branch/worktree safety, task tracking, one-behavior-at-a-time TDD for behavior changes, continuous validation, and scoped subagents only when their file access is safe.

## When to use

Use for:

- implementing a reviewed plan,
- executing a `ready-for-agent` issue,
- completing an agent brief,
- running a bounded AFK implementation loop.

## When to skip

Skip when:

- scope is vague (`vc-align` or `vc-plan`),
- a bug lacks root cause (`vc-debug`),
- a human design/security/privacy decision is unresolved,
- workspace safety cannot be established.

## Inputs

Accept:

- plan path,
- issue reference,
- agent brief,
- small direct task.

## Workflow

### 1. Triage input

Classify:

| Input | Action |
|---|---|
| trivial direct edit | implement with focused verification |
| ready-for-agent issue | execute from brief |
| plan file | build task list from units |
| vague/high-risk prompt | route to align/plan |
| bug without diagnosis | route to debug |

### 2. Check workspace safety

Before editing:

- check branch and uncommitted changes,
- avoid overwriting user work,
- avoid committing to default branch unless policy/user permits,
- prefer feature branch or isolated worktree for non-trivial work.

### 3. Build task list

Preserve source trace:

- U-IDs,
- requirements,
- dependencies,
- execution notes,
- likely files,
- test scenarios,
- verification criteria.

Track progress in the task tracker or summary, not by editing the plan body.

### 4. Choose execution strategy

| Strategy | Use when |
|---|---|
| Inline | 1-2 small tasks |
| Serial subagents | dependent tasks or large context |
| Parallel read-only subagents | research/review/test probes |
| Parallel write subagents | isolated worktrees or disjoint file scopes |

If the harness does not provide subagents, execute inline or serially yourself.

Never let shared-checkout subagents stage, commit, or run whole-suite tests concurrently.

### 5. Implement behavior with TDD

For behavior-bearing work:

```text
choose one behavior
→ write one failing public-interface test
→ verify it fails for the right reason
→ implement minimal code
→ verify green
→ repeat
→ refactor only while green
```

Test observable behavior through public interfaces. Avoid tests coupled to private implementation. Add integration coverage for callbacks, persistence, permissions, retries, multi-interface parity, and external contract behavior when relevant.

Skip strict test-first for pure styling, mechanical renames, config-only changes, or cases where characterization-first is safer.

### 6. Verify continuously

Before marking a task complete, check:

- what callbacks/middleware/jobs/events fire,
- whether tests exercise the real chain,
- whether failure can leave orphaned state,
- whether other interfaces expose the behavior,
- whether auth, privacy, payments, or external contracts are touched.

Run focused tests first, then broader affected checks as confidence grows.

### 7. Commit only if allowed

If user/project/harness policy permits commits, commit complete logical units only when tests pass and the message describes real value. Do not create WIP commits or stage unrelated files.

### 8. Apply review gate

| Tier | Gate |
|---|---|
| T1 | focused tests + self-review |
| T2 | affected tests + lightweight review |
| T3 | broader validation + security/correctness/performance review + human pause before merge |

## Stop conditions

Stop when:

- acceptance criteria are ambiguous,
- three fix attempts fail,
- tests fail for unknown reasons after focused diagnosis,
- implementation reveals an unplanned product/architecture decision,
- subagent outputs conflict or risk lost work,
- high-risk behavior differs from the plan.

## Output

```markdown
## Execution Summary

**Implemented:** ...
**Source:** ...
**Tests run:** ...
**Review gate:** ...
**Commits:** ...
**Open risks / follow-ups:** ...
**Recommended next skill:** vc-review | vc-learn
```

## Guardrails

- Do not code from vague intent.
- Do not refactor while tests are red.
- Do not let subagents write overlapping files in one checkout.
- Do not leave debug/prototype artifacts unmarked.
- Do not claim validation passed unless it did.
