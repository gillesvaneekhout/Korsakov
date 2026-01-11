---
name: testing-protocol
description: Ensure code quality through appropriate testing strategies and validation
triggers:
  - "write tests"
  - "test this feature"
  - "validate the implementation"
  - "add test coverage"
  - "prepare for QA"
---

# Testing Protocol Skill

## Purpose

Define and implement appropriate testing strategies for Indie Campers applications. Note: Testing infrastructure is currently minimal, so focus on critical paths and manual validation.

## Testing Pyramid

```
        /\         E2E Tests (Manual/Minimal)
       /  \        - Critical user journeys
      /    \       - Multi-depot scenarios
     /------\
    /        \     Integration Tests (API/DB)
   /          \    - API endpoint validation
  /            \   - Database operations
 /--------------\
/                \ Unit Tests (When Critical)
                   - Complex business logic
                   - Utility functions
```

## Manual Testing Checklist

Since automated testing is limited, thorough manual testing is critical:

### Frontend Testing
- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] Responsive breakpoints: 320px, 768px, 1024px, 1440px
- [ ] Dark mode (if applicable)
- [ ] Loading states visible
- [ ] Error states handled
- [ ] Form validation working
- [ ] Accessibility: keyboard navigation

### Backend Testing
- [ ] API endpoints return correct data
- [ ] Error cases return appropriate status codes
- [ ] Database operations succeed
- [ ] Connection failures handled gracefully
- [ ] Rate limiting works (if configured)
- [ ] Authentication/authorization enforced

### Integration Testing
- [ ] Logto SSO flow works
- [ ] Database connections stable
- [ ] AWS services responding (Athena, S3)
- [ ] Cloudflare services working (D1, Vectorize)
- [ ] Third-party APIs integrated correctly

## Writing Tests (When Required)

### API Endpoint Test Example
```typescript
// Manual testing with curl
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"vehicleId": "TEST001", "status": "available"}'

// Expected response
{
  "success": true,
  "data": { "id": "uuid", "vehicleId": "TEST001" }
}
```

### Database Operation Validation
```sql
-- Verify data integrity after operations
SELECT COUNT(*) FROM vehicles WHERE depot_id IS NULL;
-- Should return 0

-- Check foreign key constraints
SELECT * FROM bookings b
LEFT JOIN vehicles v ON b.vehicle_id = v.id
WHERE v.id IS NULL;
-- Should return no orphaned records
```

### Frontend Component Testing
```typescript
// Simple smoke test pattern
// 1. Component renders without crashing
// 2. Props are displayed correctly
// 3. User interactions trigger callbacks
// 4. Error boundaries catch failures
```

## Test Data Management

### Development Data
```typescript
// Create consistent test data
const testData = {
  depots: ['lisbon', 'porto', 'madrid', 'paris'],
  vehicles: Array.from({ length: 10 }, (_, i) => ({
    id: `TEST-${i}`,
    status: i % 2 === 0 ? 'available' : 'booked'
  })),
  users: [
    { email: 'test@indiecampers.com', role: 'admin' },
    { email: 'user@example.com', role: 'customer' }
  ]
}
```

### Data Cleanup
```sql
-- Clean test data after testing
DELETE FROM vehicles WHERE vehicle_id LIKE 'TEST%';
DELETE FROM users WHERE email LIKE '%@example.com';
```

## Performance Testing

### Load Testing Checklist
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms for simple queries
- [ ] Database queries use indexes
- [ ] No N+1 query problems
- [ ] Images optimized and lazy loaded
- [ ] Bundle size reasonable (< 500KB initial)

### Monitoring Queries
```sql
-- Find slow queries in PostgreSQL
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Security Testing

### OWASP Top 10 Checklist
- [ ] SQL Injection: Parameterized queries used
- [ ] XSS: User input sanitized
- [ ] Authentication: Logto SSO properly configured
- [ ] Session Management: Secure cookies
- [ ] CORS: Proper origin restrictions
- [ ] Rate Limiting: Configured on sensitive endpoints
- [ ] Secrets: No hardcoded credentials
- [ ] HTTPS: Enforced in production

## Regression Testing

Before each release:
1. Test all critical user paths
2. Verify previous bugs haven't returned
3. Check integrations still work
4. Validate data migrations succeeded
5. Ensure rollback procedure works

## Documentation of Test Results

Update `docs/ai/current-work.md`:
```markdown
## Test Results

### Manual Testing
- [x] Desktop browsers tested
- [x] Mobile responsive verified
- [x] API endpoints validated
- [x] Database operations checked

### Performance
- Page load: 2.1s
- API response: 320ms avg
- Database queries: All indexed

### Issues Found
- None critical
- Minor: Form validation message unclear (fixed)
```