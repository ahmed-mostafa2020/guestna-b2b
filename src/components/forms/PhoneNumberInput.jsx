"use client";

import { forwardRef, useState } from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";

import { normalizePhone } from "@utils/helpers/normalizePhone";

/**
 * Drop-in replacement for `react-phone-number-input` that cleans pasted numbers
 * (spaces, dashes, Arabic digits, "00" prefix, duplicated country code).
 */
const PhoneNumberInput = forwardRef(
  ({ onChange, onCountryChange, numberInputProps, ...props }, ref) => {
    const [country, setCountry] = useState(
      props.country || props.defaultCountry
    );

    const handleCountryChange = (next) => {
      setCountry(next);
      onCountryChange?.(next);
    };

    const handlePaste = (e) => {
      numberInputProps?.onPaste?.(e);
      if (e.defaultPrevented || props.disabled || props.readOnly) return;

      const text = e.clipboardData?.getData("text") || "";
      if (text.replace(/\D/g, "").length < 6) return;

      const cleaned = normalizePhone(text, props.country || country);
      if (!cleaned) return;

      e.preventDefault();
      onChange?.(cleaned);
    };

    return (
      <PhoneInputWithCountrySelect
        ref={ref}
        {...props}
        onChange={onChange}
        onCountryChange={handleCountryChange}
        numberInputProps={{ ...numberInputProps, onPaste: handlePaste }}
      />
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
