"use client";

import { useSelector } from "react-redux";

import { Fragment, memo } from "react";

import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import DayActivities from "./dayActivities";

const LargeSizeGrid = ({ tripSlug, packageDays }) => {
  const activitiesList = useSelector(
    (state) => state.customizationData.info?.custom?.activities
  );

  const loading = useSelector((state) => state.customizationData.loading);

  const renderedActivities = activitiesList?.map((activity) => (
    <Fragment key={activity._id}>
      <DayActivities
        activity={activity}
        activityNumber={activity.day}
        activityDay={activity.dayDate}
        tripSlug={tripSlug}
        packageDays={packageDays}
      />
    </Fragment>
  ));

  return (
    <>
      {renderedActivities}
      {loading === "loading" && (
        <div className="w-full min-h-screen centered">
          <FullScreenLoading status="pending" />
        </div>
      )}
    </>
  );
};

export default memo(LargeSizeGrid);
