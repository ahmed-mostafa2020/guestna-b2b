"use client";

import { useTranslations } from "next-intl";
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

const CalendarPage = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [eventToView, setEventToView] = useState(null);

  // Fetch events counts for summary cards
  const { data: countsData, isLoading: countsLoading } = useFetchData(
    B2B_END_POINTS.PROFILE.HAPPENINGS.COUNTS,
    {},
    { method: "GET" }
  );

  console.log(countsData, "countsData");

  // Fetch events for selected date
  const { data: selectedDateEvents, refetch: refetchSelectedDateEvents } =
    useFetchData(
      B2B_END_POINTS.PROFILE.HAPPENINGS.ALL,
      {},
      {
        method: "POST",
        body: {
          sort: "NEWEST",
          filter: {
            day: selectedDate.toISOString().split("T")[0],
          },
          page: 1,
          perPage: 10,
        },
      }
    );

  // Fetch all events for events tab
  const { data: allEvents, refetch: refetchAllEvents } = useFetchData(
    B2B_END_POINTS.PROFILE.HAPPENINGS.ALL,
    {},
    {
      method: "POST",
      body: {
        sort: "NEWEST",
        filter: {},
        page: 1,
        perPage: 10,
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Summary Cards */}
      <SummaryCards countsData={countsData} isLoading={countsLoading} />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Events List */}
          <EventsList
            events={getEventsForDate(selectedDate)}
            isLoading={selectedDateEvents?.isLoading}
            title="أحداث اليوم المحدد"
            subtitle={selectedDate.toLocaleDateString("ar-SA", {
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
          />

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
        </div>
      )}

      {activeTab === "events" && (
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
            {allEvents?.isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">جاري تحميل الأحداث...</p>
              </div>
            ) : getEventsList().length > 0 ? (
              <div className="space-y-4">
                {getEventsList().map((event) => (
                  <div
                    key={event._id || event.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-sm text-gray-500 font-medium">
                          {new Date(event.day).toLocaleDateString("ar-SA", {
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
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              event.happeningType === "TRIP"
                                ? "bg-green-100 text-green-600"
                                : event.happeningType === "ACADEMIC"
                                ? "bg-purple-100 text-purple-600"
                                : event.happeningType === "ADMINISTRATIVE"
                                ? "bg-blue-100 text-blue-600"
                                : event.happeningType === "ENTERTAINMENT"
                                ? "bg-orange-100 text-orange-600"
                                : event.happeningType === "METING"
                                ? "bg-indigo-100 text-indigo-600"
                                : event.happeningType === "EXAM"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {event.happeningType === "TRIP"
                              ? "رحلة"
                              : event.happeningType === "ACADEMIC"
                              ? "أكاديمي"
                              : event.happeningType === "ADMINISTRATIVE"
                              ? "إداري"
                              : event.happeningType === "ENTERTAINMENT"
                              ? "ترفيهي"
                              : event.happeningType === "METING"
                              ? "اجتماع"
                              : event.happeningType === "EXAM"
                              ? "امتحان"
                              : "اجتماعي"}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3 space-x-reverse">
                        <button
                          onClick={() => {
                            setEventToView(event);
                            setShowEventDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          مشاهدة
                        </button>
                        <button
                          onClick={() => {
                            setEventToEdit(event);
                            setShowAddEventModal(true);
                          }}
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
              <div className="text-center py-16">
                <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-inner"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  لا توجد أحداث
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  لم يتم العثور على أي أحداث
                </p>
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
  );
};

export default CalendarPage;
