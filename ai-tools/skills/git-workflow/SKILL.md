---
name: git-workflow
description: Manage git branches and ensure proper workflow for features, fixes, and PRs
triggers:
  - "create branch"
  - "start feature"
  - "prepare PR"
  - "merge to main"
---

# Git Workflow Skill

## Purpose

Ensure every feature, fix, or enhancement is developed on a dedicated branch and merged via pull request. This maintains a clean git history and enables proper code review.

## Branch Naming Convention

```
<type>/<short-description>

Types:
- feature/   → New functionality
- fix/       → Bug fixes
- refactor/  → Code restructuring
- docs/      → Documentation only
- test/      → Adding/updating tests
- chore/     → Maintenance tasks
```

### Examples

```bash
feature/kpi-trend-charts
feature/user-authentication
fix/mobile-login-button
fix/athena-query-timeout
refactor/extract-auth-middleware
docs/api-documentation
```

## Workflow: Starting New Work

### Step 1: Ensure Clean Working Directory

```bash
# Check current status
git status

# If there are uncommitted changes, stash or commit them
git stash  # or git commit
```

### Step 2: Update Main Branch

```bash
git checkout main
git pull origin main
```

### Step 3: Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/<name>

# Example
git checkout -b feature/kpi-trend-charts
```

### Step 4: Verify Branch

```bash
git branch  # Shows current branch with asterisk
```

## Workflow: During Development

### Commit Frequently

```bash
# Stage changes
git add <files>

# Commit with conventional message
git commit -m "feat: add trend chart component"
git commit -m "feat: create KPI trends API endpoint"
git commit -m "test: add tests for trend calculations"
```

### Keep Branch Updated

```bash
# Periodically sync with main
git fetch origin main
git rebase origin/main

# Or merge (if team prefers)
git merge origin/main
```

## Workflow: Creating Pull Request

### Step 1: Push Branch

```bash
git push -u origin feature/kpi-trend-charts
```

### Step 2: Create PR via GitHub CLI

```bash
gh pr create \
  --title "feat: Add KPI trend charts to Reports page" \
  --body "## Summary
Add trend visualization showing KPI changes over the last 12 periods.

## Changes
- Created TrendChart component with sparklines
- Added /api/kpi-trends endpoint
- Integrated into ReportsView

## Testing
- [x] Manual testing completed
- [x] Responsive design verified
- [x] API returns correct data

## Screenshots
[Add screenshots]
" \
  --base main
```

### Step 3: After Merge

```bash
# Switch back to main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feature/kpi-trend-charts

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/kpi-trend-charts
```

## Integration with Xavier Orchestration

### /start Command Creates Branch

When `/start` is invoked for a new feature:

1. Check if on `main` branch
2. Pull latest changes
3. Create feature branch based on feature name
4. Initialize work tracking (Beads)
5. Proceed with PRD creation

### /execute-work Commits to Feature Branch

All code changes during wave execution are committed to the feature branch:

```bash
# After each wave completion
git add .
git commit -m "feat: complete Wave 1 - schema and mockups"
```

### Completion Creates PR

When all work is complete:

1. Push feature branch
2. Create PR using `pr-description-protocol`
3. Request review
4. Track PR status

## Branch Protection (Recommended)

Configure in GitHub repository settings:

```yaml
main:
  - Require pull request before merging
  - Require approvals: 1
  - Dismiss stale approvals on new commits
  - Require status checks (if CI configured)
  - Require branch to be up to date
```

## Quick Reference

| Action | Command |
|--------|---------|
| Create branch | `git checkout -b feature/name` |
| Switch branch | `git checkout branch-name` |
| List branches | `git branch` |
| Delete branch | `git branch -d branch-name` |
| Push new branch | `git push -u origin branch-name` |
| Create PR | `gh pr create` |
| View PR status | `gh pr status` |

## Common Issues

### "Branch already exists"

```bash
# Check if branch exists
git branch -a | grep feature-name

# If exists and you want to continue work
git checkout feature/name

# If exists and you want fresh start
git branch -D feature/name  # Delete local
git checkout -b feature/name  # Recreate
```

### "Conflicts with main"

```bash
git fetch origin main
git rebase origin/main

# Resolve conflicts, then
git add .
git rebase --continue
```

### "Forgot to create branch"

```bash
# If you've made changes on main
git stash
git checkout -b feature/name
git stash pop
```
