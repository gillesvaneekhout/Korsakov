# Xavier Architecture

> Detailed technical documentation. For quick start, see [README.md](README.md).

---

## System Overview

Xavier is a multi-agent orchestration framework that provides:

- **Specialized AI Agents**: Domain experts for different aspects of development
- **Reusable Skills**: Common patterns and protocols encoded once, used everywhere
- **Wave-Based Execution**: Parallel agent dispatch for maximum efficiency
- **Work Tracking**: Beads CLI or simple JSON for tracking work items

---

## Agent Architecture

### Agent Layers

```
┌─────────────────────────────────────────────────────────┐
│                    STRATEGY LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │  @product   │ │  @tech-lead │ │ @work-          │   │
│  │  -partner   │ │             │ │  orchestrator   │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                   ENGINEERING LAYER                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │  @frontend  │ │  @backend   │ │ @data-analytics │   │
│  │  -engineer  │ │  -engineer  │ │ -engineer       │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                     QUALITY LAYER                       │
│               ┌─────────────────────┐                   │
│               │    @qa-release      │                   │
│               └─────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### Agent Definitions

| Agent | Purpose | Skills |
|-------|---------|--------|
| `@product-partner` | PRD creation, requirements, user stories | intake-and-clarify, prd-to-spec |
| `@tech-lead` | Architecture, technical decisions | plan-and-slice, code-change-protocol |
| `@work-orchestrator` | Multi-agent coordination, wave dispatch | work-tracking, wave-execution |
| `@backend-engineer` | APIs, database, business logic | code-change-protocol, testing-protocol |
| `@frontend-engineer` | UI/UX, React components | code-change-protocol, testing-protocol |
| `@data-analytics-engineer` | Data pipelines, analytics | code-change-protocol, observability |
| `@qa-release` | Testing, QA, release management | testing-protocol, pr-description-protocol |

### Agent File Structure

Each agent is defined in `.claude/agents/[name].md`:

```markdown
---
name: agent-name
description: What this agent does
skills:
  - skill-1
  - skill-2
---

# Agent Name

