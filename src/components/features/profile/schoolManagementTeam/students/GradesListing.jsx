"use client";

import { memo, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import StudentsListModal from "./StudentsListModal";
import StudentDetailsModal from "./StudentDetailsModal";
import { usePermissions } from "@hooks/utils/usePermissions";
import { PERMISSIONS } from "@constants/permissions";

const GradesListing = ({ grades = [], organizationId }) => {
  const t = useTranslations();
  const { hasElement } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleOpenModal = (grade) => {
    setSelectedGrade(grade);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGrade(null);
  };

  const handleViewStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setShowDetailsModal(true);
    // Close the grades modal when opening student details
    handleCloseModal();
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedStudentId(null);
  };

  const parsedGrades = useMemo(() => {
    if (!Array.isArray(grades)) return [];

    return grades
      .map((grade, index) => ({
        id: grade?._id || grade?.grade?._id || `${grade?.name}-${index}`,
        name:
          grade?.name ||
          grade?.grade?.name ||
          t("profile.schoolTeamStudents.unknownStage"),
        count: grade?.count || 0,
      }))
      .filter((grade) => grade.count > 0);
  }, [grades, t]);

  if (!parsedGrades.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-gray-50 px-4 py-6 text-center text-sm text-textLight">
        {t("profile.schoolTeamStudents.emptyStages")}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 border border-border p-4 rounded-xl">
        {parsedGrades.map((grade) => (
          <button
            key={grade.id}
            onClick={() =>
              hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_STUDENTS_GRADES_DETAILS)
                ? handleOpenModal(grade)
                : undefined
            }
            disabled={!hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_STUDENTS_GRADES_DETAILS)}
            className="w-full flex items-center justify-between rounded-xl border border-border p-3 hover:bg-gray-50 hover:border-mainColor transition-colors cursor-pointer disabled:cursor-default disabled:opacity-70"
            aria-label={t("profile.schoolTeamStudents.viewStudents", {
              grade: grade.name,
            })}
          >
            <span className="font-medium text-textLight">{grade.name}</span>
            <span className="flex items-center justify-center rounded-lg h-11 w-11 p-3 bg-[#DAE6E6] text-lg font-medium text-black font-ibm shadow-card">
              {grade.count}
            </span>
          </button>
        ))}
      </div>

      {/* Students List Modal */}
      {modalOpen && selectedGrade && (
        <StudentsListModal
          open={modalOpen}
          handleClose={handleCloseModal}
          organizationId={organizationId}
          gradeId={selectedGrade.id}
          gradeName={selectedGrade.name}
          onViewStudent={
            hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_STUDENTS_STUDENT_DETAILS)
              ? handleViewStudent
              : undefined
          }
        />
      )}

      {/* Student Details Modal */}
      {showDetailsModal &&
        selectedStudentId &&
        hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_STUDENTS_STUDENT_DETAILS) && (
          <StudentDetailsModal
            open={showDetailsModal}
            handleClose={handleCloseDetails}
            studentId={selectedStudentId}
          />
        )}
    </>
  );
};

export default memo(GradesListing);
