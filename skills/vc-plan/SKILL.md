---
name: vc-plan
description: Convert aligned intent into an implementation-ready technical plan with right-sized research, traceable units, file paths, test scenarios, and verification criteria. Use when alignment is complete or when the user asks for a technical plan, PRD-to-plan conversion, implementation strategy, or plan deepening.
---

# Vector Cadence Plan

## Purpose

Create a technical plan that an implementer can execute confidently. Planning captures decisions, files, dependencies, risks, and test scenarios; it does not write production code.

## Operating model

Use local code research first, add external or multi-agent research only when risk justifies it, and synthesize strategy, domain language, and alignment notes into a portable plan.

## When to use

Use for:

- converting requirements into implementation strategy,
- planning T2/T3 work,
- scoping refactors or integrations,
- preparing work for slicing or execution,
- deepening an existing plan.

## When to skip

Skip when:

- the user only needs orientation (`vc-orient`),
- the bug lacks root cause (`vc-debug`),
- the task is trivial and safe to execute directly,
- product scope is still unresolved (`vc-align`).

## Inputs

Prefer, in order:

1. requirements doc from alignment,
2. align notes,
3. `STRATEGY.md`,
4. `CONTEXT.md` / `CONTEXT-MAP.md`,
5. relevant ADRs,
6. issue/PR/user prompt,
7. codebase research.

## Workflow

### 1. Classify tier

| Tier | Use for | Research |
|---|---|---|
| T1 | known, low-risk work | local scan |
| T2 | moderate ambiguity, unfamiliar module, integration | local + focused research |
| T3 | architecture, security, privacy, payments, migrations, harness loop | gated deep research |

Ask before expensive T3 research when the harness has cost implications.

### 2. Gather context

Always inspect:

- relevant modules and public interfaces,
- nearby tests,
- project instructions,
- domain glossary and ADRs,
- existing plans/solutions/knowledge docs,
- similar implementations.

Use external research only when local patterns are thin or the topic is high-risk.

### 3. Resolve planning-time questions

Separate:

- planning-time decisions that affect architecture, scope, sequencing, or risk,
- implementation-time discoveries such as final helper names or exact query shape.

Ask the user only for planning-time decisions that cannot be responsibly inferred.

### 4. Write implementation units

Use stable unit IDs:

```markdown
### U1. Add saved-search creation path
```

For each feature-bearing unit include:

- **Goal**
- **Requirements**
- **Dependencies**
- **Files** — repo-relative paths only
- **Approach** — decisions and boundaries, not code
- **Execution note** — optional test-first/characterization-first/migration-safe signal
- **Patterns to follow**
- **Test scenarios** — happy, edge, error, integration as applicable
- **Verification** — outcome-based completion signal

Do not turn units into micro-steps or code instructions.

### 5. Check vertical-slice readiness

Mark whether units are:

- independently shippable vertical slices,
- supporting preparatory units,
- HITL decision units,
- risk-reduction prototypes.

This prepares `vc-slice` to create good issues.

### 6. Review before writing

Verify:

- no invented product behavior,
- domain terms match `CONTEXT.md`,
- ADR conflicts are surfaced,
- file paths are repo-relative,
- feature units have test scenarios,
- high-risk areas include rollout or operational notes,
- deferred work is separate from active scope,
- no implementation code or shell choreography is embedded.

### 7. Save the plan

Default:

```text
docs/plans/YYYY-MM-DD-NNN-<type>-<slug>-plan.md
```

Use `feat`, `fix`, or `refactor`. If the repo has chosen unified lifecycle docs, use `docs/knowledge/<slug>.md` with appropriate frontmatter.

## Output

```markdown
## Plan Ready

**File:** ...
**Tier:** T1 | T2 | T3
**Source artifacts:** ...
**Implementation units:** ...
**High-risk areas:** ...
**Recommended next skill:** vc-review | vc-slice | vc-execute
```

## Guardrails

- Do not code during planning.
- Do not over-research low-risk work.
- Do not publish issues automatically.
- Do not create horizontal units like “backend”, “frontend”, and “tests” unless independently valuable.
- Do not hide uncertainty as fake certainty.
