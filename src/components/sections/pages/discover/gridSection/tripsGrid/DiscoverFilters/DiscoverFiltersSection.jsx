"use client";

import { memo, useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setDiscoverFilters,
  setSearchTerm,
} from "@store/discover/discoverSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import SearchAndFilters from "@components/common/searchAndFilters/SearchAndFilters";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { Grid } from "@material-ui/core";
import { searchBarIcon, wrongIcon } from "@/src/assets/svg";

const EXCLUDED_URL_PARAMS = ["page"];

const DiscoverFiltersSection = () => {
  // get as a prop searchTerm from the parent component

  const dispatch = useDispatch();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ======================
  // Selectors (optimized)
  // ======================
  const { sideFilters, loading } = useSelector(
    (state) => state.discoverSideFilters,
    shallowEqual
  );

  const { filter, searchTerm } = useSelector(
    (state) => state.discoverData,
    shallowEqual
  );

  // ======================
  // URL → Redux Sync
  // ======================
  useEffect(() => {
    if (!searchParams) return;

    const paramsObject = {};
    let hasChanges = false;

    searchParams.forEach((value, key) => {
      if (EXCLUDED_URL_PARAMS.includes(key)) return;

      if (key === "searchTerm") return;

      paramsObject[key] = value.split(",");
    });

    if (JSON.stringify(paramsObject) !== JSON.stringify(filter)) {
      dispatch(setDiscoverFilters(paramsObject));
      hasChanges = true;
    }

    const urlSearch = searchParams.get("searchTerm") || "";

    if (urlSearch !== searchTerm) {
      dispatch(setSearchTerm(urlSearch));
      hasChanges = true;
    }

    if (!hasChanges) return;
  }, [searchParams, dispatch]);

  // ======================
  // Helpers
  // ======================

  const updateUrl = useCallback(
    (key, values) => {
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

  const mapOptions = useCallback(
    (items = [], labelKey = "name", valueKey = "_id") =>
      items.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      })),
    []
  );

  // ======================
  // Handlers
  // ======================

  const handleFilterChange = useCallback(
    (key) => (value) => {
      const values = Array.isArray(value) ? value : [value];

      const newFilters = {
        ...filter,
        ...(values.length ? { [key]: values } : {}),
      };

      if (!values.length) delete newFilters[key];

      dispatch(setDiscoverFilters(newFilters));

      if (!EXCLUDED_URL_PARAMS.includes(key)) {
        updateUrl(key, values);
      }
    },
    [dispatch, filter, updateUrl]
  );

  const handleSearchChange = useCallback(
    (value) => {
      dispatch(setSearchTerm(value));
      updateUrl("searchTerm", value ? [value] : []);
    },
    [dispatch, updateUrl]
  );

  const handleClear = useCallback(() => {
    dispatch(setSearchTerm(""));
    updateUrl("searchTerm", []);
  }, [dispatch, updateUrl]);

  const handleReset = useCallback(() => {
    dispatch(setDiscoverFilters({}));
    router.replace(pathname, { scroll: false });
  }, [dispatch, pathname, router]);

  // ======================
  // Memoized Config
  // ======================

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
        value: filter?.cities,
        multiple: true,
        onChange: handleFilterChange("cities"),
      },
      {
        label: t("discover.sideFilters.typeOfExperience"),
        key: "categories",
        options: mapOptions(categories),
        value: filter?.categories ?? [],
        multiple: true,
        onChange: handleFilterChange("categories"),
      },

      {
        label: t("discover.sideFilters.typeOfTrips"),
        key: "tripsTypes",
        options: mapOptions(tripsTypes, "label", "value"),
        value: filter?.tripsTypes ?? [],
        multiple: true,
        onChange: handleFilterChange("tripsTypes"),
      },
      {
        label: t("discover.sideFilters.academicStages"),
        key: "academicStages",
        options: mapOptions(stages),
        value: filter?.academicStages || [],
        multiple: true,
        onChange: handleFilterChange("academicStages"),
      },
    ];
  }, [sideFilters, filter, t, mapOptions, handleFilterChange]);

  // ======================
  // Render
  // ======================

  return (
    <Box className="bg-white rounded-xl p-4 shadow-[0_0_4px_0_rgba(0,0,0,0.16)]">
      <Grid container alignItems="center" spacing={2}>
        <Grid item md={9} xs={12}>
          <span className="font-medium !text-titleColor text-lg">
            {t("forms.search.title")}
          </span>
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            size="small"
            className="w-full md:w-72"
            value={searchTerm || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearchChange(searchTerm)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => handleSearchChange(searchTerm)}>
                    {searchBarIcon}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!!searchTerm && (
            <IconButton onClick={handleClear}>
              {wrongIcon}
            </IconButton>
          )}
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
