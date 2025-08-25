import { memo, useState } from "react";

import { cn } from "@utils/cn";

import { uploadFileIcon } from "@assets/svg";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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

    // labelFontFamily = "IBM Plex Sans Arabic, sans-serif",
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const [selectedFileName, setSelectedFileName] = useState("");
    const [fileError, setFileError] = useState("");

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
                "text-sm resize-none font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full  rounded-lg outline-none placeholder:font-normal placeholder:text-base placeholder:text-textLight selection:bg-buttonsHover",
                textAlign && `text-${textAlign}`,
                border && "border-2",
                touched && errors && border
                  ? "border-error focus:border-error hover:border-error"
                  : "border-border focus:border-textDark hover:border-textDark"
              )}
              style={{ 
                fontFamily: 'inherit'
              }}
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              minLength={minLength}
              maxLength={maxLength}
              rows={rows}
              placeholder={placeholder}
              readOnly={readOnly}
            />
          ) : (
            <input
              className={cn(
                "text-sm font-normal font-ibm transition-all duration-200 ease-in-out p-4 bg-white w-full  rounded-lg outline-none placeholder:font-normal placeholder:text-sm placeholder:text-textLight selection:bg-buttonsHover",
                textAlign && `text-${textAlign}`,
                border && "border-2",
                touched && errors && border
                  ? "border-error focus:border-error hover:border-error"
                  : "border-border focus:border-textDark hover:border-textDark",
                type === 'date' && "cursor-pointer"
              )}
              style={{ 
                fontFamily: 'inherit',
                ...style
              }}
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
              onKeyDown={onKeyDown}
              onClick={onClick}
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
              min={min}
              max={max}
              readOnly={readOnly}
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
                      setFileError("SVG images are not allowed");
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
