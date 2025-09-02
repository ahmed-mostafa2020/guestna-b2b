"use client";

import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  updateCheckInDate,
  navigateMonthCheckIn,
  updateCheckOutDate,
  navigateMonthCheckOut,
  updateActivityDayDate,
  navigateMonthActivityDay,
} from "@store/searchFilter/searchFilterSlice";

import React, { useMemo } from "react";

import { chevronLeftIcon, chevronRightIcon } from "@assets/svg";

// Utility to generate calendar grid
const generateCalendar = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendar = [[]];
  let currentWeek = 0;

  // Fill initial empty cells
  for (let i = 0; i < firstDay; i++) {
    calendar[currentWeek].push(null);
  }

  // Fill days
  for (let day = 1; day <= daysInMonth; day++) {
    if (calendar[currentWeek].length === 7) {
      currentWeek++;
      calendar[currentWeek] = [];
    }
    calendar[currentWeek].push(day);
  }

  return calendar;
};

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const WeekDays = ({ t }) => (
  <div className="grid grid-cols-7 gap-1">
    {[
      t("weekDays.sunday"),
      t("weekDays.monday"),
      t("weekDays.tuesday"),
      t("weekDays.wednesday"),
      t("weekDays.thursday"),
      t("weekDays.friday"),
      t("weekDays.saturday"),
    ].map((day, index) => (
      <div key={index} className="p-2 text-sm text-center">
        {day}
      </div>
    ))}
  </div>
);

const Calender = ({ type }) => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const dateSelector = useSelector((state) =>
    type === "checkIn"
      ? state.searchFilter.checkInDate
      : type === "checkOut"
      ? state.searchFilter.checkOutDate
      : state.searchFilter.activityDayDate
  );
  const { day, month, year } = dateSelector;

  const getMonthName = (month) => {
    if (month < 0 || month > 11) {
      console.warn("Month out of range:", month);
    }
    return t(`months.${MONTH_NAMES[month] || MONTH_NAMES[0]}`);
  };

  // Generate calendar grid
  const calendar = useMemo(() => generateCalendar(month, year), [month, year]);

  // Handle day click
  const handleDayClick = (selectedDay) => {
    const action =
      type === "checkIn"
        ? updateCheckInDate
        : type === "checkOut"
        ? updateCheckOutDate
        : updateActivityDayDate;

    dispatch(
      action({
        day: selectedDay,
        month,
        year,
      })
    );
  };

  // Handle month navigation
  const handleMonthChange = (direction) => {
    const action =
      type === "checkIn"
        ? navigateMonthCheckIn
        : type === "checkOut"
        ? navigateMonthCheckOut
        : navigateMonthActivityDay;

    dispatch(action({ direction }));
  };

  return (
    <div className="space-y-4 bg-white">
      {/* Month Navigation */}
      <div className="flex items-center justify-between py-2 border-b border-border">
        <button
          onClick={() => handleMonthChange("next")}
          className="p-2 rounded hover:bg-gray-200"
        >
          {chevronRightIcon}
        </button>
        <h2 className="text-xl font-medium text-[#828282] transition-all duration-200 ease-in-out">
          {getMonthName(month)} {year}
        </h2>
        <button
          onClick={() => handleMonthChange("prev")}
          className="p-2 rounded hover:bg-gray-200"
        >
          {chevronLeftIcon}
        </button>
      </div>

      {/* Weekdays Header */}
      <WeekDays t={t} />

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map(
              (dayNum, dayIndex) =>
                dayNum && (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`px-4 py-2 text-center cursor-pointer rounded-md select-none ${
                      dayNum === day
                        ? "bg-mainColor text-white"
                        : "bg-white hover:bg-gray-200"
                    }`}
                    onClick={() => handleDayClick(dayNum)}
                  >
                    {dayNum}
                  </div>
                )
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calender;
