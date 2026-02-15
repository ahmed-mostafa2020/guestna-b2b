"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import Pagination from "@components/common/Pagination";

import { CardContent, Card } from "@mui/material";

const TripsManagementTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  const getTripTypeLabel = (type) => {
    if (!type) return "-";
    return t(`profile.tables.management.tripTypes.${type}`) || type;
  };

  const getAcademicStagesText = (stages) => {
    if (!stages || !Array.isArray(stages) || stages.length === 0) return "-";
    return stages
      .map((stage) => stage?.name)
      .filter(Boolean)
      .join(", ");
  };

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
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.management.header.organization")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.management.header.targetStudents")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.management.header.tripName")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.management.header.tripType")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.management.header.tripDate")}
                  </th>
                  {hasElement(
                    PERMISSIONS.ELEMENT.B2B_PROFILE_TRIPS_MANAGEMENT_BUTTON
                  ) && (
                    <th className="px-6 py-4 font-semibold text-start">
                      {t("profile.tables.management.header.actions")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.nodes?.map((trip, index) => (
                  <tr
                    key={`${trip._id}-${index}`}
                    className={`${
                      index !== data?.nodes?.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    {/* Organization / School Name */}
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {trip.organization?.name || "-"}
                    </td>

                    {/* Target Students: educationSystem + academicStages */}
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px]">
                      <div className="flex flex-col gap-1">
                        {trip.track?.educationSystem?.name && (
                          <span className="font-medium truncate">
                            {trip.track.educationSystem.name}
                          </span>
                        )}
                        <span
                          className="text-sm text-textLight truncate"
                          title={getAcademicStagesText(
                            trip.track?.academicStages
                          )}
                        >
                          {getAcademicStagesText(trip.track?.academicStages)}
                        </span>
                      </div>
                    </td>

                    {/* Trip Name + Order ID */}
                    <td className="px-6 py-4 text-sm text-foreground max-w-[250px]">
                      <div className="flex flex-col gap-1">
                        <span
                          className="font-medium truncate"
                          title={trip.name}
                        >
                          {trip.name || "-"}
                        </span>
                        {trip.orderId && (
                          <span className="text-sm text-textLight">
                            {trip.orderId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Trip Type */}
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {getTripTypeLabel(trip.tripsType)}
                    </td>

                    {/* Trip Date */}
                    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(trip.day, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Actions */}
                    {hasElement(
                      PERMISSIONS.ELEMENT.B2B_PROFILE_TRIPS_MANAGEMENT_BUTTON
                    ) && (
                      <td className="px-2 py-4">
                        {trip.status === TRIP_STATUS.SCHEDULED ||
                        trip.status === TRIP_STATUS.PENDING ? (
                          <Link
                            href={`/${locale}/profile/create-trip-link/${trip.slug}`}
                            className="lg:text-sm md:text-xs text-xs transition-all lg:px-2 px-2 py-1 duration-150 ease-in-out bg-titleColor rounded-md text-white border-mainColor hover:bg-linksHover"
                          >
                            {t("links.tripManagement")}
                          </Link>
                        ) : (
                          <span className="lg:text-sm md:text-xs text-xs lg:px-2 px-2 py-1 rounded-md text-white bg-titleColor opacity-50 cursor-not-allowed">
                            {t("links.tripManagement")}
                          </span>
                        )}
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

        {data?.nodes?.map((trip, index) => (
          <Card
            key={`${trip._id}-${index}`}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              {/* Trip Name + Order ID */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold leading-relaxed text-foreground truncate">
                    {trip.name || "-"}
                  </h3>
                  {trip.orderId && (
                    <span className="text-sm text-textLight">
                      {trip.orderId}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                {/* Organization */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textLight flex-shrink-0">
                    {t("profile.tables.management.header.organization")}:
                  </span>
                  <span className="text-foreground truncate">
                    {trip.organization?.name || "-"}
                  </span>
                </div>

                {/* Target Students */}
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-textLight flex-shrink-0">
                    {t("profile.tables.management.header.targetStudents")}:
                  </span>
                  <div className="flex flex-col min-w-0">
                    {trip.track?.educationSystem?.name && (
                      <span className="text-foreground truncate">
                        {trip.track.educationSystem.name}
                      </span>
                    )}
                    <span className="text-sm text-textLight truncate">
                      {getAcademicStagesText(trip.track?.academicStages)}
                    </span>
                  </div>
                </div>

                {/* Trip Type */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textLight flex-shrink-0">
                    {t("profile.tables.management.header.tripType")}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTripTypeLabel(trip.tripsType)}
                  </span>
                </div>

                {/* Trip Date */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-textLight flex-shrink-0">
                    {t("profile.tables.management.header.tripDate")}:
                  </span>
                  <span className="text-muted-foreground">
                    {formatDate(trip.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {hasElement(
                PERMISSIONS.ELEMENT.B2B_PROFILE_TRIPS_MANAGEMENT_BUTTON
              ) && (
                <div className="pt-2 border-t border-gray-100">
                  {trip.status === TRIP_STATUS.SCHEDULED ||
                  trip.status === TRIP_STATUS.PENDING ? (
                    <Link
                      href={`/${locale}/profile/create-trip-link/${trip.slug}`}
                      className="inline-block lg:text-sm text-xs transition-all lg:px-6 px-2 py-1 duration-150 ease-in-out bg-titleColor rounded-md text-white border-mainColor hover:bg-linksHover"
                    >
                      {t("links.tripManagement")}
                    </Link>
                  ) : (
                    <span className="inline-block lg:text-sm text-xs lg:px-6 px-2 py-1 rounded-md text-white bg-titleColor opacity-50 cursor-not-allowed">
                      {t("links.tripManagement")}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {enablePagination && data && (
        <Pagination
          pageInfo={data.pageInfo || data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default memo(TripsManagementTable);
