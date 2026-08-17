"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState, useCallback } from "react";
import Skeleton from "@mui/material/Skeleton";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import formatDate from "@utils/formatters/FormateDate";

/* ─── Skeleton ─── */
export const ProviderCalendarSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 animate-pulse h-full flex flex-col justify-between">
    <Skeleton variant="text" width="45%" height={26} className="mb-4" />
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="circular" width={28} height={28} />
      <Skeleton variant="text" width="35%" height={22} />
      <Skeleton variant="circular" width={28} height={28} />
    </div>
    <div className="grid grid-cols-7 gap-1 mb-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} variant="text" height={16} className="rounded" />
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1.5 flex-1">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={32} className="rounded-lg" />
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
    <div className="bg-white border border-border rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-mainColor">
          {t("providerProfile.home.calendar.title")}
        </h3>

        {/* Month Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleMonthChange("prev")}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronRight className="!w-4 !h-4" />
          </button>
          <span className="text-xs font-semibold text-gray-700 min-w-[90px] text-center">
            {formatDate(currentMonth, locale, {
              year: "numeric",
              month: "short",
            })}
          </span>
          <button
            onClick={() => handleMonthChange("next")}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 cursor-pointer"
            aria-label="Next month"
          >
            <ChevronLeft className="!w-4 !h-4" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {dayHeaders.map((day) => (
          <span
            key={day}
            className="py-1 text-[11px] font-medium text-gray-400"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
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
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-[#007473] text-white shadow-sm font-bold scale-105"
                  : isHighlighted
                  ? "bg-[#007473]/15 text-[#007473] font-bold hover:bg-[#007473]/25"
                  : isCurrentDay
                  ? "bg-gray-100 text-[#007473] font-semibold border border-[#007473]/30"
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
