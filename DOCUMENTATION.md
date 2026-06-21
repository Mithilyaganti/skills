# Vector Cadence Skills — Final Documentation

## Status

This document describes the finalized production-oriented Vector Cadence skill suite in the `skills/` directory.

The suite started as an integration of Matt Pocock’s engineering skills and Compound Engineering’s skills, but the final version no longer exposes that integration history inside each runtime skill. Runtime skills are now concise operating procedures. Source comparisons, rationale, and architecture decisions live in documentation and reference files.

That final shape is intentional:

- `SKILL.md` files are for agents at runtime.
- Documentation files are for humans, maintainers, and future skill authors.
- Extension/harness behavior is not pretended into markdown skills.

---

## Table of Contents

1. Executive Summary
2. Final Design Principle
3. What Changed From the Draft Version
4. Skill Catalog
5. Runtime Skill Structure
6. Lifecycle Workflows
7. Skill Boundaries
8. Artifact Architecture
9. Tiering and Process Control
10. Subagent Policy
11. Harness Architecture Strategy
12. DeepSeek / Reasonix Boundary
13. Code Search and Taste Boundaries
14. Support Files Added
15. Validation and Quality Bar
16. How to Use the Suite
17. How to Maintain the Suite
18. Roadmap
19. Final Recommendation

---

## 1. Executive Summary

Vector Cadence Skills is a production-ready skill suite for agentic software engineering workflows.

Its purpose is to make AI-assisted engineering safer and more reusable by giving agents clear workflows for:

- setup,
- orientation,
- alignment,
- planning,
- issue slicing,
- triage,
- prototyping,
- execution,
- debugging,
- review,
- architecture,
- learning,
- handoff,
- harness design,
- skill authoring.

The central architecture is lifecycle ownership:

```text
setup → orient → align → plan → review → slice → triage → execute → review → learn
```

Not every task uses the full lifecycle. Vector Cadence is designed to scale process up or down according to risk.

Small known change:

```text
vc-execute → optional vc-review
```

Bug:

```text
vc-debug → vc-review → optional vc-learn
```

Harness work:

```text
vc-harness-architect → vc-plan → vc-slice → vc-execute → vc-review
```

The final suite contains:

- 15 runtime skills,
- machine-readable `skills.json`,
- setup templates,
- validation script,
- examples,
- reference docs,
- changelog,
- contributing guide,
- comprehensive documentation.

---

## 2. Final Design Principle

The final design principle is:

> Keep runtime skills operational. Keep rationale in documentation.

Earlier drafts included a section called `Integrated source decision` inside every skill. That section explained whether a skill came primarily from Pocock, Compound, or Vc-specific reasoning.

That was useful during design review, but it was not ideal for production runtime skills.

Reasons:

1. It consumed prompt tokens.
2. It made skills feel like research notes instead of productized workflows.
3. It could distract the agent into thinking about upstream origins instead of executing the workflow.
4. It duplicated information already better captured in documentation.

So the final version removes `Integrated source decision` from runtime skills.

The source rationale now lives in:

- `DOCUMENTATION.md`,
- `references/source-integration-map.md`,
- `references/architecture-overview.md`.

Runtime skills now focus on:

- purpose,
- operating model,
- when to use,
- when to skip,
- inputs,
- workflow,
- output,
- guardrails.

---

## 3. What Changed From the Draft Version

### 3.1 Removed source-rationale sections from runtime skills

Removed from all `vc-*/SKILL.md` files:

```md
## Integrated source decision
```

Replaced with concise operational sections such as:

```md
## Operating model
```

Example idea:

```md
Use branch/worktree safety, task tracking, one-behavior-at-a-time TDD for behavior changes, continuous validation, and scoped subagents only when their file access is safe.
```

This is more useful to the agent than a historical explanation of where the workflow came from.

### 3.2 Normalized skill structure

All runtime skills now generally follow this shape:

