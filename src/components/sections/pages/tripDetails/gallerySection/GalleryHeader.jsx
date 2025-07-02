"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { memo } from "react";
import { useMemo } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import formatNumbersUint from "@utils/FormatNumbersUint";
import calculateHours from "@utils/CalculateHours";
import DownloadButton from "./DownloadButton";

import IosShareIcon from "@mui/icons-material/IosShare";
import { locationIcon, timeIcon } from "@assets/svg";

const GalleryHeader = ({ tripData }) => {
  const userType = useSelector((state) => state.users.userType);

  const t = useTranslations();

  const numCities = tripData?.cities?.length;
  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return (
        <h4 className="gap-1 text-sm font-medium capitalize centered">
          {locationIcon}
          {tripData.cities[0].name}
        </h4>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          {locationIcon}

          {tripData?.cities?.map((city, index) => (
            <h4 key={city._id} className="text-sm font-medium capitalize">
              {city.name}
              {index != tripData?.cities.length - 1 && <span>-</span>}
            </h4>
          ))}
        </div>
      );
    }
  }, [numCities, tripData?.cities]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Your browser does not support sharing.");
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-titleColor lg:text-5xl">
        {tripData?.name}
      </h1>

      {userType === CONSTANT_VALUES.USERS.PARENT && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {renderCities}

            {tripData?.duration && tripData?.duration > 1 && (
              <h4 className="flex items-center gap-1">
                {timeIcon}
                {formatNumbersUint(
                  tripData?.duration,
                  t("common.day"),
                  t("common.days")
                )}
              </h4>
            )}

            {tripData?.fromHour && (
              <h4 className="flex items-center gap-1">
                {timeIcon}
                {calculateHours(tripData?.fromHour, tripData?.toHour, t)}
              </h4>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-1">
              <IosShareIcon fontSize="small" />
              {t("links.share")}
            </button>

            <DownloadButton />
          </div>
        </div>
      )}
    </>
  );
};

export default memo(GalleryHeader);
