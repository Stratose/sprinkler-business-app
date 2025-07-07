# Testing Directory Structure

This directory contains all testing-related files for the sprinkler business app.

## 📁 Directory Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth-flow.spec.ts   # Authentication flow tests
│   └── supabase-connection.spec.ts # Database connection tests
├── assets/                 # Test fixtures and images
│   ├── auth-redirect-test.png
│   ├── dev-auth-options.png
│   ├── login-mobile.png
│   ├── login-page.png
│   ├── auth-callback.png
│   └── connection-test.png
├── config/                 # Test configuration files
│   └── tsconfig.test.json  # TypeScript config for tests
├── test-results/           # Generated test results (ignored by git)
└── playwright-report/      # Generated test reports (ignored by git)
```

## 🧪 Test Types

### End-to-End Tests (e2e/)

- **auth-flow.spec.ts**: Tests authentication flows including Google OAuth and development login
- **supabase-connection.spec.ts**: Tests database connectivity and basic operations

### Test Assets (assets/)

- Screenshot fixtures and reference images
- Test data files
- Mock assets for testing

### Configuration (config/)

- TypeScript configuration for test files
- Test environment configuration
- Test utilities and helpers

## 🚀 Running Tests

### All Tests

```bash
npm run test:e2e
```

### With UI (Interactive)

```bash
npm run test:ui
```

### With Browser (Headed)

```bash
npm run test:headed
```

## 📊 Test Reports

Test results are automatically generated in:

- `test-results/` - Raw test results and artifacts
- `playwright-report/` - HTML report (open `playwright-report/index.html`)

## 🔧 Adding New Tests

1. Create test files in `tests/e2e/` with `.spec.ts` extension
2. Add test assets to `tests/assets/` if needed
3. Update this README when adding new test categories

## 📝 Test Conventions

- Use descriptive test names
- Group related tests in describe blocks
- Add screenshots for visual tests
- Include error handling tests
- Test both success and failure scenarios

## 🏗️ Future Expansion

This structure is prepared for additional test types:

- Unit tests (future: `tests/unit/`)
- Integration tests (future: `tests/integration/`)
- Performance tests (future: `tests/performance/`)
- Visual regression tests (future: `tests/visual/`)
