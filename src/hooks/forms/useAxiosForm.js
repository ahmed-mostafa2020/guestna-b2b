"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import axios from "axios";
import { extractApiError } from "@utils/api/extractApiError";

/**
 * Hook that wraps the repeated axios form-submission pattern used across
 * auth/profile forms.
 *
 * Usage:
 *   const { makeRequest, formErrors, isDisabled } = useAxiosForm();
 *
 *   const handleSubmit = (values, { setSubmitting, resetForm }) => {
 *     const config = { method: "post", url: "...", headers, data };
 *     makeRequest(config, {
 *       setSubmitting,
 *       resetForm,
 *       onSuccess: (response) => { dispatch(...); router.push(...); },
 *     });
 *   };
 *
 * @returns {{ makeRequest, formErrors, isDisabled, setIsDisabled }}
 */
const useAxiosForm = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  /**
   * @param {import("axios").AxiosRequestConfig} config  - Axios request config
   * @param {{ setSubmitting, resetForm?, onSuccess?, onError? }} callbacks
   */
  const makeRequest = (config, { setSubmitting, resetForm, onSuccess, onError } = {}) => {
    axios
      .request(config)
      .then((response) => {
        setSubmitting?.(false);
        setFormErrors([]);
        resetForm?.();
        onSuccess?.(response);
      })
      .catch((error) => {
        setIsDisabled(false);
        setSubmitting?.(false);

        const errorMessage = extractApiError(error);
        const defaultMessage = t("forms.validation.api_errors.other_error");

        enqueueSnackbar(errorMessage || defaultMessage, { variant: "error" });
        setFormErrors([errorMessage || defaultMessage]);

        onError?.(error, errorMessage);
      });
  };

  return { makeRequest, formErrors, isDisabled, setIsDisabled };
};

export default useAxiosForm;
