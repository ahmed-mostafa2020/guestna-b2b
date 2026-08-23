"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import { CloseRounded } from "@mui/icons-material";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

const ProviderOrderRejectedStatusCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();

  const isCancelled = orderData?.status === PROVIDER_ORDER_STATUS.CANCELLED;
  const timelineStatus = orderData?.timelineStatus || {};

  const cardTitle = isCancelled
    ? t("providerProfile.orderDetails.cancellationCard.title")
    : t("providerProfile.orderDetails.cancellationCard.rejectionTitle");

  const dateLabel = isCancelled
    ? t("providerProfile.orderDetails.cancellationCard.issuedAt")
    : t("providerProfile.orderDetails.cancellationCard.rejectedAt");

  const note =
    timelineStatus.note ||
    orderData?.cancelReason ||
    orderData?.rejectionReason ||
    t("providerProfile.orderDetails.cancellationCard.noReason");

  // Format cancellation date with time
  const issuedDate = timelineStatus.issuedAt || orderData?.updatedAt || orderData?.createdAt;
  const formattedDate = issuedDate
    ? formatDate(issuedDate, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const formattedTime = issuedDate
    ? formatDate(issuedDate, locale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const issuedBy =
    timelineStatus.issuedBy?.name ||
    t("providerProfile.orderDetails.cancellationCard.system");

  return (
    <div className="bg-white border border-border/80 border-s-4 border-s-status-danger-border rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden font-somar">
      {/* Top Row: Note and (X) Icon */}
      <div className="flex items-start justify-between gap-4">
        {/* Right / Start in RTL: Title & Note */}
        <div className="flex flex-col max-w-xl">
          <h2 className="text-base sm:text-lg font-bold text-textDark">
            {cardTitle}
          </h2>
          <p className="text-xs sm:text-sm text-textLight font-normal mt-2 leading-relaxed">
            {note}
          </p>
        </div>

        {/* Left / End in RTL: Circular Red Close Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-status-danger-bg border border-status-danger-border text-status-danger-fg flex items-center justify-center shrink-0 shadow-2xs">
          <CloseRounded className="!w-6 !h-6 sm:!w-7 sm:!h-7 text-status-danger-fg" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/60 my-4 sm:my-5" />

      {/* Bottom Row: Metadata (Date + Issued By) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
        {/* Date & Time */}
        <div className="flex items-center gap-1.5 text-textLight font-normal">
          <span>{dateLabel}</span>
          <span className="font-bold text-textDark">
            {formattedDate} {formattedTime ? `| ${formattedTime}` : ""}
          </span>
        </div>

        {/* Issued By */}
        <div className="flex items-center gap-1 text-status-danger-fg font-bold">
          <span>{t("providerProfile.orderDetails.cancellationCard.issuedBy")}</span>
          <span className="underline decoration-status-danger-border">{issuedBy}</span>
        </div>
      </div>
    </div>
  );

};

export default memo(ProviderOrderRejectedStatusCard);
