"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import { newSarLarge } from "@assets/svg";

/* ─── Skeleton ─── */
export const ProviderWalletCardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-gradient-to-r from-mainColor to-[#005c5c] animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col gap-3 w-full">
        <Skeleton
          variant="text"
          width={120}
          height={20}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={40}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <div className="flex items-center gap-6 mt-2">
          <Skeleton
            variant="rounded"
            width={140}
            height={28}
            sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
          />
          <Skeleton
            variant="rounded"
            width={140}
            height={28}
            sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
          />
        </div>
      </div>
      <Skeleton
        variant="rounded"
        width={100}
        height={40}
        sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
      />
    </div>
  </div>
);

/* ─── Format number ─── */
const formatBalance = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/* ─── Main Component ─── */
const ProviderWalletCard = ({ data, loading }) => {
  const t = useTranslations();

  if (loading) return <ProviderWalletCardSkeleton />;

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-r from-mainColor to-[#005c5c] text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -start-8 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-white/80">
              {t("providerProfile.home.wallet.title")}
            </span>

            {/* Available Balance */}
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xs text-white/60">
                {t("providerProfile.home.wallet.availableBalance")}
              </span>
              <div className="flex items-center gap-2" dir="ltr">
                <span className="text-white">{newSarLarge}</span>
                <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {formatBalance(data?.availableBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Transfer button */}
          <button
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg
              text-sm font-semibold transition-all duration-200 border border-white/20 self-start"
          >
            {t("providerProfile.home.wallet.transfer")}
          </button>
        </div>

        {/* Bottom stats row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-4 pt-4 border-t border-white/15">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">
              {t("providerProfile.home.wallet.totalBalance")}
            </span>
            <span
              className="text-sm font-semibold flex items-center gap-1"
              dir="ltr"
            >
              <span className="text-white/80">{newSarLarge}</span>
              {formatBalance(data?.totalBalance)}
            </span>
          </div>

          <div className="w-px h-4 bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">
              {t("providerProfile.home.wallet.pendingBalance")}
            </span>
            <span
              className="text-sm font-semibold flex items-center gap-1"
              dir="ltr"
            >
              <span className="text-white/80">{newSarLarge}</span>
              {formatBalance(data?.pendingBalance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderWalletCard);
