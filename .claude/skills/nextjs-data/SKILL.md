---
name: nextjs-data
description: Use when fetching or mutating API data, adding an endpoint, wiring TanStack Query (useFetchData/useMutationData), writing generateMetadata/server fetches, adding a route handler in src/app/api, or adding loading/error/not-found route files.
---

# Data fetching & mutations in Guestna B2B

## Where data comes from
- Backend: `process.env.NEXT_PUBLIC_BASE_URL` + endpoint constants in `@constants/APIs` (`END_POINTS`) and `@constants/b2bAPIs` (`B2B_END_POINTS`). Add new endpoints there — never inline URL strings.
- Auth token: cookie `CONSTANT_VALUES.AUTH_TOKEN`; `lang` header = current locale; org header from Redux `selectedOrganizations`.

## Client reads — `useFetchData` (default for interactive pages)
```js
const { data, isLoading, isError, refetch } = useFetchData(
  B2B_END_POINTS.TRIPS, { page, perPage }, { enabled: !!orgId, skipOrgHeader: false }
);
```
- Already handles token, locale, org header, and disables protected endpoints for visitors — don't re-implement with raw axios.
- Params object is part of the query key: keep it stable (`useMemo`) to avoid refetch loops.
- Use `enabled` to gate dependent queries instead of `useEffect` chains.
- Paginated trips → `usePaginatedTrips`.

## Client writes — `useMutationData`
```js
const { mutate, isLoading } = useMutationData(B2B_END_POINTS.BOOK, { method: "POST" });
mutate(payload, { onSuccess: () => { enqueueSnackbar(t("..."), { variant: "success" }); queryClient.invalidateQueries({ queryKey: [...] }); } });
```
- ⚠️ `options.onSuccess/onError` passed to the hook are **dispatched as Redux actions** — pass action creators there; put UI side-effects in `mutate(..., { onSuccess })`.
- After a write, invalidate the affected queries; don't manually refetch everything.
- Errors: `extractApiError` / `axiosErrorHandler` from `@utils/api` → notistack snackbar.
- Forms using `useAxiosForm`/`useAxiosAction` (`@hooks/forms`) — follow them when editing those files.

## Server-side fetching (new SEO pages only)
- `page.jsx` as async Server Component; `fetch` with `{ next: { revalidate: 300 } }` for public catalog data, `cache: "no-store"` for user-specific data.
- Fetch independent resources in parallel: `const [trip, cities] = await Promise.all([getTrip(slug), getCities()]);`
- Reuse one fetcher for `generateMetadata` and the page (React dedupes `fetch`); return `null` + `notFound()` on 404.
- Hand data to client leaves as props or TanStack `initialData`.
- No Server Actions exist in this repo — don't introduce them without asking.

## Route files
- `[locale]/error.jsx` and `[locale]/not-found.js` already exist globally; add route-level `loading.jsx` with a skeleton only for slow server-rendered routes.
- `error.jsx` must be `"use client"` and accept `{ error, reset }`.

## Route handlers (`src/app/api/*`)
- Only for: secrets that can't reach the browser, payment callbacks (checkout), webhooks, or proxying (`getProxyUrl`). Not for plain reads the client can call directly.
- `middleware.js` matcher skips `/api` — handlers get no locale.

## Avoid
- Fetching in `useEffect` + `useState` when `useFetchData` fits.
- Waterfalls: child components each awaiting sequentially — lift and `Promise.all`.
- Copying server data into Redux; Redux is for UI/session state (filters, checkout, users).
