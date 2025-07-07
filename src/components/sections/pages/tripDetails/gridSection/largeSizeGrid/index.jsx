"user client";

import { useSelector } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import AccordionsGroupSection from "./accordionsGroupSection";
import TripTagsListing from "./tripTags/TripTagsListing";

const LargeSizeSection = () => {
  const userType = useSelector((state) => state.users.userType);

  const data = useSelector((state) => state.tripDetailsData.data.trip) || {};

  return (
    <div className="flex flex-col gap-5">
      {/* {data?.trip?.loversCount >= 0 && (
        <FavoredByGuestsSection
          rating={data?.rate || 4.73}
          reviewsCount={data?.reviewsCount || 20}
        />
      )} */}
      {userType === CONSTANT_VALUES.USERS.PARENT && (
        <TripTagsListing data={data} />
      )}

      <AccordionsGroupSection />
    </div>
  );
};

export default LargeSizeSection;
