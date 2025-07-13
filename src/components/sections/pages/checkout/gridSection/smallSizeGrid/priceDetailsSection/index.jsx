"use client";

import { useTranslations } from "next-intl";

// import { useSelector } from "react-redux";

import formatCurrency from "@utils/FormatCurrency";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import formatNumbersUint from "@/src/utils/FormatNumbersUint";

const PriceDetailsSection = ({ finalTripDetails }) => {
  // const promoCodeData = useSelector((state) => state.promoCode.promoCodeData);

  const t = useTranslations();

  const priceExclTax = formatCurrency(finalTripDetails.tripBasePriceWithoutVat);

  const numberOfStudents = formatNumbersUint(
    finalTripDetails.quantity,
    t("common.student"),
    t("common.students")
  );

  const priceWithTax = formatCurrency(finalTripDetails.basePriceTotalWithVat);
  const discountedPriceWithTax = formatCurrency(
    finalTripDetails.discountedTotalPriceWithVat
  );

  return (
    <FrameWithImagedHeader>
      <h3 className="text-xl font-semibold">{t("finalDetails.finalPrice")}</h3>

      <div className="flex flex-col gap-2 pb-5 font-light border-b border-textDark">
        <div className="flex items-center justify-between gap-2">
          <p>{t("finalDetails.tripPrice")}</p>
          {priceExclTax}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p>{t("finalDetails.studentsNumber")}</p>
          {numberOfStudents}
        </div>
      </div>

      <div className="flex justify-between w-full gap-2 pt-2 pb-7">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium leading-5">{t("finalDetails.total")}</h4>
          <h4 className="font-medium leading-5">{`(${t(
            "finalDetails.includingVAT"
          )})`}</h4>
        </div>

        <div className="flex flex-col">
          {finalTripDetails?.promoCode && (
            <del className="text-end text-[#EB0101] text-sm  font-medium font-ibm">
              {priceWithTax}
            </del>
          )}

          <h4 className="text-xl leading-5 transition-all duration-200 ease-in-out font-ibm">
            {finalTripDetails?.promoCode
              ? discountedPriceWithTax
              : priceWithTax}
          </h4>
        </div>
      </div>
    </FrameWithImagedHeader>
  );
};

export default PriceDetailsSection;
