"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { Badge, CircularProgress } from "@mui/material";
import ActionsDropdownMenu from "./ActionsDropdownMenu";
import SearchHeader from "@components/ui/SearchHeader";
import DataTable from "@components/ui/DataTable";

const getStatusStyles = (status) => {
  switch (status) {
    case TRIP_STATUS.DONE:
      return "bg-green-100 text-green-800 border border-green-200";
    case TRIP_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case TRIP_STATUS.CANCELLED:
      return "bg-red-100 text-red-800 border border-red-200";
    case TRIP_STATUS.SCHEDULED:
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "ENDED":
      return "bg-gray-100 text-gray-800 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const BookingsTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  searchTerm,
  setSearchTerm,
}) => {
  const locale = useLocale();
  const t = useTranslations();

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
        columns={[
          {
            key: "organization",
            label: t("profile.tables.bookings.header.schoolName"),
            className: "font-medium text-foreground max-w-[200px]",
            render: (row) => (
              <div className="truncate" title={row.organization}>
                {row.organization}
              </div>
            ),
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
        loading={!data || !data.nodes}
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
