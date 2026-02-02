"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ValidationMessage from "./ValidationMessage";

const Map = ({
  lat,
  lng,
  locationLink = true,
  isAuth,
  zoom = 14,
  mapType = "roadmap",
  height = "h-72",
  controls = {
    zoom: true,
    streetView: true,
    fullscreen: true,
    mapType: true,
  },
  interactive = false, // New prop to enable click-to-select mode
  onLocationSelect, // Callback when user selects a location
  selectedLocation = null, // Current selected location { lat, lng }
  showOriginalMarker = true, // Whether to show the original location marker
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [originalMarker, setOriginalMarker] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const t = useTranslations();

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey:
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
          "AIzaSyDa7OhoR9H6P97J4unsz_Ndqn7kIY5qZqE",
        version: "weekly",
        libraries: ["places"],
      });

      try {
        await loader.load();

        if (mapRef.current && !map) {
          const newMap = new google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId[mapType.toUpperCase()],
            zoomControl: controls.zoom,
            streetViewControl: controls.streetView,
            fullscreenControl: controls.fullscreen,
            mapTypeControl: controls.mapType,
            // Add cursor styling for interactive mode
            ...(interactive && {
              draggableCursor: "crosshair",
              draggingCursor: "move",
            }),
          });

          setMap(newMap);

          // Add original location marker if enabled
          if (showOriginalMarker) {
            const marker = new google.maps.Marker({
              position: { lat, lng },
              map: newMap,
              title: "Original Location",
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              },
            });
            setOriginalMarker(marker);
          }

          // Add click listener for interactive mode
          if (interactive) {
            newMap.addListener("click", (event) => {
              const clickedLat = event.latLng.lat();
              const clickedLng = event.latLng.lng();

              if (onLocationSelect) {
                onLocationSelect({
                  lat: clickedLat,
                  lng: clickedLng,
                });
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps", error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (originalMarker) {
        originalMarker.setMap(null);
      }
      if (selectedMarker) {
        selectedMarker.setMap(null);
      }
    };
  }, [
    lat,
    lng,
    zoom,
    mapType,
    JSON.stringify(controls),
    interactive,
    showOriginalMarker,
  ]);

  // Update selected marker when selectedLocation changes
  useEffect(() => {
    if (!map || !interactive) return;

    // Remove existing selected marker
    if (selectedMarker) {
      selectedMarker.setMap(null);
    }

    // Add new selected marker if location is provided
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const marker = new google.maps.Marker({
        position: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        },
        map: map,
        title: "Selected Gathering Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        },
        animation: google.maps.Animation.DROP,
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #059669;">Gathering Location</h3>
            <p style="margin: 0; font-size: 12px;">
              <strong>Latitude:</strong> ${selectedLocation.lat.toFixed(6)}<br/>
              <strong>Longitude:</strong> ${selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      setSelectedMarker(marker);

      // Center map on selected location
      map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    }
  }, [selectedLocation, map, interactive]);

  if (!isAuth) return <ValidationMessage />;

  return (
    <>
      <div
        ref={mapRef}
        className={`w-full ${height} rounded-lg ${interactive ? "cursor-crosshair" : ""}`}
      />

      {interactive && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            💡{" "}
            {t("links.clickToSelectLocation", {
              defaultValue:
                "Click anywhere on the map to select the gathering location",
            })}
          </p>
        </div>
      )}

      {locationLink && !interactive && (
        <div className="flex items-center justify-end">
          <Link
            target="_blank"
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            className="px-8 py-2 mt-4 text-base font-bold text-white transition-all duration-200 ease-in-out rounded-lg font-ibm bg-mainColor hover:bg-linksHover"
          >
            {t("links.goToLocation")}
          </Link>
        </div>
      )}

      {locationLink &&
        interactive &&
        selectedLocation?.lat &&
        selectedLocation?.lng && (
          <div className="flex items-center justify-end">
            <Link
              target="_blank"
              href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
              className="px-8 py-2 mt-4 text-base font-bold text-white transition-all duration-200 ease-in-out rounded-lg font-ibm bg-mainColor hover:bg-linksHover"
            >
              {t("links.viewSelectedLocation", {
                defaultValue: "View Selected Location in Google Maps",
              })}
            </Link>
          </div>
        )}
    </>
  );
};

export default memo(Map);
