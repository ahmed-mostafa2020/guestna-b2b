"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";

/* ─── Default Sample Activity Items (matches Figma screenshot) ─── */
const DEFAULT_ACTIVITIES = [
  {
    _id: "act-1",
    name: "جولة يوم كامل في الطائف من جدة و مكة المكرمة",
    bookingNumber: "GNA-9942",
    branch: "الرياض",
    organizationName: "مدارس نجد الأهلية",
    visitorsCount: 45,
    stage: "متعددة المراحل",
    thumbnail:
      "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
  },
  {
    _id: "act-2",
    name: "جولة يوم كامل في الطائف من جدة و مكة المكرمة",
    bookingNumber: "GNA-9942",
    branch: "الرياض",
    organizationName: "مدارس نجد الأهلية",
    visitorsCount: 45,
    stage: "متعددة المراحل",
    thumbnail:
      "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
  },
  {
    _id: "act-3",
    name: "جولة يوم كامل في الطائف من جدة و مكة المكرمة",
    bookingNumber: "GNA-9942",
    branch: "الرياض",
    organizationName: "مدارس نجد الأهلية",
    visitorsCount: 45,
    stage: "متعددة المراحل",
    thumbnail:
      "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
  },
];

/* ─── Skeleton ─── */
const ActivityCardSkeleton = () => (
  <div className="flex gap-4 p-3.5 bg-gray-50 border border-border rounded-xl animate-pulse">
    <Skeleton
      variant="rounded"
      width={80}
      height={80}
      className="rounded-xl shrink-0"
    />
    <div className="flex flex-col gap-2 w-full justify-center">
      <Skeleton variant="text" width="65%" height={20} />
      <Skeleton variant="text" width="90%" height={15} />
      <Skeleton variant="text" width="55%" height={15} />
    </div>
  </div>
);

export const ProviderRecentActivitiesSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 animate-pulse h-full flex flex-col justify-between">
    <Skeleton variant="text" width="35%" height={28} className="mb-4" />
    <div className="flex flex-col gap-3 flex-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
    <Skeleton
      variant="rounded"
      width="100%"
      height={44}
      className="mt-4 rounded-xl"
    />
  </div>
);

/* ─── Activity Card ─── */
const ActivityCard = ({ trip, t }) => {
  const bookingNum = trip.bookingNumber || trip.orderId || "-";
  const branchName = trip.branch || trip.cities?.[0]?.name || "-";
  const orgName =
    trip.organizationName || trip.organization?.name || "-";
  const visitors = trip.visitorsCount || trip.availableSeats || 0;
  const stageName =
    trip.stage ||
    trip.academicStages?.[0]?.name ||
    t("providerProfile.home.recentActivities.multipleStages");

  return (
    <div className="flex items-center gap-3.5 p-3 sm:p-3.5 bg-gray-50/80 border border-border rounded-xl hover:border-mainColor/30 transition-all">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200 shadow-2xs">
        {trip.thumbnail?.web || typeof trip.thumbnail === "string" ? (
          <Image
            src={trip.thumbnail?.web || trip.thumbnail}
            alt={trip.name || "Trip"}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-mainColor/10 flex items-center justify-center text-mainColor font-black text-lg">
            {trip.name?.[0] || "G"}
          </div>
        )}
      </div>

      {/* Info Details */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <h4 className="text-sm sm:text-base font-bold text-textDark truncate">
          {trip.name || "-"}
        </h4>

        {/* Row 1: Booking No | Branch | Org */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-textLight">
          <span>
            <strong className="text-textDark font-semibold">
              {t("providerProfile.home.recentActivities.bookingNumber")}:
            </strong>{" "}
            {bookingNum}
          </span>
          <span>
            <strong className="text-textDark font-semibold">
              {t("providerProfile.home.recentActivities.branch")}:
            </strong>{" "}
            {branchName}
          </span>
          <span>
            <strong className="text-textDark font-semibold">
              {t("providerProfile.home.recentActivities.school")}:
            </strong>{" "}
            {orgName}
          </span>
        </div>

        {/* Row 2: Visitors | Stage */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-textLight">
          <span>
            <strong className="text-textDark font-semibold">
              {t("providerProfile.home.recentActivities.visitors")}:
            </strong>{" "}
            {visitors} {t("providerProfile.home.recentActivities.students")}
          </span>
          <span>
            <strong className="text-textDark font-semibold">
              {t("providerProfile.home.recentActivities.stage")}:
            </strong>{" "}
            {stageName}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ProviderRecentActivities = ({ trips = [], selectedDate, loading }) => {
  const t = useTranslations();

  if (loading) return <ProviderRecentActivitiesSkeleton />;

  const hasSelectedDate = Boolean(selectedDate);
  const displayTrips = hasSelectedDate
    ? trips
    : trips && trips.length > 0
    ? trips
    : DEFAULT_ACTIVITIES;

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-card">
      <h3 className="text-lg sm:text-xl font-bold text-mainColor pb-4">
        {t("providerProfile.home.recentActivities.title")}
      </h3>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        {displayTrips && displayTrips.length > 0 ? (
          displayTrips.map((trip, idx) => (
            <ActivityCard key={trip._id || idx} trip={trip} t={t} />
          ))
        ) : (
          <div className="flex items-center justify-center py-12 text-center text-textLight font-semibold text-sm sm:text-base">
            {t("providerProfile.home.recentActivities.noTrips")}
          </div>
        )}
      </div>

      {/* View All Button */}
      <button
        type="button"
        className="w-full mt-4 py-2.5 bg-mainColor hover:bg-mainColor/90 active:scale-98 text-white rounded-xl text-sm sm:text-base font-bold transition-all shadow-sm cursor-pointer"
      >
        {t("providerProfile.home.recentActivities.viewAll")}
      </button>
    </div>
  );
};

export default memo(ProviderRecentActivities);
