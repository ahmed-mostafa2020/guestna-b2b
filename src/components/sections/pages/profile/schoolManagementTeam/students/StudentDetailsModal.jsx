"use client";

import { memo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { CircularProgress } from "@mui/material";

import CustomizedModal from "@components/common/customizedModal";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { exportStudentDetailsToExcel } from "@utils/exportUtils";
import BookingsTable from "./BookingsTable";
import { Print } from "@mui/icons-material";

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

  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = async () => {
    setIsExporting(true);
    await exportStudentDetailsToExcel(data, t, locale);
    setIsExporting(false);
  };

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
                  <h3 className="text-lg font-medium text-black pb-4">
                    {t("profile.schoolTeamStudents.details.bookingDetails")}
                  </h3>

                  <div className="space-y-4">
                    <BookingsTable bookings={data.bookings} />
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

          {/* Footer - Print Button */}
          {data && !isLoading && (
            <div className="p-6 border-t border-border flex bg-white">
              <button
                onClick={handlePrint}
                disabled={isExporting}
                className="bg-mainColor text-center w-full text-white px-6 py-2.5 rounded-lg font-medium hover:bg-mainColor/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex centered gap-2 shadow-sm"
              >
                {isExporting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Print fontSize="small" />
                )}
                {t("links.print")}
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(StudentDetailsModal);
