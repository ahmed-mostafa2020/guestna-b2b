"use client";

import { useLocale, useTranslations } from "next-intl";

import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setSortBy } from "@store/discover/discoverSlice";
import { resetFilters } from "@store/searchFilter/searchFilterSlice";
import { actGetDiscoverTrips } from "@store/discover/act/actGetDiscoverTrips";

import { SORTING_TYPE } from "@constants/sorting";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

const ResetButton = ({ targetRef }) => {
  const { loading } = useSelector((state) => state.discoverData);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const scrollingToTop = () => {
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const keepOnlyPageAndSorting = () => {
    // Create a new URLSearchParams to hold only the desired parameters
    const newQueryParams = new URLSearchParams();

    newQueryParams.set("page", 1);
    newQueryParams.set("sorting", SORTING_TYPE.NEWEST);

    // Update the URL without reloading the page
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newQueryParams.toString()}`
    );
  };

  // Apply reset
  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(setSortBy(SORTING_TYPE.NEWEST));
    dispatch(setCurrentPage(1));

    // Update the URL to only include page and sorting
    keepOnlyPageAndSorting();

    setTimeout(scrollingToTop, 0);

    // Update query params in the state (if needed)

    dispatch(
      actGetDiscoverTrips({ sortType: SORTING_TYPE.NEWEST, filter: {}, locale })
    );
  };

  return (
    <>
      <button
        onClick={handleReset}
        className="py-3 text-white rounded-lg font-bold flex-1 border-2 border-[#A21E21] bg-[#A21E21] transition-all ease-in-out duration-200 hover:bg-[#c61114] hover:border-[#c61114]"
        {...getGtmTag(GTM_TAGS.FILTERS.RESET, "filters")}
      >
        {t("links.reset")}
      </button>

      {loading === "loading" && <FullScreenLoading status="pending" />}
    </>
  );
};

export default ResetButton;
