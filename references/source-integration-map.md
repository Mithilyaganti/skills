# Source Integration Map

This document explains which upstream skill ideas were preserved, replaced, or integrated in the Vector Cadence skill suite.

## Summary table

| Vector Cadence skill | Pocock source | Compound source | Decision |
|---|---|---|---|
| `vc-setup` | `setup-matt-pocock-skills` | `ce-setup`, `ce-work` assumptions | Integrate |
| `vc-orient` | `zoom-out` | repo research agents | Integrate, Pocock lightweight posture |
| `vc-align` | `grill-me`, `grill-with-docs`, `ubiquitous-language` | `ce-brainstorm`, `ce-strategy` ideas | Integrate, Compound shell + Pocock discipline |
| `vc-plan` | `to-prd`, architecture/testability prompts | `ce-plan`, `ce-doc-review` | Compound base, Pocock quality bar |
| `vc-slice` | `to-issues` | plan U-IDs/test scenarios | Pocock base, Compound metadata |
| `vc-triage` | `triage` | issue/debug handoff patterns | Pocock base, Vector Cadence gates |
| `vc-prototype` | `prototype` | frontend proof/demo ideas | Pocock base |
| `vc-execute` | `tdd` | `ce-work` | Compound shell + Pocock inner loop |
| `vc-debug` | `diagnose` | `ce-debug` | Integrated equally |
| `vc-review` | `review` Standards-vs-Spec | `ce-code-review`, `ce-doc-review` | Compound base |
| `vc-architecture` | `improve-codebase-architecture`, `design-an-interface` | `ce-agent-native-architecture`, `ce-agent-native-audit` | Route by architecture type |
| `vc-learn` | ADR/glossary discipline | `ce-compound`, `ce-compound-refresh` | Compound base, Pocock artifact discipline |
| `vc-handoff` | `handoff` | workflow handoffs | Pocock base, Compound trace IDs |
| `vc-harness-architect` | setup/TDD/vertical-slice habits | agent-native architecture | Compound + harness strategy |
| `vc-skill-author` | `write-a-skill` | package/harness needs | Pocock base |

## Key integration decisions

### 1. Alignment is not planning

Pocock grilling and Compound brainstorming both live upstream, but they answer slightly different questions.

- Compound asks: what are we building and why?
- Pocock asks: are we using the right concepts and have we resolved the hard branches?

Vector Cadence Align integrates these into one alignment workflow. It does not immediately create implementation units. That is planning’s job.

### 2. Planning uses Compound structure, not Pocock PRD as-is

Pocock `to-prd` is strong at synthesizing conversation into a product doc, but Compound `ce-plan` is stronger for technical handoff because it includes:

- U-IDs,
- repo-relative files,
- test scenarios,
- dependencies,
- implementation posture,
- verification criteria.

Vector Cadence Plan therefore uses Compound as the shell. Pocock contributes domain grounding, no-code planning discipline, public-interface testing bias, and deep-module awareness.

### 3. Issue slicing remains Pocock-dominant

Compound implementation units are not the same as issue tracker slices. An implementation unit can be atomic but still not independently shippable.

Pocock `to-issues` has the stronger rule: every issue should be a tracer bullet through the system.

Vector Cadence Slice therefore uses Pocock as the base and imports Compound metadata from plans.

### 4. Execution uses Compound orchestration but Pocock TDD

Compound `ce-work` is the better executor because it handles:

- branch/worktree setup,
- task lists,
- subagent strategies,
- incremental commits,
- continuous tests,
- shipping workflow.

But Pocock `tdd` has the better coding discipline:

- one behavior at a time,
- public interface tests,
- no horizontal test/code phases,
- refactor only while green.

Vector Cadence Execute embeds Pocock TDD inside Compound orchestration.

### 5. Debugging needs both sources

Pocock `diagnose` has the strongest feedback-loop-first message: build a deterministic loop or stop.

Compound `ce-debug` has the strongest causal-chain and environment discipline.

Vector Cadence Debug combines them because a feedback loop without causal rigor can still patch symptoms, and causal rigor without a loop can become code-reading theater.

### 6. Review is Compound-dominant

Compound `ce-code-review` is much more operationally complete than Pocock review:

- personas,
- severity,
- confidence,
- deduplication,
- validators,
- autofix routing,
- residual handoff.

Pocock’s useful contribution is the Standards-vs-Spec lens. Vector Cadence Review preserves that lens while using Compound’s machinery.

### 7. Architecture is split by problem type

Pocock wins for normal code architecture because the deep-module vocabulary is precise and actionable.

Compound wins for agent-native/harness architecture because it has concepts Pocock does not cover:

- action parity,
- primitive tools,
- dynamic context injection,
- shared workspace,
- agent-native testing,
- self-modification.

Vector Cadence Architecture routes instead of forcing one framework to cover both.

### 8. Learning is Compound-dominant but artifact-disciplined

Compound’s compounding system is the best source for solved-problem memory.

But without Pocock’s artifact discipline, it can bloat docs. Vector Cadence Learn keeps:

- domain terms in `CONTEXT.md`,
- decisions in ADRs,
- solved problems in `docs/solutions/`,
- lifecycle reality in `docs/knowledge/`,
- trivial work undocumented.

## What was intentionally not copied

### Deprecated Pocock skills as standalone commands

- `ubiquitous-language` was folded into `vc-align` and `vc-setup` using `CONTEXT.md`.
- `design-an-interface` was folded into `vc-architecture` as a subroutine.
- `request-refactor-plan` was folded into `vc-architecture` + `vc-plan` + `vc-slice`.

### Compound specialty skills not needed yet

Many Compound skills are valuable but not part of the initial integrated suite:

- release notes,
- Slack research,
- demo reels,
- Xcode/browser specialty tests,
- Rails-specific style,
- beta dogfood flows,
- image generation,
- product pulse.

They can remain optional extensions later. Including all of them now would recreate the “pile of blocks” problem.

## Design rule for future additions

Before adding a new Vector Cadence skill, answer:

1. Is this a distinct lifecycle responsibility?
2. Does it need a new user-facing command, or is it a subroutine of an existing skill?
3. Is it prompt-only, extension-backed, or wrapper-level?
4. What artifact does it read or write?
5. What upstream skill discipline is actually better for this responsibility?

If the answer is “it is just another checklist,” do not add a top-level skill.
