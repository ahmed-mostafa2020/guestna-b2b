// const getProxyUrl = (path) => {
//   // Remove any leading slashes to avoid double slashes
//   const cleanPath = path.replace(/^\/+/, "");

//   // Encode the path and return the proxy URL
//   return `/api/proxy?path=${encodeURIComponent(cleanPath)}`;
// };
const getProxyUrl = (path) => {
  // Remove leading slash if present
  const cleanPath = path.replace(/^\//, "");
  // Encode but preserve forward slashes
  return `/api/proxy?path=${encodeURIComponent(cleanPath)}`;
};

export default getProxyUrl;
