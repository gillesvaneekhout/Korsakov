# Xavier

**Your AI Development Team, Orchestrated**

Xavier transforms AI assistants into a full AI development team with specialized agents working in parallel. Drop a PRD, run a command, get a Pull Request.

Works with **Claude Code**, **Cursor**, **Windsurf**, **Gemini CLI**, and **OpenCode**.

---

## What is Xavier?

Xavier is a **multi-agent orchestration framework** that turns AI assistants into a coordinated AI team:

```
                    ┌─────────────────┐
                    │   You (Human)   │
                    │   Drop a PRD    │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │         Xavier               │
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
   ┌───────────┐       ┌───────────┐       ┌───────────┐
   │ @frontend │       │ @backend  │       │ @data     │
   │ -engineer │       │ -engineer │       │ -engineer │
   └───────────┘       └───────────┘       └───────────┘
```

---

## Quick Start

### Option A: NPM Install (Recommended)

```bash
# In your project directory
npm install github:IndieCampers/xavier --save-dev
```

This automatically:
- Copies agent definitions to `ai-tools/`
- Creates Memory Bank structure in `docs/ai/`
- Generates configs for all supported AI tools

For interactive setup:
```bash
npm install github:IndieCampers/xavier --save-dev --foreground-scripts
```

Or configure later:
```bash
npm run xavier:configure
```

### Option B: Clone + Symlink (Manual Setup)

Use this approach if npm install has issues, you don't have npm access, or you want to contribute to Xavier development.

**Step 1: Clone Xavier to a central location**
```bash
# Clone to a shared location (e.g., ~/ai-tools or alongside your projects)
git clone https://github.com/IndieCampers/xavier.git ~/ai-tools/xavier
```

**Step 2: Create symlink in your project**
```bash
cd your-project

# Create symlink to Xavier's .claude directory
ln -s ~/ai-tools/xavier/.claude .claude
```

**Step 3: Copy Memory Bank template (optional but recommended)**
```bash
# Copy the docs/ai structure for project context
cp -r ~/ai-tools/xavier/templates/docs-ai docs/ai
```

Your project structure will look like:
```
your-project/
├── .claude -> ~/ai-tools/xavier/.claude  (symlink)
├── docs/ai/                               (your project's memory)
│   ├── project-overview.md
│   ├── tech-stack.md
│   └── ...
└── ... your code
```

**Benefits of symlink approach:**
- All projects share the same Xavier version
- Updates to Xavier are immediately available everywhere
- Easy to contribute improvements back to Xavier
- No node_modules overhead

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

## Why Xavier?

| Without Xavier | With Xavier |
|----------------|-------------|
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

Xavier (fast):
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
| `@data-analytics-engineer` | Pipelines, analytics, reports |

### Data Engineering Layer
| Agent | Role |
|-------|------|
| `@data-pipeline-engineer` | ETL, data pipelines, Glue jobs |
| `@analytics-engineer` | dbt, data modeling, transformations |
| `@data-platform-engineer` | AWS, infrastructure, data platform |

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
│   ├── agents/                  # 10 specialized agents
│   ├── commands/                # Slash command definitions
│   ├── skills/                  # 13 reusable skills
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

Xavier supports two work tracking backends:

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
npm run xavier:generate
```

### Reconfigure Installation

```bash
npm run xavier:configure
```

### Agent Presets

| Preset | Agents | Best For |
|--------|--------|----------|
| `all` | 10 | Full team |
| `fullstack` | 6 | Web apps |
| `data` | 7 | Data engineering |
| `core` | 3 | Strategy only |

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
| Commands not working | Run `npm run xavier:generate` |
| Beads not found | Add `$HOME/.local/bin` to PATH |
| Context overflow | Run `/compact` or restart session |
| Agents not responding | Check agent exists in `ai-tools/agents/` |

---

## Contributing

We welcome contributions! Xavier improves when everyone shares their enhancements.

### How to Contribute Changes

**If using the symlink approach (recommended for contributors):**

```bash
# 1. Navigate to your Xavier clone
cd ~/ai-tools/xavier  # or wherever you cloned it

# 2. Create a feature branch
git checkout -b feature/my-improvement

# 3. Make your changes to agents, skills, or commands
#    - Agents: .claude/agents/
#    - Skills: .claude/skills/
#    - Commands: .claude/commands/

# 4. Test in your project (symlink means changes are immediate)
cd ~/your-project
claude .
# Test your changes...

# 5. Commit and push
cd ~/ai-tools/xavier
git add .
git commit -m "Add: description of your improvement"
git push origin feature/my-improvement

# 6. Create a Pull Request on GitHub
gh pr create --title "Add: description" --body "What this improves..."
```

**If using npm install:**

Changes to `ai-tools/` in your project are local. To contribute back:

```bash
# 1. Clone Xavier separately
git clone https://github.com/IndieCampers/xavier.git ~/xavier-contrib

# 2. Copy your improvements
cp your-project/ai-tools/agents/my-agent.md ~/xavier-contrib/.claude/agents/

# 3. Create PR from there
cd ~/xavier-contrib
git checkout -b feature/my-improvement
git add . && git commit -m "Add: my-agent"
git push origin feature/my-improvement
gh pr create
```

### What to Contribute

| Type | Location | Description |
|------|----------|-------------|
| **Agents** | `.claude/agents/` | New specialist roles |
| **Skills** | `.claude/skills/` | Reusable patterns |
| **Commands** | `.claude/commands/` | Slash commands |
| **Bug fixes** | Anywhere | Fix issues you encounter |
| **Docs** | `README.md`, etc. | Improve documentation |

### Add a New Agent

```bash
# Create agent file
touch .claude/agents/my-agent.md

# Use this template:
cat << 'EOF' > .claude/agents/my-agent.md
---
name: my-agent
description: What this agent specializes in
model: inherit
skills:
  - code-change-protocol
  - testing-protocol
---

# My Agent

You are a specialist in [domain].

## Responsibilities
- Responsibility 1
- Responsibility 2

## Definition of Done
- [ ] Checklist item 1
- [ ] Checklist item 2
EOF
```

### Add a New Skill

```bash
# Create skill folder and file
mkdir -p .claude/skills/my-skill
touch .claude/skills/my-skill/SKILL.md

# Define triggers, purpose, steps (see existing skills for examples)
```

### Add a New Command

```bash
# Create command file
touch .claude/commands/my-command.md

# Define usage, workflow, examples (see existing commands)
```

### Contribution Guidelines

1. **Test before submitting** - Ensure your changes work in a real project
2. **Follow existing patterns** - Look at similar agents/skills for structure
3. **Keep it focused** - One improvement per PR
4. **Document clearly** - Others should understand how to use your addition
5. **No secrets** - Never commit API keys, tokens, or credentials

For technical architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Acknowledgments

- **Beads** - Work tracking by [Steve Yegge](https://github.com/steveyegge/beads)
- **Amplify** - Inspiration for multi-vendor support

Built by the Indie Campers team.

---

## License

MIT

---

**Give it a try**

```bash
# Option A: NPM
cd your-project
npm install github:IndieCampers/xavier --save-dev
claude .
/start "Let's build something amazing"

# Option B: Symlink
git clone https://github.com/IndieCampers/xavier.git ~/ai-tools/xavier
cd your-project
ln -s ~/ai-tools/xavier/.claude .claude
claude .
/start "Let's build something amazing"
```
