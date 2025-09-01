"use client";

import { useTranslations } from "next-intl";

const LoadingState = ({ message }) => {
  const t = useTranslations();
  const defaultMessage = t("profile.calendar.events.loadingEvents");
  return (
    <div className="text-center py-16">
      <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-gray-500">{message || defaultMessage}</p>
    </div>
  );
};

export default LoadingState;
