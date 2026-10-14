"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@utils/helpers/cn";

import {
  TopDecorativeBand,
  SuccessCheckmarkIcon,
  TripsLibraryIcon,
  CustomLinkIcon,
  DashboardIcon,
  GuideDocumentIcon,
  ArrowNextIcon,
} from "./SchoolTripBookingSuccessIcons";

// Per-card color tokens for the "year-round values" cards
const VALUE_CARDS = [
  {
    key: "card1",
    Icon: TripsLibraryIcon,
    cardClassName:
      "bg-buttonsHover border-buttonsHover hover:border-titleColor",
    iconClassName: "bg-mainColor",
    badgeClassName: "border-border text-mainColor",
  },
  {
    key: "card2",
    Icon: CustomLinkIcon,
    cardClassName:
      "bg-status-warning-bg border-status-warning-border hover:border-secColor",
    iconClassName: "bg-secColor",
    badgeClassName: "border-status-warning-border text-status-warning-fg",
  },
  {
    key: "card3",
    Icon: DashboardIcon,
    cardClassName:
      "bg-status-neutral-bg border-status-neutral-border hover:border-accordionBorder",
    iconClassName: "bg-textDark",
    badgeClassName: "border-status-neutral-border text-status-neutral-fg",
  },
];

const ValueCard = ({ Icon, title, description, badge, classNames }) => (
  <div
    className={cn(
      "flex flex-col justify-between p-4 border rounded-2xl sm:p-5 transition-all duration-200 hover:shadow-md",
      classNames.cardClassName
    )}
  >
    <div>
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 mb-3 text-white shadow-sm rounded-xl",
          classNames.iconClassName
        )}
        aria-hidden="true"
      >
        <Icon />
      </div>
      <h3 className="text-sm font-bold text-textDark font-somar mb-1.5 text-start">
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-textLight font-somar text-start">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "flex items-center justify-center pt-3 mt-4 border-t text-[11px] font-semibold font-somar",
        classNames.badgeClassName
      )}
    >
      {badge}
    </div>
  </div>
);

const SchoolTripBookingSuccessCard = ({
  schoolName,
  adminName,
  tripName,
  tripSlug,
}) => {
  const locale = useLocale();
  const t = useTranslations("schoolTripBookingSuccess");

  const effectiveSchoolName = schoolName || t("credentials.defaultSchoolName");
  const effectiveAdminName = adminName || t("credentials.defaultAdminName");
  const effectiveTripName = tripName || t("defaultTripName");

  const createTripLinkUrl = tripSlug
    ? `/${locale}/profile/create-trip-link/${tripSlug}`
    : `/${locale}/profile/create-trip-link`;

  const tripsManagementUrl = `/${locale}/profile/bookings-management/trips`;

  return (
    <article
      aria-labelledby="success-card-title"
      className="relative z-10 w-full max-w-[768px] mx-auto overflow-hidden bg-white border border-border shadow-lg rounded-3xl transition-all duration-300"
    >
      {/* Top Decorative Band with brand accent stripes */}
      <TopDecorativeBand />

      <div className="flex flex-col p-6 sm:p-10 md:p-12 gap-7 sm:gap-8">
        {/* 1. Success State Header */}
        <header className="flex flex-col items-center gap-3 text-center">
          <SuccessCheckmarkIcon />

          <h1
            id="success-card-title"
            className="pt-1 text-2xl font-bold tracking-tight sm:text-3xl md:text-[32px] text-textDark font-somar"
          >
            {t("mainGreeting")}
          </h1>

          <div className="space-y-1.5 max-w-xl mx-auto">
            <p className="text-base font-bold sm:text-lg md:text-xl text-mainColor font-somar">
              {t("accountCreated")}
            </p>
            <p className="text-xs leading-relaxed sm:text-sm md:text-base text-textLight font-somar">
              {t("participationNotice", { tripName: effectiveTripName })}
            </p>
          </div>
        </header>

        {/* 2. School Credentials Snippet */}
        <section
          aria-labelledby="credentials-section-title"
          className="p-4 border shadow-sm bg-status-neutral-bg border-status-neutral-border rounded-2xl sm:p-5 md:p-6"
        >
          <h2
            id="credentials-section-title"
            className="text-xs font-semibold text-textLight font-somar pb-3.5 text-start"
          >
            {t("credentials.title")}
          </h2>

          <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:rtl:divide-x-reverse divide-status-neutral-border">
            {/* School Name */}
            <div className="flex flex-col pb-3 sm:pb-0 sm:pe-6 text-start">
              <span className="text-[11px] sm:text-xs text-textLight font-somar mb-1">
                {t("credentials.schoolNameLabel")}
              </span>
              <strong className="text-xs font-bold truncate sm:text-sm md:text-[15px] text-textDark font-somar">
                {effectiveSchoolName}
              </strong>
            </div>

            {/* Administrator */}
            <div className="flex flex-col pt-3 sm:pt-0 sm:ps-6 text-start">
              <span className="text-[11px] sm:text-xs text-textLight font-somar mb-1">
                {t("credentials.adminLabel")}
              </span>
              <strong className="text-xs font-bold truncate sm:text-sm md:text-[15px] text-textDark font-somar">
                {effectiveAdminName}
              </strong>
            </div>
          </div>
        </section>

        {/* 3. Year-Round Values Section */}
        <section aria-labelledby="values-section-title">
          <div className="flex items-center gap-2 mb-4 text-start">
            <span
              className="w-2.5 h-2.5 rounded-full bg-secColor flex-shrink-0"
              aria-hidden="true"
            />
            <h2
              id="values-section-title"
              className="text-sm font-bold sm:text-base md:text-lg text-textDark font-somar"
            >
              {t("valuesSection.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {VALUE_CARDS.map(({ key, Icon, ...classNames }) => (
              <ValueCard
                key={key}
                Icon={Icon}
                title={t(`valuesSection.${key}.title`)}
                description={t(`valuesSection.${key}.description`)}
                badge={t(`valuesSection.${key}.badge`)}
                classNames={classNames}
              />
            ))}
          </div>
        </section>

        {/* 4. Action Buttons Group */}
        <section
          aria-label={t("actions.ariaLabel")}
          className="flex flex-col items-stretch justify-between gap-3 pt-2 border-t sm:flex-row sm:items-center sm:gap-4 border-border"
        >
          {/* Primary CTA Button: Redirects to profile/create-trip-link/[slug] */}
          <Link
            href={createTripLinkUrl}
            id="primary-share-trip-cta-btn"
            className="group flex-[1.4] order-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-mainColor hover:bg-linksHover text-white font-bold font-somar text-xs sm:text-sm md:text-[15px] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <span>
              {t("actions.primary", {
                tripName: effectiveTripName,
              })}
            </span>
            <ArrowNextIcon />
          </Link>

          {/* Secondary CTA Button: Redirects to bookings-management/trips */}
          <Link
            href={tripsManagementUrl}
            id="secondary-guide-cta-btn"
            className="flex-1 order-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-buttonsHover border border-accordionBorder text-textDark hover:text-mainColor font-bold font-somar text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <GuideDocumentIcon />
            <span>{t("actions.secondary")}</span>
          </Link>
        </section>
      </div>
    </article>
  );
};

export default SchoolTripBookingSuccessCard;
