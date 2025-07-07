# Supabase OAuth Configuration Fix

## Problem

OAuth redirects are going to `localhost:3000` instead of your production domain.

## Solution

Update your Supabase project configuration:

### 1. Go to Supabase Dashboard

- URL: https://supabase.com/dashboard
- Project: lhrzcnovizsjdmlaphcy

### 2. Navigate to Authentication Settings

- Go to **Authentication** → **URL Configuration**

### 3. Update Site URL

Set **Site URL** to:

```
https://sprinkler-business-app.vercel.app
```

### 4. Update Redirect URLs

Set **Redirect URLs** to (one per line):

```
https://sprinkler-business-app.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 5. Save Changes

Click **Save** to apply the configuration changes.

## Why This Fixes It

- Supabase uses the configured redirect URLs in the project settings
- These override any redirect URLs specified in the client code
- By setting the production URL first, it becomes the primary redirect for production
- Keeping localhost allows development to still work

## After Making Changes

1. Deploy your latest code: `git push origin main`
2. Test OAuth login on production
3. Should now redirect to production domain instead of localhost

## Verification

After making changes, the OAuth redirect URL should be:
`https://sprinkler-business-app.vercel.app/auth/callback`

Instead of:
`http://localhost:3000/...`