```md
---
name: vc-example
description: Does X. Use when Y.
---

# Vector Cadence Example

## Purpose
## Operating model
## When to use
## When to skip
## Inputs
## Workflow
## Output
## Guardrails
```

Some simple skills omit sections that would be redundant, but the main structure is consistent.

### 3.3 Added explicit “When to skip” sections

This is important because Vector Cadence should not over-process trivial work.

Examples:

- `vc-align` skips typos and clear one-file edits.
- `vc-plan` skips bugs without root cause.
- `vc-learn` skips trivial fixes and unverified solutions.
- `vc-execute` skips vague or unsafe work.

### 3.4 Tightened next-skill routing

Each skill’s output now suggests the likely next skill, such as:

```md
**Recommended next skill:** vc-review | vc-learn
```

This helps workflows compose without each skill absorbing the next skill’s responsibility.

### 3.5 Clarified skill-only versus extension-backed behavior

The final docs now explicitly say that markdown skills do not create tools by themselves.

For example:

- subagents require harness/extension support,
- DeepSeek telemetry requires provider/extension support,
- Taste requires explicit tool/extension support,
- code search indexing belongs in an extension,
- permission gates belong in the harness or extension layer.

Skills can say what to do **if the harness provides a tool**. They should not pretend the tool exists.

### 3.6 Added support package files

Added:

- `skills.json`,
- templates,
- validation script,
- examples,
- `CHANGELOG.md`,
- `CONTRIBUTING.md`,
- additional references.

These make the suite closer to something publishable as `vc-skills`.

---

## 4. Skill Catalog

| Skill | Purpose |
|---|---|
| `vc-setup` | Bootstrap repo instructions, docs, labels, validation commands, and optional budget guard. |
| `vc-orient` | Map a codebase area before planning, debugging, or editing. |
| `vc-align` | Clarify product/domain intent, risks, terminology, and rejected alternatives. |
| `vc-plan` | Write implementation-ready technical plans with units, files, tests, and verification. |
| `vc-slice` | Convert plans into vertical issues or agent briefs. |
| `vc-triage` | Route issues to agent, human, needs-info, or wontfix states. |
| `vc-prototype` | Build a throwaway artifact to answer one design question. |
| `vc-execute` | Implement clear work with workspace safety, TDD, and tiered validation. |
| `vc-debug` | Diagnose bugs with a feedback-loop-first and causal-chain process. |
| `vc-review` | Review code/docs against Standards and Spec with severity/confidence routing. |
| `vc-architecture` | Improve application module boundaries, seams, and testability. |
| `vc-learn` | Capture reusable lessons after verified non-trivial work. |
| `vc-handoff` | Compact state for another agent or future session. |
| `vc-harness-architect` | Design Vector Cadence/pi harness, extensions, subagents, providers, search, and permissions. |
| `vc-skill-author` | Create or improve Vc-compatible skills. |

---

## 5. Runtime Skill Structure

### 5.1 Frontmatter

Every skill starts with:

```md
---
name: vc-example
description: Does X. Use when Y.
---
```

The `name` must match the folder name.

The `description` is especially important because skill loaders use it to decide when to load the skill.

Description rules:

- under 1024 characters,
- concrete and trigger-rich,
- says what the skill does,
- includes `Use when`,
- avoids vague “helps with” wording.

### 5.2 Purpose

Short statement of why the skill exists.

### 5.3 Operating model

The runtime replacement for the old source-decision section.

It tells the agent how to think while using the skill, without explaining upstream history.

### 5.4 When to use

Concrete triggers.

### 5.5 When to skip

Prevents overuse and process bloat.

### 5.6 Inputs

Lists expected inputs when relevant.

### 5.7 Workflow

Step-by-step operating procedure.

### 5.8 Output

Standardized summary format and next skill routing.

### 5.9 Guardrails

Hard boundaries and common failure prevention.

---

## 6. Lifecycle Workflows

### 6.1 Full feature workflow

```text
vc-align
  → vc-plan
  → vc-review       optional for important plans
  → vc-slice
  → vc-triage
  → vc-execute
  → vc-review
  → vc-learn        only if reusable lesson exists
```

