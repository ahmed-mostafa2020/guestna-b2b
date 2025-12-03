import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";
import formatNumbersUint from "@utils/FormatNumbersUint";
import { exportMyBookingToExcel } from "@utils/exportUtils";
import StudentsTable from "../boookings-management/bookings/StudentsTable";
import {
  locationIcon,
  dateIcon,
  profileIcon,
  walletIcon,
  ticketsIcon,
  schoolIcon,
} from "@assets/svg";
import { CircularProgress, Badge } from "@mui/material";
import { TRIP_STATUS } from "@constants/tripStatus";

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

const BookingDetailsModal = ({ booking, bookingDetails, loading }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [isExporting, setIsExporting] = useState(false);

  // Process bookingDetails to ensure StudentsTable gets the right structure
  // MUST be before conditional returns to avoid hook order issues
  const processedBookingDetails = React.useMemo(() => {
    if (!bookingDetails) return { nodes: [] };

    let studentsArray = [];

    if (Array.isArray(bookingDetails)) {
      studentsArray = bookingDetails;
    } else if (bookingDetails?.nodes && Array.isArray(bookingDetails.nodes)) {
      studentsArray = bookingDetails.nodes;
    } else if (
      bookingDetails?.data?.nodes &&
      Array.isArray(bookingDetails.data.nodes)
    ) {
      studentsArray = bookingDetails.data.nodes;
    } else if (bookingDetails?.data && Array.isArray(bookingDetails.data)) {
      studentsArray = bookingDetails.data;
    } else if (bookingDetails && typeof bookingDetails === "object") {
      // Look for arrays in the object that contain student-like data
      const keys = Object.keys(bookingDetails);
      for (const key of keys) {
        if (
          Array.isArray(bookingDetails[key]) &&
          bookingDetails[key].length > 0
        ) {
          const firstItem = bookingDetails[key][0];
          if (
            firstItem &&
            (firstItem.child || firstItem.parent || firstItem.student)
          ) {
            studentsArray = bookingDetails[key];
            break;
          }
        }
      }
    }

    return { nodes: studentsArray };
  }, [bookingDetails]);

  const handleExcelExport = async () => {
    if (!bookingDetails) return;

    setIsExporting(true);

    try {
      // Use exportMyBookingToExcel for myBookings data structure
      const result = exportMyBookingToExcel(
        booking,
        processedBookingDetails,
        t,
        locale
      );

      if (result.success) {
        // Export successful
      } else {
        // Export failed
      }
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white mx-auto w-[95%] md:w-[75%] rounded-xl mb-5 max-h-[90vh] overflow-y-auto">
      <h2 className="text-center text-xl md:text-2xl font-semibold">
        {t("profile.tables.bookings.details.title")}{" "}
        {booking?.name || booking?._id}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Trip Information */}
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-base md:text-lg font-medium">
            {t("profile.tables.bookings.details.tripInfo")}
          </h3>

          <div className="flex flex-wrap gap-3 border-2 border-border rounded-lg p-3">
            {/* Trip Name */}
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
              {ticketsIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.bookings.header.tripName")}:
              </p>
              <p className="font-medium">{booking?.name}</p>
            </div>

            {/* Organization */}
            {booking?.organization && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
                {schoolIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.bookings.header.schoolName")}:
                </p>
                <p className="font-medium">{booking?.organization}</p>
              </div>
            )}

            {/* Category */}
            {booking?.category && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
                {profileIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.bookings.header.tripType")}:
                </p>
                <p className="font-medium">{booking?.category}</p>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
              {dateIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.bookings.header.date")}:
              </p>
              <p className="font-medium">
                {booking?.day &&
                  formatDate(booking.day, locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </p>
            </div>

            {/* Time */}
            {booking?.fromHour && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
                {dateIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.bookings.details.time")}:
                </p>
                <p className="font-medium">{booking?.fromHour}</p>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
              {ticketsIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.bookings.header.status")}:
              </p>
              <Badge
                variant="outline"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                }}
                className={`text-xs capitalize ${getStatusStyles(
                  booking?.status
                )}`}
              >
                {t(`common.organizationTripStatus.${booking?.status}`)}
              </Badge>
            </div>

            {/* Revenue */}
            {booking?.revenueAmount !== undefined && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
                {walletIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.bookings.header.price")}:
                </p>
                <span className="text-sm font-medium">
                  {formatCurrency(booking?.revenueAmount)}
                </span>
              </div>
            )}

            {/* Administrative Comment */}
            {booking?.comment?.comment && (
              <div className="mt-4 p-4 bg-gray-50 border-l-4 border-mainColor rounded-lg w-full">
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-mainColor">
                      {t(
                        "profile.tables.bookings.actions.administrativeComment"
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm mt-1">
                      <span>
                        {t("profile.tables.orders.bookingDetails.createdBy")}:{" "}
                        <span className="font-medium">
                          {booking.comment.createdBy}
                        </span>
                      </span>
                      <span>•</span>
                      <span>
                        {formatDate(booking.comment.createdAt, locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="prose prose-sm max-w-none text-gray-800 mt-2"
                  dangerouslySetInnerHTML={{
                    __html: booking.comment.comment,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Booking Information */}
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-base md:text-lg font-medium">
            {t("profile.tables.bookings.details.bookingInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            {/* Students Count */}
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-full md:w-fit">
              {ticketsIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.bookings.header.quantity")}:
              </p>
              <p className="font-medium">
                {formatNumbersUint(
                  booking?.bookingQuantity,
                  t("common.student"),
                  t("common.students")
                )}
              </p>
            </div>

            {/* Additional details from API response */}
            {bookingDetails?.note && (
              <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-full">
                <p className="text-sm text-gray-600">
                  {t("profile.tables.bookings.details.note")}:
                </p>
                <p className="font-medium">{bookingDetails?.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading || !bookingDetails ? (
        <div className="p-8 bg-white rounded-xl mx-auto w-[90%] md:w-[70%] flex flex-col items-center justify-center min-h-[200px]">
          <CircularProgress size={40} color="primary" />
        </div>
      ) : (
        <>
          <StudentsTable
            bookingDetails={processedBookingDetails}
            loadingDetails={loading}
          />
          {/* Action Buttons */}
          <div className="space-y-3 print:hidden">
            {/* Excel Export Button */}
            <button
              onClick={handleExcelExport}
              disabled={isExporting || loading}
              className="bg-green-600 w-full hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t("forms.validation.downloading")}
                </>
              ) : (
                <>
                  <span className="text-lg">📊</span>
                  {t("profile.tables.orders.bookingDetails.exportExcel")}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(BookingDetailsModal);
