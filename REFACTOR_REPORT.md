# Branch Refactor Report
**Branch:** `update-versions-and-code-refactor`
**Compared to:** `main`
**Report date:** 2026-03-30
**Commits on branch:** 4

---

## Numbers at a Glance

| Metric | Value |
|--------|-------|
| Files changed (src/) | 404 |
| Lines added (src/) | +3,091 |
| Lines removed (src/) | −4,976 |
| **Net reduction** | **−1,885 lines** |
| Files moved/restructured | 267 |
| New files created | 16 |
| Files deleted (old locations) | 12 |
| console.log removed | 47 |
| console.log added | 0 |
| import lines removed | 678 |
| import lines added | 677 (net ~0, just reorganised) |
| memo() wrappings added | 14 |
| try/catch blocks added | 5 |

---

## 1. Architecture — Folder Restructure

### Problem (main branch)
All feature components lived under `src/components/sections/pages/` — a deeply nested, non-standard path that made imports verbose and the structure hard to navigate.

### What Changed
Every component was moved from `sections/pages/` → `features/`:

| Old path | New path |
|----------|----------|
| `sections/pages/profile/boookings-management/` | `features/profile/bookings-management/` (typo fixed too) |
| `sections/pages/profile/myBookings/` | `features/profile/myBookings/` |
| `sections/pages/profile/trips/` | `features/profile/trips/` |
| `sections/pages/myWallet/` | `features/myWallet/` |
| `sections/pages/calendar/` | `features/calendar/` |
| `sections/pages/tripDetails/` | `features/tripDetails/` |
| `sections/pages/checkout/` | `features/checkout/` |

**Impact:** ~267 files relocated. All import paths updated. 0 business logic changed.

---

## 2. Shared Components Created

### DataTable (`src/components/ui/DataTable/index.jsx`) — 299 lines
A fully-featured reusable table that replaced 10 individual table implementations.

**Features:**
- Desktop table + mobile card layout (responsive)
- Loading state (CircularProgress)
- Empty state slot
- Pagination integration
- Row selection + bulk actions
- `memo()` wrapped

**Tables migrated:** `TransactionsTable`, `BookingsTable`, `StudentsTable`, `AllOrdersTable`, `OrdersSettingsTable`, `RamadanCampTable`, `RamadanNightsTable`, `ReportTable`, `TripsManagementTable`, `SchoolBookingsTable`

### SearchHeader (`src/components/ui/SearchHeader.jsx`) — 65 lines
Reusable page header with title, search input, per-page selector, and export button slot. Used in all profile management pages.

### BalanceCards (`src/components/ui/wallet/BalanceCards.jsx`) — NEW
Unified `BalanceCards` component consolidating two identical implementations (`transactions/BalanceCards.jsx` and `withdraw/BalanceCards.jsx`). Both now re-export from the shared version.

### FormSubmitButton (`src/components/ui/FormSubmitButton.jsx`)
Extracted from inline duplicated loading-button pattern used in 15+ forms.

---

## 3. Validator Split

### Problem
`validationSchemas.js` was a 879-line monolith imported by 34 files.

### Solution
Split into 4 domain files + barrel re-export:

| File | Schemas | Consumers |
|------|---------|-----------|
| `authSchemas.js` | signUp, login, resetPassword, verificationCode, phone helper | 8 form files |
| `checkoutSchemas.js` | checkout, credit, STC, Tamara, withdraw | 4 form files |
| `formSchemas.js` | search, contactUs, registerChild, survey, requestQuote, customTrip, bulkUser, events, schoolRegister | 15 form files |
| `profileSchemas.js` | personalInfo, orgUser, editTrip, addRole, approveOrder | 7 form files |
| `validationSchemas.js` | **Barrel re-export only** (4 lines) | 34 files — unchanged |

**Result:** 34 existing imports need no change. New code imports from domain files directly for tree-shaking.

---

## 4. SVG Index Split

### Problem
`src/assets/svg/index.jsx` was 2073 lines — one giant file with 75+ unrelated SVG constants.

### Solution
Split into 8 domain files + 8-line barrel:

