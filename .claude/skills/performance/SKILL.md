---
name: performance
description: Use when optimizing load speed, bundle size, images, fonts, re-renders, SEO metadata, or Core Web Vitals (LCP, CLS, INP), or when adding heavy libraries (maps, charts, PDF/Excel export, sliders, date pickers).
---

# Performance in Guestna B2B

## Images
- Always `next/image`; remote hosts must be in `images` config in `next.config.mjs` **and** `img-src` in `buildCSP()` (middleware.js).
- Set `sizes` for responsive images, e.g. cards: `sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"`.
- Above-the-fold hero/first card: `priority`; everything else lazy (default).
- Give dimensions or `fill` + sized parent with `aspect-*` to prevent CLS.
- Reuse `ui/imagesPlaceholder` for fallbacks.

## Fonts
- Somar is loaded with `next/font/local` in `[locale]/layout.jsx` as `--font-somar-sans`. Add new fonts the same way — never `<link>` Google Fonts (CSP + CLS).

## Heavy client code → `next/dynamic`
Lazy-load on interaction/visibility, `ssr: false` when browser-only:
- `@react-google-maps/api` map pickers, `recharts` charts, `jspdf`/`html2canvas`/`exceljs` exports, `swiper`/`react-slick` below the fold, `@mui/x-date-pickers` in modals.
```js
const LocationMap = dynamic(() => import("@components/features/.../LocationMap"), { ssr: false, loading: () => <MapSkeleton /> });
```
- Export libs: `import()` inside the click handler (`ui/ExportButton`), not at module top.

## Client bundle
- Keep `"use client"` at leaves; static wrappers stay server.
- MUI icons: path imports (`@mui/icons-material/Visibility`) — never the barrel `{ X } from "@mui/icons-material"` in new code.
- Don't add a library for what `dayjs`/native already does. No new deps without asking.

## Re-renders
- Redux: select the narrowest slice (`useSelector((s) => s.users?.userType)`), never the whole state.
- Stable query params/options for `useFetchData` (`useMemo`) to avoid refetch loops.
- Formik big forms: `memo` field components (like `TextInputGroup`), avoid inline object props in mapped lists.
- `useCallback`/`useMemo` only where identity matters (memoized children, effect deps) — not everywhere.
- Lists: stable `key` from ids, never index for reorderable data.

## INP
- Debounce search/filter inputs (300ms) before dispatching or querying.
- Defer non-urgent updates with `useTransition` for heavy filter re-renders.
- Avoid synchronous heavy work in click handlers (PDF generation → show progress, run after paint).

## SEO / Metadata
- Public pages (discover, packageInfo, events, provider-profile) export `generateMetadata` with localized title/description and OG image; follow `[locale]/event-invitation/[slug]/page.jsx`.
- Use `alternates.languages` for `ar`/`en`. Update `src/app/sitemap.js` for new public routes.

## LCP / CLS checklist
- [ ] LCP image has `priority` + correct `sizes`
- [ ] Skeletons match final layout dimensions
- [ ] No layout-shifting banners/toasts injected above content
- [ ] Third-party scripts via `next/script` `strategy="lazyOnload"` with the CSP nonce
