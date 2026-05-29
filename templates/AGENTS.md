# Agent Instructions

## Vector Cadence skills

Use Vector Cadence skills to match process to risk. Do not run the full lifecycle for trivial work.

### Default lifecycle

```text
vc-orient      # optional, when unfamiliar
vc-align       # clarify meaningful intent
vc-plan        # technical plan for non-trivial work
vc-review      # optional plan/doc review for risky work
vc-slice       # create vertical issues/briefs
vc-triage      # decide agent vs human readiness
vc-execute     # implement clear work
vc-review      # pre-merge review
vc-learn       # capture reusable lessons only
```

### Bug lifecycle

```text
vc-debug → vc-execute → vc-review → vc-learn
```

### Harness lifecycle

```text
vc-harness-architect → vc-plan → vc-slice → vc-execute
```

## Canonical artifacts

- `CONTEXT.md` is a domain glossary only. Do not put implementation plans there.
- ADRs live in `docs/adr/`.
- Alignment notes live in `docs/align-notes/`.
- Requirements live in `docs/brainstorms/`.
- Technical plans live in `docs/plans/` unless this repo uses `docs/knowledge/`.
- Solved-problem learnings live in `docs/solutions/`.
- Handoffs live in `docs/handoffs/`.
- Rejected recurring enhancements live in `.out-of-scope/`.

## Triage label mapping

Map tracker labels to these canonical roles:

- `bug`: <label>
- `enhancement`: <label>
- `needs-triage`: <label>
- `needs-info`: <label>
- `ready-for-agent`: <label>
- `ready-for-human`: <label>
- `wontfix`: <label>

## Validation commands

Fill these in during setup:

- Test: `<command>`
- Typecheck: `<command>`
- Lint: `<command>`
- Format/check: `<command>`

Do not invent commands. If unknown, say unknown.

## Subagent policy

- Review/research subagents are read-only by default.
- Parallel write subagents require isolated worktrees or disjoint file scopes.
- Shared-checkout subagents must not stage, commit, or run whole-suite tests concurrently.
- Parent/orchestrator owns final merge, final validation, and user-facing summary.

## Privacy and telemetry

Do not send Taste, telemetry, private code, secrets, customer data, or preference data to external services without explicit opt-in.

## Tiering

- T1: known low-risk work; keep process lean.
- T2: moderate ambiguity or unfamiliar area; use focused planning/review.
- T3: security, privacy, payments, migrations, public contracts, or harness core loops; require explicit approval for expensive/deep work.
