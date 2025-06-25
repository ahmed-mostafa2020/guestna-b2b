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

  const tripType =
    data?.tripsType === CONSTANT_VALUES.PACKAGE ? "package" : "activity";

  const t = useTranslations();

  const accordionsList = [
    {
      isShown: data?.description,
      title: t(`tripDetails.accordionsGroup.${tripType}.description`),
      children: <p>{data?.description}</p>,
    },
    {
      isShown: data?.services,
      title: t(`tripDetails.accordionsGroup.${tripType}.contents`),
      children: <Services data={data?.services} />,
    },
    {
      isShown: data?.exemptedFromTrip,
      title: t(`tripDetails.accordionsGroup.${tripType}.exempted`),
      children: <ExemptedFromTrip data={data?.exemptedFromTrip} />,
    },
    {
      isShown: data?.itinerary,
      title: t(`tripDetails.accordionsGroup.${tripType}.itinerary`),
      children: <Itinerary data={data?.itinerary} />,
    },

    {
      isShown: data?.gatheringLocation,
      title: t("tripDetails.accordionsGroup.gatheringLocation"),
      children: (
        <Map
          lat={data?.gatheringLocation?.lat || 0}
          lng={data?.gatheringLocation?.lng || 0}
          locationLink={true}
        />
      ),
    },
    {
      isShown: data?.mustHaveItems,
      title: t("tripDetails.accordionsGroup.whatToBring"),
      children: <MustHaveItems data={data?.mustHaveItems} />,
    },
    {
      isShown: data?.attributes,
      title: t("tripDetails.accordionsGroup.extraInfo"),
      children: <ExtraInformation data={data?.attributes} />,
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
