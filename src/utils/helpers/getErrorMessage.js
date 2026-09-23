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

    const isGenericValidation =
      errorMessage === "خطأ في التحقق" ||
      error.response?.data?.error === "VALIDATION_ERROR" ||
      errorMessage?.toLowerCase?.() === "validation error";

    if (isGenericValidation) {
      errorMessage = validationErrors;
    } else {
      errorMessage += ` (${validationErrors})`;
    }
  }

  return errorMessage;
};
export default getErrorMessage;
