"use client";

import { useMemo, useState, memo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarToday } from "@mui/icons-material";

const AvailableDatePicker = ({
  id = "day",
  name = "day",
  value = "",
  onChange,
  onBlur,
  availableDays = [],
  error,
  touched,
  label,
  required = false,
  disabled = false,
  locale = "ar",
  placeholder = "DD/MM/YYYY",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortedDays = useMemo(() => {
    return Array.isArray(availableDays) ? [...availableDays].sort() : [];
  }, [availableDays]);

  const minDate = useMemo(() => {
    if (sortedDays.length === 0) return undefined;
    const d = dayjs(sortedDays[0]);
    return d.isValid() ? d : undefined;
  }, [sortedDays]);

  const maxDate = useMemo(() => {
    if (sortedDays.length === 0) return undefined;
    const d = dayjs(sortedDays[sortedDays.length - 1]);
    return d.isValid() ? d : undefined;
  }, [sortedDays]);

  const shouldDisableDate = (dayjsDate) => {
    if (sortedDays.length === 0) return false;
    const dateStr = dayjsDate.format("YYYY-MM-DD");
    return !sortedDays.includes(dateStr);
  };

  const dayjsValue = useMemo(() => {
    if (!value) return null;
    const cleanDateStr =
      typeof value === "string" ? value.split(/[T\s]/)[0] : value;
    const parsed = dayjs(cleanDateStr);
    return parsed.isValid() ? parsed : null;
  }, [value]);

  const handleDateChange = (newDate) => {
    if (!newDate || !newDate.isValid()) {
      if (onChange) onChange("");
      setIsOpen(false);
      return;
    }
    const dateStr = newDate.format("YYYY-MM-DD");
    if (sortedDays.length > 0 && !sortedDays.includes(dateStr)) {
      return;
    }
    if (onChange) onChange(dateStr);
    setIsOpen(false);
  };

  const isRtl = locale === "ar";
  const hasError = Boolean(touched && error);

  return (
    <div
      className={`relative w-full min-w-0 flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out ${className}`}
    >
      {label && (
        <label htmlFor={id} className="font-medium capitalize font-somar">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={locale === "ar" ? "ar" : "en"}
        >
          <div dir={isRtl ? "rtl" : "ltr"} className="w-full">
            <DatePicker
              open={isOpen}
              onOpen={() => {
                if (!disabled) setIsOpen(true);
              }}
              onClose={() => setIsOpen(false)}
              value={dayjsValue}
              onChange={handleDateChange}
              shouldDisableDate={shouldDisableDate}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              format="DD/MM/YYYY"
              enableAccessibleFieldDOMStructure={false}
              slots={{
                openPickerIcon: () => (
                  <CalendarToday
                    className="text-textLight"
                    style={{ fontSize: "20px" }}
                  />
                ),
              }}
              slotProps={{
                textField: {
                  id: id,
                  name: name,
                  fullWidth: true,
                  size: "small",
                  onBlur: onBlur,
                  onClick: (e) => {
                    if (disabled) return;
                    if (e.target.closest("button")) return;
                    setIsOpen(true);
                  },
                  inputProps: {
                    readOnly: true,
                    style: { cursor: disabled ? "not-allowed" : "pointer" },
                  },
                  error: hasError,
                  placeholder: placeholder,
                  sx: {
                    cursor: disabled ? "not-allowed" : "pointer",
                    "& .MuiOutlinedInput-root": {
                      fontFamily: "var(--font-somar-sans), sans-serif",
                      fontSize: "0.875rem",
                      backgroundColor: "#ffffff",
                      borderRadius: "0.5rem",
                      minHeight: "56px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      border: "2px solid",
                      borderColor: hasError
                        ? "var(--color-error, #f44336)"
                        : "var(--color-border, #E2E6EE)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: hasError
                          ? "var(--color-error, #f44336)"
                          : "var(--color-main, #3F6EB5)",
                      },
                      "&.Mui-focused": {
                        borderColor: hasError
                          ? "var(--color-error, #f44336)"
                          : "var(--color-main, #3F6EB5)",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "& .MuiInputBase-input": {
                        padding: "16px",
                        fontFamily: "var(--font-somar-sans), sans-serif",
                        cursor: disabled ? "not-allowed" : "pointer",
                      },
                    },
                  },
                },
                popper: {
                  sx: {
                    zIndex: 1400,
                    "& .MuiPaper-root": {
                      borderRadius: "0.75rem",
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      fontFamily: "var(--font-somar-sans), sans-serif",
                    },
                    "& .MuiPickersDay-root": {
                      fontFamily: "var(--font-somar-sans), sans-serif",
                      "&.Mui-selected": {
                        backgroundColor: "var(--color-main, #3F6EB5) !important",
                        color: "#ffffff !important",
                      },
                      "&.Mui-disabled": {
                        color: "#bdbdbd !important",
                        opacity: 0.35,
                      },
                    },
                    "& .MuiPickersArrowSwitcher-root": {
                      direction: "ltr !important",
                    },
                  },
                },
              }}
            />
          </div>
        </LocalizationProvider>
      </div>

      {hasError && (
        <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-somar text-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default memo(AvailableDatePicker);
