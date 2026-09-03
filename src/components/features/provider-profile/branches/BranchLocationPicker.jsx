"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { NearMeOutlined } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

// Default coordinates: Riyadh center
const DEFAULT_LAT = 24.7136;
const DEFAULT_LNG = 46.6753;

const BranchLocationPicker = ({
  lat,
  lng,
  address,
  onChangeLocation,
  mapTitle = "اختر الموقع على الخريطة",
  instructionText = "انقر على الخريطة لتحديد الموقع",
  addressLabel = "العنوان",
  addressPlaceholder = "طريق الملك فهد، الرياض...",
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  const numericLat = parseFloat(lat) || DEFAULT_LAT;
  const numericLng = parseFloat(lng) || DEFAULT_LNG;

  // Reverse geocode lat/lng to get formatted address
  const reverseGeocode = useCallback(
    (targetLat, targetLng) => {
      if (!geocoderRef.current) return;
      geocoderRef.current.geocode(
        { location: { lat: targetLat, lng: targetLng } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            const formatted = results[0].formatted_address;
            onChangeLocation({
              lat: String(targetLat),
              lng: String(targetLng),
              address: formatted,
            });
          } else {
            onChangeLocation({
              lat: String(targetLat),
              lng: String(targetLng),
              address: address || "",
            });
          }
        }
      );
    },
    [onChangeLocation, address]
  );

  useEffect(() => {
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyDa7OhoR9H6P97J4unsz_Ndqn7kIY5qZqE";

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (!mapRef.current) return;

        geocoderRef.current = new window.google.maps.Geocoder();

        const center = { lat: numericLat, lng: numericLng };

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          draggableCursor: "crosshair",
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: false,
        });

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener("dragend", (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          reverseGeocode(newLat, newLng);
        });

        map.addListener("click", (e) => {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          marker.setPosition({ lat: newLat, lng: newLng });
          reverseGeocode(newLat, newLng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setIsMapLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load Google Maps API:", err);
        setMapError("Failed to load Google Maps");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker & pan if lat/lng change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const pos = { lat: numericLat, lng: numericLng };
      mapInstanceRef.current.panTo(pos);
      markerRef.current.setPosition(pos);
    }
  }, [numericLat, numericLng]);

  return (
    <div className="border border-dashed border-border rounded-2xl p-4 sm:p-5 bg-white flex flex-col gap-3">
      <h3 className="text-base font-bold text-textDark font-somar">
        {mapTitle}
      </h3>

      {/* Instruction Banner */}
      <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-textLight font-somar">
        <NearMeOutlined className="!w-4 !h-4 text-mainColor shrink-0 -rotate-45" />
        <span>{instructionText}</span>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-border bg-gray-100">
        <div ref={mapRef} className="w-full h-full" />
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
            <CircularProgress size={32} sx={{ color: "var(--color-main)" }} />
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4 text-center text-sm text-error font-somar">
            {mapError}
          </div>
        )}
      </div>

      {/* Address Text Field */}
      <div className="flex flex-col gap-1 mt-1">
        <label className="text-xs sm:text-sm font-medium text-textDark font-somar">
          {addressLabel}
        </label>
        <input
          type="text"
          value={address || ""}
          onChange={(e) =>
            onChangeLocation({
              lat: String(numericLat),
              lng: String(numericLng),
              address: e.target.value,
            })
          }
          placeholder={addressPlaceholder}
          className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl outline-none focus:border-mainColor transition-colors font-somar bg-white"
        />
      </div>
    </div>
  );
};

export default memo(BranchLocationPicker);
