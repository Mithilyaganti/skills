# Final Skill Quality Bar

Use this checklist before publishing any Vector Cadence skill.

## Required

- [ ] One lifecycle responsibility.
- [ ] Frontmatter has `name` and `description`.
- [ ] `name` matches directory.
- [ ] Description is under 1024 characters.
- [ ] Description includes concrete `Use when` triggers.
- [ ] Skill has Purpose, When to use, When to skip, Workflow, Output, and Guardrails.
- [ ] Side effects are explicit.
- [ ] Optional tools are phrased as “if the harness provides...”.
- [ ] No invented tools, commands, paths, or APIs.
- [ ] Runtime skill does not contain upstream source-rationale sections.
- [ ] Links resolve.
- [ ] Next-skill routing is clear.

## Preferred

- [ ] Normal skills stay under 150 lines where practical.
- [ ] Complex orchestration skills stay under 170 lines where practical.
- [ ] Examples are minimal and behavior-shaping.
- [ ] Long rationale lives in references or documentation.
- [ ] Deterministic checks live in scripts.

## Do not publish if

- The skill duplicates an existing skill without a clear boundary.
- The behavior really requires an extension but is described as markdown-only.
- It encourages autonomous work without stop conditions.
- It writes to project files without stating when and why.
