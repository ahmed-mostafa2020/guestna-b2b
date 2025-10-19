import { memo } from "react";

const InfoCard = ({ item }) => {
  return (
    <div className="transition-all duration-300 transform hover:-translate-y-1 flex gap-2 p-4 ease-in-out bg-white border rounded-xl border-border hover:shadow-card">
      {item.icon && item.icon}

      <div className="flex flex-col items-start gap-3">
        <p className="font-medium text-[#202224] opacity-70">{item.title}</p>

        <p className="text-xl font-semibold text-[#202224]">{item.value}</p>
      </div>
    </div>
  );
};

export default memo(InfoCard);
