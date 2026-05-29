# Minimal Vector Cadence Mode

Vector Cadence should not feel heavy for small tasks. Use the minimum process that makes the work safe.

## For tiny known changes

```text
vc-execute → optional vc-review
```

Examples:

- copy tweak,
- obvious one-file bug,
- mechanical rename,
- small config change with known validation.

## For unfamiliar code

```text
vc-orient → vc-execute → optional vc-review
```

Use orientation only long enough to avoid guessing.

## For meaningful features

```text
vc-align → vc-plan → vc-execute → vc-review → optional vc-learn
```

Add `vc-slice` and `vc-triage` when work becomes a queue of issues or AFK tasks.

## For bugs

```text
vc-debug → vc-execute → vc-review → optional vc-learn
```

Do not start with planning when the root cause is unknown.

## When not to use the full lifecycle

Skip full Vector Cadence for:

- typos,
- formatting-only changes,
- obvious dependency bumps,
- throwaway experiments,
- changes where the user supplied exact instructions and validation is clear.
