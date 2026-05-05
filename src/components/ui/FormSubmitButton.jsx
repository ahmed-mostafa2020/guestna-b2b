"use client";

import { CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";

/**
 * Shared form submit button with loading state.
 * Renders a spinner + "Sending..." text while loading.
 *
 * @param {boolean}  loading   - Show spinner (maps to Formik's isSubmitting)
 * @param {boolean}  disabled  - Additional disabled conditions (e.g. !isValid)
 * @param {*}        label     - Button label when not loading
 * @param {boolean}  isValid   - Controls hover styles (default true)
 * @param {string}   className - Extra classes, e.g. "mt-4" or "mt-8"
 */
const FormSubmitButton = ({
  loading,
  disabled,
  label,
  isValid = true,
  className = "",
}) => {
  const t = useTranslations();

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`centered gap-2 mt-5 font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
        isValid ? "hover:bg-linksHover hover:border-linksHover" : ""
      } ${className}`}
    >
      {loading ? (
        <>
          {t("forms.validation.sending")}
          <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default FormSubmitButton;
