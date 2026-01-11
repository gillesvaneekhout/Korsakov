# Indie Campers Project Overview

## Company Mission
Indie Campers is Europe's leading campervan marketplace, connecting travelers with unique road trip experiences across multiple countries and depots.

## Digital Products

### Customer-Facing
- **Website** (`fe-indie-next`): Next.js 15 booking platform
- **Mobile Apps**: iOS/Android applications for bookings and trip management

### Internal Tools
- **Fleet Dashboard** (`indiecampers.io-fleet`): Real-time vehicle tracking and management
- **MyIndiePulse** (`indiecampers.io-myindiepulse`): Employee engagement and pulse surveys
- **Aires** (`indiecampers.io-aires`): AI-powered idea management via Slack

### Data & Analytics
- **Data Engineering**: ETL pipelines and data processing
- **Business Intelligence**: KPI dashboards and reporting
- **Machine Learning**: Demand forecasting and pricing optimization

## Key Business Concepts

### Multi-Depot Operations
Indie Campers operates from multiple depot locations across Europe:
- Each depot has its own vehicle fleet
- Bookings can be one-way between depots
- Depot-specific pricing and availability
- Local team management per depot

### Vehicle Lifecycle
1. **Acquisition**: New vehicles added to fleet
2. **Availability**: Listed for customer bookings
3. **Booking**: Reserved by customers
4. **Preparation**: Cleaned and checked
5. **Handover**: Customer pickup
6. **Return**: Vehicle check-in
7. **Maintenance**: Regular service and repairs
8. **Decommission**: End of fleet life

### Customer Journey
1. **Discovery**: SEO, marketing, referrals
2. **Search**: Find available vehicles
3. **Booking**: Reserve and pay
4. **Pre-trip**: Documentation and preparation
5. **Pickup**: Depot handover
6. **Road Trip**: Customer support during trip
7. **Return**: Check-in and feedback
8. **Post-trip**: Reviews and loyalty

## Technology Philosophy

### Principles
- **Cloud-Native**: Leverage managed services (Cloudflare, AWS, Supabase)
- **API-First**: All functionality exposed via APIs
- **Mobile-Responsive**: Desktop and mobile parity
- **Data-Driven**: Analytics inform all decisions
- **Security-First**: SSO, encryption, compliance

### Preferred Patterns
- Server-side rendering for SEO
- Edge computing for performance
- Micro-frontends for team autonomy
- Event-driven architecture for scalability
- Infrastructure as Code for repeatability

## Success Metrics

### Business KPIs
- Booking conversion rate
- Fleet utilization percentage
- Customer satisfaction (NPS)
- Revenue per vehicle
- Operational efficiency

### Technical KPIs
- Page load time < 3 seconds
- API response time < 500ms
- System uptime > 99.9%
- Deploy frequency > daily
- Mean time to recovery < 1 hour

## Stakeholders

### Business Teams
- **Product**: Feature prioritization and requirements
- **Operations**: Depot management and logistics
- **Marketing**: Customer acquisition and retention
- **Finance**: Revenue optimization and reporting
- **Customer Success**: Support and satisfaction

### Technical Teams
- **Engineering**: Development and deployment
- **Data**: Analytics and insights
- **DevOps**: Infrastructure and reliability
- **Security**: Compliance and protection

## Current Initiatives

### Strategic Projects
- Fleet expansion across new markets
- Dynamic pricing optimization
- Mobile app enhancement
- Operational automation
- Data warehouse modernization

### Technical Improvements
- Migration to Next.js 15 App Router
- Unified authentication (Logto SSO)
- Real-time fleet tracking
- API standardization
- Observability enhancement

## Constraints & Considerations

### Technical Debt
- Legacy systems being migrated
- Limited test coverage
- Manual deployment processes
- Inconsistent error handling

### Compliance Requirements
- GDPR for customer data
- PCI DSS for payments
- Local regulations per country
- Accessibility standards (WCAG)

### Scaling Challenges
- Seasonal demand fluctuations
- Multi-language support
- Cross-depot inventory management
- Real-time data synchronization