Use this for meaningful features, cross-cutting work, or work that will enter an issue queue.

### 6.2 Minimal workflow

```text
vc-execute → optional vc-review
```

Use for:

- typos,
- copy tweaks,
- mechanical renames,
- obvious one-file fixes,
- clear small config changes.

See `references/minimal-mode.md`.

### 6.3 Orientation workflow

```text
vc-orient → vc-plan | vc-execute | vc-architecture | vc-debug
```

Use when the agent or user needs a system map before acting.

### 6.4 Bug workflow

```text
vc-debug → vc-review → optional vc-learn
```

If the diagnosis produces clear work but no fix is applied, insert `vc-execute`:

```text
vc-debug → vc-execute → vc-review → optional vc-learn
```

### 6.5 Prototype workflow

```text
vc-align → vc-prototype → vc-plan
```

Use when a design question should be answered before production architecture is chosen.

### 6.6 Application architecture workflow

```text
vc-orient → vc-architecture → vc-plan → vc-slice → vc-execute
```

Use for codebase module boundaries, testability, interfaces, and refactor strategy.

### 6.7 Harness architecture workflow

```text
vc-harness-architect → vc-plan → vc-slice → vc-execute → vc-review
```

Use for Vector Cadence/pi harness, extension, subagent, provider, cache, search, permission, and Taste-related architecture.

---

## 7. Skill Boundaries

Clear boundaries prevent the suite from becoming another pile of overlapping blocks.

### 7.1 `vc-align` vs `vc-plan`

`vc-align` answers:

- what should we build?
- who is it for?
- what should we fear?
- what terms and constraints matter?
- what alternatives were rejected?

`vc-plan` answers:

- how should it be implemented?
- what files/modules are likely involved?
- what units should be built?
- what tests prove it?
- what risks and rollout notes matter?

Alignment does not write implementation units. Planning does not do open-ended product discovery.

### 7.2 `vc-plan` vs `vc-slice`

A plan unit is a technical implementation chunk.

A slice is an issue-ready vertical outcome.

This distinction is critical.

Bad issue decomposition:

```text
1. Build database
2. Build API
3. Build UI
4. Write tests
```

Good vertical slicing:

```text
1. User can create one saved search and see it in the list
2. User gets validation for duplicate saved-search names
3. User can edit a saved search query
4. User can delete a saved search with confirmation
```

### 7.3 `vc-triage` vs `vc-execute`

`vc-triage` decides readiness.

`vc-execute` implements ready work.

If acceptance criteria or confidence are weak, the issue should not be routed to autonomous execution.

### 7.4 `vc-debug` vs `vc-execute`

`vc-debug` finds root cause.

`vc-execute` implements known work.

Do not use execution as a debugging substitute.

### 7.5 `vc-review` vs `vc-learn`

`vc-review` evaluates current work.

`vc-learn` captures future reusable knowledge.

Do not document every review finding. Capture only lessons likely to be searched for later.

### 7.6 `vc-architecture` vs `vc-harness-architect`

`vc-architecture` is for application code architecture:

- modules,
- seams,
- interfaces,
- refactors,
- testability.

`vc-harness-architect` is for Vector Cadence/pi harness architecture:

- wrapper CLI,
- extensions,
- subagents,
- provider/cache strategy,
- skill injection,
- code search,
- permissions,
- Taste integration.

This split was a final cleanup decision because the earlier `vc-architecture` mixed app architecture and harness architecture too much.

---

## 8. Artifact Architecture

Vector Cadence artifacts should answer distinct future questions.

