import { memo } from "react";

const PackagesTable = ({ data }) => {
  return <div>{data?.nodes?.[0]?.slug}</div>;
};

export default memo(PackagesTable);
