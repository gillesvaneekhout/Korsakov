---
name: work-tracking
description: Track work items, dependencies, and status using Beads or local JSON
triggers:
  - "create work item"
  - "update work status"
  - "what's ready to work on"
  - "show work items"
  - "close work item"
---

# Work Tracking Skill

## Purpose

Manage work items with dependencies, enabling wave-based parallel execution. Supports two backends:
1. **Beads** (recommended) - Git-synced, feature-rich
2. **Local JSON** (fallback) - No dependencies, simple

## Beads Commands (if installed)

```bash
# Initialize Beads in a project
bd init

# Create work items
bd create "Epic: User Authentication" --type epic
bd create "Create user schema" --type task --parent bd-1
bd create "Implement login API" --type task --parent bd-1
bd create "Build login UI" --type task --parent bd-1

# Set dependencies
bd dep add bd-1.2 bd-1.1 --type blocked_by  # API blocked by schema
bd dep add bd-1.3 bd-1.2 --type blocked_by  # UI blocked by API

# Query ready work (unblocked)
bd ready                    # Human-readable
bd ready --json            # For orchestration

# Update status
bd update bd-1.1 --status in_progress
bd close bd-1.1 --reason "Schema created and migrated"

# View work
bd list                    # All items
bd list --status open      # Filter by status
bd show bd-1               # Details for one item
```

## Local JSON Alternative

If Beads is not installed, use `docs/ai/work-items.json`:

```json
{
  "items": [
    {
      "id": "WI-001",
      "title": "Create user schema",
      "type": "task",
      "status": "open",
      "parent": "EPIC-001",
      "blocked_by": [],
      "blocks": ["WI-002"],
      "assigned_to": null,
      "created_at": "2025-01-05T10:00:00Z",
      "updated_at": "2025-01-05T10:00:00Z",
      "description": "Create PostgreSQL schema for user authentication",
      "acceptance_criteria": [
        "users table with id, email, password_hash, created_at",
        "Migration script created",
        "Indexes on email column"
      ]
    }
  ]
}
```

## Ready Work Query (JSON)

Work is "ready" when:
1. Status is `open`
2. All items in `blocked_by` have status `closed`

```javascript
// Pseudo-code for finding ready work
const ready = items.filter(item =>
  item.status === 'open' &&
  item.blocked_by.every(dep =>
    items.find(i => i.id === dep)?.status === 'closed'
  )
);
```

## Work Item Types

- **epic** - Large feature containing multiple tasks
- **task** - Single unit of work, assignable to one agent
- **bug** - Defect to be fixed
- **spike** - Research/investigation task

## Status Transitions

```
open → in_progress → review → closed
         ↓
      blocked (if dependency not met)
```

## Integration with Agents

When creating work items, specify the target agent:

```json
{
  "id": "WI-002",
  "title": "Implement login API endpoint",
  "assigned_agent": "backend-engineer",
  "description": "Create POST /api/auth/login endpoint"
}
```

## Best Practices

1. **Keep items small** - Each task should be <4 hours of work
2. **Clear dependencies** - Only add true blockers
3. **Acceptance criteria** - Always define what "done" means
4. **Update promptly** - Change status as soon as work state changes
5. **Link context** - Reference PRD, spec, or related items
