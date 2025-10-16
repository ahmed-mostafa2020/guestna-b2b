import { useTranslations } from "next-intl";

import EmptyProfileResponse from "../EmptyProfileResponse";
import emptyBookings from "@assets/gif/emptyBookings.gif";

const EmptyBookings = ({ title, subTitle, image, hasLink }) => {
  const t = useTranslations();

  return (
    <>
      <EmptyProfileResponse
        title={title ?? t("profile.myBookings.emptyBookings.title")}
        subTitle={subTitle ?? t("profile.myBookings.emptyBookings.subTitle")}
        image={image ?? emptyBookings}
        hasLink={hasLink ?? true}
      />
    </>
  );
};

export default EmptyBookings;
