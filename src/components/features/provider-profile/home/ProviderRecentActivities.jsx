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
    thumbnail: "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
  },
  {
    _id: "act-2",
    name: "جولة يوم كامل في الطائف من جدة و مكة المكرمة",
    bookingNumber: "GNA-9942",
    branch: "الرياض",
    organizationName: "مدارس نجد الأهلية",
    visitorsCount: 45,
    stage: "متعددة المراحل",
    thumbnail: "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
  },
  {
    _id: "act-3",
    name: "جولة يوم كامل في الطائف من جدة و مكة المكرمة",
    bookingNumber: "GNA-9942",
    branch: "الرياض",
    organizationName: "مدارس نجد الأهلية",
    visitorsCount: 45,
    stage: "متعددة المراحل",
    thumbnail: "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
  },
];

/* ─── Skeleton ─── */
const ActivityCardSkeleton = () => (
  <div className="flex gap-3 p-3 bg-[#F8FAFC] border border-gray-100 rounded-xl animate-pulse">
    <Skeleton
      variant="rounded"
      width={72}
      height={72}
      className="rounded-lg shrink-0"
    />
    <div className="flex flex-col gap-2 w-full justify-center">
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="text" width="85%" height={12} />
      <Skeleton variant="text" width="50%" height={12} />
    </div>
  </div>
);

export const ProviderRecentActivitiesSkeleton = () => (
  <div className="bg-white border border-border rounded-2xl p-5 animate-pulse h-full flex flex-col justify-between">
    <Skeleton variant="text" width="30%" height={26} className="mb-4" />
    <div className="flex flex-col gap-3 flex-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
    <Skeleton
      variant="rounded"
      width="100%"
      height={38}
      className="mt-4 rounded-lg"
    />
  </div>
);

/* ─── Activity Card ─── */
const ActivityCard = ({ trip, t }) => {
  const bookingNum = trip.bookingNumber || trip.orderId || "GNA-9942";
  const branchName = trip.branch || trip.cities?.[0]?.name || "الرياض";
  const orgName = trip.organizationName || trip.organization?.name || "مدارس نجد الأهلية";
  const visitors = trip.visitorsCount || trip.availableSeats || 45;
  const stageName = trip.stage || trip.academicStages?.[0]?.name || t("providerProfile.home.recentActivities.multipleStages");

  return (
    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-[72px] h-[72px] rounded-lg overflow-hidden shrink-0 bg-gray-100">
        {trip.thumbnail?.web || typeof trip.thumbnail === "string" ? (
          <Image
            src={trip.thumbnail?.web || trip.thumbnail}
            alt={trip.name}
            fill
            className="object-cover"
            sizes="72px"
          />
        ) : (
          <div className="w-full h-full bg-mainColor/10 flex items-center justify-center text-mainColor font-bold text-sm">
            {trip.name?.[0] || "G"}
          </div>
        )}
      </div>

      {/* Info Details */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
          {trip.name}
        </h4>

        {/* Row 1: Booking No | Branch | Org */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
          <span>
            <strong className="text-gray-700 font-semibold">{t("providerProfile.home.recentActivities.bookingNumber")}:</strong>{" "}
            {bookingNum}
          </span>
          <span>
            <strong className="text-gray-700 font-semibold">{t("providerProfile.home.recentActivities.branch")}:</strong>{" "}
            {branchName}
          </span>
          <span>
            <strong className="text-gray-700 font-semibold">{t("providerProfile.home.recentActivities.school")}:</strong>{" "}
            {orgName}
          </span>
        </div>

        {/* Row 2: Visitors | Stage */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
          <span>
            <strong className="text-gray-700 font-semibold">{t("providerProfile.home.recentActivities.visitors")}:</strong>{" "}
            {visitors} {t("providerProfile.home.recentActivities.students")}
          </span>
          <span>
            <strong className="text-gray-700 font-semibold">{t("providerProfile.home.recentActivities.stage")}:</strong>{" "}
            {stageName}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ProviderRecentActivities = ({ trips = [], loading }) => {
  const t = useTranslations();

  if (loading) return <ProviderRecentActivitiesSkeleton />;

  const displayTrips = trips && trips.length > 0 ? trips : DEFAULT_ACTIVITIES;

  return (
    <div className="bg-white border border-border rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm">
      <h3 className="text-base font-bold text-mainColor mb-3">
        {t("providerProfile.home.recentActivities.title")}
      </h3>

      <div className="flex flex-col gap-2.5 flex-1">
        {displayTrips.map((trip, idx) => (
          <ActivityCard key={trip._id || idx} trip={trip} t={t} />
        ))}
      </div>

      {/* View All Button */}
      <button
        type="button"
        className="w-full mt-3 py-2 bg-mainColor hover:bg-[#005c5c] text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
      >
        {t("providerProfile.home.recentActivities.viewAll")}
      </button>
    </div>
  );
};

export default memo(ProviderRecentActivities);
