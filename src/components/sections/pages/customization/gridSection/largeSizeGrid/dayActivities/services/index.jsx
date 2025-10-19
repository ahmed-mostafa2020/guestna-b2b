"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setAccommodation,
  setPhotography,
  setTranslator,
  setTransportation,
} from "@store/services/servicesSlice";
import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";

import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import formatCurrency from "@utils/FormatCurrency";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import FilterAccordion from "@components/filtersBox/FilterAccordion";
import ServiceCategory from "./ServiceCategory";
import MealsListing from "./MealsListing";

import { useSnackbar } from "notistack";

const Services = ({ handleClose, activityNumber }) => {
  const allServices = useSelector(
    (state) => state.servicesData.servicesResponse
  );

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const allServicesState = useSelector((state) => state.servicesData);
  const getSelectedServices = (state) => {
    const { meals, photography, translator, transportation, accommodation } =
      state;

    let selectedServices = [...meals, ...accommodation];

    // Add single selections if they exist
    [photography, translator, transportation].forEach((service) => {
      if (service) {
        selectedServices.push({
          service: service.serviceId,
          quantity: service.quantity,
        });
      }
    });

    // Delete price from states objects
    return selectedServices.map(({ service, quantity }) => ({
      service,
      quantity,
    }));
  };

  const servicesData = {
    day: activityNumber,
    items: getSelectedServices(allServicesState),
  };

  const { meals, photography, translator, transportation, accommodation } =
    useSelector((state) => state.servicesData);

  // Calculate the total sum
  const totalSum = [
    ...meals,
    photography,
    translator,
    transportation,
    ...accommodation,
  ].reduce(
    (sum, service) => {
      if (service && typeof service === "object" && service.price) {
        return sum + service.quantity * service.price;
      }
      return sum;
    },
    0 // Initial value for the sum
  );

  const handleClick = async () => {
    handleClose();

    try {
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.CHANGE_SERVICES_TRIP,
          services: servicesData,
          locale,
        })
      ).unwrap();

      enqueueSnackbar(t("customization.services.successMessage"), {
        variant: "success",
        preventDuplicate: true,
      });
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to add services. Please try again.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }
  };

  return (
    <section className="max-w-[600px] mx-auto services-group">
      <FrameWithImagedHeader>
        <FilterAccordion
          title={t("customization.services.meals")}
          summaryColor="var(--color-text-dark)"
          summaryFontSize={22}
        >
          <MealsListing list={allServices.MEALS} />
        </FilterAccordion>

        <ServiceCategory
          title={t("customization.services.personalServices")}
          list={[
            {
              list: allServices?.PHOTOGRAPHERS,
              action: setPhotography,
              state: allServicesState?.photography,
              subTitle: t("customization.services.photography"),
            },
            {
              list: allServices?.TRANSLATORS,
              action: setTranslator,
              state: allServicesState?.translator,
              subTitle: t("customization.services.translators"),
            },
          ]}
        />

        <ServiceCategory
          title={t("customization.services.transportation")}
          list={allServices?.TRANSPORTATION}
          action={setTransportation}
          state={allServicesState?.transportation}
        />

        <ServiceCategory
          title={t("customization.services.accommodation")}
          list={allServices?.ACCOMMODATION}
          action={setAccommodation}
          state={allServicesState?.accommodation}
          accommodation={true}
        />

        <div className="mt-6 text-center">
          <h3 className="font-bold text-black transition-all duration-200 ease-in-out font-ibm">
            {formatCurrency(totalSum)}
          </h3>

          <p className="text-xs font-ibm text-textLight">
            {t("common.onePerson")}
            {t("finalDetails.includingVAT")}
          </p>
        </div>

        <button
          onClick={handleClick}
          className="w-full px-8 py-4 mt-6 text-base font-semibold text-center text-white capitalize transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover button-shadow "
        >
          {t("links.bookNow")}
        </button>
      </FrameWithImagedHeader>
    </section>
  );
};

export default Services;
