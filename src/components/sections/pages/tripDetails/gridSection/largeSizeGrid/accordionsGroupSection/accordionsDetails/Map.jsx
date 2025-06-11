"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import React, { memo, useEffect, useRef, useState } from "react";

import { Loader } from "@googlemaps/js-api-loader";

const Map = ({
  lat,
  lng,
  locationLink = true,
  zoom = 14,
  mapType = "roadmap",
  markers = [
    {
      lat: lat,
      lng: lng,
      title: "Location",
      // description: "Detailed description of the first location",
    },
  ],
  height = "h-72",
  controls = {
    zoom: true,
    streetView: true,
    fullscreen: true,
    mapType: true,
  },
}) => {
  const mapRef = useRef(null);
  const [_, setMap] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);

  const t = useTranslations();

  // const t = useTranslations();

  useEffect(() => {
    const initMap = async () => {
      // Ensure you replace with your actual API key
      const loader = new Loader({
        // AIzaSyDa7OhoR9H6P97J4unsz_Ndqn7kIY5qZqE
        apiKey: "AIzaSyDa7OhoR9H6P97J4unsz_Ndqn7kIY5qZqE" || "",
        version: "weekly",
        libraries: ["places"],
      });

      try {
        await loader.load();

        if (mapRef.current) {
          const newMap = new google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId[mapType.toUpperCase()],
            zoomControl: controls.zoom,
            streetViewControl: controls.streetView,
            fullscreenControl: controls.fullscreen,
            mapTypeControl: controls.mapType,
          });

          setMap(newMap);

          // Clear existing markers
          mapMarkers.forEach((marker) => marker.setMap(null));

          // Add new markers
          const newMapMarkers = markers.map((markerConfig) => {
            const marker = new google.maps.Marker({
              position: {
                lat: markerConfig.lat,
                lng: markerConfig.lng,
              },
              map: newMap,
              title: markerConfig.title || "Marker",
              ...(markerConfig.icon && { icon: markerConfig.icon }),
            });

            // Add info window if description is provided
            if (markerConfig.description) {
              const infoWindow = new google.maps.InfoWindow({
                content: `<div>${markerConfig.description}</div>`,
              });

              marker.addListener("click", () => {
                infoWindow.open(newMap, marker);
              });
            }

            return marker;
          });

          setMapMarkers(newMapMarkers);
        }
      } catch (error) {
        console.error("Error loading Google Maps", error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      mapMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [
    lat,
    lng,
    zoom,
    mapType,
    JSON.stringify(markers),
    JSON.stringify(controls),
  ]);

  return (
    <>
      <div ref={mapRef} className={`w-full ${height}`} />

      {locationLink && (
        <div className="flex items-center justify-end">
          <Link
            target="_blank"
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            className="mt-4 text-base font-bold font-ibm rounded-lg text-white px-8 py-2 bg-mainColor transition-all ease-in-out duration-200 hover:bg-linksHover"
          >
            {t("links.goToLocation")}
          </Link>
        </div>
      )}
    </>
  );
};

export default memo(Map);
