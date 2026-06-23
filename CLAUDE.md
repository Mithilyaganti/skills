# Vector Cadence Skills

## vc-align

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

---

## vc-architecture

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

---

## vc-debug

# Vector Cadence Debug

## Purpose

Find the root cause before fixing. This skill prevents patching symptoms by requiring a reproduction loop, evidence-backed hypotheses, and a complete causal chain.

## Operating model

Build a fast feedback loop, reproduce the reported symptom, verify environment sanity, test ranked hypotheses one at a time, then fix test-first only after the causal chain is clear.

## When to use

Use for:

- failing tests,
- stack traces,
- production or user-reported bugs,
- regressions,
- flaky or non-deterministic behavior,
- performance regressions,
- “I tried fixes but it still fails”.

## When to skip

Skip when:

- the task is a new feature (`vc-align` or `vc-plan`),
- root cause is already proven and only implementation remains (`vc-execute`),
- the user only wants codebase orientation (`vc-orient`).

## Inputs

Use:

- issue or bug report,
- full comment thread if available,
- stack traces/logs,
- reproduction steps,
- environment details,
- prior failed attempts,
- linked PRs/deployments.

## Workflow

### 1. Build the feedback loop

Prefer:

1. failing test at the real seam,
2. focused command or CLI repro,
3. HTTP/curl script,
4. headless browser script,
5. captured trace replay,
6. throwaway harness,
7. fuzz/property loop,
8. bisection/differential loop,
9. structured human-in-the-loop script.

The loop should be fast, specific, deterministic or high-reproduction-rate, and agent-runnable. If no loop is possible, stop and ask for missing access/artifacts/setup.

### 2. Verify environment sanity

Check likely false leads:

- branch and uncommitted changes,
- dependencies,
- runtime version,
- env vars,
- stale build artifacts,
- local services,
- config differences.

### 3. Reproduce the real symptom

Confirm the loop matches the user’s reported failure, not a nearby unrelated failure. Capture the exact signal.

### 4. Trace the code path

Trace backward from symptom to where valid state becomes invalid. Use observed values, not assumptions. For performance, measure before changing code.

### 5. Form hypotheses

Create 3-5 ranked hypotheses. Each includes:

- suspected cause and location,
- supporting observation,
- causal chain,
- prediction for uncertain links.

Review what has already been ruled out before forming new hypotheses.

### 6. Probe one variable

Use debugger/REPL, targeted logs, temporary assertions, focused test variations, or bisect/diff probes. Tag temporary logs with a unique prefix and remove them before finishing.

Never “log everything and grep”.

### 7. Pass the causal-chain gate

Do not fix until you can explain:

```text
trigger → code path → invalid state starts → symptom appears
```

If stuck after 2-3 hypotheses, diagnose why: wrong mental model, environment mismatch, design problem, contradictory evidence, or insufficient observability.

### 8. Fix test-first

If fixing:

1. Check workspace safety.
2. Write or keep a failing regression test at the correct seam.
3. Verify it fails for the right reason.
4. Apply the minimal root-cause fix.
5. Verify the test passes.
6. Re-run the original loop.
7. Run broader affected tests.
8. Self-review the diff.

If no correct test seam exists, document that and recommend `vc-architecture` after the immediate fix/diagnosis.

### 9. Cleanup and prevention

Remove debug logs, delete or mark throwaway harnesses, record the confirmed root cause, and offer `vc-learn` only for reusable lessons.

## Output

```markdown
## Debug Summary

**Problem:** ...
**Reproduction:** ...
**Root cause:** ...
**Causal chain:** ...
**Fix:** ... or Diagnosis only
**Tests:** ...
**Prevention:** ...
**Confidence:** High | Medium | Low
**Recommended next skill:** vc-execute | vc-review | vc-architecture | vc-learn
```

## Guardrails

- Do not hypothesize without a feedback loop unless impossible, and then say so.
- Do not fix before the causal-chain gate.
- Do not batch unrelated changes.
- Do not retry variants of a failed hypothesis without invalidating it.
- Do not leave instrumentation behind.

---

## vc-execute

# Vector Cadence Execute

## Purpose

Implement approved work safely. This skill assumes the target is clear enough to code; if not, route back to alignment, planning, triage, or debugging.

## Operating model

Use branch/worktree safety, task tracking, one-behavior-at-a-time TDD for behavior changes, continuous validation, and scoped subagents only when their file access is safe.

## When to use

Use for:

