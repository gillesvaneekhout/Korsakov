# Xavier AI Framework

> **Note**: The main Claude Code configuration is in `.claude/CLAUDE.md`

Xavier is a lightweight, centralized AI agent framework designed specifically for Claude Code. It provides intelligent agent delegation, skill orchestration, wave-based parallel execution, and project memory.

## Quick Start

```bash
# Open your project with Xavier in the workspace
cd /Users/rui.costa/ai-indie
claude .

# Or symlink Xavier to your project
cd your-project
ln -s /path/to/xavier/.claude .claude
```

## Available Commands

- `/start [description]` - Universal entry point. Creates a branch and routes to the right workflow.
- `/plan-execution` - Creates work items with dependencies from a PRD.
- `/execute-work` - Executes work in parallel waves, creates PR when complete.
- `/process-prds` - Scans for PRD files and auto-processes all ready ones.

## Default Workflow

```
/start → Create Branch → /plan-execution → /execute-work → Create PR → Review → Merge
```

**IMPORTANT**: Every feature starts on a new branch and ends with a Pull Request.

---

## Wave-Based Execution

Xavier uses **wave-based parallel execution** for maximum efficiency:

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

**Key Principle**: Agents have UNLIMITED parallelism. Dispatch all independent work simultaneously.

---

## Work Tracking

Xavier supports two work tracking backends:

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

## Available Agents

Use `@agent-name` to engage specific agents:

### Strategy Agents
- `@product-partner` - Product requirement analysis and user story creation
- `@tech-lead` - Architecture decisions and technical guidance
- `@work-orchestrator` - Multi-agent coordination and wave execution

### Engineering Agents
- `@backend-engineer` - API development and backend implementation
- `@frontend-engineer` - UI/UX implementation with Next.js/React
- `@data-analytics-engineer` - Data pipelines and analytics implementation

### Quality Agents
- `@qa-release` - Testing, quality assurance, and release management

See `.claude/agents/` for detailed agent capabilities.

---

## Available Skills

Skills activate automatically based on context:

### Core Skills
1. `intake-and-clarify` - Understand requirements and gather context
2. `plan-and-slice` - Break work into manageable pieces
3. `code-change-protocol` - Follow Indie Campers coding standards
4. `testing-protocol` - Ensure quality with appropriate tests
5. `pr-description-protocol` - Create comprehensive PR descriptions
6. `observability-and-tracking` - Add logging and monitoring
7. `prd-to-spec` - Convert product requirements to technical specs

### Orchestration Skills
8. `work-tracking` - Manage work items with Beads or JSON
9. `wave-execution` - Execute work in parallel waves
10. `git-workflow` - Branch creation and PR management

See `.claude/skills/` for skill details.

---

## Git Workflow

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

## Project Memory

Key project documentation lives in `docs/ai/`:
- `project-overview.md` - Vision and goals
- `tech-stack.md` - Technology inventory
- `working-agreements.md` - Team conventions
- `current-work.md` - Active work tracking
- `work-items.json` - Work items (if not using Beads)
- `decisions/` - Architecture decision records

---

## Example Workflows

### New Feature (Full Orchestration)
```
/start I need to add a reports page with KPI trends

→ @product-partner creates PRD
→ /plan-execution breaks into work items
→ /execute-work dispatches waves:
  - Wave 1: Schema + UI design + Test plan (parallel)
  - Wave 2: API + Components (parallel)
  - Wave 3: Integration + E2E tests
→ @qa-release validates
→ @product-partner approves
```

### Quick Fix
```
/start Fix the login button not working on mobile

→ Routes directly to @frontend-engineer
→ Single work item, no orchestration needed
```

### Technical Improvement
```
/start Optimize the KPI dashboard queries

→ @tech-lead assesses impact
→ @backend-engineer implements
→ @qa-release validates performance
```

---

## Stop Conditions

The framework operates with minimal interruption:
- **Ask only when blocked**: Missing critical information, ambiguous requirements, or conflicting constraints
- **Proceed with assumptions**: Document assumptions in `docs/ai/current-work.md` and continue
- **Log everything**: All decisions, assumptions, and progress get tracked

---

## Key Principles

1. **Agents are specialists**: Each agent has deep expertise in their domain
2. **Skills are reusable**: Common patterns encoded once, used everywhere
3. **Memory persists**: All context tracked in `docs/ai/`
4. **Unlimited parallelism**: Dispatch all independent work simultaneously
5. **Wave execution**: Think in waves, not queues
6. **Progress over perfection**: Small, incremental changes with continuous improvement

---

## Current Work Tracking

Always maintain `docs/ai/current-work.md` with:
- Current goal and scope
- Wave execution status
- Milestones and progress
- Open questions and assumptions
- PR checklist

This is your single source of truth for work in progress.
