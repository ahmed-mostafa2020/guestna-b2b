"use client";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { toggleCity } from "@store/searchFilter/searchFilterSlice";

import { memo } from "react";

import FilterAccordion from "@components/filtersBox/FilterAccordion";

import { doneIcon } from "@assets/svg";

const Destinations = ({ destinations, title }) => {
  const cities = useSelector((state) => state.searchFilter.cities);

  const dispatch = useDispatch();

  const destinationsList = destinations?.map((destination) => (
    <button
      key={destination._id}
      onClick={() => dispatch(toggleCity(destination._id))}
      className={`flex w-full justify-between p-4 transition-all duration-200 ease-in-out hover:bg-buttonsHover ${
        cities.includes(destination._id) ? "bg-buttonsHover" : "bg-white"
      }`}
    >
      <div className="flex gap-1">
        <Image
          src={destination.icon}
          alt="destination"
          width={28}
          height={20}
          className="object-contain h-5 w-7"
        />
        <p>{destination.name}</p>
      </div>

      {cities.includes(destination._id) && <span>{doneIcon}</span>}
    </button>
  ));

  return (
    <FilterAccordion title={title} index={0}>
      {destinationsList}
    </FilterAccordion>
  );
};

export default memo(Destinations);
