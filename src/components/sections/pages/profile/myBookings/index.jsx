"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import formatCurrency from "@utils/FormatCurrency";
import formatDate from "@utils/FormateDate";
import formatNumbersUint from "@utils/FormatNumbersUint";
import { TRIP_STATUS } from "@constants/tripStatus";
import Pagination from "@components/common/Pagination";

import { Badge, CardContent, Card, CircularProgress } from "@mui/material";
import ActionsDropdownMenu from "./ActionsDropdownMenu";
import BookingsHeader from "./BookingsHeader";

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
    <div className="w-full space-y-6">
      {/* Search Header - Always visible */}
      <BookingsHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        tableTitle={tableTitle}
      />

      {/* Loading State */}
      {!data || !data.nodes ? (
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <CircularProgress size={50} sx={{ color: "var(--color-main)" }} />
            <p className="text-sm text-gray-500">{t("common.loading")}</p>
          </div>
        </div>
      ) : data.nodes.length === 0 ? // Empty state - no table shown
      null : (
        <>
          {/* Desktop Table */}
          <Card
            className="hidden md:block"
            sx={{
              borderRadius: "16px",
              boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
            }}
          >
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className=" bg-table-header border-b-2 border-tableRowBorder">
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.schoolName")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.tripName")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.tripType")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.date")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.price")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.quantity")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.status")}
                      </th>
                      <th className="px-4 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.nodes?.map((booking, index) => (
                      <tr
                        key={`${booking._id}-${index}`}
                        className={`${
                          index != data?.nodes?.length - 1 &&
                          "border-b border-table-border"
                        } transition-colors hover:bg-gray-50`}
                      >
                        <td className="px-4 py-4 text-sm font-medium text-foreground max-w-[200px]">
                          <div
                            className="truncate"
                            title={booking.organization}
                          >
                            {booking.organization}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground max-w-[200px]">
                          <div className="truncate" title={booking.name}>
                            {booking.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground max-w-[150px]">
                          <div className="truncate" title={booking.category}>
                            {booking.category}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(booking.day, locale, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          <br />
                          <span className="text-xs text-gray-600">
                            {booking.fromHour}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {formatCurrency(booking.revenueAmount)}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {formatNumbersUint(
                            booking.bookingQuantity,
                            t("common.student"),
                            t("common.students")
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            sx={{
                              background: getStatusStyles(booking.status),
                              borderColor: getStatusStyles(booking.status),
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "8px",
                            }}
                            className={`text-sm text-center capitalize ${getStatusStyles(
                              booking.status
                            )}`}
                          >
                            {t(
                              `common.organizationTripStatus.${booking.status}`
                            )}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <ActionsDropdownMenu booking={booking} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden px-4">
            {data?.nodes?.map((booking, index) => (
              <Card
                key={`${booking._id}-${index}`}
                className="transition-shadow shadow-md hover:shadow-lg"
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <CardContent className="p-4 space-y-4">
                  {/* Trip Name Header */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-200">
                    <h3 className="text-base font-bold leading-tight text-foreground flex-1 min-w-0">
                      {booking.name}
                    </h3>
                    <Badge
                      variant="outline"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                      className={`text-xs text-center capitalize ${getStatusStyles(
                        booking.status
                      )}`}
                    >
                      {t(`common.organizationTripStatus.${booking.status}`) ||
                        booking.status}
                    </Badge>
                  </div>

                  {/* Actions Button - Mobile */}
                  <div className="flex justify-center pb-3 border-b border-gray-200">
                    <ActionsDropdownMenu booking={booking} />
                  </div>

                  {/* Data Grid */}
                  <div className="space-y-3 text-sm">
                    {/* School Name */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.bookings.header.schoolName")}:
                      </span>
                      <span className="text-foreground text-end font-medium">
                        {booking.organization}
                      </span>
                    </div>

                    {/* Trip Type */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.bookings.header.tripType")}:
                      </span>
                      <span className="text-foreground text-end font-medium">
                        {booking.category}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.bookings.header.date")}:
                      </span>
                      <span className="text-foreground text-end">
                        {formatDate(booking.day, locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        <br />
                        <span className="text-xs text-gray-500">
                          {booking.fromHour}
                        </span>
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.bookings.header.quantity")}:
                      </span>
                      <span className="text-foreground text-end font-medium">
                        {formatNumbersUint(
                          booking.bookingQuantity,
                          t("common.student"),
                          t("common.students")
                        )}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-start justify-between gap-2 pt-2 border-t border-gray-100">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.bookings.header.price")}:
                      </span>
                      <span className="text-foreground text-end font-bold text-base text-mainColor">
                        {formatCurrency(booking.revenueAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Component */}
          {enablePagination && data?.pageInfo && (
            <Pagination
              pageInfo={data.pageInfo}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
};

export default memo(BookingsTable);
