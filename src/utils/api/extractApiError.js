/**
 * Extracts a human-readable error message from an Axios error response.
 *
 * Handles:
 * - 2xx responses incorrectly thrown as errors → returns null
 * - Network/timeout errors (no response) → returns null (caller applies default)
 * - `message` as string or string[]
 * - `info` array of validation errors appended to the base message
 *
 * @param {import("axios").AxiosError} error
 * @returns {string|null}
 */
export const extractApiError = (error) => {
  // No response — network error, timeout, CORS, etc.
  if (!error?.response) return null;

  const { statusCode, message, info } = error.response.data ?? {};

  // 2xx thrown as error — treat as no error message
  if (statusCode >= 200 && statusCode < 300) return null;

  // Normalise message: can be a string or an array
  const baseMessage = Array.isArray(message)
    ? message.join(", ")
    : message || null;

  // Append validation details from the `info` array when present
  if (info?.length > 0) {
    const details = info.map((err) => err.message).join(", ");
    return baseMessage ? `${baseMessage} (${details})` : details;
  }

  return baseMessage;
};
