"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";

import { CircularProgress } from "@mui/material";

import CustomizedModal from "@components/common/customizedModal";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

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
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-titleColor">
              {t("profile.schoolTeamStudents.details.title")}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t("common.close")}
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
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
              <div className="space-y-4">
                {/* Student Name */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                  <span className="font-medium text-textLight">
                    {t("profile.schoolTeamStudents.details.name")}
                  </span>
                  <span className="font-semibold text-titleColor">
                    {data.name || "-"}
                  </span>
                </div>

                {/* Academic Stage */}
                {data.academicStage?.name && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                    <span className="font-medium text-textLight">
                      {t("profile.schoolTeamStudents.details.academicStage")}
                    </span>
                    <span className="font-semibold text-titleColor">
                      {data.academicStage.name}
                    </span>
                  </div>
                )}

                {/* Grade */}
                {data.grade?.name && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                    <span className="font-medium text-textLight">
                      {t("profile.schoolTeamStudents.details.grade")}
                    </span>
                    <span className="font-semibold text-titleColor">
                      {data.grade.name}
                    </span>
                  </div>
                )}

                {/* Parent Name */}
                {data.parent?.name && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                    <span className="font-medium text-textLight">
                      {t("profile.schoolTeamStudents.details.parentName")}
                    </span>
                    <span className="font-semibold text-titleColor">
                      {data.parent.name}
                    </span>
                  </div>
                )}

                {/* Parent Email */}
                {data.parent?.email && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                    <span className="font-medium text-textLight">
                      {t("profile.schoolTeamStudents.details.parentEmail")}
                    </span>
                    <span className="font-semibold text-titleColor" dir="ltr">
                      {data.parent.email}
                    </span>
                  </div>
                )}

                {/* Parent Phone */}
                {data.parent?.phone && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-gray-50">
                    <span className="font-medium text-textLight">
                      {t("profile.schoolTeamStudents.details.parentPhone")}
                    </span>
                    <span className="font-semibold text-titleColor" dir="ltr">
                      {data.parent.phone}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-textLight">
                  {t("profile.schoolTeamStudents.details.noData")}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-mainColor hover:bg-linksHover rounded-xl transition-colors"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(StudentDetailsModal);
