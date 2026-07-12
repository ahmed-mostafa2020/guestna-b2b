"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

// Reused Feature Components
import EventRegistrationWizard from "@components/forms/events/EventRegistrationWizard";

const EventInvitationClient = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  // Fetch event details using public slug
  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.EVENT_INVITATION}/${params.slug}`,
    {},
    {
      lang: locale,
      enabled: !!params.slug,
      queryKeySuffix: `client-event-details-${params.slug}`,
    }
  );

  const event = data || {};

  // Update tab document title
  useEffect(() => {
    if (event?.name) {
      document.title = `${t("pagesHead.appName")} | ${event.name}`;
    } else {
      document.title = `${t("pagesHead.appName")} | ${t("profile.events.details.title")}`;
    }
  }, [t, event]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen centered bg-packageDetailsBg py-20">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen centered bg-packageDetailsBg py-10">
        <ErrorComponent
          statusCode={error?.response?.data?.statusCode}
          errorMessage={error?.response?.data?.message}
        />
      </div>
    );
  }

  return <EventRegistrationWizard event={event} />;
};

export default EventInvitationClient;
