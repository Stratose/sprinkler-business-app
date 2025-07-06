# 🚀 Vercel Deployment Guide

## Overview

This guide walks you through deploying your Sprinkler Business App to Vercel.

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Supabase project configured with Google OAuth
- ✅ Google Cloud Console OAuth credentials
- ✅ Vercel account (free tier available)

## Step 1: Vercel Account Setup

### 1.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### 1.2 Import Project

1. Click **"New Project"**
2. Import `Stratose/sprinkler-business-app` from GitHub
3. Configure the project:
   - **Project Name**: `sprinkler-business-app`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 2: Environment Variables

### 2.1 Add Environment Variables in Vercel

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://lhrzcnovizsjdmlaphcy.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API (when implemented)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2.2 Get Your Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings > API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API Key (anon public)** → `VITE_SUPABASE_ANON_KEY`

## Step 3: Update OAuth Configuration

### 3.1 Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-app-name.vercel.app
   ```
5. Add to **Authorized redirect URIs**:
   ```
   https://lhrzcnovizsjdmlaphcy.supabase.co/auth/v1/callback
   ```

### 3.2 Update Supabase Auth Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication > URL Configuration**
3. Update **Site URL** to: `https://your-app-name.vercel.app`
4. Add to **Redirect URLs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```

## Step 4: Deploy

### 4.1 Initial Deployment

1. In Vercel dashboard, click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Click **"Visit"** to see your deployed app

### 4.2 Custom Domain (Optional)

1. Go to **Settings > Domains**
2. Add your custom domain
3. Configure DNS records as shown
4. Update OAuth settings with new domain

## Step 5: Test Production Build

### 5.1 Test Authentication

1. Visit your deployed app
2. Click **"Continue with Google"**
3. Complete OAuth flow
4. Verify you're redirected to dashboard

### 5.2 Test Development Mode

- **Development auth button should NOT appear** in production
- Only Google OAuth should be available

### 5.3 Test Features

- ✅ Login/logout functionality
- ✅ Route protection
- ✅ User profile display
- ✅ Database connectivity

## Step 6: Automatic Deployments

### 6.1 GitHub Integration

- Vercel automatically deploys on every push to `main`
- Preview deployments for pull requests
- Build logs available in dashboard

### 6.2 Branch Protection

Consider setting up branch protection rules:

1. Require pull request reviews
2. Require status checks (tests)
3. Require up-to-date branches

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run build  # Test locally first
npm run type-check  # Fix TypeScript errors
```

#### Environment Variables

```bash
# Verify all required variables are set
# Restart deployment after adding variables
```

#### OAuth Errors

```bash
# Check redirect URLs match exactly
# Verify domain is added to Google Cloud Console
# Ensure Supabase site URL is correct
```

#### Route Issues

```bash
# SPA routing handled by vercel.json
# All routes redirect to index.html
```

### Performance Optimization

#### Build Performance

- **Build time**: ~2-3 minutes
- **Bundle size**: Optimized with Vite
- **Cold start**: ~100ms

#### Caching

- Static assets cached by Vercel CDN
- API responses cached by Supabase
- Authentication tokens cached in browser

## Security Considerations

### Production Security

- ✅ HTTPS enforced by Vercel
- ✅ Environment variables encrypted
- ✅ OAuth over secure connections
- ✅ Supabase RLS policies active

### Environment Separation

- **Development**: `localhost:5173`
- **Production**: `your-app.vercel.app`
- **Preview**: `git-branch.vercel.app`

## Monitoring & Analytics

### Vercel Analytics

1. Go to **Analytics** tab in dashboard
2. View performance metrics
3. Monitor function execution
4. Track user visits

### Supabase Monitoring

1. Database usage metrics
2. Authentication statistics
3. API request logs
4. Performance insights

## Next Steps After Deployment

1. **Custom Domain**: Set up branded domain
2. **Monitoring**: Set up error tracking
3. **Performance**: Optimize bundle size
4. **Security**: Configure security headers
5. **Backups**: Set up database backups

## Support

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)

### Community

- [Vercel Discord](https://discord.gg/vercel)
- [Supabase Discord](https://discord.supabase.com/)
- [Vue Discord](https://discord.com/invite/vue)

---

## Quick Deploy Checklist

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Google OAuth URLs updated
- [ ] Supabase redirect URLs updated
- [ ] Initial deployment successful
- [ ] Authentication tested
- [ ] All features working
- [ ] Automatic deployments confirmed

**Your app should now be live at: `https://your-app-name.vercel.app`** 🎉
