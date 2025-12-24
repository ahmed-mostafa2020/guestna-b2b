import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const FilterAutoComplete = ({ label, options, value, onChange ,key }) => {
  return (
    <Autocomplete
      
      className="!border-2 rounded-md !border-solid !border-gray-200 py-2"
      slotProps={{
        listbox: {
          className: "!font-somar",
        },
      }}
      options={options}
      value={options.find((c) => c.value === value) || null}
      onChange={(_, v) => onChange(v?.value ?? undefined)}
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
          placeholder={label}
          name={key}
        />
      )}
    />
  );
};

export default FilterAutoComplete;
