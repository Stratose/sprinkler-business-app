# Technical Requirements Document

## Sprinkler Business Management App

**Project Name:** Sprinkler Business Management App  
**Version:** 1.0  
**Date:** December 2024  
**Author:** Development Team

---

## 1. Technical Overview

This document outlines the technical architecture, technology stack, and implementation requirements for the Sprinkler Business Management App. The system is designed as a modern, mobile-first Progressive Web Application with native mobile capabilities.

## 2. Technology Stack

### 2.1 Frontend Framework

- **Vue.js 3**: Modern reactive framework with Composition API
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Vue Router**: Client-side routing
- **Pinia**: State management

### 2.2 Mobile Development

- **Capacitor**: Cross-platform native runtime
- **Progressive Web App (PWA)**: Web-based mobile experience
- **Responsive Design**: Mobile-first CSS approach

### 2.3 Backend Services

- **Supabase**: Backend-as-a-Service platform
  - PostgreSQL database
  - Authentication service
  - File storage
  - Real-time subscriptions
  - Row Level Security (RLS)

### 2.4 Authentication

- **Google OAuth 2.0**: Primary authentication method
- **Supabase Auth**: Session management and user context

### 2.5 Maps and Location

- **Google Maps API**: Interactive maps and geocoding
- **Geolocation API**: Browser-based location services
- **Google Places API**: Address validation and autocomplete

### 2.6 Development Tools

- **ESLint**: Code linting and style enforcement
- **Playwright**: End-to-end testing framework
- **Git**: Version control
- **GitHub**: Repository hosting and CI/CD

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Browser   │    │   PWA Install   │
│   (iOS/Android) │    │   (All Devices) │    │   (Desktop)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Vue.js App    │
                    │   (Frontend)    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supabase      │
                    │   (Backend)     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Database)    │
                    └─────────────────┘
```

### 3.2 Component Architecture

- **Views**: Page-level components (HomeView, CustomerView, etc.)
- **Components**: Reusable UI components
- **Composables**: Vue composition functions for shared logic
- **Stores**: Pinia stores for state management
- **Services**: API interaction layers

### 3.3 Data Flow

1. User interaction triggers component method
2. Component calls store action
3. Store action makes API call to Supabase
4. Supabase returns data with RLS filtering
5. Store updates reactive state
6. Component re-renders with new data

## 4. Database Schema

### 4.1 Tables Overview

- **customers**: Customer information and contact details
- **customer_notes**: Notes and documentation per customer
- **appointments**: Scheduled appointments and service calls
- **media_files**: Images and videos with metadata

### 4.2 Detailed Schema

#### customers

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### customer_notes

```sql
CREATE TABLE customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### appointments

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'scheduled',
    appointment_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### media_files

```sql
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.3 Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example RLS policy for customers table
CREATE POLICY "Users can only access their own customers"
ON customers FOR ALL
USING (auth.uid() = user_id);
```

### 4.4 Indexes

Performance indexes on frequently queried fields:

```sql
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_coordinates ON customers(latitude, longitude);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
```

## 5. API Specifications

### 5.1 Supabase Client Configuration

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 5.2 Authentication API

```typescript
// Google OAuth login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: window.location.origin,
  },
});

// Get current user
const {
  data: { user },
} = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

### 5.3 Customer Data API

```typescript
// Get all customers
const { data, error } = await supabase
  .from("customers")
  .select("*")
  .order("name");

// Create customer
const { data, error } = await supabase.from("customers").insert([
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    address: "123 Main St",
    latitude: 40.7128,
    longitude: -74.006,
  },
]);

// Update customer
const { data, error } = await supabase
  .from("customers")
  .update({ phone: "555-5678" })
  .eq("id", customerId);
```

### 5.4 Google Maps API Integration

```typescript
// Initialize map
const map = new google.maps.Map(mapElement, {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 10,
});

