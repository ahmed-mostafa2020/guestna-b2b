import { memo } from "react";

const ExtraInformation = ({ data }) => {
  const renderedData = data?.map((list) => (
    <div key={list._id}>
      <h3 className="pb-2 text-xl font-medium text-black">{list.name}</h3>

      <ul className="list-disc ps-5">
        {list.contents.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  ));

  return <div className="flex flex-col gap-3">{renderedData}</div>;
};

export default memo(ExtraInformation);
