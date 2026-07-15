"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import formatCurrency from "@utils/formatters/FormatCurrency";

const TripCardUnavailable = ({ trip }) => {
  const t = useTranslations("recommendations.unavailable");

  const hasDiscount = !!trip.discountedPrice || trip.discountedPrice === 0;

  return (
    <div className="relative border border-[#c5c6cf] rounded-[12px] overflow-hidden flex items-stretch opacity-70 w-full">
      {/* Desaturation overlay */}
      <div className="absolute inset-0 rounded-[12px] pointer-events-none z-10">
        <div className="absolute inset-0 bg-[#f2f4f6] rounded-[12px]" />
        <div className="absolute inset-0 bg-white mix-blend-saturation rounded-[12px]" />
      </div>

      {/* Image — FIRST → RIGHT in RTL */}
      <div className="relative shrink-0 w-[38%] min-w-[200px] h-[294px] z-[1]">
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
      </div>

      {/* Content — LAST → LEFT in RTL */}
      <div className="relative z-20 flex flex-col justify-between p-8 flex-1 min-w-0 h-[294px]">
        <h3 className="text-[24px] font-bold text-[#031635] font-somar leading-8 text-right">
          {trip.name}
        </h3>

        {/* Bottom row: border-top */}
        <div className="flex items-center justify-between border-t border-[#c5c6cf] pt-4">
          {/* Unavailable badge — LAST in DOM → LEFT in RTL */}
          <div className="bg-[#e0e3e5] rounded-[8px] px-4 py-2">
            <span className="text-[16px] font-bold text-[#44474e] font-somar">
              {t("label")}
            </span>
          </div>

          {/* Price — FIRST in DOM → RIGHT in RTL */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-[#44474e] font-somar leading-4 tracking-[0.24px] text-right">
              {t("pricePerStudent")}
            </span>
            <div className="text-[20px] font-bold text-[#191c1e] font-somar text-right">
              {hasDiscount ? (
                <div className="flex flex-col w-fit items-center  justify-center gap-0.5">
                  <span className="line-through text-xs text-[#44474e]/60 font-normal leading-tight">
                    {formatCurrency(trip.price)}
                  </span>
                  <span>{formatCurrency(trip.discountedPrice)}</span>
                </div>
              ) : (
                formatCurrency(trip.price)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fully booked diagonal badge — centered overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="-rotate-[5deg]">
          <div className="bg-[#ba1a1a] rounded-[8px] px-4 py-2 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
            <span className="text-[16px] font-bold text-white font-somar">
              {t("fullyBooked")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCardUnavailable;
