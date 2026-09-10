"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import CustomizedModal from "@components/ui/customizedModal";
import OnboardingDocumentUploadForm from "@components/forms/onboardingDocumentUpload";

const DocumentUploadModal = ({
  open,
  onClose,
  onSuccess,
  initialDocumentType = "OTHER",
  initialTitle,
  lockType = false,
}) => {
  const t = useTranslations("providerProfile.onboarding.documents");

  if (!open) return null;

  return (
    <CustomizedModal
      open={open}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-full p-4 font-somar">
        <div
          className="bg-white rounded-2xl max-w-[480px] w-full mx-auto shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-4 sm:px-8 border-b border-[#e6ecec]">
            <h2 className="text-lg sm:text-xl font-bold text-textDark text-center font-somar">
              {t("modal.title")}
            </h2>
          </div>

          <OnboardingDocumentUploadForm
            initialDocumentType={initialDocumentType}
            initialTitle={initialTitle}
            lockType={lockType}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(DocumentUploadModal);
