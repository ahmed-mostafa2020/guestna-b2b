import { useState } from "react";
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

// ─── Image Lightbox ──────────────────────────────────────────────────────────
const ImageLightbox = ({ src, alt, onClose }) => {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close image preview"
          className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain border-2 border-white/20"
        />
        {alt && (
          <p className="mt-3 text-white/80 text-sm font-somar text-center">{alt}</p>
        )}
      </div>
    </div>
  );
};

// ─── Small clickable image thumbnail ─────────────────────────────────────────
const OptionImage = ({ src, alt }) => {
  const [lightbox, setLightbox] = useState(null);

  if (!src) return null;
  return (
    <>
      <div className="relative group flex-shrink-0">
        <img
          src={src}
          alt={alt}
          className="w-9 h-9 rounded-lg object-cover border border-gray-200 transition-transform duration-150 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => setLightbox({ src, alt })}
          aria-label="View larger image"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg transition-opacity duration-150"
        >
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
        </button>
      </div>
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
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
const DynamicField = ({
  input,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  t,
  locale,
}) => {
  const inputId = `dynamic-field-${input.key}`;

  // 1. Textarea
  if (input.type === "textarea") {
    return (
      <div className="md:col-span-2">
        <TextInputGroup
          label={input.title}
          textarea={true}
          name={input.key}
          value={values[input.key]}
          errors={errors[input.key]}
          touched={touched[input.key]}
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
          name={input.key}
          value={values[input.key]}
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
              input.options.find((o) => o.value === selected)?.label || selected
            );
          }}
          sx={{
            border:
              touched[input.key] && errors[input.key]
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
                      checked={
                        (values[input.key] || []).indexOf(opt.value) > -1
                      }
                      sx={{
                        "&.Mui-checked": {
                          color: "var(--color-main)",
                        },
                        padding: 0,
                        marginRight: "4px",
                      }}
                    />
                  )}
                  <OptionImage src={opt.src} alt={opt.label} />
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
        {touched[input.key] && errors[input.key] && (
          <span className="text-xs text-error font-somar mt-1 absolute -bottom-5 start-0">
            {errors[input.key]}
          </span>
        )}
      </div>
    );
  }

  // 3. Radio Buttons
  if (input.type === "radio") {
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
          name={input.key}
          value={values[input.key]}
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
                  <OptionImage src={opt.src} alt={opt.label} />
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
        {touched[input.key] && errors[input.key] && (
          <span className="text-xs text-error font-somar">
            {errors[input.key]}
          </span>
        )}
      </div>
    );
  }

  // 4. Checkbox
  if (input.type === "checkbox") {
    const hasOptions = input.options && input.options.length > 0;
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
                Array.isArray(values[input.key]) &&
                values[input.key].includes(opt.value);
              return (
                <FormControlLabel
                  key={opt._id}
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => {
                        const nextVal = e.target.checked
                          ? [...(values[input.key] || []), opt.value]
                          : (values[input.key] || []).filter(
                              (v) => v !== opt.value
                            );
                        setFieldValue(input.key, nextVal);
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
                      <OptionImage src={opt.src} alt={opt.label} />
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
                checked={!!values[input.key]}
                onChange={(e) => setFieldValue(input.key, e.target.checked)}
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
        {touched[input.key] && errors[input.key] && (
          <span className="text-xs text-error font-somar">
            {errors[input.key]}
          </span>
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
          value={values[input.key]}
          onChange={(val) => {
            setFieldValue(input.key, val);
          }}
          onBlur={handleBlur}
          id={inputId}
          name={input.key}
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
            errors[input.key] && touched[input.key]
              ? "border-error PhoneInputInput-focus:border-error hover:border-error"
              : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
          )}
        />
        {errors[input.key] && touched[input.key] && (
          <span className="text-xs text-error font-somar mt-1 absolute -bottom-5 start-0">
            {errors[input.key]}
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
          name={input.key}
          label={input.title}
          required={input.required}
          isMultiple={input.isMultiple}
          acceptedTypes={input.acceptedTypes}
          maxSizeMB={input.maxSizeMB}
          maxCount={input.maxCount}
          minCount={input.minCount}
          value={values[input.key]}
          errors={errors[input.key]}
          touched={touched[input.key]}
          onBlur={handleBlur}
          setFieldValue={setFieldValue}
        />
      </div>
    );
  }

  // 7. General Inputs: text, number, date, email
  return (
    <div className="relative">
      <TextInputGroup
        label={input.title}
        type={input.type}
        name={input.key}
        value={values[input.key]}
        errors={errors[input.key]}
        touched={touched[input.key]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={input.placeholder}
        required={input.required}
        id={inputId}
        labelFontFamily="var(--font-somar-sans), sans-serif"
      />
    </div>
  );
};

export default DynamicField;
