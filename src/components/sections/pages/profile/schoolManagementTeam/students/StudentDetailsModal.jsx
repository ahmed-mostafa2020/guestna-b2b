"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";

import { CircularProgress, Card, CardContent } from "@mui/material";

import CustomizedModal from "@components/common/customizedModal";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatDate from "@utils/FormateDate";

const StudentDetailsModal = ({ open, handleClose, studentId }) => {
  const t = useTranslations();
  const locale = useLocale();

  // Fetch student details
  const { data, isLoading } = useFetchData(
    open && studentId
      ? `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.STUDENTS.SSTUDENT_DETAILS}/${studentId}`
      : null,
    {},
    {
      method: "GET",
      lang: locale,
    }
  );

  return (
    <CustomizedModal
      open={open}
      handleClose={handleClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={true}
      padding={false}
    >
      <div className="centered min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="centered p-6">
            <h2 className="lg:text-xl text-lg font-semibold text-black">
              {t("profile.schoolTeamStudents.details.title")}: {data?.name}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 overflow-auto flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CircularProgress
                  size={40}
                  sx={{ color: "var(--color-main)" }}
                />
                <p className="mt-4 text-textLight">
                  {t("profile.schoolTeamStudents.details.loading")}
                </p>
              </div>
            ) : data ? (
              <div className="space-y-8">
                {/* Top Section - 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Student Info (Right in RTL) */}
                  <div>
                    <h3 className="text-lg font-medium text-black pb-2 w-fit">
                      {t("profile.schoolTeamStudents.details.basicInfo")}
                    </h3>
                    <div className="border border-border rounded-2xl p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.name")}
                          </span>
                          <span className="text-textLight font-medium">
                            {data.name || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t(
                              "profile.schoolTeamStudents.details.academicStage"
                            )}
                          </span>
                          <span className="text-textLight font-medium">
                            {data.academicStage?.name || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.grade")}
                          </span>
                          <span className="text-textLight font-medium">
                            {data.grade?.name || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.track")}
                          </span>
                          <span className="text-textLight font-medium">
                            {data.track?.educationSystem?.name || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.age")}
                          </span>
                          <span className="text-textLight font-medium">
                            - {/* JSON doesn't have age */}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t(
                              "profile.schoolTeamStudents.details.studentNumber"
                            )}
                          </span>
                          <span className="text-textLight font-medium break-all">
                            {data._id || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.nationalId")}
                          </span>
                          <span className="text-textLight font-medium">
                            -{" "}
                            {/* JSON doesn't have student nationalId explicitly in root */}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.status")}
                          </span>
                          -
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact with Parent (Left in RTL) */}
                  <div>
                    <h3 className="text-lg font-medium text-black pb-2 w-fit">
                      {t(
                        "profile.schoolTeamStudents.details.contactWithParent"
                      )}
                    </h3>
                    <div className="border border-border rounded-2xl p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.parentName")}
                          </span>
                          <span className="text-textLight font-medium">
                            {data.parent?.name || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t(
                              "profile.schoolTeamStudents.details.parentPhone"
                            )}
                          </span>
                          <span
                            className="text-textLight font-medium text-end"
                            dir="ltr"
                          >
                            {data.parent?.phone || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t(
                              "profile.schoolTeamStudents.details.parentEmail"
                            )}
                          </span>
                          <span className="text-textLight font-medium break-all">
                            {data.parent?.email || "-"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t(
                              "profile.schoolTeamStudents.details.additionalPhone"
                            )}
                          </span>
                          <span
                            className="text-textLight font-medium text-end"
                            dir="ltr"
                          >
                            - {/* Placeholder */}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-black font-medium">
                            {t("profile.schoolTeamStudents.details.nationalId")}
                          </span>
                          <span className="text-textLight font-medium">
                            {data.parent?.nationalId || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details Section */}
                <div>
                  <h3 className="text-lg font-bold text-black pb-4">
                    {t("profile.schoolTeamStudents.details.bookingDetails")}
                  </h3>

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
                                  {t(
                                    "profile.schoolTeamStudents.details.activityName"
                                  )}
                                </th>
                                <th className="p-4 font-semibold text-center">
                                  {t("profile.schoolTeamStudents.details.date")}
                                </th>
                                <th className="p-4 font-semibold text-center">
                                  {t(
                                    "profile.schoolTeamStudents.details.bookingMethod"
                                  )}
                                </th>
                                <th className="p-4 font-semibold text-center">
                                  {t(
                                    "profile.schoolTeamStudents.details.status"
                                  )}
                                </th>
                                <th className="p-4 font-semibold text-center">
                                  {t(
                                    "profile.schoolTeamStudents.details.actions"
                                  )}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {data.bookings?.length > 0 ? (
                                data.bookings.map((booking, index) => (
                                  <tr
                                    key={booking._id}
                                    className={`${
                                      index !== data.bookings.length - 1 &&
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
                                      {t(
                                        "profile.schoolTeamStudents.details.parent"
                                      )}
                                    </td>
                                    <td className="p-4 text-sm font-medium text-center text-foreground">
                                      {t(
                                        `common.bookingStatus.${booking.status}`
                                      ) || booking.status}
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
                                  <td
                                    colSpan="5"
                                    className="p-8 text-center text-textLight"
                                  >
                                    {t(
                                      "profile.schoolTeamStudents.details.noData"
                                    )}
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
                      {data.bookings?.length > 0 ? (
                        data.bookings.map((booking) => (
                          <Card key={booking._id} className="shadow-sm">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-textLight">
                                    {t(
                                      "profile.schoolTeamStudents.details.activityName"
                                    )}
                                  </span>
                                  <span className="text-sm font-medium text-foreground">
                                    {booking.tripName || "-"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-textLight">
                                    {t(
                                      "profile.schoolTeamStudents.details.date"
                                    )}
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
                                    {t(
                                      "profile.schoolTeamStudents.details.bookingMethod"
                                    )}
                                  </span>
                                  <span className="text-sm font-medium text-foreground">
                                    {t(
                                      "profile.schoolTeamStudents.details.parent"
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-textLight">
                                    {t(
                                      "profile.schoolTeamStudents.details.status"
                                    )}
                                  </span>
                                  <span className="text-sm font-medium text-foreground">
                                    {t(
                                      `common.bookingStatus.${booking.status}`
                                    ) || booking.status}
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
                                    {t(
                                      "profile.schoolTeamStudents.details.actions"
                                    )}
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
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-textLight">
                  {t("profile.schoolTeamStudents.details.noData")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(StudentDetailsModal);
