"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import CustomizedBreadcrumbs from "@components/ui/breadcrumbs/CustomizedBreadcrumbs";

// Feature Components
import EventDetailsHeader from "@components/features/profile/events/EventDetailsHeader";
import EventDetailsMedia from "@components/features/profile/events/EventDetailsMedia";
import EventDetailsInfoCard from "@components/features/profile/events/EventDetailsInfoCard";
import EventDetailsTracks from "@components/features/profile/events/EventDetailsTracks";
import EventDetailsSchools from "@components/features/profile/events/EventDetailsSchools";

const EventDetailsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  // Fetch event details
  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROFILE.EVENT_DETAILS}/${params.slug}`,
    {},
    {
      lang: locale,
      enabled: !!params.slug,
      queryKeySuffix: `event-details-${params.slug}`,
    }
  );

  const event = data || {};

  // Update tab title
  useEffect(() => {
    if (event?.name) {
      document.title = `${t("pagesHead.appName")} | ${event.name}`;
    } else {
      document.title = `${t("pagesHead.appName")} | ${t("profile.events.details.title")}`;
    }
  }, [t, event]);

  if (isLoading) {
    return (
      <ProtectedProfilePage
        requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
      >
        <div className="w-full min-h-[400px] centered py-20">
          <FullScreenLoading status="pending" />
        </div>
      </ProtectedProfilePage>
    );
  }

  if (error) {
    return (
      <ProtectedProfilePage
        requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
      >
        <div className="py-10">
          <ErrorComponent
            statusCode={error?.response?.data?.statusCode}
            errorMessage={error?.response?.data?.message}
          />
        </div>
      </ProtectedProfilePage>
    );
  }

  const breadcrumbsList = [
    {
      id: 1,
      type: "link",
      name: t("pagesHead.title.home"),
      link: "profile",
    },
    {
      id: 2,
      type: "link",
      name: t("profile.events.title"),
      link: "profile/events",
    },
    {
      id: 3,
      type: "text",
      name: event.name || t("profile.events.details.title"),
    },
  ];

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
    >
      <div className="py-2 flex flex-col gap-6">
        {/* Breadcrumbs */}
        <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />

        {/* Header (Back + Title + Share) */}
        <EventDetailsHeader
          name={event.name}
          orderId={event.orderId}
          slug={params.slug}
        />

        {/* Media (Banner / Video Player) */}
        <EventDetailsMedia
          thumbnail={event.thumbnail}
          video={event.video}
          name={event.name}
        />

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Main Content Areas */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-3">
                <h3 className="text-lg font-bold text-gray-950 font-somar border-s-4 border-mainColor ps-3">
                  {t("profile.events.details.description")}
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-gray-600 font-somar whitespace-pre-wrap text-start">
                  {event.description}
                </p>
              </div>
            )}

            {/* Target Audience Tracks */}
            <EventDetailsTracks organizations={event.organizations} tracks={event.tracks} />

            {/* Invited Schools */}
            <EventDetailsSchools organizations={event.organizations} />
          </div>

          {/* Details Sidebar Card */}
          <div className="flex flex-col gap-6">
            <EventDetailsInfoCard
              price={event.price}
              availableSeats={event.availableSeats}
              day={event.day}
              toDay={event.toDay}
              fromHour={event.fromHour}
              toHour={event.toHour}
              duration={event.duration}
              tripType={event.tripType}
              slug={params.slug}
            />
          </div>
        </div>
      </div>
    </ProtectedProfilePage>
  );
};

export default EventDetailsPage;
