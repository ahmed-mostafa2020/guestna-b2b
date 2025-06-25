"use client";

import { memo, useEffect, useState } from "react";

import { cn } from "@utils/cn";
import ReviewsCard from "../../sections/pages/tripDetails/reviewsSection/ReviewsCard";

import { chevronLeftIcon, chevronRightIcon, largeStarIcon } from "@assets/svg";

const SliderWithArrowsSection = ({ dataList, title, subTitle, cardType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getVisibleSlides = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        return 1;
      }
      if (window.innerWidth < 1024) return 2;
      return 3.4;
    }
    return 4;
  };

  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides());

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + Math.floor(visibleSlides) >= dataList?.length
        ? 0
        : prevIndex + Math.floor(visibleSlides)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, dataList?.length - Math.floor(visibleSlides))
        : Math.max(0, prevIndex - Math.floor(visibleSlides))
    );
  };

  const renderedDatesList = dataList?.map((item, index) => (
    <div
      key={index}
      className={cn(
        "flex-shrink-0 px-2",
        visibleSlides === 1
          ? "w-full"
          : visibleSlides === 2
          ? "w-1/2"
          : visibleSlides === 2.5 && cardType === "date"
          ? "w-[40%]"
          : cardType === "date"
          ? "w-1/5"
          : "w-[30%]"
      )}
    >
      <ReviewsCard
        imageSrc={item.createdBy?.image}
        name={item.createdBy?.name}
        date={item.createdAt}
        comment={item.comment}
      />
    </div>
  ));

  return (
    <section className="w-full max-w-6xl px-4 py-8 mx-auto" dir="rtl">
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col items-center">
            {title && (
              <h2 className="text-titleColor lg:text-[32px] text-lg font-medium lg:leading-10 pb-2">
                {title}
              </h2>
            )}

            <h3 className="flex items-center gap-2 lg:text-[28px] text-sm lg:leading-9 w-[80%] lg:w-full">
              {cardType === "review" && largeStarIcon} {subTitle}
            </h3>
          </div>

          <div className="space-x-2 rtl:space-x-reverse">
            <button
              className="w-12 h-12 p-2 text-center bg-white rounded-full"
              onClick={prevSlide}
            >
              <span className="mx-auto centered">{chevronRightIcon}</span>
            </button>
            <button
              className="w-12 h-12 p-2 text-center bg-white rounded-full"
              onClick={nextSlide}
            >
              <span className="mx-auto centered">{chevronLeftIcon}</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${(currentIndex * 100) / visibleSlides}%)`,
            }}
          >
            {renderedDatesList}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(SliderWithArrowsSection);
