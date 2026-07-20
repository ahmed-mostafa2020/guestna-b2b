"use client";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import PreBookingSection from "@components/ui/trips/PreBookingSection";
import BookWithConfidenceSection from "@components/ui/trips/BookWithConfidenceSection";
import Map from "../largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";
import AuthanticatedRequestQuoteBox from "./authanticatedRequestQuoteBox";
import RequestQuote from "@components/features/tripDetails/requestQuote";

import Cookies from "js-cookie";
import QuantityDiscountTiers from "./quantityDiscountTiers";

const SmallSizeGrid = () => {
  const data = useSelector((state) => state.tripDetailsData?.data?.trip);

  const isAuth = data?.isAuth ?? true;

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  const pathname = usePathname();

  const t = useTranslations();

  return (
    <>
      {pathname?.includes("/parents/") ? (
        <PreBookingSection tripData={data} />
      ) : !token ? (
        <RequestQuote />
      ) : null}

      {pathname?.includes("/discover/") && isAuth && token && (
        <AuthanticatedRequestQuoteBox tripId={data?._id} />
      )}

      {data?.quantityDiscountTiers?.length > 0 && (
        <QuantityDiscountTiers
          tiers={data.quantityDiscountTiers}
          isDayBlockPricingEnabled={data?.dayBlockPricing?.enabled === true}
        />
      )}

      <BookWithConfidenceSection />

      {data?.location && isAuth && (
        <div className="flex flex-col gap-3 lg:gap-5">
          <h4 className="text-lg font-semibold text-mainColor lg:text-2xl">
            {t("bookWithConfidence.activityLocation")}
          </h4>

          <Map
            lat={data?.location?.lat || 0}
            lng={data?.location?.lng || 0}
            locationLink={false}
            isAuth={isAuth}
            height="h-48"
          />
        </div>
      )}
    </>
  );
};

export default SmallSizeGrid;
