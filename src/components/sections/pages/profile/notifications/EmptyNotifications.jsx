import { useTranslations } from "next-intl";

import EmptyProfileResponse from "../EmptyProfileResponse";

import emptyNotifications from "@assets/gif/emptyNotifications.webp";

const EmptyNotifications = () => {
  const t = useTranslations();
  return (
    <EmptyProfileResponse
      title={t("profile.myNotifications.emptyNotifications.title")}
      subTitle={t("profile.myNotifications.emptyNotifications.subTitle")}
      image={emptyNotifications}
      hasLink={true}
    />
  );
};

export default EmptyNotifications;
