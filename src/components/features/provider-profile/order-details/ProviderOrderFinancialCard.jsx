"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { AccountBalanceWalletOutlined } from "@mui/icons-material";
import formatCurrency from "@utils/formatters/FormatCurrency";

const ProviderOrderFinancialCard = ({ orderData }) => {
  const t = useTranslations();

  const priceAmount = orderData?.price ?? orderData?.basePrice ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-4 sm:gap-5 font-somar">
      {/* 1. Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-mainColor/10 text-mainColor flex items-center justify-center">
          <AccountBalanceWalletOutlined className="!w-5 !h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-textDark flex items-center gap-2">
          <span>{t("providerProfile.orderDetails.financial.title")}</span>
        </h2>
      </div>

      {/* 2. Total Amount Highlight */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs sm:text-sm text-textLight font-normal">
          {t("providerProfile.orderDetails.financial.totalAmount")}
        </span>
        <span className="text-xl sm:text-2xl font-extrabold text-mainColor">
          {formatCurrency(priceAmount)}
        </span>
      </div>
    </div>
  );
};

export default memo(ProviderOrderFinancialCard);

