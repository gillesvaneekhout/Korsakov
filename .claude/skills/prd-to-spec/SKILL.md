---
name: prd-to-spec
description: Convert Product Requirements Documents into implementable technical specifications
triggers:
  - "convert this PRD"
  - "create technical spec"
  - "design the architecture"
  - "how should we build this"
---

# PRD to Spec Skill

## Purpose

Transform product requirements into detailed technical specifications that engineers can implement directly.

## Process

### 1. Analyze PRD
Extract from PRD:
- Core requirements (MUST/SHOULD/COULD)
- User journeys and use cases
- Success metrics
- Constraints and dependencies
- Acceptance criteria

### 2. Technical Design

#### System Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│     API     │────▶│   Database  │
│  Next.js 15 │     │   Next.js   │     │ PostgreSQL  │
└─────────────┘     └─────────────┘     └─────────────┘
        │                   │                    │
        ▼                   ▼                    ▼
  [Cloudflare CDN]   [Logto Auth]      [AWS Athena]
```

#### Data Model
```typescript
// Define entities and relationships
interface Vehicle {
  id: string          // UUID
  vehicleId: string   // Business identifier
  status: 'available' | 'booked' | 'maintenance'
  depot_id: string
  last_location: {
    lat: number
    lng: number
    timestamp: Date
  }
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}
```

#### API Design
```typescript
// RESTful endpoints
GET    /api/vehicles         // List with filters
GET    /api/vehicles/:id     // Get single
POST   /api/vehicles         // Create new
PATCH  /api/vehicles/:id     // Update
DELETE /api/vehicles/:id     // Soft delete

// Request/Response schemas
interface CreateVehicleRequest {
  vehicleId: string
  depotId: string
  initialStatus: string
}

interface VehicleResponse {
  success: boolean
  data?: Vehicle
  error?: string
}
```

### 3. Implementation Breakdown

Create work slices:

```markdown
## Implementation Plan

### Phase 1: Foundation (Day 1-2)
- Database schema and migrations
- Basic CRUD API
- Authentication setup

### Phase 2: Core Features (Day 3-5)
- Search and filtering
- Real-time updates
- Validation rules

### Phase 3: UI Implementation (Day 6-8)
- List view with pagination
- Detail view
- Forms with validation

### Phase 4: Polish (Day 9-10)
- Error handling
- Loading states
- Performance optimization
```

### 4. Technical Decisions

Document key choices:

```markdown
## Technical Decisions

### Why PostgreSQL over DynamoDB?
- Need complex queries and joins
- ACID compliance required
- Team expertise with SQL

### Why Server Components?
- Better SEO for public pages
- Reduced client bundle size
- Simplified data fetching

### Why Logto for Auth?
- Already integrated across Your Project apps
- Supports SSO requirements
- Managed service reduces maintenance
```

## Template: Technical Specification

```markdown
# Technical Specification: [Feature Name]

## Overview
Brief technical summary of what we're building.

## Architecture

### System Design
[ASCII or Mermaid diagram]

### Data Flow
1. User initiates action
2. Frontend validates input
3. API processes request
4. Database updates
5. Response returned
6. UI updates

## Data Model

### Database Schema
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id VARCHAR(50) UNIQUE NOT NULL,
  depot_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vehicles_depot ON vehicles(depot_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
```

### API Contracts

#### Endpoints
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles?depot={id}` - List by depot
- `PATCH /api/vehicles/{id}` - Update status

#### Request/Response Schemas
[TypeScript interfaces]

## Implementation Details

### Frontend Components
- VehicleList: Displays paginated grid
- VehicleCard: Individual vehicle display
- VehicleForm: Create/edit interface
- VehicleFilters: Search and filter UI

### Backend Services
- VehicleService: Business logic
- VehicleRepository: Database operations
- VehicleValidator: Input validation
- VehicleEvents: Analytics tracking

### State Management
- Server state: React Query / SWR
- Client state: React hooks
- Global state: Context API (minimal)

## Security Considerations
- Input validation on all endpoints
- SQL injection prevention via parameterized queries
- Rate limiting: 60 req/min per user
- Depot-based access control

## Performance Targets
- Page load: < 2 seconds
- API response: < 500ms
- Database queries: < 100ms
- Bundle size: < 300KB gzipped

## Testing Strategy
- Unit tests for business logic
- API integration tests
- Manual E2E testing
- Performance benchmarks

## Deployment Plan
1. Database migration
2. Deploy API changes
3. Deploy frontend
4. Feature flag activation
5. Monitor metrics
6. Gradual rollout

## Rollback Plan
- Feature flag to disable
- Database migration rollback script
- Previous version in container registry
- DNS switch for emergency

## Monitoring
- Log all API errors
- Track query performance
- Monitor error rates
- Alert on anomalies

## Dependencies
- Existing auth system (Logto)
- Vehicle data source (manual/integration)
- Analytics pipeline (existing)

## Timeline
- Days 1-3: Backend implementation
- Days 4-6: Frontend implementation
- Day 7: Testing and fixes
- Day 8: Documentation
- Day 9: Deployment prep
- Day 10: Production release

## Open Questions
- List any unresolved technical questions
- Note assumptions made

## Risks
- Risk: Database performance at scale
  Mitigation: Implement caching layer
- Risk: Third-party service downtime
  Mitigation: Graceful degradation
```

## Common Patterns

### Real-time Updates
- WebSockets for live data
- Server-Sent Events for one-way updates
- Polling for simple cases

### Multi-tenant/Depot
- Always filter by depot_id
- Include depot in cache keys
- Validate depot access

### Feature Flags
```typescript
const FEATURES = {
  NEW_DASHBOARD: process.env.FEATURE_NEW_DASHBOARD === 'true',
  ADVANCED_SEARCH: process.env.FEATURE_ADVANCED_SEARCH === 'true'
}

if (FEATURES.NEW_DASHBOARD) {
  // New implementation
}
```