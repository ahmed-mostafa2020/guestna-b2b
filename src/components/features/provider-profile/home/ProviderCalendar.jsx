"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState, useCallback } from "react";
import Skeleton from "@mui/material/Skeleton";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import formatDate from "@utils/formatters/FormateDate";

/* ─── Skeleton ─── */
export const ProviderCalendarSkeleton = () => (
  <div className="bg-white border border-border rounded-xl p-5 animate-pulse">
    <Skeleton variant="text" width="45%" height={24} className="mb-4" />
    {/* Month nav */}
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="text" width="40%" height={22} />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
    {/* Day headers */}
    <div className="grid grid-cols-7 gap-1 mb-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} variant="text" height={20} className="rounded" />
      ))}
    </div>
    {/* Calendar grid (5 rows x 7 cols) */}
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={36}
          className="rounded-lg"
        />
      ))}
    </div>
  </div>
);

/* ─── Helpers ─── */
const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  return days;
};

const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

const formatYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* ─── Main Component ─── */
const ProviderCalendar = ({
  highlightedDates = [],
  onDateSelect,
  selectedDate,
  loading,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const dayHeaders = useMemo(
    () => [
      t("providerProfile.home.calendar.sun"),
      t("providerProfile.home.calendar.mon"),
      t("providerProfile.home.calendar.tue"),
      t("providerProfile.home.calendar.wed"),
      t("providerProfile.home.calendar.thu"),
      t("providerProfile.home.calendar.fri"),
      t("providerProfile.home.calendar.sat"),
    ],
    [t]
  );

  const highlightedSet = useMemo(
    () => new Set(highlightedDates),
    [highlightedDates]
  );

  const handleMonthChange = useCallback((direction) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + (direction === "next" ? 1 : -1));
      return next;
    });
  }, []);

  const handleDateClick = useCallback(
    (day) => {
      if (day && onDateSelect) {
        onDateSelect(formatYMD(day));
      }
    },
    [onDateSelect]
  );

  if (loading) return <ProviderCalendarSkeleton />;

  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h3 className="text-base font-semibold text-mainColor mb-4">
        {t("providerProfile.home.calendar.title")}
      </h3>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange("prev")}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          aria-label="Previous month"
        >
          <ChevronLeft className="!w-5 !h-5" />
        </button>
        <h4 className="text-sm font-semibold text-gray-800">
          {formatDate(currentMonth, locale, {
            year: "numeric",
            month: "long",
          })}
        </h4>
        <button
          onClick={() => handleMonthChange("next")}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          aria-label="Next month"
        >
          <ChevronRight className="!w-5 !h-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const ymd = formatYMD(day);
          const isHighlighted = highlightedSet.has(ymd);
          const isSelected = selectedDate === ymd;
          const isCurrentDay = isSameDay(day, today);

          return (
            <button
              key={ymd}
              onClick={() => handleDateClick(day)}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-mainColor text-white shadow-md"
                  : isHighlighted
                  ? "bg-mainColor/15 text-mainColor font-semibold hover:bg-mainColor/25"
                  : isCurrentDay
                  ? "bg-gray-100 text-mainColor font-semibold border border-mainColor/30"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ProviderCalendar);
