# Indie Campers Technology Stack

## Frontend Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18-19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (PostCSS)
- **Build Tool**: Turbopack (dev), Next.js bundler (prod)

### UI Components & Libraries
- **Icons**: Lucide React
- **Data Visualization**:
  - Recharts (charts and graphs)
  - Leaflet (2D maps)
  - Globe.gl (3D globe visualization)
  - React-three/fiber (3D graphics)
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **State Management**: React Query/SWR for server state

## Backend Stack

### Runtime & Frameworks
- **Runtime**: Node.js 20 LTS
- **API Frameworks**:
  - Next.js API routes (standard web apps)
  - Hono (Cloudflare Workers)
- **Language**: TypeScript 5

### Integration SDKs
- **Authentication**: Logto Next SDK 4.2.6
- **Slack**: Bolt SDK 3.17+
- **AWS**: SDK v3 (Athena, Secrets Manager, S3)
- **Database Drivers**:
  - `pg` (PostgreSQL)
  - `@neondatabase/serverless`
  - `@supabase/supabase-js`

## Database Stack

### Primary Databases
- **PostgreSQL**:
  - AWS RDS (production)
  - Supabase (alternative)
  - Neon (serverless option)
- **Patterns**:
  - Connection pooling (max: 20)
  - UUID primary keys
  - Retry logic with exponential backoff
  - SSL required for connections

### Specialized Databases
- **Cloudflare D1**: SQLite-compatible edge database
- **AWS Athena**: S3-based data warehouse (Presto SQL)
- **Cloudflare Vectorize**: Vector database for embeddings

### Schema Patterns
```sql
-- Standard table structure
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  depot_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_entities_depot ON entities(depot_id);
CREATE INDEX idx_entities_status ON entities(status);
```

## AI/ML Stack

### Platform
- **Cloudflare Workers AI**: Edge AI inference
- **Models**: `@cf/baai/bge-base-en-v1.5` (768-dim embeddings)
- **Vector Search**: Cosine similarity via Vectorize
- **Threshold**: 0.87 for semantic deduplication

## Infrastructure Stack

### Deployment Platforms
1. **Cloudflare Workers**: Edge compute for APIs
2. **Cloudflare Pages**: Static site hosting
3. **Docker on AWS ECS**: Container orchestration
4. **AWS Lambda**: Serverless functions

### Container Strategy
```dockerfile
# Multi-stage build pattern
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
USER node:1001
COPY --from=builder /app .
CMD ["npm", "start"]
```

### Infrastructure as Code
- **Docker**: Multi-stage builds with Alpine
- **Wrangler**: Cloudflare Workers configuration
- **Bash Scripts**: Deployment automation
- **AWS CLI**: Service management

## DevOps Stack

### CI/CD
- **Current**: Manual deployments via bash scripts
- **Container Registry**: AWS ECR
- **Deployment**: Blue-green with health checks
- **Secrets**: AWS Secrets Manager

### Monitoring & Observability
- **Current State**: Basic/Default cloud provider tools
- **Likely**:
  - Cloudflare Analytics
  - AWS CloudWatch
  - Application logs to console

### Security
- **Authentication**: Logto SSO (tenant: `2te0vv.logto.app`)
- **Authorization**: Cookie-based sessions
- **Secrets Management**:
  - Dev: `.env.local` files
  - Prod: AWS Secrets Manager
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
- **Package Manager**: npm (with lock files)
- **TypeScript Config**:
  ```json
  {
    "strict": true,
    "target": "ES2017",
    "module": "esnext",
    "moduleResolution": "bundler"
  }
  ```
- **Environment Variables**:
  - Client: `NEXT_PUBLIC_*` prefix
  - Server: Standard env vars

### Testing (Limited/Gap)
- **Current**: Minimal automated testing
- **Manual Testing**: Primary validation method
- **Recommended**: Jest/Vitest, Playwright

## Data Stack

### Analytics Pipeline
- **Data Sources**: Application databases, events
- **ETL**: Custom Node.js/Python scripts
- **Data Warehouse**: AWS Athena on S3
- **Query Pattern**: Partitioned tables for performance

### Event Tracking
```typescript
// Standard event structure
interface AnalyticsEvent {
  event_name: string
  properties: {
    category: string
    action: string
    depot_id?: string
    user_id?: string
  }
  timestamp: Date
}
```

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

### Rate Limiting
- Public endpoints: 60 req/min
- Admin endpoints: 20 req/min
- Per-user tracking

## Technology Gaps

### Identified Gaps
- ❌ No CI/CD automation (GitHub Actions)
- ⚠️ Limited automated testing
- ⚠️ No formal linting standards
- ❓ Unknown structured logging
- ❓ Unknown APM/error tracking

### Recommended Additions
1. GitHub Actions for CI/CD
2. Jest/Vitest for unit testing
3. Playwright for E2E testing
4. ESLint + Prettier configuration
5. Sentry for error tracking
6. Structured logging library