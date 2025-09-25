"use client";

import { useTranslations } from "next-intl";
import CustomizedModal from "@components/common/customizedModal";
import ModalHeader from "@components/sections/pages/calendar/ModalHeader";
import ModalFooter from "@components/sections/pages/calendar/ModalFooter";

const EventDetailsModal = ({ event, onClose }) => {
  const t = useTranslations();

  if (!event) return null;

  // Event types mapping
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
    <CustomizedModal
      open={true}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <ModalHeader
        title={t("profile.calendar.modal.eventDetails.title")}
        onClose={onClose}
      />

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
          <span className="text-gray-600 font-medium">
            {t("profile.calendar.modal.eventDetails.fields.eventType")}
          </span>
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
          <span className="text-gray-600 font-medium">
            {t("profile.calendar.modal.eventDetails.fields.date")}
          </span>
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
          <span className="text-gray-600 font-medium">
            {t("profile.calendar.modal.eventDetails.fields.time")}
          </span>
          <span className="text-gray-900">{event.time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">
            {t("profile.calendar.modal.eventDetails.fields.location")}
          </span>
          <span className="text-gray-900">{event.place}</span>
        </div>

        {/* Participants Count */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">
            {t("profile.calendar.modal.eventDetails.fields.participants")}
          </span>
          <span className="text-gray-900">{event.participantsCount}</span>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={onClose}
          className="px-6 py-3 font-medium text-white transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
        >
          {t("profile.calendar.modal.eventDetails.close")}
        </button>
      </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default EventDetailsModal;
