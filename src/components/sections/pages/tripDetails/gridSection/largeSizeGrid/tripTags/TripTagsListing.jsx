import TripTags from ".";

const TripTagsListing = () => {
  const tagsList = [{ icon: "", text: "" }];

  const renderedTagsList = tagsList.map((tag, index) => (
    <TripTags key={index} icon={tag.icon} text={tag.text} />
  ));
  return (
    <div className="flex-wrap gap-3 centered lg:gap-5">{renderedTagsList}</div>
  );
};

export default TripTagsListing;
