const getProxyUrl = (path) => {
  // Remove leading slash if present
  const cleanPath = path.replace(/^\//, "");
  // Encode but preserve forward slashes
  return `/api/proxy?path=${encodeURIComponent(cleanPath)}`;
};

export default getProxyUrl;
