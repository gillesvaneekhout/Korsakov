# Setting Up Beads for Xavier

Beads is a git-synced work tracking system that enables wave-based parallel execution. This guide shows how to set it up for any Indie Campers project.

## Quick Setup

### 1. Install Beads CLI

**Option A: Install Script (Recommended)**
```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

Then add to your PATH (add to `~/.zshrc` or `~/.bashrc`):
```bash
export PATH="$PATH:$HOME/.local/bin"
```

Reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

**Option B: Go Install (if you have Go)**
```bash
go install github.com/steveyegge/beads/cmd/bd@latest
```

**Option C: Download Binary Directly**
Download from: https://github.com/steveyegge/beads/releases

### 2. Initialize in Your Project

```bash
cd /path/to/your/project  # e.g., indiecampers.io-myindiepulse
bd init
```

This creates:
```
.beads/
├── beads.jsonl    # Git-tracked work items (source of truth)
└── beads.db       # SQLite cache (gitignored automatically)
```

### 3. Add to .gitignore

Beads does this automatically, but verify:
```
# .gitignore
.beads/beads.db
```

## Basic Usage

### Create Work Items

```bash
# Create an epic (parent container)
bd create "KPI Trends Report" --type epic
# Output: Created bd-1

# Create tasks under the epic
bd create "Design KPI trends schema" --type task --parent bd-1
# Output: Created bd-1.1

bd create "Create trends API endpoint" --type task --parent bd-1
# Output: Created bd-1.2

bd create "Build trends chart component" --type task --parent bd-1
# Output: Created bd-1.3

bd create "Add E2E tests" --type task --parent bd-1
# Output: Created bd-1.4
```

### Set Dependencies

```bash
# API depends on schema
bd dep add bd-1.2 bd-1.1 --type blocked_by

# Chart depends on API
bd dep add bd-1.3 bd-1.2 --type blocked_by

# Tests depend on chart
bd dep add bd-1.4 bd-1.3 --type blocked_by
```

### Query Ready Work

```bash
# Human-readable
bd ready

# JSON for automation
bd ready --json
```

### Update Status

```bash
# Start working
bd update bd-1.1 --status in_progress

# Complete work
bd close bd-1.1 --reason "Schema created with migrations"
```

### View Work

```bash
# List all items
bd list

# Filter by status
bd list --status open
bd list --status in_progress

# Show details
bd show bd-1
```

## Wave Visualization

After setting up dependencies, you can visualize waves:

```
bd-1: KPI Trends Report (epic)
│
├── Wave 1 (Ready Now)
│   └── bd-1.1: Design KPI trends schema
│
├── Wave 2 (After bd-1.1)
│   └── bd-1.2: Create trends API endpoint
│
├── Wave 3 (After bd-1.2)
│   └── bd-1.3: Build trends chart component
│
└── Wave 4 (After bd-1.3)
    └── bd-1.4: Add E2E tests
```

## Integration with Xavier

Xavier's orchestration commands work with Beads:

```bash
# In Claude Code:
/start Add KPI trends to the reports page

# Creates PRD, then:
/plan-execution

# Creates work items in Beads, then:
/execute-work

# Queries bd ready and dispatches to agents
```

## Alternative: Local JSON

If you prefer not to install Beads, Xavier falls back to `docs/ai/work-items.json`:

```json
{
  "version": "1.0",
  "items": [
    {
      "id": "EPIC-001",
      "title": "KPI Trends Report",
      "type": "epic",
      "status": "open",
      "children": ["WI-001", "WI-002", "WI-003"]
    },
    {
      "id": "WI-001",
      "title": "Design KPI trends schema",
      "type": "task",
      "status": "open",
      "parent": "EPIC-001",
      "assigned_agent": "tech-lead",
      "blocked_by": [],
      "blocks": ["WI-002"]
    }
  ]
}
```

## Troubleshooting

### "bd: command not found"
Add Beads to your PATH:
```bash
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.zshrc
source ~/.zshrc
```

Or reinstall:
```bash
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

### Database lock errors
```bash
# Remove stale lock
rm .beads/beads.db-lock
```

### Sync issues
```bash
# Force sync from JSONL
bd sync --force
```

## Best Practices

1. **Keep items small** - Each task should be <4 hours of work
2. **Minimize dependencies** - Only add TRUE blockers
3. **Update promptly** - Change status as work progresses
4. **Use epics** - Group related tasks under epics
5. **Close with reasons** - Always document why an item was closed
