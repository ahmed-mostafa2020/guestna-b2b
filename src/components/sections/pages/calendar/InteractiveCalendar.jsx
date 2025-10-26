"use client";

import { useTranslations, useLocale } from "next-intl";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { PERMISSIONS } from "@constants/permissions";

const InteractiveCalendar = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onAddEvent,
}) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const setSelectedDateSafe = (date) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (date >= today) {
      onDateSelect(date);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-lg border-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-medium text-titleColor">
          {t("profile.calendar.calendar.interactiveCalendar")}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="border-2 border-secColor text-mainColor px-4 md:px-6 lg:px-8 py-2 rounded-lg hover:bg-secColor hover:border-secColor hover:text-white transition-all duration-200 font-medium text-sm md:text-base w-full sm:w-auto">
            {t("profile.calendar.calendar.uploadCalendar")}
          </button>
          {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ADD_EVENT) && (
            <button
              onClick={onAddEvent}
              className="border-2 border-mainColor bg-mainColor text-white px-4 md:px-6 lg:px-8 py-2 rounded-lg hover:bg-mainColor/80 hover:border-mainColor/80 hover:text-white transition-all duration-200 font-medium text-sm md:text-base w-full sm:w-auto"
            >
              {t("profile.calendar.calendar.addEvent")}
            </button>
          )}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
        <button
          onClick={() => onMonthChange("prev")}
          className="p-2 md:p-3 hover:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200 hover:shadow-md text-gray-600 hover:text-gray-800 font-bold text-lg md:text-xl flex-shrink-0"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <h4 className="text-base md:text-xl font-semibold text-gray-900 text-center flex-1 min-w-0 truncate px-2">
          {formatDate(currentMonth, locale, {
            year: "numeric",
            month: "long",
          })}
        </h4>
        <button
          onClick={() => onMonthChange("next")}
          className="p-2 md:p-3 hover:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200 hover:shadow-md text-gray-600 hover:text-gray-800 font-bold text-lg md:text-xl flex-shrink-0"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Day Headers */}
        {[
          "الأحد",
          "الاثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ].map((day) => (
          <div
            key={day}
            className="p-1.5 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 rounded-md sm:rounded-lg"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}

        {/* Calendar Days */}
        {getDaysInMonth(currentMonth).map((day, index) => {
          const isPastDate =
            day && day < new Date(new Date().setHours(0, 0, 0, 0));
          const isDisabled = day === null || isPastDate;

          return (
            <div
              key={index}
              className={`p-2 sm:p-2.5 md:p-3 text-center transition-all duration-200 font-medium text-xs sm:text-sm md:text-base aspect-square flex items-center justify-center ${
                day === null
                  ? "text-gray-300"
                  : isPastDate
                  ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-50 rounded-md sm:rounded-lg"
                  : isSameDay(day, selectedDate)
                  ? "bg-black text-white rounded-lg sm:rounded-xl shadow-lg transform scale-105 cursor-pointer"
                  : isToday(day)
                  ? "bg-mainColor/80 text-white rounded-lg sm:rounded-xl border-2 border-mainColor/80 cursor-pointer hover:bg-mainColor hover:border-mainColor"
                  : "hover:bg-gray-100 hover:shadow-md rounded-lg sm:rounded-xl cursor-pointer"
              }`}
              onClick={() => !isDisabled && day && setSelectedDateSafe(day)}
            >
              {day ? day.getDate() : ""}
            </div>
          );
        })}
      </div>

      {/* Calendar Info */}
      {/* <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center text-blue-800 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          <span>{t("profile.calendar.calendar.info")}</span>
        </div>
      </div> */}
    </div>
  );
};

export default InteractiveCalendar;
