"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import AddEventForm from "@components/forms/AddEventForm";
import EventDetailsModal from "@components/forms/EventDetailsModal";
import {
  SummaryCards,
  TabNavigation,
  InteractiveCalendar,
  EventsList,
} from "@components/sections/pages/calendar";

import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import formatDate from "@utils/FormateDate";
import { getEventTypeColor } from "@utils/eventTypeUtils";
import { getEventTypeLabel } from "@utils/eventTypeUtils";
import { CircularProgress } from "@mui/material";

const CalendarPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  // Helper function to format date for API (avoids timezone issues)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [eventToView, setEventToView] = useState(null);

  // Filter state for events tab
  const [filters, setFilters] = useState({
    searchTerm: "",
    day: "",
    happeningType: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  // Fetch events counts for summary cards
  const {
    data: countsData,
    isLoading: countsLoading,
    refetch: refetchCounts,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.HAPPENINGS.COUNTS,
    {},
    { method: "GET", lang: locale }
  );

  // Fetch events for selected date (calendar tab - filter by selected day only)
  const {
    data: selectedDateEvents,
    refetch: refetchSelectedDateEvents,
    isLoading: selectedDateEventsLoading,
    isFetching: selectedDateEventsFetching,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.HAPPENINGS.ALL,
    {},
    {
      method: "POST",
      lang: locale,
      body: {
        sort: "NEWEST",
        filter: {
          day: formatDateForAPI(selectedDate),
        },
        page: 1,
        perPage: 10,
      },
    }
  );

  // Build filter object for events tab (only include non-empty values)
  const buildEventsFilter = () => {
    if (activeTab !== "events") return {};

    const filter = {};

    // Only add non-empty values to filter
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      filter.searchTerm = filters.searchTerm.trim();
    }
    if (filters.day && filters.day !== "") {
      filter.day = filters.day;
    }
    if (filters.happeningType && filters.happeningType !== "") {
      filter.happeningType = filters.happeningType;
    }

    return filter;
  };

  // Fetch all events for events tab (conditional filter object)
  const {
    data: allEvents,
    refetch: refetchAllEvents,
    isLoading: allEventsLoading,
    isFetching: allEventsFetching,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.HAPPENINGS.ALL,
    {},
    {
      method: "POST",
      body: {
        sort: "NEWEST",
        ...(Object.keys(buildEventsFilter()).length > 0 && {
          filter: buildEventsFilter(),
        }),
        page: currentPage,
        perPage: perPage,
      },
    }
  );

  // Function to safely set selected date (prevent past dates)
  const setSelectedDateSafe = (date) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (date >= today) {
      setSelectedDate(date);
    }
  };

  // Get events for selected date from API data
  const getEventsForDate = (date) => {
    if (!selectedDateEvents?.nodes) return [];
    return selectedDateEvents.nodes || [];
  };

  // Get all events for events tab from API data
  const getEventsList = () => {
    if (!allEvents?.nodes) return [];
    return allEvents.nodes || [];
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "next") {
        newMonth.setMonth(prev.getMonth() + 1);
      } else {
        newMonth.setMonth(prev.getMonth() - 1);
      }
      return newMonth;
    });
  };

  // Refetch events when selected date changes
  useEffect(() => {
    refetchSelectedDateEvents();
  }, [selectedDate, refetchSelectedDateEvents]);

  // Handle successful event addition
  const handleEventAdded = () => {
    refetchSelectedDateEvents();
    refetchAllEvents();
    refetchCounts(); // Also refetch the counts data to update summary cards
  };

  // Valid happeningType values
  const validHappeningTypes = [
    "TRIP",
    "METING",
    "TRAINING",
    "CONFERENCE",
    "ACADEMIC",
    "LEAVE",
    "EXAM",
    "OTHER",
  ];

  // Handle filter changes with validation
  const handleFilterChange = (filterType, value) => {
    // Validate happeningType
    if (
      filterType === "happeningType" &&
      value &&
      !validHappeningTypes.includes(value)
    ) {
      console.warn(
        `Invalid happeningType: ${value}. Must be one of: ${validHappeningTypes.join(
          ", "
        )}`
      );
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle pagination changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  };

  // Refetch events when filters change (only for events tab)
  useEffect(() => {
    if (activeTab === "events") {
      refetchAllEvents();
    }
  }, [filters, currentPage, perPage, activeTab, refetchAllEvents]);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.calendar.pageHeader.title"
    )}`;
  }, [t]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Summary Cards */}
      <SummaryCards countsData={countsData} isLoading={countsLoading} />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {countsLoading || allEvents?.isLoading ? (
        <FullScreenLoading status="pending" />
      ) : (
        <div className="relative">
          {/* Loading Overlay for Date Changes */}
          {(selectedDateEventsLoading || selectedDateEventsFetching) && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-xl">
              <div className="flex flex-col items-center">
                <CircularProgress size={30} color="primary" />
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Right Column - Interactive Calendar */}
              <InteractiveCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onMonthChange={navigateMonth}
                onAddEvent={() => {
                  setEventToEdit(null);
                  setShowAddEventModal(true);
                }}
              />

              {/* Left Column - Events List */}
              <EventsList
                events={getEventsForDate(selectedDate)}
                isLoading={
                  selectedDateEventsLoading || selectedDateEventsFetching
                }
                title={t("profile.calendar.calendar.selectedDayEvents")}
                subtitle={formatDate(selectedDate, locale, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                onView={(event) => {
                  setEventToView(event);
                  setShowEventDetailsModal(true);
                }}
                onEdit={(event) => {
                  setEventToEdit(event);
                  setShowAddEventModal(true);
                }}
                showPagination={true}
                itemsPerPage={3}
              />
            </div>
          )}

          {activeTab === "events" && (
            <div className=" rounded-xl  border-0">
              {/* Search and Filter Section */}
              <div className="bg-white p-4 border-b rounded-2xl border border-border ">
                {/* Title and Print Button Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-8">
                  <h2 className="lg:text-2xl text-xl font-medium text-titleColor">
                    {t("profile.calendar.events.search.title")}
                  </h2>
                  <button className="bg-mainColor text-white px-6 py-3 rounded-lg hover:bg-mainColorHover transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                    {t("profile.calendar.events.search.printReport")}
                  </button>
                </div>

                {/* Filter Dropdowns Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Search Term Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t(
                        "profile.calendar.events.filters.eventName"
                      )}
                      value={filters.searchTerm}
                      onChange={(e) =>
                        handleFilterChange("searchTerm", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                    />
                  </div>

                  {/* Event Type Filter */}
                  <div className="relative">
                    <select
                      value={filters.happeningType}
                      onChange={(e) =>
                        handleFilterChange("happeningType", e.target.value)
                      }
                      className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22gray%22%3e%3cpath fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="">
                        {t("profile.calendar.events.filters.eventType")}
                      </option>
                      <option value="TRIP">
                        {t("profile.calendar.events.types.trip")}
                      </option>
                      <option value="METING">
                        {t("profile.calendar.events.types.meeting")}
                      </option>
                      <option value="TRAINING">
                        {t("profile.calendar.events.types.training")}
                      </option>
                      <option value="CONFERENCE">
                        {t("profile.calendar.events.types.conference")}
                      </option>
                      <option value="ACADEMIC">
                        {t("profile.calendar.events.types.academic")}
                      </option>
                      <option value="LEAVE">
                        {t("profile.calendar.events.types.leave")}
                      </option>
                      <option value="EXAM">
                        {t("profile.calendar.events.types.exam")}
                      </option>
                      <option value="OTHER">
                        {t("profile.calendar.events.types.other")}
                      </option>
                    </select>
                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
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

                  {/* Date Filter */}
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.day}
                      onChange={(e) =>
                        handleFilterChange("day", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Events List Section */}
              <div className="p-4 border border-border mt-6 bg-white rounded-2xl">
                <h3 className="lg:text-xl text-lg font-medium text-titleColor pb-6">
                  {t("profile.calendar.events.list.title")}
                </h3>
                {allEventsLoading || allEventsFetching ? (
                  <div className="text-center py-16">
                    <CircularProgress size={32} color="primary" />
                    <p className="text-gray-500 mt-4">
                      {t("profile.calendar.events.loadingEvents")}
                    </p>
                  </div>
                ) : getEventsList().length > 0 ? (
                  <div className="space-y-4">
                    {getEventsList().map((event) => (
                      <div
                        key={event._id || event.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 font-medium">
                              {formatDate(event.day, locale, {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 pb-1">
                                {event.name}
                              </h4>
                              <p className="text-sm text-gray-600 pb-2">
                                {/* {t("profile.calendar.events.filters.location")}:{" "} */}
                                {event.about}
                                {/* |{" "}
                                {t(
                                  "profile.calendar.events.filters.participants"
                                )} */}
                                {/* : {event.participantsCount} |{" "}
                                {t("profile.calendar.events.filters.time")}:{" "}
                                {event.time} */}
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                                  event.happeningType,
                                  "solid"
                                )}`}
                              >
                                {getEventTypeLabel(event.happeningType, t)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEventToView(event);
                                setShowEventDetailsModal(true);
                              }}
                              className="text-black hover:text-mainColor text-sm font-medium"
                            >
                              {t("profile.calendar.actions.view")}
                            </button>
                            <button
                              onClick={() => {
                                setEventToEdit(event);
                                setShowAddEventModal(true);
                              }}
                              className="text-black hover:text-mainColor text-sm font-medium"
                            >
                              {t("profile.calendar.actions.edit")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-inner"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {t("profile.calendar.events.noEventsTitle")}
                    </h3>
                    <p className="text-gray-500 mb-6 text-lg">
                      {t("profile.calendar.events.noEventsDescription")}
                    </p>
                  </div>
                )}

                {/* Pagination Controls */}
                {(allEvents?.pageInfo?.total > 0 ||
                  getEventsList().length > 0) && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Per Page Selector */}

                      {/* Pagination Info and Controls */}
                      <div className="flex flex-col sm:flex-row justify-between w-full sm:items-center gap-4">
                        {/* Pagination Info */}
                        <div className="text-sm text-gray-700">
                          {t("pagination.show")} {t("pagination.of")}{" "}
                          {(currentPage - 1) * perPage + 1} {t("pagination.to")}{" "}
                          {Math.min(
                            currentPage * perPage,
                            allEvents?.pageInfo?.total || 0
                          )}{" "}
                          ,{t("pagination.allResults")}{" "}
                          {allEvents?.pageInfo?.total || 0}{" "}
                        </div>

                        {/* Pagination Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <svg
                              className={`w-4 h-4 ${
                                locale === "ar" ? "" : "rotate-180"
                              }`}
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
                            const totalPages = Math.ceil(
                              (allEvents?.pageInfo?.total || 0) / perPage
                            );
                            const pages = [];
                            const maxVisible = 5;
                            let startPage = Math.max(
                              1,
                              currentPage - Math.floor(maxVisible / 2)
                            );
                            let endPage = Math.min(
                              totalPages,
                              startPage + maxVisible - 1
                            );

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
                            disabled={
                              currentPage >=
                              Math.ceil(
                                (allEvents?.pageInfo?.total || 0) / perPage
                              )
                            }
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            {t("pagination.next")}
                            <svg
                              className={`w-4 h-4 ${
                                locale === "ar" ? "rotate-180" : ""
                              }`}
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
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add/Edit Event Modal */}
          {showAddEventModal && (
            <AddEventForm
              selectedDate={selectedDate}
              onClose={() => {
                setShowAddEventModal(false);
                setEventToEdit(null);
              }}
              onSuccess={handleEventAdded}
              eventToEdit={eventToEdit}
            />
          )}

          {/* Event Details Modal */}
          {showEventDetailsModal && (
            <EventDetailsModal
              event={eventToView}
              onClose={() => {
                setShowEventDetailsModal(false);
                setEventToView(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
