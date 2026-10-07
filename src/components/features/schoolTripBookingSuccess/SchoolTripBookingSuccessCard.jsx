"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import {
  TopDecorativeBand,
  SuccessCheckmarkIcon,
  TripsLibraryIcon,
  CustomLinkIcon,
  DashboardIcon,
  GuideDocumentIcon,
  ArrowNextIcon,
} from "./SchoolTripBookingSuccessIcons";

const SchoolTripBookingSuccessCard = ({
  schoolName,
  adminName,
  adminRole,
  tripName,
  tripSlug,
}) => {
  const locale = useLocale();
  const t = useTranslations("schoolTripBookingSuccess");

  const effectiveSchoolName = schoolName || t("credentials.defaultSchoolName");
  const effectiveAdminName = adminName || t("credentials.defaultAdminName");
  const effectiveTripName = tripName || t("defaultTripName");
  const effectiveAdminRoleLabel = adminRole
    ? adminRole.endsWith(":") || adminRole.endsWith("：")
      ? adminRole
      : `${adminRole}:`
    : t("credentials.adminLabel");

  const createTripLinkUrl = tripSlug
    ? `/${locale}/profile/create-trip-link/${tripSlug}`
    : `/${locale}/profile/create-trip-link`;

  const tripsManagementUrl = `https://dev.guestna.app/ar/profile/trips-activities-management`;

  return (
    <article
      aria-labelledby="success-card-title"
      className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden max-w-[768px] mx-auto w-full transition-all duration-300 relative z-10"
    >
      {/* Top Decorative Band with brand accent stripes */}
      <TopDecorativeBand />

      <div className="p-6 sm:p-10 md:p-12 flex flex-col gap-7 sm:gap-8">
        {/* 1. Success State Header */}
        <header className="flex flex-col items-center text-center gap-3">
          <SuccessCheckmarkIcon />

          <h1
            id="success-card-title"
            className="text-2xl sm:text-3xl md:text-[32px] font-bold text-gray-900 font-somar tracking-tight pt-1"
          >
            {t("mainGreeting")}
          </h1>

          <div className="space-y-1.5 max-w-xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl font-bold text-[#086F68] font-somar">
              {t("accountCreated")}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-somar leading-relaxed">
              {t("participationNotice", { tripName: effectiveTripName })}
            </p>
          </div>
        </header>

        {/* 2. School Credentials Snippet */}
        <section
          aria-labelledby="credentials-section-title"
          className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm"
        >
          <h2
            id="credentials-section-title"
            className="text-xs font-semibold text-gray-400 font-somar pb-3.5 text-start"
          >
            {t("credentials.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:rtl:divide-x-reverse divide-gray-200">
            {/* School Name */}
            <div className="pb-3 sm:pb-0 sm:pe-6 flex flex-col text-start">
              <span className="text-[11px] sm:text-xs text-gray-500 font-somar mb-1">
                {t("credentials.schoolNameLabel")}
              </span>
              <strong className="text-xs sm:text-sm md:text-[15px] font-bold text-gray-800 font-somar truncate">
                {effectiveSchoolName}
              </strong>
            </div>

            {/* Administrator / Dynamic Role */}
            <div className="pt-3 sm:pt-0 sm:ps-6 flex flex-col text-start">
              <span className="text-[11px] sm:text-xs text-gray-500 font-somar mb-1">
                {effectiveAdminRoleLabel}
              </span>
              <strong className="text-xs sm:text-sm md:text-[15px] font-bold text-gray-800 font-somar truncate">
                {effectiveAdminName}
              </strong>
            </div>
          </div>
        </section>

        {/* 3. Year-Round Values Section */}
        <section aria-labelledby="values-section-title">
          <div className="flex items-center gap-2 mb-4 text-start">
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#C99635] flex-shrink-0"
              aria-hidden="true"
            />
            <h2
              id="values-section-title"
              className="text-sm sm:text-base md:text-lg font-bold text-gray-900 font-somar"
            >
              {t("valuesSection.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Value Item 1: Trips Library */}
            <div className="bg-[#F0FDFA]/70 border border-[#CCFBF1] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-[#99F6E4] transition-all duration-200">
              <div>
                <div
                  className="w-10 h-10 rounded-xl bg-[#086F68] text-white flex items-center justify-center mb-3 shadow-sm"
                  aria-hidden="true"
                >
                  <TripsLibraryIcon />
                </div>
                <h3 className="text-sm font-bold text-gray-900 font-somar mb-1.5 text-start">
                  {t("valuesSection.card1.title")}
                </h3>
                <p className="text-xs text-gray-600 font-somar leading-relaxed text-start">
                  {t("valuesSection.card1.description")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#CCFBF1] flex items-center justify-center text-[11px] font-semibold text-[#086F68] font-somar">
                {t("valuesSection.card1.badge")}
              </div>
            </div>

            {/* Value Item 2: Custom Link & Barcode */}
            <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-[#FDE68A] transition-all duration-200">
              <div>
                <div
                  className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center mb-3 shadow-sm"
                  aria-hidden="true"
                >
                  <CustomLinkIcon />
                </div>
                <h3 className="text-sm font-bold text-gray-900 font-somar mb-1.5 text-start">
                  {t("valuesSection.card2.title")}
                </h3>
                <p className="text-xs text-gray-600 font-somar leading-relaxed text-start">
                  {t("valuesSection.card2.description")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#FEF3C7] flex items-center justify-center text-[11px] font-semibold text-[#B45309] font-somar">
                {t("valuesSection.card2.badge")}
              </div>
            </div>

            {/* Value Item 3: Unified Management Dashboard */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200">
              <div>
                <div
                  className="w-10 h-10 rounded-xl bg-[#1E293B] text-white flex items-center justify-center mb-3 shadow-sm"
                  aria-hidden="true"
                >
                  <DashboardIcon />
                </div>
                <h3 className="text-sm font-bold text-gray-900 font-somar mb-1.5 text-start">
                  {t("valuesSection.card3.title")}
                </h3>
                <p className="text-xs text-gray-600 font-somar leading-relaxed text-start">
                  {t("valuesSection.card3.description")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-center text-[11px] font-semibold text-[#334155] font-somar">
                {t("valuesSection.card3.badge")}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Action Buttons Group */}
        <section
          aria-label="إجراءات الحساب"
          className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t border-gray-100"
        >
          {/* Primary CTA Button: Redirects to profile/create-trip-link/[slug] */}
          <Link
            href={createTripLinkUrl}
            id="primary-share-trip-cta-btn"
            className="group flex-[1.4] order-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#086F68] hover:bg-[#065A54] text-white font-bold font-somar text-xs sm:text-sm md:text-[15px] shadow-[0_10px_20px_-5px_rgba(8,111,104,0.3)] hover:shadow-[0_12px_25px_-5px_rgba(8,111,104,0.4)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <span>
              {t("actions.primary", {
                tripName: effectiveTripName,
              })}
            </span>
            <ArrowNextIcon />
          </Link>

          {/* Secondary CTA Button: Redirects to trips-activities-management */}
          <a
            href={tripsManagementUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="secondary-guide-cta-btn"
            className="flex-1 order-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 hover:text-gray-900 font-bold font-somar text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            <GuideDocumentIcon />
            <span>{t("actions.secondary")}</span>
          </a>
        </section>
      </div>
    </article>
  );
};

export default SchoolTripBookingSuccessCard;
