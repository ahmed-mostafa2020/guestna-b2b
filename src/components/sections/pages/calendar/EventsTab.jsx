"use client";

import { useLocale, useTranslations } from "next-intl";

import EventCard from "./EventCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import formatDate from "@utils/FormateDate";
import { getEventTypeLabel, getEventTypeColor } from "@utils/eventTypeUtils";

const EventsTab = ({ events, isLoading, onView, onEdit }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="bg-white rounded-xl shadow-lg border-0">
      {/* Search and Filter Section */}
      <div className="p-6 border-b border-gray-100">
        {/* Title and Print Button Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-green-600">البحث</h2>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold">
            طباعة التقرير
          </button>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none">
              <option>اسم الحدث</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none">
              <option>نوع الحدث</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none">
              <option>تاريخ الحدث</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none">
              <option>الموقع</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Events List Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-green-600 mb-6">
          جميع الأحداث
        </h3>
        {isLoading ? (
          <LoadingState />
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id || event.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-sm text-gray-500 font-medium">
                      {formatDate(event.day, locale, {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {event.about}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        الموقع: {event.place} | المشاركون:{" "}
                        {event.participantsCount} | الوقت: {event.time}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                          event.happeningType,
                          "light"
                        )}`}
                      >
                        {getEventTypeLabel(event.happeningType, t)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3 space-x-reverse">
                    <button
                      onClick={() => onView(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      مشاهدة
                    </button>
                    <button
                      onClick={() => onEdit(event)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("profile.calendar.events.noEventsTitle")}
            description={t("profile.calendar.events.noEventsDescription")}
          />
        )}
      </div>
    </div>
  );
};

export default EventsTab;