| Artifact | Question answered |
|---|---|
| `AGENTS.md` | How should agents operate in this repo? |
| `CONTEXT.md` | What are domain things called? |
| `STRATEGY.md` | What product outcome matters? |
| `docs/align-notes/` | What did alignment reject, fear, or assume? |
| `docs/brainstorms/` | What should be built from a product/user view? |
| `docs/plans/` | How should it be implemented? |
| issue tracker or `docs/issues/` | What can an agent/human pick up? |
| `docs/solutions/` | What solved problem should future agents reuse? |
| `docs/knowledge/` | What was planned, what shipped, and what changed? |
| `docs/adr/` | Which durable trade-off should future agents respect? |
| `.out-of-scope/` | Which rejected idea should not be rediscovered? |
| `docs/handoffs/` | What state should a future agent resume from? |

See `references/artifact-model.md`.

### 8.1 `CONTEXT.md`

Domain glossary only.

Good:

```md
### Subscription

Definition: A paid entitlement that grants access to...
Aliases to avoid: Plan, Package
Related terms: Account, Billing Profile
```

Bad:

```md
Add the subscription endpoint next sprint.
```

Implementation plans do not belong in `CONTEXT.md`.

### 8.2 ADRs

ADRs should be sparse.

Create an ADR only when a decision is:

1. hard to reverse,
2. surprising without context,
3. chosen after real trade-offs.

### 8.3 Align notes

`docs/align-notes/` captures the “grilling shadow”:

- rejected alternatives,
- fear points,
- assumptions,
- open questions,
- non-ADR context that still matters.

### 8.4 Solution docs

`docs/solutions/` is for solved-problem reuse.

Use `vc-learn` only when the lesson has future retrieval value.

Good lesson:

> Webhook handlers must use provider event ID as the idempotency key, not invoice ID.

Bad lesson:

> Fixed duplicate invoice bug.

---

## 9. Tiering and Process Control

Vector Cadence uses tiers to match process to risk.

| Tier | Use for | Process |
|---|---|---|
| T1 | known, low-risk, small blast radius | lean execution and focused validation |
| T2 | moderate ambiguity or unfamiliar area | alignment, plan, focused research, review gate |
| T3 | high-risk or cross-cutting | gated deep research, doc review, human pause, deep review |

T3 signals:

- auth or permissions,
- payments or billing,
- PII, privacy, or compliance,
- data migrations or backfills,
- public APIs or CLI contracts,
- multi-service behavior,
- harness agent loop,
- subagent write behavior,
- cache-first provider architecture.

See `references/tiering.md`.

The point of tiering is not ceremony. It is judgment.

- Do not over-process T1 work.
- Do not under-research T3 work.

---

## 10. Subagent Policy

Subagents are a harness feature, not a markdown-only feature.

Runtime skills use language like:

```text
If the harness provides subagents...
```

because the skill pack itself cannot create a subagent runtime.

### 10.1 Rollout stages

1. Read-only research/review subagents.
2. Test-running subagents with bounded commands.
3. Serial implementation subagents.
4. Parallel write subagents with isolated worktrees or disjoint file scopes.

### 10.2 Safety rules

- Parent orchestrator owns final merge and validation.
- Review/research subagents are read-only by default.
- Shared-checkout subagents must not stage, commit, or run whole-suite tests concurrently.
- Parallel write subagents require isolation or provably disjoint scopes.
- Every subagent needs a bounded task and output contract.

See `references/subagent-policy.md`.

---

## 11. Harness Architecture Strategy

Vector Cadence should be built as a pi-first modular harness, not a deep fork.

Recommended package split:

```text
@your-scope/vc-core
@your-scope/vc-skills
@your-scope/vc-extensions
@your-scope/vc-cli
```

### 11.1 `vc-core`

Shared code:

- config parsing,
- type definitions,
- artifact helpers,
- tier/budget helpers,
- logging utilities.

### 11.2 `vc-skills`

This skill suite:

- runtime skills,
- templates,
- examples,
- references,
- validation script,
- documentation.

### 11.3 `vc-extensions`

Tools and behavior:

- subagents,
- code search,
- DeepSeek telemetry,
- Taste commands,
- permission gates,
- skill injection if needed.

### 11.4 `vc-cli`

Wrapper UX:

