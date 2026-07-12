"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import formatCurrency from "@utils/formatters/FormatCurrency";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import { Loyalty } from "@mui/icons-material";

const QuantityDiscountTiers = ({ tiers }) => {
  const t = useTranslations("quantityDiscountTiers");
  const tCommon = useTranslations("common");

  if (!tiers || tiers.length === 0) return null;

  // Sort tiers by minQuantity so they are presented in increasing order
  const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

  return (
    <FrameWithImagedHeader withBorder={true}>
      <div className="flex items-start gap-3">
        <span className="p-2.5   rounded-xl centered shadow-sm mt-0.5 animate-rotation">
          <Loyalty className="text-lg text-mainColor" />
        </span>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-mainColor leading-tight">
            {t("title")}
          </h3>
          <p className="text-xs text-textLight font-light mt-0.5">
            {t("subTitle")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-3">
        {sortedTiers.map((tier) => {
          const discountStr =
            tier.discountType === "PERCENTAGE" ? (
              <span>%{tier.discountValue}</span>
            ) : (
              formatCurrency(tier.discountValue)
            );

          const count = tier.minQuantity;
          const peopleText =
            count >= 2 && count <= 10
              ? tCommon("people")
              : tCommon("person");

          return (
            <div
              key={tier._id || tier.minQuantity}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-150 bg-white  hover:shadow-md transition-all duration-300 ease-in-out  "
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl  text-mainColor centered font-bold text-base  transition-all duration-300">
                  {count}+
                </div>
                <span className="text-sm font-semibold text-textDark">
                  {peopleText}
                </span>
              </div>
              <div className="flex items-center gap-1.5  text-success px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm border    transition-all duration-300">
                <span>{t("discountPrefix")}</span>
                <span className="font-extrabold">{discountStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </FrameWithImagedHeader>
  );
};

export default memo(QuantityDiscountTiers);
