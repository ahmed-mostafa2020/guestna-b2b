"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { SORTING_TYPE } from "@constants/sorting";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import SortingDropdown from "./SortingDropdown";

const Sorting = () => {
  const { loading, searchTerm } = useSelector((state) => state.discoverData);

  const t = useTranslations();

  const sortingList = [
    {
      name: t("discover.sorting.mostPopular"),
      value: SORTING_TYPE.HIGHEST_SELLING,
    },
    { name: t("discover.sorting.newest"), value: SORTING_TYPE.NEWEST },
    { name: t("discover.sorting.oldest"), value: SORTING_TYPE.OLDEST },
    // {
    //   name: t("discover.sorting.lowestPrice"),
    //   value: SORTING_TYPE.LOWEST_PRICE,
    // },
    // {
    //   name: t("discover.sorting.highestPrice"),
    //   value: SORTING_TYPE.HIGHEST_PRICE,
    // },
    {
      name: t("discover.sorting.highestLover"),
      value: SORTING_TYPE.HIGHEST_LOVER,
    },
    {
      name: t("discover.sorting.highestRate"),
      value: SORTING_TYPE.HIGHEST_RATE,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-end w-full">
        <SortingDropdown
          title={t("discover.sorting.sortingBy")}
          sortingList={sortingList}
          searchTerm={searchTerm}
        />
      </div>

      {loading === "loading" && <FullScreenLoading status="pending" />}
    </>
  );
};

export default Sorting;
