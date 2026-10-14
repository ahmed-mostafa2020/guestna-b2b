---
name: redux-slice
description: Use when adding or changing a Redux Toolkit slice, deciding whether state belongs in Redux vs TanStack Query vs local state, persisting state with redux-persist, or debugging stale/rehydrated state after login/logout.
---

# Redux slices in Guestna B2B

Store: `src/store/index.js` (RTK `configureStore` + `redux-persist`, `localStorage`). Slices: `src/store/<domain>/<name>Slice.js`.

## First: does it belong in Redux?

- **Server data** (lists, details, profile from API) → TanStack Query (`useFetchData`). Not Redux.
- **Single component / single form** state → `useState` / Formik.
- **Redux** only for cross-page client state: checkout flow selections, auth/user, permissions, theme, favorites, multi-page form drafts.

## Slice template (match `src/store/theme/themeSlice.js`)

```js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { selectedX: null, items: [] };

const xSlice = createSlice({
  name: "x",
  initialState,
  reducers: {
    setSelectedX: (state, action) => {
      state.selectedX = action.payload;
    },
    resetX: () => initialState,
  },
});

export const { setSelectedX, resetX } = xSlice.actions;
export default xSlice.reducer;
```

- Always provide a `reset` reducer that returns `initialState`.
- Only serializable values — no `File`, `Date` objects, functions, or class instances (store ISO strings or ids).
- Keep state minimal; derive totals/filters in selectors or components.

## Register

1. Import in `src/store/index.js` and add to `combineReducers({...})`. The key name = how components read it (`state.x`).
2. **Persist?** Add the key to `rootPersistConfig.whitelist` only if it must survive refresh. Never persist large lists, API responses, or derived state. Sensitive data (tokens, national IDs) → don't persist unless an existing pattern already does.
3. Changing the shape of a persisted slice → old data rehydrates. Keep fields backward compatible or handle `undefined` in readers.

## Logout / user switch

- Ensure the new slice is cleared on logout. Find the existing logout handler (Grep `clearTheme\|resetTheme\|logout`) and dispatch `resetX()` there.

## Usage

- `useSelector((s) => s.x.selectedX)` — select the narrowest value to avoid re-renders.
- Components using the store are client components (`"use client"`).

## Checklist

- [ ] Redux is the right place
- [ ] Slice with `reset`, serializable state
- [ ] Registered in `combineReducers`
- [ ] Whitelist decision made consciously
- [ ] Cleared on logout
