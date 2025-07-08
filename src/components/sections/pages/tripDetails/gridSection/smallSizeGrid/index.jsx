"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { USERS } from "@constants/users";
import PreBookingSection from "@components/common/trips/PreBookingSection";
import BookWithConfidenceSection from "@components/common/trips/BookWithConfidenceSection";
import Map from "../largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";

const SmallSizeGrid = () => {
  const data = useSelector((state) => state.tripDetailsData.data.trip);

  const userType = useSelector((state) => state.users.userType);

  const isAuth = data?.isAuth ?? true;

  const t = useTranslations();

  return (
    <>
      {userType === USERS.B2B_PARENT && <PreBookingSection tripData={data} />}

      <BookWithConfidenceSection />

      {data?.location && isAuth && userType === USERS.B2B_PARENT && (
        <div className="flex flex-col gap-3 lg:gap-5">
          <h4 className="text-lg font-semibold text-mainColor lg:text-2xl">
            {t("bookWithConfidence.activityLocation")}
          </h4>

          <Map
            lat={data?.location?.lat || 0}
            lng={data?.location?.lng || 0}
            locationLink={false}
            isAuth={isAuth}
            height="h-48"
          />
        </div>
      )}
    </>
  );
};

export default SmallSizeGrid;
