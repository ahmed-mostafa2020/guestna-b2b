"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@mui/material";
import formatDate from "@utils/FormateDate";

const BookingsTable = ({ bookings = [] }) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="space-y-4">
      {/* Desktop Table (Hidden on Mobile) */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-tableRowBorder">
                  <th className="p-4 font-semibold text-start">
                    {t("profile.schoolTeamStudents.details.activityName")}
                  </th>
                  <th className="p-4 font-semibold text-center">
                    {t("profile.schoolTeamStudents.details.date")}
                  </th>
                  <th className="p-4 font-semibold text-center">
                    {t("profile.schoolTeamStudents.details.bookingMethod")}
                  </th>
                  <th className="p-4 font-semibold text-center">
                    {t("profile.schoolTeamStudents.details.status")}
                  </th>
                  <th className="p-4 font-semibold text-center">
                    {t("profile.schoolTeamStudents.details.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings?.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`${
                        index !== bookings.length - 1 &&
                        "border-b border-table-border"
                      } transition-colors hover:bg-gray-50`}
                    >
                      <td className="p-4 text-sm font-medium text-foreground">
                        {booking.tripName || "-"}
                      </td>
                      <td className="p-4 text-sm font-medium text-center text-foreground">
                        {booking.date
                          ? formatDate(booking.date, locale, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="p-4 text-sm font-medium text-center text-foreground">
                        {t("profile.schoolTeamStudents.details.parent")}
                      </td>
                      <td className="p-4 text-sm font-medium text-center text-foreground">
                        {t(`common.bookingStatus.${booking.status}`) ||
                          booking.status}
                      </td>
                      <td className="p-4 text-center">
                        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-mainColor border border-transparent hover:border-mainColor hover:border rounded-lg transition-colors">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="p-8 text-center text-textLight">
                      {t("profile.schoolTeamStudents.details.noData")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards (Visible ONLY on Mobile) */}
      <div className="md:hidden space-y-4">
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking._id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-textLight">
                      {t("profile.schoolTeamStudents.details.activityName")}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {booking.tripName || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-textLight">
                      {t("profile.schoolTeamStudents.details.date")}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {booking.date
                        ? formatDate(booking.date, locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-textLight">
                      {t("profile.schoolTeamStudents.details.bookingMethod")}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {t("profile.schoolTeamStudents.details.parent")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-textLight">
                      {t("profile.schoolTeamStudents.details.status")}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {t(`common.bookingStatus.${booking.status}`) ||
                        booking.status}
                    </span>
                  </div>
                  <div className="pt-2">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-mainColor border border-mainColor rounded-lg hover:bg-gray-50 transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {t("profile.schoolTeamStudents.details.actions")}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-textLight bg-gray-50 rounded-lg">
            {t("profile.schoolTeamStudents.details.noData")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsTable;
