import { useState, useEffect, memo } from "react";
import {
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { cn } from "@utils/helpers/cn";
import formatCurrency from "@utils/formatters/FormatCurrency";
import TextInputGroup from "@components/forms/TextInputGroup";
import DynamicFileUpload from "@components/forms/DynamicFileUpload";
import { getDynamicFormInitialValues } from "@utils/validators/dynamicFormSchema";

// ─── Image Lightbox ──────────────────────────────────────────────────────────
const ImageLightbox = ({ src, alt, onClose, t }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!src) return null;

  const handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActive(false);
    setTimeout(onClose, 250); // matches transition-all duration
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300 ease-in-out",
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center bg-zinc-900/90 border border-white/10 rounded-2xl p-3 shadow-2xl transition-all duration-300 ease-in-out transform",
          active ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label={t ? t("common.closeImagePreview") : "Close image preview"}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/95 transition-all border border-white/10 shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="w-full overflow-hidden rounded-xl bg-black/50 flex items-center justify-center aspect-video sm:aspect-auto sm:max-h-[70vh]">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[70vh] object-contain rounded-xl"
          />
        </div>
        {alt && (
          <div className="w-full mt-3 px-2 flex justify-between items-center text-white/90 font-somar font-medium text-sm sm:text-base">
            <span>{alt}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Small clickable image thumbnail ─────────────────────────────────────────
const OptionImage = ({ src, alt, t }) => {
  const [lightbox, setLightbox] = useState(null);

  if (!src) return null;
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setLightbox({ src, alt });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            e.preventDefault();
            setLightbox({ src, alt });
          }
        }}
        aria-label={t ? t("common.viewLargerImage") : "View larger image"}
        className="relative group flex-shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainColor rounded-lg"
      >
        <img
          src={src}
          alt={alt}
          className="w-10 h-10 rounded-lg object-cover border border-gray-200 transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-100 bg-black/40 rounded-lg transition-opacity duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </div>
      </div>
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
          t={t}
        />
      )}
    </>
  );
};

