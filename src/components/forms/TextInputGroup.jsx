import { memo, useState } from "react";

import { cn } from "@utils/cn";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const TextInputGroup = memo(
  ({
    type = "text",
    label,
    name,
    inputMode,
    errors,
    touched,
    value,
    onChange,
    onBlur,
    border = true,
    placeholder = "",
    textAlign,
    maxLength,
    minLength,
    autoFocus = false,
    textarea = false,
    rows = 4,
    // labelFontFamily = "IBM Plex Sans Arabic, sans-serif",
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
        {label && (
          <label
            htmlFor={name}
            className="font-medium capitalize font-ibm"
            // style={{ fontFamily: labelFontFamily && labelFontFamily }}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {textarea ? (
            <textarea
              className={cn(
                "text-sm resize-none font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full  rounded-lg outline-none placeholder:font-normal placeholder:text-sm placeholder:font-ibm placeholder:text-textLight selection:bg-buttonsHover",
                textAlign && `text-${textAlign}`,
                border && "border-2",
                touched && errors && border
                  ? "border-error focus:border-error hover:border-error"
                  : "border-border focus:border-textDark hover:border-textDark"
              )}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              minLength={minLength}
              maxLength={maxLength}
              rows={rows}
            />
          ) : (
            <input
              className={cn(
                "text-sm font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full  rounded-lg outline-none placeholder:font-normal placeholder:text-sm placeholder:font-ibm placeholder:text-textLight selection:bg-buttonsHover",
                textAlign && `text-${textAlign}`,
                border && "border-2",
                touched && errors && border
                  ? "border-error focus:border-error hover:border-error"
                  : "border-border focus:border-textDark hover:border-textDark"
              )}
              type={type === "password" && showPassword ? "text" : type}
              inputMode={
                inputMode ? inputMode : type
                // name !== ("name" || "email" || "cardholderName" || "searchBar")
                //   ? "numeric"
                //   : type
              }
              name={name}
              value={value}
              error={errors?.toString()}
              touched={touched ? "true" : "false"}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              autoComplete={
                name === "cardholderName" ? "new-password" : "false"
              }
              autoFocus={autoFocus}
              spellCheck={name === "cardholderName" ? "false" : "true"}
              data-card-element={name === "cardholderName" ? "true" : "false"}
              // aria-autocomplete={name === "cardholderName" ? "none" : "list"}
              maxLength={maxLength}
              minLength={minLength}
            />
          )}

          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 flex items-center text-sm leading-5 outline-none end-0 pe-4"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          )}
        </div>

        {touched && errors && (
          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
            {errors}
          </div>
        )}
      </div>
    );
  }
);

TextInputGroup.displayName = "TextInputGroup";

export default TextInputGroup;
