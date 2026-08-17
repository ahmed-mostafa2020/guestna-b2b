"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import formatDate from "@utils/formatters/FormateDate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ─── Skeleton ─── */
export const ProviderPerformanceChartSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 h-full animate-pulse flex flex-col justify-between">
    <div className="flex justify-between items-center mb-4">
      <Skeleton variant="text" width="40%" height={28} />
    </div>
    <div className="h-[250px] bg-gray-50/70 rounded-xl flex items-end justify-between gap-2 p-4">
      {[25, 45, 20, 65, 35, 80, 30, 50, 90, 40, 55, 45].map((h, i) => (
        <div key={i} className="w-full flex flex-col gap-2 items-center h-full justify-end">
          <div
            className="bg-secColor/20 rounded-t w-2.5 sm:w-3.5"
            style={{ height: `${h}%` }}
          />
          <Skeleton variant="text" width={16} height={10} />
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center mt-4 pt-2">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={10} height={10} />
        <Skeleton variant="text" width={90} height={16} />
      </div>
    </div>
  </div>
);

/* ─── Short Month Helpers for Clean Fit on Mobile ─── */
const AR_SHORT_MONTHS = [
  "ينا", "فبر", "مار", "أبر", "ماي", "يون",
  "يول", "أغس", "سبت", "أكت", "نوف", "ديس"
];

const EN_SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const itemData = payload[0]?.payload;
    const fullMonthName = itemData?.fullMonth || label;

    return (
      <div className="bg-white shadow-xl rounded-xl p-3.5 border border-border text-sm min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
        <p className="font-bold text-textDark text-center text-base mb-2 border-b border-border pb-1.5">
          {fullMonthName}
        </p>
        <div className="flex items-center justify-between gap-3 text-textDark">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-secColor inline-block" />
            <span>{t("providerProfile.home.analytics.actualSales")}:</span>
          </span>
          <span className="font-extrabold text-base">{itemData?.count ?? 0}</span>
        </div>
      </div>
    );
  }
  return null;
};

/* ─── Main Component ─── */
const ProviderPerformanceChart = ({ data, loading }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) return <ProviderPerformanceChartSkeleton />;

  const isArabic = locale === "ar";
  const shortMonths = isArabic ? AR_SHORT_MONTHS : EN_SHORT_MONTHS;

  const chartData =
    data?.monthlyRevenue?.map((item) => {
      const monthIdx = (item.month - 1) % 12;
      const shortLabel = shortMonths[monthIdx] || `${item.month}`;
      const fullMonth = formatDate(
        new Date(item.year, item.month - 1, 1).toISOString(),
        locale,
        { month: "long" }
      );

      return {
        month: isMobile ? shortLabel : fullMonth,
        fullMonth,
        count: item.totalCount ?? 0,
      };
    }) || [];

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-card">
      {/* Consistent Section Header in mainColor */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-mainColor">
          {t("providerProfile.home.analytics.title")}
        </h3>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="w-full h-[250px] sm:h-[260px] overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border, #ececec)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: isMobile ? 10 : 11, fill: "var(--color-text-light, #737373)" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--color-text-light, #737373)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip t={t} />}
                cursor={{ fill: "rgba(0, 0, 0, 0.04)", radius: 4 }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-secondary, #f09814)"
                radius={[4, 4, 0, 0]}
                barSize={14}
                name={t("providerProfile.home.analytics.actualSales")}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[220px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}

      {/* Legend at bottom: single item for actual sales */}
      <div className="flex items-center justify-center mt-3 pt-2 text-xs sm:text-sm text-textDark font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-secColor" />
          <span>{t("providerProfile.home.analytics.actualSales")}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderPerformanceChart);
