---
name: data-table
description: Use when building or changing a table/list screen — columns, row actions, pagination, per-page, search, filters, sorting, row selection/bulk actions, mobile cards, or an export button — e.g. orders, bookings, students, users, transactions, reports.
---

# Tables in Guestna B2B

## Pieces (reuse — don't build raw `<table>`s)

- `@components/ui/DataTable` — columns config, loading skeleton, empty state, pagination, row actions, selection + bulk actions, sorting, mobile cards.
- `@components/ui/Pagination`, `@components/ui/PerPageSelector`, `@components/ui/TableSkeleton`.
- `@components/ui/SearchHeader` (title + debounced search, `setSearchTerm`), `ui/searchAndFilters/*` (`SearchAndFilters`, `FilterAutoComplete`, `DatePickUpInput`).
- `@components/ui/ExportButton` + `useExcel` (see `excel-export` skill).
- Examples: `features/myWallet/transactions/TransactionsTable.jsx` (simple), `features/profile/bookings-management/bookings/BookingsTable.jsx`, `.../CustomEventBooking/*Table.jsx`.

## Structure

- Page (`app/[locale]/.../page.jsx`) owns the state (`page`, `perPage`, `search`, filters, sort) and the `useFetchData` call. The table component under `components/features/<domain>/` stays presentational and is wrapped in `memo`.
- Params in `useMemo`. Reset `page` to 1 when search, filters or perPage change.

## Columns

```jsx
const columns = useMemo(
  () => [
    { key: "name", label: t("x.table.name"), sortable: true },
    {
      key: "date",
      label: t("x.table.date"),
      render: (row) => formatDate(row.date, locale),
    },
    {
      key: "status",
      label: t("x.table.status"),
      render: (row) => <StatusChip status={row.status} />,
    },
  ],
  [t, locale]
);

<DataTable
  title={t("x.table.title")}
  columns={columns}
  data={data?.nodes || []}
  loading={isLoading}
  emptyState={emptyState}
  rowActions={(row) => <Actions row={row} />}
  actionsLabel={t("common.actions")}
  pagination={
    data?.pageInfo
      ? { currentPage, pageInfo: data.pageInfo, onPageChange: setCurrentPage }
      : undefined
  }
/>;
```

- Labels translated, never hard-coded. Fallback values like "—" are fine, but no Arabic or English literals (`"رحلة"`).
- Status → translated `common.*Status` keys plus `status.*` color tokens.
- Dates, money and numbers formatted per locale. Phones and IDs in `dir="ltr"`.
- Long text → `truncateText` with a tooltip.
- `rowKey` defaults to `row._id`. Pass it if the API uses a different id.

## States

- First load → skeleton. Refetch (page or filter change) → keep the rows and show a light indicator, don't flash the skeleton.
- Empty → different messages for "no data yet" vs "no results for these filters" (with a clear-filters action).
- Error → error component with retry.

## Row actions

- Gate each action with `CanPerformElement` / `hasElement` (see `permissions` skill).
- Destructive actions → confirm modal (`customizedModal`), loading on the confirm button, then invalidate the list query.
- Icon-only buttons need `aria-label` + `Tooltip`.

## Responsive & RTL

- Use `mobileCard` for small screens when there are more than 4 columns. Never let the page scroll horizontally.
- Logical alignment (`text-start`). Arrow icons in pagination flip in RTL.

## Server vs client

- Paging, sorting and search on the server when the API supports it (send the params). Client-side only for small, fully loaded lists.
- Export = every row that matches the filters (fetch all pages), not just the visible page.

## Checklist

- [ ] Uses `DataTable` + shared pagination/search
- [ ] Stable params; page resets on filter change
- [ ] Translated labels, formatted values
- [ ] Skeleton / empty / no-results / error states
- [ ] Actions permission-gated; destructive ones confirmed
- [ ] Mobile view checked in ar + en
