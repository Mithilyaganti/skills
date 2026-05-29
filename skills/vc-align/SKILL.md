---
name: vc-align
description: Align feature, fix, refactor, or harness intent before technical planning by clarifying scope, domain language, risks, and rejected alternatives. Use when starting meaningful work, when scope is fuzzy, when terminology matters, or when a plan needs pressure-testing before implementation.
---

# Vector Cadence Align

## Purpose

Clarify what should be built and why before technical planning begins. This skill turns fuzzy intent into shared product/domain understanding, without writing implementation code.

## Operating model

Use a right-sized alignment conversation: inspect existing code/docs first, ask one focused question at a time, sharpen domain language, compare real alternatives, and capture both clean requirements and messy guardrails.

## When to use

Use for:

- new features or meaningful product changes,
- non-trivial fixes where expected behavior is unclear,
- refactors with user-visible or architectural consequences,
- harness, tool, provider, or subagent design ideas,
- requests like “grill this”, “stress-test this”, “is this architecture right?”, or “help me scope this”.

## When to skip

Skip or keep extremely lightweight for:

- typos and mechanical edits,
- obvious one-file changes,
- work with an already reviewed requirements document,
- bugs that first need root-cause diagnosis with `vc-debug`.

## Inputs

Use what exists:

- user prompt or issue,
- `STRATEGY.md`,
- `CONTEXT.md` or `CONTEXT-MAP.md`,
- relevant ADRs,
- previous requirements/plans/knowledge docs,
- code paths that can verify claims.

## Workflow

### 1. Classify depth

| Depth | Signals | Behavior |
|---|---|---|
| Lightweight | clear low-risk change | short scan, 0-2 questions, concise summary |
| Standard | feature or meaningful ambiguity | context scan, pressure test, requirements/align notes |
| Deep | architecture, security, privacy, payments, harness loop | deeper alternatives, explicit risks, ADR candidates |

### 2. Scan existing context

Before asking, inspect what the repo can answer:

1. Read strategy if present.
2. Read domain glossary and relevant ADRs.
3. Search for similar code or artifacts.
4. Verify checkable claims in code.
5. Label anything inferred or unverified.

Never ask the user a question the repo can answer.

### 3. Pressure-test the idea

Probe only gaps that actually exist:

- evidence: what proves this matters?
- specificity: who exactly benefits?
- counterfactual: what happens if nothing ships?
- attachment: is the proposed shape the smallest useful shape?
- durability: what future shift could break this bet?

Ask one question at a time. Provide a recommended answer when useful.

### 4. Explore alternatives

When multiple directions are plausible, present 2-3 concrete approaches that differ in product or mechanism shape. For each, include:

- what it is,
- when it works best,
- what it simplifies,
- what it complicates,
- risks or unknowns.

Then recommend one and ask for confirmation.

### 5. Capture decisions

Write only artifacts that earn their carrying cost:

- update `CONTEXT.md` for durable domain terms only,
- offer an ADR only for hard-to-reverse, surprising, trade-off decisions,
- write `docs/align-notes/<slug>-grilled.md` for rejected alternatives, anxiety points, assumptions, and open questions,
- write `docs/brainstorms/YYYY-MM-DD-<topic>-requirements.md` when durable requirements are useful.

## Output

End with:

```markdown
## Alignment Summary

**Intent:** ...
**Target user / actor:** ...
**Success looks like:** ...
**Chosen approach:** ...
**Rejected alternatives:** ...
**Key risks / assumptions:** ...
**Artifacts updated:** ...
**Recommended next skill:** vc-plan | vc-prototype | vc-debug
```

## Guardrails

- Do not write implementation code.
- Do not turn `CONTEXT.md` into a spec or task list.
- Do not create ADRs for obvious or reversible choices.
- Do not publish issues from this skill.
- Preserve messy guardrails in align notes instead of flattening them into clean requirements.
