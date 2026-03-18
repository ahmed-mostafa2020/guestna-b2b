import { useTranslations } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";
import headerImage from "@assets/sectionBackground/checkoutHeader.png";
import NotCustomizableTripsItinerary from "./tripsItinerary/NotCustomizableTripsItinerary";
import CustomizableTripsActivities from "./tripsItinerary/CustomizableTripsActivities";
import TripTagsListing from "../../../../tripDetails/gridSection/largeSizeGrid/tripTags/TripTagsListing";

const TripLastDetailsSection = ({ finalTripDetails }) => {
  const t = useTranslations();

  const data = finalTripDetails || {};

  const isCustomizedActivities = finalTripDetails?.customActivites
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
        {finalTripDetails?.tripsType === CONSTANT_VALUES.PACKAGE
          ? t("finalDetails.finalDetailsPackage")
          : t("finalDetails.finalDetailsActivity")}
      </h3>

      <div className="flex gap-4 pt-4 pb-1">
        <figure className="w-[140px] h-[137px] rounded-xl">
          {finalTripDetails?.thumbnail?.web && (
            <ImageWithPlaceholder
              src={finalTripDetails.thumbnail.web}
              alt={finalTripDetails.name || "Trip thumbnail"}
              width={140}
              height={137}
              className="w-[140px] h-[137px] rounded-xl object-cover"
            />
          )}
        </figure>

        <h3 className="text-base font-semibold">{finalTripDetails?.name || ""}</h3>
      </div>

      <div className="flex items-center gap-1 py-4 border-y border-textDark">
        <TripTagsListing data={data} />
      </div>

      <div className="flex flex-col gap-4">{renderedItineraries}</div>

      <p className="text-sm font-semibold text-center border-t lg:text-base pt-7 border-textDark">
        {t("finalDetails.freeReturn")}
      </p>
    </FrameWithImagedHeader>
  );
};

export default TripLastDetailsSection;
