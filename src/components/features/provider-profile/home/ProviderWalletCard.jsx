"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import { newSarLarge, newSarSmall } from "@assets/svg";
import {
  AccountBalanceWalletOutlined,
  HourglassEmptyOutlined,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
export const ProviderWalletCardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-[#004d4b] animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <Skeleton
        variant="rounded"
        width={90}
        height={36}
        sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "8px" }}
      />
      <div className="flex flex-col items-end gap-2">
        <Skeleton
          variant="text"
          width={100}
          height={18}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
        <Skeleton
          variant="text"
          width={70}
          height={14}
          sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
        />
        <Skeleton
          variant="text"
          width={180}
          height={40}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
      </div>
    </div>
    <div className="flex items-center justify-end gap-6 mt-4 pt-4 border-t border-white/10">
      <Skeleton
        variant="rounded"
        width={130}
        height={24}
        sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}
      />
      <Skeleton
        variant="rounded"
        width={130}
        height={24}
        sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}
      />
    </div>
  </div>
);

/* ─── Format number ─── */
const formatBalance = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
};

/* ─── Main Component ─── */
const ProviderWalletCard = ({ data, loading }) => {
  const t = useTranslations();

  if (loading) return <ProviderWalletCardSkeleton />;

  return (
    <div className="rounded-2xl p-6 bg-[#004d4b] text-white relative overflow-hidden shadow-sm">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Operations Button (on the left in RTL) */}
        <div>
          <button
            type="button"
            className="bg-[#ED8A22] hover:bg-[#d97917] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            {t("providerProfile.home.wallet.operations")}
          </button>
        </div>

        {/* Balance Information (on the right in RTL) */}
        <div className="flex flex-col items-start sm:items-end text-start sm:text-end gap-1">
          <span className="text-sm font-semibold text-white/90">
            {t("providerProfile.home.wallet.title")}
          </span>

          <span className="text-xs text-white/70">
            {t("providerProfile.home.wallet.availableBalance")}
          </span>

          {/* Large Available Balance */}
          <div className="flex items-baseline gap-2 mt-0.5" dir="ltr">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight">
              {formatBalance(data?.availableBalance ?? 103621.5)}
            </span>
            <span className="text-white/90 scale-90">{newSarLarge}</span>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Balances (aligned to end in RTL) */}
      <div className="flex flex-wrap items-center justify-start sm:justify-end gap-6 sm:gap-8 mt-5 pt-4 border-t border-white/10 text-xs">
        {/* Total Revenue */}
        <div className="flex items-center gap-2 text-white/80">
          <AccountBalanceWalletOutlined className="!w-4 !h-4 text-white/60" />
          <span className="text-white/70">
            {t("providerProfile.home.wallet.totalRevenue")}
          </span>
          <div
            className="flex items-center gap-1 font-semibold text-white"
            dir="ltr"
          >
            <span>{formatBalance(data?.totalBalance ?? 104621.5)}</span>
            <span className="text-white/80 scale-75">{newSarSmall}</span>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="flex items-center gap-2 text-white/80">
          <HourglassEmptyOutlined className="!w-4 !h-4 text-white/60" />
          <span className="text-white/70">
            {t("providerProfile.home.wallet.pendingBalance")}
          </span>
          <div
            className="flex items-center gap-1 font-semibold text-white"
            dir="ltr"
          >
            <span>{formatBalance(data?.pendingBalance ?? 0)}</span>
            <span className="text-white/80 scale-75">{newSarSmall}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderWalletCard);
