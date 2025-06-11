"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import formatNumbersUint from "@utils/FormatNumbersUint";
import formatCurrency from "@utils/FormatCurrency";
import calculateDiscountedPrice from "@utils/CalculateDiscountedPrice";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";

const PriceDetailsSection = ({ finalTripDetails }) => {
  const promoCodeData = useSelector((state) => state.promoCode.promoCodeData);

  const t = useTranslations();

  const priceDetailsList = [
    {
      inCase: true,
      key: t("finalDetails.travelersNumber"),
      value: formatNumbersUint(
        finalTripDetails?.quantity,
        t("common.person"),
        t("common.people")
      ),
      price: formatCurrency(finalTripDetails?.totalAmount),
    },
  ];

  const renderedPriceDetailsList = priceDetailsList.map(
    (item, index) =>
      item.inCase && (
        <div key={index} className="flex justify-between w-full gap-2 pb-5">
          <div className="flex items-center gap-2">
            <h4 className="font-medium leading-5">{item.key}</h4>
            <h4 className="font-medium leading-5">{item.value}</h4>
          </div>

          <h4 className="font-medium leading-5 text-end">{item.price}</h4>
        </div>
      )
  );

  const finalPrice = promoCodeData?.discount
    ? calculateDiscountedPrice(
        finalTripDetails?.totalAmountWithVAT,
        promoCodeData?.discount / 100
      )
    : formatCurrency(finalTripDetails?.totalAmountWithVAT);

  return (
    <FrameWithImagedHeader>
      <h3 className="text-xl font-semibold">{t("finalDetails.finalPrice")}</h3>

      <div className="flex flex-col items-center justify-between gap-2 border-b border-textDark">
        {renderedPriceDetailsList}
      </div>

      <div className="flex justify-between w-full gap-2 pt-2 pb-7">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium leading-5">{t("finalDetails.total")}</h4>
          <h4 className="font-medium leading-5">{`(${t(
            "finalDetails.includingVAT"
          )})`}</h4>
        </div>

        <div className="flex flex-col">
          {finalTripDetails?.discountAmount && (
            <del className="text-end text-[#EB0101] text-sm  font-medium font-ibm">
              {formatCurrency(
                finalTripDetails?.totalAmountWithVAT +
                  finalTripDetails?.discountAmount
              )}
            </del>
          )}

          <h4 className="text-xl leading-5 transition-all duration-200 ease-in-out font-ibm">
            {finalPrice}
          </h4>
        </div>
      </div>
    </FrameWithImagedHeader>
  );
};

export default PriceDetailsSection;
