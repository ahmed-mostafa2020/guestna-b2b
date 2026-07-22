"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StepReview = () => {
  const t = useTranslations("providerProfile.products.modal.fields");
  const { values } = useFormikContext();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-mainColor/10 border border-mainColor/20 flex items-center gap-3 text-mainColor">
        <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Ready to publish your product</h4>
          <p className="text-xs text-mainColor/80">
            Please review the summary below before submitting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            Identity
          </h5>
          <p className="text-sm font-semibold text-titleColor">
            {values.name?.en || "N/A"} / {values.name?.ar || "N/A"}
          </p>
          <div className="flex gap-2 text-xs text-subtitleColor">
            <span>Type: {values.tripsType}</span>
            <span>•</span>
            <span>Systems: {(values.systemTypes || []).join(", ")}</span>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            Configuration
          </h5>
          <p className="text-xs text-subtitleColor">
            Booking Before: <span className="font-semibold text-titleColor">{values.bookingBefore} day(s)</span>
          </p>
          <p className="text-xs text-subtitleColor">
            Recurrence: <span className="font-semibold text-titleColor">{values.recurrencePattern}</span>
          </p>
        </div>

        {/* Dates Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            Dates & Hours
          </h5>
          <p className="text-xs text-subtitleColor">
            From: <span className="font-semibold text-titleColor">{values.fromDay || "N/A"}</span> ({values.fromHour})
          </p>
          <p className="text-xs text-subtitleColor">
            To: <span className="font-semibold text-titleColor">{values.toDay || "N/A"}</span> ({values.toHour})
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 rounded-xl border border-border space-y-2">
          <h5 className="text-xs font-bold text-mainColor uppercase tracking-wider">
            Pricing & Capacity
          </h5>
          <div className="flex items-center gap-4 text-xs text-subtitleColor">
            <span>Cost: <strong className="text-titleColor">{values.productCost} SAR</strong></span>
            <span>Price: <strong className="text-mainColor">{values.price} SAR</strong></span>
          </div>
          <p className="text-xs text-subtitleColor">
            Capacity: <span className="font-semibold text-titleColor">{values.availableSeats?.min} - {values.availableSeats?.max} seats</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepReview;