// ─── Price Badge ──────────────────────────────────────────────────────────────
const PriceBadge = ({ price }) => {
  if (!price) return null;
  return (
    <span className="flex items-center bg-mainColor/10 text-mainColor border border-mainColor/20 text-xs px-2 py-0.5 rounded-full font-ibm font-semibold whitespace-nowrap">
      + {formatCurrency(price)}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DynamicField = memo(
  ({
    input,
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    t,
    locale,
    name,
    id,
  }) => {
    const [cardLightbox, setCardLightbox] = useState(null);
    const fieldName = name || input.key;
    const inputId =
      id || `dynamic-field-${fieldName.replace(/[\[\]\.]/g, "-")}`;

    useEffect(() => {
      if (input.type !== "array") return;
      if (!value || !Array.isArray(value) || value.length === 0) {
        setFieldValue(fieldName, [
          getDynamicFormInitialValues(input.inputs || []),
        ]);
        setFieldValue("quantity", "1");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.type, fieldName]);

    // 1. Textarea
    if (input.type === "textarea") {
      return (
        <div className="md:col-span-2">
          <TextInputGroup
            label={input.title}
            textarea={true}
            name={fieldName}
            value={value}
            errors={error}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={input.placeholder}
            required={input.required}
            id={inputId}
            labelFontFamily="var(--font-somar-sans), sans-serif"
          />
        </div>
      );
    }

    // 2. Select (Dropdown)
    if (input.type === "select") {
      return (
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor={inputId}
            className="font-medium font-somar text-sm md:text-base text-gray-700"
            style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
          >
            {input.title}
            {input.required && (
              <span className="text-error ml-1 font-ibm">*</span>
            )}
          </label>
          <Select
            id={inputId}
            name={fieldName}
            value={value}
            multiple={input.isMultiple}
            onChange={handleChange}
            onBlur={handleBlur}
            displayEmpty
            renderValue={(selected) => {
              if (
                !selected ||
                (Array.isArray(selected) && selected.length === 0)
              ) {
                return (
                  <span className="text-gray-400 font-somar text-sm">
                    {input.placeholder || t("common.select")}
                  </span>
                );
              }
              if (Array.isArray(selected)) {
                return selected
                  .map(
                    (val) =>
                      input.options.find((o) => o.value === val)?.label || val
                  )
                  .join(", ");
              }
              return (
                input.options.find((o) => o.value === selected)?.label ||
                selected
              );
            }}
            sx={{
              border:
                touched && error
                  ? "2px solid #ef4444"
                  : "2px solid var(--color-border)",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-select": { padding: "12px 16px" },
            }}
          >
            {!input.isMultiple && (
              <MenuItem value="" disabled>
                {input.placeholder || t("common.select")}
              </MenuItem>
            )}
            {input.options?.map((opt) => (
              <MenuItem key={opt._id} value={opt.value}>
                <div className="flex items-center w-full justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {input.isMultiple && (
                      <Checkbox
                        checked={(value || []).indexOf(opt.value) > -1}
                        sx={{
                          "&.Mui-checked": {
                            color: "var(--color-main)",
                          },
                          padding: 0,
                          marginRight: "4px",
                        }}
                      />
                    )}
                    <OptionImage src={opt.src} alt={opt.label} t={t} />
                    <ListItemText
                      primary={opt.label}
                      primaryTypographyProps={{
                        style: {
                          fontFamily: "var(--font-somar-sans), sans-serif",
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  </div>
                  <PriceBadge price={opt.price} />
                </div>
              </MenuItem>
            ))}
          </Select>
          {touched && error && (
            <span className="text-xs text-error font-somar mt-1 absolute -bottom-5 start-0">
              {error}
            </span>
          )}
        </div>
      );
    }

    // 3. Radio Buttons
    if (input.type === "radio") {
      const hasImages = input.options?.some((opt) => opt.src);

      if (hasImages) {
        return (
          <div className="flex flex-col gap-3 md:col-span-2">
            <label
              className="font-medium font-somar text-sm md:text-base text-gray-700"
              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
            >
              {input.title}
              {input.required && (
                <span className="text-error ml-1 font-ibm">*</span>
              )}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {input.options?.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt._id}
                    onClick={() => {
                      setFieldValue(fieldName, opt.value);
                    }}
                    className={cn(
                      "group relative flex flex-col rounded-2xl border-2 p-3 bg-white cursor-pointer transition-all duration-300 ease-in-out select-none shadow-sm hover:shadow-md",
                      isSelected
                        ? "border-mainColor bg-mainColor/[0.02] ring-1 ring-mainColor"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {opt.src ? (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCardLightbox({ src: opt.src, alt: opt.label });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            e.preventDefault();
                            setCardLightbox({ src: opt.src, alt: opt.label });
                          }
                        }}
                        aria-label={
                          t ? t("common.viewLargerImage") : "View larger image"
                        }
                        title={
                          t ? t("common.viewLargerImage") : "View larger image"
                        }
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainColor"
                      >
                        <img
                          src={opt.src}
                          alt={opt.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white backdrop-blur-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] w-full flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                        <svg
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="flex items-start gap-2.5 mt-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        <Radio
                          checked={isSelected}
                          sx={{
                            padding: 0,
                            color: "var(--color-border)",
                            "&.Mui-checked": {
                              color: "var(--color-main)",
                            },
                          }}
                        />
                      </div>
                      <div className="flex-grow flex flex-col items-start gap-1">
                        <span className="font-somar font-medium text-sm md:text-base text-gray-800 text-start leading-tight">
                          {opt.label}
                        </span>
                        <PriceBadge price={opt.price} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {touched && error && (
              <span className="text-xs text-error font-somar">{error}</span>
            )}
            {cardLightbox && (
              <ImageLightbox
                src={cardLightbox.src}
                alt={cardLightbox.alt}
                onClose={() => setCardLightbox(null)}
                t={t}
              />
            )}
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            className="font-medium font-somar text-sm md:text-base text-gray-700"
            style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
          >
            {input.title}
            {input.required && (
              <span className="text-error ml-1 font-ibm">*</span>
            )}
          </label>
          <RadioGroup
            row
            id={inputId}
            name={fieldName}
            value={value}
            onChange={handleChange}
          >
            {input.options?.map((opt) => (
              <FormControlLabel
                key={opt._id}
                value={opt.value}
                control={
                  <Radio
                    sx={{
                      "&.Mui-checked": {
                        color: "var(--color-main)",
                      },
                    }}
                  />
                }
                label={
                  <span className="font-somar text-sm md:text-base flex items-center gap-2">
                    <OptionImage src={opt.src} alt={opt.label} t={t} />
                    {opt.label}
                    <PriceBadge price={opt.price} />
                  </span>
                }
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontFamily: "var(--font-somar-sans), sans-serif",
                  },
                }}
              />
            ))}
          </RadioGroup>
          {touched && error && (
            <span className="text-xs text-error font-somar">{error}</span>
          )}
        </div>
      );
    }

    // 4. Checkbox
    if (input.type === "checkbox") {
      const hasOptions = input.options && input.options.length > 0;
      const hasImages = hasOptions && input.options.some((opt) => opt.src);

      if (hasImages) {
        return (
          <div className="flex flex-col gap-3 md:col-span-2">
            <label
              className="font-medium font-somar text-sm md:text-base text-gray-700"
              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
            >
              {input.title}
              {input.required && (
                <span className="text-error ml-1 font-ibm">*</span>
              )}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {input.options.map((opt) => {
                const isChecked =
                  Array.isArray(value) && value.includes(opt.value);
                return (
                  <div
                    key={opt._id}
                    onClick={() => {
                      const nextVal = isChecked
                        ? (value || []).filter((v) => v !== opt.value)
                        : [...(value || []), opt.value];
                      setFieldValue(fieldName, nextVal);
                    }}
                    className={cn(
                      "group relative flex flex-col rounded-2xl border-2 p-3 bg-white cursor-pointer transition-all duration-300 ease-in-out select-none shadow-sm hover:shadow-md",
                      isChecked
                        ? "border-mainColor bg-mainColor/[0.02] ring-1 ring-mainColor"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {opt.src ? (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCardLightbox({ src: opt.src, alt: opt.label });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            e.preventDefault();
                            setCardLightbox({ src: opt.src, alt: opt.label });
                          }
                        }}
                        aria-label={
                          t ? t("common.viewLargerImage") : "View larger image"
                        }
                        title={
                          t ? t("common.viewLargerImage") : "View larger image"
                        }
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainColor"
                      >
                        <img
                          src={opt.src}
                          alt={opt.label}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white backdrop-blur-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] w-full flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                        <svg
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="flex items-start gap-2.5 mt-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        <Checkbox
                          checked={isChecked}
                          sx={{
                            padding: 0,
                            color: "var(--color-border)",
                            "&.Mui-checked": {
                              color: "var(--color-main)",
                            },
                          }}
                        />
                      </div>
                      <div className="flex-grow flex flex-col items-start gap-1">
                        <span className="font-somar font-medium text-sm md:text-base text-gray-800 text-start leading-tight">
                          {opt.label}
                        </span>
                        <PriceBadge price={opt.price} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {touched && error && (
              <span className="text-xs text-error font-somar">{error}</span>
            )}
            {cardLightbox && (
              <ImageLightbox
                src={cardLightbox.src}
                alt={cardLightbox.alt}
                onClose={() => setCardLightbox(null)}
                t={t}
              />
            )}
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            className="font-medium font-somar text-sm md:text-base text-gray-700"
            style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
          >
            {input.title}
            {input.required && (
              <span className="text-error ml-1 font-ibm">*</span>
            )}
          </label>
          {hasOptions ? (
            <div className="flex flex-wrap gap-4">
              {input.options.map((opt) => {
                const isChecked =
                  Array.isArray(value) && value.includes(opt.value);
                return (
                  <FormControlLabel
                    key={opt._id}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => {
                          const nextVal = e.target.checked
                            ? [...(value || []), opt.value]
                            : (value || []).filter((v) => v !== opt.value);
                          setFieldValue(fieldName, nextVal);
                        }}
                        sx={{
                          "&.Mui-checked": {
                            color: "var(--color-main)",
                          },
                        }}
                      />
                    }
                    label={
                      <span className="font-somar text-sm md:text-base flex items-center gap-2">
                        <OptionImage src={opt.src} alt={opt.label} t={t} />
                        {opt.label}
                        <PriceBadge price={opt.price} />
                      </span>
                    }
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontFamily: "var(--font-somar-sans), sans-serif",
                      },
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => setFieldValue(fieldName, e.target.checked)}
                  sx={{
                    "&.Mui-checked": {
                      color: "var(--color-main)",
                    },
                  }}
                />
              }
              label={
                <span className="font-somar font-medium text-sm md:text-base">
                  {input.title}
                </span>
              }
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontFamily: "var(--font-somar-sans), sans-serif",
                },
              }}
            />
          )}
          {touched && error && (
            <span className="text-xs text-error font-somar">{error}</span>
          )}
        </div>
      );
    }

    // 5. Phone Input
    if (input.type === "phone") {
      return (
        <div className="relative flex flex-col gap-2 mb-2 text-start">
          <label
            htmlFor={inputId}
            className="font-semibold text-gray-700 font-somar text-sm md:text-base"
            style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
          >
            {input.title}
            {input.required && (
              <span className="text-error ml-1 font-ibm">*</span>
            )}
          </label>
          <PhoneInputWithCountrySelect
            international
            defaultCountry="SA"
            value={value}
            onChange={(val) => {
              setFieldValue(fieldName, val);
            }}
            onBlur={handleBlur}
            id={inputId}
            name={fieldName}
            addInternationalOption={false}
            style={{ direction: "ltr" }}
            flagComponent={({ country }) => (
              <span
                style={{
                  fontSize: "1.2em",
                  marginRight: "0.5em",
                }}
              >
                {getUnicodeFlagIcon(country)}
              </span>
            )}
            className={cn(
              "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
              error && touched
                ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
            )}
          />
          {error && touched && (
            <span className="text-xs text-error font-somar mt-1 absolute -bottom-5 start-0">
              {error}
            </span>
          )}
        </div>
      );
    }

    // 6. Image/Audio/Video (New Custom Fields)
    if (
      input.type === "image" ||
      input.type === "audio" ||
      input.type === "video"
    ) {
      return (
        <div className="md:col-span-2">
          <DynamicFileUpload
            type={input.type}
            name={fieldName}
            label={input.title}
            required={input.required}
            isMultiple={input.isMultiple}
            acceptedTypes={input.acceptedTypes}
            maxSizeMB={input.maxSizeMB}
            maxCount={input.maxCount}
            minCount={input.minCount}
            value={value}
            errors={error}
            touched={touched}
            onBlur={handleBlur}
            setFieldValue={setFieldValue}
          />
        </div>
      );
    }

    // 7. Array Inputs – inline grid layout (quantity dropdown + sub-inputs)
    if (input.type === "array") {
      const arrayVal = Array.isArray(value) ? value : [];

      return (
        <>
          {arrayVal.map((childValues, index) => {
            const childErrors = error?.[index] || {};
            const childTouched = touched?.[index] || {};

            return (input.inputs || []).map((subInput) => {
              const subFieldName = `${fieldName}[${index}].${subInput.key}`;
              const subFieldId = `${inputId}-${index}-${subInput.key}`;

              // Customize title to append number, e.g. "اسم الطالب (1)"
              const customSubInput = {
                ...subInput,
                title: `${subInput.title} (${index + 1})`,
              };

              return (
                <DynamicField
                  key={`${index}-${subInput._id}`}
                  input={customSubInput}
                  value={childValues[subInput.key]}
                  error={childErrors[subInput.key]}
                  touched={childTouched[subInput.key]}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  t={t}
                  locale={locale}
                  name={subFieldName}
                  id={subFieldId}
                />
              );
            });
          })}
        </>
      );
    }

    // 8. General Inputs: text, number, date, email
    return (
      <div className="relative">
        <TextInputGroup
          label={input.title}
          type={input.type}
          name={fieldName}
          value={value}
          errors={error}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={input.placeholder}
          required={input.required}
          id={inputId}
          labelFontFamily="var(--font-somar-sans), sans-serif"
        />
      </div>
    );
  }
);

DynamicField.displayName = "DynamicField";

export default DynamicField;
