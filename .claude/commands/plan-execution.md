# /plan-execution Command

Creates a detailed execution plan with work items and dependencies, ready for wave-based execution.

## Usage

```
/plan-execution [PRD or feature description]
```

## Prerequisites

- PRD or feature spec exists (in `docs/ai/projects/` or provided inline)
- Technical assessment completed by @tech-lead (optional but recommended)

## Workflow

### Step 1: Analyze Requirements

@tech-lead reviews the PRD/spec and identifies:
- System components affected
- Database changes needed
- API endpoints required
- UI components required
- Integration points
- Risk areas

### Step 2: Create Work Breakdown

Break into vertical slices, each delivering user value:

```markdown
## Epic: [Feature Name]

### Slice 1: Foundation
- Database schema changes
- Basic API structure
- Configuration setup

### Slice 2: Core Functionality
- Main business logic
- Primary API endpoints
- Basic UI

### Slice 3: Complete Experience
- Full UI implementation
- Error handling
- Loading states

### Slice 4: Polish
- Performance optimization
- Edge cases
- Documentation
```

### Step 3: Create Work Items with Dependencies

Using Beads:
```bash
# Create epic
bd create "User Authentication" --type epic

# Create tasks with dependencies
bd create "Create user schema" --type task --parent bd-1
bd create "Implement login API" --type task --parent bd-1
bd create "Build login UI" --type task --parent bd-1
bd create "Integration testing" --type task --parent bd-1

# Set dependencies
bd dep add bd-1.2 bd-1.1 --type blocked_by  # API needs schema
bd dep add bd-1.3 bd-1.2 --type blocked_by  # UI needs API
bd dep add bd-1.4 bd-1.3 --type blocked_by  # Tests need UI
```

Or using JSON (`docs/ai/work-items.json`):
```json
{
  "items": [
    {
      "id": "EPIC-001",
      "title": "User Authentication",
      "type": "epic",
      "status": "open",
      "children": ["WI-001", "WI-002", "WI-003", "WI-004"]
    },
    {
      "id": "WI-001",
      "title": "Create user schema",
      "type": "task",
      "status": "open",
      "parent": "EPIC-001",
      "assigned_agent": "tech-lead",
      "blocked_by": [],
      "blocks": ["WI-002"]
    },
    {
      "id": "WI-002",
      "title": "Implement login API",
      "type": "task",
      "status": "open",
      "parent": "EPIC-001",
      "assigned_agent": "backend-engineer",
      "blocked_by": ["WI-001"],
      "blocks": ["WI-003"]
    }
  ]
}
```

### Step 4: Visualize Dependency Graph

Create a visual representation:

```
EPIC: User Authentication
│
├── Wave 1 (No dependencies)
│   ├── WI-001: Create user schema (@tech-lead)
│   ├── WI-005: Design UI mockups (@frontend-engineer)
│   └── WI-006: Create test plan (@qa-release)
│
├── Wave 2 (After Wave 1)
│   ├── WI-002: Login API (needs schema)
│   └── WI-007: Login form (needs mockups)
│
├── Wave 3 (After Wave 2)
│   └── WI-003: Connect UI to API
│
└── Wave 4 (After Wave 3)
    └── WI-004: E2E testing
```

### Step 5: Update Documentation

Save plan to `docs/ai/current-work.md`:
```markdown
## Execution Plan

**Epic**: [Name]
**Total Work Items**: X
**Estimated Waves**: Y

### Wave 1 (Ready Now)
- [ ] WI-001: Create user schema
- [ ] WI-005: Design UI mockups

### Wave 2 (After Wave 1)
- [ ] WI-002: Login API
- [ ] WI-007: Login form

[Continue for all waves...]
```

## Output

After running /plan-execution:
1. Work items created in Beads or JSON
2. Dependencies configured
3. Wave visualization documented
4. Ready for `/execute-work`

## Next Step

Run `/execute-work` to begin wave-based implementation.
