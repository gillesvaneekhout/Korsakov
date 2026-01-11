# Working Agreements

## Development Workflow

### Git Conventions

#### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch (if used)
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Production emergencies

#### Commit Messages
Follow conventional commits:
```
feat: Add vehicle search to fleet dashboard
fix: Resolve timeout in Athena queries
refactor: Extract auth middleware
docs: Update API documentation
test: Add booking flow tests
chore: Update dependencies
```

#### Pull Request Guidelines
- **Size**: Keep PRs under 400 lines when possible
- **Focus**: One concern per PR
- **Description**: Use PR template
- **Review**: Request from relevant team members
- **Merge**: Squash and merge preferred

### Code Standards

#### TypeScript
- **Strict Mode**: Always enabled
- **No `any`**: Use `unknown` or proper types
- **Interfaces**: Prefer over type aliases for objects
- **Async/Await**: Over promises chains
- **Early Returns**: Reduce nesting

#### React/Next.js
- **Server Components**: Default choice
- **Client Components**: Only when needed (interactivity)
- **Data Fetching**: Server-side preferred
- **Error Boundaries**: Wrap feature components
- **Accessibility**: WCAG 2.1 AA compliance

#### Database
- **Migrations**: Always versioned
- **Queries**: Always parameterized
- **Transactions**: For multi-table operations
- **Indexes**: For all foreign keys and filters
- **Soft Deletes**: Prefer over hard deletes

### Deployment Process

#### Pre-Deployment Checklist
- [ ] Code review completed
- [ ] Manual testing passed
- [ ] Database migrations ready
- [ ] Environment variables documented
- [ ] Feature flags configured
- [ ] Rollback plan prepared

#### Deployment Steps
1. Database migrations first
2. Deploy backend/API changes
3. Deploy frontend changes
4. Verify health checks
5. Run smoke tests
6. Monitor metrics

#### Rollback Criteria
- Error rate > 5%
- Response time > 2x normal
- Critical functionality broken
- Database corruption
- Security vulnerability

### Communication

#### Async First
- Use Slack threads for discussions
- Document decisions in writing
- Record important meetings
- Respect different time zones

#### Documentation
- **Code Comments**: For non-obvious logic
- **README**: Keep updated
- **API Docs**: OpenAPI/Swagger when possible
- **Architecture Decisions**: Document in ADRs

#### Code Reviews
- **Response Time**: Within 24 hours
- **Tone**: Constructive and respectful
- **Focus**: Correctness, performance, security, maintainability
- **Approval**: At least one approval required

### Security Practices

#### Never Commit
- Passwords or API keys
- `.env` files with real values
- Customer data
- Internal URLs or IPs

#### Always Do
- Validate all inputs
- Sanitize user content
- Use HTTPS in production
- Implement rate limiting
- Log security events

### Performance Standards

#### Frontend
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 500KB initial
- Images: Optimized and lazy loaded

#### Backend
- API Response: < 500ms median
- Database Queries: < 100ms
- Memory Usage: < 512MB
- CPU Usage: < 80%

### Testing Expectations

#### What to Test
- Business logic
- API endpoints
- Data validation
- Error handling
- Edge cases

#### Testing Priority
1. Critical user paths
2. Payment/booking flows
3. Data integrity
4. Security boundaries
5. Performance bottlenecks

### Multi-Depot Considerations

#### Always Remember
- Filter by `depot_id` in queries
- Include depot in cache keys
- Test with multiple depots
- Consider timezone differences
- Validate depot access permissions

### On-Call Responsibilities

#### If You Deploy, You Support
- Monitor post-deployment
- Be available for rollback
- Document any issues
- Hand over to next person

#### Incident Response
1. Acknowledge alert
2. Assess severity
3. Communicate status
4. Fix or rollback
5. Post-mortem for P0/P1

### Continuous Improvement

#### Retrospectives
- After major releases
- After incidents
- Monthly team check-ins

#### Technical Debt
- Document as you create it
- Allocate 20% time to address
- Prioritize security and performance debt

#### Learning & Growth
- Share knowledge via demos
- Document learnings
- Pair programming encouraged
- Conference/course budget available

## Team Norms

### Core Hours
- 10:00 - 16:00 (local time)
- Meetings scheduled within core hours
- Flexible outside core hours

### Communication Response Times
- Urgent (P0): Within 15 minutes
- Important (P1): Within 2 hours
- Normal (P2): Within 24 hours
- Low (P3): Within 48 hours

### Definition of Done
- [ ] Code complete and reviewed
- [ ] Tests written (when applicable)
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Acceptance criteria met
- [ ] Performance validated
- [ ] Security checked