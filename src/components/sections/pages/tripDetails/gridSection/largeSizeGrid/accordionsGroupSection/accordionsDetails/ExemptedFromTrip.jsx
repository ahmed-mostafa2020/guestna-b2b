import { memo } from "react";

import { wrongIcon } from "@assets/svg";
const ExemptedFromTrip = ({ data }) => {
  const renderedData = data?.map((item, index) => (
    <li key={index} className="flex items-center gap-2">
      {wrongIcon}
      <p>{item}</p>
    </li>
  ));

  return <ul>{renderedData}</ul>;
};

export default memo(ExemptedFromTrip);
