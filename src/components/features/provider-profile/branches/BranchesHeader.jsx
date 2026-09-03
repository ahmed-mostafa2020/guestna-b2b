"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

const BranchesHeader = ({ onAddBranch }) => {
  const t = useTranslations("providerProfile.branches");
  const locale = useLocale();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Right side in RTL: Breadcrumbs + Title + Subtitle */}
      <div className="flex flex-col gap-1.5">
        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-textLight font-somar"
        >
          <Link
            href={`/${locale}/provider-profile`}
            className="hover:text-mainColor transition-colors"
          >
            {t("breadcrumbs.home")}
          </Link>
          <span className="text-textLight text-xs">&gt;</span>
          <span className="text-mainColor font-medium">
            {t("breadcrumbs.branches")}
          </span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#191C1E] font-somar">
          {t("pageTitle")}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-textLight font-somar">
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Left side in RTL: Add New Branch Button */}
      <button
        type="button"
        onClick={onAddBranch}
        className="flex items-center justify-center gap-2 bg-[#006B62] hover:bg-[#00524a] active:scale-[0.98] text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md shrink-0 font-somar"
      >
        <AddIcon className="!w-5 !h-5" />
        <span>{t("addNewBranch")}</span>
      </button>
    </div>
  );
};

export default memo(BranchesHeader);
