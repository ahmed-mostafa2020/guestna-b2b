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
import { useLocale, useTranslations } from "next-intl";
const sortOptions = ["HIGHEST_NAME", "LOWEST_NAME", "NEWEST", "OLDEST"];

const SearchFilters = ({ searchTerms, onChange }) => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();

  const { data } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.CITIES_TRACKS}`,
    {},
    { lang: locale }
  );

  const cities = data?.cities || [];
  const tracks = data?.tracks || [];

  console.log("Cities fetched:", cities);
  console.log("Tracks fetched:", tracks);

  const handleFieldChange = (key, value) => {
    console.log(key, value);
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

  const formattedSortOptions = sortOptions.map((sort) => ({
    label: t(`profile.schools_overview.searchFilters.sort_options.${sort}`),
    value: sort,
  }));

  return (
    <Box className="w-full">
      {/* Mobile Toggle */}
      <Box className="flex items-center justify-between md:hidden mb-3">
        <span className="font-medium text-gray-700 text-lg">
          {t("profile.schools_overview.searchFilters.title")}{" "}
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
            className="!border-2 rounded-md !border-solid !border-gray-200 !py-2"
            placeholder={t(
              "profile.schools_overview.searchFilters.searchPlaceholder"
            )}
            slotProps={{
              input: {
                classes: {
                  input: "!font-somar",
                },
              },
            }}
            variant="outlined"
            size="small"
            value={searchTerms.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />

          {/* CITY */}
          <Autocomplete
            className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
            slotProps={{
              listbox: {
                className: "!font-somar",
              },
            }}
            options={formattedCities}
            value={
              formattedCities.find((c) => c.value === searchTerms.city) || null
            }
            onChange={(_, v) => handleFieldChange("city", v?.value ?? "")}
            renderInput={(params) => (
              <TextField
                slotProps={{
                  input: {
                    ...params.InputProps,
                    classes: {
                      ...params.InputProps.classes,
                      input: "!font-somar",
                    },
                  },
                }}
                {...params}
                size="small"
                placeholder={t("profile.schools_overview.searchFilters.city")}
              />
            )}
          />

          {/* TRACK */}
          <Autocomplete
            options={formattedTracks}
            className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
            slotProps={{
              listbox: {
                className: "!font-somar",
              },
            }}
            value={
              formattedTracks.find((t) => t.value === searchTerms.track) || null
            }
            onChange={(_, v) => handleFieldChange("track", v?.value ?? "")}
            renderInput={(params) => (
              <TextField
                slotProps={{
                  input: {
                    ...params.InputProps,
                    classes: {
                      ...params.InputProps.classes,
                      input: "!font-somar",
                    },
                  },
                }}
                {...params}
                size="small"
                placeholder={t("profile.schools_overview.searchFilters.track")}
              />
            )}
          />

          {/* SORT */}

          <Autocomplete
            options={formattedSortOptions}
            className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
            slotProps={{
              listbox: {
                className: "!font-somar",
              },
            }}
            value={
              formattedSortOptions.find((t) => t.value === searchTerms.sort) ||
              null
            }
            onChange={(_, v) => handleFieldChange("sort", v?.value ?? "")}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder={t(
                  "profile.schools_overview.searchFilters.sortingBy"
                )}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    classes: {
                      ...params.InputProps.classes,
                      input: "!font-somar",
                    },
                  },
                }}
              />
            )}
          />
        </Box>
      </Collapse>

      {/* Desktop layout */}

      <span className="font-medium text-gray-700 text-lg hidden md:inline-block mb-3">
        {t("profile.schools_overview.searchFilters.title")}{" "}
      </span>
      <Box className="hidden md:grid grid-cols-4 gap-4">
        <TextField
          className="!border-2 rounded-md !border-solid !border-gray-200 !py-2"
          placeholder={t(
            "profile.schools_overview.searchFilters.searchPlaceholder"
          )}
          slotProps={{
            input: {
              classes: {
                input: "!font-somar",
              },
            },
          }}
          variant="outlined"
          size="small"
          value={searchTerms.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />

        {/* CITY */}
        <Autocomplete
          className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
          slotProps={{
            listbox: {
              className: "!font-somar",
            },
          }}
          options={formattedCities}
          value={
            formattedCities.find((c) => c.value === searchTerms.city) || null
          }
          onChange={(_, v) => handleFieldChange("city", v?.value ?? "")}
          renderInput={(params) => (
            <TextField
              slotProps={{
                input: {
                  ...params.InputProps,
                  classes: {
                    ...params.InputProps.classes,
                    input: "!font-somar",
                  },
                },
              }}
              {...params}
              size="small"
              placeholder={t("profile.schools_overview.searchFilters.city")}
            />
          )}
        />

        {/* TRACK */}
        <Autocomplete
          options={formattedTracks}
          className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
          slotProps={{
            listbox: {
              className: "!font-somar",
            },
          }}
          value={
            formattedTracks.find((t) => t.value === searchTerms.track) || null
          }
          onChange={(_, v) => handleFieldChange("track", v?.value ?? "")}
          renderInput={(params) => (
            <TextField
              slotProps={{
                input: {
                  ...params.InputProps,
                  classes: {
                    ...params.InputProps.classes,
                    input: "!font-somar",
                  },
                },
              }}
              {...params}
              size="small"
              placeholder={t("profile.schools_overview.searchFilters.track")}
            />
          )}
        />

        {/* SORT */}

        <Autocomplete
          options={formattedSortOptions}
          className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
          slotProps={{
            listbox: {
              className: "!font-somar",
            },
          }}
          value={
            formattedSortOptions.find((t) => t.value === searchTerms.sort) ||
            null
          }
          onChange={(_, v) => handleFieldChange("sort", v?.value ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              placeholder={t(
                "profile.schools_overview.searchFilters.sortingBy"
              )}
              slotProps={{
                input: {
                  ...params.InputProps,
                  classes: {
                    ...params.InputProps.classes,
                    input: "!font-somar",
                  },
                },
              }}
            />
          )}
        />

        {/* <TextField
          size="small"
          className="!border-2 rounded-md !border-solid !border-gray-200"
          select
          placeholder={t("profile.schools_overview.searchFilters.sortingBy")}
          value={searchTerms.sort}
          onChange={(e) => handleFieldChange("sort", e.target.value)}
        >
          {sortOptions.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField> */}
      </Box>
    </Box>
  );
};

export default SearchFilters;
