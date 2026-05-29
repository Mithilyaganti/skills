---
name: vc-review
description: Review code, plans, requirements, or PRs with Standards-vs-Spec framing, persona selection, severity, confidence gates, and actionable routing. Use when reviewing before merge, after implementation, validating a plan/document, or checking security, correctness, performance, or requirements coverage.
---

# Vector Cadence Review

## Purpose

Check whether work is correct, complete, and safe. Review can apply to code diffs, PRs, plans, and requirements documents.

## Operating model

Review along two axes: **Standards** (repo conventions and quality bar) and **Spec** (source plan, issue, requirements, or user intent). Use persona-style review and confidence gates when the harness supports subagents.

## When to use

Use for:

- pre-merge code review,
- T2/T3 implementation gates,
- plan or requirements review,
- security/privacy/payments/API/migration changes,
- resolving whether work satisfies a source artifact.

## When to skip

Skip or keep lightweight for:

- trivial changes with obvious validation,
- work still being actively implemented,
- bugs that need root-cause diagnosis first.

## Inputs

Use:

- diff/branch/PR,
- plan/requirements/issue/agent brief,
- `AGENTS.md`, `CONTEXT.md`, ADRs,
- tests and validation results,
- prior review comments if available.

## Workflow

### 1. Determine scope

Identify changed files, base ref, PR metadata, source artifacts, untracked files, and generated/lockfile exclusions.

### 2. Discover intent

Read the source artifact when available:

- issue agent brief,
- plan U-IDs and verification criteria,
- requirements doc,
- align notes,
- strategy/domain/ADR constraints.

If no meaningful spec exists, review Standards only and label Spec uncertainty.

### 3. Select review lenses

Always consider:

- correctness,
- testing,
- maintainability,
- project standards,
- requirements coverage.

Add conditionals:

- security for auth, permissions, public endpoints, user input,
- performance for queries, caching, async, transformations,
- API contract for routes, types, serializers, public interfaces,
- data migration for migrations/backfills/schema,
- reliability for retries, timeouts, jobs, error handling,
- adversarial for large or high-risk diffs,
- agent-native for harness/tool/agent features.

### 4. Dispatch reviewers if available

If the harness provides subagents, reviewer subagents must be read-only. They may inspect files and run non-mutating commands, but must not edit, commit, push, or change branches.

Use bounded parallelism and treat capacity errors as backpressure.

### 5. Merge findings

For each finding record:

- title,
- severity P0-P3,
- file/line,
- confidence 0/25/50/75/100,
- evidence,
- reviewer/lens,
- route.

Suppress low-confidence findings below 75 unless P0 risk warrants attention. Separate pre-existing issues.

### 6. Route actions

| Route | Meaning |
|---|---|
| safe_auto | local deterministic fix may be applied if policy allows |
| gated_auto | concrete fix exists but changes behavior/contracts; ask or hand off |
| manual | actionable but needs human/downstream resolver |
| advisory | FYI, rollout, risk, or learning |

Do not auto-fix behavior-changing findings without a gate.

### 7. Present verdict

Use tables for findings. Include:

- scope,
- intent source,
- Standards findings,
- Spec findings,
- requirements completeness,
- testing gaps,
- residual risks,
- pre-existing issues,
- verdict.

Verdict options:

- Ready to merge,
- Ready with fixes,
- Not ready.

A code-clean PR that misses explicit requirements is not ready unless the omission is intentional.

## Output

```markdown
## Review Summary

**Scope:** ...
**Intent source:** ...
**Verdict:** Ready | Ready with fixes | Not ready
**Must fix:** ...
**Should fix:** ...
**Testing gaps:** ...
**Residual risks:** ...
**Recommended next skill:** vc-execute | vc-debug | vc-learn
```

## Guardrails

- Do not let reviewer subagents mutate project files.
- Do not flood reports with low-confidence taste opinions.
- Do not review against imagined requirements when source artifacts exist.
- Do not silently drop explicit requirements from the verdict.
- Do not block on inferred requirements alone.
