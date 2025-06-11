import { useLocale, useTranslations } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";
import formatDate from "@utils/FormateDate";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";
import headerImage from "@assets/sectionBackground/checkoutHeader.png";
import NotCustomizableTripsItinerary from "./tripsItinerary/NotCustomizableTripsItinerary";
import CustomizableTripsActivities from "./tripsItinerary/CustomizableTripsActivities";

import { dateIcon } from "@assets/svg";

const TripLastDetailsSection = ({ finalTripDetails }) => {
  const locale = useLocale();
  const t = useTranslations();

  const isCustomizedActivities = finalTripDetails.customActivites
    ? true
    : false;

  const renderedItineraries = isCustomizedActivities ? (
    <CustomizableTripsActivities finalTripDetails={finalTripDetails} />
  ) : (
    <NotCustomizableTripsItinerary finalTripDetails={finalTripDetails} />
  );

  return (
    <FrameWithImagedHeader imageSrc={headerImage} imageBgColor="#E2E6EE">
      <h3 className="text-xl font-semibold">
        {finalTripDetails.guestnaTripsType === CONSTANT_VALUES.PACKAGE
          ? t("finalDetails.finalDetailsPackage")
          : t("finalDetails.finalDetailsActivity")}
      </h3>

      <div className="flex gap-4 pt-4 pb-1">
        <figure className="w-[140px] h-[137px] rounded-xl">
          {finalTripDetails.thumbnail?.web && (
            <ImageWithPlaceholder
              src={finalTripDetails.thumbnail?.web}
              width={140}
              height={137}
              className="w-[140px] h-[137px] rounded-xl object-cover"
            />
          )}
        </figure>

        <h3 className="text-base font-semibold">{finalTripDetails.name}</h3>
      </div>

      <div className="flex items-center gap-1 py-4 border-y border-textDark">
        {dateIcon}
        <p className="text-base font-medium">
          {formatDate(finalTripDetails.bookingDay, locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex flex-col gap-4">{renderedItineraries}</div>

      <p className="text-sm font-semibold text-center border-t lg:text-base pt-7 border-textDark">
        {t("finalDetails.freeReturn")}
      </p>
    </FrameWithImagedHeader>
  );
};

export default TripLastDetailsSection;