- implementing a reviewed plan,
- executing a `ready-for-agent` issue,
- completing an agent brief,
- running a bounded AFK implementation loop.

## When to skip

Skip when:

- scope is vague (`vc-align` or `vc-plan`),
- a bug lacks root cause (`vc-debug`),
- a human design/security/privacy decision is unresolved,
- workspace safety cannot be established.

## Inputs

Accept:

- plan path,
- issue reference,
- agent brief,
- small direct task.

## Workflow

### 1. Triage input

Classify:

| Input | Action |
|---|---|
| trivial direct edit | implement with focused verification |
| ready-for-agent issue | execute from brief |
| plan file | build task list from units |
| vague/high-risk prompt | route to align/plan |
| bug without diagnosis | route to debug |

### 2. Check workspace safety

Before editing:

- check branch and uncommitted changes,
- avoid overwriting user work,
- avoid committing to default branch unless policy/user permits,
- prefer feature branch or isolated worktree for non-trivial work.

### 3. Build task list

Preserve source trace:

- U-IDs,
- requirements,
- dependencies,
- execution notes,
- likely files,
- test scenarios,
- verification criteria.

Track progress in the task tracker or summary, not by editing the plan body.

### 4. Choose execution strategy

| Strategy | Use when |
|---|---|
| Inline | 1-2 small tasks |
| Serial subagents | dependent tasks or large context |
| Parallel read-only subagents | research/review/test probes |
| Parallel write subagents | isolated worktrees or disjoint file scopes |

If the harness does not provide subagents, execute inline or serially yourself.

Never let shared-checkout subagents stage, commit, or run whole-suite tests concurrently.

### 5. Implement behavior with TDD

For behavior-bearing work:

```text
choose one behavior
→ write one failing public-interface test
→ verify it fails for the right reason
→ implement minimal code
→ verify green
→ repeat
→ refactor only while green
```

Test observable behavior through public interfaces. Avoid tests coupled to private implementation. Add integration coverage for callbacks, persistence, permissions, retries, multi-interface parity, and external contract behavior when relevant.

Skip strict test-first for pure styling, mechanical renames, config-only changes, or cases where characterization-first is safer.

### 6. Verify continuously

Before marking a task complete, check:

- what callbacks/middleware/jobs/events fire,
- whether tests exercise the real chain,
- whether failure can leave orphaned state,
- whether other interfaces expose the behavior,
- whether auth, privacy, payments, or external contracts are touched.

Run focused tests first, then broader affected checks as confidence grows.

### 7. Commit only if allowed

If user/project/harness policy permits commits, commit complete logical units only when tests pass and the message describes real value. Do not create WIP commits or stage unrelated files.

### 8. Apply review gate

| Tier | Gate |
|---|---|
| T1 | focused tests + self-review |
| T2 | affected tests + lightweight review |
| T3 | broader validation + security/correctness/performance review + human pause before merge |

## Stop conditions

Stop when:

- acceptance criteria are ambiguous,
- three fix attempts fail,
- tests fail for unknown reasons after focused diagnosis,
- implementation reveals an unplanned product/architecture decision,
- subagent outputs conflict or risk lost work,
- high-risk behavior differs from the plan.

## Output

```markdown
## Execution Summary

**Implemented:** ...
**Source:** ...
**Tests run:** ...
**Review gate:** ...
**Commits:** ...
**Open risks / follow-ups:** ...
**Recommended next skill:** vc-review | vc-learn
```

## Guardrails

- Do not code from vague intent.
- Do not refactor while tests are red.
- Do not let subagents write overlapping files in one checkout.
- Do not leave debug/prototype artifacts unmarked.
- Do not claim validation passed unless it did.

---

## vc-handoff

# Vector Cadence Handoff

## Purpose

Transfer useful state without dumping the whole conversation. A fresh agent should know what happened, what matters, and exactly what to do next.

## Operating model

Reference existing artifacts instead of duplicating them, preserve failed attempts, redact sensitive data, and end with a concrete next action.

## When to use

Use when:

- context is getting full,
- switching agents or harnesses,
- pausing work,
- handing review findings to a resolver,
- preparing a subagent brief,
- leaving a debug or implementation session mid-stream.

## When to skip

Skip when:

- the task is complete and summarized normally,
- there are no decisions, artifacts, or next actions worth preserving,
- a source artifact already fully captures the state.

## Handoff types

