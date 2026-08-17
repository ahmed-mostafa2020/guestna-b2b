"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ─── Skeleton ─── */
export const ProviderPerformanceChartSkeleton = () => (
  <div className="bg-white border border-border rounded-xl p-5 animate-pulse">
    <Skeleton variant="text" width="40%" height={24} className="mb-4" />
    <div className="h-[280px] bg-gray-50 rounded-lg flex items-end justify-between gap-2 p-4">
      {[40, 55, 30, 70, 45, 80, 35, 60, 85, 50, 65, 55].map(
        (height, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-2 items-center h-full justify-end"
          >
            <div
              className="bg-mainColor/15 rounded-t w-full"
              style={{ height: `${height}%` }}
            />
            <Skeleton variant="text" width={24} height={10} />
          </div>
        )
      )}
    </div>
    <div className="flex items-center justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={10} height={10} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={10} height={10} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
    </div>
  </div>
);

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-border text-sm">
        <p className="font-semibold text-titleColor mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-gray-600">
            <span style={{ color: item.color }}>●</span>{" "}
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Main Component ─── */
const ProviderPerformanceChart = ({ data, loading }) => {
  const locale = useLocale();
  const t = useTranslations();

  if (loading) return <ProviderPerformanceChartSkeleton />;

  const chartData =
    data?.monthlyRevenue?.map((item) => ({
      month: formatDate(
        new Date(item.year, item.month - 1, 1).toISOString(),
        locale,
        { month: "short" }
      ),
      revenue: item.totalPrice,
      count: item.totalCount,
    })) || [];

  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-card transition-shadow">
      <h3 className="text-base font-semibold text-mainColor mb-4">
        {t("providerProfile.home.analytics.title")}
      </h3>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-main, #007473)"
              radius={[4, 4, 0, 0]}
              name={t("providerProfile.home.analytics.actualTrips")}
              maxBarSize={40}
            />
            <Bar
              dataKey="count"
              fill="#B0E4DD"
              radius={[4, 4, 0, 0]}
              name={t("providerProfile.home.analytics.scheduledLabel")}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[220px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}
    </div>
  );
};

export default memo(ProviderPerformanceChart);
