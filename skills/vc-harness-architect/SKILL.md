---
name: vc-harness-architect
description: Design or evolve the Vector Cadence/pi harness, including wrapper CLI, extensions, subagents, provider/cache strategy, skill injection, code search, permission gates, and optional Taste integration. Use when working on harness architecture rather than application code architecture; use vc-architecture for app modules and refactors.
---

# Vector Cadence Harness Architect

## Purpose

Design the Vector Cadence/pi harness and its extension ecosystem. This skill handles tool/runtime architecture, not ordinary application feature work.

## Operating model

Prefer a thin pi-first wrapper, modular packages, primitive extension tools, read-only subagents first, explicit privacy boundaries, and measurement before performance/cache claims.

## When to use

Use for:

- Vector Cadence CLI/wrapper design,
- skill injection strategy,
- pi extensions,
- subagent runtime design,
- DeepSeek/provider/cache telemetry,
- code search tools,
- permission gates,
- optional Taste/preference integration,
- harness tests and packaging.

## When to skip

Skip when:

- improving application module boundaries (`vc-architecture`),
- implementing a planned harness slice (`vc-execute`),
- writing a prompt-only skill (`vc-skill-author`).

## Default package architecture

```text
@your-scope/vc-core        # shared types/config/utils
@your-scope/vc-skills      # markdown skills
@your-scope/vc-extensions  # pi extensions/tools
@your-scope/vc-cli         # thin wrapper CLI
```

Use bare pi as substrate. Borrow little-coder patterns. Avoid a deep fork unless extension/wrapper paths cannot support the requirement.

## Workflow

### 1. Classify harness area

| Area | Examples |
|---|---|
| Wrapper CLI | launch, config, curated/composable flags |
| Skill injection | selection, prompt chunks, stable ordering |
| Subagents | RPC subprocess, SDK child session, external service |
| Provider/cache | DeepSeek config, telemetry, Reasonix boundary |
| Code search | regex, symbol index, semantic search |
| Taste/preferences | explicit commands, optional prompt summary |
| Permission gates | approvals, filesystem scopes, dangerous commands |
| Testing | fake pi objects, extension registration, CLI smoke tests |

### 2. Choose integration level

| Need | Proper layer |
|---|---|
| instructions/checklist | skill package |
| deterministic helper | script |
| new tool/behavior | extension package |
| install/default UX | wrapper CLI |
| cache-first request construction | harness core, SDK loop, or backend |

Do not solve extension problems with markdown-only instructions.

### 3. Apply agent-native checks

Evaluate:

- action parity,
- primitive tool granularity,
- composability,
- dynamic context injection,
- shared workspace/files,
- completion signals,
- permission and approval gates,
- recovery/resume,
- agent-native tests.

### 4. Design subagents safely

Default rollout:

1. read-only research/review,
2. test-running with bounded commands,
3. serial implementation,
4. parallel write only with isolated worktrees or disjoint file scopes.

Parent orchestrator owns final merge, validation, conflict handling, and user summary.

### 5. Design provider/cache features honestly

DeepSeek/Reasonix strategy should progress from provider support to telemetry to prompt stability to optional Reasonix backend. Do not promise Reasonix-level prefix-cache behavior without loop-level control and measured telemetry.

### 6. Plan tests

At minimum verify:

- extension registration,
- schema stability,
- permission enforcement,
- timeout/cancellation,
- output contracts,
- CLI help/config loading,
- curated/composable behavior.

## Output

```markdown
## Harness Architecture Recommendation

**Area:** ...
**Integration level:** skill | script | extension | wrapper | SDK loop | backend
**Recommended design:** ...
**Why:** ...
**Risks:** ...
**First vertical slice:** ...
**Tests:** ...
**Recommended next skill:** vc-plan | vc-skill-author | vc-execute
```

## Guardrails

- Do not fork pi/little-coder unless extension/wrapper paths cannot work.
- Do not allow parallel write subagents in one checkout.
- Do not imply markdown skills can create tools by themselves.
- Do not send Taste/telemetry data without opt-in.
- Do not vary stable prompt prefixes unnecessarily in DeepSeek mode.
