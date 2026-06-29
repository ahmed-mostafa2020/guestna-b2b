import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";

const AutocompleteInputGroup = ({
  label,
  labelFontFamily = "IBM Plex Sans Arabic, sans-serif",
  name,
  value,
  inputValue,
  onChange,
  onInputChange,
  options = [],
  getOptionLabel,
  renderOption,
  filterOptions,
  loading = false,
  disabled = false,
  freeSolo = false,
  placeholder = "",
  required = false,
  errors,
  touched,
  noOptionsText,
  loadingText,
}) => {
  const t = useTranslations("common.autocomplete");
  const hasError = touched && !!errors;

  return (
    <div className="relative flex flex-col gap-2">
      {/* Label */}
      <div className="flex items-center gap-0.5">
        <label
          className="font-medium capitalize font-ibm"
          style={{ fontFamily: labelFontFamily }}
        >
          {label}
        </label>
        {required && <span className="text-error">*</span>}
      </div>

      {/* Autocomplete Field */}
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        loading={loading}
        value={value}
        onChange={onChange}
        inputValue={inputValue}
        onInputChange={onInputChange}
        freeSolo={freeSolo}
        disabled={disabled}
        {...(filterOptions ? { filterOptions } : {})}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            placeholder={placeholder}
            error={hasError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "var(--font-somar-sans), sans-serif",
                fontSize: "0.875rem",
                fontWeight: 400,
                height: "55px",
                borderRadius: "0.5rem",
                backgroundColor: "white",
                border: "2px solid",
                borderColor: hasError
                  ? "var(--color-error)"
                  : "var(--color-border)",
                "& fieldset": {
                  borderColor: hasError
                    ? "var(--color-error)"
                    : "var(--color-border)",
                  borderWidth: "2px",
                },
                "&:hover": {
                  borderColor: hasError
                    ? "var(--color-error)"
                    : "var(--color-main)",
                },
                "&:hover fieldset": {
                  borderColor: hasError
                    ? "var(--color-error)"
                    : "var(--color-main)",
                },
                "&.Mui-focused": {
                  borderColor: hasError
                    ? "var(--color-error)"
                    : "var(--color-main)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: hasError
                    ? "var(--color-error)"
                    : "var(--color-main)",
                },
                "&.Mui-disabled": {
                  opacity: 0.9,
                  cursor: "not-allowed",
                },
              },
              "& .MuiInputBase-input": {
                fontFamily: "var(--font-somar-sans), sans-serif",
                fontSize: "0.875rem",
                fontWeight: 400,
                padding: "0 !important",
              },
              "& .MuiInputBase-input::placeholder": {
                fontFamily: "var(--font-somar-sans), sans-serif",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "var(--color-text-light)",
                opacity: 1,
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "inherit",
                opacity: 0.9,
              },
            }}
          />
        )}
        renderOption={renderOption}
        noOptionsText={noOptionsText || t("noOptions")}
        loadingText={
          loading ? <CircularProgress size={20} /> : loadingText || t("loading")
        }
      />

      {/* Error Message */}
      {hasError && (
        <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
          {errors}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInputGroup;
