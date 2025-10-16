"use client";

import { useTranslations } from "next-intl";

import { memo } from "react";

import { CHART_COLORS } from "@constants/chartColors";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import EmptyBookings from "../../myBookings/EmptyBookings";

const DonutChart = ({ infoData }) => {
  const t = useTranslations();

  const pieData =
    infoData?.bestSellingActivities?.map((activity) => ({
      name: activity.category,
      value: activity.percentage,
    })) || [];

  return (
    <div className="p-4 bg-white border h-fit lg:col-span-3 rounded-xl border-border hover:shadow-card">
      <h2 className="pb-4 text-lg font-medium lg:text-xl text-titleColor">
        {t("profile.donutChart.title")}
      </h2>

      {infoData?.bestSellingActivities?.length ? (
        <div className="w-full h-[200px]">
          {/* Fixed height container */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.color || CHART_COLORS[index % CHART_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}
    </div>
  );
};

export default memo(DonutChart);
