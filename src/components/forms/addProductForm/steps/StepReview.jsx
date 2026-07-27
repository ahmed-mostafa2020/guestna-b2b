"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StepReview = () => {
  const t = useTranslations("providerProfile.products.modal.fields");
  const tSub = useTranslations("providerProfile.products.modal.subtitles");
  const tModal = useTranslations("providerProfile.products.modal");
  const { values } = useFormikContext();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-mainColor/10 border border-mainColor/20 flex items-center gap-3 text-mainColor">
        <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">{tSub("readyToPublish")}</h4>
          <p className="text-xs text-mainColor/80">
            {tSub("reviewBeforeSubmit")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            {t("identity")}
          </h5>
          <p className="text-sm font-semibold text-titleColor">
            {values.name?.en || "-"} / {values.name?.ar || "-"}
          </p>
          <div className="flex gap-2 text-xs text-subtitleColor">
            <span>
              {t("typeLabel")}:{" "}
              {values.tripsType ? tModal(`tripTypes.${values.tripsType}`) : "-"}
            </span>
            <span>•</span>
            <span>
              {t("systemsLabel")}: {(values.systemTypes || []).join(", ")}
            </span>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            {t("configuration")}
          </h5>
          <p className="text-xs text-subtitleColor">
            {t("bookingBeforeDays", { days: values.bookingBefore || 0 })}
          </p>
          {values.recurrencePattern && (
            <p className="text-xs text-subtitleColor">
              {t("recurrenceLabel")}:{" "}
              <span className="font-semibold text-titleColor">
                {values.recurrencePattern}
              </span>
            </p>
          )}
        </div>

        {/* Dates Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            {t("datesAndHours")}
          </h5>
          <p className="text-xs text-subtitleColor">
            {t("fromLabel")}:{" "}
            <span className="font-semibold text-titleColor">
              {values.fromDay || "-"}
            </span>{" "}
            ({values.fromHour || "-"})
          </p>
          <p className="text-xs text-subtitleColor">
            {t("toLabel")}:{" "}
            <span className="font-semibold text-titleColor">
              {values.toDay || "-"}
            </span>{" "}
            ({values.toHour || "-"})
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            {t("pricingAndCapacity")}
          </h5>
          <div className="flex items-center gap-4 text-xs text-subtitleColor">
            <span>
              {t("costLabel")}:{" "}
              <strong className="text-titleColor">{values.productCost} SAR</strong>
            </span>
            <span>
              {t("priceLabel")}:{" "}
              <strong className="text-mainColor">{values.price} SAR</strong>
            </span>
          </div>
          <p className="text-xs text-subtitleColor">
            {t("capacitySeats", {
              min: values.availableSeats?.min || 1,
              max: values.availableSeats?.max || 1,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
