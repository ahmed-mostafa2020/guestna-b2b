"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import Pagination from "@components/common/Pagination";

import BookingDetailsModal from "./BookingDetailsModal";
import CustomizedModal from "@components/common/customizedModal";

import axios from "axios";
import { CardContent, Card, CircularProgress } from "@mui/material";

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

  const headers = getHeaders(locale);

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookingDetailsCache, setBookingDetailsCache] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchBookingDetails = async (bookingId) => {
    // Check if data is already cached
    if (bookingDetailsCache[bookingId]) {
      return bookingDetailsCache[bookingId];
    }

    setLoadingDetails(true);
    try {
      // Fetch ALL students without pagination by setting a high perPage value
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.BOOKING_DETAILS}/${bookingId}?perPage=10000`
        ),
        {
          headers,
        }
      );

      // Cache the response
      setBookingDetailsCache((prev) => ({
        ...prev,
        [bookingId]: response.data,
      }));

      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      console.error("Error details:", error.response?.data);
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleShowModal = async (bookingId) => {
    setSelectedBookingId(bookingId);
    const details = await fetchBookingDetails(bookingId);
  };

  const handleCloseModal = () => {
    setSelectedBookingId(null);
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
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>

                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.tripType")}
                  </th>

                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.tables.bookings.header.date")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-start">
                    {t("profile.infoCards.totalStudents")}
                  </th>

                  {hasElement(
                    PERMISSIONS.ELEMENT
                      .B2B_PROFILE_BOOKINGS_SHOW_TRIP_DETAILS_BUTTON
                  ) && (
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
                      {booking.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {booking.cities}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(booking.day, locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.bookingQuantity}
                    </td>

                    {hasElement(
                      PERMISSIONS.ELEMENT
                        .B2B_PROFILE_BOOKINGS_SHOW_TRIP_DETAILS_BUTTON
                    ) && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleShowModal(booking._id)}
                          className="rounded-md text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                        >
                          {t("links.showDetails")}
                        </button>
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
                    {booking.bookingQuantity}
                  </span>
                </div>
              </div>

              {hasElement(
                PERMISSIONS.ELEMENT
                  .B2B_PROFILE_BOOKINGS_SHOW_TRIP_DETAILS_BUTTON
              ) && (
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

      {/* Single Modal Outside Loop */}
      {selectedBookingId && (
        <CustomizedModal
          open={true}
          handleClose={handleCloseModal}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          padding={false}
        >
          <BookingDetailsModal
            booking={data?.nodes?.find(
              (booking) => booking._id === selectedBookingId
            )}
            bookingDetails={bookingDetailsCache[selectedBookingId]}
            loadingDetails={loadingDetails}
          />
        </CustomizedModal>
      )}
    </div>
  );
};

export default memo(BookingsTable);
