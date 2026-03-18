"use client";

import { memo, useState, useMemo, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";

import { Card, CardContent, CircularProgress } from "@mui/material";
import { Visibility, Print } from "@mui/icons-material";

import CustomizedModal from "@components/ui/customizedModal";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { exportModalToPDF } from "@utils/exports/exportUtils";
import { useExcel } from "@hooks/utils/useExcel";
import ExportButton from "@components/ui/ExportButton";
import DataTable from "@components/ui/DataTable";

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
                  <DataTable
                    columns={[
                      {
                        key: "name",
                        label: t("profile.schoolTeamStudents.modal.name"),
                        className: "font-medium text-foreground",
                      }
                    ]}
                    data={students}
                    loading={isLoading}
                    actionsLabel={t("profile.schoolTeamStudents.modal.actions")}
                    rowActions={(student) => (
                      <button
                        onClick={() => handleViewStudent(student._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-mainColor border border-transparent hover:border-mainColor hover:border rounded-lg transition-colors"
                        aria-label={t("profile.schoolTeamStudents.modal.viewDetails")}
                      >
                        <Visibility fontSize="small" />
                      </button>
                    )}
                    pagination={{
                      currentPage,
                      pageInfo,
                      onPageChange: handlePageChange
                    }}
                  />
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
