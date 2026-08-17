"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  DomainOutlined,
  PeopleOutline,
  ShowChartOutlined,
  Inventory2Outlined,
  TrendingUp,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
const MiniStatSkeleton = () => (
  <div className="flex flex-col justify-between p-4 sm:p-5 bg-white border border-border rounded-2xl animate-pulse min-h-[130px]">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="55%" height={18} />
      <Skeleton variant="circular" width={36} height={36} />
    </div>
    <div className="flex flex-col items-center gap-1 my-2">
      <Skeleton variant="text" width="40%" height={36} />
      <Skeleton variant="text" width="70%" height={16} />
    </div>
  </div>
);

export const ProviderBookingStatsSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between">
    <Skeleton variant="text" width="45%" height={28} className="mb-4" />
    <div className="grid grid-cols-2 gap-4 flex-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <MiniStatSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* ─── Card Configs matching Figma screenshot ─── */
// Top-Right: حجوزات الافراد (purple icon)
// Top-Left: حجوزات المؤسسات (indigo icon)
// Bottom-Right: حجوزات مجدولة (teal icon)
// Bottom-Left: إجمالي الحجوزات (green icon)
const STAT_CONFIGS = {
  b2c: {
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#7C3AED]",
    Icon: PeopleOutline,
    hasGrowth: true,
  },
  b2b: {
    iconBg: "bg-[#EDE9FE]",
    iconColor: "text-[#6366F1]",
    Icon: DomainOutlined,
    hasGrowth: true,
  },
  scheduled: {
    iconBg: "bg-[#CCFBF1]",
    iconColor: "text-[#0D9488]",
    Icon: Inventory2Outlined,
    hasGrowth: false,
  },
  total: {
    iconBg: "bg-[#DCFCE7]",
    iconColor: "text-[#16A34A]",
    Icon: ShowChartOutlined,
    hasGrowth: true,
  },
};

const BookingStatCard = ({
  Icon,
  iconBg,
  iconColor,
  title,
  value,
  hasGrowth,
  growthText,
}) => (
  <div className="flex flex-col justify-between p-4 sm:p-5 bg-white border border-border rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all">
    {/* Top: Title on the right, Icon on the left in RTL */}
    <div className="flex gap-2">
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full ${iconBg} ${iconColor} shrink-0`}
      >
        <Icon className="!w-4 !h-4 sm:!w-5 sm:!h-5" />
      </div>

      <div className="flex flex-col pt-[6px]">
        <span className="text-xs sm:text-sm text-textLight font-medium">
          {title}
        </span>

        {/* Center: Big Bold Number */}
        <div className="flex flex-col my-1.5 sm:my-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-textDark tracking-tight">
            {value ?? 0}
          </span>

          {/* Bottom: Growth Indicator */}
          {hasGrowth ? (
            <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs text-[#0D9488] font-semibold mt-1">
              <TrendingUp className="!w-3.5 !h-3.5" />
              <span>{growthText}</span>
            </div>
          ) : (
            <div className="h-4 sm:h-5" />
          )}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */
const ProviderBookingStats = ({ data, loading }) => {
  const t = useTranslations();

  // Array ordered for RTL 2x2 grid:
  // 1: Top-Right (حجوزات الافراد)
  // 2: Top-Left (حجوزات المؤسسات)
  // 3: Bottom-Right (حجوزات مجدولة)
  // 4: Bottom-Left (إجمالي الحجوزات)
  const stats = useMemo(
    () => [
      {
        id: "b2c",
        title: t("providerProfile.home.analytics.b2cTrips"),
        value: data?.b2cCount ?? 0,
        ...STAT_CONFIGS.b2c,
      },
      {
        id: "b2b",
        title: t("providerProfile.home.analytics.b2bTrips"),
        value: data?.b2bCount ?? 0,
        ...STAT_CONFIGS.b2b,
      },
      {
        id: "scheduled",
        title: t("providerProfile.home.analytics.scheduledTrips"),
        value: data?.scheduledCount ?? 0,
        ...STAT_CONFIGS.scheduled,
      },
      {
        id: "total",
        title: t("providerProfile.home.analytics.totalTrips"),
        value: data?.total ?? 0,
        ...STAT_CONFIGS.total,
      },
    ],
    [t, data]
  );

  if (loading) return <ProviderBookingStatsSkeleton />;

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-card">
      <h3 className="text-lg sm:text-xl font-bold text-mainColor pb-4">
        {t("providerProfile.home.analytics.bookingStats")}
      </h3>
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 flex-1">
        {stats.map((stat) => (
          <BookingStatCard
            key={stat.id}
            Icon={stat.Icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            title={stat.title}
            value={stat.value}
            hasGrowth={stat.hasGrowth}
            growthText={t("providerProfile.home.analytics.monthGrowth")}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProviderBookingStats);
