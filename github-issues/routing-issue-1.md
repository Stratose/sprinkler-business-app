# Issue Title: Fix post-login routing and navigation flow

## Issue Type

**Task - Bug Fix**

## Priority

**High** - Affects core user experience in production

## Component

**Authentication & Routing**

## Description

After successful authentication (both Google OAuth and development login), users are experiencing inconsistent routing behavior. The app may not properly redirect to the dashboard or may get stuck in loading states.

## Current Behavior

- Users authenticate successfully via Google OAuth
- Authentication state is set correctly in the store
- Navigation doesn't consistently redirect to dashboard (`/`)
- Sometimes users remain on login page despite being authenticated
- Route guards may not be properly detecting authentication state changes

## Expected Behavior

- After successful authentication, users should be immediately redirected to dashboard
- Authentication state should be properly detected by route guards
- No loading state "limbo" between auth completion and dashboard display
- Consistent behavior between Google OAuth and development authentication

## Steps to Reproduce

1. Visit deployed app URL
2. Click "Continue with Google"
3. Complete OAuth flow
4. Observe navigation after returning to app
5. Note any inconsistencies or failures to redirect

## Technical Details

**Files Involved:**

- `src/router/index.ts` - Route guards and authentication logic
- `src/stores/auth.ts` - Authentication state management
- `src/components/AuthLogin.vue` - Login component navigation
- `src/views/AuthCallback.vue` - OAuth callback handler
- `src/App.vue` - Main app router and auth initialization

**Likely Root Causes:**

- Race condition between auth state update and route guard execution
- Timing issues in `router.beforeEach` guard
- OAuth callback not properly triggering navigation
- Authentication state not properly propagating to route guards

## Acceptance Criteria

- [ ] Google OAuth flow redirects to dashboard immediately after authentication
- [ ] Development authentication redirects properly
- [ ] Route guards correctly detect authentication state changes
- [ ] No infinite loading states or navigation loops
- [ ] Consistent behavior across all authentication methods
- [ ] Manual URL navigation works correctly for authenticated users

## Technical Approach

1. **Debug authentication state timing** - Add logging to track state changes
2. **Review route guard logic** - Ensure proper async handling in `beforeEach`
3. **Optimize callback handling** - Improve OAuth callback redirect logic
4. **Add state synchronization** - Ensure auth store and router are properly synchronized
5. **Test edge cases** - Handle network delays and state transitions

## Effort Estimate

**Medium (4-6 hours)**

- Investigation and debugging: 2 hours
- Implementation of fixes: 2-3 hours
- Testing and validation: 1-2 hours

## Labels

- `bug`
- `priority:high`
- `component:auth`
- `component:routing`
- `status:ready`

## Linked Issues

Related to overall authentication system improvements and user experience optimization.

## Notes

This is a critical issue affecting the production user experience. Should be prioritized for next development session.
