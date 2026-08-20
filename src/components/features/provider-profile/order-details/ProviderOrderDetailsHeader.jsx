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
  PictureAsPdfOutlined,
} from "@mui/icons-material";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

/* ─── Status Badge Styles & Icons ─── */
const STATUS_CONFIG = {
  [PROVIDER_ORDER_STATUS.DONE]: {
    bg: "bg-[#E8F8F5]",
    text: "text-[#00A389]",
    border: "border-[#B2EBE2]",
    icon: <CheckCircleOutline className="!w-4 !h-4 text-[#00A389]" />,
  },
  [PROVIDER_ORDER_STATUS.CANCELLED]: {
    bg: "bg-[#FEECEB]",
    text: "text-[#D92D20]",
    border: "border-[#FECDCA]",
    icon: <HighlightOff className="!w-4 !h-4 text-[#D92D20]" />,
  },
  [PROVIDER_ORDER_STATUS.REJECTED]: {
    bg: "bg-[#FEECEB]",
    text: "text-[#D92D20]",
    border: "border-[#FECDCA]",
    icon: <HighlightOff className="!w-4 !h-4 text-[#D92D20]" />,
  },
  [PROVIDER_ORDER_STATUS.PENDING]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: <Schedule className="!w-4 !h-4 text-amber-600" />,
  },
  [PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: <Schedule className="!w-4 !h-4 text-amber-600" />,
  },
  [PROVIDER_ORDER_STATUS.SCHEDULED]: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    icon: <CheckCircleOutline className="!w-4 !h-4 text-sky-600" />,
  },
  [PROVIDER_ORDER_STATUS.ON_HOLD]: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    icon: <Schedule className="!w-4 !h-4 text-purple-600" />,
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
    status === PROVIDER_ORDER_STATUS.DONE
      ? isAr
        ? "مؤكد"
        : "Confirmed"
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
            <span className="text-[#007473] font-semibold">
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#007473] hover:bg-[#00605F] active:scale-98 text-white text-sm sm:text-base font-bold px-7 py-3 rounded-xl shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#007473]/30 font-somar"
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
