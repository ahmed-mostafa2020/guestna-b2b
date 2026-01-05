import { useTranslations } from "next-intl";
import EmptyProfileResponse from "../EmptyProfileResponse";

import emptyMessages from "@assets/gif/emptyMessages.webp";

const EmptyMessages = () => {
  const t = useTranslations();

  return (
    <EmptyProfileResponse
      title={t("profile.myMessages.emptyMessages.title")}
      subTitle={t("profile.myMessages.emptyMessages.subTitle")}
      image={emptyMessages}
      hasLink={true}
    />
  );
};

export default EmptyMessages;
