import { memo } from "react";

const TripTag = ({ icon, text }) => {
  return (
    <div className="flex gap-1 px-4 py-2 bg-white border rounded-lg border-secColor -items-center shadow-tag">
      {icon}

      {text}
    </div>
  );
};

export default memo(TripTag);
