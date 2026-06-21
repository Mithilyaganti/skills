# Vector Cadence Skills — Architecture Overview

This is the short architecture document for the new skill suite. The full, comprehensive documentation can be found in [DOCUMENTATION.md](file:///c:/Users/mithi/Desktop/mithil/skills/DOCUMENTATION.md).

## 1. What changed from the original Vector Cadence document

The original Vector Cadence research doc had the right instinct — combine Pocock’s alignment-first workflow with Compound’s orchestration and review — but the architecture risk was that it composed skills like stacked blocks:

```text
run Pocock thing
then run Compound thing
then save output
```

That is not integration. It creates duplicated artifacts, duplicated questions, and unclear ownership.

The new suite integrates by assigning each workflow a primary owner:

- **Alignment owns product/domain decisions.** It can use brainstorming and grilling, but its output is intent.
- **Planning owns technical decisions.** It can use research, but its output is an implementation-ready plan.
- **Slicing owns issue shape.** It converts plans into vertical, independently useful work.
- **Triage owns delegation safety.** It decides agent vs human, not implementation.
- **Execution owns code changes.** It uses TDD and orchestration, not new product discovery.
- **Review owns confidence.** It checks Standards and Spec with multi-agent help when useful.
- **Learning owns reusable memory.** It captures only lessons that future agents will retrieve.

This prevents workflow overlap.

## 2. Why Pocock and Compound are not interchangeable

Pocock’s skills are strongest at **engineering judgment close to the work**:

- ask one question at a time,
- use domain language,
- create vertical slices,
- write behavior tests through public interfaces,
- debug through feedback loops,
- design deep modules,
- compact handoffs.

Compound’s skills are strongest at **orchestration and institutional scale**:

- brainstorm → plan → work → review pipelines,
- multi-agent code/doc review,
- plan U-IDs and requirements traceability,
- subagent orchestration and worktree safety,
- solved-problem knowledge capture,
- agent-native application architecture.

Vector Cadence uses each where it is structurally better, not where it happens to have a similarly named command.

## 3. The lifecycle

```text
Setup
  → Orient
  → Align
  → Plan
  → Review plan when useful
  → Slice
  → Triage
  → Execute
  → Review code
  → Learn
```

### Setup

`vc-setup` creates the repo contract: where domain language lives, where ADRs live, how issue labels map to canonical triage states, and what commands verify work.

Without this, every skill guesses.

### Orient

`vc-orient` is read-only. It maps a code area and separates verified code facts from inferred/documented context.

It exists because many agent mistakes come from editing a local file before understanding the system shape.

### Align

`vc-align` is the product/domain checkpoint.

It integrates Compound’s brainstorm workflow with Pocock’s grilling discipline. It captures:

- clean requirements in `docs/brainstorms/`,
- messy rejected alternatives and fears in `docs/align-notes/`,
- canonical domain terms in `CONTEXT.md`,
- durable trade-offs in ADRs only when warranted.

The major design choice is separating clean requirements from the grilling shadow. Formal docs are good for decisions; raw align notes are good for preventing repeated mistakes.

### Plan

`vc-plan` turns aligned intent into technical design.

It uses Compound’s plan structure because that is stronger than Pocock’s PRD for implementation handoff: U-IDs, files, patterns, dependencies, test scenarios, and verification are explicit.

But Pocock’s rules are injected into the plan quality bar:

- code-first verification,
- domain language,
- no implementation code in plans,
- public-interface tests,
- deep-module/seam awareness,
- vertical-slice readiness.

### Slice

`vc-slice` exists because a good technical plan is not automatically a good issue set.

Compound plan units are often atomic implementation units. Pocock tracer-bullet issues are end-to-end vertical slices. Vector Cadence keeps both concepts separate:

- plan unit = coherent implementation decision,
- slice/issue = independently shippable or verifiable outcome.

This is the main fix to the “adding blocks” problem.

### Triage

`vc-triage` is the delegation gate.

It uses Pocock’s issue state machine but adds Vector Cadence confidence and subagent-safety gates. The important distinction:

- `ready-for-agent` means autonomous execution is safe,
- `ready-for-human` means human judgment is still the task,
- `needs-info` means the missing information is specific and actionable.

### Execute

`vc-execute` uses Compound’s work execution shell because it handles real implementation concerns: branch safety, task tracking, subagent execution, incremental commits, and continuous testing.

But the inner coding loop is Pocock TDD:

```text
one behavior → one failing public-interface test → minimal code → green → repeat
```

This prevents the Compound-style executor from becoming a generic task machine that writes all tests first or implements layer by layer.

### Debug

`vc-debug` is its own path because bugs should not start with planning.

It combines:

- Pocock’s feedback-loop-first diagnosis,
- Compound’s causal-chain gate and environment sanity checks.

The rule is simple: no causal chain, no fix.

### Review

`vc-review` is Compound-dominant because Compound’s code review system is much stronger operationally: personas, severity, confidence, deduplication, validators, and routing.

Pocock’s contribution is the two-axis review frame:

- Standards: did we follow repo rules?
- Spec: did we satisfy the source artifact?

### Architecture

`vc-architecture` has two routes:

- general code architecture → Pocock deep modules,
- harness/agent architecture → Compound agent-native architecture.

This split matters. “Make this module deeper” and “design an agent-native harness” are not the same problem.

### Learn

`vc-learn` is Compound-dominant because solved-problem compounding is one of Compound’s clearest strengths.

Pocock discipline prevents knowledge bloat:

- `CONTEXT.md` stays glossary-only,
- ADRs stay sparse,
- trivial fixes are not documented,
- artifacts answer distinct future questions.

## 4. Tiering model

Vector Cadence has three tiers:

| Tier | Meaning | Typical workflow |
|---|---|---|
| T1 | known, low-risk work | align lightly → plan lightly or execute direct → focused review |
| T2 | moderate complexity or unfamiliar module | align → plan with focused research → slice/execute → review |
| T3 | high-risk architecture/security/privacy/migration/harness loop | deep align → deep plan → doc review → gated execution → deep review |

Tiering is not about making the agent fancy. It is cost control.

Most tasks should not spawn many agents. High-risk tasks should not skip research.

## 5. Subagent policy

Vector Cadence assumes subagents will exist in the harness, but does not assume they can safely write anywhere.

Default stages:

1. read-only research subagents,
2. read-only review subagents,
3. test-running subagents,
4. serial implementation subagents,
5. parallel write subagents only with disjoint scopes or isolated worktrees.

The orchestrator owns:

- final merge,
- final validation,
- user-facing summary,
- conflict handling.

This avoids the common demo trap: impressive parallelism that corrupts the checkout.

## 6. Harness packaging strategy

Recommended package split:

```text
@your-scope/vc-core
@your-scope/vc-skills
@your-scope/vc-extensions
@your-scope/vc-cli
```

Build on **bare pi** as the substrate. Borrow little-coder launcher and extension patterns, but avoid a deep fork.

Why:

- easier upstream updates,
- extensions stay composable,
- skills can be installed without the full CLI,
- advanced users can load only the extension package,
- future Reasonix/cache-first work can evolve without rewriting every skill.

## 7. DeepSeek / Reasonix boundary

A skill suite can improve DeepSeek usage, but it cannot by itself guarantee Reasonix-style cache hit rates.

Reasonix-level caching depends on request construction:

- stable system prompt,
- stable tool schema order,
- stable message serialization,
- append-only history where possible,
- scratch excluded from future stable prefixes,
- careful compaction.

That is harness-loop architecture, not just markdown instructions.

So Vector Cadence’s staged plan is:

1. DeepSeek provider support,
2. cache telemetry,
3. prompt/tool stability improvements,
4. Reasonix backend/subagent for selected tasks,
5. custom pi SDK cache-first loop only if measurements justify it.

## 8. Taste and future tools

Taste, code search, browser tools, and other integrations belong in extensions, not ordinary skills.

A skill can describe when to use them. An extension provides the tool.

Privacy rule: Taste/telemetry must be explicit opt-in.

## 9. Why this architecture should scale

The suite scales because responsibilities are separated:

- alignment does not write code,
- plans do not become issues automatically,
- issue slicing enforces verticality,
- triage decides autonomy,
- execution respects tests and branch safety,
- review is confidence-gated,
- learning captures only reusable knowledge.

Each step reduces uncertainty for the next step instead of piling more process on top.
