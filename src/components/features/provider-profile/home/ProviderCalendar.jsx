"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState, useCallback } from "react";
import Skeleton from "@mui/material/Skeleton";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import formatDate from "@utils/formatters/FormateDate";

/* ─── Skeleton ─── */
export const ProviderCalendarSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 animate-pulse h-full flex flex-col justify-between">
    <Skeleton variant="text" width="50%" height={28} className="mb-3" />
    <div className="flex items-center justify-between mb-3">
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
    <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 h-full flex flex-col justify-between shadow-card">
      {/* Header with Title and Month Controls (Responsive without overlap) */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-lg sm:text-xl font-bold text-mainColor shrink-0">
          {t("providerProfile.home.calendar.title")}
        </h3>

        {/* Month Navigation */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-gray-50 border border-border rounded-xl px-1.5 py-0.5">
          <button
            onClick={() => handleMonthChange("prev")}
            className="p-1 hover:bg-white rounded-lg transition-colors text-textLight cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronRight className="!w-4 !h-4" />
          </button>
          <span className="text-xs sm:text-sm font-bold text-textDark min-w-[80px] sm:min-w-[110px] text-center whitespace-nowrap px-1">
            <span className="hidden sm:inline">
              {formatDate(currentMonth, locale, {
                year: "numeric",
                month: "long",
              })}
            </span>
            <span className="sm:hidden">
              {formatDate(currentMonth, locale, {
                year: "numeric",
                month: "short",
              })}
            </span>
          </span>
          <button
            onClick={() => handleMonthChange("next")}
            className="p-1 hover:bg-white rounded-lg transition-colors text-textLight cursor-pointer"
            aria-label="Next month"
          >
            <ChevronLeft className="!w-4 !h-4" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
        {dayHeaders.map((day) => (
          <span
            key={day}
            className="py-1 text-[11px] sm:text-xs font-semibold text-textLight truncate"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
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
              className={`aspect-square flex items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-mainColor text-white shadow-sm font-black scale-105"
                  : isHighlighted
                  ? "bg-mainColor/15 text-mainColor font-black hover:bg-mainColor/25"
                  : isCurrentDay
                  ? "bg-gray-100 text-mainColor font-bold border-2 border-mainColor/30"
                  : "text-textDark hover:bg-gray-100"
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
