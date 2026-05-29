# Example: Harness Subagent Feature

User request:

> Add read-only research subagents to the Vector Cadence harness.

Recommended path:

```text
vc-harness-architect → vc-plan → vc-slice → vc-execute → vc-review
```

## Harness architecture

Decisions:

- integration level: extension package,
- first implementation: pi RPC subprocess or harness-supported child session,
- default permission: read-only,
- required timeout,
- structured output contract,
- raw log path for auditability.

## First vertical slices

1. Register `run_subagent` tool with schema and timeout requirement.
2. Enforce read-only default permissions.
3. Capture raw log and concise summary.
4. Add validation tests for malformed output and timeout.

## Review gates

Use agent-native and security lenses:

- no unrestricted file writes,
- no hidden network/telemetry,
- no unbounded process execution,
- clear output contract,
- cancellation/timeouts tested.
