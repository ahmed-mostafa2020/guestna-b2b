"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import formatCurrency from "@utils/formatters/FormatCurrency";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import formatNumbersUint from "@utils/formatters/FormatNumbersUint";

const PriceDetailsSection = ({ finalTripDetails }) => {
  const promoCodeData = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip
  );

  const t = useTranslations();

  const data = promoCodeData || finalTripDetails;
  const priceInfo = data?.calculatedPriceInfo;

  const pricePerGuest = priceInfo?.pricePerGuest || 0;
  const quantity = priceInfo?.quantity || 0;
  const quantityDiscount = priceInfo?.quantityDiscount || 0;
  const promoCodeDiscount = priceInfo?.promoCodeDiscount || 0;
  const vatAmount = priceInfo?.vat || 0;
  const total = priceInfo?.total || 0;

  const numberOfStudents = formatNumbersUint(
    quantity,
    t("common.student"),
    t("common.students")
  );

  const hasAnyDiscount = quantityDiscount > 0 || promoCodeDiscount > 0;

  return (
    <FrameWithImagedHeader>
      <h3 className="text-xl font-semibold">{t("finalDetails.finalPrice")}</h3>

      <div className="flex flex-col gap-2 pb-5 font-light border-b border-textDark">
        {/* Price per Guest */}
        <div className="flex justify-between gap-2 items-start">
          <p>{t("finalDetails.tripPrice")}</p>
          <span className="font-medium">{formatCurrency(pricePerGuest)}</span>
        </div>

        {/* Number of Guests */}
        <div className="flex items-center justify-between gap-2">
          <p>{t("finalDetails.studentsNumber")}</p>
          {numberOfStudents}
        </div>

        {/* Discounts (Groups / Promocode) */}
        {hasAnyDiscount && (
          <div className="flex flex-col w-full gap-2 pt-2 mt-2 border-t border-dashed border-textDark/30">
            {quantityDiscount > 0 && (
              <div className="flex items-center justify-between gap-2 font-medium leading-5 text-error w-full text-sm">
                <p>{t("finalDetails.quantityDiscount")}</p>
                <span className="flex items-center gap-0.5">
                  <span>-</span>
                  {formatCurrency(quantityDiscount)}
                </span>
              </div>
            )}

            {promoCodeDiscount > 0 && (
              <div className="flex items-center justify-between gap-2 font-medium leading-5 text-error w-full text-sm">
                <p>{t("finalDetails.promoCodeDiscount")}</p>
                <span className="flex items-center gap-0.5">
                  <span>-</span>
                  {formatCurrency(promoCodeDiscount)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* VAT (15%) */}
        <div className="flex justify-between gap-2 pt-2 mt-2 border-t border-dashed border-textDark/30 items-start">
          <p>{t("finalDetails.vat")}</p>
          <span className="font-medium">{formatCurrency(vatAmount)}</span>
        </div>
      </div>

      {/* Total (VAT inclusive) */}
      <div className="flex justify-between w-full gap-2 pt-4 pb-7 items-center">
        <div className="flex flex-col gap-0.5">
          <h4 className="font-semibold text-lg leading-5">{t("finalDetails.total")}</h4>
          <span className="text-xs text-textDark/60">{`(${t("finalDetails.includingVAT")})`}</span>
        </div>

        <h4 className="text-xl font-bold text-primary">
          {formatCurrency(total)}
        </h4>
      </div>
    </FrameWithImagedHeader>
  );
};

export default PriceDetailsSection;