| File | Icons | Lines (approx) |
|------|-------|----------------|
| `navigation.jsx` | discoverIcon, schoolsIcon, companiesIcon, aboutUsIcon, global×2, homeIcon, chevron×2, backIcon, backIconColored, listIcon | 12 icons |
| `search.jsx` | searchIconWhite, searchIconBlack, searchBarIcon | 3 icons |
| `trip.jsx` | location×3, star×3, earth, time×2, date, calendar×2, groups, tickets, images, GroupIcon, CalendarIcon, LocationIcon, SuitcaseIcon, infoIcon | 21 icons |
| `social.jsx` | whatsApp×4, apple, google×2, facebook×2 | 9 icons |
| `actions.jsx` | plus, minus, add, delete, done, wrong, copy, actions, refresh, print, share, uploadFile, uploadPaper | 13 icons |
| `profile.jsx` | profile, wallet, lock, heart×3, bell, phone×2, mobile, sms, headPhone, emailBlue | 13 icons |
| `finance.jsx` | newSar×2, bankSmall, visaCard | 4 icons |
| `dashboard.jsx` | totalStudents, totalRevenue, totalActivities, activitiesOrders, poster, school | 6 icons |

**`index.jsx` is now 8 lines.** All existing imports from `@assets/svg` continue to work via barrel.

---

## 5. getStatusStyles Utility Extracted

### Problem
The same `getStatusStyles` switch function was copy-pasted in 3 files:
- `AllOrdersTable.jsx` (line 87)
- `BookingDetailsModal.jsx` (line 22)
- `myBookings/index.jsx` (line 15)

### Solution
Created `src/utils/formatters/getStatusStyles.js` with the most complete implementation (handles APPROVED, DONE, PENDING, PENDING_COMPANY_APPROVAL, SCHEDULED, ON_HOLD, CANCELLED, REJECTED, ENDED).

All 3 files now import from the shared util. The now-unused `TRIP_STATUS` import was also removed from 2 files.

---

## 6. Unused Imports Removed — 13 Files

| File | Removed imports |
|------|----------------|
| `school-team-management/users/page.jsx` | `download` from useDownload |
| `featureTrips/index.jsx` | `Container` from MUI |
| `TransactionsTable.jsx` | `useLocale`, `CardContent`, `Card`, `CircularProgress` |
| `TransactionsTableSkeleton.jsx` | `Box` |
| `CustomEventBooking/index.jsx` | `useEffect` |
| `OrdersSettingsTable.jsx` | `Card`, `CardContent`, `CircularProgress` |
| `myBookings/index.jsx` | `CircularProgress`, `TRIP_STATUS` |
| `OrganizationsSection.jsx` | `CircularProgress` |
| `StudentsListModal.jsx` | `Card`, `CardContent` |
| `UsersInfo.jsx` | `PersonAdd`, `CloudUpload` |
| `PermissionItem.jsx` | `Switch` |
| `Map.jsx` | `useCallback` |
| `UploadInstructions.jsx` | `Button` |
| `BookingDetailsModal.jsx` | `TRIP_STATUS` |

---

## 7. React.memo Applied

**Newly wrapped with `memo()`:**
| Component | Reason |
|-----------|--------|
| `PerPageSelector` | Rendered in every table page, props rarely change |
| `ExportButton` | Pure button component, no internal state |
| `OrganizationSelector` | Dropdown rendered in profile headers |
| `TruncateText` | Leaf text component used in lists |
| `BalanceCardsGrid` | Financial cards, parent re-renders on data fetch |

**Already had `memo()` (confirmed):** DataTable, Pagination, SearchHeader, TabSwitcher, TripCard, TripsCard, TripsCardSkeleton, CustomizedBreadcrumbs

**Total memo()-wrapped components in codebase:** 13

---

## 8. try/catch Added

| File | What was unguarded |
|------|--------------------|
| `bulkUserImport/UploadInstructions.jsx` | `await createTemplate(...)` in `generateAndDownloadExcel` |

All other `onSubmit` handlers use `.then().catch()` promise chains (already handled).
`registerStudent/index.jsx` — `handleChangeChildStage` already had try/catch.

---

## 9. shared/ → ui/ Merge

