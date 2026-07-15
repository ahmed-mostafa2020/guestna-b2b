"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";

import formatDate from "@utils/formatters/FormateDate";
import {
  locationIcon,
  timeIcon,
  dateIcon,
  profileIcon,
  walletIcon,
  ticketsIcon,
  schoolIcon,
} from "@assets/svg";
import { CircularProgress } from "@mui/material";
import formatCurrency from "@utils/formatters/FormatCurrency";

const InfoItem = ({ icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
      {icon}
      <p className="text-sm text-gray-600">{label}:</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const TagList = ({ icon, label, items, renderItem, tagColor = "blue" }) => {
  if (!items?.length) return null;
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return (
    <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
      <div className="flex items-center gap-1">
        {icon}
        <p className="text-sm text-gray-600">{label}:</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded text-xs ${colorMap[tagColor] ?? colorMap.blue}`}
          >
            {renderItem(item)}
          </span>
        ))}
      </div>
    </div>
  );
};

const OrderDetailsModal = ({ orderId, orderDetails, loading }) => {
  const t = useTranslations();
  const locale = useLocale();
  const k = "profile.tables.ordersInfo.orderDetails";

  if (loading || !orderDetails) {
    return (
      <div className="p-8 bg-white rounded-xl mx-auto w-[70%] flex flex-col items-center justify-center min-h-[200px]">
        <CircularProgress size={40} color="primary" />
      </div>
    );
  }

  const tripName =
    orderDetails?.name?.[locale] ||
    orderDetails?.name?.ar ||
    orderDetails?.trip?.name;

  return (
    <div className="space-y-6 p-6 bg-white mx-auto w-[75%] rounded-xl mb-5 max-h-[90vh] overflow-y-auto">
      <h2 className="text-center text-2xl font-semibold">
        {t(`${k}.title`)} {tripName || orderId}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Trip Information ─────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t(`${k}.tripInfo`)}</h3>

          <div className="flex flex-wrap gap-3 border-2 border-border rounded-lg p-3">
            <InfoItem
              icon={ticketsIcon}
              label={t(`${k}.tripType`)}
              value={t(`common.${orderDetails?.tripType}`)}
            />

            {/* Trip name (normal orders) */}
            {orderDetails?.trip?.name && (
              <InfoItem
                icon={profileIcon}
                label={t(`${k}.tripName`)}
                value={orderDetails.trip.name}
              />
            )}

            {/* Category */}
            <InfoItem
              icon={profileIcon}
              label={t(`${k}.category`)}
              value={orderDetails?.category?.name}
            />

            {/* Sub category (custom) */}
            <InfoItem
              icon={profileIcon}
              label={t(`${k}.supCategory`)}
              value={orderDetails?.supCategory?.name}
            />

            {/* Location */}
            <InfoItem
              icon={locationIcon}
              label={t(`${k}.location`)}
              value={orderDetails?.city?.name}
            />

            {/* Trip start date */}
            <InfoItem
              icon={dateIcon}
              label={t(`${k}.tripDate`)}
              value={
                orderDetails?.day
                  ? formatDate(orderDetails.day, locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null
              }
            />

            {/* Trip end date */}
            <InfoItem
              icon={dateIcon}
              label={t(`${k}.tripEndDate`)}
              value={
                orderDetails?.endDay
                  ? formatDate(orderDetails.endDay, locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null
              }
            />

            {/* Duration (normal/package) */}
            <InfoItem
              icon={timeIcon}
              label={t(`${k}.duration`)}
              value={orderDetails?.duration}
            />

            {/* From / To hours (custom) */}
            <InfoItem
              icon={timeIcon}
              label={t(`${k}.fromHour`)}
              value={orderDetails?.fromHour || null}
            />
            <InfoItem
              icon={timeIcon}
              label={t(`${k}.toHour`)}
              value={orderDetails?.toHour || null}
            />

            {/* Base price (normal) */}
            <InfoItem
              icon={walletIcon}
              label={t(`${k}.basePrice`)}
              value={
                orderDetails?.basePrice
                  ? formatCurrency(orderDetails.basePrice)
                  : null
              }
            />

            {/* Price range (custom) */}
            {orderDetails?.priceRange?.min != null && (
              <InfoItem
                icon={walletIcon}
                label={t(`${k}.priceRange`)}
                value={`${formatCurrency(orderDetails.priceRange.min)} - ${formatCurrency(orderDetails.priceRange.max)}`}
              />
            )}

            {/* Trip price (from trip object) */}
            {orderDetails?.trip?.price != null && (
              <InfoItem
                icon={walletIcon}
                label={t(`${k}.basePrice`)}
                value={formatCurrency(orderDetails.trip.price)}
              />
            )}

            {/* Discounted price */}
            {(!!orderDetails?.discountedPrice || orderDetails?.discountedPrice === 0 || !!orderDetails?.trip?.discountedPrice || orderDetails?.trip?.discountedPrice === 0) && (
              <InfoItem
                icon={walletIcon}
                label={t(`${k}.discountedPrice`)}
                value={formatCurrency(orderDetails?.discountedPrice ?? orderDetails?.trip?.discountedPrice)}
              />
            )}

            {/* Status */}
            <InfoItem
              icon={ticketsIcon}
              label={t(`${k}.status`)}
              value={
                orderDetails?.status
                  ? t(`common.organizationTripStatus.${orderDetails.status}`)
                  : null
              }
            />
          </div>
        </div>

        {/* ── Booking / School Information ─────────────── */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t(`${k}.bookingInfo`)}</h3>

          <div className="flex flex-wrap gap-3 border-2 border-border rounded-lg p-3">
            {/* Order ID */}
            <div className="flex flex-wrap items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {profileIcon}
              <p className="text-sm text-gray-600">{t(`${k}.orderId`)}:</p>
              <p className="font-medium font-mono">{orderId}</p>
            </div>

            {/* Organization / School (custom) */}
            <InfoItem
              icon={schoolIcon}
              label={t(`${k}.organization`)}
              value={orderDetails?.organization?.name}
            />

            {/* Gender (custom - from track) */}
            <InfoItem
              icon={profileIcon}
              label={t(`${k}.gender`)}
              value={
                orderDetails?.track?.gender
                  ? t(`common.${orderDetails.track.gender}`)
                  : null
              }
            />

            {/* Education system (custom - from track) */}
            <InfoItem
              icon={schoolIcon}
              label={t(`${k}.educationSystem`)}
              value={orderDetails?.track?.educationSystem?.name}
            />

            {/* Available seats */}
            <InfoItem
              icon={ticketsIcon}
              label={t(`${k}.availableSeats`)}
              value={orderDetails?.availableSeats}
            />

            {/* Total available seats */}
            <InfoItem
              icon={ticketsIcon}
              label={t(`${k}.totalAvailableSeats`)}
              value={orderDetails?.totalAvailableSeats}
            />

            {/* Special requirements */}
            {orderDetails?.specialRequirements && (
              <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                <p className="text-sm text-gray-600">
                  {t(`${k}.specialRequirements`)}:
                </p>
                <p className="font-medium">
                  {orderDetails.specialRequirements}
                </p>
              </div>
            )}

            {/* Note */}
            {orderDetails?.note && (
              <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                <p className="text-sm text-gray-600">{t(`${k}.note`)}:</p>
                <p className="font-medium">{orderDetails.note}</p>
              </div>
            )}
          </div>

          {/* Academic stages */}
          <TagList
            icon={schoolIcon}
            label={t(`${k}.academicStages`)}
            items={orderDetails?.academicStages}
            renderItem={(s) => (typeof s === "string" ? s : s?.name)}
          />

          {/* Grades (custom) */}
          <TagList
            icon={schoolIcon}
            label={t(`${k}.grades`)}
            items={orderDetails?.grades}
            renderItem={(g) => (typeof g === "string" ? g : g?.name)}
            tagColor="purple"
          />

          {/* Services */}
          <TagList
            icon={schoolIcon}
            label={t(`${k}.services`)}
            items={orderDetails?.services}
            renderItem={(s) => (typeof s === "string" ? s : s?.name)}
            tagColor="green"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(OrderDetailsModal);
