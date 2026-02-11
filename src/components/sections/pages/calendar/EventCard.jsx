"use client";

import { useTranslations, useLocale } from "next-intl";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { getEventTypeLabel, getEventTypeColor } from "@utils/eventTypeUtils";
import { PERMISSIONS } from "@constants/permissions";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const EventCard = ({ event, onView, onEdit }) => {
  const { hasElement, getGtmProps } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="border border-gray-100 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200 hover:border-mainColor">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Header: Date and Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
            {formatDate(event.day, locale, {
              day: "2-digit",
              month: "short",
            })}
          </span>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
              event.happeningType,
              "solid"
            )}`}
          >
            {getEventTypeLabel(event.happeningType, t)}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex flex-col gap-1.5">
          <h3
            className="font-semibold text-gray-900 text-base"
            title={event.name}
          >
            {event.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2" title={event.about}>
            {event.about}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => onView(event)}
            className="flex-1 text-center py-2 text-black hover:text-mainColor text-sm font-medium border border-gray-200 rounded-lg hover:border-mainColor transition-colors"
            {...getGtmTag(GTM_TAGS.CALENDAR.VIEW_EVENT, "calendar", event._id)}
          >
            {t("profile.calendar.actions.view")}
          </button>
          {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_EDIT_EVENT) && (
            <button
              onClick={() => onEdit(event)}
              className="flex-1 text-center py-2 text-black hover:text-mainColor text-sm font-medium border border-gray-200 rounded-lg hover:border-mainColor transition-colors"
              {...getGtmProps(
                PERMISSIONS.ELEMENT.B2B_PROFILE_EDIT_EVENT,
                null,
                event._id
              )}
            >
              {t("profile.calendar.actions.edit")}
            </button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between gap-3">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          <span className="text-nowrap flex-shrink-0 font-medium">
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

            <p className="text-gray-600 text-sm truncate" title={event.about}>
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

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onView(event)}
            className="text-black hover:text-mainColor text-sm font-medium transition-colors"
            {...getGtmTag(GTM_TAGS.CALENDAR.VIEW_EVENT, "calendar", event._id)}
          >
            {t("profile.calendar.actions.view")}
          </button>
          {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_EDIT_EVENT) && (
            <button
              onClick={() => onEdit(event)}
              className="text-black hover:text-mainColor text-sm font-medium transition-colors"
              {...getGtmProps(
                PERMISSIONS.ELEMENT.B2B_PROFILE_EDIT_EVENT,
                null,
                event._id
              )}
            >
              {t("profile.calendar.actions.edit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
