// Builds the absolute backend URL for an API path (server-side only)
const getBackendUrl = (path) => {
  let baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (
    path &&
    (path.startsWith("clientInfoBooking/") ||
      path.startsWith("promoCodeDiscounts/") ||
      path.startsWith("cities/selected/"))
  ) {
    baseUrl = baseUrl.replace(/\/b2b\/?$/, "/");
  }
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  let cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (cleanPath.startsWith("b2b/") && cleanBase.endsWith("/b2b/")) {
    cleanPath = cleanPath.slice(4);
  }
  return `${cleanBase}${cleanPath}`;
};

export default getBackendUrl;
