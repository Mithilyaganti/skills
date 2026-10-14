# Vector Cadence Skills

This repo contains the Vector Cadence (`vc-*`) agent skill suite, its installer CLI, documentation, and validation scripts.

## Installed skill locations

Skills are available in these locations:

- **`~/.claude/skills/`** — global Claude Code skills (default install: `npx vector-cadence-skills --claude`)
- **`.claude/skills/`** — project-local Claude Code skills (`--claude-local`)
- **`~/.grok/skills/`** — global Grok Build skills (default install: `npx vector-cadence-skills --grok`)
- **`.grok/skills/`** — project-local Grok Build skills (`--grok-local`)
- **`~/.zcode/skills/`** — global ZCode skills (default install: `npx vector-cadence-skills --zcode`)
- **`.zcode/skills/`** — project-local ZCode skills (`--zcode-local`)
- **`~/.opencode/skills/`** — for use with opencode
- **`$DSH_HOME/skills/`** (`~/.dsh/skills/`) — global DeepSeek Harness skills, shared by DSH Desktop, Terminal, TUI, and headless profiles (`npx vector-cadence-skills --dsh`)
- **`.dsh/skills/`** — project-local DeepSeek Harness skills (`--dsh-local`)
- **`~/.agents/skills/`** — shared cross-agent root that DeepSeek Harness also scans (`--agents`)
- **`.agents/skills/`** — project-local shared agent root (`--agents-local`)

## Using these skills in DeepSeek Harness

Type `/vc-align`, `/vc-plan`, `/vc-execute`, and so on to invoke a skill explicitly. DeepSeek Harness also exposes every `vc-*` skill in the model-facing catalog, so the agent loads one on its own when a task matches its description.

Load a skill with the skill tool when a task matches its description.
