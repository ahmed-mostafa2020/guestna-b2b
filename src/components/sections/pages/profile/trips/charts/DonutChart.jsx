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

  // Custom label renderer with contrasting color
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="400"
      >
        {`${name}: ${value}%`}
      </text>
    );
  };

  return (
    <div className="p-4 bg-white border h-fit rounded-xl border-border hover:shadow-card">
      <h2 className="pb-4 text-lg font-medium lg:text-xl text-titleColor">
        {t("profile.donutChart.title")}
      </h2>

      {infoData?.bestSellingActivities?.length ? (
        <div className="h-[320px]">
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
                label={renderCustomLabel}
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
        <div className="h-[320px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}
    </div>
  );
};

export default memo(DonutChart);
