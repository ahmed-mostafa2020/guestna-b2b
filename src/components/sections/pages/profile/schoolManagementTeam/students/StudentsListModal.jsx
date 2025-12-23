"use client";

import { memo, useState, useMemo, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";

import { Card, CardContent, CircularProgress } from "@mui/material";
import { Visibility, Print } from "@mui/icons-material";

import CustomizedModal from "@components/common/customizedModal";
import Pagination from "@components/common/Pagination";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { exportModalToPDF } from "@utils/exportUtils";
import { useExcel } from "@hooks/useExcel";
import ExportButton from "@components/common/ExportButton";

const StudentsListModal = ({
  open,
  handleClose,
  organizationId,
  gradeId,
  gradeName,
  onViewStudent,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const modalRef = useRef(null);
  const { exportStudentsList, isExporting } = useExcel({ t, locale });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch students by grade
  const { data, isLoading } = useFetchData(
    open
      ? `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.STUDENTS.GRADE_STUDENTS}/${organizationId}/${gradeId}/${currentPage}`
      : null,
    {},
    {
      method: "GET",
      lang: locale,
    }
  );

  const students = useMemo(() => data?.nodes || [], [data]);
  const pageInfo = useMemo(
    () =>
      data?.pageInfo || {
        total: 0,
        perPage: 10,
        currentPage: 1,
        hasNextPage: false,
        totalPages: 1,
      },
    [data]
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleViewStudent = useCallback(
    (studentId) => {
      if (onViewStudent) {
        onViewStudent(studentId);
      }
    },
    [onViewStudent]
  );

  const handlePrint = async (type) => {
    try {
      if (type === "excel") {
        const labels = {
          reportTitle:
            t("profile.schoolTeamStudents.report.title") + " " + gradeName,
          studentName: t("profile.schoolTeamStudents.modal.name"),
          filename: t("profile.schoolTeamStudents.report.filename"),
        };

        await exportStudentsList({
          students,
          gradeName,
          translatedLabels: labels,
        });
      } else {
        if (!modalRef.current) return;
        await exportModalToPDF(
          modalRef.current,
          { name: `${gradeName}_Students` },
          locale,
          t
        );
      }
    } catch (error) {
      console.error("Print error:", error);
    }
  };

  return (
    <>
      <CustomizedModal
        open={open}
        handleClose={handleClose}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        closeButton={true}
        padding={false}
      >
        <div className="centered min-h-screen p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="centered p-6">
              <div className="flex items-center gap-3">
                <h2 className="lg:text-xl text-2xl font-semibold text-black">
                  {t("profile.schoolTeamStudents.modal.title")} {gradeName}
                </h2>
              </div>
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
                    {t("profile.schoolTeamStudents.modal.loading")}
                  </p>
                </div>
              ) : students.length > 0 ? (
                <>
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
                            <tr className="border-b-2 border-tableRowBorder">
                              <th className="p-4 font-semibold text-start">
                                {t("profile.schoolTeamStudents.modal.name")}
                              </th>
                              <th className="p-4 font-semibold text-center print:hidden">
                                {t("profile.schoolTeamStudents.modal.actions")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {students.map((student, index) => (
                              <tr
                                key={student._id}
                                className={`${
                                  index !== students.length - 1 &&
                                  "border-b border-table-border"
                                } transition-colors hover:bg-gray-50`}
                              >
                                <td className="p-4 text-sm font-medium text-foreground">
                                  {student.name}
                                </td>
                                <td className="p-4 text-center print:hidden">
                                  <button
                                    onClick={() =>
                                      handleViewStudent(student._id)
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-mainColor border border-transparent hover:border-mainColor hover:border rounded-lg transition-colors"
                                    aria-label={t(
                                      "profile.schoolTeamStudents.modal.viewDetails"
                                    )}
                                  >
                                    <Visibility fontSize="small" />
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
                  <div className="md:hidden space-y-4 print:hidden">
                    {students.map((student) => (
                      <Card key={student._id} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">
                                {t("profile.schoolTeamStudents.modal.name")}
                              </span>
                              <span className="text-sm  text-foreground">
                                {student.name}
                              </span>
                            </div>

                            <button
                              onClick={() => handleViewStudent(student._id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mainColor hover:bg-linksHover rounded-lg transition-colors"
                            >
                              <Visibility fontSize="small" />
                              {t(
                                "profile.schoolTeamStudents.modal.viewDetails"
                              )}
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pageInfo.totalPages > 1 && (
                    <Pagination
                      pageInfo={pageInfo}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      className="mt-6 print:hidden"
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-textLight">
                    {t("profile.schoolTeamStudents.modal.noStudents")}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border print:hidden">
              <ExportButton
                onClick={() => handlePrint("excel")}
                loading={isExporting}
                disabled={isLoading}
                loadingText={t("links.print") || "Print Report"}
              />
            </div>
          </div>
        </div>
      </CustomizedModal>
    </>
  );
};

export default memo(StudentsListModal);
