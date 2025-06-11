"use client";

import { toggleCity } from "@store/searchFilter/searchFilterSlice";
import { useDispatch, useSelector } from "react-redux";

import { memo } from "react";

import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";
const Place = ({ id, src, name }) => {
  const dispatch = useDispatch();
  const selectedCities = useSelector((state) => state.searchFilter.cities);

  return (
    <div
      onClick={() => dispatch(toggleCity(id))}
      className={`flex flex-col items-center gap-2 flex-shrink-0 px-2 py-1 transition-all duration-200 ease-in-out rounded-xl cursor-pointer  
        ${
          selectedCities.includes(id)
            ? "bg-mainColor"
            : "bg-transparent hover:bg-[#E2FFFC]"
        }`}
    >
      <ImageWithPlaceholder
        src={src}
        alt={name}
        width={140}
        height={140}
        className="rounded-md w-[130px] h-[140px]"
      />

      <h4
        className={`font-medium ${
          selectedCities.includes(id)
            ? " text-white"
            : "text-textDark hover:bg-[#E2FFFC]"
        }`}
      >
        {name}
      </h4>
    </div>
  );
};

export default memo(Place);
