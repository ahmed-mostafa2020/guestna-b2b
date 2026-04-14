"use client";

import Image from "next/image";

import { memo } from "react";

import formatCurrency from "@utils/formatters/FormatCurrency";

const CustomizedLabel = ({ image, title, description, price }) => {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center justify-between gap-1">
        <div className="flex gap-1">
          {image && (
            <Image
              src={image}
              alt={title}
              width={20}
              height={20}
              className="object-contain"
            />
          )}

          {title && <p className="text-lg">{title}</p>}
        </div>

        {price && <p>{formatCurrency(price)}</p>}
      </div>

      {description && (
        <p className="text-sm font-normal text-gray-400 border-b font-ibm w-fit border-border">
          {description}
        </p>
      )}
    </div>
  );
};

export default memo(CustomizedLabel);
