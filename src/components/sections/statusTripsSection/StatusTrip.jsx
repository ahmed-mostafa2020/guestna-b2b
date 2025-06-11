"use client";

import Image from "next/image";

import { useMemo, useState } from "react";

import VideosListSlider from "./VideosListSlider";
import CustomizedModal from "../../common/customizedModal";

const StatusTrip = ({ statusTripsData, status, index }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const numCities = status.cities.length;
  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return (
        <h4 className="text-base font-semibold capitalize text-mainColor">
          {status.cities[0].name}
        </h4>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          {status.cities.map((city, index) => (
            <h4
              key={city._id}
              className="text-base font-semibold capitalize text-mainColor"
            >
              {city.name}
              {index != status.cities.length - 1 && <span>-</span>}
            </h4>
          ))}
        </div>
      );
    }
  }, [numCities, status.cities]);

  return (
    <>
      <div
        onClick={handleOpen}
        className="flex flex-col items-center gap-2 cursor-pointer w-fit"
      >
        <div className="w-[80px] h-[80px] custom-gradient-border rounded-full">
          <Image
            src={status.thumbnail.web}
            alt="video"
            width={80}
            height={80}
            className="object-cover w-full h-full rounded-full"
          />
        </div>

        {renderCities}

        <p className="text-sm text-center">
          {status.categories?.[0].name || "No category"}
        </p>
      </div>

      <CustomizedModal open={open} handleClose={handleClose}>
        <VideosListSlider
          statusTripsData={statusTripsData}
          initialCenterIndex={index}
        />
      </CustomizedModal>
    </>
  );
};

export default StatusTrip;
