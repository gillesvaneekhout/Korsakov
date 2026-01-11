---
name: code-change-protocol
description: Follow Your Project coding standards and conventions when making code changes
triggers:
  - "implement this"
  - "write code for"
  - "fix this bug"
  - "refactor"
  - "add this feature"
---

# Code Change Protocol Skill

## Purpose

Ensure all code changes follow Your Project conventions and maintain consistency across the codebase.

## General Principles

1. **Small, Focused Changes**: One concern per commit
2. **Preserve Existing Patterns**: Match surrounding code style
3. **Document Decisions**: Add comments for non-obvious choices
4. **Test Your Changes**: Manual testing minimum, automated preferred
5. **Consider Performance**: Especially for data-heavy operations

## TypeScript/JavaScript Standards

```typescript
// Use modern syntax
const processData = async (items: Item[]): Promise<Result> => {
  // Early returns for edge cases
  if (!items?.length) return { success: false }

  try {
    // Use const by default
    const processed = await Promise.all(
      items.map(item => processItem(item))
    )

    return { success: true, data: processed }
  } catch (error) {
    // Always handle errors
    console.error('Processing failed:', error)
    throw new Error('Failed to process items')
  }
}
```

## React/Next.js Patterns

```tsx
// Server Components (default in App Router)
export default async function Page({ params }: Props) {
  const data = await fetchData(params.id)
  return <ClientComponent data={data} />
}

// Client Components (only when needed)
'use client'
import { useState, useCallback } from 'react'

export function ClientComponent({ data }: Props) {
  const [state, setState] = useState(data)

  const handleChange = useCallback((value: string) => {
    setState(value)
  }, [])

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Tailwind classes, mobile-first */}
    </div>
  )
}
```

## Database Patterns

```typescript
// Connection with retry logic
async function queryWithRetry(sql: string, params: any[]) {
  const maxRetries = 3
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.query(sql, params)
    } catch (error) {
      lastError = error
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
    }
  }
  throw lastError
}

// Always use parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE depot_id = $1 AND status = $2',
  [depotId, 'active']
)
```

## API Patterns

```typescript
// Next.js API Route (App Router)
export async function POST(request: Request) {
  try {
    // Parse and validate input
    const body = await request.json()
    const validated = schema.parse(body)

    // Business logic
    const result = await processRequest(validated)

    // Consistent response format
    return Response.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    // Error response
    return Response.json({
      success: false,
      error: error.message
    }, { status: 400 })
  }
}
```

## Git Commit Messages

```
feat: Add vehicle search to fleet dashboard
fix: Resolve timeout in Athena queries
refactor: Extract common auth logic to middleware
docs: Update API documentation for v2 endpoints
test: Add integration tests for booking flow
```

## File Organization

```
src/
  app/                 # Next.js app router
    (auth)/           # Route groups
    api/              # API routes
  components/         # Shared components
    ui/              # Generic UI components
    features/        # Feature-specific components
  lib/               # Utilities and helpers
  types/             # TypeScript types
```

## Environment Variables

```bash
# Always prefix with NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_API_URL=https://api.indiecampers.io

# Server-side secrets never exposed
DATABASE_URL=postgresql://...
LOGTO_COOKIE_SECRET=...  # Min 32 chars
```

## Common Pitfalls to Avoid

- Don't commit sensitive data
- Don't skip error handling
- Don't ignore TypeScript errors
- Don't use `any` type without good reason
- Don't make synchronous API calls from components
- Don't forget loading and error states
- Don't hardcode depot IDs or environment-specific values