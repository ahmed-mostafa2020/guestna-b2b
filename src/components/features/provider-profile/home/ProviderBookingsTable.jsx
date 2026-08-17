"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Chip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import DataTable from "@components/ui/DataTable";
import SearchHeader from "@components/ui/SearchHeader";

/* ─── Skeleton ─── */
export const ProviderBookingsTableSkeleton = () => (
  <div className="bg-white border border-border rounded-xl p-5 sm:p-6 animate-pulse">
    {/* Title + Search */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
      <Skeleton variant="text" width={200} height={28} />
      <Skeleton variant="rounded" width={280} height={38} className="rounded-md" />
    </div>
    {/* Filters */}
    <div className="flex flex-wrap items-center gap-3 mb-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" width={130} height={36} className="rounded-md" />
      ))}
    </div>
    {/* Table header */}
    <div className="hidden md:grid grid-cols-9 gap-2 p-3 bg-gray-50 rounded-lg mb-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} variant="text" height={16} />
      ))}
    </div>
    {/* Table rows */}
    {Array.from({ length: 5 }).map((_, row) => (
      <div key={row} className="hidden md:grid grid-cols-9 gap-2 p-3 border-b border-gray-100">
        {Array.from({ length: 9 }).map((_, col) => (
          <Skeleton key={col} variant="text" height={16} />
        ))}
      </div>
    ))}
    {/* Mobile cards */}
    <div className="md:hidden space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border border-border rounded-lg">
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="flex justify-between py-1.5">
              <Skeleton variant="text" width="30%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </div>
          ))}
        </div>
      ))}
    </div>
    {/* Pagination */}
    <div className="flex justify-center mt-5">
      <Skeleton variant="rounded" width={300} height={36} className="rounded-lg" />
    </div>
  </div>
);

/* ─── Status Badge ─── */
const STATUS_MAP = {
  PENDING: { variant: "warning" },
  PENDING_COMPANY_APPROVAL: { variant: "info" },
  ON_HOLD: { variant: "hold" },
  SCHEDULED: { variant: "info" },
  DONE: { variant: "success" },
  CANCELLED: { variant: "danger" },
  REJECTED: { variant: "danger" },
};

const StatusBadge = ({ status, label }) => {
  const config = STATUS_MAP[status] || { variant: "neutral" };
  const variant = config.variant;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
        bg-status-${variant}-bg text-status-${variant}-fg border-status-${variant}-border`}
    >
      {label}
    </span>
  );
};

/* ─── Filters ─── */
const FilterSelect = ({ value, onChange, options, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-2 text-sm border border-border rounded-lg bg-white text-gray-700
      focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor cursor-pointer ${className}`}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

/* ─── Main Component ─── */
const ProviderBookingsTable = ({ data, loading, currentPage, setCurrentPage }) => {
  const t = useTranslations();
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const rawNodes = data?.nodes || [];
  const pageInfo = data?.pageInfo || {
    total: rawNodes.length,
    currentPage: currentPage || 1,
    perPage: 10,
  };

  // Filtered data
  const filteredNodes = useMemo(() => {
    let nodes = rawNodes;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      nodes = nodes.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          String(item.orderId)?.toLowerCase().includes(term) ||
          item.organization?.toLowerCase().includes(term)
      );
    }
    if (statusFilter) {
      nodes = nodes.filter((item) => item.status === statusFilter);
    }
    if (typeFilter) {
      nodes = nodes.filter((item) => item.askType === typeFilter);
    }
    return nodes;
  }, [rawNodes, searchTerm, statusFilter, typeFilter]);

  // Status filter options
  const statusOptions = useMemo(
    () => [
      { value: "", label: t("providerProfile.home.bookingsTable.filters.allStatuses") },
      ...Object.keys(STATUS_MAP).map((key) => ({
        value: key,
        label: t(`providerProfile.home.bookingsTable.statuses.${key}`),
      })),
    ],
    [t]
  );

  const typeOptions = useMemo(
    () => [
      { value: "", label: t("providerProfile.home.bookingsTable.filters.allTypes") },
      { value: "TRIP", label: t("providerProfile.home.bookingsTable.types.TRIP") },
      { value: "CUSTOM_TRIP", label: t("providerProfile.home.bookingsTable.types.CUSTOM_TRIP") },
    ],
    [t]
  );

  // Table columns
  const columns = useMemo(
    () => [
      {
        key: "orderId",
        label: t("providerProfile.home.bookingsTable.columns.orderId"),
        render: (row) => (
          <Chip
            label={row.track?.orderId || row.orderId}
            size="small"
            className="bg-mainColor/10 text-mainColor font-medium !text-xs"
          />
        ),
      },
      {
        key: "name",
        label: t("providerProfile.home.bookingsTable.columns.tripName"),
        className: "font-medium text-titleColor",
      },
      {
        key: "askType",
        label: t("providerProfile.home.bookingsTable.columns.type"),
        render: (row) => (
          <span className="text-xs text-gray-600">
            {t(`providerProfile.home.bookingsTable.types.${row.askType}`)}
          </span>
        ),
      },
      {
        key: "organization",
        label: t("providerProfile.home.bookingsTable.columns.organization"),
        className: "text-gray-600",
      },
      {
        key: "availableSeats",
        label: t("providerProfile.home.bookingsTable.columns.capacity"),
        className: "text-gray-600",
      },
      {
        key: "day",
        label: t("providerProfile.home.bookingsTable.columns.date"),
        render: (row) =>
          row.day
            ? formatDate(row.day, locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-",
        className: "text-gray-600",
      },
      {
        key: "basePrice",
        label: t("providerProfile.home.bookingsTable.columns.price"),
        render: (row) => formatCurrency(row.basePrice),
        className: "font-semibold",
      },
      {
        key: "status",
        label: t("providerProfile.home.bookingsTable.columns.status"),
        render: (row) => (
          <StatusBadge
            status={row.status}
            label={t(`providerProfile.home.bookingsTable.statuses.${row.status}`)}
          />
        ),
      },
      {
        key: "action",
        label: t("providerProfile.home.bookingsTable.columns.action"),
        render: () => (
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-mainColor"
            aria-label="View details"
          >
            <Visibility className="!w-5 !h-5" />
          </button>
        ),
      },
    ],
    [t, locale]
  );

  if (loading) return <ProviderBookingsTableSkeleton />;

  return (
    <div className="flex flex-col gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-sm">
      {/* Title + Search */}
      <SearchHeader
        title={t("providerProfile.home.bookingsTable.title")}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={t("providerProfile.home.bookingsTable.filterHint")}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
        <FilterSelect
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredNodes}
        loading={false}
        emptyState={
          <p className="text-gray-400 py-8 text-sm">
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
