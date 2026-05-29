---
name: vc-architecture
description: Improve application code architecture by finding deep-module opportunities, better seams, safer refactor paths, and testability improvements. Use when working on module boundaries, refactor strategy, interface design, architecture friction, or making code more maintainable and agent-navigable. Use vc-harness-architect instead for Vector Cadence/pi harness, subagent, extension, provider, or tool architecture.
---

# Vector Cadence Architecture

## Purpose

Improve application code architecture. This skill finds friction and proposes deeper modules, clearer seams, safer interfaces, and refactor plans.

## Operating model

Ground architecture recommendations in observed code friction, tests, domain language, and ADRs. Prefer changes that improve locality, leverage, and testability.

## When to use

Use for:

- module boundary problems,
- refactor strategy,
- interface/API shape decisions inside an app,
- hard-to-test code,
- shallow pass-through modules,
- tangled responsibility or duplicated invariants.

## When to skip

Skip when:

- the request is about Vector Cadence/pi harness, subagents, extensions, providers, code search, or Taste (`vc-harness-architect`),
- the user only needs a code map (`vc-orient`),
- the architecture direction is known and needs planning (`vc-plan`).

## Vocabulary

Use these terms:

- **Module** — anything with an interface and implementation.
- **Interface** — everything callers must know: types, invariants, errors, ordering, config.
- **Implementation** — code hidden behind the interface.
- **Depth** — behavior/leverage hidden behind a smaller interface.
- **Seam** — where behavior can change without editing callers in place.
- **Adapter** — concrete implementation at a seam.
- **Locality** — related change/bugs/knowledge concentrated in one place.
- **Leverage** — many callers benefit from one deep implementation.

Deletion test: if deleting a module makes complexity vanish, it was likely pass-through; if deleting it spreads complexity across callers, it was earning its keep.

## Workflow

### 1. Explore with domain grounding

Read:

- `CONTEXT.md`,
- relevant ADRs,
- project instructions,
- target code and callers,
- tests around the area,
- prior solutions/knowledge if relevant.

### 2. Find friction

Look for:

- shallow modules,
- concepts spread across many files,
- tests forced to mock internals,
- no public seam for real behavior,
- duplicated invariants,
- hard-to-reason side effects,
- leaky interfaces.

### 3. Present candidates

For each candidate include:

- files/modules,
- observed friction,
- why the current interface is shallow or leaky,
- proposed deeper module or seam,
- locality/leverage benefit,
- testing improvement,
- ADR/domain conflicts,
- recommendation strength: Strong, Worth exploring, or Speculative.

Do not finalize interfaces until the user chooses a candidate.

### 4. Design interface when needed

For a chosen candidate:

1. Gather required behaviors and invariants.
2. Create 2-3 meaningfully different interface shapes.
3. Compare depth, misuse risk, testability, migration cost, and domain fit.
4. Recommend one.
5. Decide whether an ADR is warranted.

### 5. Plan refactor path

If implementation work should proceed, produce or route to a plan with:

- current friction,
- desired seam/module,
- compatibility strategy,
- characterization tests,
- vertical migration slices,
- rollback/stop conditions,
- docs/ADR updates.

## Output

```markdown
## Architecture Summary

**Top finding:** ...
**Recommended direction:** ...
**Why this improves locality/leverage/testability:** ...
**Risks:** ...
**Artifacts to write:** plan | ADR | CONTEXT update | issues
**Recommended next skill:** vc-plan | vc-slice | vc-execute
```

## Guardrails

- Do not recommend architecture from taste alone.
- Do not relitigate ADRs without real friction.
- Do not create seams only for hypothetical future adapters.
- Do not confuse product scope decisions with code architecture decisions.
- Do not use this skill for harness architecture; use `vc-harness-architect`.
