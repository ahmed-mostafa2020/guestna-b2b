# Guestna B2B — Project Guide

Business-to-business platform for organizations, schools, and parents to plan, customize, and book trips/packages. The main consumer-facing flows are discovery, customization, checkout, and account/permissions management.

---

## Stack

- **Framework:** Next.js 14.2 (App Router) + React 18 — JavaScript (`jsconfig.json`, not TS in `src`).
- **UI:** Material UI v6 (+ `@mui/lab`, `@mui/x-date-pickers`) with Emotion, plus Tailwind CSS v3 (`tailwind-merge`, `clsx`).
- **State:** Redux Toolkit + `redux-persist` (whitelist-based persistence in [src/store/index.js](src/store/index.js)).
- **Server data:** TanStack Query (`@tanstack/react-query`) + Axios.
- **Forms:** Formik + Yup.
- **i18n:** `next-intl` — default locale **`ar`**, also **`en`**. Locale segment lives at `src/app/[locale]/...`. Middleware redirects unprefixed paths to `/ar/...`.
- **Maps:** `@react-google-maps/api` + `@googlemaps/js-api-loader`.
- **Payments:** Moyasar + Tamara (CSP allowlists their CDNs/APIs in [middleware.js](middleware.js)).
- **Observability:** Sentry (`@sentry/nextjs`) — config in [sentry.server.config.js](sentry.server.config.js), [sentry.edge.config.js](sentry.edge.config.js), [src/instrumentation.js](src/instrumentation.js), [src/instrumentation-client.js](src/instrumentation-client.js).
- **PWA:** `@ducanh2912/next-pwa` (disabled in dev).
- **Hosting:** Vercel (primary) + Netlify config present.

## Layout

```
src/
  app/
    [locale]/        # localized routes: (auth), checkout, discover, customization,
                     # packageInfo, profile, school-register, parents, contact-us, faq, ...
    api/             # route handlers (checkout, git-control, sentry-example)
    git-dashboard/   # internal tool (non-localized)
    messages/        # next-intl translation JSON
  assets/            # static images, SVGs, gifs
  components/        # shared UI (filtersBox, forms, ...)
  constants/
  feedback/          # toast/snackbar primitives
  hooks/             # data, forms, ui, utils
  store/             # Redux slices grouped by domain
  utils/             # api, calculations, exports, formatters, helpers, tracking, validators
middleware.js        # locale redirect + per-request CSP nonce
next.config.mjs      # Sentry + next-intl + PWA + security headers + image domains
i18n.config.js
```

## Path Aliases (from [jsconfig.json](jsconfig.json))

`@/*`, `@assets/*`, `@components/*`, `@utils/*`, `@store/*`, `@constants/*`, `@feedback/*`, `@hooks/*`, `@layouts/*`, `@validations/*`, `@lib/*`. **Always prefer aliases over deep relative paths.**

## Scripts

```
yarn dev      # next dev
yarn build    # next build
yarn start    # next start
yarn lint     # next lint
```

Package manager is **Yarn** (see `yarn.lock`). Don't introduce `package-lock.json`.

---

## Conventions & Things to Watch

### i18n
- All user-facing routes live under `src/app/[locale]/`. New pages must go inside that segment, never as a sibling of `[locale]`.
- Default locale is **`ar`** (Arabic, RTL). When adding strings, update both `ar.json` and `en.json` in `src/app/messages/`.
- Use `next-intl`'s `useTranslations` / `getTranslations` — do not hard-code Arabic/English strings in components.

### Security headers & CSP
- Static security headers (HSTS, X-Frame-Options, Permissions-Policy, etc.) are set in [next.config.mjs](next.config.mjs).
- **Content-Security-Policy is dynamic** — built per request with a nonce in [middleware.js](middleware.js). **Do not** add a static CSP to `next.config.mjs`; it would override the nonce-based one and break inline scripts.
- If you add a new third-party script/image/font/iframe/API host, update the matching directive in `buildCSP()` AND (for images) `images.domains` in `next.config.mjs`.

### Redux persistence
- Only the slices in `rootPersistConfig.whitelist` ([src/store/index.js](src/store/index.js)) survive reload. Adding a new slice that needs persistence requires whitelisting it. Don't persist large/derived state.

### Routing & middleware
- The `matcher` in [middleware.js](middleware.js) skips `api`, `_next`, `static`, and any path with a file extension. The `rewrites` block in `next.config.mjs` mirrors this for the locale fallback regex. Keep them aligned if you add new top-level paths.

### Apple Pay
- `/.well-known/apple-developer-merchantid-domain-association[.txt]` is rewritten to a public file in [next.config.mjs](next.config.mjs). Don't move/rename without updating the rewrite.

### Code style
- JS only in `src/` (no TS files there). Components are `.jsx`.
- Forms: Formik + Yup schemas (look in `src/utils/validators` and `src/components/forms`).
- Styling: prefer MUI `sx` / `styled` for component styling, Tailwind for layout/utility classes. `tailwind-merge` is available for conditional class composition.

---

## Byterover MCP — Knowledge Tools

Two tools are available from the Byterover MCP server:

### `byterover-retrieve-knowledge`
**Use when:**
- Starting a new task or implementation — gather relevant context first.
- Before architectural decisions — check existing patterns.
- When debugging — look for previously stored solutions.
- Working in unfamiliar parts of the codebase.

### `byterover-store-knowledge`
**Use when:**
- Learning new patterns, APIs, or architectural decisions from the codebase.
- Encountering an error solution or debugging technique worth recording.
- Finding reusable code patterns or utility functions.
- Completing a significant task or plan implementation.
