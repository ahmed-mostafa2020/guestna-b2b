"use client";

import { memo, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  setCurrentPage,
  setDiscoverFilters,
  setSearchTerm,
} from "@store/discover/discoverSlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import SearchAndFilters from "@components/common/searchAndFilters/SearchAndFilters";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { Grid } from "@material-ui/core";
import { searchBarIcon, wrongIcon } from "@assets/svg";

const EXCLUDED_URL_PARAMS = ["page"];

const DiscoverFiltersSection = () => {
  const dispatch = useDispatch();
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Refs
  const isInitialMount = useRef(true);
  const skipNextUrlSync = useRef(false); // NEW: Skip URL sync after manual update

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

  const [searchValue, setSearchValue] = useState(searchTerm || "");

  // ======================
  // URL Utilities
  // ======================
  const buildUrlFromFilters = useCallback(
    (filters, search) => {
      const params = new URLSearchParams();

      // Add filter params
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        }
      });

      // Add search term
      if (search && search.trim()) {
        params.set("searchTerm", search.trim());
      }

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      return newUrl;
    },
    [pathname]
  );

  const updateUrl = useCallback(
    (filters, search) => {
      skipNextUrlSync.current = true; // Skip the next URL sync
      const newUrl = buildUrlFromFilters(filters, search);
      router.replace(newUrl, { scroll: false });
    },
    [router, buildUrlFromFilters]
  );

  // ======================
  // URL → Redux Sync (ONLY on initial load or browser back/forward)
  // ======================
  useEffect(() => {
    // Skip if this update was triggered by us
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }

    if (!searchParams) return;

    const urlFilters = {};
    const urlSearchTerm = searchParams.get("searchTerm") || "";

    // Parse URL params into filters object
    searchParams.forEach((value, key) => {
      if (EXCLUDED_URL_PARAMS.includes(key) || key === "searchTerm") return;
      urlFilters[key] = value.split(",").filter(Boolean);
    });

    // Only sync if this is initial mount or genuine external change
    if (isInitialMount.current) {
      dispatch(setDiscoverFilters(urlFilters));
      dispatch(setSearchTerm(urlSearchTerm));
      setSearchValue(urlSearchTerm);
      isInitialMount.current = false;
    } else {
      // For browser back/forward, check if actually different
      const filtersChanged =
        JSON.stringify(urlFilters) !== JSON.stringify(filter);
      const searchChanged = urlSearchTerm !== searchTerm;

      if (filtersChanged) {
        dispatch(setDiscoverFilters(urlFilters));
      }
      if (searchChanged) {
        dispatch(setSearchTerm(urlSearchTerm));
        setSearchValue(urlSearchTerm);
      }
    }
  }, [searchParams, dispatch, filter, searchTerm]);

  // ======================
  // Helpers
  // ======================
  const mapOptions = useCallback(
    (items = [], labelKey = "name", valueKey = "_id") =>
      items.map((item) => ({
        label: item[labelKey] || "",
        value: item[valueKey] || "",
      })),
    []
  );

  // ======================
  // Handlers
  // ======================
  const handleFilterChange = useCallback(
    (key) => (value) => {
      const values = Array.isArray(value) ? value : [value];

      // Build new filters object
      const newFilters = { ...filter };

      if (values.length > 0) {
        newFilters[key] = values;
      } else {
        delete newFilters[key];
      }

      // Update Redux first
      dispatch(setDiscoverFilters(newFilters));
      dispatch(setCurrentPage(1));

      // Then update URL
      updateUrl(newFilters, searchTerm);
    },
    [filter, searchTerm, dispatch, updateUrl]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const trimmedValue = searchValue.trim();

    // Update Redux
    dispatch(setSearchTerm(trimmedValue));
    dispatch(setCurrentPage(1));

    // Update URL
    updateUrl(filter, trimmedValue);
  }, [searchValue, filter, dispatch, updateUrl]);

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    dispatch(setSearchTerm(""));
    dispatch(setCurrentPage(1));
    updateUrl(filter, "");
  }, [filter, dispatch, updateUrl]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    dispatch(setDiscoverFilters({}));
    dispatch(setSearchTerm(""));
    dispatch(setCurrentPage(1));

    skipNextUrlSync.current = true;
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
        value: filter?.cities || [],
        multiple: true,
        onChange: handleFilterChange("cities"),
      },
      {
        label: t("discover.sideFilters.typeOfExperience"),
        key: "categories",
        options: mapOptions(categories),
        value: filter?.categories || [],
        multiple: true,
        onChange: handleFilterChange("categories"),
      },
      {
        label: t("discover.sideFilters.typeOfTrips"),
        key: "tripsTypes",
        options: mapOptions(tripsTypes, "label", "value"),
        value: filter?.tripsTypes || [],
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
    ].filter((f) => f.options.length > 0);
  }, [sideFilters, filter, t, mapOptions, handleFilterChange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filter || {}).length > 0 || searchTerm;
  }, [filter, searchTerm]);

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
          {hasActiveFilters && (
            <span className="ml-2 text-sm text-gray-500">
              (
              {Object.values(filter || {}).flat().length + (searchTerm ? 1 : 0)}{" "}
              active)
            </span>
          )}
        </Grid>

        <Grid item md={3} xs={12} className="flex items-center gap-2">
          <TextField
            size="small"
            className="flex-1"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder={t("links.search")}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      className="!me-2"
                      onClick={handleSearchSubmit}
                      edge="start"
                      aria-label="search"
                    >
                      {searchBarIcon}
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClear}
                      edge="end"
                      size="small"
                      aria-label="clear search"
                    >
                      {wrongIcon}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
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
