"use client";

import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setDiscoverFilters } from "@store/discover/discoverSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { memo, useCallback, useEffect, useMemo } from "react";

import SearchAndFilters from "@components/common/searchAndFilters/SearchAndFilters";
import { Box } from "@mui/material";

const DiscoverFiltersSection = () => {
  // get as a prop searchTerm from the parent component

  const dispatch = useDispatch();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Apply filters
  const { sideFilters, loading } = useSelector(
    (state) => state.discoverSideFilters
  );

  const { filter } = useSelector((state) => state.discoverData);

  useEffect(() => {
    if (!searchParams) return;

    const urlFilters = {};

    searchParams.forEach((value, key) => {
      urlFilters[key] = value.split(",");
    });

    if (Object.keys(urlFilters).length) {
      dispatch(setDiscoverFilters(urlFilters));
    }
  }, [dispatch, searchParams]);

  const mapOptions = (items, labelKey = "name", valueKey = "_id") =>
    items.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  const handleChange = useCallback(
    (key) => (value) => {
      const values = Array.isArray(value) ? value : [value];

      // Redux update - delete key if empty array
      if (values.length) {
        dispatch(setDiscoverFilters({ ...filter, [key]: values }));
      } else {
        dispatch(setDiscoverFilters({ ...filter, [key]: undefined }));
      }

      // URL update
      const params = new URLSearchParams(searchParams.toString());

      if (values.length) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [dispatch, router, pathname, searchParams]
  );

  const handleReset = useCallback(() => {
    dispatch(setDiscoverFilters({}));
    router.replace(pathname, { scroll: false });
  }, [dispatch, pathname, router]);

  const filters = useMemo(() => {
    const {
      cities = [],
      categories = [],
      // stages = [],
      tripsTypes = [],
    } = sideFilters || {};

    return [
      {
        label: t("discover.sideFilters.destinations"),
        key: "cities",
        options: mapOptions(cities),
        value: filter?.cities,
        multiple: true,
        onChange: handleChange("cities"),
      },
      {
        label: t("discover.sideFilters.typeOfExperience"),
        key: "categories",
        options: mapOptions(categories),
        value: filter?.categories ?? [],
        multiple: true,
        onChange: handleChange("categories"),
      },

      {
        label: t("discover.sideFilters.typeOfTrips"),
        key: "tripsTypes",
        options: mapOptions(tripsTypes, "label", "value"),
        value: filter?.tripsTypes ?? [],
        multiple: true,
        onChange: handleChange("tripsTypes"),
      },
      // {
      //   label: t("discover.sideFilters.academicStages"),
      //   key: "academicStages",
      //   options: mapOptions(stages),
      //   value: filter?.academicStages ?? [],
      //   multiple: true,
      //   onChange: handleChange("academicStages"),
      // },
    ];
  }, [sideFilters, filter, t, handleChange]);

  return (
    <Box className="bg-white rounded-xl p-4 shadow-[0_0_4px_0_rgba(0,0,0,0.16)]">
      <SearchAndFilters
        onReset={handleReset}
        filters={filters}
        isLoading={loading === "loading"}
      />
    </Box>
  );
};

export default memo(DiscoverFiltersSection);
