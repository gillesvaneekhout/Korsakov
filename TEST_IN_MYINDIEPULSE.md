# Testing Xavier Orchestration in MyIndiePulse

This guide walks you through testing Xavier's multi-agent orchestration with a real feature implementation in MyIndiePulse.

## Prerequisites

1. **Xavier repo** is set up at `/Users/rui.costa/ai-indie/xavier`
2. **MyIndiePulse repo** at `/Users/rui.costa/ai-indie/indiecampers.io-myindiepulse`
3. **Claude Code** installed and subscription active

## Step 1: Install Beads (Optional but Recommended)

```bash
# Install via script
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Add to PATH (add this to ~/.zshrc permanently)
export PATH="$PATH:$HOME/.local/bin"

# Verify installation
bd --version
```

If you skip this, Xavier will use `docs/ai/work-items.json` instead.

## Step 2: Open Multi-Root Workspace

Open Claude Code with both Xavier and MyIndiePulse:

```bash
cd /Users/rui.costa/ai-indie
claude .
```

Or open just MyIndiePulse (Xavier will be referenced):
```bash
cd /Users/rui.costa/ai-indie/indiecampers.io-myindiepulse
claude .
```

## Step 3: Initialize Beads in MyIndiePulse

```bash
cd /Users/rui.costa/ai-indie/indiecampers.io-myindiepulse
bd init
```

## Step 4: Test Feature - KPI Trends Report

Let's implement a real feature: **Add KPI trend charts to the Reports page**.

### 4.1 Start the Workflow

In Claude Code, type:

```
/start Add KPI trend charts to the Reports page. Users should be able to see how each KPI has changed over the last 12 periods (weeks/months). Include line charts with sparklines.
```

**Expected behavior:**
1. Xavier asks clarifying questions (scope, priority)
2. Routes to @product-partner for PRD creation
3. PRD saved to `docs/ai/projects/kpi-trends/prd.md`

### 4.2 Plan the Execution

```
/plan-execution
```

**Expected behavior:**
1. @tech-lead reviews the PRD
2. Creates work items with dependencies:

```
EPIC: KPI Trend Charts
│
├── Wave 1 (No Dependencies)
│   ├── WI-001: Design trend data schema/query
│   ├── WI-002: Create UI mockup for trend charts
│   └── WI-003: Write test plan
│
├── Wave 2 (After Wave 1)
│   ├── WI-004: Create /api/kpi-trends endpoint
│   └── WI-005: Build TrendChart component
│
├── Wave 3 (After Wave 2)
│   └── WI-006: Integrate charts into ReportsView
│
└── Wave 4 (After Wave 3)
    └── WI-007: E2E testing
```

### 4.3 Execute in Waves

```
/execute-work
```

**Expected behavior:**
1. @work-orchestrator queries ready work (`bd ready`)
2. Dispatches Wave 1 in parallel:
   - @tech-lead works on schema
   - @frontend-engineer works on mockups
   - @qa-release works on test plan
3. When Wave 1 completes, dispatches Wave 2
4. Continues until all waves complete

### 4.4 Monitor Progress

Check work status:
```bash
bd list
bd ready
bd show EPIC-001
```

Or check `docs/ai/current-work.md` for progress log.

## Step 5: Verify the Output

After execution completes, you should have:

### New/Modified Files

```
indiecampers.io-myindiepulse/
├── app/
│   └── api/
│       └── kpi-trends/
│           └── route.ts          # New API endpoint
├── components/
│   └── kpi/
│       ├── TrendChart.tsx        # New component
│       └── ReportsView.tsx       # Modified
├── lib/
│   └── supabase/
│       └── trends.ts             # New query functions
└── docs/
    └── ai/
        ├── projects/
        │   └── kpi-trends/
        │       └── prd.md        # PRD
        ├── current-work.md       # Progress log
        └── work-items.json       # Work tracking (or .beads/)
```

### Work Items Completed

```bash
bd list --status closed
# Should show all 7 work items as closed
```

## Example Conversation Flow

Here's what a full session might look like:

```
You: /start Add KPI trend charts to the Reports page

Claude: I'll help you add KPI trend charts. Let me clarify a few things:

1. **Scope**: Should trends show historical data for:
   - All KPIs on the dashboard?
   - Only selected KPIs?
   - A new dedicated trends section?

2. **Time Range**: What's the default period?
   - Last 4 weeks
   - Last 12 weeks
   - Last 12 months
   - User-selectable?

3. **Chart Type**:
   - Line charts with data points
   - Sparklines (compact)
   - Both?

You: All KPIs, last 12 periods based on current time dimension, line charts with sparklines

Claude: Got it. @product-partner, please create a PRD for KPI trend charts...

[PRD created]

You: /plan-execution

Claude: @tech-lead, reviewing the PRD and creating work breakdown...

[Work items created]

Wave visualization:
- Wave 1: 3 items (schema, mockups, test plan)
- Wave 2: 2 items (API, components)
- Wave 3: 1 item (integration)
- Wave 4: 1 item (testing)

Ready to execute?

You: /execute-work

Claude: @work-orchestrator executing Wave 1...

Dispatching in parallel:
- @tech-lead: WI-001 (trend data schema)
- @frontend-engineer: WI-002 (UI mockups)
- @qa-release: WI-003 (test plan)

[Wave 1 completes]

Wave 1 complete (3/3). Executing Wave 2...

[Continues through all waves]

All work complete! Summary:
- 7 work items completed
- Files created: 4
- Files modified: 2
- Tests: Passing

@product-partner, please validate against PRD acceptance criteria.
```

## Troubleshooting

### "bd: command not found"
```bash
npm install -g @anthropic/beads
# Or use local JSON tracking (automatic fallback)
```

### Agents not responding
Make sure Xavier is accessible. In multi-root workspace, Claude Code should auto-detect `CLAUDE.md`.

### Work items not updating
Check `.beads/beads.jsonl` or `docs/ai/work-items.json` for state.

### Circular dependencies
Review the dependency graph - ensure no cycles exist.

## Next Steps

After successful test:

1. **Commit the Xavier changes**:
   ```bash
   cd /Users/rui.costa/ai-indie/xavier
   git add .
   git commit -m "Add multi-agent orchestration with wave execution"
   ```

2. **Use in other projects**:
   - Fleet Dashboard
   - Aires (Iris)
   - Any new Indie Campers project

3. **Customize agents**:
   - Add domain-specific agents
   - Modify skills for your patterns
   - Create project-specific commands
