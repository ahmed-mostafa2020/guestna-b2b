"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ProviderRevenueChartSkeleton = () => {
  return (
    <div className="p-4 bg-white border rounded-xl border-border animate-pulse shadow-sm">
      {/* Title Skeleton */}
      <div className="h-6 lg:h-7 bg-gray-200 rounded w-1/4 mb-6"></div>

      {/* Chart Canvas Skeleton */}
      <div className="h-[320px] bg-gray-50/50 rounded-xl flex items-end justify-between gap-3 p-6 border border-gray-100">
        {[45, 60, 35, 75, 50, 85, 40, 65, 90, 55, 70, 60].map((height, index) => (
          <div key={index} className="w-full flex flex-col gap-3 items-center h-full justify-end">
            <div
              className="bg-mainColor/15 rounded-t-md w-full transition-all duration-300"
              style={{ height: `${height}%` }}
            ></div>
            <div className="w-8 h-3 bg-gray-200 rounded-sm"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProviderRevenueChart = ({ data, loading = false }) => {
  const locale = useLocale();
  const t = useTranslations();

  if (loading) {
    return <ProviderRevenueChartSkeleton />;
  }

  const lineData =
    data?.monthlyRevenue?.map((item) => ({
      month: formatDate(
        new Date(item.year, item.month - 1, 1).toISOString(),
        locale,
        { year: "numeric", month: "short" }
      ),
      revenue: item.totalPrice,
      count: item.totalCount,
    })) || [];

  return (
    <div className="p-4 bg-white border rounded-xl border-border hover:shadow-card">
      <h2 className="pb-4 text-lg font-medium lg:text-xl text-titleColor">
        {t("providerProfile.revenueChart.title")}
      </h2>
      {data?.monthlyRevenue?.length ? (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === t("providerProfile.revenueChart.label")
                  ? formatCurrency(Number(value))
                  : value,
                name,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-main, #3B82F6)"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              name={t("providerProfile.revenueChart.label")}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[220px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}
    </div>
  );
};

export default memo(ProviderRevenueChart);
