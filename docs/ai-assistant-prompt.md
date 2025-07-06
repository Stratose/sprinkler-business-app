# AI Assistant Project Briefing Prompt

Use this prompt when starting new conversations about the Sprinkler Business Management App to ensure the AI assistant has complete project context.

---

## Project Context

You are helping develop a **Sprinkler Business Management App** for an independent contractor. This is a 4-week aggressive development sprint to build a single-user MVP with mobile-first design.

### Key Project Information

- **Repository**: https://github.com/Stratose/sprinkler-business-app
- **Current Status**: Week 1 of 4-week development sprint
- **Development Server**: http://localhost:5173
- **Supabase Project**: https://lhrzcnovizsjdmlaphcy.supabase.co

## Required Reading

**CRITICAL**: Before making any architectural or feature decisions, you MUST review these documents:

1. **[Business Requirements Document](./business-requirements.md)** - Contains all business objectives, feature requirements, acceptance criteria, and success metrics
2. **[Technical Requirements Document](./technical-requirements.md)** - Contains technology stack, database schema, API specifications, and security requirements
3. **[Project Documentation README](./README.md)** - Overview of all project documentation

## Current Technology Stack

### Confirmed Architecture (DO NOT CHANGE)

- **Frontend**: Vue 3 + TypeScript + Vite + Pinia
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Mobile**: Capacitor for iOS/Android + PWA
- **Authentication**: Google OAuth 2.0 via Supabase Auth
- **Maps**: Google Maps API
- **Testing**: Playwright for E2E testing
- **Deployment**: Vercel (frontend) + Supabase (backend)

### Database Schema (IMPLEMENTED)

- **customers** - Customer information with GPS coordinates
- **customer_notes** - Notes and documentation per customer
- **appointments** - Scheduled appointments and service calls
- **media_files** - Images and videos with metadata
- **Row Level Security (RLS)** - Fully implemented for user data isolation

## Project Status

### ✅ Completed

- Vue 3 + TypeScript + Capacitor project setup
- Supabase project created and configured
- Database schema implemented with RLS policies
- Environment variables configured (.env setup)
- Git repository initialized and connected to GitHub
- Comprehensive business and technical requirements documented
- Playwright E2E testing framework configured
- GitHub issue templates and project management structure created

### 🔄 In Progress

- Google OAuth authentication implementation
- Basic customer CRUD operations

### ⏳ Upcoming (4-Week Timeline)

- **Week 1**: Foundation (Auth + basic CRUD + UI framework)
- **Week 2**: Core features (Customer management + Maps integration)
- **Week 3**: Advanced features (Notes + Media + Calendar)
- **Week 4**: Polish + Deploy (Mobile optimization + Production)

## Development Environment

### Local Setup

- **Development Server**: `npm run dev` (runs on localhost:5173)
- **Testing**: `npm run test:e2e` (Playwright tests)
- **Build**: `npm run build` (production build)

### Key Files

- **Environment**: `.env` (Supabase + Google Maps API keys)
- **Database Schema**: `database-schema.sql` (applied to Supabase)
- **Main App**: `src/App.vue` + `src/views/HomeView.vue`
- **Supabase Client**: `src/lib/supabase.ts`

## Business Requirements Summary

### Core Features (REQ-001 to REQ-014)

1. **Customer Management**: Full CRUD with contact details and GPS coordinates
2. **Maps Integration**: Google Maps with customer pins and route optimization
3. **Appointment Scheduling**: Calendar-based with reminders and status tracking
4. **Notes & Media**: Rich text notes + photo/video storage (5MB images, 50MB videos)
5. **Authentication**: Google OAuth with secure session management
6. **Mobile Support**: iOS/Android apps + responsive web interface

### Critical Business Rules

- Single-user system initially (no multi-tenant features yet)
- Mobile-first design approach
- Offline capabilities as nice-to-have (not required for MVP)
- No real-time features or push notifications needed initially
- Manual data sync approach (not real-time)

## Technical Constraints

### Performance Requirements

- Mobile app load time < 3 seconds on 4G
- Map rendering < 2 seconds
- Database queries < 500ms average
- Mobile memory usage < 100MB

### Security Requirements

- Google OAuth 2.0 authentication only
- Row Level Security (RLS) for all user data
- HTTPS only for all communications
- Secure environment variable management

## GitHub Project Management

### Issue Templates Available

- **Feature Request**: For new features and enhancements
- **Bug Report**: For reporting issues with reproduction steps
- **Task**: For development tasks and user stories
- **Documentation**: For documentation updates
- **DevOps**: For infrastructure and deployment tasks

### Project Structure

- **Labels**: Priority, type, component, and status labels configured
- **Milestones**: 4-week sprint milestones aligned with development phases
- **Project Board**: Kanban-style board with automated workflows
- **Setup Guide**: Complete instructions in `.github/project-setup.md`

## Important Guidelines

### Decision Making

1. **Always reference business requirements** before proposing features
2. **Stick to the approved technology stack** - no architectural changes without business justification
3. **Prioritize mobile-first** design and performance
4. **Follow the 4-week timeline** - aggressive but achievable scope
5. **Maintain security standards** - RLS policies and authentication required

### Development Approach

- **Feature branches** for all development work
- **Pull requests** with code review required
- **Playwright tests** for all major features
- **Mobile compatibility** verified for all features
- **Performance testing** with each major change

### Communication Style

- **Be specific** about technical implementations
- **Reference requirement IDs** (REQ-001, etc.) when discussing features
- **Provide code examples** with Vue 3 Composition API
- **Consider mobile implications** for all suggestions
- **Maintain aggressive timeline** awareness

## Current Priorities

### Week 1 Focus (Current)

1. **Google OAuth Implementation** - Critical for user authentication
2. **Vercel Deployment Setup** - Required for testing and collaboration
3. **Basic Customer CRUD** - Foundation for all customer features
4. **UI Framework** - Consistent design system

### Next Steps

- Complete Google OAuth integration with Supabase
- Set up automated deployment pipeline
- Build customer management interface
- Integrate Google Maps API

---

## Usage Instructions

Copy this entire prompt and paste it at the start of any new conversation about this project. The AI assistant will then have complete context about the project status, requirements, and technical decisions.

**Last Updated**: December 2024
**Project Phase**: Week 1 of 4-week sprint
**Repository**: https://github.com/Stratose/sprinkler-business-app
