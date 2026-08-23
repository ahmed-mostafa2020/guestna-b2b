"use client";

import { memo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CheckCircleOutline,
  HighlightOff,
  Schedule,
} from "@mui/icons-material";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

/* ─── Status Badge Styles & Icons ─── */
const STATUS_CONFIG = {
  [PROVIDER_ORDER_STATUS.DONE]: {
    bg: "bg-status-success-bg",
    text: "text-status-success-fg",
    border: "border-status-success-border",
    icon: <CheckCircleOutline className="!w-4 !h-4 text-status-success-fg" />,
  },
  [PROVIDER_ORDER_STATUS.CANCELLED]: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
    icon: <HighlightOff className="!w-4 !h-4 text-status-danger-fg" />,
  },
  [PROVIDER_ORDER_STATUS.REJECTED]: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
    icon: <HighlightOff className="!w-4 !h-4 text-status-danger-fg" />,
  },
  [PROVIDER_ORDER_STATUS.PENDING]: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
    icon: <Schedule className="!w-4 !h-4 text-status-warning-fg" />,
  },
  [PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL]: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
    icon: <Schedule className="!w-4 !h-4 text-status-warning-fg" />,
  },
  [PROVIDER_ORDER_STATUS.PENDING_COMPANY_APPROVAL]: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
    icon: <Schedule className="!w-4 !h-4 text-status-info-fg" />,
  },
  [PROVIDER_ORDER_STATUS.SCHEDULED]: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
    icon: <CheckCircleOutline className="!w-4 !h-4 text-status-info-fg" />,
  },
  [PROVIDER_ORDER_STATUS.ON_HOLD]: {
    bg: "bg-status-hold-bg",
    text: "text-status-hold-fg",
    border: "border-status-hold-border",
    icon: <Schedule className="!w-4 !h-4 text-status-hold-fg" />,
  },
};

const ProviderOrderDetailsHeader = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  const status = orderData?.status || PROVIDER_ORDER_STATUS.DONE;
  const statusCfg =
    STATUS_CONFIG[status] || STATUS_CONFIG[PROVIDER_ORDER_STATUS.DONE];

  // Dynamic Title based on status
  const getPageTitle = () => {
    if (status === PROVIDER_ORDER_STATUS.CANCELLED) {
      return t("providerProfile.orderDetails.titleCancelled");
    }
    if (status === PROVIDER_ORDER_STATUS.REJECTED) {
      return t("providerProfile.orderDetails.titleRejected");
    }
    return t("providerProfile.orderDetails.title");
  };

  const statusLabel =
    status === PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL
      ? t("providerProfile.orderDetails.pendingCard.titlePendingApproval")
      : t(`providerProfile.ordersManagement.statuses.${status}`, {
          default: status,
        });

  // Handle Invoice Action / PDF download
  const handleAction = () => {
    if (orderData?.detailsFile) {
      window.open(orderData.detailsFile, "_blank", "noopener,noreferrer");
    } else {
      window.print();
    }
  };

  return (
    <header className="bg-white rounded-2xl border border-gray-100 p-5 sm:px-8 sm:py-6 shadow-xs font-somar">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Right in RTL: Breadcrumbs + Title + Status Badge */}
        <div className="flex flex-col items-start gap-1.5">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-textLight"
          >
            <Link
              href={`/${locale}/provider-profile`}
              className="hover:text-mainColor transition-colors"
            >
              {t("providerProfile.orderDetails.breadcrumbs.home")}
            </Link>
            {isAr ? (
              <KeyboardArrowLeft className="!w-4 !h-4 text-textLight/70" />
            ) : (
              <KeyboardArrowRight className="!w-4 !h-4 text-textLight/70" />
            )}
            <Link
              href={`/${locale}/provider-profile/orders-management`}
              className="hover:text-mainColor transition-colors"
            >
              {t("providerProfile.orderDetails.breadcrumbs.bookings")}
            </Link>
            {isAr ? (
              <KeyboardArrowLeft className="!w-4 !h-4 text-textLight/70" />
            ) : (
              <KeyboardArrowRight className="!w-4 !h-4 text-textLight/70" />
            )}
            <span className="text-mainColor font-semibold">
              {t("providerProfile.orderDetails.breadcrumbs.details")}
            </span>
          </nav>

          {/* Title & Status Badge */}
          <div className="flex flex-col gap-3.5 pt-0.5">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-textDark tracking-tight font-somar">
              {getPageTitle()}
            </h1>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border w-fit ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
            >
              {statusCfg.icon}
              <span>{statusLabel}</span>
            </span>
          </div>
        </div>

        {/* Left in RTL: Action Button */}
        <div className="flex items-center shrink-0">
          {status === PROVIDER_ORDER_STATUS.DONE && (
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-mainColor hover:bg-titleColor active:scale-98 text-white text-sm sm:text-base font-bold px-7 py-3 rounded-xl shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-mainColor/30 font-somar"
            >
              <span>{t("providerProfile.orderDetails.issueInvoice")}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default memo(ProviderOrderDetailsHeader);

