## Guestna B2B SEO & AI Readiness Report

### Deliverables implemented

- **Localized metadata pipeline** (`src/app/[locale]/layout.jsx`): dynamic titles, descriptions, geo tags, Open Graph/Twitter cards, and hreflang-aware canonicals for `ar` and `en`.
- **Schema.org coverage** (`src/utils/structuredData.js`): `Organization`, `LocalBusiness`, `WebSite`, `Service`, and bilingual `FAQPage` JSON-LD injected per locale for richer SERP features, local intent, and AI ingestion.
- **Crawler controls** (`public/robots.txt`): AI-friendly allows for `GPTBot`, `Google-Extended`, `anthropic-ai`, plus explicit disallows for sensitive flows and pointer to the sitemap/llms resources.
- **AI indexing guides** (`public/llms.txt`, `public/llms-full.txt`): Markdown indexes with Arabic/English summaries, policy links, and extended context for LLM crawlers.
- **Sitemap automation** (`next-sitemap.config.js`): multilingual URLs with `x-default`, priority boost for locale roots, and AI bot inclusions in robots options.
- **Public logo asset** (`public/logo.png`): ensures Open Graph and schema logo URLs resolve without Next.js asset routing.

### How to regenerate artifacts

1. `npm install` (already has `next-sitemap` dependency).
2. `npx next-sitemap` to rebuild `sitemap.xml`/`robots.txt` after deploy-specific URL changes.
3. Deploy so the static files in `public/` are served at the root (`/robots.txt`, `/llms.txt`, `/llms-full.txt`).

### Recommended next steps

- **Content freshness**: Automate `<lastmod>` by wiring `transform` to actual CMS dates; run sitemap generation whenever trip catalog changes.
- **FAQ exposure**: Mirror the structured FAQ entries on visible FAQ pages so content parity exists for users and crawlers.
- **Performance signals**: Add structured data for key Trip detail pages (e.g., `Product`, `Event`) once those routes go live.
- **Search Console**: Submit `https://guestna.app/sitemap.xml` and monitor Coverage + Enhancements (FAQ, Sitelinks search box).
- **AI distribution**: Consider adding `ai.txt`/`openai.txt` endpoints if future crawlers formalize opt-in requirements.
