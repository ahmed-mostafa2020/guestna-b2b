---
name: excel-export
description: Use when exporting data to Excel, generating an Excel template, importing/parsing an uploaded .xlsx (bulk upload), or changing Excel headers, styling, or column validation.
---

# Excel import/export in Guestna B2B (ExcelJS)

## Pieces

- `src/utils/exports/excelService.js` — `ExcelService` (ExcelJS **lazy-loaded** via `getExcelJS()`; never import `exceljs` statically anywhere else).
  - Generic: `generateTemplate`, `parseExcelFile`, `exportRecords` — all driven by a headers config.
  - Bespoke reports: `exportMyBooking`, `exportStudentsList`, `exportStudentInvoice`, `exportBookingManagement`, `exportStudentDetails`.
  - Helpers: `hasCellData`, `filterEmptyColumns`, `getColLetter`, `autoFitColumns`, `styleHeaderRow`.
- `src/hooks/utils/useExcel.js` — `useExcel({ headers, t, locale })` → `{ createTemplate, parseFile, exportRecords, export*…, isExporting, error }`; handles snackbars.
- `src/constants/excelHeaders.js` — header configs.
- `src/hooks/utils/useDownload.js` — `download(blob, filename)`.
- Bulk import UI example: `src/components/forms/bulkUserImport/`.

## Headers config

```js
export const xHeaders = ({ locale = "en" } = {}) => [
  {
    key: "name",
    label: { ar: "الاسم", en: "Name" },
    width: 20,
    validation: {
      type: "text",
      required: true,
      errorTitle: { ar: "...", en: "..." },
      message: { ar: "...", en: "..." },
    },
  },
  {
    key: "phone",
    label: { ar: "رقم الجوال", en: "Phone" },
    style: { numFmt: "@" },
  }, // keep leading zeros
];
```

- `key` = the record field; labels in both languages (header matching in `parseExcelFile` uses them).
- Phones, national IDs, and codes → `numFmt: "@"` (text) so Excel doesn't drop zeros or use scientific notation.

## Decide: generic or bespoke

- Flat table → `exportRecords` with a headers config. **Prefer this.**
- Multi-section report (info block + table, multiple sheets) → add a new `ExcelService.exportX` next to the existing ones, then expose it via `useExcel`.

## Rules

- Arabic exports: `worksheet.views = [{ rightToLeft: true }]` when `locale === "ar"`.
- Header row via `styleHeaderRow`; then `autoFitColumns`.
- Dates via `formatDate`; money via the existing currency formatter in the service; never raw ISO strings.
- Drop all-empty columns with `filterEmptyColumns` / `hasCellData`.
- Filenames: translated base + date, e.g. `${t("exportUtils.bookingReport.title")}-${date}.xlsx`.
- Button: show `isExporting` as loading/disabled; label translated; snackbar on success/failure (the hook does it).
- Large lists: fetch all pages before exporting (not just the current table page). Confirm the endpoint/params.
- Import: validate parsed rows against the same rules as the form (Yup schema), show per-row errors, and never auto-submit invalid rows.

## Checklist

- [ ] No static `exceljs` import
- [ ] Headers ar+en; text format for phone/ID columns
- [ ] RTL sheet for Arabic
- [ ] Loading state + translated filename/labels
- [ ] Opened the generated file mentally: no empty columns, dates readable
