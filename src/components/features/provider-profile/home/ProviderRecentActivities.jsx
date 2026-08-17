"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import {
  LocationOn,
  School,
  EventSeat,
} from "@mui/icons-material";

/* ─── Skeleton ─── */
const ActivityCardSkeleton = () => (
  <div className="flex gap-4 p-4 bg-white border border-border rounded-xl animate-pulse">
    <Skeleton
      variant="rounded"
      width={100}
      height={80}
      className="rounded-lg shrink-0"
    />
    <div className="flex flex-col gap-2 w-full">
      <Skeleton variant="text" width="70%" height={18} />
      <div className="flex items-center gap-4">
        <Skeleton variant="text" width="30%" height={14} />
        <Skeleton variant="text" width="25%" height={14} />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton variant="text" width="20%" height={14} />
        <Skeleton variant="rounded" width={60} height={22} />
      </div>
    </div>
  </div>
);

export const ProviderRecentActivitiesSkeleton = () => (
  <div className="bg-white border border-border rounded-xl p-5 animate-pulse">
    <Skeleton variant="text" width="35%" height={24} className="mb-4" />
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
    <Skeleton
      variant="rounded"
      width="100%"
      height={42}
      className="mt-4 rounded-lg"
    />
  </div>
);

/* ─── Activity Card ─── */
const ActivityCard = ({ trip, t }) => (
  <div className="flex gap-4 p-4 bg-gray-50 border border-border rounded-xl hover:bg-gray-100 transition-colors">
    {/* Thumbnail */}
    <div className="relative w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-200">
      {trip.thumbnail?.web ? (
        <Image
          src={trip.thumbnail.web}
          alt={trip.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      ) : (
        <div className="w-full h-full bg-mainColor/10 flex items-center justify-center text-mainColor text-xs">
          {trip.name?.[0] || "T"}
        </div>
      )}
    </div>

    {/* Info */}
    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-titleColor truncate">
          {trip.name}
        </h4>
        <span className="text-[10px] font-medium text-mainColor bg-mainColor/10 px-2 py-0.5 rounded-full shrink-0">
          {trip.orderId}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        {trip.organization?.name && (
          <span className="flex items-center gap-1">
            <School className="!w-3.5 !h-3.5 text-gray-400" />
            {trip.organization.name}
          </span>
        )}
        {trip.academicStages?.length > 0 && (
          <span className="text-gray-400">
            {trip.academicStages.map((s) => s.name).join(", ")}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        {trip.cities?.length > 0 && (
          <span className="flex items-center gap-1">
            <LocationOn className="!w-3.5 !h-3.5 text-gray-400" />
            {trip.cities.map((c) => c.name).join(", ")}
          </span>
        )}
        <span className="flex items-center gap-1">
          <EventSeat className="!w-3.5 !h-3.5 text-gray-400" />
          {trip.availableSeats} {t("providerProfile.home.recentActivities.seats")}
        </span>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */
const ProviderRecentActivities = ({ trips = [], loading, noTripsMessage }) => {
  const t = useTranslations();

  if (loading) return <ProviderRecentActivitiesSkeleton />;

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h3 className="text-base font-semibold text-mainColor mb-4">
        {t("providerProfile.home.recentActivities.title")}
      </h3>

      {trips.length > 0 ? (
        <div className="flex flex-col gap-3">
          {trips.map((trip) => (
            <ActivityCard key={trip._id} trip={trip} t={t} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-400">
          {noTripsMessage || t("providerProfile.home.recentActivities.noTrips")}
        </div>
      )}

      {trips.length > 0 && (
        <button className="w-full mt-4 py-2.5 bg-mainColor text-white rounded-lg text-sm font-semibold hover:bg-mainColor/90 transition-colors">
          {t("providerProfile.home.recentActivities.viewAll")}
        </button>
      )}
    </div>
  );
};

export default memo(ProviderRecentActivities);
