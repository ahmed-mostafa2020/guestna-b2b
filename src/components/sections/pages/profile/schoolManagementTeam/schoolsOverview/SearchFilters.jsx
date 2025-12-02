"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Collapse,
  MenuItem,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useFetchData } from "@/src/hooks/useFetchData";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useTranslations } from "next-intl";

const SearchFilters = ({ searchTerms, onChange, sortOptions = [] }) => {
  const [open, setOpen] = useState(false);

  const t = useTranslations();

  const { data } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.CITIES_TRACKS}`,
    {},
    {}
  );

  const cities = data?.cities || [];
  const tracks = data?.tracks || [];

  console.log("Cities fetched:", cities);
  console.log("Tracks fetched:", tracks);

  const handleFieldChange = (key, value) => {
    onChange({ ...searchTerms, [key]: value });
  };

  // Convert objects → autocomplete format

  const formattedCities = cities.map((city) => {
    return { label: city.name, value: city._id };
  });
  const formattedTracks = tracks.map((track) => {
    return {
      label: `${track.educationSystem} - ${t(
        `schoolRegister.form.gender.options.${
          track.gender == "MALE"
            ? "boys"
            : track.gender == "FEMALE"
            ? "girls"
            : "both"
        }`
      )} - (${track.academicStages
        .map((item) => item.name)
        .reduce((acc, curr) => `${acc},${curr}`)})  `,
      value: track._id,
    };
  });

  return (
    <Box className="w-full">
      {/* Mobile Toggle */}
      <Box className="flex items-center justify-between md:hidden mb-3">
        <span className="font-medium text-gray-700 text-lg">
          البحث والتصفية
        </span>
        <IconButton onClick={() => setOpen(!open)}>
          <TuneIcon />
        </IconButton>
      </Box>

      {/* Mobile section */}
      <Collapse in={open} className="md:hidden">
        <Box className="flex flex-col gap-3">
          {/* SEARCH */}
          <TextField
            label={t(
              "profile.schools_overview.searchFilters.searchPlaceholder"
            )}
            variant="outlined"
            size="small"
            value={searchTerms.search}
            onChange={(e) => handleFieldChange("search", e.target.value)}
            fullWidth
          />

          {/* CITY */}
          <Autocomplete
            options={formattedCities}
            value={
              formattedCities.find((c) => c.value === searchTerms.city) || null
            }
            onChange={(_, v) => handleFieldChange("city", v?.value ?? "")}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label={t("profile.schools_overview.searchFilters.city")}
              />
            )}
          />

          {/* TRACK */}
          <Autocomplete
            options={formattedTracks}
            value={
              formattedTracks.find((t) => t.value === searchTerms.track) || null
            }
            onChange={(_, v) => handleFieldChange("track", v?.value ?? "")}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label={t("profile.schools_overview.searchFilters.track")}
              />
            )}
          />

          {/* SORT */}
          <TextField
            size="small"
            select
            label={t("profile.schools_overview.searchFilters.sortingBy")}
            value={searchTerms.sort}
            onChange={(e) => handleFieldChange("sort", e.target.value)}
          >
            {sortOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>

      {/* Desktop layout */}
      <Box className="hidden md:grid grid-cols-4 gap-4">
        <TextField
          label={t("profile.schools_overview.searchFilters.searchPlaceholder")}
          variant="outlined"
          size="small"
          value={searchTerms.search}
          onChange={(e) => handleFieldChange("search", e.target.value)}
        />

        {/* CITY */}
        <Autocomplete
          options={formattedCities}
          value={
            formattedCities.find((c) => c.value === searchTerms.city) || null
          }
          onChange={(_, v) => handleFieldChange("city", v?.value ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label={t("profile.schools_overview.searchFilters.city")}
            />
          )}
        />

        {/* TRACK */}
        <Autocomplete
          options={formattedTracks}
          value={
            formattedTracks.find((t) => t.value === searchTerms.track) || null
          }
          onChange={(_, v) => handleFieldChange("track", v?.value ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label={t("profile.schools_overview.searchFilters.track")}
            />
          )}
        />

        {/* SORT */}
        <TextField
          size="small"
          select
          label={t("profile.schools_overview.searchFilters.sortingBy")}
          value={searchTerms.sort}
          onChange={(e) => handleFieldChange("sort", e.target.value)}
        >
          {sortOptions.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export default SearchFilters;
