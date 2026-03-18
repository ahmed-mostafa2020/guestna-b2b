"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  // switchTripsType,
  resetFilters,
  // setTripsTypes,
} from "@store/searchFilter/searchFilterSlice";
import { Fragment, useEffect, useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { SORTING_TYPE } from "@constants/sorting";
// import formatCurrency from "@utils/formatters/FormatCurrency";
import FilterButton from "./FilterButton";
import PlaceButtonMenu from "./menus/places/PlaceButtonMenu";
import TripDurationButtonMenu from "./menus/tripDuration";
import TripTypeButtonMenu from "./menus/tripType";
import AcademicStageButtonMenu from "./menus/academicStage";
// import BudgetButtonMenu from "./menus/BudgetButtonMenu";
import FilterAccordion from "./FilterAccordion";

import earthGif from "@assets/gif/earth.webp";
import tripDurationImage from "@assets/gif/tripDuration.webp";
import tripTypeImage from "@assets/gif/tripType.webp";
import dates from "@assets/gif/dates.webp";
// import budgetGif from "@assets/gif/budget.webp";

import { searchIconBlack, searchIconWhite } from "@assets/svg";
import CustomizedModal from "../common/customizedModal";
import { Container } from "@mui/material";

const FiltersBox = () => {
  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const data = useSelector((state) => state.homeData.items);
  const places = data?.cities;
  const tripDurationsList = [
    {
      _id: CONSTANT_VALUES.PACKAGE,
      name: t("common.multiDaysTrip"),
    },
    {
      _id: CONSTANT_VALUES.ACTIVITY,
      name: t("common.oneDayTrip"),
    },
    {
      _id: CONSTANT_VALUES.HALF_DAY,
      name: t("common.halfDayTrip"),
    },
  ];
  const subCategoriesList = data?.subCategories;
  const stagesList = data?.stages;

  const {
    // tripsType,
    cities,
    checkInDate,
    checkOutDate,
    activityDayDate,
    guests,
    // budgetRange,
    tripDuration,
    tripType,
    academicStage,
  } = useSelector((state) => state.searchFilter);

  // Reset all filters
  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Trip type
  // useEffect(() => {
  //   dispatch(switchTripsType(CONSTANT_VALUES.PACKAGE));
  // }, [dispatch]);

  // Get selected items
  const getSelectedItemsText = (list, selectedItems) => {
    const items = list || [];
    const selections = selectedItems || [];

    if (selections.length === 0) return "";

    const getItemNameById = (itemId) => {
      const item = items.find((item) => item._id === itemId);
      return item?.name || "";
    };

    return selections.length > 1
      ? `${getItemNameById(selections[0])} + ...`
      : selections.length === 1
      ? getItemNameById(selections[0])
      : "";
  };

  // Places
  // const destination = useMemo(() => {
  //   const places = data?.cities || [];

  //   const getCityNameById = (cityId) => {
  //     const city = places.find((city) => city._id === cityId);
  //     return city ? city.name : "";
  //   };

  //   return cities.length > 1
  //     ? `${getCityNameById(cities[0])} + ...`
  //     : cities.length === 1
  //     ? getCityNameById(cities[0])
  //     : "";
  // }, [cities, data?.cities]);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const singleDayButtonsList = [
    {
      image: earthGif,
      title: t("filtersBox.place"),
      subTitle:
        cities.length !== 0
          ? getSelectedItemsText(data?.cities, cities)
          : t("filtersBox.searchDestination"),
      // subTitle:
      //   cities.length !== 0 ? destination : t("filtersBox.searchDestination"),
      children: <PlaceButtonMenu places={places} />,
    },
    {
      image: tripDurationImage,
      title: t("filtersBox.tripDuration"),
      subTitle:
        tripDuration.length !== 0
          ? getSelectedItemsText(tripDurationsList, tripDuration)
          : t("filtersBox.setTripDuration"),

      children: (
        <TripDurationButtonMenu tripDurationsList={tripDurationsList} />
      ),
    },
    {
      image: tripTypeImage,
      title: t("filtersBox.tripType"),
      subTitle:
        tripType.length !== 0
          ? getSelectedItemsText(data?.subCategories, tripType)
          : t("filtersBox.setTripType"),
      children: <TripTypeButtonMenu subCategoriesList={subCategoriesList} />,
    },
    {
      image: dates,
      title: t("filtersBox.AcademicStage"),
      subTitle:
        academicStage.length !== 0
          ? getSelectedItemsText(data?.stages, academicStage)
          : t("filtersBox.setAcademicStage"),
      children: <AcademicStageButtonMenu stagesList={stagesList} />,
    },
    // {
    //   image: budgetGif,
    //   title: t("filtersBox.budget"),
    //   subTitle:
    //     budgetRange.min !== CONSTANT_VALUES.MIN_BUDGET ||
    //     budgetRange.max !== CONSTANT_VALUES.MAX_BUDGET ? (
    //       <>
    //         <span>{formatCurrency(budgetRange.min)}</span> :{" "}
    //         <span>{formatCurrency(budgetRange.max)}</span>
    //       </>
    //     ) : (
    //       t("filtersBox.setBudget")
    //     ),
    //   children: <BudgetButtonMenu />,
    // },
  ];

  // Web
  const renderedButtonsList = singleDayButtonsList.map(
    (filterButton, index) => (
      <div className="flex-1" key={index}>
        <FilterButton
          gif={filterButton.image}
          title={filterButton.title}
          subTitle={filterButton.subTitle}
          index={index}
        >
          {filterButton.children}
        </FilterButton>
      </div>
    )
  );

  // Mobile
  const renderedAccordionsList = singleDayButtonsList.map(
    (accordion, index) => (
      <Fragment key={index}>
        <FilterAccordion
          index={index}
          title={accordion.title}
          subTitle={accordion.subTitle}
        >
          {accordion.children}
        </FilterAccordion>
      </Fragment>
    )
  );

  // Function to construct the query string
  const constructQueryString = () => {
    const queryParams = new URLSearchParams();

    // page number
    queryParams.append("page", 1);

    // sorting type
    queryParams.append("sorting", SORTING_TYPE.NEWEST);

    // Add cities
    cities.forEach((city) => {
      queryParams.append("cities", city);
    });

    // Add trips type
    if (tripType.length > 0) {
      queryParams.append("supCategories", tripType);
    }

    // Add tripDuration
    if (tripDuration.length > 0) {
      queryParams.append("tripsTypes", tripDuration);
    }

    // Add academicStage
    if (academicStage.length > 0) {
      queryParams.append("academicStages", academicStage);
    }

    // Add check-in date
    if (checkInDate.day) {
      queryParams.append(
        "checkInDate",
        `${checkInDate.day}/${checkInDate.month}/${checkInDate.year}`
      );
    }

    // Add check-out date
    if (checkOutDate.day) {
      queryParams.append(
        "checkOutDate",
        `${checkOutDate.day}/${checkOutDate.month}/${checkOutDate.year}`
      );
    }

    // Add activity day date
    if (activityDayDate.day) {
      queryParams.append(
        "activityDayDate",
        `${activityDayDate.day}/${activityDayDate.month}/${activityDayDate.year}`
      );
    }

    // Add guests
    Object.entries(guests).forEach(([key, value]) => {
      if (value > 0) {
        queryParams.append(key, value);
      }
    });

    // Add budget range
    // if (
    //   budgetRange.min !== CONSTANT_VALUES.MIN_BUDGET ||
    //   budgetRange.max !== CONSTANT_VALUES.MAX_BUDGET
    // ) {
    //   queryParams.append("minBudget", budgetRange.min);
    //   queryParams.append("maxBudget", budgetRange.max);
    // }

    return queryParams.toString();
  };

  return (
    <>
      {/* Web */}
      <div className="hidden w-full mt-8 transition-all duration-200 ease-in-out lg:block">
        <Container maxWidth="lg">
          <div className="mx-auto w-[82%] flex items-center px-3 bg-white border rounded-2xl border-mainColor z-[2]">
            {renderedButtonsList}

            <Link
              // onClick={() => {
              //   dispatch(setTripsTypes(CONSTANT_VALUES.PACKAGE));
              // }}
              href={{
                pathname: `/${locale}/discover`,
                query: constructQueryString(),
              }}
              className="w-20 h-20 my-2 transition-all duration-200 ease-in-out rounded-lg ms-2 bg-mainColor hover:bg-linksHover centered"
            >
              {searchIconWhite}
            </Link>
          </div>
        </Container>
      </div>

      {/* Mobile */}
      <div className="flex w-full -mb-10 transition-all duration-200 ease-in-out cursor-pointer lg:hidden">
        <Container maxWidth="lg">
          <div
            onClick={handleOpen}
            className="flex items-center w-full gap-3 p-3 bg-white rounded-2xl"
          >
            {searchIconBlack}
            <h2 className="text-base font-medium">
              {t("filtersBox.mobileTitle")}
            </h2>
          </div>
        </Container>
      </div>

      <CustomizedModal
        open={open}
        handleClose={handleClose}
        bgcolor="#F3F3F3"
        customizedCloseButton={true}
        padding={false}
      >
        <div className="p-4">
          <div className="flex flex-col gap-6">{renderedAccordionsList}</div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between w-full gap-6 px-4 py-6 bg-white border-t end-0 border-textLight">
          <button
            onClick={() => {
              dispatch(resetFilters());
            }}
            className="text-base border-b border-black"
          >
            {t("links.clearAll")}
          </button>

          <Link
            // onClick={() => {
            //   dispatch(
            //     setTripsTypes(
            //       tripsType === CONSTANT_VALUES.PACKAGE
            //         ? CONSTANT_VALUES.PACKAGE
            //         : CONSTANT_VALUES.ACTIVITY
            //     )
            //   );
            // }}
            href={{
              pathname: `/${locale}/discover`,
              query: constructQueryString(),
            }}
            className="flex-1 gap-3 px-8 py-3 text-lg font-medium text-white rounded-lg centered bg-mainColor"
          >
            {searchIconWhite}
            <span>{t("links.search")}</span>
          </Link>
        </div>
      </CustomizedModal>
    </>
  );
};

export default FiltersBox;
