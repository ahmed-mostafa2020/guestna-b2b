/**
 * Default fallback coordinates: Riyadh center
 */
export const DEFAULT_COORDINATES = {
  lat: 24.7136,
  lng: 46.6753,
};

/**
 * Validates whether latitude and longitude are valid numeric coordinates within GPS bounds.
 * Excludes 0,0 default empty coordinates.
 *
 * @param {number|string} lat - Latitude
 * @param {number|string} lng - Longitude
 * @returns {boolean}
 */
export const isValidCoordinates = (lat, lng) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return false;
  }
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);

  return (
    !isNaN(numLat) &&
    !isNaN(numLng) &&
    numLat >= -90 &&
    numLat <= 90 &&
    numLng >= -180 &&
    numLng <= 180 &&
    (numLat !== 0 || numLng !== 0)
  );
};

/**
 * Extracts lat/lng coordinates from various Google Maps URL formats or raw coordinate strings.
 *
 * Supported formats:
 * - /maps/search/lat,+lng
 * - @lat,lng in URL (e.g. /@24.7136,46.6753)
 * - Query params: q=lat,lng or ll=lat,lng or daddr=lat,lng or destination=lat,lng
 * - Protobuf format: !3dlat!4dlng
 * - Direction routes: /maps/dir/.../lat,lng
 * - Raw coordinate string: "24.7136, 46.6753" or "24.7136,46.6753"
 *
 * @param {string} text - Input URL or coordinate string
 * @returns {{ lat: number, lng: number } | null}
 */
export const extractCoordsFromMapUrl = (text) => {
  if (!text || typeof text !== "string") return null;

  let decoded = text.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // ignore decoding errors
  }

  // 1. /maps/search/lat,+lng or /maps/search/lat,lng
  const searchPattern = /\/maps\/search\/(-?\d+\.?\d*)[,\s\+]+(-?\d+\.?\d*)/i;
  const searchMatch = decoded.match(searchPattern);
  if (searchMatch) {
    const lat = parseFloat(searchMatch[1]);
    const lng = parseFloat(searchMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  // 2. @lat,lng in URL (e.g. /@24.7136,46.6753)
  const atPattern = /@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
  const atMatch = decoded.match(atPattern);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  // 3. Query parameters: q=lat,lng or ll=lat,lng or daddr=lat,lng or destination=lat,lng or query=lat,lng
  const qPattern =
    /[?&](?:q|ll|daddr|destination|query)=(-?\d+\.?\d*)[,\s\+]+(-?\d+\.?\d*)/i;
  const qMatch = decoded.match(qPattern);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  // 4. Protobuf !3dlat!4dlng in Google Maps URLs
  const bangPattern = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
  const bangMatch = decoded.match(bangPattern);
  if (bangMatch) {
    const lat = parseFloat(bangMatch[1]);
    const lng = parseFloat(bangMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  // 5. Directions /dir//lat,lng
  const dirPattern =
    /\/maps\/dir\/[^\/]*\/(-?\d+\.?\d*)[,\s\+]+(-?\d+\.?\d*)/i;
  const dirMatch = decoded.match(dirPattern);
  if (dirMatch) {
    const lat = parseFloat(dirMatch[1]);
    const lng = parseFloat(dirMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  // 6. Plain coordinates: "24.7136, 46.6753" or "24.7136,46.6753"
  const plainPattern = /^(-?\d{1,2}(?:\.\d+)?)[,\s\+]+(-?\d{1,3}(?:\.\d+)?)$/;
  const plainMatch = decoded.match(plainPattern);
  if (plainMatch) {
    const lat = parseFloat(plainMatch[1]);
    const lng = parseFloat(plainMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { lat, lng };
    }
  }

  return null;
};

/**
 * Robust helper to extract numerical latitude and longitude
 * from diverse backend schemas (e.g. { lat, lng }, GeoJSON [lng, lat], or string).
 *
 * @param {object} branchOrLocation - Branch object or location object
 * @returns {{ lat: number, lng: number, hasCoords: boolean }}
 */
export const parseBranchCoordinates = (branchOrLocation) => {
  if (!branchOrLocation) {
    return {
      lat: DEFAULT_COORDINATES.lat,
      lng: DEFAULT_COORDINATES.lng,
      hasCoords: false,
    };
  }

  const loc = branchOrLocation?.location ?? branchOrLocation;

  let rawLat = loc?.lat ?? branchOrLocation?.lat;
  let rawLng = loc?.lng ?? branchOrLocation?.lng;

  // GeoJSON coordinates array: [lng, lat]
  if (
    (rawLat === undefined || rawLat === null) &&
    Array.isArray(loc?.coordinates) &&
    loc.coordinates.length >= 2
  ) {
    rawLng = loc.coordinates[0];
    rawLat = loc.coordinates[1];
  } else if (
    (rawLat === undefined || rawLat === null) &&
    Array.isArray(branchOrLocation?.coordinates) &&
    branchOrLocation.coordinates.length >= 2
  ) {
    rawLng = branchOrLocation.coordinates[0];
    rawLat = branchOrLocation.coordinates[1];
  }

  // Comma-separated string format: "24.7136, 46.6753"
  if (typeof loc === "string" && loc.includes(",")) {
    const parts = loc.split(",");
    rawLat = parts[0]?.trim();
    rawLng = parts[1]?.trim();
  }

  const hasCoords = isValidCoordinates(rawLat, rawLng);

  return {
    lat: hasCoords ? parseFloat(rawLat) : DEFAULT_COORDINATES.lat,
    lng: hasCoords ? parseFloat(rawLng) : DEFAULT_COORDINATES.lng,
    hasCoords,
  };
};

/**
 * Checks if a branch or location object has valid GPS coordinates.
 *
 * @param {object} branchOrLocation
 * @returns {boolean}
 */
export const hasValidLocation = (branchOrLocation) => {
  return parseBranchCoordinates(branchOrLocation).hasCoords;
};
