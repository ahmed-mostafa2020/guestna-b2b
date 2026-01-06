"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import SurveyForm from "@components/forms/survey";
import CustomizedModal from "@components/common/customizedModal";
import Pagination from "@components/common/Pagination";

import { CardContent, Card, CircularProgress } from "@mui/material";

const ReportTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  tableTitle,
}) => {
  const { hasAnyElement, hasElement, getGtmProps } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [disabledBookingIds, setDisabledBookingIds] = useState(new Set());

  // Check if user has any report permissions
  const hasAnyReportPermission = hasAnyElement([
    PERMISSIONS.ELEMENT.B2B_PROFILE_ACHIENVEMENT_CONFIRMATION,
    PERMISSIONS.ELEMENT.B2B_PROFILE_FINAL_REPORT,
  ]);

  // Check individual permissions
  const canConfirmAchievement = hasElement(
    PERMISSIONS.ELEMENT.B2B_PROFILE_ACHIENVEMENT_CONFIRMATION
  );
  const canViewFinalReport = hasElement(
    PERMISSIONS.ELEMENT.B2B_PROFILE_FINAL_REPORT
  );

  const handleSurveyFormOpen = (booking) => {
    setSelectedBooking(booking);
    setShowSurveyForm(true);
  };
  const handleSurveyFormClose = () => {
    setShowSurveyForm(false);
    setSelectedBooking(null);
  };

  if (!data || !data.nodes) {
    return (
      <div className="w-full min-h-[400px] centered">
        <CircularProgress size={50} color="primary" />
      </div>
    );
  }

  return (
    <>
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
                  <tr className=" bg-table-header border-b-2 border-tableRowBorder">
                    <th className="px-6 py-4 font-semibold text-start">
                      {t("profile.tables.bookings.header.schoolName")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-start">
                      {t("profile.tables.bookings.header.tripName")}
                    </th>

                    <th className="px-6 py-4 font-semibold text-start">
                      {t("profile.tables.bookings.header.date")}
                    </th>
                    {/* <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.infoCards.totalStudents")}
                  </th> */}
                    {hasAnyReportPermission && (
                      <th className="px-6 py-4 font-semibold text-start">
                        {t("profile.tables.bookings.header.actions")}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data?.nodes?.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`${
                        index != data?.nodes?.length - 1 &&
                        "border-b border-table-border"
                      } transition-colors hover:bg-gray-50`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {booking.organization.name}
                      </td>
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

                      {/* <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.availableSeats}
                    </td> */}

                      {hasAnyReportPermission && (
                        <td className="px-6 py-4">
                          <div className="flex gap-[6px] items-center justify-end">
                            {canConfirmAchievement && !booking.survey && (
                              <button
                                disabled={
                                  booking.status !== TRIP_STATUS.PENDING ||
                                  disabledBookingIds.has(booking._id)
                                }
                                onClick={() => handleSurveyFormOpen(booking)}
                                className="disabled:opacity-70 disabled:cursor-not-allowed flex-1 rounded-md text-sm text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                                {...getGtmProps(
                                  PERMISSIONS.ELEMENT
                                    .B2B_PROFILE_ACHIENVEMENT_CONFIRMATION
                                )}
                              >
                                {t("links.ConfirmationOfAchievement")}
                              </button>
                            )}

                            {canViewFinalReport && (
                              <button
                                disabled={true}
                                // disabled={!booking.survey}
                                className={`${
                                  !booking.survey ? "flex-1" : "w-full"
                                } disabled:opacity-70 bg-white disabled:cursor-not-allowed rounded-md text-sm px-4 py-2 border border-secColor transition-all duration-200 ease-in-out ${
                                  !booking.survey
                                    ? "opacity-70 cursor-not-allowed text-gray-700 border-gray-300"
                                    : "hover:text-mainColor hover:border-mainColor"
                                }`}
                                {...getGtmProps(
                                  PERMISSIONS.ELEMENT.B2B_PROFILE_FINAL_REPORT
                                )}
                              >
                                {t("links.finalReport")}
                              </button>
                            )}
                          </div>
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

          {data?.nodes?.map((booking) => (
            <Card
              key={booking._id}
              className="transition-shadow shadow-md hover:shadow-lg"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col items-start justify-between">
                  <h3 className="text-lg font-bold leading-relaxed text-foreground">
                    {booking.name}
                  </h3>

                  <span className="text-muted-foreground">
                    {booking.organization.name}
                  </span>
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

                  {/* <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {booking.availableSeats}
                  </span>
                </div> */}
                </div>

                {hasAnyReportPermission && (
                  <div className="space-y-2">
                    <div className="flex gap-[6px] items-center justify-end">
                      {canConfirmAchievement && !booking.survey && (
                        <button
                          disabled={
                            booking.status !== TRIP_STATUS.PENDING ||
                            disabledBookingIds.has(booking._id)
                          }
                          onClick={() => handleSurveyFormOpen(booking)}
                          className="disabled:opacity-70 disabled:cursor-not-allowed flex-1 rounded-md text-sm text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                          {...getGtmProps(
                            PERMISSIONS.ELEMENT
                              .B2B_PROFILE_ACHIENVEMENT_CONFIRMATION
                          )}
                        >
                          {t("links.ConfirmationOfAchievement")}
                        </button>
                      )}

                      {canViewFinalReport && (
                        <button
                          disabled={true}
                          // disabled={!booking.survey}
                          className={`${
                            !booking.survey ? "flex-1" : "w-full"
                          } disabled:opacity-70 disabled:cursor-not-allowed rounded-md text-sm px-4 py-2 bg-white border border-secColor transition-all duration-200 ease-in-out ${
                            !booking.survey
                              ? "opacity-70 cursor-not-allowed text-gray-700 border-gray-300"
                              : "hover:text-mainColor hover:border-mainColor"
                          }`}
                          {...getGtmProps(
                            PERMISSIONS.ELEMENT.B2B_PROFILE_FINAL_REPORT
                          )}
                        >
                          {t("links.finalReport")}
                        </button>
                      )}
                    </div>
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

      {showSurveyForm && (
        <div className="bg-white centered">
          <CustomizedModal
            open={showSurveyForm}
            handleClose={handleSurveyFormClose}
            bgcolor="rgba(0, 0, 0, 0.5)"
            customizedCloseButton={true}
            padding={false}
          >
            <SurveyForm
              tripId={selectedBooking?.trip || selectedBooking?._id}
              organizationId={selectedBooking?.organization?._id}
              onClose={handleSurveyFormClose}
              onSuccess={() => {
                setDisabledBookingIds(
                  (prev) => new Set([...prev, selectedBooking._id])
                );
                handleSurveyFormClose();
              }}
            />
          </CustomizedModal>
        </div>
      )}
    </>
  );
};

export default memo(ReportTable);
