"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Collapse,
  MenuItem,
  Skeleton,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useLocale, useTranslations } from "next-intl";
const sortOptions = ["HIGHEST_NAME", "LOWEST_NAME", "NEWEST", "OLDEST"];

const SearchFilters = ({ searchTerms, onChange , isLoading }) => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();

  const { data , isLoading: staticsLoading , error } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.CITIES_TRACKS}`,
    {},
    { lang: locale }
  );

  const cities = data?.cities || [];
  const tracks = data?.tracks || [];

  const handleFieldChange = (key, value) => {
    onChange({ ...searchTerms, [key]: value });
  };

  // Convert objects → autocomplete format

  const formattedCities = useMemo(
    () =>
      cities.map((city) => ({
        label: city.name,
        value: city._id,
      })),
    [cities]
  );

  const formattedTracks = useMemo(
    () =>
      (tracks ?? []).map((track) => ({
        label: `${track.educationSystem} - ${t(
          `schoolRegister.form.gender.options.${
            track.gender === "MALE"
              ? "boys"
              : track.gender === "FEMALE"
              ? "girls"
              : "both"
          }`
        )} - (${track.academicStages.map((x) => x.name).join(", ")})`,
        value: track._id,
      })),
    [tracks, t]
  );

  const formattedSortOptions = useMemo(
    () =>
      sortOptions.map((sort) => ({
        label: t(`profile.schools_overview.searchFilters.sort_options.${sort}`),
        value: sort,
      })),
    [t]
  );



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
          {isLoading && staticsLoading ? (
            <>
              <Skeleton variant="rounded" width={100} height={28} />
              <Skeleton variant="rounded" width={100} height={28} />
              <Skeleton variant="rounded" width={100} height={28} />
            </>
          ) : (
            <>
              <Autocomplete
                className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
                slotProps={{
                  listbox: {
                    className: "!font-somar",
                  },
                }}
                options={formattedCities}
                value={
                  formattedCities.find((c) => c.value === searchTerms.city) ||
                  null
                }
                onChange={(_, v) =>
                  handleFieldChange("city", v?.value ?? undefined)
                }
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
                    placeholder={t(
                      "profile.schools_overview.searchFilters.city"
                    )}
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
                  formattedTracks.find((t) => t.value === searchTerms.track) ||
                  null
                }
                onChange={(_, v) =>
                  handleFieldChange("track", v?.value ?? undefined)
                }
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
                    placeholder={t(
                      "profile.schools_overview.searchFilters.track"
                    )}
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
                  formattedSortOptions.find(
                    (t) => t.value === searchTerms.sort
                  ) || null
                }
                onChange={(_, v) =>
                  handleFieldChange("sort", v?.value ?? undefined)
                }
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
            </>
          )}
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

        {(isLoading && staticsLoading) ? (
          <>
            <Skeleton variant="rounded" width={300} height={55} />
            <Skeleton variant="rounded" width={300} height={55} />
            <Skeleton variant="rounded" width={300} height={55} />
          </>
        ) : (
          <>
            <Autocomplete
              className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
              slotProps={{
                listbox: {
                  className: "!font-somar",
                },
              }}
              options={formattedCities}
              value={
                formattedCities.find((c) => c.value === searchTerms.city) ||
                null
              }
              onChange={(_, v) =>
                handleFieldChange("city", v?.value ?? undefined)
              }
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
                formattedTracks.find((t) => t.value === searchTerms.track) ||
                null
              }
              onChange={(_, v) =>
                handleFieldChange("track", v?.value ?? undefined)
              }
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
                  placeholder={t(
                    "profile.schools_overview.searchFilters.track"
                  )}
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
                formattedSortOptions.find(
                  (t) => t.value === searchTerms.sort
                ) || null
              }
              onChange={(_, v) =>
                handleFieldChange("sort", v?.value ?? undefined)
              }
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchFilters;
