"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import CustomizedModal from "@components/ui/customizedModal";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddProductForm from "@components/forms/addProductForm";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const AddProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  formSelectionData: propFormSelectionData,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  // Fetch form selections options as fallback if not provided via props
  const { data: selectionResponse } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.FORM_SELECTIONS,
    {},
    {
      lang: locale,
      enabled: isOpen && !propFormSelectionData,
    },
    [isOpen, propFormSelectionData]
  );

  const formSelectionData =
    propFormSelectionData || selectionResponse?.data || selectionResponse;

  if (!isOpen) return null;

  return (
    <CustomizedModal
      open={isOpen}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden transition-all transform h-[90vh] flex flex-col border border-border">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mainColor/10 text-mainColor flex items-center justify-center">
                <InventoryIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-titleColor">
                  {t("providerProfile.products.modal.title")}
                </h3>
                <p className="text-xs text-subtitleColor">
                  {t("providerProfile.products.modal.subtitle")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors outline-none cursor-pointer"
              aria-label={t("providerProfile.products.modal.cancel")}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Form Content */}
          <div className="flex-1 overflow-hidden">
            <AddProductForm
              onClose={onClose}
              onSuccess={onSuccess}
              formSelectionData={formSelectionData}
            />
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(AddProductModal);
