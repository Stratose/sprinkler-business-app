# 🚀 Quick Vercel Deployment Setup

## 1. Vercel Account & Project

```bash
# 1. Go to vercel.com and sign up with GitHub
# 2. Import project: Stratose/sprinkler-business-app
# 3. Use these settings:
#    - Framework: Vite
#    - Build Command: npm run vercel-build
#    - Output Directory: dist
```

## 2. Environment Variables (Vercel Dashboard)

```bash
# Settings > Environment Variables
VITE_SUPABASE_URL=https://lhrzcnovizsjdmlaphcy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GOOGLE_MAPS_API_KEY=AIza...  # (optional for now)
```

## 3. Update Google OAuth (Google Cloud Console)

```bash
# Add to Authorized JavaScript origins:
https://your-app-name.vercel.app

# Authorized redirect URIs already set:
https://lhrzcnovizsjdmlaphcy.supabase.co/auth/v1/callback
```

## 4. Update Supabase Settings

```bash
# Authentication > URL Configuration
# Site URL: https://your-app-name.vercel.app
# Add to Redirect URLs: https://your-app-name.vercel.app/auth/callback
```

## 5. Test Deployment

```bash
# 1. Deploy in Vercel
# 2. Visit deployed URL
# 3. Test Google OAuth
# 4. Verify DEV button doesn't appear in production
# 5. Test all routes and authentication
```

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com/
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repo**: https://github.com/Stratose/sprinkler-business-app

## Verification Checklist

- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Google OAuth updated
- [ ] Supabase URLs updated
- [ ] Deployment successful
- [ ] Authentication working
- [ ] Production features verified
