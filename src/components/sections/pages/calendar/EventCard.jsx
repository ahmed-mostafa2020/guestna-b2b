"use client";

import { useTranslations } from "next-intl";

const EventCard = ({ event, onView, onEdit }) => {
  const t = useTranslations();
  const getEventTypeLabel = (type) => {
    switch (type) {
      case "TRIP":
        return t("profile.calendar.events.types.trip");
      case "ACADEMIC":
        return t("profile.calendar.events.types.academic");
      case "ADMINISTRATIVE":
        return t("profile.calendar.events.types.administrative");
      case "ENTERTAINMENT":
        return t("profile.calendar.events.types.entertainment");
      case "METING":
        return t("profile.calendar.events.types.meeting");
      case "EXAM":
        return t("profile.calendar.events.types.exam");
      default:
        return t("profile.calendar.events.types.social");
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "TRIP":
        return "bg-green-500";
      case "ACADEMIC":
        return "bg-purple-500";
      case "ADMINISTRATIVE":
        return "bg-blue-500";
      case "ENTERTAINMENT":
        return "bg-orange-500";
      case "METING":
        return "bg-indigo-500";
      case "EXAM":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-200 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{event.about}</h3>
        <span className="text-sm text-gray-500">
          {new Date(event.day).toLocaleDateString("ar-SA", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">
        الموقع: {event.place} | المشاركون: {event.participantsCount} | الوقت:{" "}
        {event.time}
      </p>
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getEventTypeColor(
            event.happeningType
          )}`}
        >
          {getEventTypeLabel(event.happeningType)}
        </span>
        <div className="flex space-x-2 gap-x-2">
          <button
            onClick={() => onView(event)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {t("profile.calendar.actions.view")}
          </button>
          <button
            onClick={() => onEdit(event)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            {t("profile.calendar.actions.edit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
