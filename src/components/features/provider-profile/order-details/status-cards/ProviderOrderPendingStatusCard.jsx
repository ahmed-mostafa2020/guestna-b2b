"use client";

import { memo, useState, useEffect, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Schedule,
  CheckCircleOutline,
  PauseCircleOutline,
} from "@mui/icons-material";
import formatDate from "@utils/formatters/FormateDate";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

// 2 Hours in milliseconds
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const ProviderOrderPendingStatusCard = ({ orderData, onExpire }) => {
  const t = useTranslations();
  const locale = useLocale();

  const status =
    orderData?.status || PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL;
  const isPendingProviderApproval =
    status === PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL;
  const hasTimer = isPendingProviderApproval;
  const rawOrderId = orderData?.orderId || orderData?._id || "";

  // ─── 1. Persistent Timer Calculation (Only for PENDING_PROVIDER_APPROVAL) ───
  // Calculate target expiration timestamp (from order creation or cached localStorage)
  const targetExpiryTimestamp = useMemo(() => {
    if (!hasTimer) return null;

    if (orderData?.createdAt) {
      const createdTime = new Date(orderData.createdAt).getTime();
      if (!isNaN(createdTime) && createdTime > 0) {
        return createdTime + TWO_HOURS_MS;
      }
    }

    // Fallback using localStorage per orderId so refresh won't restart timer
    if (typeof window !== "undefined" && rawOrderId) {
      const storageKey = `provider_order_expiry_${rawOrderId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
      const newTarget = Date.now() + TWO_HOURS_MS;
      localStorage.setItem(storageKey, String(newTarget));
      return newTarget;
    }

    return Date.now() + TWO_HOURS_MS;
  }, [hasTimer, orderData?.createdAt, rawOrderId]);

  // Compute remaining seconds from now
  const getRemainingSeconds = () => {
    if (!targetExpiryTimestamp) return 0;
    const diffMs = targetExpiryTimestamp - Date.now();
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingSeconds);
  const onExpireCalledRef = useRef(false);

  useEffect(() => {
    if (!hasTimer || !targetExpiryTimestamp) return;

    // Set initial remaining time
    const initialSecs = getRemainingSeconds();
    setRemainingSeconds(initialSecs);

    if (initialSecs <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const currentRemaining = getRemainingSeconds();
      setRemainingSeconds(currentRemaining);

      if (currentRemaining <= 0) {
        clearInterval(interval);
        if (!onExpireCalledRef.current) {
          onExpireCalledRef.current = true;
          onExpire?.();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimer, targetExpiryTimestamp, onExpire]);

  // Format HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  };

  // ─── 2. Order Metadata Values ───
  const bookingNumber = rawOrderId
    ? String(rawOrderId).startsWith("#")
      ? rawOrderId
      : String(rawOrderId).startsWith("G-")
        ? `#${rawOrderId}`
        : `#G-${rawOrderId}`
    : "-";

  const branchName =
    orderData?.name ||
    orderData?.branch ||
    orderData?.city?.name ||
    orderData?.track?.city?.name ||
    (locale === "ar" ? "الرياض" : "Riyadh");

  const visitDate = orderData?.day || orderData?.date || orderData?.createdAt;
  const formattedVisitDate = visitDate
    ? formatDate(visitDate, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const visitorsCount =
    orderData?.totalAvailableSeats ??
    orderData?.availableSeats ??
    orderData?.seats ??
    0;

  const getCardInfo = () => {
    switch (status) {
      case PROVIDER_ORDER_STATUS.PENDING_COMPANY_APPROVAL:
        return {
          title: t(
            "providerProfile.orderDetails.pendingCard.titlePendingCompany"
          ),
          description: t(
            "providerProfile.orderDetails.pendingCard.descPendingCompany"
          ),
        };
      case PROVIDER_ORDER_STATUS.PENDING:
        return {
          title: t("providerProfile.orderDetails.pendingCard.titlePending"),
          description: t("providerProfile.orderDetails.pendingCard.descPending"),
        };
      case PROVIDER_ORDER_STATUS.SCHEDULED:
        return {
          title: t("providerProfile.orderDetails.pendingCard.titleScheduled"),
          description: t(
            "providerProfile.orderDetails.pendingCard.descScheduled"
          ),
        };
      case PROVIDER_ORDER_STATUS.ON_HOLD:
        return {
          title: t("providerProfile.orderDetails.pendingCard.titleOnHold"),
          description: t("providerProfile.orderDetails.pendingCard.descOnHold"),
        };
      case PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL:
      default:
        return {
          title: t(
            "providerProfile.orderDetails.pendingCard.titlePendingApproval"
          ),
          description: t(
            "providerProfile.orderDetails.pendingCard.descPendingApproval"
          ),
        };
    }
  };

  const { title: cardTitle, description: cardDescription } = getCardInfo();
  const isExpired = hasTimer && remainingSeconds <= 0;

  return (
    <section
      aria-label={cardTitle}
      className={`bg-white border border-gray-100 border-s-4 ${
        isExpired ? "border-s-red-500" : "border-s-[#F59E0B]"
      } rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-xs font-somar transition-all`}
    >
      {/* Upper Row: Status Info + Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
        {/* Right in RTL: Title & Description */}
        <div className="flex flex-col max-w-xl">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-textDark font-somar">
            {cardTitle}
          </h2>
          <p className="text-xs sm:text-sm text-textLight font-normal mt-1.5 leading-relaxed font-somar">
            {cardDescription}
          </p>
        </div>

        {/* Left in RTL: Timer Section (Only for PENDING_PROVIDER_APPROVAL) */}
        {hasTimer && (
          <div className="flex flex-col items-center justify-center text-center shrink-0 self-center sm:self-auto min-w-[130px]">
            {/* Circular Badge with Hourglass */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-[3px] ${
                isExpired
                  ? "border-red-400 bg-red-50 text-red-500"
                  : "border-[#F59E0B] bg-[#FFFBEB] text-[#F59E0B]"
              } flex items-center justify-center mb-2 shadow-2xs transition-colors`}
              aria-hidden="true"
            >
              <svg
                className={`w-8 h-8 sm:w-10 sm:h-10 ${
                  isExpired ? "text-red-500" : "text-[#F59E0B]"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2H18M6 22H18M7 2V6C7 8.76142 9.23858 11 12 11C14.7614 11 17 8.76142 17 6V2M7 22V18C7 15.2386 9.23858 13 12 13C14.7614 13 17 15.2386 17 18V22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Timer Label */}
            <span
              className={`text-[11px] sm:text-xs mb-0.5 ${
                isExpired ? "text-red-600 font-bold" : "text-textLight font-medium"
              }`}
            >
              {isExpired
                ? t("providerProfile.orderDetails.pendingCard.expired")
                : t("providerProfile.orderDetails.pendingCard.expiresIn")}
            </span>

            {/* Countdown / Expired Display */}
            <span
              dir="ltr"
              className={`text-lg sm:text-2xl font-extrabold tracking-wider font-somar ${
                isExpired ? "text-red-500" : "text-[#F59E0B]"
              }`}
            >
              {formatTime(remainingSeconds)}
            </span>

            {/* Expired Tag */}
            {isExpired && (
              <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                {t("providerProfile.orderDetails.pendingCard.timeEnded")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5 sm:my-6" />

      {/* Bottom Row: 4 Data Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs sm:text-sm">
        {/* 1. Booking Number */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1 font-somar">
            {t("providerProfile.orderDetails.pendingCard.orderNumber")}
          </span>
          <span
            className="font-bold text-textDark text-sm sm:text-base font-somar truncate"
            title={bookingNumber}
          >
            {bookingNumber}
          </span>
        </div>

        {/* 2. Branch */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1 font-somar">
            {t("providerProfile.orderDetails.pendingCard.branch")}
          </span>
          <span
            className="font-bold text-textDark text-sm sm:text-base font-somar truncate"
            title={branchName}
          >
            {branchName}
          </span>
        </div>

        {/* 3. Visit Date */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1 font-somar">
            {t("providerProfile.orderDetails.pendingCard.visitDate")}
          </span>
          <span
            className="font-bold text-textDark text-sm sm:text-base font-somar truncate"
            title={formattedVisitDate}
          >
            {formattedVisitDate}
          </span>
        </div>

        {/* 4. Visitors Count */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1 font-somar">
            {t("providerProfile.orderDetails.pendingCard.visitorsCount")}
          </span>
          <span className="font-bold text-textDark text-sm sm:text-base font-somar">
            {visitorsCount} {t("providerProfile.orderDetails.stats.student")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default memo(ProviderOrderPendingStatusCard);
