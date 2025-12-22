"use client";

import { useTranslations } from "next-intl";

import { memo, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";

const AnimatedCircularMonthCounter = ({ onMonthSelect }) => {
  const [month, setMonth] = useState(1);
  const t = useTranslations();

  const monthNames = [
    t("months.january"),
    t("months.february"),
    t("months.march"),
    t("months.april"),
    t("months.may"),
    t("months.june"),
    t("months.july"),
    t("months.august"),
    t("months.september"),
    t("months.october"),
    t("months.november"),
    t("months.december"),
  ];

  const calculateAngleAndMonth = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;
    let angle = Math.atan2(y, x) * (180 / Math.PI);

    angle = (angle + 360) % 360;
    angle = (angle + 90) % 360;

    const selectedMonth = Math.floor(angle / 30) + 1;

    setMonth(selectedMonth);
    onMonthSelect?.(selectedMonth);
  };

  return (
    <div className="flex flex-col items-center px-2 pt-6 md:px-10">
      <Box
        className="relative w-[277px] h-[270px] cursor-pointer"
        onClick={calculateAngleAndMonth}
      >
        <div className="absolute inset-0 bg-gray-100 rounded-full">
          {monthNames.map((monthName, i) => {
            const isSelected = i + 1 === month;
            const angle = i * 30 - 60;
            return (
              <Tooltip key={i} title={monthName} placement="top">
                <div
                  className={`absolute w-3 h-3 rounded-full transition-all duration-300 
                  ${
                    isSelected
                      ? "bg-pink-500 scale-150"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${angle}deg) translate(127px) translate(-50%, -50%)`,
                  }}
                />
              </Tooltip>
            );
          })}
        </div>

        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E91E63"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(month / 12) * 283} 283`}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* Inner white circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full shadow-lg w-52 h-52" />
        </div>

        {/* Progress circle edge */}
        {/* <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full" />
      </div> */}

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Typography
            variant="h1"
            className="mb-2 !font-bold text-black !text-7xl"
          >
            {month}
          </Typography>
          <Typography variant="h6" className="text-xl font-semibold text-black">
            {monthNames[month - 1]}
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default memo(AnimatedCircularMonthCounter);