| Type | Use for |
|---|---|
| Alignment | after alignment before planning |
| Plan | after planning before execution |
| Execution | mid-implementation |
| Debug | diagnosis or stuck investigation |
| Review | unresolved findings |
| Harness | agent/tool/harness decisions |
| Subagent brief | bounded delegated task |

## Workflow

### 1. Gather state

Collect only what matters:

- user goal,
- current branch/worktree,
- relevant artifact paths,
- decisions made,
- open questions,
- files changed or relevant,
- tests/commands run and results,
- blockers,
- next recommended action.

### 2. Redact and de-risk

Remove secrets, tokens, PII, private customer data, raw sensitive logs, and irrelevant conversation. Reference secure locations instead of copying sensitive details.

### 3. Write compact handoff

Default local path:

```text
docs/handoffs/YYYY-MM-DD-<slug>-handoff.md
```

If temporary-only is requested, provide in chat or outside the repo.

## Templates

### General handoff

```markdown
# Handoff — <topic>

## Goal
## Current state
## Decisions made
## Artifacts
## Files changed / relevant
## Validation so far
## Open questions / blockers
## Next recommended action
## Warnings
```

### Subagent brief

```markdown
# Subagent Brief — <task>

## Role
## Task
## Context artifacts
## Allowed tools / permissions
## Files in scope
## Files out of scope
## Output contract
## Constraints
```

## Output

```markdown
## Handoff Ready

**Path:** ... or provided in chat
**Type:** ...
**Next action:** ...
**Risks:** ...
**Recommended next skill:** depends on handoff type
```

## Guardrails

- Do not duplicate large artifacts already saved.
- Do not include secrets or raw private data.
- Do not hide failed attempts.
- Do not produce a vague “continue from here” handoff.

---

## vc-harness-architect

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

---

## vc-learn

# Vector Cadence Learn

## Purpose

Make future work cheaper and safer by capturing only reusable lessons. This skill prevents both knowledge loss and documentation spam.

## Operating model

Write learning only when the problem is solved or diagnosed, the lesson is reusable, overlap has been checked, and the right artifact type is clear.

## When to use

Use after:

- hard bug diagnosis/fix,
- non-obvious implementation pattern,
- feature shipped with lessons,
- architecture decision,
- harness/tool/subagent integration,
- systemic review finding.

## When to skip

Skip when:

- the fix is trivial,
- the solution is unverified,
- no reusable lesson can be stated in one sentence,
- an existing doc already covers it and needs no update.

## Inputs

Use:

- execution/debug/review summary,
- commits/diff,
- tests added,
- linked issue/plan/requirements,
- existing `docs/solutions/`, `docs/knowledge/`, ADRs, and `CONTEXT.md`.

## Reusable lesson gate

Do not write a learning doc unless the lesson can be stated in one sentence and is likely to be searched for later.

Good:

> Webhook handlers must use provider event ID as the idempotency key, not invoice ID.

Bad:

> Fixed bug in webhook handler.

## Artifact routing

| Lesson type | Artifact |
|---|---|
| domain term | `CONTEXT.md` |
| durable trade-off | ADR |
| solved technical problem | `docs/solutions/<category>/<slug>.md` |
| feature lifecycle reality | `docs/knowledge/<feature>.md` |
| global agent convention | `AGENTS.md` |
| recurring rejected idea | `.out-of-scope/<slug>.md` |

## Workflow

### 1. Gather evidence

Read source artifacts and actual changes. Do not write from memory alone.

### 2. Check overlap

Search for similar docs by symptom, root cause, framework, module, and pattern. Update or consolidate existing docs when overlap is high.

### 3. Choose artifact

Pick the narrowest artifact that answers the future question. Do not collapse glossary, ADR, solution, and feature lifecycle information into one document.

### 4. Write concise learning

Solution docs should include:

- symptom,
- root cause,
- working solution,
- why it works,
- tests/verification,
- prevention,
- related files/docs,
- search keywords.

### 5. Update instructions sparingly

Update `AGENTS.md` only for conventions every future agent should follow. Link to detailed docs instead of embedding long narratives.

### 6. Refresh stale docs when needed

If docs drift or overlap, keep, update, consolidate, replace, or delete after checking retrieval value and inbound links.

## Output

```markdown
## Learning Summary

**Captured:** yes | no
**Lesson:** ...
**Artifacts changed:** ...
**Overlap handled:** none | updated | consolidated | superseded
**Future retrieval keywords:** ...
**Recommended next skill:** none | vc-align
```

