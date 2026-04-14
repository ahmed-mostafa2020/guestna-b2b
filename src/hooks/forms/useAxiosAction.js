"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import axios from "axios";
import { extractApiError } from "@utils/api/extractApiError";

/**
 * Hook for button-triggered mutations (POST/PATCH/DELETE) outside Formik forms.
 * Automatically shows an error snackbar on failure using the centralised
 * extractApiError utility.
 *
 * Usage:
 *   const { execute, isPending } = useAxiosAction({
 *     onSuccess: (response) => { enqueueSnackbar(...); router.push(...); },
 *     onError:   (error, message) => { ... },  // optional – error toast shown automatically
 *   });
 *
 *   execute(axiosConfig);   // full AxiosRequestConfig
 *
 * @param {{ onSuccess?, onError? }} options
 * @returns {{ execute, isPending }}
 */
const useAxiosAction = ({ onSuccess, onError } = {}) => {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: (config) => axios.request(config),
    onSuccess: (response) => {
      onSuccess?.(response);
    },
    onError: (error) => {
      const errorMessage = extractApiError(error);
      const defaultMessage = t("forms.validation.api_errors.other_error");
      enqueueSnackbar(errorMessage || defaultMessage, { variant: "error" });
      onError?.(error, errorMessage);
    },
  });

  return { execute: mutate, isPending };
};

export default useAxiosAction;
