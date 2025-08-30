"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const CalendarPage = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Function to safely set selected date (prevent past dates)
  const setSelectedDateSafe = (date) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (date >= today) {
      setSelectedDate(date);
    }
  };

  // Mock data for summary cards
  const summaryData = [
    {
      title: t("profile.calendar.summary.potentialEvents"),
      count: "1,250",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: t("profile.calendar.summary.academicEvents"),
      count: "1,250",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: t("profile.calendar.summary.scheduledTrips"),
      count: "1,250",
      color: "bg-green-100 text-green-600",
    },
    {
      title: t("profile.calendar.summary.totalEvents"),
      count: "1,250",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // Mock events data for the events list
  const mockEventsList = [
    {
      id: 1,
      title: t("profile.calendar.events.semesterStart.title"),
      subtitle: "بداية الدراسة للفصل الثاني",
      date: "04 Feb",
      type: t("profile.calendar.events.types.academic"),
      typeColor: "bg-purple-100 text-purple-600",
    },
    {
      id: 2,
      title: "اجتماع مجلس الإدارة",
      subtitle: "مناقشة الخطط المستقبلية",
      date: "04 Feb",
      type: "إداري",
      typeColor: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      title: "رحلة مدرسية",
      subtitle: "زيارة المتحف الوطني",
      date: "04 Feb",
      type: "ترفيهي",
      typeColor: "bg-green-100 text-green-600",
    },
  ];

  // Mock data for calendar events
  const mockEvents = {
    "2025-06-12": [
      {
        id: 1,
        title: "بداية الفصل الدراسي الثاني",
        subtitle: "بداية الدراسة للفصل الثاني",
        date: "04 Feb",
        type: "اكاديمي",
        typeColor: "bg-purple-500",
      },
      {
        id: 2,
        title: "اجتماع مجلس الإدارة",
        subtitle: "مناقشة الخطط المستقبلية",
        date: "04 Feb",
        type: "إداري",
        typeColor: "bg-blue-500",
      },
    ],
  };

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return mockEvents[dateString] || [];
  };

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

  // Add Event Modal Component
  const AddEventModal = () => {
    if (!showAddEventModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              أضف حدث أو نشاط جديد إلى التقويم
            </h2>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الحدث
                    </label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>اختر نوع الحدث</option>
                        <option>أكاديمي</option>
                        <option>إداري</option>
                        <option>ترفيهي</option>
                        <option>اجتماعي</option>
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

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوقت
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="--:--"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: قاعة اجتماعات"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Event Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الحدث
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: اجتماع مع فريق العمل"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue="2025-08-01"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Number of Participants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد المشتركين
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="العدد المتوقع"
                        min="1"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center justify-center w-8 text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Description Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الحدث
                </label>
                <div className="relative">
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="اكتب وصفاً مفصلاً للحدث ..."
                  />
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-100 flex justify-between">
            <button
              onClick={() => setShowAddEventModal(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                // Handle save event logic here
                setShowAddEventModal(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              حفظ الحدث
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Add Event Modal */}
      <AddEventModal />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center">
              <div>
                <p className="text-sm text-gray-500 mb-3 font-medium">
                  {item.title}
                </p>
                <p className="text-4xl font-bold text-gray-900">{item.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 mb-8 bg-gradient-to-r from-green-400 to-emerald-500 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            activeTab === "calendar"
              ? "bg-white text-green-700 shadow-lg transform scale-105"
              : "text-white hover:text-green-100 hover:bg-white/10"
          }`}
        >
          التقويم
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            activeTab === "events"
              ? "bg-white text-green-700 shadow-lg transform scale-105"
              : "text-white hover:text-green-100 hover:bg-white/10"
          }`}
        >
          الاحداث
        </button>
        <button
          onClick={() => setActiveTab("sync")}
          className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            activeTab === "sync"
              ? "bg-white text-green-700 shadow-lg transform scale-105"
              : "text-white hover:text-green-100 hover:bg-white/10"
          }`}
        >
          المزامنة
        </button>
      </div>

      {/* Main Content */}
      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Events List */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              أحداث اليوم المحدد
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedDate.toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {event.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${event.typeColor}`}
                      >
                        {event.type}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          مشاهدة
                        </button>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
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
                  لا توجد أحداث لهذا اليوم
                </h3>
                <p className="text-gray-500 mb-6 text-lg">
                  لم يتم العثور على أي أحداث مجدولة لهذا التاريخ
                </p>
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold mt-4"
                >
                  إضافة حدث جديد
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Interactive Calendar */}
          <div className="bg-white rounded-xl p-8 shadow-lg border-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                >
                  اضافة حدث +
                </button>
                <button className="border-2 border-orange-300 text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 font-medium">
                  رفع التقويم
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                التقويم التفاعلي
              </h3>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md text-gray-600 hover:text-gray-800 font-bold text-xl"
              >
                &lt;
              </button>
              <h4 className="text-xl font-semibold text-gray-900">
                {formatDate(currentMonth)}
              </h4>
              <button
                onClick={() => navigateMonth("next")}
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
                    onClick={() =>
                      !isDisabled && day && setSelectedDateSafe(day)
                    }
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
                <span>يمكنك فقط تحديد التواريخ الحالية والمستقبلية</span>
              </div>
            </div>
          </div>
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
            <div className="space-y-4">
              {mockEventsList.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-sm text-gray-500 font-medium">
                        {event.date}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.subtitle}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${event.typeColor}`}
                        >
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        مشاهدة
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        تعديل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "sync" && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            مزامنة التقويم
          </h2>
          <p className="text-gray-600">محتوى تبويب المزامنة سيتم إضافته هنا</p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
