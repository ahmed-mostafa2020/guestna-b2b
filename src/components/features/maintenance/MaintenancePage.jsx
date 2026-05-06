"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Container } from "@mui/material";

import underConstruction from "@assets/underConstruction.webp";

const MaintenancePage = ({ message, endsAt, onRetry, isRetrying = false }) => {
  const t = useTranslations("maintenance");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const formattedEndsAt = endsAt
    ? new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(endsAt))
    : null;

  return (
    <main className="w-full min-h-[calc(100vh-80px)] bg-activityDetailsBg flex items-center justify-center py-10 lg:py-16">
      <Container maxWidth="md">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
            <Image
              src={underConstruction}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 320px"
              className="object-contain"
            />
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-status-warning-bg text-status-warning-fg text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-warning-fg opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-warning-fg" />
            </span>
            {t("badge")}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-titleColor">
            {t("title")}
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-textDark leading-relaxed">
            {message || t("description")}
          </p>

          {formattedEndsAt && (
            <p className="text-sm sm:text-base text-textLight">
              {t("expectedBack", { date: formattedEndsAt })}
            </p>
          )}

          <p className="text-xs sm:text-sm text-textLight pt-4">
            {t("apology")}
          </p>
        </div>
      </Container>
    </main>
  );
};

export default MaintenancePage;
