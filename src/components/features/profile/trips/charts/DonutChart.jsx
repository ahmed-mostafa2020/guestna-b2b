"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { CHART_COLORS } from "@constants/chartColors";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";

// Custom active shape for highlighted donut slice on hover
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.18))",
          transition: "all 0.3s ease",
        }}
      />
    </g>
  );
};

// Custom rich tooltip outside component to avoid remounting on every render
const CustomTooltip = ({ active, payload, percentageLabel }) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-border text-xs z-50">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-bold text-textDark text-sm">{data.name}</span>
      </div>
      <div className="text-textLight flex items-center justify-between gap-4">
        <span>{percentageLabel}:</span>
        <span className="font-extrabold text-textDark">
          {`\u200E${data.value}%`}
        </span>
      </div>
    </div>
  );
};

const DonutChart = ({ infoData }) => {
  const t = useTranslations();
  const [activeIndex, setActiveIndex] = useState(null);

  const pieData = useMemo(() => {
    return (
      infoData?.bestSellingActivities?.map((activity, index) => ({
        name: activity.category,
        value: Number(activity.percentage) || 0,
        color: activity.color || CHART_COLORS[index % CHART_COLORS.length],
      })) || []
    );
  }, [infoData?.bestSellingActivities]);

  const topActivity = useMemo(() => {
    if (!pieData.length) return null;
    return [...pieData].sort((a, b) => b.value - a.value)[0];
  }, [pieData]);

  const activeItem = activeIndex !== null ? pieData[activeIndex] : null;

  return (
    <div className="p-4 bg-white border h-fit rounded-xl border-border hover:shadow-card">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-medium lg:text-xl text-titleColor">
          {t("profile.donutChart.title")}
        </h2>
        {pieData.length > 0 && (
          <span className="text-xs font-medium text-textLight bg-gray-100 px-2.5 py-1 rounded-full">
            {pieData.length} {t("profile.donutChart.activities")}
          </span>
        )}
      </div>

      {pieData.length ? (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Donut Chart Container with Center Summary */}
          <div className="relative w-full lg:w-1/2 h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  cursor="pointer"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        activeIndex === null || activeIndex === index ? 1 : 0.45
                      }
                      style={{ transition: "opacity 0.2s ease" }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <CustomTooltip
                      percentageLabel={t("profile.donutChart.percentage")}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Interactive Center Information */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-2 text-center select-none">
              {activeItem ? (
                <>
                  <span className="text-[11px] font-semibold text-textLight truncate max-w-[95px]">
                    {activeItem.name}
                  </span>
                  <span
                    className="text-lg font-black mt-0.5"
                    style={{ color: activeItem.color }}
                  >
                    {`\u200E${activeItem.value}%`}
                  </span>
                </>
              ) : topActivity ? (
                <>
                  <span className="text-[10px] font-medium text-textLight">
                    {t("profile.donutChart.topActivity")}
                  </span>
                  <span className="text-[11px] font-bold text-titleColor truncate max-w-[95px]">
                    {topActivity.name}
                  </span>
                  <span className="text-base font-extrabold text-mainColor">
                    {`\u200E${topActivity.value}%`}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {/* Compact Aside List: Single-Row, Elegant, No Overflow */}
          <div
            className="w-full lg:w-1/2 flex flex-col gap-1 overflow-y-auto overflow-x-hidden max-h-[220px]"
            role="list"
            aria-label={t("profile.donutChart.title")}
          >
            {pieData.map((item, index) => {
              const isHovered = activeIndex === index;
              return (
                <button
                  key={`activity-item-${index}`}
                  type="button"
                  role="listitem"
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-start transition-colors duration-150 cursor-pointer ${
                    isHovered
                      ? "bg-gray-100 text-textDark"
                      : "hover:bg-gray-50 text-textDark"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() =>
                    setActiveIndex(isHovered ? null : index)
                  }
                  aria-label={`${item.name}: ${item.value}%`}
                >
                  {/* Color dot & Activity Title */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-150"
                      style={{
                        backgroundColor: item.color,
                        transform: isHovered ? "scale(1.25)" : "scale(1)",
                      }}
                    />
                    <span
                      className={`text-xs truncate transition-colors ${
                        isHovered
                          ? "font-bold text-textDark"
                          : "font-medium text-textDark"
                      }`}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Inline Micro Progress Bar & Percentage */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-12 sm:w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(item.value, 4))}%`,
                          backgroundColor: item.color,
                          opacity: isHovered ? 1 : 0.85,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-textDark min-w-[42px] text-end">
                      {`\u200E${item.value}%`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-[220px]">
          <EmptyBookings subTitle={false} hasLink={false} />
        </div>
      )}
    </div>
  );
};

export default memo(DonutChart);
