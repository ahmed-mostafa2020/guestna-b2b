const getErrorMessage = (
  error,
  t,
  defaultErrorMessage = "forms.validation.api_errors.other_error"
) => {
  // Default error message
  let errorMessage = error.response?.data?.message || t(defaultErrorMessage);

  // Check if there are validation errors in 'info' array
  if (error.response?.data?.info?.length > 0) {
    const validationErrors = error.response.data.info
      .map((err) => `${err.message}`)
      .join(", ");
    errorMessage += ` (${validationErrors})`;
  }

  return errorMessage;
};
export default getErrorMessage;
