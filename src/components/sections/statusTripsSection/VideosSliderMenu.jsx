"use client";

import Image from "next/image";
import { useState } from "react";

const VideosSliderMenu = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevClick = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const handleNextClick = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-full max-w-4xl">
        <div
          className="absolute z-10 transform -translate-y-1/2 cursor-pointer end-0 top-1/2"
          onClick={handlePrevClick}
        >
          <svg
            className="w-8 h-8 text-gray-500 hover:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
        <div
          className="absolute right-0 z-10 transform -translate-y-1/2 cursor-pointer top-1/2"
          onClick={handleNextClick}
        >
          <svg
            className="w-8 h-8 text-gray-500 hover:text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <div className="flex items-center justify-center h-full">
          <Image
            src={images[activeIndex]}
            alt="Beach scene 3"
            className="max-h-[80vh] w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default VideosSliderMenu;
