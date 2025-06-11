"use client";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { Fragment, useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { END_POINTS } from "@constants/APIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import CustomizedBreadcrumbs from "@components/common/breadcrumbs/CustomizedBreadcrumbs";
import ActivityTemplate from "@components/common/trips/sectionsTemplates/ActivityTemplate";
import TripsConflict from "@components/sections/pages/customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog/TripsConflict";

import { Container } from "@mui/material";

const AddActivity = ({ params }) => {
  const tripName = useSelector((state) => state.checkoutData.tripName);
  const {
    selectedActivityDay,
    activityData,
    loading: addingActivityLoading,
    error: addingActivityError,
  } = useSelector((state) => state.customizationData);

  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.TRIPS}${END_POINTS.ADD_ACTIVITY}/${params.addActivity}`,
    {},
    {
      method: "GET",

      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.addActivity"
    )}`;
  }, [t]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode || "404"}
        errorMessage={error?.response?.data?.message}
      />
    );

  const breadcrumbsList = [
    {
      id: 1,
      type: "link",
      name: t("pagesHead.title.home"),
      link: "",
    },
    {
      id: 2,
      type: "link",
      name: t("pagesHead.title.discover"),
      link: "discover",
    },
    {
      id: 3,
      type: "link",
      name: tripName || params.tripSlug,
      link: `discover/${params.tripSlug}`,
    },
    {
      id: 4,
      type: "link",
      name: t("customization.breadcrumb"),
      link: `customization/${params.tripSlug}`,
    },
    { id: 5, type: "text", name: t("pagesHead.title.addActivity") },
  ];

  const tripsCategories = data?.categoryTrips;

  const createSectionData = (title, options = {}) => {
    const { subTitle, slug, cardsPerView } = options;

    return {
      title,
      subTitle: subTitle || null,
      slug: slug || "showAll",
      cardsPerView: cardsPerView || 4.3,
    };
  };

  const renderedCategories = tripsCategories.map((category, index) => (
    <Fragment key={index}>
      <ActivityTemplate
        fetchedData={category.trips}
        sectionData={createSectionData(category.category)}
      />
    </Fragment>
  ));

  return (
    <>
      <main className="py-5 overflow-hidden lg:py-10 bg-activityDetailsBg">
        <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />

        <Container>
          <h1 className="pb-5 lg:pb-10 text-2xl lg:text-5xl font-semibold lg:leading-[58px]">
            {t("pagesHead.title.addActivity")}
          </h1>
        </Container>

        <div className="flex flex-col gap-4 lg:gap-8">
          {data.highestActivitiesTrip && (
            <ActivityTemplate
              fetchedData={data.highestActivitiesTrip}
              sectionData={createSectionData(t("highestActivities.subTitle"))}
            />
          )}

          {renderedCategories}
        </div>
      </main>

      {addingActivityLoading === "loading" && (
        <div className="w-full min-h-screen centered">
          <FullScreenLoading status="pending" />
        </div>
      )}

      {/* Conflict trips */}
      <TripsConflict
        open={addingActivityError}
        event={activityData}
        activityNumber={selectedActivityDay}
        error={addingActivityError}
      />
    </>
  );
};

export default AddActivity;
