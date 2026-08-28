"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";

import CustomizedModal from "@components/ui/customizedModal";

const ProviderOrderApproveModal = ({
  open,
  onClose,
  orderId,
  onSuccess,
  approveOrder,
  approvingOrder,
  approvalError,
}) => {
  const tApproval = useTranslations("forms.customTrip.approval");
  const t2 = useTranslations();

  const handleConfirm = useCallback(async () => {
    if (!orderId || approvingOrder) return;
    const result = await approveOrder(orderId);
    if (result?.success) {
      onSuccess?.();
    }
  }, [orderId, approvingOrder, approveOrder, onSuccess]);

  const handleCancel = useCallback(() => {
    if (approvingOrder) return;
    onClose?.();
  }, [approvingOrder, onClose]);

  if (!open || !orderId) return null;

  return (
    <CustomizedModal
      open={open}
      handleClose={handleCancel}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-full p-4 font-somar">
        <div className="bg-white rounded-2xl max-w-[500px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-textDark font-somar text-center w-full">
              {tApproval("providerConfirmTitle")}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              disabled={approvingOrder}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-textLight hover:text-textDark shrink-0 disabled:opacity-50"
              aria-label={t2("links.cancel")}
            >
              <Close className="!w-4 !h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7">
            {/* Description */}
            <p className="text-sm sm:text-base text-textLight text-center !mb-6 leading-relaxed font-somar">
              {tApproval("providerConfirmDescription")}
            </p>

            {/* Error Alert */}
            {approvalError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-error text-sm font-medium font-somar">
                {approvalError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                disabled={approvingOrder}
                className="w-full sm:w-1/2 px-6 h-12 flex items-center justify-center rounded-xl border-2 border-border text-textDark font-bold text-sm sm:text-base hover:border-mainColor hover:text-mainColor active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white font-somar"
              >
                {t2("links.cancel")}
              </button>

              {/* Confirm Approve Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={approvingOrder}
                className="w-full sm:w-1/2 px-6 h-12 flex items-center justify-center border-2 border-transparent bg-mainColor text-white rounded-xl font-bold text-sm sm:text-base hover:bg-titleColor active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-mainColor/30 font-somar"
              >
                {approvingOrder ? (
                  <div className="flex items-center justify-center gap-2">
                    <CircularProgress color="inherit" size={18} />
                    <span>{tApproval("submitting")}</span>
                  </div>
                ) : (
                  tApproval("confirmButton") || t2("links.confirm")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(ProviderOrderApproveModal);
