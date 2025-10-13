"use client";

import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/FormateDate";
import { getEventTypeLabel, getEventTypeColor } from "@utils/eventTypeUtils";

const EventCard = ({ event, onView, onEdit }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-mainColor bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center justify-between gap-0.5 mb-2">
        <h3 className="font-medium text-gray-900">{event.name}</h3>
        <span className="text-sm text-nowrap text-gray-500">
          {formatDate(event.day, locale, {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>
      <p className="text-gray-600 text-sm">
        {t("profile.calendar.events.card.location")}: {event.place} |{" "}
        {t("profile.calendar.events.card.participants")}:{" "}
        {event.participantsCount} | {t("profile.calendar.events.card.time")}:{" "}
        {event.time}
      </p>
      <div className="flex items-center justify-between mt-3">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
            event.happeningType,
            "solid"
          )}`}
        >
          {getEventTypeLabel(event.happeningType, t)}
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={() => onView(event)}
            className="text-black hover:text-mainColor text-sm font-medium"
          >
            {t("profile.calendar.actions.view")}
          </button>
          <button
            onClick={() => onEdit(event)}
            className="text-black hover:text-mainColor text-sm font-medium"
          >
            {t("profile.calendar.actions.edit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
