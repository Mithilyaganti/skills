---
name: vc-debug
description: Diagnose and fix bugs with a feedback-loop-first process, environment sanity checks, causal-chain gates, test-first fixes, and structured handoff. Use when handling hard bugs, failing tests, regressions, stack traces, flaky behavior, performance problems, or repeated failed fixes.
---

# Vector Cadence Debug

## Purpose

Find the root cause before fixing. This skill prevents patching symptoms by requiring a reproduction loop, evidence-backed hypotheses, and a complete causal chain.

## Operating model

Build a fast feedback loop, reproduce the reported symptom, verify environment sanity, test ranked hypotheses one at a time, then fix test-first only after the causal chain is clear.

## When to use

Use for:

- failing tests,
- stack traces,
- production or user-reported bugs,
- regressions,
- flaky or non-deterministic behavior,
- performance regressions,
- “I tried fixes but it still fails”.

## When to skip

Skip when:

- the task is a new feature (`vc-align` or `vc-plan`),
- root cause is already proven and only implementation remains (`vc-execute`),
- the user only wants codebase orientation (`vc-orient`).

## Inputs

Use:

- issue or bug report,
- full comment thread if available,
- stack traces/logs,
- reproduction steps,
- environment details,
- prior failed attempts,
- linked PRs/deployments.

## Workflow

### 1. Build the feedback loop

Prefer:

1. failing test at the real seam,
2. focused command or CLI repro,
3. HTTP/curl script,
4. headless browser script,
5. captured trace replay,
6. throwaway harness,
7. fuzz/property loop,
8. bisection/differential loop,
9. structured human-in-the-loop script.

The loop should be fast, specific, deterministic or high-reproduction-rate, and agent-runnable. If no loop is possible, stop and ask for missing access/artifacts/setup.

### 2. Verify environment sanity

Check likely false leads:

- branch and uncommitted changes,
- dependencies,
- runtime version,
- env vars,
- stale build artifacts,
- local services,
- config differences.

### 3. Reproduce the real symptom

Confirm the loop matches the user’s reported failure, not a nearby unrelated failure. Capture the exact signal.

### 4. Trace the code path

Trace backward from symptom to where valid state becomes invalid. Use observed values, not assumptions. For performance, measure before changing code.

### 5. Form hypotheses

Create 3-5 ranked hypotheses. Each includes:

- suspected cause and location,
- supporting observation,
- causal chain,
- prediction for uncertain links.

Review what has already been ruled out before forming new hypotheses.

### 6. Probe one variable

Use debugger/REPL, targeted logs, temporary assertions, focused test variations, or bisect/diff probes. Tag temporary logs with a unique prefix and remove them before finishing.

Never “log everything and grep”.

### 7. Pass the causal-chain gate

Do not fix until you can explain:

```text
trigger → code path → invalid state starts → symptom appears
```

If stuck after 2-3 hypotheses, diagnose why: wrong mental model, environment mismatch, design problem, contradictory evidence, or insufficient observability.

### 8. Fix test-first

If fixing:

1. Check workspace safety.
2. Write or keep a failing regression test at the correct seam.
3. Verify it fails for the right reason.
4. Apply the minimal root-cause fix.
5. Verify the test passes.
6. Re-run the original loop.
7. Run broader affected tests.
8. Self-review the diff.

If no correct test seam exists, document that and recommend `vc-architecture` after the immediate fix/diagnosis.

### 9. Cleanup and prevention

Remove debug logs, delete or mark throwaway harnesses, record the confirmed root cause, and offer `vc-learn` only for reusable lessons.

## Output

```markdown
## Debug Summary

**Problem:** ...
**Reproduction:** ...
**Root cause:** ...
**Causal chain:** ...
**Fix:** ... or Diagnosis only
**Tests:** ...
**Prevention:** ...
**Confidence:** High | Medium | Low
**Recommended next skill:** vc-execute | vc-review | vc-architecture | vc-learn
```

## Guardrails

- Do not hypothesize without a feedback loop unless impossible, and then say so.
- Do not fix before the causal-chain gate.
- Do not batch unrelated changes.
- Do not retry variants of a failed hypothesis without invalidating it.
- Do not leave instrumentation behind.
