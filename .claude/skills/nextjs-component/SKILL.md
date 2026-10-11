---
name: nextjs-component
description: Use when creating a new React component or page, splitting an existing one, or deciding where "use client" goes in src/app/[locale] or src/components. Covers server/client boundary, file placement, reusing ui/ and forms/ primitives, and loading/empty/error states.
---

# Building components in Guestna B2B

## 1. Before writing — reuse first
- Grep `src/components/ui`, `src/components/forms/*Group.jsx`, `src/feedback` for an existing primitive:
  - Inputs: `TextInputGroup`, `DropdownGroup`, `AutocompleteInputGroup`, `PhoneInputGroup`, `CheckboxGroup`, `RadioButtonsGroup`
  - Buttons/feedback: `FormSubmitButton`, `ui/customizedModal`, `Pagination`, `TabSwitcher`, `TableSkeleton`, `ProfilePageSkeleton`
  - Status: `@feedback/loading/FullScreenLoading`, `@feedback/error/ErrorComponent` (`statusCode`, `errorMessage`, `isResetButton`)
- Extend a primitive with a prop before creating a near-duplicate.

## 2. Placement
- Route file: `src/app/[locale]/<route>/page.jsx` — keep it thin; compose feature components.
- Feature UI: `src/components/features/<domain>/` (e.g. `features/schoolRegister`, `features/checkout`).
- Multi-file component → folder with `index.jsx` + colocated `constants.js`, `utils.js`, `steps/` (see `forms/schoolTripBookingForm/`).
- Shared only when used by 2+ domains → `components/ui`.

## 3. Server vs client
- New `page.jsx`/`layout.jsx`: keep as a **Server Component** when it only fetches + composes; use `getTranslations` and export `generateMetadata` (pattern: `[locale]/event-invitation/[slug]/page.jsx`).
- Put `"use client"` on the **smallest leaf** that needs state, effects, Redux, Formik, TanStack Query, MUI interactive components, or browser APIs.
- Never import a client-only module (Redux hooks, `js-cookie`, `useFetchData`) into a server file.
- Pass serializable props across the boundary (no functions, class instances, dayjs objects).
- Most existing features are client components — don't convert them unless asked.

## 4. Props
- No TypeScript. Destructure props with defaults in the signature (see `TextInputGroup`).
- Shared `ui/` primitives get a JSDoc block describing props (see `FormSubmitButton.jsx`).
- Prefer `className`/`containerClassName` passthrough merged with `cn()` over style-variant props.
- `memo` + `displayName` only for list items / heavy inputs re-rendered by Formik.

## 5. States — every data-driven component handles all four
```jsx
const { data, isLoading, isError, error, refetch } = useFetchData(B2B_END_POINTS.X, params);
if (isLoading) return <TableSkeleton />;            // skeleton matching final layout, not a spinner
if (isError) return <ErrorComponent errorMessage={error?.message} isResetButton />;
if (!data?.length) return <EmptyState text={t("...")} />; // translated, with a next action
return <List items={data} />;
```

## 6. Checklist
- [ ] Strings via `useTranslations`; keys added to `ar.json` + `en.json`
- [ ] RTL-safe logical classes (`ps-`, `me-`, `start-`, `text-start`)
- [ ] Aliased imports, import order: react/next → libs → `@` aliases → relative
- [ ] Tokens (`mainColor`, `textDark`, …) not hex values
- [ ] `yarn eslint <file>` clean
