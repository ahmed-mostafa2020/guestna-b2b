"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import EmptyNotifications from "@components/sections/pages/profile/notifications/EmptyNotifications";

const NotificationsPage = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.aside.notifications"
    )}`;
  }, [t]);

  return (
    <div>
      <EmptyNotifications />
    </div>
  );
};

export default NotificationsPage;
