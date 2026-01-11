# /process-prds Command

Automatically discovers and processes PRD files in the repository, creating branches and work items for each.

## Usage

```
/process-prds [optional: path to specific PRD or directory]
```

## Workflow

### Step 1: Discover PRDs

Scan for PRD files in common locations:

```bash
# Search patterns (in order of priority)
find ./docs/ai/work -name "prd.md" 2>/dev/null
find . -name "prd*.md" -o -name "PRD*.md" 2>/dev/null
```

**Common PRD locations:**
- `docs/ai/work/*/prd.md` ← Primary location
- `docs/prd/*.md`
- Root level `PRD.md` or `prd.md`

### Step 2: Filter Unprocessed PRDs

For each discovered PRD, check if it's already been processed:

```bash
# Check if a branch already exists for this PRD
git branch -a | grep -i "<prd-name>"

# Check if work items exist in Beads
bd list --json | grep -i "<prd-name>"

# Check in work-items.json
grep -i "<prd-name>" docs/ai/work-items.json 2>/dev/null
```

**Skip if:**
- Branch already exists with matching name
- Work items already exist with matching epic name
- PRD has `status: completed` or `status: in-progress` in frontmatter

### Step 3: Parse PRD Metadata

Extract key information from each PRD:

```markdown
---
title: KPI Trend Charts
priority: high
status: ready  # ready | draft | in-progress | completed
owner: @product-partner
---
```

**Required fields:**
- `title` or first H1 heading
- `status` must be `ready` (skip if `draft`)

**Inferred fields:**
- Branch name: Convert title to kebab-case
- Epic name: Use title directly

### Step 4: Process Each Ready PRD

For each PRD with `status: ready`:

```markdown
## Processing: [PRD Title]

### 1. Create Feature Branch
git checkout main && git pull origin main
git checkout -b feature/<prd-name-kebab>

### 2. Create Epic in Beads
bd create "[PRD Title]" --type epic -d "PRD: <path-to-prd>"

### 3. Run /plan-execution
Read the PRD and create work items with dependencies.

### 4. Update PRD Status
Change status from 'ready' to 'in-progress' in PRD frontmatter.

### 5. Update current-work.md
Log that this PRD is being processed.
```

### Step 5: Report Summary

After processing all PRDs:

```markdown
## PRD Processing Summary

### Discovered: 5 PRDs
| PRD | Status | Action |
|-----|--------|--------|
| KPI Trend Charts | ready | ✓ Processed - branch: feature/kpi-trend-charts |
| User Auth | draft | ⏭ Skipped - status is draft |
| Mobile Redesign | in-progress | ⏭ Skipped - already in progress |
| Reports Export | ready | ✓ Processed - branch: feature/reports-export |
| Dashboard V2 | completed | ⏭ Skipped - already completed |

### Created:
- 2 feature branches
- 2 epics with 12 work items total

### Next Steps:
Run `/execute-work` to start implementation, or process individually:
- `/execute-work` - Execute all ready work
- `bd ready` - See what's unblocked
```

## PRD Discovery Patterns

### Pattern 1: Structured Directory (Recommended)
```
docs/ai/work/
├── kpi-trends/
│   └── prd.md         ← Discovered
├── user-auth/
│   └── prd.md         ← Discovered
└── mobile-redesign/
    └── prd.md         ← Discovered
```

### Pattern 2: Root Level
```
./
├── PRD.md             ← Discovered (single project)
```

## PRD Status Lifecycle

```
draft → ready → in-progress → completed
  │       │          │            │
  │       │          │            └─ PR merged, feature live
  │       │          └─ /process-prds ran, work items created
  │       └─ PRD approved, ready for implementation
  └─ Still being written
```

## Automatic Frontmatter Updates

When processing a PRD, update its frontmatter:

**Before:**
```markdown
---
title: KPI Trend Charts
status: ready
---
```

**After:**
```markdown
---
title: KPI Trend Charts
status: in-progress
branch: feature/kpi-trend-charts
epic_id: bd-kpi.0
processed_at: 2024-01-15T10:30:00Z
---
```

## Examples

### Example 1: Process All PRDs
```
User: /process-prds

Claude:
Scanning for PRD files...

Found 3 PRDs:
1. docs/ai/projects/kpi-trends/prd.md (status: ready)
2. docs/ai/projects/auth/prd.md (status: draft)
3. docs/ai/projects/reports/prd.md (status: ready)

Processing docs/ai/projects/kpi-trends/prd.md...
✓ Created branch: feature/kpi-trend-charts
✓ Created epic: bd-kpi.0 "KPI Trend Charts"
✓ Running /plan-execution...
✓ Created 6 work items

Processing docs/ai/projects/reports/prd.md...
✓ Created branch: feature/reports-export
✓ Created epic: bd-rep.0 "Reports Export"
✓ Running /plan-execution...
✓ Created 4 work items

Skipped 1 PRD (status: draft)

Summary: 2 PRDs processed, 10 work items created.
Run /execute-work to start implementation.
```

### Example 2: Process Specific PRD
```
User: /process-prds docs/ai/projects/kpi-trends/prd.md

Claude:
Processing single PRD: docs/ai/projects/kpi-trends/prd.md

✓ Created branch: feature/kpi-trend-charts
✓ Created epic: bd-kpi.0 "KPI Trend Charts"
✓ Running /plan-execution...
✓ Created 6 work items

Ready for /execute-work
```

### Example 3: No PRDs Found
```
User: /process-prds

Claude:
Scanning for PRD files...

No PRD files found in:
- docs/ai/projects/*/prd.md
- docs/prd/*.md
- ./PRD.md

To create a PRD:
1. Use the template: cp templates/prd.md docs/ai/projects/my-feature/prd.md
2. Fill in the requirements
3. Set status: ready
4. Run /process-prds again
```

## Integration with /start

If user runs `/start` with a description that matches an existing PRD:

```
User: /start Implement the KPI trends feature

Claude:
Found existing PRD at docs/ai/projects/kpi-trends/prd.md

Would you like to:
a) Process this PRD (/process-prds docs/ai/projects/kpi-trends/prd.md)
b) Create a new PRD for different requirements
c) Start without a PRD (small feature)
```

## Notes

- **Batch processing**: Processes all ready PRDs in a single run
- **Idempotent**: Safe to run multiple times - skips already-processed PRDs
- **Atomic**: Each PRD creates its own branch - failures don't affect others
- **Traceable**: Updates PRD frontmatter with processing metadata
