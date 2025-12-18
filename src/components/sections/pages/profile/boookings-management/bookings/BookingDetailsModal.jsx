"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";

import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";
import { exportToExcel } from "@utils/exportUtils";
import StudentsTable from "./StudentsTable";
import {
  locationIcon,
  timeIcon,
  dateIcon,
  profileIcon,
  walletIcon,
  ticketsIcon,
  phoneIcon,
  schoolIcon,
} from "@assets/svg";
import ExportButton from "@components/common/ExportButton";

const BookingDetailsModal = ({ booking, bookingDetails, loadingDetails }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [isExporting, setIsExporting] = useState(false);

  if (!booking) return null;

  // Process bookingDetails to ensure StudentsTable gets the right structure
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
    setIsExporting(true);

    try {
      // Ensure we're using all students data (not paginated)

      // Handle different possible data structures
      let studentsArray = [];

      // Extract students array from various possible structures
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

      const allStudentsData = { nodes: studentsArray };

      const result = exportToExcel(booking, allStudentsData, t, locale);

      if (result.success) {
      } else {
      }
    } catch (error) {
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white mx-auto w-[75%] rounded-xl mb-5">
      <h2 className="text-center text-2xl font-semibold">
        {t("profile.tables.orders.bookingDetails.title")} {booking.name}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {t("profile.tables.orders.bookingDetails.tripInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            <div className="flex flex-col gap-1 rounded-lg p-2 w-fit text-sm text-gray-600">
              <p className="">
                {t("profile.tables.orders.bookingDetails.tripDescription")}:
              </p>
              <p className="font-medium" title={booking.description}>
                {booking.description?.length <= 70
                  ? booking.description
                  : booking.description?.slice(0, 70) + "..."}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {locationIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.orders.bookingDetails.location")}:
              </p>
              <p className="font-medium">{booking.cities}</p>
            </div>

            {booking.fromHour && booking.toHour && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {timeIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.time")}:
                </p>
                <p className="font-medium">
                  {`${booking.toHour} - ${booking.fromHour}`}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {dateIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.tripStartDate")}:
                </p>
                <p className="font-medium">
                  {booking.day &&
                    formatDate(booking.day, locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {dateIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.tripEndDate")}:
                </p>
                <p className="font-medium">
                  {booking.day && booking.duration > 1
                    ? formatDate(
                        new Date(
                          new Date(booking.day).getTime() +
                            booking.duration * 24 * 60 * 60 * 1000
                        ),
                        locale,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : formatDate(booking.day, locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {ticketsIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.bookingStatus")}:
                </p>
                <p className="font-medium">
                  {t(`common.organizationTripStatus.${booking.status}`)}
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {walletIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.fees")}:
                </p>
                <p className="font-medium">
                  {booking.price ? formatCurrency(booking.price) : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {t("profile.tables.orders.bookingDetails.schoolInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {schoolIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.orders.bookingDetails.schoolName")}:
              </p>
              <p className="font-medium">{booking.organization?.name}</p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {profileIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.orders.bookingDetails.contactPerson")}:
              </p>
              <p className="font-medium">{booking.organization?.name}</p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {phoneIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.orders.bookingDetails.phoneNumber")}:
              </p>
              <p className="font-medium text-end" dir="ltr">
                {booking.organization?.pone}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {dateIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.orders.bookingDetails.bookingDate")}:
              </p>
              <p className="font-medium">
                {formatDate(booking.createdAt, locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {profileIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.orders.bookingDetails.schoolEmail")}:
              </p>
              <p className="font-medium">{booking.organization?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable
        bookingDetails={processedBookingDetails}
        loadingDetails={loadingDetails}
      />

      {/* Action Buttons */}
      <div className="space-y-3 print:hidden">
        {/* Excel Export Button */}
        <ExportButton
          onClick={handleExcelExport}
          loading={isExporting}
          disabled={loadingDetails}
          loadingText={t("forms.validation.downloading")}
        />
      </div>
    </div>
  );
};

export default memo(BookingDetailsModal);
