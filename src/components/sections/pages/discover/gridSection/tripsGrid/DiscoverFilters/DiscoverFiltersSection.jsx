"use client";

import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  setDiscoverFilters,
  setSearchTerm,
} from "@store/discover/discoverSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from "react";
import SearchAndFilters from "@components/common/searchAndFilters/SearchAndFilters";
import { Box } from "@mui/material";
import { Grid } from "@material-ui/core";

// Constants
const EXCLUDED_URL_PARAMS = ["page", "searchTerm"];

const DiscoverFiltersSection = () => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Selectors
  const { sideFilters, loading } = useSelector(
    (state) => state.discoverSideFilters
  );
  const { filter, searchTerm } = useSelector((state) => state.discoverData);

  // Sync URL params to Redux on mount/URL change
  useEffect(() => {
    if (!searchParams) return;

    const urlFilters = {};

    searchParams.forEach((value, key) => {
      if (EXCLUDED_URL_PARAMS.includes(key)) return;
      urlFilters[key] = value.split(",");
    });

    if (Object.keys(urlFilters).length > 0) {
      dispatch(setDiscoverFilters(urlFilters));
    }

    // Sync search term from URL
    const urlSearchTerm = searchParams.get("searchTerm");
    if (urlSearchTerm && urlSearchTerm !== searchTerm) {
      dispatch(setSearchTerm(urlSearchTerm));
    }
  }, [dispatch, searchParams]); // Removed searchTerm to avoid infinite loops

  // Helper function to map items to options
  const mapOptions = useCallback(
    (items = [], labelKey = "name", valueKey = "_id") =>
      items.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      })),
    []
  );

  // Update URL params helper
  const updateUrlParams = useCallback(
    (key, values) => {
      const params = new URLSearchParams(searchParams.toString());

      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  // Handle filter changes
  const handleChange = useCallback(
    (key) => (value) => {
      const values = Array.isArray(value) ? value : [value];

      // Update Redux
      const newFilters = { ...filter };
      if (values.length > 0) {
        newFilters[key] = values;
      } else {
        delete newFilters[key];
      }
      dispatch(setDiscoverFilters(newFilters));

      // Update URL
      if (!EXCLUDED_URL_PARAMS.includes(key)) {
        updateUrlParams(key, values);
      }
    },
    [dispatch, filter, updateUrlParams]
  );

  // Handle search changes
  const handleSearchChange = useCallback(
    (value) => {
      dispatch(setSearchTerm(value));
      updateUrlParams("searchTerm", value ? [value] : []);
    },
    [dispatch, updateUrlParams]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    dispatch(setDiscoverFilters({}));
    dispatch(setSearchTerm(""));
    router.replace(pathname, { scroll: false });
  }, [dispatch, pathname, router]);

  // Search configuration
  const search = useMemo(
    () => ({
      key: "search",
     
      value: searchTerm || "",
      onChange: handleSearchChange,
    }),
    [searchTerm, handleSearchChange, t]
  );

  // Filters configuration
  const filters = useMemo(() => {
    const {
      cities = [],
      categories = [],
      stages = [],
      tripsTypes = [],
    } = sideFilters || {};

    return [
      {
        label: t("discover.sideFilters.destinations"),
        key: "cities",
        options: mapOptions(cities),
        value: filter?.cities || [],
        multiple: true,
        onChange: handleChange("cities"),
      },
      {
        label: t("discover.sideFilters.typeOfExperience"),
        key: "categories",
        options: mapOptions(categories),
        value: filter?.categories || [],
        multiple: true,
        onChange: handleChange("categories"),
      },
      {
        label: t("discover.sideFilters.typeOfTrips"),
        key: "tripsTypes",
        options: mapOptions(tripsTypes, "label", "value"),
        value: filter?.tripsTypes || [],
        multiple: true,
        onChange: handleChange("tripsTypes"),
      },
      {
        label: t("discover.sideFilters.academicStages"),
        key: "academicStages",
        options: mapOptions(stages),
        value: filter?.academicStages || [],
        multiple: true,
        onChange: handleChange("academicStages"),
      },
    ];
  }, [sideFilters, filter, t, handleChange, mapOptions]);

  return (
    <Box className="bg-white rounded-xl p-4 shadow-[0_0_4px_0_rgba(0,0,0,0.16)]">
      <Grid container alignItems="center" spacing={2}>
        <Grid item md={9} xs={12}>
          <span className="font-medium !text-titleColor text-lg">
            {t("forms.search.title")}
          </span>
        </Grid>
        <Grid item md={3} xs={12}>
          <SearchAndFilters search={search} filters={[]} showTitle={false} />
        </Grid>
        <Grid item xs={12}>
          <SearchAndFilters
            onReset={handleReset}
            filters={filters}
            isLoading={loading === "loading"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(DiscoverFiltersSection);
