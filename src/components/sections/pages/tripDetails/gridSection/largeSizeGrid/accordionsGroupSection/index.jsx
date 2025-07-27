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
import Benefits from "./accordionsDetails/Benefits";

const AccordionsGroupSection = () => {
  const data = useSelector((state) => state.tripDetailsData.data.trip);

  const isAuth = data?.isAuth ?? true;

  const tripType =
    data?.tripsType === CONSTANT_VALUES.PACKAGE ? "package" : "activity";

  const t = useTranslations();

  const accordionsList = [
    {
      isShown: data?.description,
      title: t(`tripDetails.accordionsGroup.${tripType}.description`),
      children: isAuth ? (
        <p>{data?.description}</p>
      ) : (
        <p>{data?.description}</p>
      ),
      children: isAuth
        ? data?.description
        : `${data?.description?.substring(0, 120)}...`,
    },
    {
      isShown: data?.services,
      title: t(`tripDetails.accordionsGroup.${tripType}.contents`),
      children: <Services data={data?.services} isAuth={isAuth} />,
    },
    {
      isShown: data?.exemptedFromTrip,
      title: t(`tripDetails.accordionsGroup.${tripType}.exempted`),
      children: (
        <ExemptedFromTrip data={data?.exemptedFromTrip} isAuth={isAuth} />
      ),
    },
    {
      isShown: data?.itinerary,
      title: t(`tripDetails.accordionsGroup.${tripType}.itinerary`),
      children: <Itinerary data={data?.itinerary} isAuth={isAuth} />,
    },

    {
      isShown: data?.gatheringLocation || true,
      title: t("tripDetails.accordionsGroup.gatheringLocation"),
      children: (
        <Map
          lat={data?.gatheringLocation?.lat || 0}
          lng={data?.gatheringLocation?.lng || 0}
          locationLink={true}
          isAuth={isAuth}
        />
      ),
    },
    {
      isShown: data?.mustHaveItems,
      title: t("tripDetails.accordionsGroup.whatToBring"),
      children: <MustHaveItems data={data?.mustHaveItems} isAuth={isAuth} />,
    },
    {
      isShown: data?.attributes,
      title: t("tripDetails.accordionsGroup.extraInfo"),
      children: <ExtraInformation data={data?.attributes} isAuth={isAuth} />,
    },
    {
      isShown: data?.benefits,
      title: t(`tripDetails.accordionsGroup.benefits`),
      children: <Benefits data={data?.benefits} isAuth={isAuth} />,
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
