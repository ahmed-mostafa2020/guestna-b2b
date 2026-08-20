"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AccountBalanceWalletOutlined } from "@mui/icons-material";
import formatCurrency from "@utils/formatters/FormatCurrency";

const ProviderOrderFinancialCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  const priceAmount = orderData?.price ?? orderData?.basePrice ?? 0;
  const isPaid = orderData?.isPaid !== false && orderData?.status === "DONE";

  const paymentMethodLabel = isAr ? "تحويل بنكي" : "Bank Transfer";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5 font-somar">
      {/* 1. Header */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-mainColor/10 text-mainColor flex items-center justify-center">
          <AccountBalanceWalletOutlined className="!w-5 !h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-textDark flex items-center gap-2 font-somar">
          <span>{t("providerProfile.orderDetails.financial.title")}</span>
        </h2>
      </div>

      {/* 2. Total Amount Highlight */}
      <div className="flex items-center justify-between gap-2 py-1">
        <span className="text-xs sm:text-sm text-textLight font-normal">
          {t("providerProfile.orderDetails.financial.totalAmount")}
        </span>
        <span className="text-xl sm:text-2xl font-extrabold text-mainColor font-somar">
          {formatCurrency(priceAmount, locale)}
        </span>
      </div>

      {/* 3. Payment Details */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm border-t border-gray-50 pt-2">
        {/* Payment Status */}
        <div className="flex items-center justify-between gap-2 py-1">
          <span className="text-textLight font-normal">
            {t("providerProfile.orderDetails.financial.paymentStatus")}
          </span>
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${
              isPaid
                ? "bg-[#E8F8F5] text-[#00A389] border-[#B2EBE2]"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {isPaid
              ? t("providerProfile.orderDetails.financial.paid")
              : t("providerProfile.orderDetails.financial.unpaid")}
          </span>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between gap-2 py-1">
          <span className="text-textLight font-normal">
            {t("providerProfile.orderDetails.financial.paymentMethod")}
          </span>
          <span className="font-bold text-textDark font-somar">
            {paymentMethodLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderFinancialCard);
