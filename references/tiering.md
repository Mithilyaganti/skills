# Vector Cadence Tiering

Tiering matches process and cost to risk.

| Tier | Use for | Process |
|---|---|---|
| T1 | known, low-risk, small blast radius | lean execution and focused validation |
| T2 | moderate ambiguity or unfamiliar area | alignment, plan, focused research, review gate |
| T3 | high-risk or cross-cutting | gated deep research, doc review, human pause, deep review |

## T3 signals

- auth or permissions,
- payments or billing,
- PII, privacy, or compliance,
- data migrations or backfills,
- public APIs or CLI contracts,
- multi-service behavior,
- harness agent loop,
- subagent write behavior,
- cache-first provider architecture.

Do not over-process T1 work. Do not under-research T3 work.
