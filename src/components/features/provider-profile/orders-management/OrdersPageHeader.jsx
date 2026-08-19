"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";

/* ─── Skeleton ─── */
const OrdersPageHeaderSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e0f7fa] via-[#e6fafe] to-[#f0faff] border border-border p-6 sm:p-8 animate-pulse">
    <div className="flex flex-col gap-3 relative z-10">
      <Skeleton variant="text" width={160} height={20} />
      <Skeleton variant="text" width={280} height={36} />
      <Skeleton variant="text" width={400} height={20} />
    </div>
  </div>
);

/* ─── Main Component ─── */
const OrdersPageHeader = ({ loading = false }) => {
  const t = useTranslations();
  const locale = useLocale();

  if (loading) return <OrdersPageHeaderSkeleton />;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e0f7fa] via-[#e6fafe] to-[#f0faff] border border-border p-6 sm:p-8">
      {/* Decorative circles */}
      <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-mainColor/5 pointer-events-none" />
      <div className="absolute -bottom-8 -start-8 w-32 h-32 rounded-full bg-mainColor/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-2">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-textLight">
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
        <p className="text-sm sm:text-base text-textLight max-w-2xl">
          {t("providerProfile.ordersManagement.pageSubtitle")}
        </p>
      </div>
    </div>
  );
};

export default memo(OrdersPageHeader);
