import { memo } from "react";

const BookingDataCard = ({ title, subTitle }) => {
  return (
    <div className="px-4 py-2 border-2 rounded-lg lg:py-6 border-mainColor">
      <p className="mb-2 text-lg lg:min-w-[285px] font-bold text-black">
        {title}
      </p>
      <p className="text-base font-medium text-black">{subTitle}</p>
    </div>
  );
};

export default memo(BookingDataCard);
