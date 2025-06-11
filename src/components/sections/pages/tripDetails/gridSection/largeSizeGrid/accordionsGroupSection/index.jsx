"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { Fragment } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import FilterAccordion from "@components/filtersBox/FilterAccordion";
import Services from "./accordionsDetails/Services";
import ExemptedFromTrip from "./accordionsDetails/ExemptedFromTrip";
import Itinerary from "./accordionsDetails/Itinerary";
import Map from "./accordionsDetails/Map";
import MustHaveItems from "./accordionsDetails/MustHaveItems";
import ExtraInformation from "./accordionsDetails/ExtraInformation";

const AccordionsGroupSection = () => {
  const data = useSelector((state) => state.tripDetailsData.data);

  const tripData = data?.trip;
  const tripType =
    tripData?.guestnaTripsType === CONSTANT_VALUES.PACKAGE
      ? "package"
      : "activity";

  const t = useTranslations();

  const accordionsList = [
    {
      isShown: tripData?.description,
      title: t(`tripDetails.accordionsGroup.${tripType}.description`),
      children: <p>{tripData?.description}</p>,
    },
    {
      isShown: tripData?.services?.length > 0,
      title: t(`tripDetails.accordionsGroup.${tripType}.contents`),
      children: <Services data={tripData?.services} />,
    },
    {
      isShown: tripData?.exemptedFromTrip?.length > 0,
      title: t(`tripDetails.accordionsGroup.${tripType}.exempted`),
      children: <ExemptedFromTrip data={tripData?.exemptedFromTrip} />,
    },
    {
      isShown: tripData?.itinerary?.length > 0,
      title: t(`tripDetails.accordionsGroup.${tripType}.itinerary`),
      children: <Itinerary data={tripData?.itinerary} />,
    },

    {
      isShown:
        tripData?.gatheringLocation?.lat && tripData?.gatheringLocation?.lng,
      title: t("tripDetails.accordionsGroup.gatheringLocation"),
      children: (
        <Map
          lat={tripData?.gatheringLocation?.lat || 0}
          lng={tripData?.gatheringLocation?.lng || 0}
          locationLink={true}
        />
      ),
    },
    {
      isShown: tripData?.mustHaveItems?.length > 0,
      title: t("tripDetails.accordionsGroup.whatToBring"),
      children: <MustHaveItems data={tripData?.mustHaveItems} />,
    },
    {
      isShown: tripData?.attributes?.length > 0,
      title: t("tripDetails.accordionsGroup.extraInfo"),
      children: <ExtraInformation data={tripData?.attributes} />,
    },
  ];

  const renderedAccordionsList = accordionsList.map(
    (item, index) =>
      item.isShown && (
        <Fragment key={index}>
          <FilterAccordion index={index} title={item.title}>
            {item.children}
          </FilterAccordion>
        </Fragment>
      )
  );

  return <>{renderedAccordionsList}</>;
};

export default AccordionsGroupSection;
