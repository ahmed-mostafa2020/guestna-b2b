"use client";

import { memo } from "react";
import { Box } from "@mui/material";
import CustomizedModal from "@components/common/customizedModal";
import CheckboxGroup from "@components/forms/CheckboxGroup";

const TermsConfirmationModal = ({
  open,
  onClose,
  students = [],
  schoolName = "",
  isChecked,
  onCheckChange,
  t,
}) => {
  const terms = ["participation", "safety", "health", "emergency", "media"];
  console.log(students);
  return (
    <CustomizedModal
      open={open}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.4)"
      width="100%"
      closeButton={false}
    >
      <Box className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-8 bg-white rounded-xl text-textDark">
        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold pb-2 text-mainColor">
            {t("forms.termsConfirmation.modal.title")}
          </h2>
          <p className="text-sm md:text-base">
            {t("forms.termsConfirmation.modal.subtitle")}
          </p>
        </div>

        {/* Students Info Section */}
        {students.length > 0 && students[0].name !== "" && (
          <Box className="border border-gray-200 rounded-2xl p-4 mb-6 space-y-3">
            {/* Parent Label */}
            <p className="font-medium text-textDark">
              {t("forms.termsConfirmation.modal.studentInfo.label")}
            </p>

            {/* Students List */}
            <div className="space-y-2 max-h-[150px] overflow-y-scroll">
              {students.map((student, index) => (
                <div key={index} className="text-textDark">
                  <span className="font-medium">
                    {index + 1}.{" "}
                    {student.name ||
                      t(
                        "forms.registerForm.childrenNumber." +
                          (students.length === 1 ? "0" : index + 1)
                      )}
                  </span>
                  {student.academicStage && (
                    <span className="text-gray-600">
                      -{" "}
                      {t(
                        "forms.termsConfirmation.modal.studentInfo.academicStage"
                      )}{" "}
                      {student.academicStage}
                    </span>
                  )}
                  {student.grade && (
                    <span className="text-gray-600">
                      - {t("forms.termsConfirmation.modal.studentInfo.grade")}{" "}
                      {student.grade}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* School Name */}
            {schoolName && (
              <p className="text-textDark pt-2">
                <span className="font-medium">
                  {t("forms.termsConfirmation.modal.studentInfo.school")}
                </span>{" "}
                {schoolName}
              </p>
            )}
          </Box>
        )}

        {/* Terms and Conditions */}
        <Box className="border border-gray-200 rounded-2xl p-4 mb-6">
          <h3 className="font-bold mb-4 text-textDark">
            {t("forms.termsConfirmation.modal.termsTitle")}
          </h3>
          <div className="space-y-4">
            {terms.map((term, index) => (
              <div key={term}>
                <h4 className="font-semibold text-textDark mb-1">
                  {index + 1}.
                  {t(`forms.termsConfirmation.modal.terms.${term}.title`)}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(`forms.termsConfirmation.modal.terms.${term}.content`)}
                </p>
              </div>
            ))}
          </div>

          {/* Terms Confirmation Checkbox */}
          <div className="mt-6 p-4 bg-[#FFF1764D] rounded-xl">
            <CheckboxGroup
              label={t("forms.termsConfirmation.modal.confirmLabel")}
              isChecked={isChecked}
              onChangeFunction={(e) => onCheckChange(e.target.checked)}
              fontSize="16px"
              hoveringAction={false}
            />
          </div>
        </Box>
      </Box>
    </CustomizedModal>
  );
};

export default memo(TermsConfirmationModal);
