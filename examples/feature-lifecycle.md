# Example: Feature Lifecycle

User request:

> Add scheduled exports for teams.

Recommended path:

```text
vc-align → vc-plan → vc-review → vc-slice → vc-triage → vc-execute → vc-review → vc-learn
```

## 1. Align

Clarify:

- which users need exports,
- what “scheduled” means,
- success criteria,
- rejected alternatives,
- data retention concerns.

Artifacts:

- `docs/brainstorms/YYYY-MM-DD-scheduled-exports-requirements.md`
- `docs/align-notes/scheduled-exports-grilled.md`

## 2. Plan

Produce U-IDs, files, patterns, test scenarios, and verification.

## 3. Slice

Good vertical slices:

1. User can schedule one export.
2. User can see export status.
3. Failed export retries safely.
4. Admin can inspect export history.

Bad horizontal slices:

- Create export tables.
- Build export API.
- Build export UI.
- Write tests.

## 4. Execute and review

Implement AFK slices with TDD. Use review to catch missed permissions, data leaks, N+1s, and missing tests.

## 5. Learn

Capture only reusable lessons, such as idempotency or retention rules.
