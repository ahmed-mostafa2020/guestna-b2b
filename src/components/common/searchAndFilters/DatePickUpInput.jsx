import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const DatePickUpInput = ({ label, value, onChange }) => {
  let dayjsValue;

  if (value && value !== "") {
    const tempDate = dayjs(value);
    if (tempDate.isValid()) {
      dayjsValue = tempDate;
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={dayjsValue || null}
        onChange={onChange}
        enableAccessibleFieldDOMStructure={false}
        slots={{
          textField: TextField,
          openPickerIcon: () => (
            <CalendarToday fontSize="small" className="text-gray-400" />
          ),
        }}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            className:
              "!border-2 !border-solid !border-gray-200 !rounded-md !py-2 !font-somar",
            InputProps: {
              classes: {
                input: "!font-somar ",
              },
              placeholder: label,
            },
          },
          field: {
            clearable: true,
            onClear: () => onChange(""),
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickUpInput;
