# 🌊 Sprinkler Business Management App

A modern, mobile-first business management application for independent sprinkler contractors built with Vue 3, TypeScript, and Supabase.

## 🚀 Project Status

- ✅ **Production Deployed** - Live on Vercel
- ✅ **Authentication System** - Google OAuth + Development mode
- ✅ **Database Schema** - Complete with RLS policies
- ✅ **Testing Framework** - Playwright E2E tests
- ✅ **Project Management** - GitHub Issues and project boards
- 🔄 **Current Focus** - Routing fixes and customer management

## 📁 Project Structure

```
sprinkler-business-app/
├── src/                    # Vue 3 frontend application
│   ├── components/         # Vue components
│   ├── views/             # Page components
│   ├── stores/            # Pinia state management
│   ├── router/            # Vue Router configuration
│   ├── assets/            # Static assets
│   └── lib/               # Utility libraries
├── tests/                 # Testing framework
│   ├── e2e/              # End-to-end tests
│   ├── assets/           # Test fixtures and images
│   └── config/           # Test configuration
├── database/             # Database schema and migrations
│   └── schema.sql        # Main database schema
├── docs/                 # Complete project documentation
│   ├── business-requirements.md
│   ├── technical-requirements.md
│   ├── project-manager-setup.md
│   └── ...
├── tools/                # Development tools and utilities
│   ├── scripts/          # Automation scripts
│   └── github-issues/    # Issue templates
├── .github/              # GitHub workflows and templates
└── public/               # Static public assets
```

## 🛠️ Technology Stack

- **Frontend**: Vue 3, TypeScript, Vite
- **Mobile**: Capacitor (iOS/Android)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Testing**: Playwright
- **State Management**: Pinia
- **Routing**: Vue Router

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub CLI (for issue management)

### Installation

```bash
# Clone the repository
git clone https://github.com/Stratose/sprinkler-business-app.git
cd sprinkler-business-app

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Start development server
npm run dev
```

### Testing

```bash
# Run E2E tests
npm run test:e2e

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run type-check      # TypeScript type checking
npm run lint            # ESLint code linting

# Testing
npm run test:e2e        # Run E2E tests
npm run test:ui         # Interactive test UI
npm run test:headed     # Run tests with browser

# Tools
./tools/scripts/create-github-issues.sh        # Create GitHub issues
./tools/scripts/setup-project-management.sh    # Setup project management
```

## 📚 Documentation

### Project Documentation

- **[Business Requirements](docs/business-requirements.md)** - Project goals and features
- **[Technical Requirements](docs/technical-requirements.md)** - Architecture and implementation
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Complete progress overview
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

### Management Documentation

- **[Project Manager Setup](docs/project-manager-setup.md)** - Non-technical project management
- **[Project Manager Onboarding](docs/project-manager-onboarding.md)** - 15-minute quick start

### Development Documentation

- **[GitHub Issues Cheatsheet](tools/scripts/github-issue-cheatsheet.md)** - Issue management guide
- **[Testing Guide](tests/README.md)** - Testing framework documentation
- **[Database Schema](database/README.md)** - Database structure and operations

## 🎯 Current Milestones

### Week 1 - Authentication & Routing Fixes

- [x] Google OAuth authentication
- [x] Development authentication mode
- [x] Production deployment
- [ ] Post-login routing fixes ([Issue #1](https://github.com/Stratose/sprinkler-business-app/issues/1))
- [ ] Authentication state timing ([Issue #2](https://github.com/Stratose/sprinkler-business-app/issues/2))

### Week 2 - Customer Management

- [ ] Customer CRUD operations
- [ ] Google Maps integration
- [ ] Notes and media upload system

## 🔗 Important Links

- **Production App**: [Deployed on Vercel](https://sprinkler-business-app.vercel.app)
- **GitHub Issues**: [Project Issues](https://github.com/Stratose/sprinkler-business-app/issues)
- **Supabase Project**: [Database Dashboard](https://lhrzcnovizsjdmlaphcy.supabase.co)
- **GitHub Repository**: [Source Code](https://github.com/Stratose/sprinkler-business-app)

## 🏗️ Architecture

### Frontend Architecture

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Vue Router** for navigation
- **Capacitor** for mobile apps

### Backend Architecture

- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security
- **Google OAuth** for authentication
- **Real-time subscriptions** for live updates

### Deployment Architecture

- **Vercel** for web deployment
- **GitHub Actions** for CI/CD
- **Capacitor** for mobile app builds
- **Environment-based configuration**

## 🤝 Contributing

1. **Check existing issues** in GitHub Issues
2. **Create new issues** using templates in `tools/github-issues/`
3. **Follow the project structure** when adding new features
4. **Run tests** before submitting changes
5. **Update documentation** for new features

## 📱 Mobile Development

```bash
# Build for mobile
npm run build

# Add mobile platforms
npx cap add ios
npx cap add android

# Sync with mobile
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

## 🔒 Security

- **Row Level Security** enabled on all database tables
- **OAuth authentication** with Google
- **Environment variables** for sensitive data
- **HTTPS** enforced in production
- **API key rotation** supported

## 📊 Performance

- **Bundle size**: 213KB (gzipped: 69.56KB)
- **Build time**: <1 second locally
- **Lighthouse score**: Optimized for performance
- **Mobile-first** responsive design

## 🎉 Acknowledgments

- **Vue.js** team for the excellent framework
- **Supabase** for the backend infrastructure
- **Vercel** for hosting and deployment
- **Playwright** for testing framework

---

**Status**: ✅ Phase 1 Complete - Ready for Customer Management Development
**Next Milestone**: Week 2 - Customer Management Interface
