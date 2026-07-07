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

  // Safe access with fallback values to prevent crashes
  const priceExclTax = formatCurrency(data?.tripBasePriceWithoutVat || 0);

  const numberOfStudents = formatNumbersUint(
    data?.quantity || 0,
    t("common.student"),
    t("common.students")
  );

  const priceWithTax = formatCurrency(data?.basePriceTotalWithVat || 0);
  const discountedPriceWithTax = formatCurrency(
    data?.discountedTotalPriceWithVat || 0
  );

  const tripDiscount = data?.tripDiscount || 0;
  const quantityDiscount = data?.quantityDiscount || 0;
  const promoCodeDiscount = data?.promoCodeDiscount || 0;
  const totalDiscount = data?.totalDiscount || 0;
  const hasAnyDiscount = totalDiscount > 0;

  return (
    <FrameWithImagedHeader>
      <h3 className="text-xl font-semibold">{t("finalDetails.finalPrice")}</h3>

      <div className="flex flex-col gap-2 pb-5 font-light border-b border-textDark">
        <div className="flex justify-between gap-2 items-start">
          <div className="flex flex-col gap-0.5">
            <p>{t("finalDetails.tripPrice")}</p>
            <span className="text-xs text-textDark/60">
              {`(${t("finalDetails.excludingVAT")})`}
            </span>
          </div>
          {priceExclTax}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p>{t("finalDetails.studentsNumber")}</p>
          {numberOfStudents}
        </div>

        <div className="flex justify-between gap-2 pt-2 mt-2 border-t border-dashed border-textDark/30 items-start">
          <div className="flex flex-col gap-0.5">
            <p>{t("finalDetails.subtotal")}</p>
            <span className="text-xs text-textDark">
              {`(${t("finalDetails.includingVAT")})`}
            </span>
          </div>

          <span
            className={` font-medium text-end ${hasAnyDiscount && "line-through text-error"}`}
          >
            {priceWithTax}
          </span>
        </div>

        {hasAnyDiscount && (
          <div className="flex flex-col w-full gap-2 pt-2 mt-2 border-t border-dashed border-textDark/30 ">
            {tripDiscount > 0 && (
              <div className="flex items-center justify-between gap-2 font-medium leading-5 text-error w-full text-sm">
                <p>{t("finalDetails.tripDiscount")}</p>
                <span className="flex items-center gap-0.5">
                  <span>-</span>
                  {formatCurrency(tripDiscount)}
                </span>
              </div>
            )}

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

            {totalDiscount > 0 && (
              <div className="flex items-center justify-between gap-2 font-medium leading-5 text-error w-full mt-2">
                <p>{t("finalDetails.totalDiscount")}</p>
                <span className="flex items-center gap-0.5">
                  <span>-</span>
                  {formatCurrency(totalDiscount)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between w-full gap-2 pt-2 pb-7">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium leading-5">{t("finalDetails.total")}</h4>
          <h4 className="font-medium leading-5">{`(${t(
            "finalDetails.includingVAT"
          )})`}</h4>
        </div>

        <div className="flex flex-col">
          <h4 className="text-xl leading-5 transition-all duration-200 ease-in-out ">
            {hasAnyDiscount ? discountedPriceWithTax : priceWithTax}
          </h4>
        </div>
      </div>
    </FrameWithImagedHeader>
  );
};

export default PriceDetailsSection;
