# Sentry Source Maps Setup Guide

## Problem
You're seeing this error in Sentry production:
> "Generate source maps to see the original source file and line numbers. No link to a source map was found in your minified JavaScript file."

## Root Cause
Source maps are not being uploaded to Sentry during the production build process.

---

## Solution Steps

### 1. **Set Up Sentry Auth Token**

#### For Vercel Deployment:

1. **Get your Sentry Auth Token:**
   - Go to https://sentry.io/settings/account/api/auth-tokens/
   - Click "Create New Token"
   - Name: `vercel-source-maps`
   - Scopes: Select these permissions:
     - ✅ `project:read`
     - ✅ `project:releases`
     - ✅ `project:write`
     - ✅ `org:read`
   - Click "Create Token"
   - **Copy the token immediately** (you won't see it again)

2. **Add to Vercel Environment Variables:**
   - Go to your Vercel project settings
   - Navigate to: Settings → Environment Variables
   - Add new variable:
     - **Name:** `SENTRY_AUTH_TOKEN`
     - **Value:** `your-token-here`
     - **Environment:** Production, Preview, Development (check all)
   - Click "Save"

3. **Redeploy:**
   - Trigger a new deployment for changes to take effect
   - Source maps will be uploaded automatically during build

#### For Local Development:

Create a `.env.sentry-build-plugin` file in your project root:

```bash
SENTRY_AUTH_TOKEN=your-token-here
SENTRY_ORG=any-2y
SENTRY_PROJECT=httpsshopguestna-educom
```

**Important:** Add this file to `.gitignore` (should already be there)

---

### 2. **Verify Configuration**

Your `next.config.mjs` has been updated with:

```javascript
export default withSentryConfig(withNextIntl(nextConfig), {
  org: "any-2y",
  project: "httpsshopguestna-educom",
  
  // Upload source maps for better stack traces
  widenClientFileUpload: true,
  
  // Hide source code from public (recommended)
  hideSourceMaps: true,
  
  // Other optimizations...
  disableLogger: true,
  automaticVercelMonitors: true,
}, {
  // Upload source maps only in production
  sourcemaps: {
    disable: process.env.NODE_ENV !== 'production',
  },
});
```

---

### 3. **What Happens During Build**

When you deploy to production with `SENTRY_AUTH_TOKEN` set:

1. ✅ Next.js generates source maps (`.map` files)
2. ✅ Sentry webpack plugin uploads them to Sentry
3. ✅ Source maps are deleted from public bundle (`hideSourceMaps: true`)
4. ✅ Sentry can now show original code in error stack traces

---

### 4. **Verify It's Working**

After deploying with the auth token:

1. **Check Build Logs:**
   - Look for: `"Uploading source maps to Sentry"`
   - Should see: `"Source maps uploaded successfully"`

2. **Check Sentry Dashboard:**
   - Go to your Sentry project
   - Settings → Source Maps
   - You should see uploaded artifacts for your release

3. **Test an Error:**
   - Trigger an error in production
   - Check Sentry issue
   - Stack trace should show **original file names and line numbers**

---

## Important Notes

### ✅ **Auth Token is ONLY needed during build**
- Not needed at runtime
- Only used by webpack plugin to upload source maps
- Safe to add to Vercel environment variables

### ✅ **Security**
- `hideSourceMaps: true` prevents source code from being publicly accessible
- Source maps are only stored on Sentry's servers
- Only your team can see the original source code in error reports

### ✅ **Build Time**
- First build with source maps will be slower
- Subsequent builds are cached and faster
- Only happens in production builds

---

## Troubleshooting

### "Auth token not found"
**Solution:** Make sure `SENTRY_AUTH_TOKEN` is set in your deployment environment

### "Permission denied"
**Solution:** Regenerate token with correct scopes (project:releases, project:write)

### "Source maps still not showing"
**Solution:** 
1. Clear Vercel build cache
2. Trigger fresh deployment
3. Check Sentry project settings → Source Maps

### "Build failing after adding Sentry"
**Solution:**
1. Check token is valid
2. Verify org and project names match exactly
3. Check build logs for specific error

---

## Files Modified

- ✅ `next.config.mjs` - Added source map upload configuration
- ⚠️ `.env.sentry-build-plugin` - Create this file locally (don't commit)
- ⚠️ Vercel Environment Variables - Add `SENTRY_AUTH_TOKEN`

---

## Next Steps

1. Get Sentry auth token from https://sentry.io/settings/account/api/auth-tokens/
2. Add `SENTRY_AUTH_TOKEN` to Vercel environment variables
3. Redeploy your application
4. Verify source maps are uploaded in build logs
5. Test error reporting shows original source code

---

## References

- [Sentry Next.js Source Maps](https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/)
- [Sentry Auth Tokens](https://docs.sentry.io/api/auth/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
