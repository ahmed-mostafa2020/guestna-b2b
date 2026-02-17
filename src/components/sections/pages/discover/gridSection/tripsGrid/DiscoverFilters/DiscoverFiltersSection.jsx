"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const isInitialMount = useRef(true);
  const skipNextUrlSync = useRef(false);

  // Keep a ref to latest filter/searchTerm to avoid stale closures
  const filterRef = useRef({});
  const searchTermRef = useRef("");

  const { sideFilters, loading } = useSelector(
    (state) => state.discoverSideFilters,
    shallowEqual
  );

  const { filter, searchTerm } = useSelector(
    (state) => state.discoverData,
    shallowEqual
  );

  // Keep refs in sync with Redux state
  filterRef.current = filter || {};
  searchTermRef.current = searchTerm || "";

  const [searchValue, setSearchValue] = useState(searchTerm || "");

  // ── URL Utilities ─────────────────────────────────────────────
  const buildUrl = useCallback(
    (filters, search) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        }
      });

      if (search?.trim()) {
        params.set("searchTerm", search.trim());
      }

      return params.toString() ? `${pathname}?${params.toString()}` : pathname;
    },
    [pathname]
  );

  const updateUrl = useCallback(
    (filters, search) => {
      skipNextUrlSync.current = true;
      router.replace(buildUrl(filters, search), { scroll: false });
    },
    [router, buildUrl]
  );

  // ── URL → Redux Sync ──────────────────────────────────────────
  useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }

    if (!searchParams) return;

    const urlFilters = {};
    const urlSearchTerm = searchParams.get("searchTerm") || "";

    searchParams.forEach((value, key) => {
      if (EXCLUDED_URL_PARAMS.includes(key) || key === "searchTerm") return;
      urlFilters[key] = value.split(",").filter(Boolean);
    });

    if (isInitialMount.current) {
      dispatch(setDiscoverFilters(urlFilters));
      dispatch(setSearchTerm(urlSearchTerm));
      setSearchValue(urlSearchTerm);
      isInitialMount.current = false;
      return;
    }

    // Browser back/forward only
    const filtersChanged =
      JSON.stringify(urlFilters) !== JSON.stringify(filterRef.current);
    const searchChanged = urlSearchTerm !== searchTermRef.current;

    if (filtersChanged) dispatch(setDiscoverFilters(urlFilters));
    if (searchChanged) {
      dispatch(setSearchTerm(urlSearchTerm));
      setSearchValue(urlSearchTerm);
    }
  }, [searchParams?.toString()]);

  // ── Helpers ───────────────────────────────────────────────────
  const mapOptions = useCallback(
    (items = [], labelKey = "name", valueKey = "_id") =>
      items.map((item) => ({
        label: item[labelKey] || "",
        value: item[valueKey] || "",
      })),
    []
  );

  // ── Handlers ──────────────────────────────────────────────────

  // Uses refs so it never goes stale — no need to recreate on every filter change
  const handleFilterChange = useCallback(
    (key) => (value) => {
      const values = Array.isArray(value) ? value : value ? [value] : [];

      // Read latest state from ref — avoids stale closure
      const newFilters = { ...filterRef.current };

      if (values.length > 0) {
        newFilters[key] = values;
      } else {
        delete newFilters[key];
      }

      dispatch(setDiscoverFilters(newFilters));
      dispatch(setCurrentPage(1));
      updateUrl(newFilters, searchTermRef.current);
    },
    [dispatch, updateUrl] // No filter/searchTerm dep — uses refs instead
  );

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    const trimmed = searchValue.trim();
    dispatch(setSearchTerm(trimmed));
    dispatch(setCurrentPage(1));
    updateUrl(filterRef.current, trimmed);
  }, [searchValue, dispatch, updateUrl]);

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
    updateUrl(filterRef.current, "");
  }, [dispatch, updateUrl]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    dispatch(setDiscoverFilters({}));
    dispatch(setSearchTerm(""));
    dispatch(setCurrentPage(1));
    skipNextUrlSync.current = true;
    router.replace(pathname, { scroll: false });
  }, [dispatch, pathname, router]);

  // ── Filter Config ─────────────────────────────────────────────
  // handleFilterChange is now stable (no filter dep), so this only
  // re-runs when sideFilters/filter/t actually change
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

  const activeFilterCount =
    Object.values(filter || {}).flat().length + (searchTerm ? 1 : 0);

  // ── Render ────────────────────────────────────────────────────
  return (
    <Box className="bg-white rounded-xl p-4 shadow-[0_0_4px_0_rgba(0,0,0,0.16)]">
      <Grid container alignItems="center" spacing={2}>
        <Grid item md={9} xs={12}>
          <span className="font-medium !text-titleColor text-lg">
            {t("forms.search.title")}
          </span>
          {activeFilterCount > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({activeFilterCount} active)
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
