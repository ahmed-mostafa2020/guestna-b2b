"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { RemoveRedEyeOutlined, KeyboardArrowDown } from "@mui/icons-material";
import formatCurrency from "@utils/formatters/FormatCurrency";
import DataTable from "@components/ui/DataTable";

/* ─── Skeleton ─── */
export const ProviderBookingsTableSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 animate-pulse">
    {/* Title + Dropdown */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Skeleton variant="text" width={180} height={28} />
      <Skeleton variant="rounded" width={160} height={38} className="rounded-lg" />
    </div>

    {/* Table rows */}
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-8 gap-3 p-3 border-b border-gray-100 items-center">
          {Array.from({ length: 8 }).map((_, col) => (
            <Skeleton key={col} variant="text" height={16} />
          ))}
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-center mt-6">
      <Skeleton variant="rounded" width={280} height={36} className="rounded-lg" />
    </div>
  </div>
);

/* ─── Status Badge ─── */
const STATUS_STYLES = {
  PENDING: {
    bg: "bg-[#E6F8F6]",
    text: "text-[#008F8F]",
    border: "border-[#BCEEEA]",
  },
  PENDING_COMPANY_APPROVAL: {
    bg: "bg-[#FFF4E6]",
    text: "text-[#ED8A22]",
    border: "border-[#FFE0B2]",
  },
  ON_HOLD: {
    bg: "bg-[#FFF4E6]",
    text: "text-[#ED8A22]",
    border: "border-[#FFE0B2]",
  },
  SCHEDULED: {
    bg: "bg-[#EBF3FC]",
    text: "text-[#2B78D4]",
    border: "border-[#BFDBFE]",
  },
  DONE: {
    bg: "bg-[#EBF7EE]",
    text: "text-[#34A853]",
    border: "border-[#C8E6C9]",
  },
  CANCELLED: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#DC2626]",
    border: "border-[#FECACA]",
  },
  REJECTED: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#DC2626]",
    border: "border-[#FECACA]",
  },
};

const StatusBadge = ({ status, label }) => {
  const style = STATUS_STYLES[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} whitespace-nowrap`}
    >
      {label}
    </span>
  );
};

/* ─── Main Component ─── */
const ProviderBookingsTable = ({ data, loading, currentPage, setCurrentPage }) => {
  const t = useTranslations();
  const locale = useLocale();
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
        className: "font-semibold text-gray-800 text-xs sm:text-sm",
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
              <span className="font-bold text-gray-900 text-xs sm:text-sm">
                {orgName}
              </span>
              <span className="text-[11px] text-gray-400">
                {eduSystem}
              </span>
            </div>
          );
        },
      },
      {
        key: "product",
        label: t("providerProfile.home.bookingsTable.columns.product"),
        className: "font-medium text-gray-800 text-xs sm:text-sm",
        render: (row) => row.name || "نشاط العلا التاريخي",
      },
      {
        key: "orderType",
        label: t("providerProfile.home.bookingsTable.columns.orderType"),
        className: "text-gray-700 text-xs sm:text-sm",
        render: (row) =>
          row.askType === "CUSTOM_TRIP"
            ? t("providerProfile.home.bookingsTable.types.CUSTOM_TRIP")
            : t("providerProfile.home.bookingsTable.types.TRIP"),
      },
      {
        key: "orderDate",
        label: t("providerProfile.home.bookingsTable.columns.orderDate"),
        className: "text-gray-600 text-xs sm:text-sm font-medium",
        render: (row) => {
          if (!row.day) return "6\\10\\2025";
          const d = new Date(row.day);
          return `${d.getDate()}\\${d.getMonth() + 1}\\${d.getFullYear()}`;
        },
      },
      {
        key: "budget",
        label: t("providerProfile.home.bookingsTable.columns.budget"),
        className: "font-bold text-gray-900 text-xs sm:text-sm",
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
            className="w-8 h-8 rounded-lg border border-gray-200 hover:border-mainColor hover:bg-mainColor/5 text-gray-500 hover:text-mainColor transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            aria-label="View details"
          >
            <RemoveRedEyeOutlined className="!w-4 !h-4" />
          </button>
        ),
      },
    ],
    [t]
  );

  if (loading) return <ProviderBookingsTableSkeleton />;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm">
      {/* Header: Title on start (right in RTL), Filter Dropdown on end (left in RTL) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Table Title */}
        <h3 className="text-lg sm:text-xl font-bold text-mainColor">
          {t("providerProfile.home.bookingsTable.title")}
        </h3>

        {/* Dropdown Filter at the end */}
        <div className="relative inline-block">
          <select
            value={b2bFilter}
            onChange={(e) => setB2bFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pe-9 text-xs sm:text-sm font-semibold text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor cursor-pointer shadow-2xs transition-all"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2.5 text-gray-500">
            <KeyboardArrowDown className="!w-4 !h-4" />
          </div>
        </div>
      </div>

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredNodes}
        loading={false}
        emptyState={
          <p className="text-gray-400 py-10 text-center text-sm font-medium">
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
