import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";
import formatNumbersUint from "@utils/FormatNumbersUint";
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

  if (loading || !bookingDetails) {
    return (
      <div className="p-8 bg-white rounded-xl mx-auto w-[90%] md:w-[70%] flex flex-col items-center justify-center min-h-[200px]">
        <CircularProgress size={40} color="primary" />
      </div>
    );
  }

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
    </div>
  );
};

export default memo(BookingDetailsModal);
