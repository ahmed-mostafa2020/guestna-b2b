"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  switchTripsType,
  // toggleTripsTypes,
  updateGuestCount,
  resetFilters,
  setTripsTypes,
  clearActivityDayDate,
  clearCheckOutDate,
  clearCheckInDate,
} from "@store/searchFilter/searchFilterSlice";
import { Fragment, useEffect, useMemo, useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { SORTING_TYPE } from "@constants/sorting";
import formatCurrency from "@utils/FormatCurrency";
import formatNumbersUint from "@utils/FormatNumbersUint";
import FilterButton from "./FilterButton";
import PlaceButtonMenu from "./menus/places/PlaceButtonMenu";
import DatesMenu from "./menus/dates/DatesMenu";
import GuestsButtonMenu from "./menus/guests/GuestsButtonMenu";
import BudgetButtonMenu from "./menus/BudgetButtonMenu";
import FilterAccordion from "./FilterAccordion";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import earthGif from "@assets/gif/earth.gif";
import dates from "@assets/gif/dates.gif";
import budgetGif from "@assets/gif/budget.gif";
import guestGif from "@assets/gif/guest.gif";

import { searchIconBlack, searchIconWhite } from "@assets/svg";
import CustomizedModal from "../common/customizedModal";

const FiltersBox = () => {
  const [value, setValue] = useState("multiDays");

  const dispatch = useDispatch();

  const data = useSelector((state) => state.homeData.items);
  const places = data?.cities;
  const targetAudiences = data?.targetAudiences;

  const {
    tripsType,
    cities,
    checkInDate,
    checkOutDate,
    activityDayDate,
    guests,
    budgetRange,
  } = useSelector((state) => state.searchFilter);

  // Reset all filters
  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Trip type
  useEffect(() => {
    dispatch(switchTripsType(CONSTANT_VALUES.PACKAGE));
  }, [dispatch]);

  // Places
  const destination = useMemo(() => {
    const places = data?.cities || [];

    const getCityNameById = (cityId) => {
      const city = places.find((city) => city._id === cityId);
      return city ? city.name : "";
    };

    return cities.length > 1
      ? `${getCityNameById(cities[0])} + ...`
      : cities.length === 1
      ? getCityNameById(cities[0])
      : "";
  }, [cities, data?.cities]);

  const getTotalGuests = (guests) => {
    const {
      families,
      couples,
      olds,
      adults,
      individuals,
      teenagers,
      children,
      babies,
      male,
      female,
      employees,
      disabled,
    } = guests;

    const totalGuests =
      families +
      couples +
      olds +
      adults +
      individuals +
      teenagers +
      children +
      babies +
      male +
      female +
      employees +
      disabled;
    return totalGuests >= 1
      ? formatNumbersUint(totalGuests, t("common.guest"), t("common.guests"))
      : t("filtersBox.addGuests");
  };

  const locale = useLocale();
  const t = useTranslations();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const multiDaysButtonsList = [
    {
      image: earthGif,
      title: t("filtersBox.place"),
      subTitle:
        cities.length !== 0 ? destination : t("filtersBox.searchDestination"),
      children: <PlaceButtonMenu places={places} />,
    },
    {
      image: dates,
      title: t("filtersBox.checkIn"),
      subTitle:
        checkInDate.day !== null
          ? `${checkInDate.day}/${checkInDate.month + 1}/${checkInDate.year}`
          : t("filtersBox.addDates"),
      children: <DatesMenu type="checkIn" />,
    },
    {
      image: dates,
      title: t("filtersBox.checkOut"),
      subTitle:
        checkOutDate.day !== null
          ? `${checkOutDate.day}/${checkOutDate.month + 1}/${checkOutDate.year}`
          : t("filtersBox.addDates"),
      children: <DatesMenu type="checkOut" />,
    },
    {
      image: guestGif,
      title: t("filtersBox.guestsNumber"),
      subTitle: getTotalGuests(guests),
      children: (
        <GuestsButtonMenu
          targetAudiences={targetAudiences}
          countState={guests}
          updateCountAction={updateGuestCount}
        />
      ),
    },
    {
      image: budgetGif,
      title: t("filtersBox.budget"),
      subTitle:
        budgetRange.min !== CONSTANT_VALUES.MIN_BUDGET ||
        budgetRange.max !== CONSTANT_VALUES.MAX_BUDGET ? (
          <>
            <span>{formatCurrency(budgetRange.min)}</span> :{" "}
            <span>{formatCurrency(budgetRange.max)}</span>
          </>
        ) : (
          t("filtersBox.setBudget")
        ),
      children: <BudgetButtonMenu />,
    },
  ];

  const singleDayButtonsList = [
    {
      image: earthGif,
      title: t("filtersBox.place"),
      subTitle:
        cities.length !== 0 ? destination : t("filtersBox.searchDestination"),
      children: <PlaceButtonMenu places={places} />,
    },
    {
      image: dates,
      title: t("filtersBox.addDay"),
      subTitle:
        activityDayDate.day !== null
          ? `${activityDayDate.day}/${activityDayDate.month}/${activityDayDate.year}`
          : t("filtersBox.addDates"),
      children: <DatesMenu type="activityDay" />,
    },
    {
      image: guestGif,
      title: t("filtersBox.guestsNumber"),
      subTitle: getTotalGuests(guests),
      children: (
        <GuestsButtonMenu
          targetAudiences={targetAudiences}
          countState={guests}
          updateCountAction={updateGuestCount}
        />
      ),
    },
    {
      image: budgetGif,
      title: t("filtersBox.budget"),
      subTitle:
        budgetRange.min !== CONSTANT_VALUES.MIN_BUDGET ||
        budgetRange.max !== CONSTANT_VALUES.MAX_BUDGET ? (
          <>
            <span>{formatCurrency(budgetRange.min)}</span> :{" "}
            <span>{formatCurrency(budgetRange.max)}</span>
          </>
        ) : (
          t("filtersBox.setBudget")
        ),
      children: <BudgetButtonMenu />,
    },
  ];

  // Web
  const renderedMultiDaysButtonsList = multiDaysButtonsList.map(
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

  const renderedSingleDayButtonsList = singleDayButtonsList.map(
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
  const renderedMultiDaysAccordionsList = multiDaysButtonsList.map(
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

  const renderedSingleDayAccordionsList = singleDayButtonsList.map(
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

    // Add trips type
    queryParams.append("tripsType", tripsType);

    // Add cities
    cities.forEach((city) => {
      queryParams.append("cities", city);
    });

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
    if (
      budgetRange.min !== CONSTANT_VALUES.MIN_BUDGET ||
      budgetRange.max !== CONSTANT_VALUES.MAX_BUDGET
    ) {
      queryParams.append("minBudget", budgetRange.min);
      queryParams.append("maxBudget", budgetRange.max);
    }

    return queryParams.toString();
  };

  return (
    <>
      {/* Web */}
      <div className="hidden w-full mt-16 transition-all duration-200 ease-in-out lg:block">
        <Box>
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="filters"
                className="w-fit rounded-t-2xl"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#007473",
                  },
                }}
              >
                <Tab
                  onClick={() => {
                    dispatch(switchTripsType(CONSTANT_VALUES.PACKAGE));
                    dispatch(clearActivityDayDate());
                  }}
                  label={t("filtersBox.multiDaysTrips")}
                  value="multiDays"
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: "white",
                    },
                    "&.MuiButtonBase-root ,&.Mui-selected": {
                      color: "#bbb",
                      fontSize: "18px",
                      padding: "16px 24px",
                      fontWeight: 500,
                      fontFamily: "var(--font-somar-sans), sans-serif",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&.Mui-selected": {
                      color: "white",
                      backgroundColor: "#007473",
                    },
                  }}
                />
                <Tab
                  onClick={() => {
                    dispatch(switchTripsType(CONSTANT_VALUES.ACTIVITY));
                    dispatch(clearCheckInDate());
                    dispatch(clearCheckOutDate());
                  }}
                  label={t("filtersBox.singleDayTrips")}
                  value="singleDay"
                  sx={{
                    "&.MuiButtonBase-root": {
                      backgroundColor: "white",
                    },
                    "&.MuiButtonBase-root ,&.Mui-selected": {
                      color: "#bbb",
                      fontSize: "18px",
                      padding: "16px 24px",
                      fontWeight: 500,
                      fontFamily: "var(--font-somar-sans), sans-serif",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&.Mui-selected": {
                      color: "white",
                      backgroundColor: "#007473",
                    },
                  }}
                />
              </TabList>
            </Box>

            <TabPanel value="multiDays" sx={{ padding: 0 }}>
              <div className="flex items-center px-3 bg-white rounded-b-2xl rounded-e-2xl">
                {renderedMultiDaysButtonsList}

                <Link
                  onClick={() => {
                    dispatch(setTripsTypes(CONSTANT_VALUES.PACKAGE));
                  }}
                  href={{
                    pathname: `/${locale}/discover`,
                    query: constructQueryString(),
                  }}
                  className="w-20 h-20 my-2 transition-all duration-200 ease-in-out rounded-lg ms-2 bg-mainColor hover:bg-linksHover centered"
                >
                  {searchIconWhite}
                </Link>
              </div>
            </TabPanel>

            <TabPanel value="singleDay" sx={{ padding: 0 }}>
              <div className="flex items-center px-3 bg-white rounded-b-2xl rounded-e-2xl">
                {renderedSingleDayButtonsList}

                <Link
                  onClick={() => {
                    dispatch(setTripsTypes(CONSTANT_VALUES.ACTIVITY));
                  }}
                  href={{
                    pathname: `/${locale}/discover`,
                    query: constructQueryString(),
                  }}
                  className="w-20 h-20 my-2 transition-all duration-200 ease-in-out rounded-lg ms-2 bg-mainColor hover:bg-linksHover centered"
                >
                  {searchIconWhite}
                </Link>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>

      {/* Mobile */}
      <div className="flex w-full -mb-10 transition-all duration-200 ease-in-out cursor-pointer lg:hidden">
        <div
          onClick={handleOpen}
          className="flex items-center w-full gap-3 p-3 bg-white rounded-2xl"
        >
          {searchIconBlack}

          <h2 className="text-base font-medium">
            {t("filtersBox.mobileTitle")}
          </h2>
        </div>
      </div>

      <CustomizedModal
        open={open}
        handleClose={handleClose}
        bgcolor="#F3F3F3"
        customizedCloseButton={true}
        padding={false}
      >
        <div className="p-4">
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label="filters"
              sx={{
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab
                onClick={() => {
                  dispatch(switchTripsType(CONSTANT_VALUES.PACKAGE));
                  dispatch(clearActivityDayDate());
                }}
                label={t("filtersBox.multiDaysTrips")}
                value="multiDays"
                sx={{
                  "&.MuiButtonBase-root": {
                    backgroundColor: "transparent",
                    color: "#1F2626",
                    fontWeight: 500,
                    fontSize: "15px",
                    borderBottom: "1px solid transparent",
                  },
                  "&.MuiButtonBase-root ,&.Mui-selected": {
                    padding: "12px",
                    fontFamily: "var(--font-somar-sans), sans-serif",
                    transition: "all 0.2s ease-in-out",
                  },
                  "&.Mui-selected": {
                    color: "#007473",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderBottom: "1px solid #007473",
                  },
                }}
              />
              <Tab
                onClick={() => {
                  dispatch(switchTripsType(CONSTANT_VALUES.ACTIVITY));
                  dispatch(clearCheckInDate());
                  dispatch(clearCheckOutDate());
                }}
                label={t("filtersBox.singleDayTrips")}
                value="singleDay"
                sx={{
                  "&.MuiButtonBase-root": {
                    backgroundColor: "transparent",
                    color: "#1F2626",
                    fontWeight: 500,
                    fontSize: "15px",
                    borderBottom: "1px solid transparent",
                  },
                  "&.MuiButtonBase-root ,&.Mui-selected": {
                    padding: "12px",
                    fontFamily: "var(--font-somar-sans), sans-serif",
                    transition: "all 0.2s ease-in-out",
                  },
                  "&.Mui-selected": {
                    color: "#007473",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderBottom: "1px solid #007473",
                  },
                }}
              />
            </TabList>

            <TabPanel value="multiDays" sx={{ padding: 0, marginTop: "12px" }}>
              <div className="flex flex-col gap-6 ">
                {renderedMultiDaysAccordionsList}
              </div>
            </TabPanel>

            <TabPanel value="singleDay" sx={{ padding: 0, marginTop: "12px" }}>
              <div className="flex flex-col gap-6 ">
                {renderedSingleDayAccordionsList}
              </div>
            </TabPanel>
          </TabContext>
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
            onClick={() => {
              dispatch(
                setTripsTypes(
                  tripsType === CONSTANT_VALUES.PACKAGE
                    ? CONSTANT_VALUES.PACKAGE
                    : CONSTANT_VALUES.ACTIVITY
                )
              );
            }}
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
