# Issue Title: Improve authentication state timing and route protection

## Issue Type

**Task - Enhancement**

## Priority

**Medium** - Affects user experience and edge cases

## Component

**Authentication & Routing**

## Description

The route protection system has timing issues where authentication state changes aren't immediately reflected in route guards, causing inconsistent access control and user experience problems.

## Current Behavior

- Route guards sometimes evaluate before authentication state is fully loaded
- Users may see brief flashes of login page even when authenticated
- Manual URL navigation may not work correctly during state transitions
- Loading states don't properly indicate authentication checking

## Expected Behavior

- Route guards wait for authentication state to be fully determined
- Smooth transitions between authenticated and unauthenticated states
- Proper loading indicators during authentication state resolution
- Consistent route protection regardless of navigation method

## Technical Details

**Files Involved:**

- `src/router/index.ts` - Route guard implementation
- `src/stores/auth.ts` - Authentication state management
- `src/App.vue` - Authentication initialization

**Current Implementation Issues:**

```typescript
// Current problematic pattern in router/index.ts
router.beforeEach(async (to) => {
  // May execute before auth.initialize() completes
  if (authStore.loading) {
    // This waiting mechanism may not be robust enough
  }
});
```

**Root Causes:**

- Race condition between `auth.initialize()` and route navigation
- Insufficient waiting mechanism for auth state resolution
- Lack of proper loading state propagation to route guards

## Acceptance Criteria

- [ ] Route guards never evaluate on incomplete authentication state
- [ ] Loading states properly reflect authentication checking
- [ ] No flash of incorrect content during state transitions
- [ ] Manual URL navigation works consistently
- [ ] Proper error handling for authentication failures
- [ ] Performance remains optimal (no unnecessary delays)

## Technical Approach

1. **Implement authentication state promises** - Route guards wait for auth resolution
2. **Add proper loading state management** - Show loading UI during auth checks
3. **Improve state synchronization** - Better coordination between store and router
4. **Add comprehensive logging** - Debug timing issues
5. **Implement fallback mechanisms** - Handle edge cases gracefully

## Effort Estimate

**Medium (3-5 hours)**

- Analysis and design: 1-2 hours
- Implementation: 2-3 hours
- Testing: 1 hour

## Labels

- `enhancement`
- `priority:medium`
- `component:auth`
- `component:routing`
- `status:ready`

## Related Files

```
src/router/index.ts
src/stores/auth.ts
src/App.vue
tests/auth-flow.spec.ts
```

## Success Metrics

- All authentication timing tests pass
- No user reports of authentication state inconsistencies
- Smooth user experience during state transitions

## Notes

This issue is related to the post-login routing problem but focuses specifically on the underlying authentication state timing mechanisms.
