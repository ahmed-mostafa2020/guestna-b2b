"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import { FileDownloadOutlined } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

/* ─── Skeleton ─── */
const OrdersPageHeaderSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mainColor/15 via-mainColor/5 to-white border border-border p-6 sm:p-8 animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
      <div className="flex flex-col gap-3">
        <Skeleton variant="text" width={160} height={20} />
        <Skeleton variant="text" width={280} height={36} />
        <Skeleton variant="text" width={400} height={20} />
      </div>
      <Skeleton
        variant="rounded"
        width={150}
        height={44}
        className="rounded-xl"
      />
    </div>
  </div>
);

/* ─── Main Component ─── */
const OrdersPageHeader = ({
  loading = false,
  onExport,
  isExporting = false,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  if (loading) return <OrdersPageHeaderSkeleton />;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mainColor/15 via-mainColor/5 to-white border border-border p-6 sm:p-8">
      {/* Decorative circles */}
      <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-mainColor/5 pointer-events-none" />
      <div className="absolute -bottom-8 -start-8 w-32 h-32 rounded-full bg-mainColor/5 pointer-events-none" />

      <div className="relative z-[2] flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Left side: Breadcrumbs + Title + Subtitle */}
        <div className="flex flex-col gap-2">
          {/* Breadcrumbs */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-textLight"
          >
            <Link
              href={`/${locale}/provider-profile`}
              className="hover:text-mainColor transition-colors"
            >
              {t("providerProfile.ordersManagement.breadcrumbs.home")}
            </Link>
            <span className="text-textLight">{">"}</span>
            <span className="text-mainColor font-medium">
              {t("providerProfile.ordersManagement.breadcrumbs.bookings")}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-mainColor">
            {t("providerProfile.ordersManagement.pageTitle")}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-textLight max-w-2xl">
            {t("providerProfile.ordersManagement.pageSubtitle")}
          </p>
        </div>

        {/* Right side: Export Report Button */}
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 bg-mainColor hover:bg-titleColor text-white font-medium text-sm sm:text-base px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed shrink-0"
        >
          {isExporting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <FileDownloadOutlined className="!w-5 !h-5" />
          )}
          <span>{t("providerProfile.ordersManagement.exportReport")}</span>
        </button>
      </div>
    </div>
  );
};

export default memo(OrdersPageHeader);
