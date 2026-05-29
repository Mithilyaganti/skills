---
name: vc-learn
description: Capture durable lessons after verified work so future agents can reuse solved problems, conventions, decisions, and implementation reality. Use when finishing non-trivial bug fixes, shipped features, refactors, architecture decisions, harness improvements, or review findings with reusable lessons.
---

# Vector Cadence Learn

## Purpose

Make future work cheaper and safer by capturing only reusable lessons. This skill prevents both knowledge loss and documentation spam.

## Operating model

Write learning only when the problem is solved or diagnosed, the lesson is reusable, overlap has been checked, and the right artifact type is clear.

## When to use

Use after:

- hard bug diagnosis/fix,
- non-obvious implementation pattern,
- feature shipped with lessons,
- architecture decision,
- harness/tool/subagent integration,
- systemic review finding.

## When to skip

Skip when:

- the fix is trivial,
- the solution is unverified,
- no reusable lesson can be stated in one sentence,
- an existing doc already covers it and needs no update.

## Inputs

Use:

- execution/debug/review summary,
- commits/diff,
- tests added,
- linked issue/plan/requirements,
- existing `docs/solutions/`, `docs/knowledge/`, ADRs, and `CONTEXT.md`.

## Reusable lesson gate

Do not write a learning doc unless the lesson can be stated in one sentence and is likely to be searched for later.

Good:

> Webhook handlers must use provider event ID as the idempotency key, not invoice ID.

Bad:

> Fixed bug in webhook handler.

## Artifact routing

| Lesson type | Artifact |
|---|---|
| domain term | `CONTEXT.md` |
| durable trade-off | ADR |
| solved technical problem | `docs/solutions/<category>/<slug>.md` |
| feature lifecycle reality | `docs/knowledge/<feature>.md` |
| global agent convention | `AGENTS.md` |
| recurring rejected idea | `.out-of-scope/<slug>.md` |

## Workflow

### 1. Gather evidence

Read source artifacts and actual changes. Do not write from memory alone.

### 2. Check overlap

Search for similar docs by symptom, root cause, framework, module, and pattern. Update or consolidate existing docs when overlap is high.

### 3. Choose artifact

Pick the narrowest artifact that answers the future question. Do not collapse glossary, ADR, solution, and feature lifecycle information into one document.

### 4. Write concise learning

Solution docs should include:

- symptom,
- root cause,
- working solution,
- why it works,
- tests/verification,
- prevention,
- related files/docs,
- search keywords.

### 5. Update instructions sparingly

Update `AGENTS.md` only for conventions every future agent should follow. Link to detailed docs instead of embedding long narratives.

### 6. Refresh stale docs when needed

If docs drift or overlap, keep, update, consolidate, replace, or delete after checking retrieval value and inbound links.

## Output

```markdown
## Learning Summary

**Captured:** yes | no
**Lesson:** ...
**Artifacts changed:** ...
**Overlap handled:** none | updated | consolidated | superseded
**Future retrieval keywords:** ...
**Recommended next skill:** none | vc-align
```

## Guardrails

- Do not document trivial work.
- Do not put implementation decisions in `CONTEXT.md`.
- Do not create ADRs unless the sparse ADR rule passes.
- Do not preserve stale docs just because deletion feels risky.
- Do not write multiple draft docs from subagents; write one final artifact.
