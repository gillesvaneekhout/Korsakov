---
name: observability-and-tracking
description: Add logging, monitoring, and analytics tracking to ensure system observability
triggers:
  - "add monitoring"
  - "implement logging"
  - "track this event"
  - "add analytics"
  - "debug this issue"
---

# Observability and Tracking Skill

## Purpose

Ensure systems are observable, debuggable, and provide insights into user behavior and system health.

## Logging Strategy

### Log Levels
```typescript
// Use appropriate log levels
console.error('Critical error:', error)  // System failures
console.warn('Warning:', message)        // Potential issues
console.info('Info:', data)              // Important events
console.debug('Debug:', details)         // Development only

// Production-safe logging
if (process.env.NODE_ENV === 'development') {
  console.debug('Detailed debug info:', data)
}
```

### Structured Logging Pattern
```typescript
// Create consistent log format
function log(level: string, message: string, data?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
    // Add context
    depot: process.env.DEPOT_ID,
    service: 'fleet-dashboard',
    version: process.env.APP_VERSION
  }
  console.log(JSON.stringify(logEntry))
}

// Usage
log('info', 'Vehicle updated', {
  vehicleId: vehicle.id,
  previousStatus: oldStatus,
  newStatus: newStatus,
  userId: user.id
})
```

## Error Tracking

### Error Boundary (React)
```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error('React error boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }
}
```

### API Error Handling
```typescript
// Centralized error handler
export function handleApiError(error: unknown, context: string) {
  const errorDetails = {
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
  }

  if (error instanceof Error) {
    console.error('API Error:', {
      ...errorDetails,
      message: error.message,
      stack: error.stack
    })
  } else {
    console.error('Unknown error:', { ...errorDetails, error })
  }

  // Return user-friendly message
  return 'An error occurred. Please try again.'
}
```

## Analytics Events

### Event Structure
```typescript
interface AnalyticsEvent {
  event_name: string
  properties: {
    category: string      // Feature area
    action: string        // User action
    label?: string        // Additional context
    value?: number        // Numeric value
    // Business context
    user_id?: string
    depot_id?: string
    vehicle_id?: string
    booking_id?: string
    // Technical context
    screen_name?: string
    component?: string
    error_code?: string
  }
  timestamp: string
}
```

### Common Events to Track
```typescript
// Page views
trackEvent({
  event_name: 'page_view',
  properties: {
    category: 'navigation',
    action: 'view',
    screen_name: '/fleet/dashboard'
  }
})

// User interactions
trackEvent({
  event_name: 'vehicle_search',
  properties: {
    category: 'fleet',
    action: 'search',
    label: searchQuery,
    value: resultsCount
  }
})

// Errors
trackEvent({
  event_name: 'error_occurred',
  properties: {
    category: 'error',
    action: errorType,
    error_code: error.code,
    component: 'VehicleList'
  }
})

// Performance
trackEvent({
  event_name: 'slow_query',
  properties: {
    category: 'performance',
    action: 'database',
    label: queryName,
    value: queryTime // milliseconds
  }
})
```

## Performance Monitoring

### Frontend Performance
```typescript
// Measure component render time
const measurePerformance = (componentName: string) => {
  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const renderTime = endTime - startTime

    if (renderTime > 100) { // Log slow renders
      console.warn(`Slow render: ${componentName}`, {
        renderTime: `${renderTime.toFixed(2)}ms`
      })
    }
  }
}

// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  console.info('Web Vital:', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Backend Performance
```typescript
// API route timing
export async function GET(request: Request) {
  const timer = Date.now()

  try {
    const result = await processRequest()

    const duration = Date.now() - timer
    console.info('API request completed', {
      path: request.url,
      duration: `${duration}ms`,
      status: 'success'
    })

    return Response.json(result)
  } catch (error) {
    const duration = Date.now() - timer
    console.error('API request failed', {
      path: request.url,
      duration: `${duration}ms`,
      error: error.message
    })
    throw error
  }
}
```

## Database Query Monitoring

```typescript
// Log slow queries
async function monitoredQuery(sql: string, params: any[]) {
  const startTime = Date.now()

  try {
    const result = await db.query(sql, params)
    const duration = Date.now() - startTime

    if (duration > 1000) { // Log queries over 1 second
      console.warn('Slow query detected', {
        duration: `${duration}ms`,
        query: sql.substring(0, 100) // First 100 chars
      })
    }

    return result
  } catch (error) {
    console.error('Query failed', {
      query: sql.substring(0, 100),
      error: error.message
    })
    throw error
  }
}
```

## Health Checks

### API Health Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  }

  // Check database
  try {
    await db.query('SELECT 1')
    health.checks.database = 'ok'
  } catch (error) {
    health.status = 'unhealthy'
    health.checks.database = 'failed'
  }

  // Check external services
  try {
    await fetch(process.env.LOGTO_ENDPOINT)
    health.checks.auth = 'ok'
  } catch (error) {
    health.status = 'degraded'
    health.checks.auth = 'failed'
  }

  return Response.json(health)
}
```

## Debug Helpers

```typescript
// Development-only debug utilities
export function debugLog(label: string, data: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 DEBUG [${label}]:`, data)
  }
}

// Conditional debugging
const DEBUG_FLAGS = {
  database: process.env.DEBUG_DATABASE === 'true',
  api: process.env.DEBUG_API === 'true',
  auth: process.env.DEBUG_AUTH === 'true'
}

export function debugCategory(category: keyof typeof DEBUG_FLAGS, message: string, data?: any) {
  if (DEBUG_FLAGS[category]) {
    console.debug(`[${category.toUpperCase()}] ${message}`, data)
  }
}
```

## Dashboard Metrics

Key metrics to track:
- Request rate and latency
- Error rate by endpoint
- Database query performance
- User activity patterns
- Feature adoption rates
- System resource usage
- Business KPIs (bookings, revenue, utilization)