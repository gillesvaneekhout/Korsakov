---
name: pr-description-protocol
description: Create comprehensive pull request descriptions that facilitate efficient code review
triggers:
  - "create PR"
  - "prepare pull request"
  - "write PR description"
  - "ready for review"
---

# PR Description Protocol Skill

## Purpose

Create clear, comprehensive pull request descriptions that help reviewers understand changes quickly and provide effective feedback.

## PR Template

```markdown
## Summary
Brief description of what this PR accomplishes (2-3 sentences).

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (code change that neither fixes a bug nor adds a feature)
- [ ] Documentation update

## Changes Made
- List specific changes
- Group by component/area
- Highlight key decisions

## Testing
- [ ] Manual testing completed
- [ ] API endpoints tested with curl/Postman
- [ ] Database migrations verified
- [ ] Cross-browser testing done
- [ ] Mobile responsive checked

## Screenshots (if UI changes)
[Add screenshots or recordings of the changes]

## Related Issues
- Closes #[issue number]
- Related to #[issue number]

## Deployment Notes
- [ ] Database migration required
- [ ] Environment variables added/changed
- [ ] Feature flag: `[flag_name]`
- [ ] Rollback procedure documented

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Sensitive data not exposed
```

## Writing Effective Descriptions

### Good Summary Examples
✅ "Add vehicle search functionality to fleet dashboard, allowing filtering by ID, status, and location with real-time updates"

✅ "Fix timeout issue in Athena queries by implementing connection pooling and retry logic with exponential backoff"

✅ "Refactor authentication middleware to use shared Logto configuration across all Next.js applications"

### Poor Summary Examples
❌ "Update dashboard"
❌ "Fix bug"
❌ "Add new feature"

## Code Review Guidelines

### What Reviewers Look For
1. **Correctness**: Does it solve the problem?
2. **Performance**: Will it scale?
3. **Security**: Any vulnerabilities?
4. **Maintainability**: Is it readable and well-organized?
5. **Consistency**: Does it follow patterns?

### How to Respond to Feedback
```markdown
> Should we consider caching this API response?

Good point! I've added Redis caching with 5-minute TTL in commit abc123.
The cache key includes depot_id to ensure proper isolation.
```

## PR Size Guidelines

### Ideal PR Size
- **Small**: < 200 lines (quick review, fast merge)
- **Medium**: 200-400 lines (normal review cycle)
- **Large**: > 400 lines (consider splitting)

### When Large PRs are Acceptable
- Database schema migrations
- Initial feature scaffolding
- Dependency updates
- Generated code

## Commit Organization

```bash
# Organize commits logically
git commit -m "feat: Add vehicle search API endpoint"
git commit -m "feat: Implement search UI components"
git commit -m "test: Add search functionality tests"
git commit -m "docs: Update API documentation"
```

## Common PR Scenarios

### Bug Fix PR
```markdown
## Summary
Fix fleet dashboard crashing when vehicle data is null by adding proper null checks and fallback values.

## Root Cause
API sometimes returns null for vehicle.lastLocation when GPS data is unavailable.

## Solution
- Added null checks in VehicleCard component
- Provide "Location Unknown" fallback
- Prevent map rendering when coordinates missing
```

### Feature PR
```markdown
## Summary
Implement KPI dashboard for depot managers showing key metrics with real-time updates and export functionality.

## Implementation Details
- Created new `/analytics` route
- Added Athena queries for KPI calculation
- Implemented Recharts visualizations
- Added CSV export functionality

## Performance Considerations
- Queries are cached for 15 minutes
- Pagination for large datasets
- Lazy loading of charts
```

### Refactoring PR
```markdown
## Summary
Extract common database utilities into shared library to reduce code duplication across API routes.

## Changes
- Created `lib/database/query.ts` with retry logic
- Created `lib/database/pool.ts` for connection management
- Updated all API routes to use new utilities
- No functional changes, only code organization
```

## GitHub CLI Usage

```bash
# Create PR with comprehensive description
gh pr create \
  --title "feat: Add vehicle search to fleet dashboard" \
  --body "$(cat pr-description.md)" \
  --base main \
  --label "enhancement,frontend" \
  --reviewer "@tech-lead"
```

## Post-PR Checklist

After creating the PR:
1. Review your own changes first
2. Verify CI checks pass (if configured)
3. Add relevant labels
4. Request appropriate reviewers
5. Link related issues
6. Monitor for feedback
7. Address comments promptly
8. Keep PR updated with main branch