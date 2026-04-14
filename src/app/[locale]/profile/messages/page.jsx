"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import EmptyMessages from "@components/features/profile/messages/EmptyMessages";

const MessagesPage = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.aside.messages"
    )}`;
  }, [t]);

  return (
    <div>
      <EmptyMessages />
    </div>
  );
};

export default MessagesPage;
