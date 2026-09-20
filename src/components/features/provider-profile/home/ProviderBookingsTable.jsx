"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
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
  PENDING_CLIENT_REVIEW: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
  },
  PENDING_PROVIDER_APPROVAL: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
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
  APPROVED: {
    bg: "bg-status-success-bg",
    text: "text-status-success-fg",
    border: "border-status-success-border",
  },
  CANCELLED: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
  CANCLED: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
  REJECTED: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
  ENDED: {
    bg: "bg-status-neutral-bg",
    text: "text-status-neutral-fg",
    border: "border-status-neutral-border",
  },
  PARTIALLY_PAID: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
  },
  REFUNDED: {
    bg: "bg-status-neutral-bg",
    text: "text-status-neutral-fg",
    border: "border-status-neutral-border",
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
  const locale = useLocale();
  const rawNodes = Array.isArray(data) ? data : data?.nodes || [];
  const pageInfo = data?.pageInfo || {
    total: rawNodes.length,
    currentPage: currentPage || 1,
    perPage: 10,
  };

  // Table columns matching the design
  const columns = useMemo(
    () => [
      {
        key: "orderId",
        label: t("providerProfile.home.bookingsTable.columns.orderId"),
        className: "font-bold text-textDark text-sm sm:text-base",
        render: (row) => String(row.orderId || row._id?.slice(-8) || "-"),
      },
      {
        key: "client",
        label: t("providerProfile.home.bookingsTable.columns.client"),
        render: (row) => {
          const orgName =
            typeof row.organization === "string"
              ? row.organization
              : row.organization?.name || "-";
          const eduSystem =
            row.track?.educationSystem?.name ||
            (row.askType === "CUSTOM_TRIP"
              ? t("providerProfile.home.recentActivities.multipleStages")
              : "-");
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
        render: (row) => row.name || "-",
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
        className: "text-textDark text-sm sm:text-base font-semibold whitespace-nowrap",
        render: (row) => {
          const dateVal = row.day || row.date || row.createdAt;
          if (!dateVal) return "-";
          return formatDate(dateVal, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      {
        key: "budget",
        label: t("providerProfile.home.bookingsTable.columns.budget"),
        className: "font-bold text-textDark text-sm sm:text-base",
        render: (row) => formatCurrency(row.basePrice ?? 0),
      },
      {
        key: "status",
        label: t("providerProfile.home.bookingsTable.columns.status"),
        render: (row) => {
          const statusKey = row.status || "PENDING";
          const label = t.has(
            `providerProfile.home.bookingsTable.statuses.${statusKey}`
          )
            ? t(`providerProfile.home.bookingsTable.statuses.${statusKey}`)
            : t.has(`trip_status.${statusKey}`)
            ? t(`trip_status.${statusKey}`)
            : statusKey;

          return <StatusBadge status={statusKey} label={label} />;
        },
      },
      {
        key: "action",
        label: t("providerProfile.home.bookingsTable.columns.action"),
        render: () => (
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-border hover:border-mainColor hover:bg-mainColor/5 text-textLight hover:text-mainColor transition-all flex items-center justify-center cursor-pointer shadow-2xs"
            aria-label={t("providerProfile.home.bookingsTable.viewDetails")}
            title={t("providerProfile.home.bookingsTable.viewDetails")}
          >
            <RemoveRedEyeOutlined className="!w-5 !h-5" />
          </button>
        ),
      },
    ],
    [t, locale]
  );

  if (loading) return <ProviderBookingsTableSkeleton />;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-border shadow-card">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-mainColor">
          {t("providerProfile.home.bookingsTable.title")}
        </h3>
      </div>

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={rawNodes}
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
