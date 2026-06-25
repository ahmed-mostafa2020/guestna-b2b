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
                  {opt.src && (
                    <img
                      src={opt.src}
                      alt={opt.label}
                      className="w-8 h-8 rounded object-cover flex-shrink-0 border border-gray-100"
                    />
                  )}
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
                {opt.price && (
                  <span className="flex items-center  bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-ibm font-semibold whitespace-nowrap">
                    + {formatCurrency(opt.price)}
                  </span>
                )}
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
                  {opt.label}
                  {opt.price && (
                    <span className="flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-ibm font-semibold whitespace-nowrap">
                      + {formatCurrency(opt.price)}
                    </span>
                  )}
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
                      {opt.label}
                      {opt.price && (
                        <span className="flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-ibm font-semibold whitespace-nowrap">
                          + {formatCurrency(opt.price)}
                        </span>
                      )}
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
