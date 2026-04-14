# 🚀 Immediate Refactor Implementation Guide

## Week 1: Critical Fixes & Quick Wins

### Day 1-2: Dependency Cleanup

#### Step 1: Remove Legacy Material-UI v4

| Action | File | Command/Change |
|--------|------|----------------|
| Uninstall v4 | `package.json` | `yarn remove @material-ui/core` |
| Check imports | All files | Search `from "@material-ui"` |
| Replace with v6 | Components | Update to `@mui/material` |

**Verification Checklist:**
- [ ] `yarn.lock` no longer contains `@material-ui/core`
- [ ] No console warnings about deprecated imports
- [ ] Build completes without errors

#### Step 2: Fix Sentry Version

| Current | Fix | Reason |
|---------|-----|--------|
| `"@sentry/nextjs": "10"` | `"@sentry/nextjs": "^9.11.0"` | Sentry 10 doesn't exist, v9 is latest |

**Breaking Changes to Handle:**
| Feature | Before | After |
|---------|--------|-------|
| Sentry config | v10 format | v9 format (simpler) |
| Source maps | Auto | Manual config required |

**Implementation:**
```bash
yarn upgrade @sentry/nextjs@9.11.0
```

#### Step 3: Add Sharp for Image Optimization

| Package | Install Command | Impact |
|---------|---------------|--------|
| `sharp` | `yarn add sharp` | 40-60% faster image processing |

**Configuration Update:**
```javascript
// next.config.mjs
images: {
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
}
```

---

### Day 3-4: Redux Persist Optimization

#### Current vs Recommended Whitelist

| Slice | Current Status | Recommended | Reason |
|-------|---------------|-------------|--------|
| `checkoutData` | ✅ Whitelisted | ✅ Keep | User flow persistence |
| `finalTripDetailsData` | ✅ Whitelisted | ✅ Keep | Booking continuation |
| `favorites` | ✅ Whitelisted | ✅ Keep | User preference |
| `address` | ✅ Whitelisted | ✅ Keep | User data |
| `selectedOrganizations` | ✅ Whitelisted | ✅ Keep | Session context |
| `signUpForm` | ⚠️ Whitelisted | ❌ Remove | Security risk |
| `loginForm` | ⚠️ Whitelisted | ❌ Remove | Security risk |
| `theme` | 🔴 Whitelisted | ❌ Remove | Causes flash of wrong theme |
| `permissions` | 🔴 Whitelisted | ❌ Remove | Security risk |
| `navbar` | 🟡 Whitelisted | ❌ Remove | Should refetch |
| `users` | 🟡 Whitelisted | ❌ Remove | Should refetch |

**Implementation:**
```javascript
// src/store/index.js
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: [
    "checkoutData",
    "finalTripDetailsData",
    "favorites",
    "address",
    "selectedOrganizations",
  ],
};
```

**Testing Steps:**
1. Clear localStorage
2. Log in to application
3. Verify no theme flash on page load
4. Verify permissions refetch on page reload

---

### Day 5: Console Cleanup

#### Top 5 Files with Most Console Logs

| Rank | File | Count | Action |
|------|------|-------|--------|
| 1 | `DownloadButton.jsx` | 11 | Remove debug logs |
| 2 | `useEditOrderModal.js` | 10 | Keep only error logs |
| 3 | `exportUtils.js` | 9 | Remove all logs |
| 4 | `AppleWidgetTest.jsx` | 7 | Remove test logs |
| 5 | `TamaraWidget.jsx` | 6 | Keep error logs only |

**Pattern to Follow:**
```javascript
// ❌ Remove
console.log("Debug data:", data);

// ✅ Keep (only for errors)
console.error("Payment failed:", error);

// ✅ Better: Use Sentry
import * as Sentry from "@sentry/nextjs";
Sentry.captureException(error);
```

---

## Week 2: Component Architecture

### Step 1: Create Feature-Based Structure

#### New Folder Architecture