- resolves pi dependency,
- loads extensions,
- loads skills,
- supports curated/composable modes,
- forwards user arguments.

### 11.5 Curated vs composable

Curated mode:

```text
only Vector Cadence prompts/extensions/tools
```

Composable mode:

```text
Vector Cadence plus user/global/project extensions
```

Recommendation:

- composable for ecosystem adoption,
- curated for reproducibility.

---

## 12. DeepSeek / Reasonix Boundary

DeepSeek prefix-cache performance is not just a skill instruction.

It depends on request construction:

- stable system prompt,
- stable tool schema order,
- stable message serialization,
- stable prefix,
- careful compaction,
- volatile scratch kept out of future prefixes.

Markdown skills cannot guarantee Reasonix-level cache behavior.

Safe staged plan:

1. DeepSeek provider support.
2. Cache telemetry.
3. Prompt/tool stability improvements.
4. Optional Reasonix backend/subagent for cache-sensitive tasks.
5. Custom cache-first loop only if measurements justify it.

Safe promise:

> Vector Cadence supports DeepSeek and reports cache telemetry where available.

Unsafe early promise:

> Vector Cadence guarantees Reasonix-level cache hit rates.

Do not make the unsafe promise until telemetry proves it.

---

## 13. Code Search and Taste Boundaries

### 13.1 Code search

Code search belongs in an extension/tool layer.

Progression:

1. regex/symbol wrapper,
2. persistent local index,
3. semantic/hybrid ranking,
4. background watcher,
5. subagent-friendly evidence bundles.

A skill can instruct when to use search. It does not implement the index.

### 13.2 Taste

Taste/preference integration should be opt-in.

Start with explicit commands in an extension:

```text
taste pull <profile>
taste push --all
taste status
```

Then optional prompt injection:

- small summary,
- only when relevant,
- after explicit opt-in.

Do not hide Taste or telemetry behind normal skill execution.

---

## 14. Support Files Added

### 14.1 `skills.json`

Machine-readable index of skill names, paths, categories, and phases.

This is useful for a future Vector Cadence CLI or installer.

### 14.2 Templates

Templates live in `templates/`:

- `AGENTS.md`,
- `CONTEXT.md`,
- `vc-budget.yml`.

### 14.3 Validation script

Script:

```text
scripts/validate-skills.mjs
```

It checks:

- frontmatter exists,
- `name` matches folder,
- description exists and is under 1024 chars,
- description includes `Use when`,
- required runtime sections exist,
- broken markdown links,
- banned legacy runtime command names,
- leftover `Integrated source decision`,
- line-count warnings.

### 14.4 Examples

Examples live in `examples/`:

- `feature-lifecycle.md`,
- `bug-debug-lifecycle.md`,
- `harness-subagent-plan.md`,
- `vertical-slices.md`.

### 14.5 Reference docs

Important references:

- `references/architecture-overview.md`,
- `references/source-integration-map.md`,
- `references/minimal-mode.md`,
- `references/final-skill-quality-bar.md`,
- `references/artifact-model.md`,
- `references/subagent-policy.md`,
- `references/tiering.md`.

---

## 15. Validation and Quality Bar

Validation command from the workspace root used in this environment:

```bash
npm run validate
```

Or:

```bash
node scripts/validate-skills.mjs
```

The current finalization pass produced:

```text
Checked 15 skills.
Validation passed.
```

Final runtime skill line counts after cleanup:

| Skill | Lines |
|---|---:|
| `vc-align` | 124 |
| `vc-architecture` | 131 |
| `vc-debug` | 154 |
| `vc-execute` | 166 |
| `vc-handoff` | 127 |
| `vc-harness-architect` | 138 |
| `vc-learn` | 123 |
| `vc-orient` | 108 |
| `vc-plan` | 156 |
| `vc-prototype` | 103 |
| `vc-review` | 156 |
| `vc-setup` | 126 |
| `vc-skill-author` | 131 |
| `vc-slice` | 121 |
| `vc-triage` | 149 |

Runtime skill docs total:

