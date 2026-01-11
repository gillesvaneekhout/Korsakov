# Korsakov AI Framework - Claude Code Configuration

## Available Commands

- `/start` - Universal entry point for all work - creates a feature branch and routes to the right workflow based on user answers.
- `/plan-execution` - Creates work items with dependencies from a PRD, ready for wave execution.
- `/execute-work` - Executes work in parallel waves, dispatching to specialist agents and creating a PR when complete.
- `/process-prds` - Scans repo for PRD files, automatically creates branches and work items for each ready PRD.

See `.claude/commands/` for full command documentation.

---

## Available Agents

### Strategy Layer
@product-partner, @tech-lead, @work-orchestrator

### Engineering Layer
@backend-engineer, @frontend-engineer

### Quality Layer
@qa-release

See `.claude/agents/` for full agent definitions.

---

## Available Skills

### Core Skills
- `intake-and-clarify` - Understand requirements and gather context
- `plan-and-slice` - Break work into manageable pieces
- `code-change-protocol` - Follow coding standards
- `testing-protocol` - Ensure quality with appropriate tests
- `pr-description-protocol` - Create comprehensive PR descriptions
- `observability-and-tracking` - Add logging and monitoring
- `prd-to-spec` - Convert product requirements to technical specs

### Orchestration Skills
- `work-tracking` - Manage work items with Beads or JSON
- `wave-execution` - Execute work in parallel waves
- `git-workflow` - Branch creation and PR management

See `.claude/skills/` for skill details.

---

## Agent Delegation Protocol [MANDATORY]

**CRITICAL: You are the orchestrator, NOT the implementer.**

### 1. NEVER Implement Directly
- Do NOT write code yourself
- Do NOT perform technical implementations
- Do NOT do research tasks that agents should do

### 2. ALWAYS Delegate to Specialized Agents
Engage agents using @ mentions for their specialized work.

### 3. Your Role as Orchestrator
Your job is to:
- Understand user requests
- Engage appropriate agents using @ mentions
- Coordinate between agents
- Monitor progress using `bd list` or `docs/ai/work-items.json`
- Ensure quality gates are met

---

## Unlimited Parallelism Principle [MANDATORY]

**CRITICAL: AI agents are NOT human resources. They are unlimited AI processes.**

### Key Principles:
- Agents are infinite - spawn as many as needed simultaneously
- NEVER queue work due to "agent availability"
- Organize work in dependency waves for maximum parallelism
- Think of agents as API calls, not employees

Sequential execution: 5 agents × 2 min = 10 minutes
Parallel execution: 5 agents at once = 2 minutes

**Make parallel execution your default.**

---

## Git Workflow [MANDATORY]

**Every feature/fix uses this flow:**

```
main ──┬── feature/kpi-trends ──┬── PR ──► main
       │                        │
       └── fix/login-button ────┴── PR ──► main
```

### Branch Naming
- `feature/` → New functionality
- `fix/` → Bug fixes
- `refactor/` → Code restructuring
- `docs/` → Documentation

### Automatic Flow
1. `/start` creates the branch
2. All work happens on that branch
3. `/execute-work` ends with PR creation
4. After merge, branch is deleted

---

## Wave-Based Execution

Korsakov uses **wave-based parallel execution** for maximum efficiency:

```
WAVE 1 (No Dependencies - All Parallel):
├── @tech-lead: Database schema
├── @frontend-engineer: UI mockups
└── @qa-release: Test plan

WAVE 2 (After Wave 1 - All Parallel):
├── @backend-engineer: API endpoints
└── @frontend-engineer: UI components

WAVE 3 (After Wave 2):
└── @qa-release: Integration testing
```

---

## Work Tracking

Korsakov supports two work tracking backends:

### Option 1: Beads (Recommended)
```bash
# Install Beads CLI
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
export PATH="$PATH:$HOME/.local/bin"  # Add to ~/.zshrc

# Use in project
bd init
bd create "Feature name" --type epic
bd ready  # Show unblocked work
```

### Option 2: Local JSON (No Dependencies)
Use `docs/ai/work-items.json` for simple tracking without external tools.

---

## Project Memory

All agents rely on the Memory Bank for project context:
- `docs/ai/project-overview.md` - Vision and goals
- `docs/ai/tech-stack.md` - Technology inventory
- `docs/ai/working-agreements.md` - Team conventions
- `docs/ai/current-work.md` - Active work tracking
- `docs/ai/work-items.json` - Work items (if not using Beads)
- `docs/ai/work/*/prd.md` - PRD files for features
- `docs/ai/decisions/` - Architecture decision records

Always read relevant Memory Bank files before starting work.

---

## Stop Conditions

The framework operates with minimal interruption:
- **Ask only when blocked**: Missing critical information, ambiguous requirements, or conflicting constraints
- **Proceed with assumptions**: Document assumptions in `docs/ai/current-work.md` and continue
- **Log everything**: All decisions, assumptions, and progress get tracked

---

## Context Management [CRITICAL]

Parallel agents consume context quickly. To prevent "Conversation too long" errors:

### Rules
1. **Max 3 agents per wave** - More risks context overflow
2. **Run `/compact` proactively** - Don't wait for the warning
3. **State persists in Beads/JSON** - Work survives compaction
4. **If compaction fails** - Start fresh session, check `bd ready`

### Recovery After Session Reset
```bash
# Check current state
bd ready                    # What's unblocked
bd list                     # All items with status
cat docs/ai/current-work.md # Progress log

# Continue with /execute-work
```

---

## Key Principles

1. **Agents are specialists**: Each agent has deep expertise in their domain
2. **Skills are reusable**: Common patterns encoded once, used everywhere
3. **Memory persists**: All context tracked in `docs/ai/`
4. **Unlimited parallelism**: Dispatch all independent work simultaneously
5. **Wave execution**: Think in waves, not queues
6. **Progress over perfection**: Small, incremental changes with continuous improvement
7. **Context awareness**: Compact early, persist state externally
