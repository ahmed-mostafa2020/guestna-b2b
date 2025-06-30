import AccordionsGroupSection from "./accordionsGroupSection";
// import TripTagsListing from "./tripTags/TripTagsListing";

const LargeSizeSection = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* {data?.trip?.loversCount >= 0 && (
        <FavoredByGuestsSection
          rating={data?.rate || 4.73}
          reviewsCount={data?.reviewsCount || 20}
        />
      )} */}

      {/* <TripTagsListing /> */}

      <AccordionsGroupSection />
    </div>
  );
};

export default LargeSizeSection;
