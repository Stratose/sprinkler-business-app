# Issue Title: Improve loading states and user feedback during authentication

## Issue Type

**Task - Enhancement**

## Priority

**Low** - User experience improvement

## Component

**User Interface & Authentication**

## Description

The current loading states during authentication flows could be improved to provide better user feedback and reduce perceived wait times.

## Current Behavior

- Generic loading messages throughout authentication flow
- No progress indicators during OAuth processing
- Loading states don't differentiate between different types of processing
- Users may be unsure if the app is working properly during longer waits

## Expected Behavior

- Specific loading messages for different authentication stages
- Visual progress indicators where appropriate
- Clear feedback about what's happening behind the scenes
- Consistent loading state design across all authentication flows

## Technical Details

**Files Involved:**

- `src/views/AuthCallback.vue` - OAuth callback loading
- `src/components/AuthLogin.vue` - Login button loading states
- `src/stores/auth.ts` - Authentication state management
- `src/App.vue` - Initial authentication loading

**Current Loading States:**

1. **Initial app load**: Generic "Loading..." in App.vue
2. **Login button**: Basic loading state during OAuth
3. **OAuth callback**: "Processing authentication..." for 2+ seconds
4. **Route transitions**: No specific loading indicators

## Acceptance Criteria

- [ ] Specific loading messages for each authentication stage
- [ ] Visual progress indicators (spinners, progress bars)
- [ ] Consistent loading state design throughout app
- [ ] Loading states reflect actual processing time
- [ ] Loading states are accessible (screen reader friendly)
- [ ] No unnecessary loading delays

## Proposed Loading States

1. **App initialization**: "Checking your session..."
2. **OAuth redirect**: "Redirecting to Google..."
3. **OAuth callback**: "Completing sign-in..."
4. **Route protection**: "Verifying access..."
5. **Initial dashboard load**: "Loading your dashboard..."

## Technical Approach

1. **Create loading component** - Reusable loading UI component
2. **Add loading state types** - Differentiate between loading scenarios
3. **Implement progress indicators** - Visual feedback for longer operations
4. **Add accessibility features** - Screen reader support
5. **Optimize loading timing** - Remove unnecessary delays

## Design Requirements

- Consistent with app's overall design language
- Mobile-friendly loading indicators
- Appropriate animation timing (not too fast/slow)
- Clear, professional messaging
- Accessibility compliance

## Effort Estimate

**Small (2-4 hours)**

- Design loading component: 1 hour
- Implementation: 2 hours
- Testing and refinement: 1 hour

## Labels

- `enhancement`
- `priority:low`
- `component:ui`
- `component:auth`
- `status:ready`

## Related Files

```
src/components/LoadingState.vue (new)
src/views/AuthCallback.vue
src/components/AuthLogin.vue
src/stores/auth.ts
src/App.vue
```

## Success Metrics

- Improved user experience feedback
- Reduced user confusion during authentication
- Consistent loading state design
- Better accessibility scores

## Optional Enhancements

- Skeleton loading states for dashboard
- Progressive loading indicators
- Animated transitions between states
- Loading state analytics

## Notes

This is a user experience enhancement that can be implemented after resolving the critical routing issues. It will contribute to a more polished and professional application feel.
