"use client";

import { useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { Fragment, useMemo, useRef } from "react";

import { useUpdateQueryParams } from "@hooks/useUpdateQueryParams";
import { CONSTANT_VALUES } from "@constants/constantValues";
// import { agesIdsList } from "@constants/targetAudiencesIds";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import buildFilter from "@utils/BuildFilter";
// import getSelectedTargetAudiences from "@utils/getSelectedTargetAudiences";
import Destinations from "./menus/Destinations";
import BudgetRange from "./menus/BudgetRange";
import TripsType from "./menus/TripsType";
import ExperiencesType from "./menus/ExperiencesType";
import Languages from "./menus/Languages";
// import TargetAudiences from "./menus/TargetAudiences";
import Ratings from "./menus/Ratings";
import ResetButton from "./resetButton";
import FilterCalender from "./FilterCalender";
import FilterAccordion from "@components/filtersBox/FilterAccordion";

const FilterGrid = () => {
  // Side filters data
  const {
    cities,
    categories,
    languages,

    // targetAudiences
  } = useSelector((state) => state.discoverSideFilters.sideFilters);

  const { loading } = useSelector((state) => state.discoverData);

  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();
  const targetRef = useRef(null);

  const tripsTypeList = [
    { name: t("common.multiDaysTrip"), value: CONSTANT_VALUES.PACKAGE },
    { name: t("common.oneDayTrip"), value: CONSTANT_VALUES.ACTIVITY },
  ];

  const ratingsList = [
    { name: t("common.stars"), value: 5 },
    { name: t("common.stars"), value: 4 },
    { name: t("common.stars"), value: 3 },
    { name: t("common.star"), value: 2 },
    { name: t("common.star"), value: 1 },
  ];

  const sideFiltersList = [
    {
      children: (
        <Destinations
          title={t("discover.sideFilters.destinations")}
          destinations={cities}
        />
      ),
    },
    { children: <BudgetRange title={t("discover.sideFilters.budget")} /> },
    {
      children: (
        <TripsType
          title={t("discover.sideFilters.typeOfTrips")}
          tripsTypeList={tripsTypeList}
        />
      ),
    },
    {
      children: (
        <ExperiencesType
          title={t("discover.sideFilters.typeOfExperience")}
          categories={categories}
        />
      ),
    },
    {
      children: (
        <Languages
          title={t("discover.sideFilters.languageProvided")}
          languages={languages}
        />
      ),
    },
    // {
    //   children: (
    //     <TargetAudiences
    //       title={t("discover.sideFilters.customizedTours")}
    //       targetAudiences={targetAudiences}
    //     />
    //   ),
    // },
    {
      children: (
        <Ratings
          title={t("discover.sideFilters.rating")}
          ratingsList={ratingsList}
        />
      ),
    },
  ];

  const renderedSideFiltersList = sideFiltersList.map((filter, index) => (
    <Fragment key={index}>{filter.children}</Fragment>
  ));

  const scrollingToTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Apply filters
  const {
    tripsType,
    allTripsTypes,
    cities: selectedCities,
    guests,
    activityDayDate,
    checkOutDate,
    checkInDate,
    budgetRange,
    categories: selectedCategories,
    languages: selectedLanguages,
    rate,
  } = useSelector((state) => state.searchFilter);

  // Sort
  const sortType = useSelector((state) => state.discoverData.sortBy);

  const updateQueryParams = useUpdateQueryParams();

  // Target audience
  // const selectedTargetAudiences = getSelectedTargetAudiences(
  //   guests,
  //   agesIdsList
  // );

  // Available Seats
  const availableSeats = Object.values(guests).reduce(
    (sum, count) => sum + count,
    0
  );

  const filter = useMemo(() => {
    return buildFilter({
      tripsType,
      allTripsTypes,
      checkInDate,
      checkOutDate,
      activityDayDate,
      cities: selectedCities,
      categories: selectedCategories,
      // targetAudiences: selectedTargetAudiences,
      languages: selectedLanguages,
      budgetRange,
      availableSeats,
      rate,
    });
  }, [
    tripsType,
    allTripsTypes,
    checkInDate,
    checkOutDate,
    activityDayDate,
    selectedCities,
    selectedCategories,
    // selectedTargetAudiences,
    selectedLanguages,
    budgetRange,
    availableSeats,
    rate,
  ]);

  const searchParams = useSearchParams();

  const handleSubmit = () => {
    setTimeout(() => {
      scrollingToTop();
    }, 0);

    const paramsToUpdate = {};

    // Check each guest type and update params accordingly
    // Include all guest types, even those with 0 values
    Object.entries(guests).forEach(([key, value]) => {
      paramsToUpdate[key] = value;
    });

    const flattenedParams = Object.entries(paramsToUpdate);

    updateQueryParams(
      {
        ...Object.fromEntries(flattenedParams),

        ...(sortType === searchParams.get("sorting")
          ? {}
          : { sorting: sortType }),

        page: 1,

        ...(allTripsTypes.length > 1
          ? { tripsType: "" }
          : { tripsType: allTripsTypes }),

        ...(checkInDate?.day && checkInDate?.month && checkInDate?.year
          ? {
              checkInDate: `${checkInDate.day}/${checkInDate.month}/${checkInDate.year}`,
            }
          : {}),

        ...(checkOutDate?.day && checkOutDate?.month && checkOutDate?.year
          ? {
              checkOutDate: `${checkOutDate.day}/${checkOutDate.month}/${checkOutDate.year}`,
            }
          : {}),

        ...(activityDayDate?.day &&
        activityDayDate?.month &&
        activityDayDate?.year
          ? {
              activityDayDate: `${activityDayDate.day}/${activityDayDate.month}/${activityDayDate.year}`,
            }
          : {}),

        minBudget: budgetRange.min,
        maxBudget: budgetRange.max,

        ...(selectedLanguages?.length > 0
          ? { languages: selectedLanguages }
          : {}),

        ...(selectedCategories?.length > 0
          ? { categories: selectedCategories }
          : {}),

        ...(selectedCities?.length > 0 ? { cities: selectedCities } : {}),

        rate: rate,
      }
      // { isAppend: true }
    );

    dispatch(actGetDiscoverTrips({ sortType, filter, locale }));
  };

  return (
    <>
      <div ref={targetRef} className="flex flex-col gap-4 lg:gap-8">
        <h3 className="text-2xl font-medium lg:pb-[11px] lg:text-5xl text-linksHover">
          {t("discover.sideFilters.title")}
        </h3>

        <div className="flex flex-col gap-3 side-filters">
          {renderedSideFiltersList}

          <div className="hidden transition-all duration-200 ease-in-out lg:block">
            <FilterCalender />
          </div>

          <div className="block transition-all duration-200 ease-in-out lg:hidden">
            <FilterAccordion title={t("discover.sideFilters.chooseDate")}>
              <FilterCalender />
            </FilterAccordion>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5 mt-2">
            <ResetButton targetRef={targetRef} />

            <button
              onClick={handleSubmit}
              className="flex-1 py-3 font-bold text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover"
            >
              {t("links.search")}
            </button>
          </div>
        </div>
      </div>

      {loading === "loading" && <FullScreenLoading status="pending" />}
    </>
  );
};

export default FilterGrid;