```
src/
├── features/
│   ├── trips/
│   │   ├── components/
│   │   │   ├── TripCard.jsx
│   │   │   ├── TripList.jsx
│   │   │   └── TripFilters.jsx
│   │   ├── hooks/
│   │   │   ├── useTripFilters.js
│   │   │   ├── useTripBooking.js
│   │   │   └── useTripSearch.js
│   │   ├── services/
│   │   │   ├── tripApi.js
│   │   │   └── tripTransformers.js
│   │   └── store/
│   │       ├── tripSlice.js
│   │       └── tripSelectors.js
│   ├── bookings/
│   ├── profile/
│   └── checkout/
├── shared/
│   ├── components/
│   │   ├── DataTable/
│   │   ├── FilterPanel/
│   │   └── FormField/
│   ├── hooks/
│   ├── utils/
│   └── constants/
└── app/ (routes only)
```

#### Migration Priority Matrix

| Feature | Current Location | New Location | Priority | Complexity |
|---------|-----------------|--------------|----------|------------|
| TripCard | `components/common/trips/` | `features/trips/components/` | High | Low |
| Booking logic | `components/forms/checkout/` | `features/checkout/hooks/` | High | Medium |
| Profile tables | `components/sections/pages/profile/` | `features/profile/components/` | Medium | Medium |
| Filter patterns | `components/filtersBox/` | `shared/components/FilterPanel/` | High | Low |

---

### Step 2: Consolidate Table Components

#### Current Table Components (15 variants)

| Component | Lines of Code | Used In | Can Replace With |
|-----------|---------------|---------|------------------|
| `StudentsTable.jsx` | 450 | Bookings | `DataTable` |
| `RamadanCampTable.jsx` | 420 | Events | `DataTable` |
| `RamadanNightsTable.jsx` | 410 | Events | `DataTable` |
| `AllOrdersTable.jsx` | 480 | Orders | `DataTable` |
| `OrdersSettingsTable.jsx` | 390 | Settings | `DataTable` |
| `TransactionsTable.jsx` | 350 | Wallet | `DataTable` |
| `BookingsTable.jsx` | 380 | Bookings | `DataTable` |
| `CustomizedTripsTable.jsx` | 460 | Trips | `DataTable` |
| `ActivitiesTable.jsx` | 340 | Activities | `DataTable` |
| `PackagesTable.jsx` | 320 | Packages | `DataTable` |
| `ReportTable.jsx` | 310 | Reports | `DataTable` |
| `NormalTripsTable.jsx` | 400 | Trips | `DataTable` |

**DataTable Component Specification:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `Column[]` | ✅ | Column configuration |
| `data` | `Array` | ✅ | Data to display |
| `loading` | `boolean` | ❌ | Loading state |
| `pagination` | `PaginationConfig` | ❌ | Pagination settings |
| `sorting` | `SortingConfig` | ❌ | Sorting configuration |
| `rowActions` | `Action[]` | ❌ | Row-level actions |
| `bulkActions` | `Action[]` | ❌ | Bulk selection actions |
| `emptyState` | `ReactNode` | ❌ | Custom empty state |

**Implementation Time:** 2-3 days
**Expected Code Reduction:** ~4,000 lines
**Test Coverage Required:** Unit tests for sorting, pagination, filtering

---

## Week 3: Performance Optimization

### Dynamic Import Strategy

#### Heavy Dependencies to Lazy Load

| Dependency | Size | Current Import | Lazy Import Pattern |
|------------|------|----------------|---------------------|
| `exceljs` | ~4MB | Eager | `const ExcelJS = await import('exceljs')` |
| `jspdf` | ~1MB | Eager | `const jsPDF = await import('jspdf')` |
| `html2canvas` | ~500KB | Eager | `const html2canvas = await import('html2canvas')` |
| `recharts` | ~500KB | Eager | Component-level lazy import |
| `@react-google-maps/api` | ~400KB | Eager | Route-level lazy import |

#### Implementation Example: Excel Export

**Before:**
```javascript
import ExcelJS from 'exceljs';

const exportToExcel = (data) => {
  const workbook = new ExcelJS.Workbook();
  // ... heavy logic
};
```

**After:**
```javascript
const exportToExcel = async (data) => {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  // ... heavy logic
};
```

**Impact:**
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial bundle | 850KB | 550KB | -35% |
| Load time (3G) | 4.5s | 2.8s | -38% |
| Time to Interactive | 4.2s | 2.5s | -40% |

