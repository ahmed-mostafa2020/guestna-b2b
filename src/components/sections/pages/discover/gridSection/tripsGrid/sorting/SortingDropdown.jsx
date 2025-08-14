"use client";

import { useLocale } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setSortBy } from "@store/discover/discoverSlice";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { memo, useMemo, useState } from "react";

import { useUpdateQueryParams } from "@hooks/useUpdateQueryParams";
// import { agesIdsList } from "@constants/targetAudiencesIds";
// import getSelectedTargetAudiences from "@utils/getSelectedTargetAudiences";
import buildFilter from "@utils/BuildFilter";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SortingDropdown = ({ sortingList, title }) => {
  // get as a prop searchTerm from the parent component
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const locale = useLocale();

  const sortType = useSelector((state) => state.discoverData.sortBy);

  const updateQueryParams = useUpdateQueryParams();

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
    tripType,
    tripDuration,
    academicStage,
  } = useSelector((state) => state.searchFilter);

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
      // searchTerm,
      checkInDate,
      checkOutDate,
      activityDayDate,
      cities: selectedCities,
      budgetRange,
      categories: selectedCategories,
      languages: selectedLanguages,
      // targetAudiences: selectedTargetAudiences,
      availableSeats,
      rate,
      tripType,
      tripDuration,
      academicStage,
    });
  }, [
    tripsType,
    allTripsTypes,
    // searchTerm,
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
    tripType,
    tripDuration,
    academicStage,
  ]);

  const getNameByValue = (value) => {
    const option = sortingList.find((opt) => opt.value === value);
    return option ? option.name : "";
  };

  const handleSubmit = (chosenSortValue) => {
    setIsOpen(false);

    dispatch(setSortBy(chosenSortValue));
    dispatch(setCurrentPage(1));

    // Update the query parameter
    updateQueryParams({ sorting: chosenSortValue });

    dispatch(
      actGetDiscoverTrips({ sortType: chosenSortValue, filter, locale })
    );
  };

  return (
    <div className="relative w-full lg:w-fit">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full lg:w-[264px] justify-between p-4 bg-white border-2 rounded-lg border-border"
      >
        <p className="flex items-center gap-0.5">
          <span>{title}</span>
          <span>{getNameByValue(sortType)}</span>
        </p>
        {isOpen ? (
          <ExpandLessIcon className="w-5 h-5 transition-all duration-200 ease-in-out" />
        ) : (
          <ExpandLessIcon className="w-5 h-5 transition-all duration-200 ease-in-out rotate-180" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-[264px] overflow-hidden mt-2 bg-white rounded-xl box-shadow z-[2] transition-all ease-in-out duration-200">
          <div>
            {sortingList.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(option.value)}
                className={`w-full p-4 transition-all ease-in-out duration-200 text-start hover:bg-buttonsHover ${
                  index !== sortingList.length - 1 &&
                  "border-b border-[#E9E9F2]"
                } `}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SortingDropdown);
