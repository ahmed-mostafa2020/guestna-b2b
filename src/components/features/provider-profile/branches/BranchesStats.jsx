"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import Skeleton from "@mui/material/Skeleton";

const BranchesStats = ({ counts = {}, loading = false }) => {
  const t = useTranslations("providerProfile.branches.stats");

  const statCards = [
    {
      id: "total",
      label: t("totalBranches"),
      value: counts?.all ?? 0,
    },
    {
      id: "active",
      label: t("activeBranches"),
      value: counts?.active ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
      {statCards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl border border-[#EDEDED] py-5 px-6 flex flex-col items-center justify-center text-center transition-all hover:border-mainColor/30"
        >
          <span className="text-sm sm:text-base font-medium text-[#191C1E] font-somar mb-1.5">
            {card.label}
          </span>
          {loading ? (
            <Skeleton variant="text" width={60} height={36} />
          ) : (
            <span className="text-xl sm:text-2xl font-bold text-[#191C1E] font-somar">
              {card.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(BranchesStats);
