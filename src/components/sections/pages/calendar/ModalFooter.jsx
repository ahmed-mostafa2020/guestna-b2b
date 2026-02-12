"use client";

import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const ModalFooter = ({
  onCancel,
  onConfirm,
  cancelText = "إلغاء",
  confirmText = "تأكيد",
  isLoading = false,
  confirmDisabled = false,
  isForm = false,
}) => {
  const t = useTranslations();

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          {...getGtmTag(GTM_TAGS.MODAL.CANCEL, "modal")}
        >
          {cancelText}
        </button>
        <button
          type={isForm ? "submit" : "button"}
          onClick={!isForm ? onConfirm : undefined}
          disabled={confirmDisabled || isLoading}
          className="flex-1 px-6 py-3 bg-mainColor text-white rounded-xl hover:bg-linksHover transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          {...getGtmTag(GTM_TAGS.MODAL.CONFIRM, "modal")}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              {t("forms.validation.sending")}
              <CircularProgress size={20} color="white" />
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  );
};

export default ModalFooter;
