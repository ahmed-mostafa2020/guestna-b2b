"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import { newSarLarge, newSarSmall } from "@assets/svg";
import { AccessTime, BarChart } from "@mui/icons-material";

/* ─── Skeleton ─── */
export const ProviderWalletCardSkeleton = () => (
  <div className="flex flex-col gap-3 w-full animate-pulse">
    {/* Outside Title */}
    <Skeleton variant="text" width={140} height={28} />

    {/* Card */}
    <div className="rounded-2xl p-6 sm:p-7 bg-[#004F4F]">
      <div className="flex items-start justify-between gap-4">
        {/* Available Balance (Right in RTL) */}
        <div className="flex flex-col items-start gap-2">
          <Skeleton
            variant="text"
            width={90}
            height={18}
            sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
          />
          <Skeleton
            variant="text"
            width={200}
            height={44}
            sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
          />
        </div>

        {/* Button (Left in RTL) */}
        <Skeleton
          variant="rounded"
          width={100}
          height={40}
          sx={{ bgcolor: "rgba(255,255,255,0.2)", borderRadius: "10px" }}
        />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/10 my-5" />

      {/* Bottom row (Right in RTL) */}
      <div className="flex items-center justify-start gap-8">
        <Skeleton
          variant="rounded"
          width={140}
          height={32}
          sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
        />
        <Skeleton
          variant="rounded"
          width={140}
          height={32}
          sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
        />
      </div>
    </div>
  </div>
);

/* ─── Format number ─── */
const formatBalance = (amount, locale = "en-US") => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0";
  const localeStr = locale === "ar" ? "ar-SA" : "en-US";
  return new Intl.NumberFormat(localeStr, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
};

/* ─── Main Component ─── */
const ProviderWalletCard = ({ data, loading }) => {
  const t = useTranslations();
  const locale = useLocale();

  if (loading) return <ProviderWalletCardSkeleton />;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Outside Section Title */}
      <h3 className="text-lg sm:text-xl font-bold text-mainColor">
        {t("providerProfile.home.wallet.title")}
      </h3>

      {/* Wallet Card */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#004F4F] text-white relative overflow-hidden shadow-card">
        {/* Subtle Decorative Circle at bottom-start (left in RTL) */}
        <div className="absolute -bottom-14 -end-14 w-48 h-48 rounded-full bg-white/[0.04] pointer-events-none" />

        {/* Top row */}
        <div className="flex items-start justify-between gap-4 relative z-10">
          {/* Right side in RTL: Available Balance */}
          <div className="flex flex-col items-start text-start gap-1">
            <span className="text-xs sm:text-sm text-white/80 font-medium">
              {t("providerProfile.home.wallet.availableBalance")}
            </span>

            <div className="flex items-baseline gap-2 mt-0.5" dir="ltr">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                {formatBalance(data?.availableBalance ?? 0, locale)}
              </span>
              <span className="text-white/90 scale-100 sm:scale-110">
                {newSarLarge}
              </span>
            </div>
          </div>

          {/* Left side in RTL: Operations Button */}
          <div>
            <button
              type="button"
              className="bg-secColor hover:bg-secColor/90 active:scale-95 text-white px-7 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all shadow-sm cursor-pointer"
            >
              {t("providerProfile.home.wallet.operations")}
            </button>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="w-full h-px bg-white/10 my-5 relative z-10" />

        {/* Bottom row (Aligned to right in RTL using justify-start) */}
        <div className="flex flex-wrap items-center justify-start gap-6 sm:gap-10 relative z-10">
          {/* Item 1: قيد الانتظار (Rightmost) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white/90">
              <AccessTime className="!w-4 !h-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-white/70 font-medium">
                {t("providerProfile.home.wallet.pendingBalance")}
              </span>
              <div
                className="flex items-baseline gap-1 font-bold text-sm sm:text-base text-white"
                dir="ltr"
              >
                <span>{formatBalance(data?.pendingBalance ?? 0, locale)}</span>
                <span className="text-white/80 scale-80">{newSarSmall}</span>
              </div>
            </div>
          </div>

          {/* Item 2: إجمالي الإيرادات */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white/90">
              <BarChart className="!w-4 !h-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-white/70 font-medium">
                {t("providerProfile.home.wallet.totalRevenue")}
              </span>
              <div
                className="flex items-baseline gap-1 font-bold text-sm sm:text-base text-white"
                dir="ltr"
              >
                <span>{formatBalance(data?.totalBalance ?? 0, locale)}</span>
                <span className="text-white/80 scale-80">{newSarSmall}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderWalletCard);
