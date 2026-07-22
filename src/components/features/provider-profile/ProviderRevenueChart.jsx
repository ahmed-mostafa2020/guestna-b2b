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

const ProviderRevenueChart = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();

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
