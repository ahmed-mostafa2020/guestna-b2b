"use client";

import React, { memo, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@mui/material";
import Pagination from "@components/common/Pagination";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

// ── Column Configuration ──────────────────────────────────────────────────────

const buildColumns = (t, locale) => [
  {
    key: "orderId",
    header: t("profile.tables.customEventBooking.header.orderId"),
    getValue: (row) => row.orderId,
    render: (v) => {
      const full = String(v ?? "");
      const display = full.toUpperCase();
      return { display, title: full.toUpperCase() };
    },
  },
  {
    key: "bookingDay",
    header: t("profile.tables.customEventBooking.header.bookingDay"),
    getValue: (row) => row.bookingDay,
    render: (v) => ({
      display: v
        ? formatDate(v, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "-",
      title: v ? String(v) : "-",
    }),
  },
  {
    key: "price",
    header: t("profile.tables.customEventBooking.header.price"),
    getValue: (row) => row.price,
    render: (v) => ({
      display: v != null ? formatCurrency(v) : "-",
      title: v != null ? String(v) : "-",
    }),
  },
  {
    key: "client.name",
    header: t("profile.tables.customEventBooking.header.client.studentName"),
    getValue: (row) => row.client?.name,
    render: (v) => ({ display: v ?? "-", title: v ?? "-" }),
  },
  {
    key: "client.phone",
    header: t("profile.tables.customEventBooking.header.client.parentPhone"),
    isPhone: true,
    optional: true,
    getValue: (row) => row.client?.phone,
    render: (v) => ({ display: v ?? "-", title: v ?? "-" }),
  },
  {
    key: "client.gender",
    header: t("profile.tables.customEventBooking.header.client.gender"),
    getValue: (row) => row.client?.gender,
    render: (v) => {
      if (!v) return { display: "-", title: "-" };
      const display = t(`common.${String(v).toUpperCase()}`);
      return { display, title: display };
    },
  },
  {
    key: "organization",
    header: t("profile.tables.customEventBooking.header.organization.name"),
    getValue: (row) => row.organization?.name,
    render: (v) => ({ display: v ?? "-", title: v ?? "-" }),
  },
];

// ── Table Components ──────────────────────────────────────────────────────────

const TableHead = memo(({ columns }) => (
  <thead>
    <tr className="bg-table-header border-b-2 border-tableRowBorder">
      {columns.map((col) => (
        <th
          key={col.key}
          className="px-4 py-4 text-sm font-semibold text-start whitespace-nowrap"
        >
          {col.header}
        </th>
      ))}
    </tr>
  </thead>
));
TableHead.displayName = "TableHead";

const TableBody = memo(({ columns, rows, keyPrefix = "" }) => (
  <tbody>
    {rows.map((row, index) => (
      <tr
        key={`${row._id || index}${keyPrefix}`}
        className="border-b border-table-border last:border-b-0 hover:bg-gray-50 transition-colors"
      >
        {columns.map((col) => {
          const { display, title } = col.render(col.getValue(row));
          return (
            <td
              key={col.key}
              title={title}
              dir={col.isPhone ? "ltr" : undefined}
              className={`px-4 py-4 text-sm font-medium text-foreground ${
                col.isPhone ? "text-end" : ""
              }`}
            >
              <div className="truncate max-w-[200px]">{display}</div>
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
));
TableBody.displayName = "TableBody";

// ── Mobile Components ─────────────────────────────────────────────────────────

const MobileCard = memo(({ columns, row, index }) => (
  <Card
    key={`${row._id || index}_mobile`}
    className="shadow-md hover:shadow-lg transition-shadow"
  >
    <CardContent className="p-4 space-y-3">
      {/* First Column - Featured */}
      {(() => {
        const col = columns[0];
        const { display, title } = col.render(col.getValue(row));
        return (
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {col.header}
            </span>
            <div
              title={title}
              dir={col.isPhone ? "ltr" : undefined}
              className="text-base font-semibold max-w-[60%]"
            >
              <div className="truncate">{display}</div>
            </div>
          </div>
        );
      })()}

      {/* Remaining Columns */}
      {columns.slice(1).map((col) => {
        const { display, title } = col.render(col.getValue(row));
        return (
          <div
            key={col.key}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {col.header}
            </span>
            <div
              title={title}
              dir={col.isPhone ? "ltr" : undefined}
              className={`font-medium text-foreground max-w-[60%] ${
                col.isPhone ? "text-end" : ""
              }`}
            >
              <div className="truncate">{display}</div>
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
));
MobileCard.displayName = "MobileCard";

const MobileCards = memo(({ columns, rows }) => (
  <div className="space-y-4 md:hidden">
    {rows.map((row, index) => (
      <MobileCard
        key={row._id || index}
        columns={columns}
        row={row}
        index={index}
      />
    ))}
  </div>
));
MobileCards.displayName = "MobileCards";

// ── Table Card Wrapper ────────────────────────────────────────────────────────

const TableCard = memo(({ title, className, children }) => (
  <Card
    className={className}
    sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}
  >
    {title && (
      <div className="pt-4 px-4">
        <h2 className="text-xl lg:text-2xl font-medium text-titleColor">
          {title}
        </h2>
      </div>
    )}
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </CardContent>
  </Card>
));
TableCard.displayName = "TableCard";

// ── Main Component ────────────────────────────────────────────────────────────

const RamadanCampTable = ({
  rows = [],
  pageInfo,
  currentPage,
  onPageChange,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const columns = useMemo(() => {
    const allColumns = buildColumns(t, locale);
    // Filter out optional columns that have no data
    return allColumns.filter(
      (col) =>
        !col.optional ||
        rows.some((row) => {
          const value = col.getValue(row);
          return value != null && value !== "";
        })
    );
  }, [t, locale, rows]);

  const title = useMemo(
    () => t("profile.tables.customEventBooking.titles.RAMADAN_CAMP"),
    [t]
  );

  if (!rows || rows.length === 0) {
    return (
      <div className="w-full mt-6">
        <Card
          sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}
        >
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {t("profile.tables.noData") || "No data available"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 mt-6">
      {/* Desktop View */}
      <TableCard title={title} className="hidden lg:block">
        <TableHead columns={columns} />
        <TableBody columns={columns} rows={rows} />
      </TableCard>

      {/* Tablet View */}
      <TableCard title={title} className="hidden md:block lg:hidden">
        <TableHead columns={columns} />
        <TableBody columns={columns} rows={rows} keyPrefix="_tablet" />
      </TableCard>

      {/* Mobile View */}
      <MobileCards columns={columns} rows={rows} />

      {/* Pagination */}
      {pageInfo && (
        <Pagination
          pageInfo={pageInfo}
          currentPage={currentPage}
          onPageChange={onPageChange}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default memo(RamadanCampTable);
