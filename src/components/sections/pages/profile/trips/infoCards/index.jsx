"use client";
import { memo } from "react";

const InfoCard = ({ item, textAlign = "start", showIcon = true }) => {
  const alignmentClass =
    textAlign === "center" ? "items-center text-center" : "items-start";

  return (
    <div className="transition-all duration-300 transform hover:-translate-y-1 flex gap-2 p-4 ease-in-out bg-white border rounded-xl border-border hover:shadow-card">
      {showIcon && item.icon && item.icon}

      <div className={`flex flex-col gap-3 ${alignmentClass} flex-1`}>
        <p className="font-medium text-[#202224] opacity-70">{item.title}</p>

        <p className="text-xl font-semibold text-[#202224]">{item.value}</p>
      </div>
    </div>
  );
};

export default memo(InfoCard);
