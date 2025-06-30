import { memo } from "react";

const TripTag = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-1 px-4 py-2 font-medium bg-white border rounded-lg border-secColor shadow-tag">
      {icon}

      {text}
    </div>
  );
};

export default memo(TripTag);
