---
name: clean-code
description: Use when the user asks to refactor, clean up, simplify, split a large component, extract a hook, remove duplication or dead code, or rename things — any change meant to improve structure without changing behavior.
---

# Refactoring in Guestna B2B

## Ground rules
- **Behavior must not change** — same rendered output, same API calls/payloads, same Redux actions, same translations.
- Refactor only what was asked; separate refactors from feature changes.
- Small steps, each lint-clean. No tests exist → after refactoring, list the exact screens/flows the user should click through to verify.
- Don't delete commented-out legacy blocks unless the user asks (many files keep them intentionally).

## Size limits (signals, not laws)
- Component file > ~250 lines or > ~3 responsibilities → split.
- Function > ~40 lines or nesting > 3 levels → extract or early-return.
- > 8 props that travel together → group (`trip`, `filters`) or rethink the split.

## Splitting a component — follow `forms/schoolTripBookingForm/`
```
FeatureName/
  index.jsx        # state + orchestration
  constants.js     # INITIAL_VALUES, STEPS, field maps
  utils.js         # pure helpers (buildPayload, formatters)
  steps/ or parts/ # presentational pieces
```
- Pure helpers → `utils.js` (or `src/utils/helpers` if reused across domains).
- Static config/arrays → `constants.js` (or `src/constants`).

## Extract a custom hook when
- Stateful logic (query + derived state + handlers) is repeated or obscures JSX.
- Place in `src/hooks/<area>/useX.js` (data → `hooks/data`, forms → `hooks/forms`, domain → e.g. `hooks/schoolRegister`).
- Hook returns an object `{ data, isLoading, handleX }`; it must not render.
- Before writing, grep `src/hooks` — `useFetchData`, `useMutationData`, `useAxiosForm`, `useAxiosAction`, `usePaginatedTrips` may already cover it.

## Duplication
- Same markup in 3+ places → component; 2 places → leave it unless they must stay in sync.
- Same Yup rules → shared builder in `src/utils/validators/validationSchemas.js`.
- No premature abstraction: no generic "config-driven" components for a single use, no option flags for hypothetical cases.

## Naming
- Components `PascalCase.jsx`; hooks `useCamelCase.js`; constants `UPPER_SNAKE`; booleans `is/has/should`; handlers `handleX`, props `onX`.
- Name by domain meaning (`availableDays`), not type (`arr`, `data2`).

## Dead code
- Remove unused imports/vars/props you touched (ESLint warns). Verify "unused" exports with Grep across `src` before deleting.

## Finish
1. `yarn eslint <changed files>`
2. Grep for old names/import paths to confirm nothing still references them.
3. Report: what moved where (one line each) + manual verification steps.