// Add customer markers
customers.forEach((customer) => {
  new google.maps.Marker({
    position: { lat: customer.latitude, lng: customer.longitude },
    map: map,
    title: customer.name,
  });
});

// Geocode address
const geocoder = new google.maps.Geocoder();
geocoder.geocode({ address: customerAddress }, (results, status) => {
  if (status === "OK") {
    const location = results[0].geometry.location;
    // Save coordinates to database
  }
});
```

## 6. Security Requirements

### 6.1 Authentication Security

- **OAuth 2.0**: Secure token-based authentication
- **Session Management**: Automatic token refresh
- **Secure Storage**: Tokens stored in secure browser storage
- **HTTPS Only**: All communications encrypted

### 6.2 Database Security

- **Row Level Security**: User data isolation
- **API Key Management**: Secure environment variable storage
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **Data Encryption**: At-rest and in-transit encryption

### 6.3 File Storage Security

- **Bucket Policies**: Restricted file access
- **File Size Limits**: Prevent abuse with size restrictions
- **File Type Validation**: Accept only specific media types
- **Virus Scanning**: Automated malware detection

## 7. Performance Requirements

### 7.1 Loading Performance

- **Initial Load**: < 3 seconds on 4G connection
- **Subsequent Navigation**: < 1 second
- **Map Rendering**: < 2 seconds
- **Database Queries**: < 500ms average

### 7.2 Mobile Performance

- **Memory Usage**: < 100MB on mobile devices
- **Battery Optimization**: Efficient background processing
- **Offline Caching**: Strategic data caching
- **Image Optimization**: Automatic compression

### 7.3 Scalability

- **Database**: PostgreSQL with proper indexing
- **CDN**: Supabase global edge network
- **Caching**: Browser and service worker caching
- **API Rate Limiting**: Supabase built-in protection

## 8. Development Environment

### 8.1 Local Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:e2e

# Build for production
npm run build
```

### 8.2 Environment Variables

```bash
# .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 8.3 Testing Strategy

- **Unit Tests**: Vue Test Utils for component testing
- **E2E Tests**: Playwright for full user journey testing
- **Manual Testing**: Cross-browser and device testing
- **Performance Testing**: Lighthouse audits

## 9. Deployment Architecture

### 9.1 Hosting Platform

- **Vercel**: Frontend hosting with automatic deployments
- **Supabase**: Backend hosting with global edge network
- **GitHub**: Source code repository and CI/CD triggers

### 9.2 Build Process

1. Code pushed to GitHub
2. Vercel automatically builds and deploys
3. Environment variables injected
4. Static assets optimized and cached
5. Application available at production URL

### 9.3 Mobile App Distribution

- **iOS**: Apple App Store (via Capacitor)
- **Android**: Google Play Store (via Capacitor)
- **Web**: Direct browser access and PWA installation

## 10. Monitoring and Analytics

### 10.1 Error Tracking

- **Supabase Logs**: Database and auth error monitoring
- **Browser Console**: Client-side error tracking
- **Performance Monitoring**: Core Web Vitals tracking

### 10.2 Usage Analytics

- **User Behavior**: Page views and feature usage
- **Performance Metrics**: Load times and conversion rates
- **Mobile Analytics**: App usage patterns and crashes

## 11. Maintenance and Updates

### 11.1 Version Control

- **Git Workflow**: Feature branches and pull requests
- **Semantic Versioning**: Consistent version numbering
- **Release Notes**: Documented changes and improvements

### 11.2 Dependency Management

- **Regular Updates**: Monthly security and feature updates
- **Testing**: Automated testing before deployment
- **Rollback Strategy**: Quick revert capability

### 11.3 Backup and Recovery

- **Database Backups**: Daily automated backups via Supabase
- **File Storage**: Redundant storage across regions
- **Version Control**: Complete code history preservation

---

_This document serves as the technical foundation for development and should be updated as the architecture evolves._
