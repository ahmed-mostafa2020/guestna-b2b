"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import SliderWithArrowsSection from "@components/common/sliderWithArrowsSection";

const AvailableBookingDatesCardSection = () => {
  const data = useSelector((state) => state.tripDetailsData.data);
  const tripData = data?.trip;

  const t = useTranslations();

  return (
    <>
      <SliderWithArrowsSection
        dataList={tripData?.bookingDay}
        title={t("tripDetails.availableDates.title")}
        tripData={tripData}
        subTitle={`${tripData?.bookingDay?.length} ${t("common.available")}`}
        cardType="date"
      />

      {/* <Container maxWidth="lg">
        <Link
          href={`/${locale}/#`}
          className="px-8 py-2 font-bold text-white transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:border-linksHover hover:bg-linksHover"
        >
          {t("links.showAllDates")}
        </Link>
      </Container> */}
    </>
  );
};

export default AvailableBookingDatesCardSection;
