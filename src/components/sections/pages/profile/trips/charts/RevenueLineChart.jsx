import { useTranslations, useLocale } from "next-intl";

import { memo } from "react";

import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

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

const RevenueLineChart = ({ infoData }) => {
  const locale = useLocale();
  const t = useTranslations();

  const lineData =
    infoData?.monthlyRevenue?.map((item) => ({
      month: formatDate(
        new Date(item.year, item.month - 1, 1).toISOString(),
        locale,
        { year: "numeric", month: "long" }
      ),
      revenue: item.totalPrice,
    })) || [];

  return (
    <div className="p-4 bg-white border lg:col-span-9 rounded-xl border-border hover:shadow-card">
      <h2 className="pb-4 text-lg font-medium lg:text-xl text-titleColor">
        {t("profile.revenueLineChart.title")}
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2}
            name={t("profile.revenueLineChart.label")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(RevenueLineChart);
