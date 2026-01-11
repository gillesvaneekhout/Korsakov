---
name: wave-execution
description: Execute work items in parallel waves based on dependency graph
triggers:
  - "execute work"
  - "run the plan"
  - "start implementation"
  - "dispatch agents"
---

# Wave Execution Skill

## Purpose

Execute work items in parallel waves, maximizing throughput by running all independent work simultaneously while respecting dependencies.

## Core Principle

**Sequential thinking is the enemy of speed.**

```
BAD (Sequential):  Task A → Task B → Task C → Task D
                   Total: 4 units of time

GOOD (Waves):      Wave 1: [A, B] (parallel)
                   Wave 2: [C, D] (parallel, after wave 1)
                   Total: 2 units of time
```

## Wave Calculation Algorithm

```
1. Get all work items with status 'open'
2. For each item, check if all blocked_by items are 'closed'
3. Items with no blockers OR all blockers closed = READY
4. Group ready items into current wave
5. Execute wave (all items in parallel)
6. When wave completes, recalculate for next wave
7. Repeat until no items remain
```

## Execution Protocol

### Step 1: Calculate Current Wave

Query ready work items:
```bash
# With Beads
bd ready --json

# Or check docs/ai/work-items.json manually
```

### Step 2: Dispatch All Ready Items

For EACH ready item, dispatch to appropriate agent simultaneously:

```markdown
@backend-engineer, please implement: WI-002

**Task**: Implement login API endpoint
**Context**: See docs/ai/projects/auth/prd.md
**Blocked by**: WI-001 (completed)
**Acceptance Criteria**:
- POST /api/auth/login accepts email/password
- Returns JWT token on success
- Returns 401 on invalid credentials
- Rate limited to 5 attempts per minute

Update status to 'in_progress' when starting.
Mark as 'closed' when complete with summary.
```

Dispatch ALL agents at once - don't wait for one to finish before starting another.

### Step 3: Monitor Completion

Track which items complete. When an item closes:
1. Update work tracking status
2. Check if this unblocks other items
3. Add newly unblocked items to next wave

### Step 4: Trigger Reviews

When implementation work completes:
```markdown
@qa-release, please review: WI-002

**Completed work**: Implement login API endpoint
**Changes**: src/app/api/auth/login/route.ts
**Tests**: src/__tests__/auth.test.ts

Verify acceptance criteria and update status.
```

### Step 5: Detect Epic Completion

When all tasks in an epic are closed:
```markdown
@product-partner, epic AUTH-001 is complete.

**Epic**: User Authentication
**Completed tasks**: 5/5
**Summary**:
- User schema created
- Login/logout APIs implemented
- UI components built
- Tests passing

Please validate against PRD acceptance criteria.
```

## Wave Visualization

```
EPIC: User Authentication
├── Wave 1 (Foundation - No Dependencies)
│   ├── [x] WI-001: Create user schema (@tech-lead)
│   ├── [x] WI-005: Design login UI mockup (@frontend-engineer)
│   └── [x] WI-006: Create test plan (@qa-release)
│
├── Wave 2 (Core Implementation)
│   ├── [x] WI-002: Login API (blocked_by: WI-001) (@backend-engineer)
│   ├── [x] WI-003: Logout API (blocked_by: WI-001) (@backend-engineer)
│   └── [ ] WI-007: Build login form (blocked_by: WI-005) (@frontend-engineer)
│
├── Wave 3 (Integration)
│   └── [ ] WI-004: Connect UI to API (blocked_by: WI-002, WI-007) (@frontend-engineer)
│
└── Wave 4 (Validation)
    └── [ ] WI-008: E2E testing (blocked_by: WI-004) (@qa-release)
```

## Parallel Dispatch Template

When executing a wave, use this format to dispatch multiple agents:

```markdown
## Wave 2 Execution

I'm dispatching the following work items in parallel:

---

@backend-engineer, please work on WI-002: Login API
[Details...]

---

@backend-engineer, please work on WI-003: Logout API
[Details...]

---

@frontend-engineer, please work on WI-007: Build login form
[Details...]

---

All three items are now in progress. I'll coordinate the next wave once these complete.
```

## Anti-Patterns to Avoid

1. **Sequential dispatching** - Don't wait for A before starting B if they're independent
2. **Over-dependency** - Only add blockers that are TRUE dependencies
3. **Micro-waves** - Batch related independent work into the same wave
4. **Ignoring parallelism** - Always ask "can these run together?"
5. **Manual sequencing** - Let the dependency graph drive order

## Integration with Claude Code

In Claude Code, wave execution happens through @mentions:
- Each @agent-mention spawns agent context
- Multiple mentions in same message = parallel execution
- Track progress in `docs/ai/current-work.md`

## Context Management [CRITICAL]

**Problem**: Running many parallel agents consumes context quickly.

**Solutions**:

1. **Auto-compact enabled**: Settings include `"autoCompact": true`
2. **Run `/compact` when prompted**: If you see "Context low", run it immediately
3. **Batch waves smartly**: 3-4 agents per wave is optimal for context
4. **Persist state in Beads/JSON**: Work item status survives compaction
5. **Keep agent outputs concise**: Request summaries, not full details

### Wave Size Guidelines

| Context Status | Max Parallel Agents |
|----------------|---------------------|
| Fresh session  | 4-5 agents          |
| 50% used       | 2-3 agents          |
| 75% used       | Run /compact first  |

### Recovery After Compact

After `/compact`, the conversation is summarized. To resume:
1. Check `bd ready` or `docs/ai/work-items.json` for current state
2. Review `docs/ai/current-work.md` for progress log
3. Continue with next wave based on what's ready
