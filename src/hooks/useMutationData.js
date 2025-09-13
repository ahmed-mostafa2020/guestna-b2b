import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getHeaders } from "../utils/getHeaders";
import getProxyUrl from "../utils/getProxyUrl";

export const useMutationData = (endpoint, options = {}) => {
  const dispatch = useDispatch();
  const [customLoading, setCustomLoading] = useState(false);
  const locale = options.lang || "ar";

  // Define the mutationFn separately and pass it as part of the options
  const mutationFn = async (variables) => {
    const method = options.method || "POST";

    // Use proxy pattern instead of direct API calls
    const config = {
      method,
      url: getProxyUrl(endpoint),
      headers: getHeaders(locale),
      data: variables,
    };

    const response = await axios(config);
    return response.data;
  };

  // Use the mutation hook, passing mutationFn as part of the options
  const mutation = useMutation({
    mutationFn, // Pass the mutationFn here
    ...options, // Spread the other options (onSuccess, onError, etc.)
    onMutate: () => {
      // Set custom loading state to true when mutation starts
      setCustomLoading(true);
      // Return undefined explicitly
      return undefined;
    },
    onSettled: () => {
      // Set custom loading state to false when mutation settles (either success or error)
      setCustomLoading(false);
    },
  });

  useEffect(() => {
    if (options.onSuccess && mutation.isSuccess && mutation.data) {
      dispatch(options.onSuccess(mutation.data)); // Dispatching with the data
    }

    if (options.onError && mutation.isError && mutation.error) {
      dispatch(options.onError(mutation.error)); // Dispatching with the error
    }
  }, [
    options,
    mutation.isSuccess,
    mutation.isError,
    mutation.data,
    mutation.error,
    dispatch,
    options.onSuccess,
    options.onError,
  ]);

  return { ...mutation, isLoading: customLoading };
};