## Guardrails

- Do not document trivial work.
- Do not put implementation decisions in `CONTEXT.md`.
- Do not create ADRs unless the sparse ADR rule passes.
- Do not preserve stale docs just because deletion feels risky.
- Do not write multiple draft docs from subagents; write one final artifact.

---

## vc-orient

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

---

## vc-plan

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

---

## vc-prototype

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

---

## vc-review

# Vector Cadence Review

## Purpose

Check whether work is correct, complete, and safe. Review can apply to code diffs, PRs, plans, and requirements documents.

## Operating model

Review along two axes: **Standards** (repo conventions and quality bar) and **Spec** (source plan, issue, requirements, or user intent). Use persona-style review and confidence gates when the harness supports subagents.

## When to use

Use for:

- pre-merge code review,
- T2/T3 implementation gates,
- plan or requirements review,
- security/privacy/payments/API/migration changes,
- resolving whether work satisfies a source artifact.

## When to skip

Skip or keep lightweight for:

- trivial changes with obvious validation,
- work still being actively implemented,
- bugs that need root-cause diagnosis first.

## Inputs

Use:

- diff/branch/PR,
- plan/requirements/issue/agent brief,
- `AGENTS.md`, `CONTEXT.md`, ADRs,
- tests and validation results,
- prior review comments if available.

## Workflow

### 1. Determine scope

Identify changed files, base ref, PR metadata, source artifacts, untracked files, and generated/lockfile exclusions.

### 2. Discover intent

Read the source artifact when available:

- issue agent brief,
- plan U-IDs and verification criteria,
- requirements doc,
- align notes,
- strategy/domain/ADR constraints.

If no meaningful spec exists, review Standards only and label Spec uncertainty.

### 3. Select review lenses

Always consider:

- correctness,
- testing,
- maintainability,
- project standards,
- requirements coverage.

Add conditionals:

- security for auth, permissions, public endpoints, user input,
- performance for queries, caching, async, transformations,
- API contract for routes, types, serializers, public interfaces,
- data migration for migrations/backfills/schema,
- reliability for retries, timeouts, jobs, error handling,
- adversarial for large or high-risk diffs,
- agent-native for harness/tool/agent features.

### 4. Dispatch reviewers if available

If the harness provides subagents, reviewer subagents must be read-only. They may inspect files and run non-mutating commands, but must not edit, commit, push, or change branches.

Use bounded parallelism and treat capacity errors as backpressure.

### 5. Merge findings

For each finding record:

- title,
- severity P0-P3,
- file/line,
- confidence 0/25/50/75/100,
- evidence,
- reviewer/lens,
- route.

Suppress low-confidence findings below 75 unless P0 risk warrants attention. Separate pre-existing issues.

### 6. Route actions

| Route | Meaning |
|---|---|
| safe_auto | local deterministic fix may be applied if policy allows |
| gated_auto | concrete fix exists but changes behavior/contracts; ask or hand off |
| manual | actionable but needs human/downstream resolver |
| advisory | FYI, rollout, risk, or learning |

Do not auto-fix behavior-changing findings without a gate.

### 7. Present verdict

Use tables for findings. Include:

- scope,
- intent source,
- Standards findings,
- Spec findings,
- requirements completeness,
- testing gaps,
- residual risks,
- pre-existing issues,
- verdict.

Verdict options:

- Ready to merge,
- Ready with fixes,
- Not ready.

A code-clean PR that misses explicit requirements is not ready unless the omission is intentional.

## Output

```markdown
## Review Summary

**Scope:** ...
**Intent source:** ...
**Verdict:** Ready | Ready with fixes | Not ready
**Must fix:** ...
**Should fix:** ...
**Testing gaps:** ...
**Residual risks:** ...
**Recommended next skill:** vc-execute | vc-debug | vc-learn
```

## Guardrails

- Do not let reviewer subagents mutate project files.
- Do not flood reports with low-confidence taste opinions.
- Do not review against imagined requirements when source artifacts exist.
- Do not silently drop explicit requirements from the verdict.
- Do not block on inferred requirements alone.

---

## vc-setup

# Vector Cadence Setup

## Purpose

Prepare a repository so Vector Cadence skills know where docs live, what labels mean, which commands validate work, and what project rules agents must follow.

## Operating model

Detect existing conventions first, preserve user/project instructions, ask only for missing setup choices, and create scaffolding lazily unless the user requests full setup.