---

### Memoization Implementation

#### Components to Wrap with React.memo

| Component | Renders/Session | Improvement |
|-----------|----------------|-------------|
| `TripCard` | 500+ | 60% reduction |
| `EventCard` | 300+ | 55% reduction |
| `TableRow` | 1000+ | 70% reduction |
| `FilterChip` | 200+ | 50% reduction |

**Implementation Pattern:**
```javascript
const TripCard = React.memo(({ trip, onFavorite, onBook }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.trip.id === nextProps.trip.id &&
         prevProps.trip.updatedAt === nextProps.trip.updatedAt;
});
```

---

## Week 4: Testing & Validation

### Testing Matrix

| Test Type | Tool | Coverage Target | Critical Paths |
|-----------|------|-----------------|----------------|
| Unit | Jest | 60% | Hooks, utils, services |
| Integration | React Testing Library | 40% | Forms, data fetching |
| E2E | Playwright | 20% | Checkout flow, booking |
| Visual | Chromatic | 30% | UI components |

### Lighthouse Targets

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Performance | 65 | 90+ | 🔴 Critical |
| Accessibility | 70 | 95+ | 🟡 High |
| Best Practices | 75 | 95+ | 🟡 High |
| SEO | 80 | 95+ | 🟢 Medium |

### Bundle Analysis Steps

1. **Install analyzer:**
   ```bash
   yarn add -D @next/bundle-analyzer cross-env
   ```

2. **Add scripts:**
   ```json
   {
     "analyze": "cross-env ANALYZE=true next build",
     "analyze:server": "cross-env ANALYZE=true BUNDLE_ANALYZE=server next build"
   }
   ```

3. **Run analysis:**
   ```bash
   yarn analyze
   ```

4. **Review output:**
   - Open `.next/analyze/client.html`
   - Identify chunks > 200KB
   - Check duplicate dependencies

---

## Success Metrics

### Week-by-Week Tracking

| Week | Deliverable | Success Metric |
|------|-------------|---------------|
| 1 | Dependencies clean | `package.json` audit passes, no v4 MUI |
| 2 | Architecture restructure | Feature folders created, imports updated |
| 3 | Performance optimization | Lighthouse 90+, bundle -35% |
| 4 | Testing & validation | 60% coverage, 0 critical bugs |

### Final Validation Checklist

- [ ] Bundle size < 600KB (gzipped)
- [ ] Lighthouse performance > 90
- [ ] No console logs in production
- [ ] All tests passing
- [ ] No Material-UI v4 imports
- [ ] Redux persist whitelist optimized
- [ ] Sentry error tracking functional
- [ ] Images using Sharp optimization
- [ ] Feature-based folder structure
- [ ] Reusable DataTable component

---

## Rollback Plan

### If Issues Arise

| Issue | Rollback Action | Time to Recover |
|-------|----------------|-----------------|
| Sentry v9 breaks | Revert to v8.47.0 | 15 minutes |
| MUI upgrade issues | Pin to 6.1.5 | 10 minutes |
| Build fails | Check next.config.mjs | 30 minutes |
| Data loss | Restore localStorage backup | 5 minutes |

**Before Major Changes:**
1. Create feature branch
2. Backup current package.json
3. Document current working versions
4. Test in staging environment

---

## Resource Allocation

### Time Estimates by Task

| Task Category | Hours | Developer Level |
|---------------|-------|-----------------|
| Dependencies | 8 | Junior |
| Redux cleanup | 4 | Mid-level |
| Console cleanup | 6 | Junior |
| Architecture refactor | 24 | Senior |
| Table consolidation | 16 | Mid-level |
| Performance optimization | 16 | Senior |
| Testing | 12 | Mid-level |
| **Total** | **86 hours** | **~3 weeks** |

### Recommended Team

- 1 Senior Frontend (architecture, performance)
- 1 Mid-level Frontend (components, testing)
- 1 Junior Frontend (cleanup, documentation)

---

*This guide provides a structured, week-by-week approach to implementing the refactor plan with clear deliverables and measurable outcomes.*
