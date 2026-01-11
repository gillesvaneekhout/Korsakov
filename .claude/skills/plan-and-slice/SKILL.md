---
name: plan-and-slice
description: Break complex work into small, deliverable pieces that can be implemented incrementally
triggers:
  - "plan this feature"
  - "how should we implement"
  - "break this down"
  - "create a roadmap"
---

# Plan and Slice Skill

## Purpose

Transform large requirements into small, shippable increments. Each slice should provide value and be deployable independently.

## Slicing Principles

1. **Vertical Slices**: Each piece includes frontend, backend, and database changes
2. **User Value**: Every slice delivers something usable
3. **Small PRs**: Target <400 lines of code per PR
4. **Independent**: Minimize dependencies between slices
5. **Testable**: Each slice can be validated independently

## Process

1. **Analyze Scope**
   - List all components involved
   - Identify dependencies
   - Note risk areas

2. **Create Slices**
   ```
   Slice 1: Foundation (Schema, basic API)
   Slice 2: Core functionality (CRUD operations)
   Slice 3: UI implementation
   Slice 4: Enhanced features
   Slice 5: Polish and optimization
   ```

3. **Document Plan**
   Update `docs/ai/current-work.md`:
   ```markdown
   ## Implementation Plan

   ### Slice 1: Database and API Foundation
   - [ ] Create database schema
   - [ ] Basic CRUD endpoints
   - [ ] Input validation
   - Size: ~200 LOC

   ### Slice 2: Frontend Components
   - [ ] List view component
   - [ ] Form component
   - [ ] API integration
   - Size: ~300 LOC
   ```

## Patterns for Common Features

**CRUD Feature**:
1. Database schema + migration
2. API endpoints with validation
3. Frontend list view
4. Create/Edit forms
5. Delete with confirmation
6. Error handling
7. Loading states
8. Tests

**Dashboard Feature**:
1. Data model and queries
2. API endpoint for data
3. Basic visualization
4. Filters and controls
5. Export functionality
6. Real-time updates
7. Performance optimization

**Integration Feature**:
1. Configuration setup
2. Authentication/connection
3. Basic data sync
4. Error handling
5. Monitoring/logging
6. Retry logic
7. Documentation

## Anti-patterns to Avoid

- Horizontal slices (all backend, then all frontend)
- Giant PRs that touch everything
- Slices without user value
- Dependencies creating blockers
- Missing rollback ability