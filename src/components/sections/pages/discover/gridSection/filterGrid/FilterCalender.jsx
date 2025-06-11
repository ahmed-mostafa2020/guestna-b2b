"use client";

import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  updateCheckInDate,
  updateCheckOutDate,
  navigateMonthCheckIn,
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
      <div key={index} className="text-[11px] text-center">
        {day}
      </div>
    ))}
  </div>
);

const FilterCalender = () => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const { checkInDate, checkOutDate, activityDayDate } = useSelector(
    (state) => state.searchFilter
  );
  const { month, year } = checkInDate; // Use checkInDate for month and year navigation

  const getMonthName = (month) => {
    return t(`months.${MONTH_NAMES[month] || MONTH_NAMES[0]}`);
  };

  // Generate calendar grid
  const calendar = useMemo(() => generateCalendar(month, year), [month, year]);

  // Handle day click
  const handleDayClick = (selectedDay) => {
    const selectedDate = new Date(year, month, selectedDay);

    // If no check-in date is selected, set it as the check-in date
    if (!checkInDate.day) {
      dispatch(updateCheckInDate({ day: selectedDay, month, year }));
    }
    // If check-in date is selected but no check-out date, set it as the check-out date
    else if (!checkOutDate.day) {
      // Ensure the check-out date is after the check-in date
      if (
        selectedDate >=
        new Date(checkInDate.year, checkInDate.month, checkInDate.day)
      ) {
        dispatch(updateCheckOutDate({ day: selectedDay, month, year }));
      }
    }
    // If both dates are selected, reset and set the new check-in date
    else {
      dispatch(updateCheckInDate({ day: selectedDay, month, year }));
      dispatch(updateCheckOutDate({ day: null, month: null, year: null }));
    }
  };

  // Handle month navigation
  const handleMonthChange = (direction) => {
    dispatch(navigateMonthCheckIn({ direction }));
  };

  // Check if a day is within the selected range
  const isDayInRange = (dayNum) => {
    if (!checkInDate.day || !checkOutDate.day) return false;
    const currentDate = new Date(year, month, dayNum);
    const startDate = new Date(
      checkInDate.year,
      checkInDate.month,
      checkInDate.day
    );
    const endDate = new Date(
      checkOutDate.year,
      checkOutDate.month,
      checkOutDate.day
    );
    return currentDate >= startDate && currentDate <= endDate;
  };

  return (
    <div className="space-y-4 bg-white rounded-lg">
      {/* Month Navigation */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <button
          onClick={() => handleMonthChange("next")}
          className="p-2 rounded hover:bg-gray-200"
        >
          {chevronRightIcon}
        </button>
        <h2 className="text-xl font-medium text-[#828282]">
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
      <div className="grid grid-cols-7 gap-1 px-1 pb-4">
        {calendar.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((dayNum, dayIndex) =>
              dayNum ? (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`py-2 text-center cursor-pointer rounded-md select-none ${
                    isDayInRange(dayNum)
                      ? "bg-mainColor text-white"
                      : dayNum === (checkInDate.day || activityDayDate.day) &&
                        month ===
                          (checkInDate.month || activityDayDate.month) &&
                        year === (checkInDate.year || activityDayDate.year)
                      ? "bg-mainColor text-white"
                      : dayNum === checkOutDate.day &&
                        month === checkOutDate.month &&
                        year === checkOutDate.year
                      ? "bg-mainColor text-white"
                      : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={() => handleDayClick(dayNum)}
                >
                  {dayNum}
                </div>
              ) : (
                <div key={`${weekIndex}-${dayIndex}`} />
              )
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FilterCalender;
