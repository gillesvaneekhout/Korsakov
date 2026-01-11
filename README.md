# Korsakov

**Your AI Development Team, Orchestrated**

Korsakov transforms AI assistants into a full AI development team with specialized agents working in parallel. Drop a PRD, run a command, get a Pull Request.

Works with **Claude Code**, **Cursor**, **Windsurf**, **Gemini CLI**, and **OpenCode**.

---

## What is Korsakov?

Korsakov is a **multi-agent orchestration framework** that turns AI assistants into a coordinated AI team:

```
                    ┌─────────────────┐
                    │   You (Human)   │
                    │   Drop a PRD    │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │        Korsakov              │
              │   Orchestrates everything    │
              └──────────────┬───────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   ┌───────────┐       ┌───────────┐       ┌───────────┐
   │ @product  │       │ @tech-lead│       │ @qa-release│
   │ -partner  │       │           │       │            │
   └───────────┘       └───────────┘       └────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
   ┌───────────┐       ┌───────────┐
   │ @frontend │       │ @backend  │
   │ -engineer │       │ -engineer │
   └───────────┘       └───────────┘
```

---

## Quick Start

### Option A: NPM Install (Recommended)

```bash
# In your project directory
npm install github:gillesvaneekhout/Korsakov --save-dev
```

This automatically:
- Copies agent definitions to `ai-tools/`
- Creates Memory Bank structure in `docs/ai/`
- Generates configs for all supported AI tools

For interactive setup:
```bash
npm install github:gillesvaneekhout/Korsakov --save-dev --foreground-scripts
```

Or configure later:
```bash
npm run korsakov:configure
```

### Option B: Clone + Symlink (Manual Setup)

**Step 1: Clone Korsakov to a central location**
```bash
git clone https://github.com/gillesvaneekhout/Korsakov.git ~/ai-tools/korsakov
```

**Step 2: Create symlink in your project**
```bash
cd your-project
ln -s ~/ai-tools/korsakov/.claude .claude
```

**Step 3: Copy Memory Bank template (optional but recommended)**
```bash
cp -r ~/ai-tools/korsakov/templates/docs-ai docs/ai
```

Your project structure will look like:
```
your-project/
├── .claude -> ~/ai-tools/korsakov/.claude  (symlink)
├── docs/ai/                               (your project's memory)
│   ├── project-overview.md
│   ├── tech-stack.md
│   └── ...
└── ... your code
```

### Start Building

**Claude Code:**
```bash
claude .
/start "Add user authentication"
```

**Cursor:**
Open project in Cursor - `.cursorrules` loaded automatically.

**Windsurf:**
Open project in Windsurf - `.windsurf/rules.md` loaded automatically.

**Gemini CLI:**
```bash
gemini -p "Read .gemini/GEMINI.md and help me build"
```

**OpenCode:**
```bash
opencode
# Agents and commands in .opencode/ loaded automatically
```

---

## Supported AI Tools

| Tool | Output | Features |
|------|--------|----------|
| Claude Code | `.claude/` | Native slash commands, symlinks to ai-tools/ |
| Cursor | `.cursorrules` | Single rules file with ai-tools/ references |
| Windsurf | `.windsurf/` | Rules directory with ai-tools/ references |
| Gemini CLI | `.gemini/` | GEMINI.md + settings.json |
| OpenCode | `.opencode/` | Native agents + commands, AGENTS.md |

---

## Why Korsakov?

| Without Korsakov | With Korsakov |
|------------------|---------------|
| One task at a time | **Parallel execution** - 5x faster |
| Manual coordination | **Automatic orchestration** |
| Context lost between sessions | **Persistent memory** in `docs/ai/` |
| Ad-hoc prompting | **Specialized agents** with skills |
| Manual PR creation | **Automated branch → PR workflow** |

---

## The Magic: Wave-Based Execution

Traditional (slow):
```
Schema → API → UI → Tests → Review
        5 sequential steps = 5 units of time
```

Korsakov (fast):
```
WAVE 1 [parallel]     WAVE 2 [parallel]     WAVE 3
┌─────────────┐       ┌─────────────┐       ┌─────────┐
│ • Schema    │       │ • API       │       │ • E2E   │
│ • UI Design │  ──▶  │ • Components│  ──▶  │   Tests │
│ • Test Plan │       │             │       │         │
└─────────────┘       └─────────────┘       └─────────┘
     3 items               2 items            1 item
     in parallel           in parallel

Total: 3 waves = 3 units of time (40% faster!)
```

---

## Commands

