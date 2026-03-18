"user client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

// import { USERS } from "@constants/users";
import AccordionsGroupSection from "./accordionsGroupSection";
import TripTagsListing from "./tripTags/TripTagsListing";

const LargeSizeSection = () => {
  // const userType = useSelector((state) => state.users.userType);

  const data = useSelector((state) => state.tripDetailsData.data.trip) || {};

  const isAuth = data?.isAuth ?? true;

  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5">
      {/* {data?.trip?.loversCount >= 0 && (
        <FavoredByGuestsSection
          rating={data?.rate || 4.73}
          reviewsCount={data?.reviewsCount || 20}
        />
      )} */}
      {isAuth && pathname?.includes("/parents/") && (
        <TripTagsListing data={data} />
      )}
      <AccordionsGroupSection />
    </div>
  );
};

export default LargeSizeSection;
