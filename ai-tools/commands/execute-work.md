# /execute-work Command

Executes work items in parallel waves, dispatching to specialist agents and tracking progress.

## Usage

```
/execute-work [optional: specific epic or work item ID]
```

## Prerequisites

- Work items exist (from `/plan-execution`)
- Dependencies configured
- Beads initialized OR `docs/ai/work-items.json` exists

## Workflow

### Step 1: Query Ready Work

Find all unblocked work items:

```bash
# With Beads
bd ready --json

# Output example:
[
  {"id": "bd-1.1", "title": "Create user schema", "type": "task"},
  {"id": "bd-1.5", "title": "Design UI mockups", "type": "task"}
]
```

Or check `docs/ai/work-items.json` for items where:
- `status` = "open"
- All `blocked_by` items have `status` = "closed"

### Step 2: Dispatch Current Wave

For EACH ready item, dispatch to the assigned agent **simultaneously**:

```markdown
## Executing Wave 1

I'm dispatching 3 work items in parallel:

---

@tech-lead, please work on WI-001: Create user schema

**Epic**: User Authentication
**Description**: Design and create PostgreSQL schema for user authentication
**Acceptance Criteria**:
- users table with id (UUID), email, password_hash, created_at, updated_at
- Migration script created and tested
- Indexes on email (unique) and created_at
**Context**: See docs/ai/projects/auth/prd.md

When complete:
1. Update work item status to 'closed'
2. Document changes in docs/ai/current-work.md
3. Notify @work-orchestrator

---

@frontend-engineer, please work on WI-005: Design UI mockups

**Epic**: User Authentication
**Description**: Create login/signup UI component designs
**Acceptance Criteria**:
- Login form with email/password fields
- Error state designs
- Loading state designs
- Mobile responsive layout
**Context**: Follow existing MyIndiePulse design patterns

When complete, update status and notify @work-orchestrator.

---

@qa-release, please work on WI-006: Create test plan

**Epic**: User Authentication
**Description**: Define testing strategy for auth feature
**Acceptance Criteria**:
- Unit test requirements documented
- Integration test scenarios defined
- E2E test cases listed
- Security testing checklist

When complete, update status and notify @work-orchestrator.

---

**Wave 1 Status**: 3 items dispatched, tracking progress...
```

### Step 3: Track Completion

As each agent completes work:

1. **Update work item status**:
   ```bash
   bd close bd-1.1 --reason "Schema created, migration tested"
   ```

2. **Check for newly unblocked items**:
   ```bash
   bd ready --json  # See what's now available
   ```

3. **Log progress**:
   ```markdown
   ## Progress Log

   ### Wave 1 (3/3 complete)
   - [x] WI-001: Create user schema - DONE
   - [x] WI-005: Design UI mockups - DONE
   - [x] WI-006: Create test plan - DONE

   ### Wave 2 (0/2 complete) - NOW READY
   - [ ] WI-002: Login API
   - [ ] WI-007: Login form
   ```

### Step 4: Execute Next Wave

When Wave 1 completes, immediately dispatch Wave 2:

```markdown
## Executing Wave 2

Wave 1 complete. Dispatching Wave 2 (2 items):

---

@backend-engineer, please work on WI-002: Implement login API

**Blocked by (completed)**: WI-001 (user schema)
**Description**: Create POST /api/auth/login endpoint
...

---

@frontend-engineer, please work on WI-007: Build login form

**Blocked by (completed)**: WI-005 (UI mockups)
**Description**: Implement login form component
...
```

### Step 5: Trigger Reviews

When implementation work completes, trigger review:

```markdown
@qa-release, please review completed work:

**Work Items**:
- WI-002: Login API (backend)
- WI-007: Login form (frontend)

**Files Changed**:
- src/app/api/auth/login/route.ts
- src/components/auth/LoginForm.tsx

Please verify against acceptance criteria and run test plan.
```

### Step 6: Detect Epic Completion

When all tasks in an epic are closed:

```markdown
@product-partner, Epic EPIC-001 (User Authentication) is complete!

**Summary**:
- 8/8 tasks completed
- All acceptance criteria met
- Tests passing

**Completed Work**:
- User schema and migrations
- Login/logout API endpoints
- Login/signup UI components
- E2E test coverage

Please validate against PRD for final approval.
```

### Step 7: Create Pull Request

After all work is complete and validated, create the PR:

```bash
# Commit any final changes
git add .
git commit -m "feat: complete [epic name] implementation"

# Push branch to origin
git push -u origin feature/[branch-name]

# Create PR using GitHub CLI
gh pr create \
  --title "feat: [Epic Title]" \
  --body "## Summary
[Brief description of what was implemented]

## Work Items Completed
- [x] WI-001: [Title]
- [x] WI-002: [Title]
- [x] WI-003: [Title]

## Changes Made
- [List of key changes by area]

## Testing
- [x] Manual testing completed
- [x] Acceptance criteria verified
- [x] @qa-release validation passed

## Screenshots
[If applicable]

---
Epic: [EPIC-ID]
" \
  --base main
```

**Output the PR URL** so the user can review it.

## Execution States

```
/execute-work
     │
     ├── Query ready items
     │
     ├── Wave 1: Dispatch all ready → Track completion
     │         ↓
     ├── Wave 2: Dispatch newly ready → Track completion
     │         ↓
     ├── Wave N: Continue until no items remain
     │         ↓
     ├── Trigger reviews
     │         ↓
     ├── Epic completion → PM validation
     │         ↓
     └── Create Pull Request → Output PR URL
```

## Commands During Execution

- `bd ready` - Check what's available to work on
- `bd list --status in_progress` - See active work
- `bd show [id]` - Details on specific item
- `bd close [id]` - Mark item complete

## Troubleshooting

**No ready items but work remains?**
- Check for circular dependencies
- Verify blocked items are truly closed
- Review dependency graph for errors

**Agent not responding?**
- Verify agent file exists in `.claude/agents/`
- Check agent has required skills
- Retry with explicit context
