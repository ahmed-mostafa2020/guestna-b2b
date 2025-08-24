"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState } from "react";

import formatDate from "@utils/FormateDate";
import SurveyForm from "@components/forms/survey";

import { Typography, CardContent, Card } from "@mui/material";
import CustomizedModal from "@components/common/customizedModal";

const Report = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleSurveyFormOpen = (booking) => {
    setSelectedBooking(booking);
    setShowSurveyForm(true);
  };
  const handleSurveyFormClose = () => {
    setShowSurveyForm(false);
    setSelectedBooking(null);
  };

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || !data.nodes) {
    return (
      <Typography className="p-4 text-center">Loading bookings...</Typography>
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
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className=" bg-table-header">
                    <th className="px-6 py-4 font-medium text-start">
                      {t("profile.tables.bookings.header.schoolName")}
                    </th>
                    <th className="px-6 py-4 font-medium text-start">
                      {t("profile.tables.bookings.header.tripName")}
                    </th>

                    <th className="px-6 py-4 font-medium text-start">
                      {t("profile.tables.bookings.header.date")}
                    </th>
                    {/* <th className="px-6 py-4 font-medium text-start">
                    {t("profile.infoCards.totalStudents")}
                  </th> */}
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

                      <td className="px-6 py-4">
                        <div className="flex gap-[6px] items-center justify-end">
                          {booking.survey && (
                            <button
                              onClick={() => handleSurveyFormOpen(booking)}
                              className="flex-1 rounded-md text-sm text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                            >
                              {t("links.ConfirmationOfAchievement")}
                            </button>
                          )}

                          <button
                            disabled={booking.survey}
                            className={`${
                              booking.survey ? "flex-1" : "w-[48%]"
                            } rounded-md text-sm px-4 py-2 border border-secColor transition-all duration-200 ease-in-out ${
                              booking.survey
                                ? "opacity-70 cursor-not-allowed text-gray-700 border-gray-300"
                                : "hover:text-mainColor hover:border-mainColor"
                            }`}
                          >
                            {t("links.finalReport")}
                          </button>
                        </div>
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

                <div className="space-y-2">
                  <div className="flex gap-[6px] items-center justify-end">
                    {booking.survey && (
                      <button
                        onClick={() => handleSurveyFormOpen(booking)}
                        className="flex-1 rounded-md text-sm text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out"
                      >
                        {t("links.ConfirmationOfAchievement")}
                      </button>
                    )}

                    <button
                      disabled={booking.survey}
                      className={`${
                        booking.survey ? "flex-1" : "w-[48%]"
                      } rounded-md text-sm px-4 py-2 border border-secColor transition-all duration-200 ease-in-out ${
                        booking.survey
                          ? "opacity-70 cursor-not-allowed text-gray-700 border-gray-300"
                          : "hover:text-mainColor hover:border-mainColor"
                      }`}
                    >
                      {t("links.finalReport")}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                // Refresh data or update state after successful survey submission
                handleSurveyFormClose();
              }}
            />
          </CustomizedModal>
        </div>
      )}
    </>
  );
};

export default memo(Report);
