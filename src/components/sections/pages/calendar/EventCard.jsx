"use client";

import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/FormateDate";
import { getEventTypeLabel, getEventTypeColor } from "@utils/eventTypeUtils";

const EventCard = ({ event, onView, onEdit }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-mainColor flex items-center justify-between gap-2">
      <div className="flex gap-2 items-center flex-1 min-w-0">
        <span className="text-nowrap flex-shrink-0">
          {formatDate(event.day, locale, {
            day: "2-digit",
            month: "short",
          })}
        </span>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <h3
            className="font-medium text-gray-900 truncate"
            title={event.name}
          >
            {event.name}
          </h3>

          <p
            className="text-gray-600 text-sm truncate"
            title={event.about}
          >
            {event.about}
          </p>

          <div
            className={`px-3 py-1 rounded-full w-fit text-xs font-medium ${getEventTypeColor(
              event.happeningType,
              "solid"
            )}`}
          >
            {getEventTypeLabel(event.happeningType, t)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
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
