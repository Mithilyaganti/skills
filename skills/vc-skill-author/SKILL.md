---
name: vc-skill-author
description: Create or improve Vc-compatible skills with strong triggers, concise runtime instructions, progressive disclosure, safe tool assumptions, and clear integration level. Use when adding new skills, refactoring skill docs, packaging reusable workflows, or deciding whether behavior belongs in a skill, script, extension, or wrapper.
---

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
