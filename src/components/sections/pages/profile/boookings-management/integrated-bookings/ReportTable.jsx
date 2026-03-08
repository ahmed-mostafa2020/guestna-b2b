"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import SurveyForm from "@components/forms/survey";
import CustomizedModal from "@components/common/customizedModal";
import DataTable from "@components/common/DataTable";

import { CircularProgress } from "@mui/material";

const ReportTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  tableTitle,
}) => {
  const { hasAnyElement, hasElement } = usePermissions();
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
        <DataTable
          title={tableTitle}
          columns={[
            {
              key: "organization",
              label: t("profile.tables.bookings.header.schoolName"),
              render: (row) => row.organization?.name || "-",
              className: "font-medium text-foreground",
            },
            {
              key: "name",
              label: t("profile.tables.bookings.header.tripName"),
              className: "font-medium text-foreground",
            },
            {
              key: "date",
              label: t("profile.tables.bookings.header.date"),
              render: (row) => formatDate(row.day, locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          ]}
          data={data?.nodes || []}
          actionsLabel={hasAnyReportPermission ? t("profile.tables.bookings.header.actions") : null}
          rowActions={hasAnyReportPermission ? (booking) => (
            <div className="flex gap-[6px] items-center justify-end">
              {canConfirmAchievement && !booking.survey && (
                <button
                  disabled={
                    booking.status !== TRIP_STATUS.PENDING ||
                    disabledBookingIds.has(booking._id)
                  }
                  onClick={() => handleSurveyFormOpen(booking)}
                  className="disabled:opacity-70 disabled:cursor-not-allowed flex-1 rounded-md text-sm text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                >
                  {t("links.ConfirmationOfAchievement")}
                </button>
              )}

              {canViewFinalReport && (
                <button
                  disabled={true}
                  className={`${
                    !booking.survey ? "flex-1" : "w-full"
                  } disabled:opacity-70 bg-white disabled:cursor-not-allowed rounded-md text-sm px-4 py-2 border border-secColor transition-all duration-200 ease-in-out ${
                    !booking.survey
                      ? "opacity-70 cursor-not-allowed text-gray-700 border-gray-300"
                      : "hover:text-mainColor hover:border-mainColor"
                  }`}
                >
                  {t("links.finalReport")}
                </button>
              )}
            </div>
          ) : null}
          pagination={enablePagination && {
            currentPage,
            pageInfo: data,
            onPageChange: setCurrentPage
          }}
        />

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
