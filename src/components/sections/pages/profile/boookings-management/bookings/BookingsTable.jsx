"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState } from "react";

import formatDate from "@utils/FormateDate";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";

import Pagination from "@components/common/Pagination";
import BookingDetailsModal from "./BookingDetailsModal";
import CustomizedModal from "@components/common/customizedModal";

import axios from "axios";
import { Typography, CardContent, Card } from "@mui/material";

const BookingsTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchBookingDetails = async (bookingId) => {
    console.log("Fetching booking details for ID:", bookingId);
    setLoadingDetails(true);
    try {
      const response = await axios.post(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.BOOKING_DETAILS}/${bookingId}`
        ),
        {},
        {
          headers,
        }
      );

      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleShowModal = async (bookingId) => {
    setSelectedBookingId(bookingId);
    await fetchBookingDetails(bookingId);
  };

  const handleCloseModal = () => {
    setSelectedBookingId(null);
    setBookingDetails(null);
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
                <tr className=" bg-table-header">
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>

                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.tripType")}
                  </th>

                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.date")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.infoCards.totalStudents")}
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
                    } transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? "bg-table-row-even" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.name}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.categories}
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

                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.availableSeats}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleShowModal(booking._id)}
                        className="rounded-md text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                      >
                        {t("links.showDetails")}
                      </button>
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

                <span className="text-muted-foreground">
                  {booking.categories}
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

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {booking.availableSeats}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShowModal(booking._id)}
                    className="rounded-lg text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                  >
                    {t("links.showDetails")}
                  </button>
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

      {/* Single Modal Outside Loop */}
      {selectedBookingId && (
        <CustomizedModal
          open={true}
          handleClose={handleCloseModal}
          bgcolor="rgba(0, 0, 0, 0.2)"
          customizedCloseButton={true}
          padding={false}
        >
          <BookingDetailsModal
            open={true}
            onClose={handleCloseModal}
            booking={data.nodes.find(
              (booking) => booking._id === selectedBookingId
            )}
            bookingDetails={bookingDetails}
            loadingDetails={loadingDetails}
          />
        </CustomizedModal>
      )}
    </div>
  );
};

export default memo(BookingsTable);
