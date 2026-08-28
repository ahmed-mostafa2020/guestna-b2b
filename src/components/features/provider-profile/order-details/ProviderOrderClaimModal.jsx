"use client";

import { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Close } from "@mui/icons-material";

import CustomizedModal from "@components/ui/customizedModal";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import WithdrawalClaimForm from "./forms/WithdrawalClaimForm";

const ProviderOrderClaimModal = ({ open, onClose, orderId, onSuccess }) => {
  const t = useTranslations("providerProfile.orderDetails.claimForm");
  const tGeneral = useTranslations();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  if (!open || !orderId) return null;

  return (
    <CustomizedModal
      open={open}
      handleClose={handleClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-full p-4 font-somar">
        <div className="bg-white rounded-2xl max-w-[580px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
          {/* Top Pattern Header Component */}
          <FrameWithImagedHeader bodyClassName="!px-6 sm:!px-8 !pt-6 !pb-8 !gap-0">
            {/* Modal Header: Title + Close Button */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-textDark font-somar">
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-textLight hover:text-textDark shrink-0"
                aria-label={tGeneral("links.cancel")}
              >
                <Close className="!w-4 !h-4" />
              </button>
            </div>

            {/* Withdrawal Claim Form */}
            <WithdrawalClaimForm
              orderId={orderId}
              onSuccess={onSuccess}
              onClose={handleClose}
            />
          </FrameWithImagedHeader>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(ProviderOrderClaimModal);
