"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import CustomizedModal from "@components/ui/customizedModal";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import CircularProgress from "@mui/material/CircularProgress";
import AddProductForm from "@components/forms/addProductForm";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const AddProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  formSelectionData: propFormSelectionData,
  productData = null,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const [formName, setFormName] = useState({ en: "", ar: "" });

  useEffect(() => {
    if (!isOpen) {
      setFormName({ en: "", ar: "" });
    }
  }, [isOpen, productData]);

  const handleProductNameChange = useCallback((nameObj) => {
    if (nameObj) {
      setFormName(nameObj);
    }
  }, []);

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

  const isEditMode = Boolean(productData);

  const baseTitle = isEditMode
    ? t("providerProfile.products.modal.editTitle")
    : t("providerProfile.products.modal.title");

  const subtitle = isEditMode
    ? t("providerProfile.products.modal.editSubtitle")
    : t("providerProfile.products.modal.subtitle");

  const activeProductName = (() => {
    const hasFormName = Boolean(formName?.ar || formName?.en);
    const nameObj = hasFormName ? formName : productData?.name;
    if (!nameObj) return "";
    if (typeof nameObj === "string") return nameObj.trim();
    const nameStr =
      locale === "ar"
        ? nameObj.ar || nameObj.en || ""
        : nameObj.en || nameObj.ar || "";
    return nameStr.trim();
  })();

  const headerTitle = activeProductName
    ? `${baseTitle} - ${activeProductName}`
    : baseTitle;

  return (
    <CustomizedModal
      open={isOpen}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      closeButton={false}
      padding={false}
    >
      <div
        className="flex items-center justify-center min-h-screen p-2 sm:p-4 cursor-pointer"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden transition-all transform h-[90vh] flex flex-col border border-border cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-mainColor/10 text-mainColor flex items-center justify-center">
                <InventoryIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-titleColor">
                  {headerTitle}
                </h3>
                <p className="text-xs text-subtitleColor">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors outline-none cursor-pointer"
              aria-label={t("providerProfile.products.modal.cancel")}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Form Content */}
          <div className="flex-1 overflow-hidden">
            {!formSelectionData ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-8">
                <CircularProgress size={36} className="text-mainColor" />
                <span className="text-sm font-medium text-subtitleColor font-somar">
                  {t("common.loading")}...
                </span>
              </div>
            ) : (
              <AddProductForm
                onClose={onClose}
                onSuccess={onSuccess}
                formSelectionData={formSelectionData}
                productData={productData}
                onProductNameChange={handleProductNameChange}
              />
            )}
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(AddProductModal);
