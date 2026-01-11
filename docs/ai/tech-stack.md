# Technology Stack

> **Note**: Customize this file for your specific project. This template assumes a Full-stack JS/TS setup.

## Frontend Stack

### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack (dev), Next.js bundler (prod)

### UI Components & Libraries
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **State Management**: React Query/SWR for server state

## Backend Stack

### Runtime & Frameworks
- **Runtime**: Node.js 20 LTS
- **API Frameworks**:
  - Next.js API routes (standard web apps)
  - Express/Fastify (standalone APIs)
- **Language**: TypeScript 5

### Database Drivers
- `pg` (PostgreSQL)
- Prisma or Drizzle ORM

## Database Stack

### Primary Databases
- **PostgreSQL**:
  - Local development
  - Managed services (Supabase, Neon, Railway)
- **Patterns**:
  - Connection pooling
  - UUID primary keys
  - Retry logic with exponential backoff

### Schema Patterns
```sql
-- Standard table structure
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_entities_status ON entities(status);
```

## Infrastructure Stack

### Deployment Platforms
- **Vercel**: Next.js hosting
- **Railway/Render**: Backend services
- **Docker**: Container orchestration (if needed)

### Container Strategy (Optional)
```dockerfile
# Multi-stage build pattern
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine
USER node
COPY --from=builder /app .
CMD ["npm", "start"]
```

## DevOps Stack

### CI/CD
- **GitHub Actions**: Automated testing and deployment
- **Secrets**: Environment variables in hosting platform

### Monitoring & Observability
- Application logs
- Error tracking (Sentry recommended)
- Performance monitoring

### Security
- **Authentication**: NextAuth.js, Clerk, or custom JWT
- **Secrets Management**: Environment variables
- **Security Headers**: CSP, X-Frame-Options, HSTS

## Development Stack

### Version Control
- **Git**: Source control
- **GitHub**: Repository hosting
- **Commit Convention**: Conventional commits
  - `feat:` New features
  - `fix:` Bug fixes
  - `refactor:` Code refactoring
  - `docs:` Documentation
  - `test:` Testing

### Development Tools
- **Package Manager**: npm or pnpm
- **TypeScript Config**:
  ```json
  {
    "strict": true,
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler"
  }
  ```
- **Environment Variables**:
  - Client: `NEXT_PUBLIC_*` prefix
  - Server: Standard env vars

### Testing
- **Unit Testing**: Vitest or Jest
- **E2E Testing**: Playwright
- **Component Testing**: Testing Library

## Common Patterns

### API Response Format
```typescript
{
  success: boolean
  data?: T
  error?: string
  timestamp: string
}
```

### Database Connection
```typescript
// Retry pattern
const maxRetries = 3
for (let i = 0; i < maxRetries; i++) {
  try {
    return await db.query(sql, params)
  } catch (error) {
    await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
  }
}
```

## Recommended Additions

1. GitHub Actions for CI/CD
2. Vitest for unit testing
3. Playwright for E2E testing
4. ESLint + Prettier configuration
5. Sentry for error tracking
6. Structured logging library
