"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { memo, useMemo } from "react";

import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";
import DataTable from "@components/ui/DataTable";

const EventsTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  loading,
}) => {
  const locale = useLocale();
  const t = useTranslations("profile.events");
  const tStatus = useTranslations("common.organizationTripStatus");
  const router = useRouter();

  const handleRowClick = (row) => {
    router.push(`/${locale}/profile/events/${row.slug}`);
  };

  const getStatusBadge = (status) => {
    const uppercaseStatus = status?.toUpperCase() || "";
    const label = tStatus(uppercaseStatus) || uppercaseStatus;

    const bgMap = {
      PENDING: "bg-amber-50 text-amber-700 border-amber-200/60",
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200/60",
      DONE: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      CANCLED: "bg-rose-50 text-rose-700 border-rose-200/60",
      CANCELLED: "bg-rose-50 text-rose-700 border-rose-200/60",
    };

    const bgClass =
      bgMap[uppercaseStatus] || "bg-gray-50 text-gray-700 border-gray-200/60";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgClass}`}
      >
        {label}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: t("table.name"),
        className: "text-foreground font-medium text-start",
        headerClassName: "font-bold text-gray-700 text-start",
        render: (row) => {
          const thumbnailSrc = row.thumbnail?.web || row.thumbnail?.app;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                {thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    alt={row.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    🖼️
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className="font-semibold text-gray-900 truncate max-w-[200px]"
                  title={row.name}
                >
                  {row.name || "-"}
                </span>
                {row.orderId && (
                  <span className="text-xs text-gray-500 font-ibm">
                    {row.orderId}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: "day",
        label: t("table.day"),
        className: "text-muted-foreground whitespace-nowrap text-start",
        headerClassName: "font-bold text-gray-700 text-start",
        render: (row) =>
          formatDate(row.day, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      },
      {
        key: "duration",
        label: t("table.duration"),
        className: "text-muted-foreground whitespace-nowrap text-start",
        headerClassName: "font-bold text-gray-700 text-start",
        render: (row) => {
          if (!row.duration) return "-";
          return row.duration === 1
            ? t("table.oneDay")
            : t("table.days", { count: row.duration });
        },
      },
      {
        key: "availableSeats",
        label: t("table.seats"),
        className: "text-foreground font-semibold whitespace-nowrap",
        headerClassName: "font-bold text-gray-700 text-center",
        render: (row) => row.availableSeats ?? "-",
      },
      {
        key: "price",
        label: t("table.price"),
        className: "text-foreground font-semibold whitespace-nowrap text-start",
        headerClassName: "font-bold text-gray-700 text-start",
        render: (row) => formatCurrency(row.price),
      },
      {
        key: "status",
        label: t("table.status"),
        className: "whitespace-nowrap text-start",
        headerClassName: "font-bold text-gray-700 text-start",
        render: (row) => getStatusBadge(row.status),
      },
    ],
    [t, locale]
  );

  return (
    <DataTable
      columns={columns}
      data={data?.nodes || []}
      loading={loading}
      actionsLabel={t("table.actions")}
      rowActions={(row) => (
        <Link
          href={`/${locale}/profile/events/${row.slug || row._id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-mainColor hover:bg-linksHover transition-all shadow-sm font-ibm hover:shadow"
        >
          {t("table.viewDetails")}
        </Link>
      )}
      pagination={
        enablePagination && data?.pageInfo
          ? {
              currentPage,
              pageInfo: data.pageInfo,
              onPageChange: setCurrentPage,
            }
          : undefined
      }
    />
  );
};

export default memo(EventsTable);
