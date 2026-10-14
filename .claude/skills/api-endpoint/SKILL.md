---
name: api-endpoint
description: Use when wiring a new backend endpoint end-to-end into a screen — adding the endpoint constant, list/details/create/update/delete calls, permission gating, cache invalidation after a write, and loading/empty/error UI. For general data-fetching rules see nextjs-data.
---

# Wiring a backend endpoint end-to-end

Use this as a recipe; `nextjs-data` holds the general rules.

## 1. Get the contract

- Ask for (or read from the task / Postman / backend message) the method, path, params/body, response shape, and error shape. If the response shape is unknown, ask **one** question. Don't guess field names.

## 2. Add the constant

- B2B features → `src/constants/b2bAPIs.js` (`B2B_END_POINTS`); others → `src/constants/APIs.js` (`END_POINTS`).
- Relative path (no `BASE_URL`), nested by feature like the existing groups:

```js
SCHOOL_TEAM_MANAGEMENT: { USERS: { INFO: "...", ADD: "...", DELETE: "..." } },
```

- Path params → a function: `DETAILS: (id) => \`orders/${id}\``. Never inline URL strings in components.

## 3. Read (GET)

```js
const params = useMemo(
  () => ({ page, perPage, search }),
  [page, perPage, search]
);
const { data, isLoading, isFetching, isError, refetch } = useFetchData(
  B2B_END_POINTS.X.LIST,
  params,
  { lang: locale, enabled: hasElement(PERMISSIONS.ELEMENT.X) && !!id }
);
```

- Query key = `["fetchData", endpoint, method, params, body, …, orgHeader]` → params must be stable.
- Gate with `usePermissions().hasElement(...)` / `enabled` instead of fetching then hiding.
- Normalize the response shape once (`const rows = data?.data?.items ?? []`) with optional chaining for nullable fields.

## 4. Write (POST/PUT/PATCH/DELETE)

```js
const { mutateAsync, isPending } = useMutationData(B2B_END_POINTS.X.ADD, {
  method: "POST",
});
await mutateAsync(buildXPayload(values));
```

- ⚠️ `onSuccess`/`onError` passed **to the hook** are dispatched as Redux actions. Put UI side-effects (snackbar, close modal, invalidate) after `await` or in `mutate(..., { onSuccess })`.
- Need the Next proxy (CORS / cookies / file upload)? Use `axios` + `getProxyUrl(endpoint)` like existing forms.
- File uploads: `FormData`. Don't set the `Content-Type` yourself.

## 5. Invalidate after writes

Match by endpoint substring (repo pattern, see `provider-profile/branches/page.jsx`):

```js
queryClient.invalidateQueries({
  predicate: (q) =>
    q.queryKey.some(
      (k) =>
        typeof k === "string" &&
        (k.includes(B2B_END_POINTS.X.LIST) ||
          k.includes(B2B_END_POINTS.X.COUNTS))
    ),
});
```

Invalidate every list, count, and details query the write affects. Don't do a full page reload.

## 6. UI states

- Loading → skeleton from `src/feedback/loading` (keep the layout stable). Refetching → subtle indicator, keep old data.
- Empty → translated empty state. Error → `src/feedback/error` component with retry (`refetch`).
- Mutation → button `loading`/`disabled` while pending; success + error snackbars (`extractApiError(err)`).
- All texts in both `ar.json` and `en.json` (see `i18n` skill).

## 7. Verify

- `yarn eslint` on the touched files.
- Explain the manual check: the happy path, an empty response, a 4xx with the server message shown, and a user without the permission.

## Checklist

- [ ] Constant added, no inline URLs
- [ ] Stable params, permission-gated `enabled`
- [ ] UI side-effects not passed to `useMutationData` options
- [ ] Related queries invalidated
- [ ] Loading / empty / error / pending states translated
