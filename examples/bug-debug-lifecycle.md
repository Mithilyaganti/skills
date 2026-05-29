# Example: Bug Debug Lifecycle

User request:

> Webhook retries are creating duplicate invoices.

Recommended path:

```text
vc-debug → vc-review → vc-learn
```

Use `vc-execute` separately if diagnosis produces a clear implementation plan but no fix was applied during debugging.

## Debug

1. Build a replay loop from captured webhook payload.
2. Reproduce duplicate invoice creation.
3. Check environment and config.
4. Trace idempotency key selection.
5. Form hypotheses.
6. Prove root cause.
7. Write failing integration test.
8. Apply minimal fix.
9. Re-run original replay loop.

## Review

Because this touches payments, review with security, correctness, reliability, and data-integrity lenses.

## Learn

Good lesson:

> Webhook handlers must use provider event ID as the idempotency key, not invoice ID.

Bad lesson:

> Fixed duplicate invoice bug.
