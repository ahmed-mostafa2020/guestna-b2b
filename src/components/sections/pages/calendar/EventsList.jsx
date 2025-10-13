"use client";

import EventCard from "./EventCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { useTranslations, useLocale } from "next-intl";
import { useState, useMemo } from "react";

const EventsList = ({
  events,
  isLoading,
  title,
  subtitle,
  onView,
  onEdit,
  showPagination = true,
  itemsPerPage = 5,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalItems = events.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return events.slice(startIndex, endIndex);
  }, [events, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border-0">
        <h2 className="text-xl font-medium text-titleColor mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <LoadingState />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border-0">
        <h2 className="text-xl font-medium text-titleColor mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <EmptyState
          title={t("profile.calendar.calendar.noEventsTitle")}
          description={t("profile.calendar.calendar.noEventsDescription")}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border-0">
      <h2 className="text-xl font-medium text-titleColor mb-4">{title}</h2>
      <p className="text-gray-600 pb-4">{subtitle}</p>
      <div className="space-y-4">
        {(showPagination ? paginatedEvents : events).map((event) => (
          <EventCard
            key={event._id || event.id}
            event={event}
            onView={onView}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {showPagination && totalPages > 1 && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Pagination Info */}
            <div className="text-sm text-gray-700">
              {t("pagination.show")} {(currentPage - 1) * itemsPerPage + 1}{" "}
              {t("pagination.to")}{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)},{" "}
              {t("pagination.of")} {totalItems} {t("pagination.allResults")}
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${locale === "ar" ? "" : "rotate-180"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {t("pagination.previous")}
              </button>

              {/* Page Numbers */}
              {(() => {
                const pages = [];
                const maxVisible = 3;
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxVisible / 2)
                );
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 text-sm border rounded-md ${
                        i === currentPage
                          ? "bg-mainColor text-white border-mainColor"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {t("pagination.next")}
                <svg
                  className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;
