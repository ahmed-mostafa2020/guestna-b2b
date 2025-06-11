import { useTranslations } from "next-intl";

import EmptyProfileResponse from "../EmptyProfileResponse";
import emptyBookings from "@assets/gif/emptyBookings.gif";

const EmptyBookings = () => {
  const t = useTranslations();

  return (
    <>
      <EmptyProfileResponse
        title={t("profile.myBookings.emptyBookings.title")}
        subTitle={t("profile.myBookings.emptyBookings.subTitle")}
        image={emptyBookings}
        hasLink={true}
      />
    </>
  );
};

export default EmptyBookings;