```text
2,013 lines
```

All runtime skills are under the validator’s 170-line warning threshold.

See `references/final-skill-quality-bar.md`.

---

## 16. How to Use the Suite

### 16.1 Today

This folder is a skill suite. Load or copy the `vc-*` skill folders into any skill-aware harness.

Use the README and templates to bootstrap a project.

### 16.2 Future CLI

The future Vector Cadence CLI should use:

```text
@your-scope/vc-skills
```

as its bundled skill package.

Potential advanced install shape:

```text
@your-scope/vc-core
@your-scope/vc-skills
@your-scope/vc-extensions
@your-scope/vc-cli
```

### 16.3 Slash command convention

Canonical skill names are folder/frontmatter names:

```text
vc-align
vc-plan
vc-execute
```

Slash-command harnesses may expose them as:

```text
/vc-align
/vc-plan
/vc-execute
```

Docs should prefer canonical names unless specifically describing a slash-command UI.

---

## 17. How to Maintain the Suite

### 17.1 Add skills sparingly

Do not add a new top-level skill unless it owns a distinct lifecycle responsibility.

If it is only:

- long rationale → reference doc,
- deterministic helper → script,
- new tool → extension,
- install/default behavior → wrapper CLI.

### 17.2 Keep runtime skills concise

Runtime skills should remain operational.

Do not reintroduce long upstream source-rationale sections into `SKILL.md`.

### 17.3 Keep source rationale in docs

Use `references/source-integration-map.md` to explain upstream sources and integration decisions.

### 17.4 Run validation before publishing

From the project root directory, run:

```bash
npm run validate
```

Or:

```bash
node scripts/validate-skills.mjs
```

### 17.5 Keep examples small

Examples should teach behavior, not become huge tutorials.

### 17.6 Track changes in `CHANGELOG.md`

Update the changelog for any public package release.

---

## 18. Roadmap

### Phase 1: Finalized skill pack

Complete.

Includes:

- runtime skills,
- README,
- comprehensive documentation,
- references,
- examples,
- templates,
- validation script,
- index,
- changelog,
- contributing guide.

### Phase 2: Package as `vc-skills` (Completed)

Completed adding package metadata (`package.json`, `plugin.json`, `skills.json`) and an installer CLI (`scripts/bin.js`) to support Cursor, Claude Code, Pi, Codex, OpenCode, and Oh-My-Pi targets.

### Phase 3: Build `vc-extensions`

Start with:

- `run_subagent`,
- DeepSeek cache telemetry,
- simple code search,
- permission gate,
- optional Taste commands.

### Phase 4: Build `vc-cli`

Thin wrapper around pi:

- load bundled skills,
- load bundled extensions,
- support curated/composable modes,
- forward user args,
- expose setup command.

### Phase 5: Improve subagent orchestration

Progress from read-only to isolated write subagents.

### Phase 6: Measure cache behavior

Use telemetry before deciding whether Reasonix/backend/custom-loop work is worth it.

### Phase 7: Docs site and examples

Create install guide, sample repos, and short workflow demos.

---

## 19. Final Recommendation

The final skill suite is now in the shape it should be for a publishable skill pack:

- runtime skills are concise and operational,
- rationale is documented outside runtime skill files,
- boundaries are clear,
- harness features are not falsely represented as markdown-only skills,
- setup templates and validation exist,
- minimal mode prevents process bloat,
- subagent and DeepSeek/Reasonix claims are properly bounded.

The next best step is not more skill editing. The next best step is packaging and harness implementation:

1. Treat `vector-cadence-skills` as the seed for `@your-scope/vc-skills`.
2. Build `vc-extensions` for actual tools.
3. Build a thin pi-first `vc-cli` wrapper.
4. Keep Reasonix/cache-first work behind telemetry and measurement.
5. Keep Taste and telemetry opt-in.
6. Keep future top-level skills rare.

The rule to preserve:

> Runtime skills tell the agent what to do. Documentation explains why the skill exists.
