---
name: third-party-integration
description: Use when adding or changing an external service, script, SDK, iframe, image host, font, analytics/pixel, payment provider (Moyasar, Tamara, Apple Pay), maps, or any new domain the browser must reach — or when debugging a CSP "Refused to load/connect/frame" error.
---

# Third-party integrations (CSP, images, rewrites)

CSP is built **per request with a nonce** in `middleware.js` → `buildCSP(nonce)`. Never add a static CSP in `next.config.mjs`.

## 1. Decide what the browser loads

For the new host, list every kind of request: script, XHR/fetch/websocket, iframe, image, font, style, worker.
Check the vendor docs and look at the Network tab if you can.

## 2. Update `buildCSP()` in `middleware.js`

| Request                                 | Directive                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `<script src>` / SDK                    | `script-src` (inline scripts need `nonce={nonce}`; `strict-dynamic` lets nonce'd scripts load children) |
| fetch / XHR / ws                        | `connect-src`                                                                                           |
| iframe / 3-D Secure / embedded checkout | `frame-src`                                                                                             |
| `<img>` / CSS backgrounds               | `img-src`                                                                                               |
| fonts                                   | `font-src`                                                                                              |
| stylesheets                             | `style-src`                                                                                             |

- Add the **narrowest** origin (`https://cdn.vendor.com`, not `https:` or `*`). Wildcards only for vendor-documented subdomains (like `https://*.sentry.io`).
- Keep the existing order/format of each directive line.

## 3. Images via `next/image`

- Add the host to `images.domains` in `next.config.mjs` (match the existing style there).

## 4. Inline scripts

- Read the nonce from the request headers in the layout (follow the existing GTM/analytics pattern) and pass `nonce` to `<Script>`. Never add `'unsafe-inline'` or `'unsafe-eval'` to `script-src`.

## 5. Routing

- If the integration needs a public path (webhook callback, `.well-known`, verification file), add a rewrite in `next.config.mjs` **and** make sure the `middleware.js` matcher excludes it. Don't move the Apple Pay `.well-known` rewrite.
- Server-side calls to the vendor → `src/app/api/<name>/route.js` (secrets stay server-side, read via `process.env`; never read `.env*` files).

## 6. Load cost

- Load SDKs lazily (`next/script` `strategy="lazyOnload"` / dynamic import on the page that needs them), not in the root layout unless global.

## 7. Verify

- `yarn build`, then open the affected page and check the console for CSP violations in **both** locales.
- Sentry: confirm new errors from the vendor domain aren't flooding (add an `ignoreErrors` entry only if it's noise).

## Checklist

- [ ] CSP directive(s) updated, narrowest origin
- [ ] `images.domains` if images
- [ ] Nonce on inline scripts
- [ ] Rewrites ↔ matcher aligned
- [ ] Secrets only server-side
- [ ] No CSP errors in the console
