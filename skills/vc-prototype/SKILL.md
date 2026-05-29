---
name: vc-prototype
description: Build a throwaway prototype to answer one design question before committing to production architecture. Use when exploring uncertain state machines, data models, UI variations, interaction flows, interface shapes, performance feasibility, or harness/tool UX experiments.
---

# Vector Cadence Prototype

## Purpose

Answer one design question with the smallest safe throwaway artifact. The value is the decision, not the prototype code.

## Operating model

Name the question, build only enough to answer it, evaluate with the user, then delete, mark, or convert the result into a plan/ADR/issue.

## When to use

Use when asking:

- does this state model feel right?
- which UI shape is better?
- can this tool workflow work?
- what is the smallest useful version?
- should this be a module, command, prompt workflow, or extension?

## When to skip

Skip when:

- the path is already clear,
- normal TDD implementation is cheaper,
- the prototype would touch real auth, billing, external effects, or production data without isolation.

## Prototype routes

| Question | Prototype shape |
|---|---|
| state/business logic | tiny terminal or script harness |
| UI/UX | switchable variations on one route/page |
| API/interface | fake caller exercising proposed shapes |
| agent/harness workflow | mocked tool loop with recorded inputs/outputs |
| performance | measurement spike with explicit benchmark |

## Workflow

### 1. Name the question

Write one sentence:

> This prototype answers: “...”

If there are multiple questions, split them or choose the highest-risk one.

### 2. Define disposal policy

Decide before building:

- delete after answer,
- keep under a clearly marked prototype/temp path,
- extract selected parts later,
- capture decision only in plan/ADR.

Default: throw away.

### 3. Build the smallest artifact

Rules:

- one command or page to run/view,
- obvious fake data,
- clearly marked prototype code,
- no broad refactors,
- no hidden production coupling,
- no real persistence/external effects unless isolated and necessary.

### 4. Evaluate

Record what worked, what failed, chosen option, changed assumptions, and whether production implementation should proceed.

### 5. Cleanup or capture

Delete the artifact, retain it intentionally under a marked path, or convert the decision into a plan, issue, or ADR.

## Output

```markdown
## Prototype Result

**Question:** ...
**Artifact:** ...
**How to run/view:** ...
**Findings:** ...
**Decision:** ...
**Cleanup status:** deleted | retained intentionally | needs cleanup
**Recommended next skill:** vc-align | vc-plan | vc-slice | vc-execute
```

## Guardrails

- Do not prototype five questions at once.
- Do not treat prototype code as production-ready.
- Do not leave prototype artifacts unmarked.
- Do not skip decision capture.
