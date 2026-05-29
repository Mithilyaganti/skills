---
name: vc-slice
description: Break a plan, PRD, or requirements document into independently shippable vertical slices and issue-ready agent briefs. Use when turning a plan into tracker issues, preparing AFK work, checking issue granularity, or preventing horizontal backend/frontend/test ticket splits.
---

# Vector Cadence Slice

## Purpose

Turn plans into vertical, independently useful work items. This skill prevents implementation plans from becoming horizontal layer tickets.

## Operating model

A plan unit can be a technical chunk; an issue slice should be a narrow end-to-end outcome that is demoable or verifiable on its own.

## When to use

Use when:

- converting a plan/PRD/requirements doc into issues,
- preparing AFK agent work,
- checking whether issue breakdown is too horizontal,
- creating local markdown issues when no tracker is configured.

## When to skip

Skip when:

- work is a single small direct task,
- the plan still needs technical decisions (`vc-plan`),
- the issue needs readiness classification only (`vc-triage`).

## Inputs

Accept:

- `docs/plans/*-plan.md`,
- `docs/knowledge/<feature>.md`,
- requirements doc,
- PRD,
- issue reference,
- user-provided plan text.

Read source requirements, scope boundaries, implementation units, test scenarios, and deferred notes.

## Workflow

### 1. Gather context

Confirm domain terms, relevant ADRs, source requirements/U-IDs, existing implementation/test patterns, and whether plan units are vertical or preparatory.

### 2. Draft vertical slices

A valid slice creates a narrow complete path through the system.

Good:

> User can create one saved search and see it in the saved-search list.

Bad:

- Create database schema.
- Build backend API.
- Build frontend UI.
- Write tests.

For each slice define title, type, tier, confidence, blockers, source trace, acceptance criteria, test expectations, and agent safety.

### 3. Reject horizontal leakage

For every slice ask:

- Can it be demoed or verified alone?
- Does it cross the real integration seam?
- Does it reduce user/system risk?
- Is it only setup for later work?

Merge horizontal setup into the first vertical slice that needs it, unless the setup is an explicit risk-reduction spike.

### 4. Classify AFK/HITL/Manual

AFK requires clear scope, known verification, no unresolved human judgment, and safe edit scope.

HITL means design, architecture, access, legal, security, privacy, money, or confidence issues need human input.

Manual means the real task must happen outside the agent/harness.

### 5. Review with the user

Before publishing, show a numbered list with title, type, tier, confidence, blockers, source trace, and why each slice is vertical. Ask whether granularity, dependencies, and AFK/HITL classifications are correct.

### 6. Publish or write local issues

If a tracker is available, create issues in dependency order. Otherwise write local markdown issues under:

```text
docs/issues/<slug>-<nn>.md
```

Issue body should include parent, type, tier/confidence, what to build, acceptance criteria, test expectations, source trace, blockers, and agent brief.

## Output

```markdown
## Slices Ready

**Created:** ...
**AFK:** ...
**HITL:** ...
**Manual:** ...
**Blocked first:** ...
**Recommended next skill:** vc-triage | vc-execute
```

## Guardrails

- Do not publish without approval unless running in an explicit headless pipeline.
- Do not close or mutate the parent issue/plan.
- Do not create layer tickets.
- Do not mark low-confidence work as AFK.
- Avoid brittle file-by-file implementation scripts in issue bodies.
