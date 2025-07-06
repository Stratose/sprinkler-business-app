# Issue Title: Optimize OAuth callback flow and redirect handling

## Issue Type

**Task - Enhancement**

## Priority

**Medium** - Affects Google OAuth user experience

## Component

**Authentication & OAuth**

## Description

The OAuth callback handling in `/auth/callback` route could be improved to provide a smoother user experience and better error handling during the Google authentication flow.

## Current Behavior

- OAuth callback shows a loading screen for 2+ seconds
- Hard-coded timeout before redirect attempt
- Limited error handling for failed OAuth callbacks
- Generic loading message doesn't reflect actual OAuth processing

## Expected Behavior

- Immediate processing of OAuth callback
- Intelligent redirect based on actual authentication state
- Proper error handling with user-friendly messages
- Faster transition from callback to dashboard

## Technical Details

**Files Involved:**

- `src/views/AuthCallback.vue` - OAuth callback handler
- `src/stores/auth.ts` - Authentication state management
- `src/router/index.ts` - Route navigation logic

**Current Implementation:**

```vue
// AuthCallback.vue - Current approach onMounted(async () => { // Fixed 2-second
delay await new Promise(resolve => setTimeout(resolve, 2000)) if
(authStore.isAuthenticated) { router.push('/') } else { router.push('/login') }
})
```

**Improvement Opportunities:**

- Remove arbitrary timeout delays
- Listen for actual authentication state changes
- Add proper error handling for OAuth failures
- Improve loading state messaging

## Acceptance Criteria

- [ ] OAuth callback processes immediately without arbitrary delays
- [ ] Proper error handling for OAuth failures (expired tokens, canceled flows, etc.)
- [ ] Loading state reflects actual processing status
- [ ] Redirect happens as soon as authentication state is determined
- [ ] Error messages guide users on next steps
- [ ] Maintains compatibility with Supabase OAuth flow

## Technical Approach

1. **Remove fixed timeouts** - Listen for auth state changes instead
2. **Add OAuth error handling** - Detect and handle OAuth errors from URL params
3. **Improve loading states** - Show actual processing status
4. **Add retry mechanisms** - Handle temporary network issues
5. **Enhance user feedback** - Better messaging during OAuth processing

## OAuth Error Scenarios to Handle

- User cancels OAuth flow
- Invalid or expired OAuth tokens
- Network connectivity issues
- Supabase service unavailable
- Invalid OAuth configuration

## Effort Estimate

**Small (2-3 hours)**

- Analysis and design: 30 minutes
- Implementation: 1-2 hours
- Testing with OAuth flows: 30 minutes

## Labels

- `enhancement`
- `priority:medium`
- `component:auth`
- `component:oauth`
- `status:ready`

## Testing Requirements

- [ ] Test successful OAuth flow
- [ ] Test canceled OAuth flow
- [ ] Test OAuth with network issues
- [ ] Test OAuth error scenarios
- [ ] Verify loading states are appropriate

## Success Metrics

- OAuth callback processing time reduced by >50%
- Zero reports of OAuth timeout issues
- Proper error handling for all OAuth edge cases

## Related Documentation

- Supabase Auth documentation for OAuth flows
- Vue Router navigation guards
- Error handling best practices

## Notes

This enhancement will significantly improve the perceived performance of the Google OAuth flow and provide better error handling for edge cases.
