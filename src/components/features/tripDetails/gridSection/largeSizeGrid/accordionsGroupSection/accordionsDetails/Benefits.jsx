import { memo } from "react";

import ValidationMessage from "./ValidationMessage";

const Benefits = ({ data, isAuth }) => {
  if (!isAuth && data.length === 0) return <ValidationMessage />;

  const renderedData = data?.map((item, index) => <li key={index}>{item}</li>);

  return <ul className="list-disc ps-5">{renderedData}</ul>;
};

export default memo(Benefits);
