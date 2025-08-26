import { memo } from "react";

const InfoCard = ({ key, item }) => {
  return (
    <div className="flex gap-2 p-4 transition-all duration-150 ease-in-out bg-white border rounded-xl border-border hover:shadow-card">
      {item.icon && item.icon}

      <div className="flex flex-col items-start gap-3">
        <p className="font-medium text-[#202224] opacity-70">{item.title}</p>

        <p className="text-xl font-semibold text-[#202224]">{item.value}</p>
      </div>
    </div>
  );
};

export default memo(InfoCard);
