"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo } from "react";
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
  <div className="bg-white border border-border rounded-2xl p-5 h-full animate-pulse flex flex-col justify-between">
    <div className="flex justify-between items-center mb-4">
      <Skeleton variant="text" width="35%" height={26} />
    </div>
    <div className="h-[240px] bg-gray-50/70 rounded-xl flex items-end justify-between gap-3 p-4">
      {[25, 45, 20, 65, 35, 80, 30, 50, 90, 40, 55, 45].map((h, i) => (
        <div key={i} className="w-full flex flex-col gap-2 items-center h-full justify-end">
          <div
            className="bg-[#ED8A22]/20 rounded-t w-3 sm:w-4"
            style={{ height: `${h}%` }}
          />
          <Skeleton variant="text" width={18} height={10} />
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center gap-6 mt-4 pt-2">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={8} height={8} />
        <Skeleton variant="text" width={70} height={14} />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={8} height={8} />
        <Skeleton variant="text" width={70} height={14} />
      </div>
    </div>
  </div>
);

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-white shadow-xl rounded-xl p-3 border border-gray-100 text-xs min-w-[130px] animate-in fade-in zoom-in-95 duration-150">
        <p className="font-bold text-[#3B2844] text-center text-sm mb-2 border-b border-gray-100 pb-1">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ED8A22] inline-block" />
              <span>{t("providerProfile.home.analytics.actualTrips")}:</span>
            </span>
            <span className="font-semibold">{data?.revenue ?? 0}</span>
          </div>

          <div className="flex items-center justify-between gap-2 text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#78D3C8] inline-block" />
              <span>{t("providerProfile.home.analytics.scheduledLabel")}:</span>
            </span>
            <span className="font-semibold">{data?.count ?? 0}</span>
          </div>
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
    <div className="bg-white border border-border rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-[#ED8A22]">
          {t("providerProfile.home.analytics.title")}
        </h3>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip t={t} />}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)", radius: 6 }}
              />
              <Bar
                dataKey="revenue"
                fill="#ED8A22"
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

      {/* Legend at bottom */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ED8A22]" />
          <span>{t("providerProfile.home.analytics.actualSales")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#78D3C8]" />
          <span>{t("providerProfile.home.analytics.targetSales")}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderPerformanceChart);
