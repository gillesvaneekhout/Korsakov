---
name: intake-and-clarify
description: Understand requirements, gather missing context, and clarify ambiguities before starting work
triggers:
  - "help me implement"
  - "I need to build"
  - "create a feature"
  - "fix this issue"
  - "improve performance"
---

# Intake and Clarify Skill

## Purpose

Ensure complete understanding of requirements before implementation begins. Minimize rework by asking the right questions upfront.

## Process

1. **Parse Initial Request**
   - Identify the core ask
   - Note any constraints mentioned
   - Flag ambiguities

2. **Context Gathering**
   - Check `docs/ai/current-work.md` for related context
   - Review relevant code areas
   - Identify stakeholders

3. **Clarification Questions** (Ask only if truly blocking)
   - What is the primary goal?
   - Who are the users?
   - What are the success criteria?
   - Any technical constraints?
   - Timeline expectations?
   - Integration points?

4. **Document Understanding**
   - Update `docs/ai/current-work.md` with:
     - Goal statement
     - Scope boundaries
     - Assumptions made
     - Open questions

## Outputs

- Clear problem statement
- Documented assumptions
- List of deliverables
- Success criteria

## When to Skip Clarification

- Requirements are clear and complete
- Similar work exists as reference
- Prototype/POC phase where exploration is the goal
- User explicitly says "make assumptions"

## Example

**Input**: "Add search to the fleet dashboard"

**Output**:
```markdown
## Current Work: Fleet Dashboard Search

**Goal**: Add search functionality to filter vehicles in fleet dashboard

**Assumptions**:
- Search by vehicle ID, status, location
- Real-time filtering on client side
- Maintain existing dashboard performance

**Open Questions**:
- Include fuzzy matching?
- Search history needed?
- Export search results?

**Proceeding with**: Basic text search on vehicle ID and status
```