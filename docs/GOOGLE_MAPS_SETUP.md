# 🗺️ Google Maps API Setup Guide

## Overview

This guide will help you configure the Google Maps API for the interactive map visualization feature in your Sprinkler Business App.

## Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**:

   - Go to **APIs & Services** > **Library**
   - Search for "Maps JavaScript API"
   - Click **Enable**

4. Create API credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **API key**
   - Copy your API key

## Step 2: Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. In **Credentials**, click on your API key
2. Under **API restrictions**:
   - Select **Restrict key**
   - Choose **Maps JavaScript API**
3. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `localhost:5173/*` (for development)
     - `your-production-domain.com/*` (for production)

## Step 3: Add API Key to Your Project

### For Development (.env file):

```bash
# Add to your .env file
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### For Production (Vercel):

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add:
   - **Name**: `VITE_GOOGLE_MAPS_API_KEY`
   - **Value**: Your API key
   - **Environments**: Production, Preview, Development

## Step 4: Test the Integration

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the **Map** section in your app
3. You should see an interactive map with customer locations

## Features Available

Once configured, your map will have:

- ✅ Interactive customer location markers
- ✅ Click markers to view customer details
- ✅ Call and directions quick actions
- ✅ Automatic map centering and zooming
- ✅ Performance optimizations for large datasets

## Troubleshooting

### Map Not Loading

- **Check API key**: Ensure it's correctly set in environment variables
- **Check restrictions**: Make sure your domain is allowed
- **Check console**: Look for error messages in browser console

### CSP Errors

- The CSP has been updated to allow Google Maps
- If you still see CSP errors, check your browser console for specific domains to add

### API Quotas

- Google Maps has usage limits and pricing
- Monitor your usage in [Google Cloud Console](https://console.cloud.google.com/)
- Consider setting up billing alerts

## Cost Considerations

- Google Maps JavaScript API pricing: ~$7 per 1,000 requests
- You get $200 in free credits monthly
- For typical business use, costs are usually minimal
- Monitor usage in Google Cloud Console

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is active and has the right permissions
3. Ensure your domain is added to the API key restrictions
4. Check Google Cloud Console for any service issues

---

_Last updated: Current session_