## When to use

Use when:

- installing Vector Cadence skills in a repo for the first time,
- issue labels or docs layout are unknown,
- validation commands are missing,
- moving from ad-hoc agent use to a structured workflow,
- setting up the future Vector Cadence harness itself.

## When to skip

Skip when:

- the repo already has correct Vector Cadence setup,
- the user only wants a one-off edit,
- you would need to overwrite existing instructions without approval.

## Artifacts

Potential project artifacts:

```text
AGENTS.md
CONTEXT.md
docs/adr/
docs/align-notes/
docs/brainstorms/
docs/plans/
docs/issues/
docs/solutions/
docs/knowledge/
docs/handoffs/
.out-of-scope/
.vc-budget.yml
```

Create only what is needed unless full scaffold is requested.

## Workflow

### 1. Detect environment

Inspect:

- repo root and package manager,
- existing `AGENTS.md` / `CLAUDE.md`,
- existing docs layout,
- issue tracker availability,
- test/typecheck/lint commands,
- branch/worktree support,
- CI config.

### 2. Ask missing setup choices

Ask only what cannot be inferred:

- issue tracker: GitHub, Linear, local markdown, none,
- docs mode: separate `docs/plans` + `docs/solutions` or unified `docs/knowledge`,
- curated vs composable harness behavior,
- whether to enable budget guard,
- lazy vs full directory scaffold.

### 3. Update instruction file safely

Add or update a Vector Cadence section in `AGENTS.md` or the project’s chosen instruction file. Preserve existing content and do not replace project rules.

Include:

- Vector Cadence lifecycle summary,
- artifact locations,
- triage label mapping placeholders,
- validation commands,
- subagent safety policy,
- privacy/telemetry rule.

### 4. Create domain and docs scaffolding

Create `CONTEXT.md` only if domain terms exist or the user wants scaffolding. Keep it glossary-only.

Create docs directories lazily or as requested.

### 5. Add optional budget guard

If approved, create `.vc-budget.yml` from the template.

### 6. Report readiness

Summarize created/updated files, detected tracker, validation commands, docs mode, and any missing setup.

## Output

```markdown
## Vector Cadence Setup Complete

**Instruction file:** ...
**Docs mode:** ...
**Issue tracker:** ...
**Triage mapping:** ...
**Validation commands:** ...
**Created/updated:** ...
**Recommended next skill:** vc-align | vc-harness-architect
```

## Guardrails

- Do not overwrite existing instructions.
- Do not invent validation commands.
- Do not put implementation details in `CONTEXT.md`.
- Do not require GitHub; local markdown issues are valid.
- Do not lock users into curated mode without choice.

---

## vc-skill-author

# Vector Cadence Skill Author

## Purpose

Create skills that are easy for agents to load and execute. A good skill is a concise operating procedure, not a giant essay.

## Operating model

Keep runtime instructions in `SKILL.md`, move rationale and examples to references, add scripts only for deterministic work, and never assume tools/extensions that the harness does not provide.

## When to use

Use when:

- adding a new Vector Cadence skill,
- improving an existing skill,
- converting a workflow into reusable instructions,
- deciding whether a feature belongs in skill/script/extension/wrapper,
- reviewing skill quality.

## When to skip

Skip when:

- the change is ordinary app code,
- the requested behavior requires a tool but no extension will be built,
- a reference doc or subroutine would be better than a top-level skill.

## Skill structure

```text
skill-name/
  SKILL.md
  references/   optional
  scripts/      optional
```

## Description rules

Frontmatter description should:

- be under 1024 characters,
- be third person,
- state capability first,
- include “Use when...” triggers,
- mention concrete contexts,
- avoid vague “helps with”.

## Workflow

### 1. Gather requirements

Clarify:

- task/domain,
- trigger prompts,
- inputs and outputs,
- artifacts read/written,
- safety constraints,
- integration level,
- related or overlapping skills.

### 2. Choose integration level

| Level | Use when |
|---|---|
| Skill | instructions, workflows, style rules |
| Script | deterministic validation/formatting/generation |
| Extension | new tools, providers, subagents, search, telemetry |
| Wrapper | install UX, defaults, package orchestration |

Do not put extension behavior into a markdown skill and pretend it exists.

### 3. Write concise `SKILL.md`

Use consistent sections:

- Purpose,
- Operating model when useful,
- When to use,
- When to skip,
- Inputs,
- Workflow,
- Output,
- Guardrails.

