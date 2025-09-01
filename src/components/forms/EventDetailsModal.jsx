"use client";

import { useTranslations } from "next-intl";

const EventDetailsModal = ({ event, onClose }) => {
  const t = useTranslations();

  if (!event) return null;

  // Event types mapping
  const getEventTypeLabel = (type) => {
    switch (type) {
      case "TRIP":
        return "رحلة";
      case "ACADEMIC":
        return "أكاديمي";
      case "ADMINISTRATIVE":
        return "إداري";
      case "ENTERTAINMENT":
        return "ترفيهي";
      case "METING":
        return "اجتماع";
      case "EXAM":
        return "امتحان";
      default:
        return "اجتماعي";
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "TRIP":
        return "bg-green-100 text-green-600";
      case "ACADEMIC":
        return "bg-purple-100 text-purple-600";
      case "ADMINISTRATIVE":
        return "bg-blue-100 text-blue-600";
      case "ENTERTAINMENT":
        return "bg-orange-100 text-orange-600";
      case "METING":
        return "bg-indigo-100 text-indigo-600";
      case "EXAM":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">تفاصيل الحدث</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-6 space-y-4">
          {/* Event Name/Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {event.name || event.about}
            </h3>
            {event.name && event.about && (
              <p className="text-gray-600 text-sm">{event.about}</p>
            )}
          </div>

          {/* Event Type */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">نوع الحدث:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                event.happeningType
              )}`}
            >
              {getEventTypeLabel(event.happeningType)}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">التاريخ:</span>
            <span className="text-gray-900">
              {new Date(event.day).toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">الوقت:</span>
            <span className="text-gray-900">{event.time}</span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">الموقع:</span>
            <span className="text-gray-900">{event.place}</span>
          </div>

          {/* Participants Count */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">عدد المشاركين:</span>
            <span className="text-gray-900">{event.participantsCount}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
