"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";
import PermMediaIcon from "@mui/icons-material/PermMedia";

const StepReview = () => {
  const t = useTranslations("providerProfile.products.modal.fields");
  const tSub = useTranslations("providerProfile.products.modal.subtitles");
  const tModal = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");
  const { values } = useFormikContext();

  const isWeekly = values.recurrencePattern === "WEEKLY";
  const isMonthly = values.recurrencePattern === "MONTHLY";

  // Translate days list — only catch missing-key errors, not all errors
  const formatDays = (daysArray) => {
    if (!Array.isArray(daysArray) || daysArray.length === 0) return "-";
    return daysArray
      .map((day) => {
        try {
          return tWeekDays(day.toLowerCase());
        } catch (err) {
          // Only swallow missing key errors; rethrow unexpected ones
          if (err?.code === "MISSING_MESSAGE") return day;
          throw err;
        }
      })
      .join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-mainColor/10 border border-mainColor/20 flex items-center gap-3.5 text-mainColor">
        <div className="w-10 h-10 rounded-xl bg-mainColor text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-base font-bold">{tSub("readyToPublish")}</h4>
          <p className="text-xs sm:text-sm text-mainColor/80">
            {tSub("reviewBeforeSubmit")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        {/* 1. Identity Card */}
        <div className="p-5 bg-gray-50/80 rounded-2xl border border-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm border-b border-border pb-2.5">
            <InfoIcon className="w-4 h-4" />
            <span>
              {t("nameAr")} / {t("nameEn")}
            </span>
          </div>
          <p className="text-base font-bold text-titleColor">
            {values.name?.ar || values.name?.en || "-"}
          </p>
          {values.name?.en && values.name?.ar && (
            <p className="text-subtitleColor text-xs">EN: {values.name.en}</p>
          )}
          <div className="flex items-center gap-2 text-subtitleColor text-xs sm:text-sm pt-1">
            <span>{t("tripsType")}:</span>
            <span className="font-bold text-titleColor bg-white px-2.5 py-1 rounded-lg border border-border">
              {values.tripsType ? tModal(`tripTypes.${values.tripsType}`) : "-"}
            </span>
          </div>
        </div>

        {/* 2. Configuration & Pattern Card */}
        <div className="p-5 bg-gray-50/80 rounded-2xl border border-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm border-b border-border pb-2.5">
            <CategoryIcon className="w-4 h-4" />
            <span>{t("recurrencePattern")}</span>
          </div>
          <div className="space-y-2 text-subtitleColor text-xs sm:text-sm">
            <p className="flex items-center justify-between">
              <span>{t("recurrencePattern")}:</span>
              <span className="font-bold text-titleColor bg-mainColor/10 text-mainColor py-0.5 rounded-lg">
                {values.recurrencePattern
                  ? tModal(`recurrence.${values.recurrencePattern}`)
                  : "-"}
              </span>
            </p>
            {isWeekly && (
              <p className="flex items-center justify-between">
                <span>{t("selectedDays")}:</span>
                <span className="font-semibold text-titleColor">
                  {formatDays(values.selectedDays)}
                </span>
              </p>
            )}
            {isMonthly && (
              <p className="flex items-center justify-between">
                <span>{t("monthDay")}:</span>
                <span className="font-semibold text-titleColor">
                  {values.monthDay || "-"}
                </span>
              </p>
            )}
            <p className="flex items-center justify-between">
              <span>{t("bookingBefore")}:</span>
              <span className="font-semibold text-titleColor">
                {values.bookingBefore || 1} {tSub("days")}
              </span>
            </p>
          </div>
        </div>

        {/* 3. Dates & Operating Hours Card */}
        <div className="p-5 bg-gray-50/80 rounded-2xl border border-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm border-b border-border pb-2.5">
            <CalendarTodayIcon className="w-4 h-4" />
            <span>
              {t("fromDay")} & {t("toDay")}
            </span>
          </div>
          <div className="space-y-2 text-subtitleColor text-xs sm:text-sm">
            <p className="flex items-center justify-between">
              <span>{t("fromDay")}:</span>
              <span className="font-semibold text-titleColor">
                {values.fromDay || "-"} ({values.fromHour || "-"})
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>{t("toDay")}:</span>
              <span className="font-semibold text-titleColor">
                {values.toDay || "-"} ({values.toHour || "-"})
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>{t("duration")}:</span>
              <span className="font-semibold text-titleColor">
                {values.duration || 1} {tSub("durationDays")}
              </span>
            </p>
          </div>
        </div>

        {/* 4. Pricing & Capacity Card */}
        <div className="p-5 bg-gray-50/80 rounded-2xl border border-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm border-b border-border pb-2.5">
            <AttachMoneyIcon className="w-4 h-4" />
            <span>
              {t("productCost")} & {t("price")}
            </span>
          </div>
          <div className="space-y-2 text-subtitleColor text-xs sm:text-sm">
            <p className="flex items-center justify-between">
              <span>{t("productCost")}:</span>
              <span className="font-bold text-titleColor">
                {values.productCost} SAR
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>{t("price")}:</span>
              <span className="font-bold text-mainColor text-base">
                {values.price} SAR
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>
                {t("minSeats")} / {t("maxSeats")}:
              </span>
              <span className="font-semibold text-titleColor">
                {values.availableSeats?.min || 1} -{" "}
                {values.availableSeats?.max || 1}
              </span>
            </p>
          </div>
        </div>

        {/* 5. Media & Locations Summary Card */}
        <div className="p-5 bg-gray-50/80 rounded-2xl border border-border space-y-3 md:col-span-2 shadow-xs">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm border-b border-border pb-2.5">
            <PermMediaIcon className="w-4 h-4" />
            <span>{tSub("mediaAndLocations")}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-subtitleColor text-xs sm:text-sm pt-1">
            <div className="space-y-2">
              <p className="flex items-center justify-between">
                <span>{tSub("galleryImages")}:</span>
                <span className="font-semibold text-titleColor">
                  {(values.gallery || []).length} {tSub("images")}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>{t("thumbnailWeb")}:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md text-xs ${
                    values.thumbnailWeb
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {values.thumbnailWeb ? tSub("attached") : tSub("notAttached")}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>{tSub("mediaFilePdf")}:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md text-xs ${
                    values.mediaFile
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {values.mediaFile
                    ? tSub("attachedFile")
                    : tSub("notAttachedFile")}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>{tSub("productVideo")}:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md text-xs ${
                    values.video
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {values.video
                    ? tSub("attachedFile")
                    : tSub("notAttachedFile")}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center justify-between">
                <span>{tSub("gatheringPoint")}:</span>
                <span className="font-semibold text-titleColorDir text-xs">
                  {values.gatheringLocation?.lat
                    ? `${values.gatheringLocation.lat}, ${values.gatheringLocation.lng}`
                    : "-"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>{tSub("activityPoint")}:</span>
                <span className="font-semibold text-titleColor text-xs">
                  {values.location?.lat
                    ? `${values.location.lat}, ${values.location.lng}`
                    : "-"}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>{tSub("itinerarySteps")}:</span>
                <span className="font-semibold text-titleColor">
                  {(values.itinerary || []).length} {tSub("steps")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
