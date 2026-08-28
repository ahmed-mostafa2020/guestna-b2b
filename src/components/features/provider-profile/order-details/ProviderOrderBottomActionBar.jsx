"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

const ProviderOrderBottomActionBar = ({
  orderData,
  onApprove,
  onEdit,
  onReject,
  loading = false,
}) => {
  const t = useTranslations();

  const status =
    orderData?.status || PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL;

  // Status display config for the dot indicator
  const getStatusDotColor = () => {
    switch (status) {
      case PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL:
      case PROVIDER_ORDER_STATUS.PENDING_COMPANY_APPROVAL:
      case PROVIDER_ORDER_STATUS.PENDING:
        return "bg-status-warning-fg";
      case PROVIDER_ORDER_STATUS.SCHEDULED:
        return "bg-status-info-fg";
      case PROVIDER_ORDER_STATUS.ON_HOLD:
        return "bg-status-hold-fg";
      default:
        return "bg-mainColor";
    }
  };

  const statusLabel =
    status === PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL
      ? t("providerProfile.orderDetails.actionBar.operationsReview")
      : t(`providerProfile.ordersManagement.statuses.${status}`, {
          default: status,
        });

  if (status !== PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL) {
    return null;
  }

  return (
    <section
      aria-label={t("providerProfile.orderDetails.actionBar.currentStatus")}
      className="sticky bottom-0 z-20 -mx-4 lg:-mx-7 -mb-4 lg:-mb-7 px-4 lg:px-7 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.04)] font-somar transition-all"
    >
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Current Order Status */}
        <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-1 shrink-0">
          <span className="text-[11px] sm:text-xs text-textLight font-normal">
            {t("providerProfile.orderDetails.actionBar.currentStatus")}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor()} animate-pulse`}
              aria-hidden="true"
            />
            <span className="font-bold text-textDark text-sm sm:text-base">
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Actions Group */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* 1. Accept Booking */}
          <button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-mainColor hover:bg-titleColor active:scale-95 text-white font-bold text-xs sm:text-sm md:text-base px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-mainColor/30 whitespace-nowrap text-center"
          >
            <span>
              {t("providerProfile.orderDetails.actionBar.acceptBooking")}
            </span>
          </button>

          {/* 2. Request Modification */}
          <button
            type="button"
            onClick={onEdit}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center border border-status-warning-border text-status-warning-fg bg-white hover:bg-status-warning-bg active:scale-95 font-bold text-xs sm:text-sm md:text-base px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-status-warning-border/40 whitespace-nowrap text-center"
          >
            <span>
              {t("providerProfile.orderDetails.actionBar.requestEdit")}
            </span>
          </button>

          {/* 3. Reject Order */}
          <button
            type="button"
            onClick={onReject}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center border border-status-danger-border text-status-danger-fg bg-white hover:bg-status-danger-bg active:scale-95 font-bold text-xs sm:text-sm md:text-base px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-status-danger-border/40 whitespace-nowrap text-center"
          >
            <span>
              {t("providerProfile.orderDetails.actionBar.rejectOrder")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );

};

export default memo(ProviderOrderBottomActionBar);

