import { memo } from "react";

import ValidationMessage from "./ValidationMessage";
import { wrongIcon } from "@assets/svg";

const ExemptedFromTrip = ({ data }) => {
  if (data.length === 0) return <ValidationMessage />;

  const renderedData = data?.map((item, index) => (
    <li key={index} className="flex items-center gap-2">
      {wrongIcon}
      <p>{item}</p>
    </li>
  ));

  return <ul>{renderedData}</ul>;
};

export default memo(ExemptedFromTrip);
