---
name: vc-orient
description: Map a codebase area and explain how it fits the system using code, tests, domain docs, ADRs, and prior knowledge. Use when the user is unfamiliar with code, an agent seems too deep in details, or planning/debugging needs a verified system map.
---

# Vector Cadence Orient

## Purpose

Create a read-only map of a code area so later alignment, planning, debugging, or implementation starts from reality instead of guesses.

## Operating model

Read code first, docs second. Separate verified facts from inferred patterns, stale-doc claims, and unknowns.

## When to use

Use when:

- the user asks how something works,
- the agent is editing without enough system context,
- planning needs a local map,
- debugging needs data/control flow,
- architecture review needs candidate areas,
- onboarding to a module.

## When to skip

Skip when:

- the user already provided enough context,
- the task is a clear small edit,
- the user wants implementation now and orientation would add no value.

## Inputs

Subject can be:

- file path,
- symbol/class/function,
- feature name,
- domain term,
- issue/plan requirement,
- error path.

## Workflow

### 1. Identify subject

If ambiguous, ask one clarifying question or start with the most likely subject and label uncertainty.

### 2. Read in priority order

1. Code around the subject.
2. Callers/callees and adjacent modules.
3. Tests exercising the subject.
4. `CONTEXT.md` terms.
5. Relevant ADRs.
6. Knowledge/solution docs if relevant.
7. Project instructions.

### 3. Build the map

Explain:

- responsibility and non-responsibility,
- key files/modules,
- public interfaces and seams,
- data/control flow,
- important invariants,
- tests and verification paths,
- known risks or historical lessons,
- likely extension points.

### 4. Label confidence

Separate:

- verified from code,
- inferred from naming/patterns,
- stated in docs but not verified,
- unknown.

## Output

```markdown
## Orientation Map

**Subject:** ...
**Responsibility:** ...
**Key files:** ...
**Public interfaces / seams:** ...
**Data/control flow:** ...
**Domain terms:** ...
**Relevant tests:** ...
**Relevant ADRs/knowledge:** ...
**Risks / gotchas:** ...
**What to read next:** ...
**Recommended next skill:** vc-align | vc-plan | vc-architecture | vc-debug
```

## Guardrails

- Do not mutate files.
- Do not summarize from docs before reading code.
- Do not produce giant file inventories unless asked.
- Do not hide uncertainty.
- Do not create durable docs unless the user asks or future retrieval value is clear.
