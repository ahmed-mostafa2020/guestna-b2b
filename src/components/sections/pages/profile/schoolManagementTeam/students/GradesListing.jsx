"use client";

import { memo, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import StudentsListModal from "./StudentsListModal";
import StudentDetailsModal from "./StudentDetailsModal";

const GradesListing = ({ grades = [], organizationId }) => {
  const t = useTranslations();

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
            onClick={() => handleOpenModal(grade)}
            className="w-full flex items-center justify-between rounded-xl border border-border p-3 hover:bg-gray-50 hover:border-mainColor transition-colors cursor-pointer"
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
          onViewStudent={handleViewStudent}
        />
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudentId && (
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
