import { Autocomplete, TextField, Checkbox, Chip, Box } from "@mui/material";
import React from "react";

const FilterAutoComplete = ({
  label,
  options,
  value = [],
  onChange,
  multiple = false,
}) => {
  const resolvedValue = multiple
    ? options.filter((o) => value.includes(o.value))
    : options.find((o) => o.value === value?.[0]) || null;

  return (
    <Autocomplete
      multiple={multiple}
      disableCloseOnSelect={multiple}
      disableClearable={multiple}
      options={options}
      value={resolvedValue}
      className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
      slotProps={{
        listbox: {
          className: "!font-somar",
        },
      }}
      onChange={(_, selected) => {
        if (multiple) {
          onChange(selected.map((v) => v.value));
        } else {
          onChange(selected ? [selected.value] : []);
        }
      }}
      /* ✅ CUSTOM SELECTED VALUES UI */
      renderTags={(selected, getTagProps) => (
        <Box className="flex flex-wrap gap-1">
          {selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              size="small"
              className="
                !bg-gray-200
                !text-mainColor
                !font-somar
                !p-2
              "
            />
          ))}
        </Box>
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {multiple && (
            <Checkbox
              checked={selected}
              className="!text-mainColor"
              size="small"
            />
          )}
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder={label}
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
  );
};

export default FilterAutoComplete;
