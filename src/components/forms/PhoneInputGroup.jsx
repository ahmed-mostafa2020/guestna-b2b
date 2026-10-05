"use client";

import { memo } from "react";
import { Field } from "formik";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { cn } from "@utils/helpers/cn";

const FlagIcon = ({ country }) => (
  <span className="text-[1.2em] me-2" aria-hidden="true">
    {getUnicodeFlagIcon(country)}
  </span>
);

/**
 * Formik-bound international phone input with label + error message.
 * Visually matches TextInputGroup / SelectionGroup (55px height, 2px border).
 */
const PhoneInputGroup = ({
  name,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  defaultCountry = "SA",
  className = "",
}) => {
  const hasError = Boolean(error && touched);
  const errorId = `${name}-error`;

  return (
    <div className={cn("relative w-full min-w-0 flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={name} className="font-medium capitalize font-somar">
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}

      <Field name={name}>
        {({ field }) => (
          <PhoneInputWithCountrySelect
            {...field}
            id={name}
            international
            defaultCountry={defaultCountry}
            addInternationalOption={false}
            value={value}
            onChange={(newValue) => onChange(name, newValue || "")}
            onBlur={onBlur}
            disabled={disabled}
            dir="ltr"
            style={{ direction: "ltr" }}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            flagComponent={FlagIcon}
            className={cn(
              "flex items-center bg-white w-full gap-1 px-4 h-[55px] font-normal font-somar text-base border-2 rounded-lg transition-all duration-200 ease-in-out",
              "focus-within:ring-2 focus-within:ring-offset-2",
              disabled && "cursor-not-allowed opacity-60 bg-gray-50",
              hasError
                ? "border-error focus-within:ring-error"
                : "border-border hover:border-mainColor focus-within:ring-mainColor"
            )}
          />
        )}
      </Field>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-somar text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default memo(PhoneInputGroup);
