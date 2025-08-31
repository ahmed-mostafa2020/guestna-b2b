"use client";

import React, { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";

import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";
import { exportToExcel, exportModalToPDF } from "@utils/exportUtils";
import StudentsTable from "./StudentsTable";
import {
  locationIcon,
  timeIcon,
  dateIcon,
  schoolsIcon,
  profileIcon,
  walletIcon,
  ticketsIcon,
  companiesIcon,
  phoneIcon,
  schoolIcon,
} from "@assets/svg";

const BookingDetailsModal = ({ booking, bookingDetails, loadingDetails }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCapturingPDF, setIsCapturingPDF] = useState(false);
  const modalRef = useRef(null);

  if (!booking) return null;

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowExportOptions(false);

    try {
      let result;
      if (format === "excel") {
        result = exportToExcel(booking, bookingDetails, t, locale);
      } else if (format === "pdf") {
        // Use canvas screenshot approach for PDF
        if (modalRef.current) {
          setIsCapturingPDF(true);
          // Longer delay to ensure all students are rendered
          await new Promise((resolve) => setTimeout(resolve, 1000));
          result = await exportModalToPDF(modalRef.current, booking, locale);
          setIsCapturingPDF(false);
        } else {
          throw new Error("Modal element not found");
        }
      }

      if (result.success) {
        // You can add a success notification here if you have a notification system
        console.log(`Export successful: ${result.filename}`);
      } else {
        console.error("Export failed:", result.error);
        // You can add an error notification here
      }
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      ref={modalRef}
      className="space-y-6 p-6 bg-white mx-auto w-[75%] rounded-xl mb-5"
    >
      <h2 className="text-center text-2xl font-semibold">
        {t("profile.tables.orders.bookingDetails.title")} {booking.name}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {t("profile.tables.orders.bookingDetails.tripInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              <p className="text-sm text-gray-600">
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
                  {booking.price
                    ? formatCurrency(booking.price)
                    : booking.fees
                    ? formatCurrency(booking.fees)
                    : "120 ريال"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="space-y-6">
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
          </div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable
        bookingDetails={bookingDetails}
        loadingDetails={loadingDetails}
        showAllForPDF={isCapturingPDF}
      />

      {/* Action Buttons */}
      {booking.status === "DONE" && (
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            disabled={isExporting}
            className="bg-mainColor w-full hover:bg-titleColor text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t("forms.validation.downloading")}
              </>
            ) : (
              <>
                {t("profile.tables.orders.bookingDetails.printReport")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>

          {showExportOptions && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
              <button
                onClick={() => handleExport("excel")}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">📊</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Excel</p>
                  <p className="text-sm text-gray-500">
                    {t("common.export.excel.description")}
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">📄</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">PDF</p>
                  <p className="text-sm text-gray-500">
                    {t("common.export.pdf.description")}
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(BookingDetailsModal);
