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

const SearchFilters = ({
  searchTerms,
  onChange,
  // cities = [],
  // tracks = [],
  sortOptions = [],
}) => {
  const [open, setOpen] = useState(false);

  const handleFieldChange = (key, value) => {
    onChange({ ...searchTerms, [key]: value });
  };

  return (
    <Box className="w-full">
      {/* Mobile Toggle */}
      <Box className="flex items-center justify-between md:hidden mb-3">
        <span className="font-medium text-gray-700 text-lg">Filters</span>
        <IconButton onClick={() => setOpen(!open)}>
          <TuneIcon />
        </IconButton>
      </Box>

      {/* Collapsable on mobile, always visible on md+ */}
      <Collapse in={open} className="md:hidden">
        <Box className="flex flex-col gap-3">
          {/* SEARCH */}
          <TextField
            label="Search by name"
            variant="outlined"
            size="small"
            value={searchTerms.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            fullWidth
          />

          {/* CITY */}
          {/* <Autocomplete
            options={cities}
            value={searchTerms.city}
            onChange={(_, v) => handleFieldChange("city", v)}
            getOptionLabel={(opt) => opt?.label ?? ""}
            renderInput={(params) => (
              <TextField {...params} size="small" label="City" />
            )}
          /> */}

          {/* TRACK */}
          {/* <Autocomplete
            options={tracks}
            value={searchTerms.track}
            onChange={(_, v) => handleFieldChange("track", v?.value ?? "")}
            getOptionLabel={(opt) => opt?.label ?? ""}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Track" />
            )}
          /> */}

          {/* SORT */}
          <TextField
            size="small"
            select
            label="Sort By"
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

      {/* DESKTOP LAYOUT */}
      <Box className="hidden md:grid grid-cols-4 gap-4">
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={searchTerms.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />

        {/* <Autocomplete
          options={cities}
          value={searchTerms.city}
          onChange={(_, v) => handleFieldChange("city", v)}
          getOptionLabel={(opt) => opt?.label ?? ""}
          renderInput={(params) => (
            <TextField {...params} size="small" label="City" />
          )}
        />

        <Autocomplete
          options={tracks}
          value={
            tracks.find((item) => item.value === searchTerms.track) || null
          }
          onChange={(_, v) => handleFieldChange("track", v?.value ?? "")}
          getOptionLabel={(opt) => opt?.label ?? ""}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Track" />
          )}
        /> */}

        <TextField
          size="small"
          select
          label="Sort By"
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