## Role
[Description of the agent's role]

## Responsibilities
- Responsibility 1
- Responsibility 2

## When to Engage
- Trigger condition 1
- Trigger condition 2
```

---

## Skills Architecture

### Skill Categories

| Category | Skills | Purpose |
|----------|--------|---------|
| **Core** | intake-and-clarify, plan-and-slice, code-change-protocol | Requirements and coding |
| **Quality** | testing-protocol, pr-description-protocol | Testing and releases |
| **Operations** | observability-and-tracking, prd-to-spec | Monitoring and specs |
| **Orchestration** | work-tracking, wave-execution, git-workflow | Coordination |

### Skill File Structure

Each skill lives in `.claude/skills/[name]/SKILL.md`:

```markdown
---
name: skill-name
description: What this skill does
triggers:
  - "trigger phrase 1"
  - "trigger phrase 2"
---

# Skill Name

## Purpose
[What this skill accomplishes]

## When to Use
[Conditions that activate this skill]

## Steps
1. Step 1
2. Step 2
3. Step 3
```

---

## Command Architecture

### Available Commands

| Command | File | Purpose |
|---------|------|---------|
| `/start` | start.md | Universal entry point |
| `/plan-execution` | plan-execution.md | Create work breakdown |
| `/execute-work` | execute-work.md | Parallel wave execution |
| `/process-prds` | process-prds.md | Auto-process PRD files |

### Command Flow

```
/start [description]
    │
    ├── Creates feature branch
    ├── Clarifies requirements
    └── Routes to @product-partner or @tech-lead
            │
            ▼
/plan-execution
    │
    ├── @tech-lead reviews PRD
    ├── Creates work items in Beads/JSON
    └── Sets up dependencies
            │
            ▼
/execute-work
    │
    ├── @work-orchestrator queries ready items
    ├── Dispatches agents in parallel waves
    ├── Monitors completion
    └── Creates Pull Request
```

---

## Wave Execution Engine

### Core Concept

Wave execution groups work by dependencies, running all independent items in parallel:

```
EPIC: Feature Implementation
│
├── WAVE 1 (No Dependencies)
│   ├── Task A (schema)      ─┐
│   ├── Task B (ui mockups)  ─┼── ALL RUN IN PARALLEL
│   └── Task C (test plan)   ─┘
│
├── WAVE 2 (Depends on Wave 1)
│   ├── Task D (api)         ─┐
│   └── Task E (components)  ─┴── BOTH RUN IN PARALLEL
│
└── WAVE 3 (Depends on Wave 2)
    └── Task F (integration)
```

### Wave Calculation Algorithm

```
1. Get all work items with status 'open'
2. For each item, check if all blocked_by items are 'closed'
3. Items with no blockers OR all blockers closed = READY
4. Group ready items into current wave
5. Execute wave (all items in parallel)
6. When wave completes, recalculate for next wave
7. Repeat until no items remain
```

### Parallelism Principle

**Agents are unlimited.** They are AI processes, not humans. You can dispatch 10 agents as easily as 1.

---

## Work Tracking System

### Beads Integration

Xavier integrates with [Beads](https://github.com/steveyegge/beads) for work tracking:

```bash
bd init                          # Initialize in project
bd create "Epic" --type epic     # Create epic
bd create "Task" --parent bd-1   # Create task
bd dep add bd-1.2 bd-1.1         # Add dependency
bd ready                         # Query ready work
bd close bd-1.1 --reason "Done"  # Complete item
```

### JSON Fallback

If Beads isn't available, Xavier uses `docs/ai/work-items.json`:

```json
{
  "version": "1.0",
  "items": [
    {
      "id": "WI-001",
      "title": "Task title",
      "type": "task",
      "status": "open",
      "parent": "EPIC-001",
      "assigned_agent": "backend-engineer",
      "blocked_by": [],
      "blocks": ["WI-002"]
    }
  ]
}
```

---

## Project Memory

### Memory Structure

```
docs/ai/
├── project-overview.md    # Vision, goals, context
├── tech-stack.md          # Technologies used
├── working-agreements.md  # Team conventions
├── current-work.md        # Active work tracking
├── work/                  # PRD files
│   └── */prd.md
├── work-items.json        # Work tracking (if not Beads)
└── decisions/             # Architecture Decision Records
    └── ADR-001.md
```

### Memory Usage

Agents read relevant memory files before starting work:
- `@product-partner` reads project-overview.md
- `@tech-lead` reads tech-stack.md and decisions/
- `@backend-engineer` reads tech-stack.md
- All agents update current-work.md

---

## Git Workflow

### Branch Strategy

```
main
├── feature/kpi-trends      ← New feature
├── fix/login-button        ← Bug fix
├── refactor/auth-middleware ← Refactoring
└── docs/api-documentation   ← Documentation
```

### Automated Flow

1. `/start` creates the feature branch
2. All work happens on that branch
3. `/execute-work` creates commits
4. At completion, creates Pull Request
5. After merge, branch is deleted

---

## Context Management

### Problem

Running many parallel agents consumes context quickly.

### Solutions

| Setting | Value | Purpose |
|---------|-------|---------|
| `autoCompact` | `true` | Auto-summarize when needed |
| `compactThreshold` | `60` | Trigger at 60% context |

### Wave Size Guidelines

| Context Status | Max Parallel Agents |
|----------------|---------------------|
| Fresh session  | 4-5 agents          |
| 50% used       | 2-3 agents          |
| 75% used       | Run /compact first  |

### Recovery After Compact

```bash
bd ready                    # Check what's unblocked
bd list                     # All items with status
cat docs/ai/current-work.md # Progress log
/execute-work               # Continue
```

---

## File Structure

```
xavier/
├── .claude/
│   ├── CLAUDE.md              # Main config (commands registered)
│   ├── settings.local.json    # Permissions
│   ├── agents/                # 7 agents
│   │   ├── product-partner.md
│   │   ├── tech-lead.md
│   │   ├── work-orchestrator.md
│   │   ├── backend-engineer.md
│   │   ├── frontend-engineer.md
│   │   ├── data-analytics-engineer.md
│   │   └── qa-release.md
│   ├── skills/                # 10 skills
│   │   ├── intake-and-clarify/
│   │   ├── plan-and-slice/
│   │   ├── code-change-protocol/
│   │   ├── testing-protocol/
│   │   ├── pr-description-protocol/
│   │   ├── observability-and-tracking/
│   │   ├── prd-to-spec/
│   │   ├── work-tracking/
│   │   ├── wave-execution/
│   │   └── git-workflow/
│   └── commands/              # 4 commands
│       ├── start.md
│       ├── plan-execution.md
│       ├── execute-work.md
│       └── process-prds.md
├── templates/
│   └── prd.md
├── docs/ai/                   # Project memory
├── README.md
└── ARCHITECTURE.md            # This file
```

---

## Extending Xavier

### Adding a New Agent

1. Create `.claude/agents/[name].md`
2. Define role, responsibilities, skills
3. Update CLAUDE.md agent list

### Adding a New Skill

1. Create `.claude/skills/[name]/SKILL.md`
2. Define purpose, triggers, steps
3. Assign to relevant agents

### Adding a New Command

1. Create `.claude/commands/[name].md`
2. Define usage, workflow, examples
3. Update CLAUDE.md Available Commands section

---

## Design Principles

1. **Unlimited Parallelism** - Agents are AI processes with no capacity limits
2. **Wave Execution** - Group by dependencies, run independent work in parallel
3. **Dependency-Driven** - Only sequence when true blockers exist
4. **Memory Persistence** - All context survives in docs/ai/
5. **PRD-Driven** - Features start with requirements documents
6. **Branch Per Feature** - Every feature = branch → PR
7. **Progress Over Perfection** - Ship incrementally
