"use client";

import { useTranslations } from "next-intl";

const InteractiveCalendar = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onAddEvent,
}) => {
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

  const formatDate = (date) => {
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
    });
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
    <div className="bg-white rounded-xl p-8 shadow-lg border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button className="border-2 border-orange-300 text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 font-medium">
            رفع التقويم
          </button>
          <button
            onClick={onAddEvent}
            className="border-2 border-green-300 text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all duration-200 font-medium"
          >
            {t("profile.calendar.calendar.addEvent")}
          </button>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {t("profile.calendar.calendar.interactiveCalendar")}
        </h3>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onMonthChange("prev")}
          className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md text-gray-600 hover:text-gray-800 font-bold text-xl"
        >
          &lt;
        </button>
        <h4 className="text-xl font-semibold text-gray-900">
          {formatDate(currentMonth)}
        </h4>
        <button
          onClick={() => onMonthChange("next")}
          className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md text-gray-600 hover:text-gray-800 font-bold text-xl"
        >
          &gt;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
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
            className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg"
          >
            {day}
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
              className={`p-3 text-center transition-all duration-200 font-medium ${
                day === null
                  ? "text-gray-300"
                  : isPastDate
                  ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-50"
                  : isSameDay(day, selectedDate)
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg transform scale-105 cursor-pointer"
                  : isToday(day)
                  ? "bg-green-100 text-green-800 rounded-xl border-2 border-green-200 cursor-pointer hover:bg-green-200"
                  : "hover:bg-gray-100 hover:shadow-md rounded-xl cursor-pointer"
              }`}
              onClick={() => !isDisabled && day && setSelectedDateSafe(day)}
            >
              {day ? day.getDate() : ""}
            </div>
          );
        })}
      </div>

      {/* Calendar Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center text-blue-800 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          <span>{t("profile.calendar.calendar.info")}</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCalendar;
