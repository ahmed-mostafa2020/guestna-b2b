"use client";

import { useTranslations } from "next-intl";
import Modal from "@components/sections/pages/calendar/Modal";
import ModalHeader from "@components/sections/pages/calendar/ModalHeader";
import ModalFooter from "@components/sections/pages/calendar/ModalFooter";

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
    <Modal isOpen={true} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader title="تفاصيل الحدث" onClose={onClose} />

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

      <ModalFooter
        onCancel={onClose}
        onConfirm={onClose}
        cancelText="إغلاق"
        confirmText=""
        isForm={false}
      />
    </Modal>
  );
};

export default EventDetailsModal;
