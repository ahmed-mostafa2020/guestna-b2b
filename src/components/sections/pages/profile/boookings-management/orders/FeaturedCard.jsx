import { memo } from "react";

const FeatureCard = ({ icon, title, bgColor }) => {
  return (
    <div className="flex flex-1 flex-col items-center gap-2 rounded-xl py-4 px-2 shadow-card">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-md"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <p className="text-sm lg:text-base font-semibold opacity-70 text-center">
        {title}
      </p>
    </div>
  );
};

export default memo(FeatureCard);
