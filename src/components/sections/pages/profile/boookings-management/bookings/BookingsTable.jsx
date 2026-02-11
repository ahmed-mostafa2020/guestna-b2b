"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { PERMISSIONS } from "@constants/permissions";
import Pagination from "@components/common/Pagination";
import ActionsDropdownMenu from "./ActionsDropdownMenu";

import { CardContent, Card, CircularProgress, Tooltip } from "@mui/material";
import formatCurrency from "@utils/FormatCurrency";

// Helper function to get full target track text (for tooltip)
const getFullTargetTrack = (track) => {
  if (!track) return "-";

  const parts = [];

  if (track.gender) {
    parts.push(track.gender);
  }

  if (track.educationSystem?.name) {
    parts.push(track.educationSystem.name);
  }

  if (track.academicStages && track.academicStages.length > 0) {
    const stagesNames = track.academicStages
      .map((stage) => stage.name)
      .join(" - ");
    parts.push(stagesNames);
  }

  return parts.join(" | ") || "-";
};

const BookingsTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

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
        className="hidden lg:block"
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
                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.tables.bookings.header.orderId")}
                  </th>

                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.tables.bookings.header.organization")}
                  </th>

                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>

                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.tables.bookings.header.targetTrack")}
                  </th>

                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.tables.bookings.header.date")}
                  </th>

                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.infoCards.totalStudents")}
                  </th>

                  <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                    {t("profile.tables.bookings.header.budget")}
                  </th>

                  {hasElement(
                    PERMISSIONS.ELEMENT
                      .B2B_PROFILE_BOOKINGS_SHOWTRIPDETAILS_BUTTON
                  ) && (
                    <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                      {t("profile.tables.bookings.header.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.nodes?.map((booking, index) => (
                  <tr
                    key={booking._id + "_" + index}
                    className={`${
                      index != data?.nodes?.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    {/* Order ID */}
                    <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">
                      {booking.orderId || "-"}
                    </td>

                    {/* Organization */}
                    <td className="px-4 py-4 text-sm font-medium text-foreground">
                      <span className="line-clamp-2">
                        {booking.organization?.name || "-"}
                      </span>
                    </td>

                    {/* Trip Name */}
                    <td className="px-4 py-4 text-sm font-medium text-foreground">
                      <span className="line-clamp-2">{booking.name}</span>
                    </td>

                    {/* Target Track */}
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      <Tooltip
                        title={
                          <div className="flex flex-col gap-1 text-sm">
                            {booking.grades && booking.grades.length > 0 && (
                              <span>
                                {t("profile.tables.bookings.header.class")}:{" "}
                                {booking.grades.map((g) => g.name).join(" - ")}
                              </span>
                            )}
                            {booking.track && (
                              <span>
                                {t("profile.tables.bookings.header.track")}:{" "}
                                {booking.track?.gender &&
                                  t(`common.${booking.track.gender}`)}{" "}
                                {booking.track?.educationSystem?.name &&
                                  ` - ${booking.track.educationSystem.name}`}
                              </span>
                            )}
                          </div>
                        }
                        arrow
                        placement="top"
                      >
                        <div className="flex flex-col gap-1 truncate max-w-[200px]">
                          {booking.grades && booking.grades.length > 0 ? (
                            <span className="font-medium text-foreground line-clamp-1 truncate">
                              {t("profile.tables.bookings.header.class")}:{" "}
                              {booking.grades.map((g) => g.name).join(" - ")}
                            </span>
                          ) : null}
                          {booking.track ? (
                            <span className="text-sm font-medium text-muted-foreground line-clamp-1 truncate">
                              {t("profile.tables.bookings.header.track")}:{" "}
                              {booking.track?.gender &&
                                t(`common.${booking.track.gender}`)}
                              {booking.track?.educationSystem?.name &&
                                ` - ${booking.track.educationSystem.name}`}
                            </span>
                          ) : null}
                        </div>
                      </Tooltip>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(booking.day, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Students Count */}
                    <td className="px-4 py-4 text-sm font-medium text-foreground">
                      {booking.bookingQuantity}
                    </td>

                    {/* Budget/Price */}
                    <td className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap">
                      {formatCurrency(booking.price)}
                    </td>

                    {/* Actions */}
                    {hasElement(
                      PERMISSIONS.ELEMENT
                        .B2B_PROFILE_BOOKINGS_SHOWTRIPDETAILS_BUTTON
                    ) && (
                      <td className="px-4 py-4">
                        <ActionsDropdownMenu booking={booking} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tablet Table (Simplified) */}
      <Card
        className="hidden md:block lg:hidden"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        {tableTitle && (
          <h2 className="text-xl font-medium text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  <th className="px-3 py-3 font-semibold text-start text-sm">
                    {t("profile.tables.bookings.header.orderId")}
                  </th>
                  <th className="px-3 py-3 font-semibold text-start text-sm">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>
                  <th className="px-3 py-3 font-semibold text-start text-sm">
                    {t("profile.tables.bookings.header.date")}
                  </th>
                  <th className="px-3 py-3 font-semibold text-start text-sm">
                    {t("profile.tables.bookings.header.budget")}
                  </th>
                  {hasElement(
                    PERMISSIONS.ELEMENT
                      .B2B_PROFILE_BOOKINGS_SHOWTRIPDETAILS_BUTTON
                  ) && (
                    <th className="px-3 py-3 font-semibold text-start text-sm">
                      {t("profile.tables.bookings.header.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.nodes?.map((booking, index) => (
                  <tr
                    key={booking._id + "_" + index + "web"}
                    className={`${
                      index != data?.nodes?.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    <td className="px-3 py-3 text-sm font-medium text-foreground">
                      {booking.orderId || "-"}
                    </td>
                    <td className="px-3 py-3 text-sm text-foreground">
                      <span className="line-clamp-2">{booking.name}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(booking.day, locale, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                      {formatCurrency(booking.price)}
                    </td>
                    {hasElement(
                      PERMISSIONS.ELEMENT
                        .B2B_PROFILE_BOOKINGS_SHOWTRIPDETAILS_BUTTON
                    ) && (
                      <td className="px-3 py-3">
                        <ActionsDropdownMenu booking={booking} />
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
          <h2 className="text-xl font-medium text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        {data?.nodes?.map((booking, index) => (
          <Card
            key={booking._id + "_" + index + "mobile"}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              {/* Header with Order ID and Actions */}
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  {booking.orderId || "-"}
                </span>
                {hasElement(
                  PERMISSIONS.ELEMENT
                    .B2B_PROFILE_BOOKINGS_SHOWTRIPDETAILS_BUTTON
                ) && <ActionsDropdownMenu booking={booking} />}
              </div>

              {/* Organization */}
              <div className="text-sm text-muted-foreground">
                {booking.organization?.name || "-"}
              </div>

              {/* Trip Name */}
              <h3 className="text-base font-bold leading-relaxed text-foreground line-clamp-2">
                {booking.name}
              </h3>

              {/* Target Track */}
              <Tooltip
                title={
                  <div className="flex flex-col gap-1 text-sm">
                    {booking.grades && booking.grades.length > 0 && (
                      <span>
                        {t("profile.tables.bookings.header.class")}:{" "}
                        {booking.grades.map((g) => g.name).join(" - ")}
                      </span>
                    )}
                    {booking.track && (
                      <span>
                        {t("profile.tables.bookings.header.track")}:{" "}
                        {booking.track?.gender &&
                          t(`common.${booking.track.gender}`)}{" "}
                        {booking.track?.educationSystem?.name &&
                          ` - ${booking.track.educationSystem.name}`}
                      </span>
                    )}
                  </div>
                }
                arrow
                placement="top"
              >
                <div className="flex flex-col gap-1 truncate">
                  {booking.grades && booking.grades.length > 0 ? (
                    <span className="font-medium text-foreground line-clamp-1 truncate">
                      {t("profile.tables.bookings.header.class")}:{" "}
                      {booking.grades.map((g) => g.name).join(" - ")}
                    </span>
                  ) : null}
                  {booking.track ? (
                    <span className="text-sm font-medium text-muted-foreground line-clamp-1 truncate">
                      {t("profile.tables.bookings.header.track")}:{" "}
                      {booking.track?.gender &&
                        t(`common.${booking.track.gender}`)}
                      {booking.track?.educationSystem?.name &&
                        ` - ${booking.track.educationSystem.name}`}
                    </span>
                  ) : null}
                </div>
              </Tooltip>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {t("profile.tables.bookings.header.date")}
                  </div>
                  <div className="text-base font-semibold text-foreground">
                    {formatDate(booking.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {t("profile.infoCards.totalStudents")}
                  </div>
                  <div className="text-base font-semibold text-foreground">
                    {booking.bookingQuantity}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {t("profile.tables.bookings.header.budget")}
                  </div>
                  <div className="text-base centered font-semibold text-foreground">
                    {formatCurrency(booking.price)}
                  </div>
                </div>
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
        </div>
      )}
    </div>
  );
};

export default memo(BookingsTable);