| Command | What it does |
|---------|--------------|
| `/start [description]` | Start anything - creates branch, routes to right workflow |
| `/plan-execution` | Break PRD into work items with dependencies |
| `/execute-work` | Run work in parallel waves, create PR |
| `/process-prds` | Auto-process all PRDs with `status: ready` |

### Typical Flow

```
/start "Add user authentication"
    │
    ▼ Creates branch, @product-partner writes PRD

/plan-execution
    │
    ▼ @tech-lead creates work items

/execute-work
    │
    ▼ Agents work in parallel waves
    │
    ▼ Creates Pull Request
```

---

## Your AI Team

### Strategy Layer
| Agent | Role |
|-------|------|
| `@product-partner` | Requirements, PRDs, user stories |
| `@tech-lead` | Architecture, technical decisions |
| `@work-orchestrator` | Coordinates agents, manages waves |

### Engineering Layer
| Agent | Role |
|-------|------|
| `@frontend-engineer` | React, Next.js, UI/UX |
| `@backend-engineer` | APIs, databases, business logic |

### Quality Layer
| Agent | Role |
|-------|------|
| `@qa-release` | Testing, QA, releases |

---

## Project Structure

After installation:

```
your-project/
├── ai-tools/                    # Canonical agent definitions
│   ├── agents/                  # 6 specialized agents
│   ├── commands/                # Slash command definitions
│   ├── skills/                  # 10 reusable skills
│   ├── config.json              # Installation config
│   └── README.md                # Quick reference
├── docs/ai/                     # Memory Bank (project context)
│   ├── project-overview.md      # Vision, goals
│   ├── tech-stack.md            # Technologies
│   ├── current-work.md          # Active work
│   ├── working-agreements.md    # Team conventions
│   ├── work/                    # PRDs go here
│   └── decisions/               # Architecture decisions
├── .claude/                     # Claude Code config (symlinks)
├── .cursorrules                 # Cursor rules
├── .windsurf/                   # Windsurf config
├── .gemini/                     # Gemini CLI config
├── .opencode/                   # OpenCode agents & commands
└── opencode.json                # OpenCode configuration
```

---

## PRD-Driven Development

### Create PRDs here:
```
your-project/
└── docs/ai/work/
    ├── feature-a/
    │   └── prd.md    ← status: ready
    ├── feature-b/
    │   └── prd.md    ← status: ready
    └── feature-c/
        └── prd.md    ← status: draft (ignored)
```

### PRD Template

```markdown
---
title: Feature Name
status: ready          # ready | draft | in-progress | completed
priority: P2
owner: "@product-partner"
---

# Feature Name

## Problem Statement
[What problem are we solving?]

## Requirements

### MUST Have
- [ ] Requirement 1
- [ ] Requirement 2

### SHOULD Have
- [ ] Requirement 3

## Acceptance Criteria
- [ ] Given X, when Y, then Z
```

---

## Work Tracking

Korsakov supports two work tracking backends:

### Option 1: Beads (Recommended)

```bash
# Install
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.zshrc

# Initialize in project
bd init

# Commands
bd ready           # What's unblocked?
bd list            # All items
bd close bd-1.1    # Mark done
```

### Option 2: JSON (No install needed)

Work items stored in `docs/ai/work-items.json`.

---

## Configuration

### Regenerate Vendor Configs

After modifying agents, skills, or commands:

```bash
npm run korsakov:generate
```

### Reconfigure Installation

```bash
npm run korsakov:configure
```

---

## Key Principles

1. **Unlimited Parallelism** - AI agents have no capacity limits
2. **Wave Execution** - Think in dependency waves, not queues
3. **PRD-Driven** - Drop a doc, get a feature
4. **Branch Per Feature** - Every feature = new branch → PR
5. **Memory Persists** - Context survives in `docs/ai/`
6. **Progress Over Perfection** - Ship incrementally

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Commands not working | Run `npm run korsakov:generate` |
| Beads not found | Add `$HOME/.local/bin` to PATH |
| Context overflow | Run `/compact` or restart session |
| Agents not responding | Check agent exists in `ai-tools/agents/` |

---

## Acknowledgments

- **Beads** - Work tracking by [Steve Yegge](https://github.com/steveyegge/beads)
- Based on [Xavier](https://github.com/IndieCampers/xavier) by Indie Campers

---

## License

MIT

---

**Give it a try**

```bash
# Option A: NPM
cd your-project
npm install github:gillesvaneekhout/Korsakov --save-dev
claude .
/start "Let's build something amazing"

# Option B: Symlink
git clone https://github.com/gillesvaneekhout/Korsakov.git ~/ai-tools/korsakov
cd your-project
ln -s ~/ai-tools/korsakov/.claude .claude
claude .
/start "Let's build something amazing"
```
