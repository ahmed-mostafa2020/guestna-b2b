"use client";

import { useLocale } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { useMemo } from "react";

import { useUpdateQueryParams } from "@hooks/useUpdateQueryParams";
// import { agesIdsList } from "@constants/targetAudiencesIds";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import buildFilter from "@utils/BuildFilter";
// import getSelectedTargetAudiences from "@utils/getSelectedTargetAudiences";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Pagination = ({
  currentPage,
  lastPage,
  itemsPerPage,
  totalItems,
  setCurrentPage,
  scrollingToTop,
}) => {
  const dispatch = useDispatch();
  const locale = useLocale();

  const { loading, sortBy, searchTerm } = useSelector(
    (state) => state.discoverData
  );

  const {
    tripsType,
    allTripsTypes,
    cities,
    guests,
    activityDayDate,
    checkOutDate,
    checkInDate,
    // budgetRange,
    categories,
    languages,
    rate,
  } = useSelector((state) => state.searchFilter);

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
      searchTerm,
      checkInDate,
      checkOutDate,
      activityDayDate,
      cities,
      // budgetRange,
      categories,
      languages,
      // targetAudiences: selectedTargetAudiences,
      availableSeats,
      rate,
    });
  }, [
    tripsType,
    allTripsTypes,
    searchTerm,
    checkInDate,
    checkOutDate,
    activityDayDate,
    cities,
    categories,
    // selectedTargetAudiences,
    languages,
    // budgetRange,
    availableSeats,
    rate,
  ]);

  const handlePageChange = (newPage) => {
    setTimeout(() => {
      scrollingToTop();
    }, 0);

    if (newPage > 0 && newPage <= lastPage) {
      dispatch(setCurrentPage(newPage));
    }

    updateQueryParams({ page: newPage });

    dispatch(
      actGetDiscoverTrips({ page: newPage, sortType: sortBy, filter, locale })
    );
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // const maxVisiblePages = 5;

    // Always show the first page button
    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || totalItems <= itemsPerPage}
        className={`h-10 w-10 font-medium rounded-md border  transition-all ease-in-out duration-200 ${
          currentPage === 1
            ? "bg-mainColor text-white border-mainColor"
            : "hover:bg-buttonsHover bg-white border-paginationBorder"
        }`}
      >
        1
      </button>
    );

    // Show ellipsis if there are pages between the first and the current page
    if (currentPage > 3) {
      pageNumbers.push(
        <span key="ellipsis-start" className="mx-1">
          ...
        </span>
      );
    }

    // Show pages around the current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(lastPage - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
          className={`h-10 w-10 font-medium border border-paginationBorder rounded-md transition-all ease-in-out duration-200 ${
            currentPage === i
              ? "bg-mainColor text-white border-mainColor"
              : " hover:bg-buttonsHover bg-white"
          }`}
        >
          {i}
        </button>
      );
    }

    // Show ellipsis if there are pages between the current page and the last page
    if (currentPage < lastPage - 2) {
      pageNumbers.push(
        <span key="ellipsis-end" className="mx-1">
          ...
        </span>
      );
    }

    // Always show the last page button
    if (lastPage > 1) {
      pageNumbers.push(
        <button
          key={lastPage}
          onClick={() => handlePageChange(lastPage)}
          disabled={currentPage === lastPage}
          className={`h-10 w-10 font-medium rounded-md border duration-200 ease-in-out transition-all ${
            currentPage === lastPage
              ? "bg-mainColor text-white border-mainColor"
              : "hover:bg-buttonsHover bg-white border-paginationBorder "
          }`}
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-5 mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalItems <= itemsPerPage}
            className="w-10 h-10 bg-white border rounded-md centered border-paginationBorder disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {locale === "ar" ? (
              <ArrowForwardIosIcon fontSize="15" />
            ) : (
              <span className="rotate-180">
                <ArrowForwardIosIcon fontSize="15" />
              </span>
            )}
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage || totalItems <= itemsPerPage}
            className="w-10 h-10 bg-white border rounded-md centered border-paginationBorder disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {locale === "ar" ? (
              <span className="rotate-180">
                <ArrowForwardIosIcon fontSize="15" />
              </span>
            ) : (
              <ArrowForwardIosIcon fontSize="15" />
            )}
          </button>
        </div>

        {/* {totalItems >= 1 && (
        <p>
          1 –{" "}
          {currentPage * itemsPerPage > totalItems
            ? totalItems
            : currentPage * itemsPerPage}{" "}
          of {totalItems} properties found
        </p>
      )} */}
      </div>

      {loading === "loading" && <FullScreenLoading status="pending" />}
    </>
  );
};

export default Pagination;
