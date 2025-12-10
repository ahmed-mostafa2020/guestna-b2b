"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import Pagination from "@components/common/Pagination";
import ActionsDropdownMenu from "./ActionsDropdownMenu";

import { CardContent, Card, CircularProgress } from "@mui/material";
import formatCurrency from "@/src/utils/FormatCurrency";

const AllOrdersTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const { hasAnyElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  // Check if user has any order management action permissions
  const hasAnyActionPermission = hasAnyElement([
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOW_DETAILS,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_UPDATE_TRIP,
  ]);

  const getStatusStyles = (status) => {
    switch (status) {
      case TRIP_STATUS.APPROVED:
        return "bg-green-100 text-green-800 border border-green-200";
      case TRIP_STATUS.PENDING:
      case TRIP_STATUS.PENDING_COMPANY_APPROVAL:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case TRIP_STATUS.CANCELLED:
      case TRIP_STATUS.REJECTED:
        return "bg-red-100 text-red-800 border border-red-200";
      case TRIP_STATUS.SCHEDULED:
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case TRIP_STATUS.ENDED:
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case TRIP_STATUS.ON_HOLD:
        return "bg-orange-100 text-orange-800 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (!data || !data.nodes) {
    return (
      <div className="w-full min-h-[400px] centered">
        <CircularProgress size={50} color="primary" />
      </div>
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
        {tableTitle && (
          <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.ordersInfo.orderDetails.orderId")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.ordersInfo.orderDetails.tripType")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.ordersInfo.orderDetails.category")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.schoolName")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.date")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.ordersInfo.orderDetails.basePrice")}
                  </th>
                  <th className="p-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.status")}
                  </th>
                  {hasAnyActionPermission && (
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.bookings.header.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.nodes?.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`${
                      index != data?.nodes?.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    <td className="p-4 text-sm font-medium text-foreground">
                      {order.orderId}
                    </td>

                    <td className="p-4 text-sm font-medium text-foreground">
                      {order.name}
                    </td>

                    <td className="p-4 text-sm">
                      {order.askType === "CUSTOM_TRIP" ? (
                        <span className="px-2 py-1 font-medium">
                          {t("profile.tables.orders.customizable.title")}
                        </span>
                      ) : (
                        <span className="px-2 py-1 font-medium">
                          {t("profile.tables.orders.normal.title")}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-sm text-muted-foreground">
                      {order.category}
                    </td>

                    <td className="p-4 text-sm text-muted-foreground">
                      {order.organization}
                    </td>

                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(order.day, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>

                    <td className="p-4 text-sm font-medium text-foreground">
                      {formatCurrency(order.basePrice)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-1 lg:px-3 py-1 rounded-full lg:text-sm text-[10px] font-medium ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {t(`common.organizationTripStatus.${order.status}`)}
                      </span>
                    </td>

                    {hasAnyActionPermission && (
                      <td className="p-4">
                        <ActionsDropdownMenu
                          bookingId={order._id}
                          bookingStatus={order.status}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {tableTitle && (
          <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        {data?.nodes?.map((order) => (
          <Card
            key={order._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {order.orderId}
                  </span>

                  {order.askType === "CUSTOM_TRIP" ? (
                    <span className="px-2 py-1 font-medium">
                      {t("profile.tables.orders.customizable.title")}
                    </span>
                  ) : (
                    <span className="px-2 py-1 font-medium">
                      {t("profile.tables.orders.normal.title")}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {order.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-muted-foreground">
                    {t("profile.tables.ordersInfo.orderDetails.category")}:
                  </span>
                  <span>{order.category}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-muted-foreground">
                    {t("profile.tables.bookings.header.schoolName")}:
                  </span>
                  <span>{order.organization}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-muted-foreground">
                    {t("profile.tables.bookings.header.date")}:
                  </span>
                  <span className="text-muted-foreground">
                    {formatDate(order.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-muted-foreground">
                    {t("profile.tables.ordersInfo.orderDetails.basePrice")}:
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(order.basePrice)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full  font-medium ${getStatusStyles(
                    order.status
                  )}`}
                >
                  {t(`common.organizationTripStatus.${order.status}`)}
                </span>
              </div>

              {hasAnyActionPermission && (
                <div className="space-y-2">
                  <ActionsDropdownMenu
                    bookingId={order._id}
                    bookingStatus={order.status}
                  />
                </div>
              )}
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
        </div>
      )}
    </div>
  );
};

export default memo(AllOrdersTable);
