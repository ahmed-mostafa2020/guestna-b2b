"use client";

import React, { useState } from "react";
import Image from "next/image";

const VideosSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with middle image active

  // Sample images - replace with your actual images

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative bg-gray-900">
      {/* Main slider container */}
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `-translateX(calc(50vw - ${
              activeIndex * 400
            }px - 200px))`, // Center active image
          }}
        >
          {images.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className={`relative flex-shrink-0 mx-2 transition-all duration-500 ease-in-out`}
                style={{
                  transform: `scale(${
                    isActive
                      ? 1.2
                      : Math.abs(activeIndex - index) === 1
                      ? 0.9
                      : 0.8
                  })`,
                  opacity: isActive
                    ? 1
                    : Math.abs(activeIndex - index) === 1
                    ? 0.8
                    : 0.6,
                  zIndex: isActive ? 10 : 5,
                  width: "400px",
                  height: "300px",
                }}
              >
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover rounded-lg shadow-xl cursor-pointer"
                  onClick={() => setActiveIndex(index)}
                  priority={isActive}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute z-20 p-3 text-gray-800 transition-all -translate-y-1/2 rounded-full shadow-lg end-4 top-1/2 bg-white/80 hover:bg-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute z-20 p-3 text-gray-800 transition-all -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-white/80 hover:bg-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default VideosSlider;
