import { memo, useState } from "react";

import { cn } from "@utils/helpers/cn";

import { uploadFileIcon } from "@assets/svg";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const TextInputGroup = memo(
  ({
    label,
    type,
    name,
    value,
    errors,
    touched,
    onChange,
    onBlur,
    onKeyDown,
    onPaste,
    placeholder,
    textarea = false,
    uploadFile = false,
    onFileChange,
    rows = 3,
    minLength,
    maxLength,
    textAlign,
    border = true,
    inputMode,
    autoFocus,
    nationalIdImageError,
    imageError,
    readOnly = false,
    style,
    onClick,
    min,
    max,
    required = false,

    labelFontFamily = "IBM Plex Sans Arabic, sans-serif",
    labelClassName = "",
    inputClassName = "",
    borderClassName = "",
    className = "",
    containerClassName = "",
    endAdornment = null,
    startAdornment = null,
    endAdornmentClassName = "",
    startAdornmentClassName = "",
    hideErrorMessage = false,
    errorClassName = "",
    id,
    autoComplete,
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const [selectedFileName, setSelectedFileName] = useState("");
    const [fileError, setFileError] = useState("");

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const effectiveFontFamily =
      labelFontFamily === "IBM Plex Sans Arabic, sans-serif" &&
      labelClassName?.includes("font-somar")
        ? "var(--font-somar-sans), sans-serif"
        : labelFontFamily;

    return (
      <div
        className={cn(
          "relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out",
          containerClassName || className
        )}
      >
        {label && (
          <label
            htmlFor={id || name}
            className={cn(
              "font-medium capitalize",
              labelClassName ? labelClassName : "font-ibm",
              readOnly && "text-textLight"
            )}
            style={{ fontFamily: effectiveFontFamily && effectiveFontFamily }}
          >
            {label}
            {required && <span className="text-error">{"*"}</span>}
          </label>
        )}

        <div className="relative">
          {textarea ? (
            <textarea
              className={cn(
                "text-sm resize-none font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full rounded-lg outline-none placeholder:font-normal placeholder:text-base placeholder:text-textLight selection:bg-buttonsHover",
                readOnly && "cursor-not-allowed opacity-50",
                textAlign && `text-${textAlign}`,
                border && (borderClassName ? borderClassName : "border-2"),
                touched && errors && border
                  ? "border-error focus:border-error hover:border-error"
                  : borderClassName
                  ? borderClassName
                  : "border-border focus:border-mainColor hover:border-mainColor",
                inputClassName
              )}
              style={{
                fontFamily: "inherit",
              }}
              id={id || name}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onPaste={onPaste}
              minLength={minLength}
              maxLength={maxLength}
              rows={rows}
              placeholder={placeholder}
              readOnly={readOnly}
            />
          ) : (
            <input
              className={cn(
                "text-sm font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full rounded-lg outline-none placeholder:font-normal placeholder:text-sm placeholder:text-textLight selection:bg-buttonsHover",
                readOnly && "cursor-not-allowed opacity-90",
                textAlign && `text-${textAlign}`,
                border && (borderClassName ? borderClassName : "border-2"),
                touched && errors && border
                  ? "border-error focus:border-error hover:border-error"
                  : borderClassName
                  ? borderClassName
                  : "border-border focus:border-mainColor hover:border-mainColor",
                (type === "date" || type === "time") && "cursor-pointer pe-12",
                endAdornment && "pe-12",
                startAdornment && "ps-12",
                type === "number" &&
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                inputClassName
              )}
              style={{
                fontFamily: "inherit",
                ...style,
              }}
              type={type === "password" && showPassword ? "text" : type}
              inputMode={
                inputMode
                  ? inputMode
                  : type === "date" || type === "time"
                  ? undefined
                  : type
              }
              id={id || name}
              name={name}
              value={value}
              error={errors?.toString()}
              touched={touched ? "true" : "false"}
              onChange={onChange}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onClick={(e) => {
                if ((type === "date" || type === "time") && e.target.showPicker) {
                  try {
                    e.target.showPicker();
                  } catch (err) {
                    console.error("Failed to show picker:", err);
                  }
                }
                if (onClick) onClick(e);
              }}
              placeholder={placeholder}
              autoComplete={
                autoComplete
                  ? autoComplete
                  : name === "cardholderName"
                  ? "new-password"
                  : "false"
              }
              autoFocus={autoFocus}
              spellCheck={name === "cardholderName" ? "false" : "true"}
              data-card-element={name === "cardholderName" ? "true" : "false"}
              maxLength={maxLength}
              minLength={minLength}
              min={min}
              max={max}
              readOnly={readOnly}
            />
          )}

          {startAdornment && (
            <div
              className={cn(
                "absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3.5",
                startAdornmentClassName
              )}
            >
              {startAdornment}
            </div>
          )}

          {endAdornment && (
            <div
              className={cn(
                "absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3.5",
                endAdornmentClassName
              )}
            >
              {endAdornment}
            </div>
          )}

          {type === "date" && !endAdornment && (
            <div className="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-4">
              <CalendarTodayIcon className="text-textLight" style={{ fontSize: "20px" }} />
            </div>
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

          {uploadFile && (
            <>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id={`${name}-upload`}
                onChange={(e) => {
                  setFileError("");
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    if (
                      file.type === "image/svg+xml" ||
                      file.name.toLowerCase().endsWith(".svg")
                    ) {
                      setFileError(t("forms.validation.svg"));
                      setSelectedFileName("");
                      if (onFileChange) onFileChange({ target: { files: [] } });
                      return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      // 2 MB in bytes
                      setFileError("Maximum allowed file size is 2 MB");
                      setSelectedFileName("");
                      if (onFileChange) onFileChange({ target: { files: [] } });
                      return;
                    }
                    setSelectedFileName(file.name);
                    if (onFileChange) onFileChange(e);
                  }
                }}
              />
              <label
                htmlFor={`${name}-upload`}
                className="absolute inset-y-0 flex items-center cursor-pointer end-0 pe-4"
              >
                {uploadFileIcon}
              </label>
              {selectedFileName && (
                <span
                  title={selectedFileName}
                  className="absolute flex w-full text-xs text-green-600 transition-all duration-200 ease-in-out -bottom-6"
                >
                  ✅{" "}
                  {selectedFileName.length > 40
                    ? `${selectedFileName.substring(0, 40)}...`
                    : selectedFileName}{" "}
                  uploaded
                </span>
              )}
              {fileError && (
                <span className="absolute flex w-full text-xs transition-all duration-200 ease-in-out text-error -bottom-6">
                  {fileError}
                </span>
              )}
              {!fileError && (nationalIdImageError || imageError) && (
                <span className="absolute flex w-full text-xs transition-all duration-200 ease-in-out text-error -bottom-6">
                  {nationalIdImageError || imageError}
                </span>
              )}
            </>
          )}
        </div>

        {!hideErrorMessage && touched && errors && (
          <div
            className={cn(
              "absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error",
              errorClassName
            )}
          >
            {typeof errors === "string" ? errors : errors?.message || ""}
          </div>
        )}
      </div>
    );
  }
);

TextInputGroup.displayName = "TextInputGroup";

export default TextInputGroup;
