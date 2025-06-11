"use client";

import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { SwiperSlide } from "swiper/react";
import TripsSection from "../../common/trips/TripsSection";
import ExclusiveCard from "../../common/trips/ExclusiveCard";

const ExclusiveOffersSection = () => {
  const exclusiveOffersData = useSelector(
    (state) => state.homeData.items.exclusiveOffers
  );

  const t = useTranslations();

  const data = {
    title: t("exclusiveOffers.title"),
    subTitle: t("exclusiveOffers.subTitle"),
    slug: "showAll",
    cardsPerView: 2.2,
  };

  const exclusiveOffersList = exclusiveOffersData?.map((exclusiveCard) => (
    <SwiperSlide key={exclusiveCard._id} className="bg-transparent cursor-grab">
      <ExclusiveCard exclusiveCard={exclusiveCard} />
    </SwiperSlide>
  ));

  return (
    <>
      <TripsSection data={data}>{exclusiveOffersList}</TripsSection>
    </>
  );
};

export default ExclusiveOffersSection;
