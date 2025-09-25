"use client";

import EventCard from "./EventCard";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { useTranslations } from "next-intl";

const EventsList = ({ events, isLoading, title, subtitle, onView, onEdit }) => {
  const t = useTranslations();
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border-0">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <LoadingState />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border-0">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <EmptyState
          title={t("profile.calendar.calendar.noEventsTitle")}
          description={t("profile.calendar.calendar.noEventsDescription")}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border-0">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 pb-4">{subtitle}</p>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard
            key={event._id || event.id}
            event={event}
            onView={onView}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsList;