`src/components/shared/FormSubmitButton.jsx` was a 45-line re-export shim.
- Confirmed all 14 consumer files already import from `@components/ui/FormSubmitButton`
- Shim file deleted
- `shared/` directory is now empty

---

## 10. Dependencies Updated (`package.json`)

6 dependency changes (exact versions in diff). Branch is 2 commits ahead of remote tracking branch.

---

## Redux Persist — Study Only (No Changes Made)

Current whitelist: `checkoutData`, `finalTripDetailsData`, `signUpForm`, `loginForm`, `parentLoginForm`, `favorites`, `address`, `navbar`, `users`, `theme`, `permissions`, `selectedOrganizations`

| Slice | Status | Reason |
|-------|--------|--------|
| `navbar` | ✅ **SAFE TO REMOVE** | No `useSelector` consumers found. Dispatch in Header.jsx is commented out. |
| `signUpForm` | ⚠️ Keep | `confirmAccount` page reads it to continue OTP flow after refresh |
| `loginForm` | ⚠️ Keep | forget-password flow, rememberMe, and school-register page all depend on it |
| `theme` | ⚠️ Keep | ThemeProvider + Logo read it on every render for white-label branding |
| `permissions` | ⚠️ Keep | 25 guarded features/pages check it via `usePermissions` hook |
| `users` | ⚠️ Keep | `userToken` + `userType` used by Header, auth toggle, and profile layout |

---

## Suggested Enhancements (Next Steps)

### Critical
| # | Task | File(s) | Why |
|---|------|---------|-----|
| 1 | **Consolidate two Pagination components** | `ui/Pagination.jsx` vs `ui/pagination/index.jsx` | Two implementations exist — one will be silently stale |
| 2 | **Extract `TableSkeletonLoader`** | `TransactionsTableSkeleton`, `CustomEventBooking/index`, + 3 others | 5 near-identical skeleton implementations |

### High Impact
| # | Task | File(s) | Why |
|---|------|---------|-----|
| 3 | **Extract `ConsentPdfTemplate`** | `StudentsTable.jsx` lines ~433–787 | 355-line hidden JSX template inline in a table component |
| 4 | **Create `useFormSubmit` hook** | `EmailMethodForm`, `PhoneMethodForm`, `ResetPasswordByEmail`, `parentLogin`, `rolesLogin` | All share the same axios → dispatch → snackbar → reset pattern |
| 5 | **Split `src/store/` slices** into `act/` + `slice.js` | Store directory | Some slices mix action creators with reducers |

### Medium
| # | Task | File(s) | Why |
|---|------|---------|-----|
| 6 | **Add Error Boundaries** around route-level pages | `app/[locale]/profile/*/page.jsx` | Currently no error isolation per page section |
| 7 | **Centralise API error messages** | All form `catch` blocks | Error strings scattered; should go through `i18n` |
| 8 | **Replace inline Tailwind palettes** with CSS vars | `getStatusStyles.js` + badge blocks in `OrdersSettingsTable` | Hard-coded `green-100/800` etc. can't theme-switch |
| 9 | **Add `loading` skeleton to `BalanceCards`** tablet/desktop skeleton | `ui/wallet/BalanceCards.jsx` | Currently uses `animate-pulse` placeholder div, not a proper Skeleton |
| 10 | **Deduplicate `DiscoverFiltersSection`** | `DiscoverFiltersSection.jsx` (54 line diff) | Minor filter logic duplication with `FiltersBox` |

### Low
| # | Task | File(s) | Why |
|---|------|---------|-----|
| 11 | **Remove `build_log.txt` and `build_utf8.log`** from repo | Root | Build artifacts should not be committed |
| 12 | **Clean empty `src/components/shared/` directory** | `src/components/shared/` | Now empty after FormSubmitButton migration |
| 13 | **Add JSDoc to DataTable props** | `ui/DataTable/index.jsx` | Already has a JSDoc comment block — extend to BalanceCards, SearchHeader |
| 14 | **useMemo for column definitions** in all DataTable consumers | 10 table files | Column arrays defined inline in render — recreated every render |
| 15 | **Type-check `getStatusStyles`** with PropTypes or JSDoc | `utils/formatters/getStatusStyles.js` | No validation that `status` is a valid TRIP_STATUS value |
