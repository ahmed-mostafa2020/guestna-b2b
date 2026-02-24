"use client";

import React, { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@mui/material";
import Pagination from "@components/common/Pagination";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

const buildColumns = (t, locale) => [
  {
    key: "orderId",
    header: t("profile.tables.customEventBooking.header.orderId"),
    getValue: (row) => row.orderId,
    render: (v) => {
      const full = String(v ?? "");
      const display =
        full.length > 10
          ? full.substring(0, 10).toUpperCase() + "..."
          : full.toUpperCase();
      return { display, title: full };
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
      title: String(v ?? ""),
    }),
  },
  {
    key: "price",
    header: t("profile.tables.customEventBooking.header.price"),
    getValue: (row) => row.price,
    render: (v) => ({
      display: v != null ? formatCurrency(v) : "-",
      title: String(v ?? ""),
    }),
  },
  {
    key: "client.name",
    header: t("profile.tables.customEventBooking.header.client.studentName"),
    getValue: (row) => row.client?.name,
    render: (v) => ({ display: v ?? "-", title: String(v ?? "") }),
  },
  {
    key: "client.phone",
    header: t("profile.tables.customEventBooking.header.client.parentPhone"),
    isPhone: true,
    optional: true,
    getValue: (row) => row.client?.phone,
    render: (v) => ({ display: v ?? "-", title: String(v ?? "") }),
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
    render: (v) => ({ display: v ?? "-", title: String(v ?? "") }),
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const TableHead = memo(({ columns }) => (
  <thead>
    <tr className="bg-table-header border-b-2 border-tableRowBorder">
      {columns.map((col) => (
        <th
          key={col.key}
          className="px-4 py-4 font-semibold text-start whitespace-nowrap text-sm"
        >
          {col.header}
        </th>
      ))}
    </tr>
  </thead>
));
TableHead.displayName = "CampTableHead";

const TableBody = memo(({ columns, rows, keyPrefix = "" }) => (
  <tbody>
    {rows.map((row, index) => (
      <tr
        key={(row._id || index) + keyPrefix}
        className="border-b border-table-border last:border-b-0 transition-colors hover:bg-gray-50"
      >
        {columns.map((col) => {
          const { display, title } = col.render(col.getValue(row));
          return (
            <td
              key={col.key}
              title={title}
              dir={col.isPhone ? "ltr" : undefined}
              className={`px-4 py-4 text-sm font-medium text-foreground truncate max-w-[150px] overflow-hidden ${
                col.isPhone ? "text-end" : ""
              }`}
            >
              {display}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
));
TableBody.displayName = "CampTableBody";

const MobileCards = memo(({ columns, rows }) => (
  <div className="space-y-4 md:hidden">
    {rows.map((row, index) => (
      <Card
        key={(row._id || index) + "_mobile"}
        className="transition-shadow shadow-md hover:shadow-lg"
      >
        <CardContent className="p-4 space-y-3">
          {(() => {
            const col = columns[0];
            const { display, title } = col.render(col.getValue(row));
            return (
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs text-muted-foreground shrink-0">
                  {col.header}
                </span>
                <span
                  title={title}
                  dir={col.isPhone ? "ltr" : undefined}
                  className="text-base font-medium truncate overflow-hidden block max-w-[60%]"
                >
                  {display}
                </span>
              </div>
            );
          })()}

          {columns.slice(1).map((col) => {
            const { display, title } = col.render(col.getValue(row));
            return (
              <div
                key={col.key}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-xs text-muted-foreground shrink-0">
                  {col.header}
                </span>
                <span
                  title={title}
                  dir={col.isPhone ? "ltr" : undefined}
                  className="font-medium text-foreground max-w-[60%] text-end truncate overflow-hidden block"
                >
                  {display}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    ))}
  </div>
));
MobileCards.displayName = "CampMobileCards";

// ── Main ──────────────────────────────────────────────────────────────────────

const RamadanCampTable = ({ rows, pageInfo, currentPage, onPageChange }) => {
  const t = useTranslations();
  const locale = useLocale();

  const columns = React.useMemo(() => {
    const all = buildColumns(t, locale);
    return all.filter(
      (col) =>
        !col.optional ||
        rows.some((row) => {
          const v = col.getValue(row);
          return v != null && v !== "";
        })
    );
  }, [t, locale, rows]);

  const title = t("profile.tables.customEventBooking.titles.RAMADAN_CAMP");

  const TableCard = ({ className, children }) => (
    <Card
      className={className}
      sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}
    >
      {title && (
        <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
          {title}
        </h2>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">{children}</table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6 mt-6">
      {/* Desktop */}
      <TableCard className="hidden lg:block">
        <TableHead columns={columns} />
        <TableBody columns={columns} rows={rows} />
      </TableCard>

      {/* Tablet */}
      <TableCard className="hidden md:block lg:hidden">
        <TableHead columns={columns} />
        <TableBody columns={columns} rows={rows} keyPrefix="_tablet" />
      </TableCard>

      {/* Mobile */}
      <MobileCards columns={columns} rows={rows} />

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
