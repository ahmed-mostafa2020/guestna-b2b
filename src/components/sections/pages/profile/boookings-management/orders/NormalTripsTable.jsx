"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import Pagination from "@components/common/Pagination";
import ActionsDropdownMenu from "./ActionsDropdownMenu";

import { Typography, CardContent, Card } from "@mui/material";

const NormalTripsTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const locale = useLocale();
  const t = useTranslations();

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
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (!data || !data.nodes) {
    return (
      <Typography className="p-4 text-center">Loading bookings...</Typography>
    );
  }

  return (
    <div className="w-full space-y-6">
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
                <tr className=" bg-table-header ">
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>

                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.date")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.status")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`${
                      index != data.nodes.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(booking.day, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                          booking.status
                        )}`}
                      >
                        {t(`common.organizationTripStatus.${booking.status}`)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <ActionsDropdownMenu
                        bookingId={booking._id}
                        bookingStatus={booking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {data.nodes.map((booking) => (
          <Card
            key={booking._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col items-start justify-between">
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {booking.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(booking.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                      booking.status
                    )}`}
                  >
                    {t(`common.organizationTripStatus.${booking.status}`)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <ActionsDropdownMenu
                  bookingId={booking._id}
                  bookingStatus={booking.status}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div>
          {data?.pageInfo && (
            <Pagination
              pageInfo={data.pageInfo}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}

          {/* Test pagination with mock data if no pageInfo */}
          {!data?.pageInfo && (
            <Pagination
              pageInfo={{
                total: 25,
                perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
                currentPage: currentPage,
                totalPages: 3,
                hasNextPage: currentPage < 3,
                hasPreviousPage: currentPage > 1,
              }}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(NormalTripsTable);
