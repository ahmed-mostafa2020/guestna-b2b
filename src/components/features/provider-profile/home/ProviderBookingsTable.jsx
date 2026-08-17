"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { RemoveRedEyeOutlined, KeyboardArrowDown } from "@mui/icons-material";
import formatCurrency from "@utils/formatters/FormatCurrency";
import DataTable from "@components/ui/DataTable";

/* ─── Skeleton ─── */
export const ProviderBookingsTableSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 animate-pulse shadow-card">
    {/* Title + Dropdown */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Skeleton variant="text" width={220} height={32} />
      <Skeleton variant="rounded" width={180} height={42} className="rounded-xl" />
    </div>

    {/* Table rows */}
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-8 gap-3 p-3.5 border-b border-border items-center">
          {Array.from({ length: 8 }).map((_, col) => (
            <Skeleton key={col} variant="text" height={20} />
          ))}
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-center mt-6">
      <Skeleton variant="rounded" width={300} height={40} className="rounded-xl" />
    </div>
  </div>
);

/* ─── Status Badge ─── */
const STATUS_STYLES = {
  PENDING: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
  },
  PENDING_COMPANY_APPROVAL: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
  },
  ON_HOLD: {
    bg: "bg-status-hold-bg",
    text: "text-status-hold-fg",
    border: "border-status-hold-border",
  },
  SCHEDULED: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
  },
  DONE: {
    bg: "bg-status-success-bg",
    text: "text-status-success-fg",
    border: "border-status-success-border",
  },
  CANCELLED: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
  REJECTED: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
};

const StatusBadge = ({ status, label }) => {
  const style = STATUS_STYLES[status] || {
    bg: "bg-status-neutral-bg",
    text: "text-status-neutral-fg",
    border: "border-status-neutral-border",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border ${style.bg} ${style.text} ${style.border} whitespace-nowrap`}
    >
      {label}
    </span>
  );
};

/* ─── Main Component ─── */
const ProviderBookingsTable = ({ data, loading, currentPage, setCurrentPage }) => {
  const t = useTranslations();
  const [b2bFilter, setB2bFilter] = useState("all");

  const rawNodes = data?.nodes || [];
  const pageInfo = data?.pageInfo || {
    total: rawNodes.length,
    currentPage: currentPage || 1,
    perPage: 10,
  };

  // Filter nodes by b2b / b2c if selected
  const filteredNodes = useMemo(() => {
    if (b2bFilter === "b2b") {
      return rawNodes.filter((item) => item.askType === "CUSTOM_TRIP" || item.organization);
    }
    if (b2bFilter === "b2c") {
      return rawNodes.filter((item) => item.askType === "TRIP" && !item.organization);
    }
    return rawNodes;
  }, [rawNodes, b2bFilter]);

  // Dropdown filter options
  const filterOptions = useMemo(
    () => [
      { value: "all", label: t("providerProfile.home.bookingsTable.filters.all") },
      { value: "b2b", label: t("providerProfile.home.bookingsTable.filters.b2b") },
      { value: "b2c", label: t("providerProfile.home.bookingsTable.filters.b2c") },
    ],
    [t]
  );

  // Table columns matching the screenshot
  const columns = useMemo(
    () => [
      {
        key: "orderId",
        label: t("providerProfile.home.bookingsTable.columns.orderId"),
        className: "font-bold text-textDark text-sm sm:text-base",
        render: (row) => String(row.orderId || "1234567890"),
      },
      {
        key: "client",
        label: t("providerProfile.home.bookingsTable.columns.client"),
        render: (row) => {
          const orgName = row.organization || "مدرسة النور المتوسطة";
          const eduSystem = row.track?.educationSystem?.name || (row.askType === "CUSTOM_TRIP" ? "متعددة المسارات" : "عالمي");
          return (
            <div className="flex flex-col">
              <span className="font-bold text-textDark text-sm sm:text-base">
                {orgName}
              </span>
              <span className="text-xs sm:text-sm text-textLight font-medium">
                {eduSystem}
              </span>
            </div>
          );
        },
      },
      {
        key: "product",
        label: t("providerProfile.home.bookingsTable.columns.product"),
        className: "font-semibold text-textDark text-sm sm:text-base",
        render: (row) => row.name || "نشاط العلا التاريخي",
      },
      {
        key: "orderType",
        label: t("providerProfile.home.bookingsTable.columns.orderType"),
        className: "text-textDark text-sm sm:text-base font-medium",
        render: (row) =>
          row.askType === "CUSTOM_TRIP"
            ? t("providerProfile.home.bookingsTable.types.CUSTOM_TRIP")
            : t("providerProfile.home.bookingsTable.types.TRIP"),
      },
      {
        key: "orderDate",
        label: t("providerProfile.home.bookingsTable.columns.orderDate"),
        className: "text-textDark text-sm sm:text-base font-semibold",
        render: (row) => {
          if (!row.day) return "6\\10\\2025";
          const d = new Date(row.day);
          return `${d.getDate()}\\${d.getMonth() + 1}\\${d.getFullYear()}`;
        },
      },
      {
        key: "budget",
        label: t("providerProfile.home.bookingsTable.columns.budget"),
        className: "font-bold text-textDark text-sm sm:text-base",
        render: (row) => formatCurrency(row.basePrice ?? 15000),
      },
      {
        key: "status",
        label: t("providerProfile.home.bookingsTable.columns.status"),
        render: (row) => (
          <StatusBadge
            status={row.status || "PENDING"}
            label={t(`providerProfile.home.bookingsTable.statuses.${row.status || "PENDING"}`)}
          />
        ),
      },
      {
        key: "action",
        label: t("providerProfile.home.bookingsTable.columns.action"),
        render: () => (
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-border hover:border-mainColor hover:bg-mainColor/5 text-textLight hover:text-mainColor transition-all flex items-center justify-center cursor-pointer shadow-2xs"
            aria-label="View details"
          >
            <RemoveRedEyeOutlined className="!w-5 !h-5" />
          </button>
        ),
      },
    ],
    [t]
  );

  if (loading) return <ProviderBookingsTableSkeleton />;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-border shadow-card">
      {/* Header: Title on start (right in RTL), Filter Dropdown on end (left in RTL) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Table Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-mainColor">
          {t("providerProfile.home.bookingsTable.title")}
        </h3>

        {/* Dropdown Filter at the end */}
        <div className="relative inline-block">
          <select
            value={b2bFilter}
            onChange={(e) => setB2bFilter(e.target.value)}
            className="appearance-none bg-white border border-border rounded-xl px-5 py-2.5 pe-10 text-sm sm:text-base font-bold text-textDark hover:border-mainColor focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor cursor-pointer shadow-2xs transition-all"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-3 text-textLight">
            <KeyboardArrowDown className="!w-5 !h-5" />
          </div>
        </div>
      </div>

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredNodes}
        loading={false}
        emptyState={
          <p className="text-textLight py-12 text-center text-base font-semibold">
            {t("providerProfile.home.recentActivities.noTrips")}
          </p>
        }
        pagination={{
          pageInfo,
          currentPage: currentPage || 1,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
};

export default memo(ProviderBookingsTable);
