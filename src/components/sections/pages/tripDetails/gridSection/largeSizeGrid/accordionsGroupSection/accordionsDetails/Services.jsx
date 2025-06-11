import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";

const Services = ({ data }) => {
  const renderedData = data?.map((item, index) => (
    <li
      key={item._id}
      className={`flex flex-col min-w-[200px] w-[222px] p-6 border rounded-lg border-accordionBorder ${
        index === data?.length - 1 && "me-5"
      }`}
    >
      <ImageWithPlaceholder
        src={item.service.icon}
        alt={item.service.name}
        width={100}
        height={100}
        className="object-contain mb-3 w-[100px] h-[100px] rounded-md border  p-3 border-mainColor"
      />

      <div>
        <h4 className="font-medium text-black">{item.service.name}</h4>
        <h4 className="text-sm">{item.note}</h4>
      </div>
    </li>
  ));

  return <ul className="flex gap-3 pb-3 overflow-x-auto">{renderedData}</ul>;
};

export default Services;
