"use client";

// import Link from "next/link";

// import { useLocale } from "next-intl";

import { memo } from "react";

import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";

const MainCategoryCard = ({ category }) => {
  // const locale = useLocale();

  if (!category) return null;

  return (
    <div
      key={category._id}
      className="relative overflow-hidden rounded-lg group cursor-grab"
    >
      <ImageWithPlaceholder
        src={category.icon}
        alt={category.name}
        width={370}
        height={430}
        className="w-full h-[430px] object-cover rounded-lg group-hover:filter"
      />

      <div className="absolute inset-0 transition-all duration-200 ease-in-out bg-black bg-opacity-0 group-hover:bg-opacity-40"></div>

      <div
        // href={`/${locale}/discover?categories=${category._id}`}
        className="absolute  text-center bottom-0 left-0 right-0 bg-[rgba(10,10,10,0.76)] backdrop-blur-[12px] px-3 py-3 z-[2] text-white transition-all duration-500 
  ease-in-out h-16 group-hover:h-full group-hover:rounded-lg centered flex-col gap-2"
      >
        <h4 className="text-lg font-semibold lg:text-xl">{category.name}</h4>

        <p className="hidden overflow-auto leading-8 transition-all duration-500 ease-in-out group-hover:block">
          {category.description}
        </p>
      </div>
    </div>
  );
};

export default memo(MainCategoryCard);
