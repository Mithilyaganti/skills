# Contributing to Vector Cadence Skills

## Principle

Do not add a top-level skill unless it owns a distinct lifecycle responsibility.

If the content is long rationale, use a reference doc. If the behavior needs a tool, build an extension. If it is deterministic, consider a script.

## Skill structure

Each skill should use this shape when practical:

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

Simple skills may omit `Operating model` or `Inputs` when unnecessary.

## Description rules

Descriptions should:

- be under 1024 characters,
- be concrete and trigger-rich,
- explain what the skill does,
- include `Use when...`,
- avoid vague “helps with” language.

## Runtime skill rules

- Keep runtime skills concise.
- Keep source rationale in documentation, not every `SKILL.md`.
- Do not invent tools or APIs.
- Say “if the harness provides...” for optional tools such as subagents, Taste, or code search.
- Make side effects explicit.
- End with clear output and next-skill routing.

## When to create something else

| Need | Add |
|---|---|
| detailed rationale | reference doc |
| deterministic validation/generation | script |
| new tool/provider/subagent/search | extension |
| install/default UX | wrapper CLI |

## Validation

Run:

```bash
node scripts/validate-skills.mjs
```

Fix errors before publishing. Warnings should be reviewed but may be acceptable for intentionally complex skills.
