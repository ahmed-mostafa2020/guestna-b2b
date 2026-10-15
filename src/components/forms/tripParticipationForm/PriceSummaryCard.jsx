"use client";

import { useTranslations } from "next-intl";

import formatCurrency from "@utils/formatters/FormatCurrency";

/** Live per-student price: trip base price + school margin = total. */
const PriceSummaryCard = ({ basePrice = 0, profit = 0 }) => {
  const t = useTranslations(
    "profile.createTripLink.participation.priceSummary"
  );

  const total = (Number(basePrice) || 0) + (Number(profit) || 0);

  return (
    <dl className="flex flex-col gap-2 p-4 rounded-xl border border-border font-somar text-sm">
      <div className="flex items-center justify-between gap-4">
        <dt className="text-textLight">{t("basePrice")}</dt>
        <dd className="text-textDark">
          {formatCurrency(Number(basePrice) || 0)}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-4">
        <dt className="text-textLight">{t("profit")}</dt>
        <dd className="text-textDark">{formatCurrency(Number(profit) || 0)}</dd>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
        <dt className="font-bold text-textDark">{t("total")}</dt>
        <dd className="text-base font-bold text-mainColor" aria-live="polite">
          {formatCurrency(total)}
        </dd>
      </div>
    </dl>
  );
};

export default PriceSummaryCard;
