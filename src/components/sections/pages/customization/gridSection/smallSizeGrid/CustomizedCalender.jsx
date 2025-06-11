"use client";

import { useTranslations } from "next-intl";

import { Fragment, useMemo, useState } from "react";

import { chevronLeftIcon, chevronRightIcon } from "@assets/svg";

// Utility to generate calendar grid
const generateCalendar = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Fix: Use month + 1 for correct daysInMonth

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
      <div key={index} className="p-2 text-sm font-light text-center">
        {day}
      </div>
    ))}
  </div>
);

const CustomizedCalender = ({ availableDays, onDateChange }) => {
  const t = useTranslations();

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // State for current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Check if a date is available
  const isDateAvailable = (date) => {
    return availableDays?.includes(date.toISOString().split("T")[0]);
  };

  // Handle changing day
  const handleChangingDay = (dateString, isAvailable) => {
    if (isAvailable) {
      // Set the selected date
      setSelectedDate(dateString);

      onDateChange(dateString);
    }
  };

  // Handle month navigation
  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === "next") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Generate calendar grid
  const calendar = useMemo(
    () => generateCalendar(currentMonth, currentYear),
    [currentMonth, currentYear]
  );

  // Get month name
  const getMonthName = (month) => {
    return t(`months.${MONTH_NAMES[month] || MONTH_NAMES[0]}`);
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
        <h2 className="text-xl font-medium text-[#828282]">
          {getMonthName(currentMonth)} {currentYear}
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
          <Fragment key={weekIndex}>
            {week.map((dayNum, dayIndex) => {
              if (!dayNum) return <div key={`${weekIndex}-${dayIndex}`} />; // Skip empty cells

              const dateString = `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isAvailable = isDateAvailable(new Date(dateString));

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`font-light px-4 py-2 text-center rounded-md select-none ${
                    selectedDate === dateString
                      ? "bg-mainColor text-white"
                      : isAvailable
                      ? "bg-white hover:bg-gray-200 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => handleChangingDay(dateString, isAvailable)}
                >
                  {dayNum}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default CustomizedCalender;
