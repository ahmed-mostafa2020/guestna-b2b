import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { CONSTANT_VALUES } from "@constants/constantValues";

export const useMutationData = (endpoint, options = {}) => {
  const dispatch = useDispatch();
  const [customLoading, setCustomLoading] = useState(false);
  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  // Define the mutationFn separately and pass it as part of the options
  const mutationFn = async (variables) => {
    const method = options.method || "POST";

    const config = {
      method,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
      headers: {
        lang: options.lang || "ar",
        ...(token && { authorization: `Bearer ${token}` }), // Add Authorization header if token exists
      },
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
