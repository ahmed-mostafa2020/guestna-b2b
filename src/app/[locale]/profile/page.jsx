"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import ProfileInformation from "@components/sections/pages/profile";

const Profile = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.profile"
    )}`;
  }, [t]);

  return (
    <>
      <ProfileInformation />
    </>
  );
};

export default Profile;
