# SEO Quick Reference Guide

> **Quick access guide for common SEO tasks and configurations**

---

## 🔗 Quick Links

| Resource            | URL                                                      | Purpose                            |
| ------------------- | -------------------------------------------------------- | ---------------------------------- |
| **Sitemap**         | `/sitemap.xml`                                           | All public routes with hreflang    |
| **Robots**          | `/robots.txt`                                            | Crawler rules and AI access        |
| **AI Guide**        | `/llms.txt`                                              | Comprehensive platform info for AI |
| **Structured Data** | View page source → `<script type="application/ld+json">` | Schema.org markup                  |

---

## 📝 Common Tasks

### Add a New Public Route

1. **Edit:** `src/app/sitemap.js`
2. **Add to array:**
   ```javascript
   const publicRoutes = [
     "/",
     "/faq",
     "/your-new-route", // Add here
   ];
   ```
3. **Result:** Automatically included in sitemap with both locales

### Block a New Private Route

1. **Edit:** `src/app/sitemap.js` (line 28)

   ```javascript
   const excludedRoutes = [
     "/api",
     "/checkout",
     "/your-private-route", // Add here
   ];
   ```

2. **Edit:** `src/app/robots.js` (line 8)
   ```javascript
   const disallowedPaths = [
     "/api",
     "/*/checkout",
     "/*/your-private-route", // Add here
   ];
   ```

### Update Business Information

**Edit:** `src/utils/structuredData.js`

```javascript
// Lines 11-18: Address
const businessAddress = {
  streetAddress: "Your Street",
  addressLocality: "Your City",
  // ...
};

// Lines 20-24: Coordinates
const geoCoordinates = {
  latitude: 24.7136,
  longitude: 46.6753,
};

// Lines 26-30: Social Media
const sameAsLinks = [
  "https://www.linkedin.com/company/your-company",
  // ...
];
```

### Update Metadata (Title/Description)

**Edit:** `src/app/[locale]/layout.jsx` (lines 30-55)

```javascript
const metadataByLocale = {
  ar: {
    title: "Your Arabic Title",
    description: "Your Arabic Description",
  },
  en: {
    title: "Your English Title",
    description: "Your English Description",
  },
};
```

### Add New AI Crawler

**Edit:** `src/app/robots.js` (line 44+)

```javascript
{
  userAgent: "NewAIBot", // Bot name
  allow: "/",
  disallow: disallowedPaths,
},
```

### Update llms.txt Content

**Edit:** `public/llms.txt`

Update any section as needed. Key sections:

- **Platform Overview** (lines 7-15)
- **Business Model** (lines 19-38)
- **Core Features** (lines 42-66)
- **Contact Information** (lines 222-232)

---

## 🧪 Testing Commands

### Test Sitemap Locally

```bash
npm run dev
# Visit: http://localhost:3000/sitemap.xml
```

### Test Robots.txt Locally

```bash
npm run dev
# Visit: http://localhost:3000/robots.txt
```

### Validate Structured Data

```bash
# 1. Start dev server
npm run dev

# 2. Visit in browser:
http://localhost:3000/ar

# 3. View page source, copy JSON-LD script

# 4. Paste into validator:
https://validator.schema.org/
```

### Build & Check for Errors

```bash
npm run build
# Check console for any SEO-related warnings
```

---

## 🔍 Verification Checklist

### After Deployment:

- [ ] Visit `/sitemap.xml` - verify all routes present
- [ ] Visit `/robots.txt` - verify AI crawlers allowed
- [ ] Visit `/llms.txt` - verify content displays
- [ ] Test structured data: https://search.google.com/test/rich-results
- [ ] Test Open Graph: https://www.opengraph.xyz/
- [ ] Submit sitemap to Google Search Console
- [ ] Check PageSpeed Insights: https://pagespeed.web.dev/

---

## 📊 Current Configuration

### Supported Locales

- `ar` (Arabic - Default)
- `en` (English)

### AI Crawlers Allowed (12 total)

- OpenAI: `GPTBot`, `ChatGPT-User`
- Google: `Google-Extended`
- Anthropic: `anthropic-ai`, `ClaudeBot`, `Claude-Web`
- Apple: `Applebot`, `Applebot-Extended`
- Others: `PerplexityBot`, `YouBot`, `Bytespider`, `Meta-ExternalAgent`

### Structured Data Schemas (6 total)

1. Organization
2. LocalBusiness
3. WebSite
4. Service
5. FAQPage
6. BreadcrumbList

### Public Routes (10 total)

- `/` (Homepage)
- `/faq`
- `/contact-us`
- `/privacy-policy`
- `/terms-and-conditions`
- `/return-policy`
- `/discover`
- `/packageInfo`
- `/school-register`
- `/about-us`

### Private Routes (Excluded from SEO)

- `/api/*`
- `/*/checkout`
- `/*/profile`
- `/*/confirming-data`
- `/*/bookingStatus`
- `/*/customization`
- `/*/parents`
- All auth routes (`/login`, `/signup`, etc.)

---

## 🚨 Important Settings

### Crawl Delay

```javascript
// robots.js line 34
crawlDelay: 1, // 1 second (optimal)
```

### Sitemap Priority

```javascript
// sitemap.js lines 87-88
priority: isHomepage ? 1.0 : 0.8,
changeFrequency: isHomepage ? "daily" : "weekly",
```

### Cache Headers

```javascript
// next.config.mjs line 42
"Cache-Control": "public, max-age=31536000, immutable"
```

---

## 📞 Support Contacts

### SEO Issues

- Check Google Search Console first
- Review server logs for crawler errors
- Verify sitemap.xml is accessible

### Structured Data Issues

- Use Google Rich Results Test
- Validate JSON-LD syntax
- Check schema.org documentation

### Performance Issues

- Run PageSpeed Insights
- Check preconnect headers are working
- Verify image optimization

---

## 🔄 Update Frequency

### Update Immediately When:

- Adding new public pages
- Changing business information
- Blocking new routes
- Adding new features to llms.txt

### Review Quarterly:

- AI crawler list (new crawlers emerge)
- Structured data schemas (new types available)
- Performance headers (new optimizations)
- llms.txt accuracy (features/pricing changes)

---

## 📚 Documentation Links

- **Full Report:** `SEO_IMPROVEMENTS_REPORT.md`
- **Original Report:** `SEO_GEO_REPORT.md`
- **Next.js SEO Docs:** https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Schema.org:** https://schema.org/
- **Google Search Central:** https://developers.google.com/search

---

**Last Updated:** November 30, 2024  
**Version:** 2.0
