"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

// ── Tiny inline icons ──────────────────────────────────────────────────────────
const ClockIcon = () => (
  <svg
    width="11"
    height="12"
    viewBox="0 0 24 24"
    fill="#44474e"
    className="shrink-0"
  >
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="11"
    height="12"
    viewBox="0 0 24 24"
    fill="#44474e"
    className="shrink-0"
  >
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);

const PinIcon = () => (
  <svg
    width="9"
    height="12"
    viewBox="0 0 24 24"
    fill="#44474e"
    className="shrink-0"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const PeopleIcon = () => (
  <svg
    width="24"
    height="12"
    viewBox="0 0 24 24"
    fill="#44474e"
    className="shrink-0"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const StatCol = ({ label, value, valueClass = "text-[#031635]", icon }) => (
  <div className="flex flex-col gap-1 flex-1 min-w-0">
    <span className="text-[12px] font-medium text-[#44474e] leading-4 tracking-[0.24px] font-somar text-right block">
      {label}
    </span>
    {icon ? (
      <div className="flex items-center gap-1.5 justify-start">
        {icon}
        <span
          className={`text-[20px] font-bold leading-7 font-somar ${valueClass}`}
        >
          {value}
        </span>
      </div>
    ) : (
      <div
        className={`text-[20px] font-bold leading-7 font-somar text-right ${valueClass}`}
      >
        {value}
      </div>
    )}
  </div>
);

/** Returns a time/date range label + icon depending on what the API provides. */
const TripTimeRange = ({ trip, locale }) => {
  if (trip.fromHour && trip.toHour) {
    return (
      <div className="flex gap-1 items-center">
        <ClockIcon />
        <span className="text-[16px] text-[#44474e] font-somar leading-6">
          {trip.fromHour} – {trip.toHour}
        </span>
      </div>
    );
  }

  if (trip.fromDay && trip.toDay) {
    const fmt = (d) =>
      formatDate(d, locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    return (
      <div className="flex gap-1 items-center">
        <CalendarIcon />
        <span className="text-[16px] text-[#44474e] font-somar leading-6">
          {fmt(trip.fromDay)} – {fmt(trip.toDay)}
        </span>
      </div>
    );
  }

  return null;
};

const TripCardAvailable = ({ trip, seats, locale, recommendationId }) => {
  const t = useTranslations("recommendations");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState(false);

  const hasDiscount = !!trip.discountedPrice || trip.discountedPrice === 0;
  const totalPrice =
    (hasDiscount ? trip.discountedPrice : trip.price) * (seats || 1);
  const baseTotalPrice = trip.price * (seats || 1);
  const handleSelect = async () => {
    setSelecting(true);
    try {
      await axios.patch(
        getProxyUrl(
          B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ACCEPT_RECOMMENDED
        ),
        { b2bTrip: trip._id, askTrip: recommendationId },
        { headers: getHeaders(locale) }
      );
      setSelected(true);
      enqueueSnackbar(t("card.selectSuccess"), { variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["fetchData", "profile/askTrips/all"],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchData", "profile/askTrips/counts"],
      });
      router.push(`/${locale}/profile/bookings-management/orders`);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t("card.selectError"), {
        variant: "error",
      });
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="bg-white border border-[#c5c6cf] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-stretch overflow-hidden w-full">
      {/* ── Image (FIRST → RIGHT in RTL) ── */}
      <div className="relative shrink-0 w-[38%] min-w-[200px] z-[1]">
        {trip.thumbnail?.web && (
          <Image
            src={trip.thumbnail.web}
            alt={trip.name}
            fill
            className="object-cover"
            sizes="400px"
            unoptimized
          />
        )}
        <div className="absolute top-4 right-4 bg-[#007b7b] text-white text-[18px] font-bold font-somar leading-7 px-4 py-2 rounded-full z-10">
          {trip.matchPercentage}% {t("card.match")}
        </div>
      </div>

      {/* ── Content (LAST → LEFT in RTL) ── */}
      <div className="flex flex-col gap-8 ps-6 py-6 flex-1 min-w-0 z-[2]">
        <div className="flex flex-col gap-6 w-full">
          {/* Title + meta */}
          <div className="flex flex-col gap-2 w-full">
            <h3 className="text-[24px] font-bold leading-8 text-[#031635] font-somar text-right w-full">
              {trip.name}
            </h3>
            <div className="flex gap-3 items-center justify-start flex-wrap">
              {trip.cities?.length > 0 && (
                <div className="flex gap-1 items-center">
                  <PinIcon />
                  <span className="text-[16px] text-[#44474e] font-somar leading-6">
                    {trip.cities.join("، ")}
                  </span>
                </div>
              )}
              <TripTimeRange trip={trip} locale={locale} />
            </div>
          </div>

          {trip.reason && (
            <div className="bg-[#f7f9fb] border-r-4 border-[#036d36] rounded-[8px] py-4 ps-4 pe-5 w-full">
              <div className="flex items-start gap-4">
                <span className="text-[16px] font-bold text-[#031635] font-somar leading-6 shrink-0">
                  {t("card.reason")}
                </span>
                <span className="text-[16px] text-[#031635] font-somar leading-6 flex-1 text-right">
                  {trip.reason}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4 items-start w-full">
            <StatCol
              label={t("card.availableSeats")}
              value={seats}
              valueClass="text-[#031635]"
              icon={<PeopleIcon />}
            />
            <StatCol
              label={t("card.pricePerStudent")}
              value={
                hasDiscount ? (
                  <div className="flex flex-col w-fit items-center  justify-center gap-0.5">
                    <span className="line-through text-xs text-[#44474e] font-normal leading-tight">
                      {formatCurrency(trip.price)}
                    </span>
                    <span>{formatCurrency(trip.discountedPrice)}</span>
                  </div>
                ) : (
                  formatCurrency(trip.price)
                )
              }
              valueClass="text-[#031635]"
            />
            <StatCol
              label={t("card.totalPrice")}
              value={
                hasDiscount ? (
                  <div className="flex flex-col w-fit items-center  justify-center gap-0.5 ">
                    <span className="line-through text-xs text-[#44474e] font-normal leading-tight">
                      {formatCurrency(baseTotalPrice)}
                    </span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                ) : (
                  formatCurrency(totalPrice)
                )
              }
              valueClass="text-[#036d36]"
            />
          </div>

          {trip.categories?.length > 0 && (
            <div className="flex gap-2 items-center justify-start flex-wrap w-full">
              {trip.categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-[#eceef0] text-[#031635] text-[14px] font-medium font-somar leading-5 tracking-[0.14px] px-4 py-1.5 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={handleSelect}
            disabled={selecting || selected}
            className="bg-[#007473] border-2 border-[#007473] text-white text-[16px] font-bold font-somar leading-5 rounded-[8px] px-[60px] py-3 text-center hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {selecting && (
              <CircularProgress size={16} sx={{ color: "white" }} />
            )}
            {selected ? t("card.selectSuccess") : t("card.selectTrip")}
          </button>
          <Link
            href={`/${locale}/discover/${trip.slug}`}
            className="border-2 border-[#007473] text-[#1f2626] text-[16px] font-bold font-somar leading-5 rounded-[8px] px-[60px] py-3 text-center hover:bg-[#007473]/5 transition-colors whitespace-nowrap"
          >
            {t("card.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCardAvailable;
