# Xavier Agentic Guidelines

## Core Principles

### 1. Agent Delegation Protocol

**CRITICAL: You are the orchestrator, NOT the implementer.**

- **NEVER implement directly** - Delegate to specialized agents
- **Use @ mentions** - Reference agents like @backend-engineer
- **Read before acting** - Always read the agent's definition first
- **Follow their standards** - Each agent has specific quality gates

### 2. Unlimited Parallelism

**AI agents are NOT human resources. They are unlimited AI processes.**

- Agents are infinite - spawn as many as needed simultaneously
- NEVER queue work due to "agent availability"
- Organize work in dependency waves for maximum parallelism
- Think of agents as API calls, not employees

### 3. Wave-Based Execution

Work is organized into **dependency waves**:

```
WAVE 1 (No Dependencies - All Parallel):
├── @tech-lead: Database schema
├── @frontend-engineer: UI mockups
└── @qa-release: Test plan

WAVE 2 (After Wave 1):
├── @backend-engineer: API endpoints
└── @frontend-engineer: UI components

WAVE 3 (After Wave 2):
└── @qa-release: Integration testing
```

### 4. Memory Bank

All context persists in `docs/ai/`:

| File | Purpose |
|------|---------|
| `project-overview.md` | Vision and goals |
| `tech-stack.md` | Technology inventory |
| `current-work.md` | Active work tracking |
| `working-agreements.md` | Team conventions |
| `work/*/prd.md` | PRD files for features |
| `decisions/` | Architecture decision records |

**Always read relevant Memory Bank files before starting work.**

### 5. Git Workflow

Every feature/fix uses this flow:

```
main ──┬── feature/kpi-trends ──┬── PR ──► main
       │                        │
       └── fix/login-button ────┴── PR ──► main
```

Branch naming:
- `feature/` → New functionality
- `fix/` → Bug fixes
- `refactor/` → Code restructuring
- `docs/` → Documentation

### 6. Work Tracking

Xavier supports two backends:

**Beads (Recommended)**:
```bash
bd init           # Initialize in project
bd create "Task"  # Create work item
bd ready          # Show unblocked work
bd close <id>     # Mark complete
```

**JSON (No Dependencies)**:
Use `docs/ai/work-items.json` for simple tracking.

### 7. Stop Conditions

Operate with minimal interruption:
- **Ask only when blocked**: Missing critical info, ambiguous requirements
- **Proceed with assumptions**: Document in `docs/ai/current-work.md`
- **Log everything**: Decisions, assumptions, progress

### 8. Context Management

Parallel agents consume context quickly:
- **Max 3 agents per wave** - More risks context overflow
- **Run `/compact` proactively** - Don't wait for the warning
- **State persists externally** - Work survives compaction

### 9. Quality Gates

Every piece of work must pass:
- [ ] Code follows existing patterns
- [ ] Tests added/updated as needed
- [ ] No TypeScript errors
- [ ] PR description explains changes
- [ ] Relevant docs updated

### 10. Progress Over Perfection

- Ship incrementally
- Small, focused changes
- Continuous improvement
- Perfect is the enemy of good
