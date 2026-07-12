"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonIcon from "@mui/icons-material/Person";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LinkIcon from "@mui/icons-material/Link";
import { useSnackbar } from "notistack";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";

const EventDetailsInfoCard = ({
  price,
  availableSeats,
  day,
  toDay,
  fromHour,
  toHour,
  duration,
  tripType,
  slug,
}) => {
  const locale = useLocale();
  const t = useTranslations("profile.events.details");
  const tCommon = useTranslations("common");
  const tEvents = useTranslations("profile.events");
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyLink = async () => {
    if (!slug) return;
    const eventLink = `${window.location.origin}/${locale}/event-invitation/${slug}`;
    try {
      await navigator.clipboard.writeText(eventLink);
      enqueueSnackbar(t("copySuccess") || "Event link copied successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      enqueueSnackbar(t("copyFailed") || "Failed to copy event link", {
        variant: "error",
      });
    }
  };

  // Format dates
  const formattedStartDay = day
    ? formatDate(day, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const formattedEndDay = toDay
    ? formatDate(toDay, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const isMultiDay = day && toDay && day.split("T")[0] !== toDay.split("T")[0];

  // Duration label
  const durationLabel = duration
    ? duration === 1
      ? tEvents("table.oneDay")
      : tEvents("table.days", { count: duration })
    : "";

  // Available seats indicator color
  const isLowSeats = availableSeats !== undefined && availableSeats <= 10;
  const seatsColorClass = isLowSeats
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-emerald-700 bg-emerald-50 border-emerald-200";

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
      {/* Price Section */}
      <div className="border-b border-gray-100 pb-5">
        <span className="text-xs text-gray-500 block mb-1">{t("price")}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-mainColor font-ibm">
            {price !== undefined && price > 0 ? formatCurrency(price) : tCommon("free")}
          </span>
        </div>
      </div>

      {/* Info List */}
      <div className="flex flex-col gap-4">
        {/* Date Row */}
        {day && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mt-0.5">
              <EventIcon fontSize="small" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{t("date")}</span>
              <span className="text-sm font-semibold text-gray-800 font-ibm">
                {isMultiDay ? (
                  <span className="flex flex-col md:flex-row md:items-center gap-1">
                    <span>{formattedStartDay}</span>
                    <span className="text-gray-400 text-xs">←</span>
                    <span>{formattedEndDay}</span>
                  </span>
                ) : (
                  formattedStartDay
                )}
              </span>
            </div>
          </div>
        )}

        {/* Time Row */}
        {fromHour && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mt-0.5">
              <AccessTimeIcon fontSize="small" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{t("time")}</span>
              <span className="text-sm font-semibold text-gray-800 font-ibm">
                {toHour ? `${fromHour} - ${toHour}` : fromHour}
              </span>
            </div>
          </div>
        )}

        {/* Duration Row */}
        {duration && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mt-0.5">
              <HourglassEmptyIcon fontSize="small" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{t("duration")}</span>
              <span className="text-sm font-semibold text-gray-800 font-ibm">
                {durationLabel}
              </span>
            </div>
          </div>
        )}

        {/* Trip Type Row */}
        {tripType && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 text-gray-600 mt-0.5">
              <LocalActivityIcon fontSize="small" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">{t("tripType")}</span>
              <span className="text-sm font-semibold text-gray-800 font-ibm">
                {tCommon(tripType) || tripType}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Available Seats Badge */}
      {availableSeats !== undefined && (
        <div className={`mt-2 flex items-center justify-between p-3.5 rounded-xl border ${seatsColorClass}`}>
          <div className="flex items-center gap-2">
            <PersonIcon fontSize="small" />
            <span className="text-sm font-bold font-somar">{t("availableSeats")}</span>
          </div>
          <span className="text-lg font-extrabold font-ibm">{availableSeats}</span>
        </div>
      )}

      {/* Invitation Link Button */}
      {slug && (
        <div className="flex flex-col gap-3 mt-4">
          <a
            href={`/${locale}/event-invitation/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-12 px-4 rounded-xl border-2 border-mainColor text-mainColor hover:text-white hover:bg-mainColor font-bold font-somar transition-all duration-200 text-center shadow-sm text-sm"
          >
            {useTranslations()("eventTrips.viewInvitation") || "Event Invitation"}
          </a>
          <button
            onClick={handleCopyLink}
            type="button"
            className="inline-flex items-center justify-center gap-2 h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all font-somar cursor-pointer w-full"
          >
            <LinkIcon fontSize="small" />
            {t("copyEventLink") || "Copy Event Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(EventDetailsInfoCard);
