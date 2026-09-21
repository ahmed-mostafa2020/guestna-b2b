"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import { Badge } from "@mui/material";
import ActionsDropdownMenu from "./ActionsDropdownMenu";
import SearchHeader from "@components/ui/SearchHeader";
import DataTable from "@components/ui/DataTable";
import BookingsTableSkeleton from "./BookingsTableSkeleton";
import { getStatusStyles } from "@utils/formatters/getStatusStyles";
import { SORTING_TYPE } from "@constants/sorting";

const BookingsTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  searchTerm,
  setSearchTerm,
  sort,
  setSort,
  loading = false,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const [isSorting, setIsSorting] = useState(false);

  // Reset local sorting spinner when new data arrives
  useEffect(() => {
    setIsSorting(false);
  }, [data]);

  const sortConfig = useMemo(() => {
    if (sort === SORTING_TYPE.NEWEST_DAY) {
      return { key: "date", direction: "desc" };
    }
    if (sort === SORTING_TYPE.OLDEST_DAY) {
      return { key: "date", direction: "asc" };
    }
    if (sort === SORTING_TYPE.NEWEST) {
      return { key: "createdAt", direction: "desc" };
    }
    if (sort === SORTING_TYPE.OLDEST) {
      return { key: "createdAt", direction: "asc" };
    }
    return null;
  }, [sort]);

  const handleSort = useCallback(
    (key, direction) => {
      if (!setSort) return;
      setIsSorting(true);
      if (key === "date") {
        if (direction === "desc") {
          setSort(SORTING_TYPE.NEWEST_DAY);
        } else if (direction === "asc") {
          setSort(SORTING_TYPE.OLDEST_DAY);
        } else {
          setSort(SORTING_TYPE.NEWEST_DAY);
        }
      } else if (key === "createdAt") {
        if (direction === "desc") {
          setSort(SORTING_TYPE.NEWEST);
        } else if (direction === "asc") {
          setSort(SORTING_TYPE.OLDEST);
        } else {
          setSort(SORTING_TYPE.NEWEST);
        }
      }
    },
    [setSort]
  );

  const isTableLoading = Boolean(loading || isSorting || !data || !data.nodes);

  return (
    <section className="w-full space-y-6">
      {/* Desktop Table */}
      <DataTable
        title={
          <SearchHeader
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            title={tableTitle}
            placeholder={t("profile.tables.bookings.header.searchTripName")}
          />
        }
        sortConfig={sortConfig}
        onSort={setSort ? handleSort : undefined}
        columns={[
          {
            key: "createdAt",
            label: t("profile.tables.bookings.header.createdAt"),
            sortable: true,
            className: "font-medium text-foreground whitespace-nowrap",
            sortFn: (a, b, direction) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return direction === "asc" ? dateA - dateB : dateB - dateA;
            },
            render: (row) =>
              row.createdAt ? (
                <>
                  {formatDate(row.createdAt, locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  <br />
                  <span className="text-xs text-gray-600">
                    {formatDate(row.createdAt, locale, { timeOnly: true })}
                  </span>
                </>
              ) : (
                "-"
              ),
          },
          {
            key: "organization",
            label: t("profile.tables.bookings.header.schoolName"),
            className: "font-medium text-foreground max-w-[200px]",
            render: (row) => {
              const name = row.organization || "-";
              return (
                <div title={name}>
                  {name.length > 30 ? `${name.slice(0, 30)}...` : name}
                </div>
              );
            },
          },
          {
            key: "name",
            label: t("profile.tables.bookings.header.tripName"),
            className: "font-medium text-foreground max-w-[200px]",
            render: (row) => (
              <div className="truncate" title={row.name}>
                {row.name}
              </div>
            ),
          },
          {
            key: "category",
            label: t("profile.tables.bookings.header.tripType"),
            className: "font-medium text-foreground max-w-[150px]",
          },
          {
            key: "date",
            label: t("profile.tables.bookings.header.date"),
            sortable: true,
            className: "whitespace-nowrap",
            sortFn: (a, b, direction) => {
              const dateA = new Date(a.day || a.date || a.createdAt || 0).getTime();
              const dateB = new Date(b.day || b.date || b.createdAt || 0).getTime();
              return direction === "asc" ? dateA - dateB : dateB - dateA;
            },
            render: (row) => (
              <>
                {formatDate(row.day, locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                <br />
                <span className="text-xs text-gray-600">
                  {row.fromHour}
                </span>
              </>
            ),
          },
          {
            key: "revenueAmount",
            label: t("profile.tables.bookings.header.price"),
            render: (row) => formatCurrency(row.revenueAmount),
          },
          {
            key: "quantity",
            label: t("profile.tables.bookings.header.quantity"),
            render: (row) => (
              <div className="flex items-center gap-1.5">
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden w-9">
                  <div
                    className="bg-mainColor h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (row.bookingQuantity / row.baseAvailableSeates) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{row.bookingQuantity}</span>
                  <span>/</span>
                  <span>{row.baseAvailableSeates}</span>
                </div>
              </div>
            ),
          },
          {
            key: "status",
            label: t("profile.tables.bookings.header.status"),
            render: (row) => (
              <Badge
                variant="outline"
                sx={{
                  background: getStatusStyles(row.status),
                  borderColor: getStatusStyles(row.status),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                }}
                className={`text-sm text-center capitalize ${getStatusStyles(row.status)}`}
              >
                {t(`common.organizationTripStatus.${row.status}`)}
              </Badge>
            ),
          }
        ]}
        data={data?.nodes || []}
        loading={isTableLoading}
        loadingComponent={
          <BookingsTableSkeleton
            tableTitle={tableTitle}
            showSearchHeader={true}
          />
        }
        actionsLabel={t("profile.tables.bookings.header.actions")}
        rowActions={(row) => (
          <div className="centered w-full">
            <ActionsDropdownMenu booking={row} />
          </div>
        )}
        pagination={enablePagination && data?.pageInfo && {
          currentPage,
          pageInfo: data.pageInfo,
          onPageChange: setCurrentPage
        }}
      />
    </section>
  );
};

export default memo(BookingsTable);
