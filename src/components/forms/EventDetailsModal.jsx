"use client";
import { useTranslations, useLocale } from "next-intl";
import CustomizedModal from "@components/common/customizedModal";
import ModalHeader from "@components/sections/pages/calendar/ModalHeader";
import ModalFooter from "@components/sections/pages/calendar/ModalFooter";
import formatDate from "@utils/FormateDate";
import { getEventTypeLabel, getEventTypeColor } from "@utils/eventTypeUtils";

const EventDetailsModal = ({ event, onClose }) => {
  const t = useTranslations();
  const locale = useLocale();

  if (!event) return null;

  return (
    <CustomizedModal
      open={true}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
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
                  event.happeningType,
                  "light"
                )}`}
              >
                {getEventTypeLabel(event.happeningType, t)}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">
                {t("profile.calendar.modal.eventDetails.fields.date")}
              </span>
              <span className="text-gray-900">
                {formatDate(event.day, locale, {
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
              className="px-8 w-full py-2 font-medium text-white transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
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