### 4. Split only useful references

Use references for long rationale, schemas, examples, platform-specific details, or comparison tables. Avoid reference sprawl.

### 5. Add scripts only for deterministic tasks

Good scripts validate frontmatter, generate indexes, check links, transform artifacts, or run static checks. Do not script judgment-heavy work.

### 6. Review quality

Check:

- one responsibility,
- clear triggers,
- explicit side effects,
- no invented tools,
- no duplicated rationale,
- valid links,
- examples match actual harness capability,
- next-skill routing is clear.

## Output

```markdown
## Skill Drafted

**Path:** ...
**Integration level:** skill | script | extension | wrapper
**Triggers:** ...
**Artifacts touched:** ...
**Open questions:** ...
**Recommended next skill:** vc-review | none
```

## Guardrails

- Do not create huge monolithic skills.
- Do not hide setup requirements.
- Do not add a top-level skill unless it owns a distinct lifecycle responsibility.
- Do not copy upstream skills verbatim; adapt the useful discipline.

---

## vc-slice

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

---

## vc-triage

# Vector Cadence Triage

## Purpose

Decide what should happen next for issues. Triage routes work to agents, humans, more information, or rejection; it does not implement the work.

## Operating model

Use a small state machine, inspect the full issue context, reproduce bugs when possible, and write durable agent/human briefs only when the issue is ready.

## When to use

Use when:

- reviewing incoming issues,
- preparing AFK-ready work,
- auditing stale issue states,
- moving issues between workflow states,
- deciding whether a task needs human judgment.

## When to skip

Skip when:

- there is no issue or work queue to triage,
- the user wants direct implementation from an approved plan (`vc-execute`),
- the bug first needs root-cause diagnosis (`vc-debug`).

## Canonical states

Each triaged issue should have one category and one state.

Categories:

- `bug`
- `enhancement`

States:

- `needs-triage`
- `needs-info`
- `ready-for-agent`
- `ready-for-human`
- `wontfix`

Map actual tracker labels to these names.

## Workflow

### 1. Select scope

Support:

- show issues needing attention,
- triage a specific issue,
- move an issue to a target state,
- audit `needs-info` or `ready-for-agent` queues.

### 2. Gather context

Read:

- full issue body and comments,
- labels/state,
- linked plans/PRs/docs,
- prior triage notes,
- recent reporter replies,
- related `.out-of-scope/` entries,
- relevant code/docs/ADRs.

Do not triage from the opening body alone.

### 3. Reproduce bugs before grilling

For bugs, try to reproduce with existing steps, focused tests, or code-path tracing. Report whether reproduction succeeded, failed, or needs missing setup.

No repro is often a `needs-info` signal unless code evidence is enough.

### 4. Score readiness

Assess:

- scope clarity,
- acceptance criteria,
- domain language,
- existing patterns,
- verification path,
- risk surface,
- confidence,
- subagent/file safety.

Default readiness threshold for `ready-for-agent`: 70% confidence.

### 5. Recommend state

Present:

```markdown
## Triage Recommendation

**Category:** bug | enhancement
**State:** needs-info | ready-for-agent | ready-for-human | wontfix
**Tier:** T1 | T2 | T3
**Confidence:** ...
**Reasoning:** ...
**Evidence:** ...
**Missing information:** ...
```

Wait before mutating tracker state unless the user requested a direct override.

### 6. Apply outcome

If posting tracker comments, prefix AI-generated triage comments with:

```markdown
> *This was generated by AI during triage.*
```

- `needs-info`: ask specific actionable questions.
- `ready-for-agent`: post an agent brief with goal, context, acceptance, likely files/modules, patterns, tests, constraints, tier, subagent safety, and stop conditions.
- `ready-for-human`: post a human brief and explain why delegation is unsafe.
- `wontfix`: explain politely; for recurring rejected enhancements, write `.out-of-scope/<slug>.md`.
- `needs-triage`: apply state and optionally comment partial findings.

## Output

```markdown
## Triage Complete

**Issue:** ...
**Category/state:** ...
**Tier/confidence:** ...
**Action taken:** ...
**Recommended next skill:** vc-execute | vc-debug | none
```

## Guardrails

- Do not assign conflicting state labels.
- Do not ask questions already answered in comments.
- Do not route vague or low-confidence work to AFK agents.
- Do not send sensitive unresolved decisions to autonomous execution.
- Preserve reusable rejection rationale in `.out-of-scope/`.

---

