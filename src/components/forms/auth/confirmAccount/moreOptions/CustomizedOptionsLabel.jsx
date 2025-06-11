"use client";

import { memo } from "react";

const CustomizedOptionsLabel = ({ icon, title, description }) => {
  return (
    <div className="flex items-center justify-between gap-1">
      <div className="flex items-center gap-[10px]">
        {icon && icon}

        <div className="flex flex-col font-somar">
          {title && <p className="font-semibold">{title}</p>}

          {description && (
            <p className="text-sm font-normal text-[#878787] w-fit">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CustomizedOptionsLabel);
