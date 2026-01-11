# /start Command

Universal entry point for any new work. Routes to the appropriate workflow based on the request.

## Usage

```
/start [description of what you want to build or fix]
```

## Workflow

### Step 0: Create Feature Branch (MANDATORY)

**Before any work begins, create a dedicated branch:**

```bash
# 1. Ensure we're on main and up to date
git checkout main
git pull origin main

# 2. Create feature branch from the description
# Convert description to branch name:
# "Add KPI trend charts" → feature/kpi-trend-charts
# "Fix login button on mobile" → fix/login-button-mobile

git checkout -b <type>/<branch-name>
```

**Branch naming convention:**
- `feature/` → New functionality
- `fix/` → Bug fixes
- `refactor/` → Code restructuring
- `docs/` → Documentation only

**Examples:**
```bash
git checkout -b feature/kpi-trend-charts
git checkout -b fix/mobile-login-button
git checkout -b refactor/auth-middleware
```

### Step 1: Clarify Intent

Ask these questions to understand the request:

1. **What type of work is this?**
   - New feature (greenfield)
   - Enhancement to existing feature
   - Bug fix
   - Technical debt / refactoring
   - Research / investigation

2. **What's the scope?**
   - Quick fix (<1 hour)
   - Small feature (1-4 hours)
   - Medium feature (1-2 days)
   - Large feature (needs breakdown)

3. **What's the desired outcome?**
   - User-facing change
   - Developer experience improvement
   - Performance optimization
   - Infrastructure change

### Step 2: Route to Appropriate Workflow

Based on answers:

| Type | Scope | Route To |
|------|-------|----------|
| New feature | Large | @product-partner → PRD → /plan-execution |
| New feature | Small/Medium | @tech-lead → Quick spec → Implementation |
| Enhancement | Any | @tech-lead → Impact analysis → Implementation |
| Bug fix | Any | @backend-engineer or @frontend-engineer directly |
| Tech debt | Any | @tech-lead → Assessment → Implementation |
| Research | Any | Spike work item → Investigation → Report |

### Step 3: Initialize Work Tracking

Create the initial work item:

```bash
# For large features (Beads)
bd create "[Feature Name]" --type epic

# Or in docs/ai/work-items.json for simple tracking
```

### Step 4: Document in Current Work

Update `docs/ai/current-work.md`:

```markdown
## Current Goal
[What we're building]

## Branch
`feature/[branch-name]`

## Scope
**In scope**: [List]
**Out of scope**: [List]

## Status
- [x] Branch created
- [ ] Requirements gathered
- [ ] Technical spec created
- [ ] Work items created
- [ ] Implementation in progress
- [ ] Testing complete
- [ ] PR created
- [ ] Merged to main
```

## Complete /start Flow

```
User: /start Add KPI trend charts to Reports page

Claude:
1. ✓ Check git status
2. ✓ Create branch: git checkout -b feature/kpi-trend-charts
3. ✓ Clarify scope and requirements
4. ✓ Route to @product-partner for PRD (if large feature)
5. ✓ Initialize work tracking
6. ✓ Update current-work.md

Ready for /plan-execution
```

## Examples

### Example 1: New Feature
```
User: /start I need to add a reports page to MyIndiePulse that shows KPI trends over time

Claude:
# Step 0: Create branch
git checkout main && git pull origin main
git checkout -b feature/kpi-trends-report

# Now on branch 'feature/kpi-trends-report'

Let me clarify the scope:
- What time periods? (daily, weekly, monthly)
- Which KPIs should be included?
- Chart type preference?

[After clarification]

@product-partner, please create a PRD for KPI trends report...
```

### Example 2: Bug Fix
```
User: /start Fix the login button not working on mobile

Claude:
# Step 0: Create branch
git checkout main && git pull origin main
git checkout -b fix/mobile-login-button

# Now on branch 'fix/mobile-login-button'

This looks like a quick fix. Routing directly to @frontend-engineer...

[Investigation and fix happens on this branch]

[When complete]
git add .
git commit -m "fix: increase touch target for mobile login button"
git push -u origin fix/mobile-login-button
gh pr create --title "fix: Mobile login button not responding" --base main
```

### Example 3: Refactoring
```
User: /start Refactor the authentication middleware to be more reusable

Claude:
# Step 0: Create branch
git checkout main && git pull origin main
git checkout -b refactor/auth-middleware

# Now on branch 'refactor/auth-middleware'

@tech-lead, please assess the current auth middleware...
```

## End State: Pull Request

Every `/start` flow ends with:

1. All work committed to feature branch
2. Branch pushed to origin
3. Pull request created
4. PR linked to work items/epic

```bash
# Final steps (automated or manual)
git push -u origin feature/kpi-trend-charts

gh pr create \
  --title "feat: Add KPI trend charts to Reports page" \
  --body "[PR description from pr-description-protocol]" \
  --base main
```

## Important Notes

- **NEVER commit directly to main** - Always use feature branches
- **One branch per feature/fix** - Don't mix unrelated changes
- **Keep branches short-lived** - Merge promptly after review
- **Delete branch after merge** - Keep repo clean
