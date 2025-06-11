import { memo } from "react";

const MustHaveItems = ({ data }) => {
  const renderedData = data?.map((item, index) => <li key={index}>{item}</li>);

  return <ul className="list-disc ps-5">{renderedData}</ul>;
};

export default memo(MustHaveItems);
