# Xavier AI Tools

This directory contains the canonical definitions for Xavier's AI team framework.

## Structure

```
ai-tools/
├── agents/          # Agent definitions (10 specialists)
├── commands/        # Slash command definitions
├── skills/          # Reusable skill patterns
├── config.json      # Installation configuration
└── README.md        # This file
```

## Agents

| Agent | Role | Layer |
|-------|------|-------|
| @product-partner | Requirements, PRDs, user stories | Strategy |
| @tech-lead | Architecture, technical decisions | Strategy |
| @work-orchestrator | Coordinates agents, manages waves | Strategy |
| @frontend-engineer | React, Next.js, UI/UX | Engineering |
| @backend-engineer | APIs, databases, business logic | Engineering |
| @data-analytics-engineer | Analytics, dashboards, reports | Data |
| @data-pipeline-engineer | ETL, data pipelines, Glue jobs | Data |
| @analytics-engineer | dbt, data modeling, transformations | Data |
| @data-platform-engineer | AWS, infrastructure, data platform | Data |
| @qa-release | Testing, QA, releases | Quality |

## Commands

| Command | Purpose |
|---------|---------|
| `/start` | Universal entry point - creates branch, routes to workflow |
| `/plan-execution` | Creates work items from PRD with dependencies |
| `/execute-work` | Executes work in parallel waves, creates PR |
| `/process-prds` | Auto-process all PRDs with status: ready |

## Skills

Skills are reusable patterns that agents invoke:

| Skill | Purpose |
|-------|---------|
| `intake-and-clarify` | Gather requirements and context |
| `plan-and-slice` | Break work into manageable pieces |
| `code-change-protocol` | Follow coding standards |
| `testing-protocol` | Ensure quality with tests |
| `pr-description-protocol` | Create PR descriptions |
| `work-tracking` | Manage work items |
| `wave-execution` | Execute work in parallel waves |
| `git-workflow` | Branch creation and PR management |
| `medallion-architecture` | Data lake architecture patterns |
| `glue-job-development` | AWS Glue job development |
| `builder-framework` | Builder pattern for data processing |

## Usage

These files are the **source of truth** for Xavier. Vendor-specific configurations (`.claude/`, `.cursorrules`, `.windsurf/`, `.gemini/`) are generated from these definitions.

### Regenerate Vendor Configs

```bash
npm run xavier:generate
```

### Reconfigure Installation

```bash
npm run xavier:configure
```

## Customization

You can customize Xavier by:

1. **Adding agents**: Create new `.md` files in `agents/`
2. **Adding skills**: Create new directories in `skills/` with `SKILL.md`
3. **Adding commands**: Create new `.md` files in `commands/`

After customization, run `npm run xavier:generate` to update vendor configs.
