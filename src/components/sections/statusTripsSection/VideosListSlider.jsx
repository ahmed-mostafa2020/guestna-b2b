"use client";

import { useLocale } from "next-intl";

import { useEffect, useRef, useState } from "react";

import Video from "../../common/trips/Video";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VideosListSlider = ({ statusTripsData, initialCenterIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialCenterIndex || 0);

  const locale = useLocale;
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      // Force re-center to the initial slide
      sliderRef.current.slickGoTo(initialCenterIndex);
      setActiveIndex(initialCenterIndex);
    }
  }, [initialCenterIndex]);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "200px",
    slidesToShow: 3,
    speed: 400,
    initialSlide: initialCenterIndex,
    afterChange: (current) => setActiveIndex(current),
    rtl: true,
    dir: locale == "ar" ? "rtl" : "ltr",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: "200px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "200px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
    ],
  };

  const renderedVideosList = statusTripsData?.map((status, index) => (
    <div
      key={status._id}
      className={`transition-transform duration-200 ease-in-out outline-none rounded-3xl ${
        activeIndex === index ? "relative z-[3] scale-105" : "z-[1] scale-100"
      }`}
    >
      <div
        className={`transition-transform ease-in-out duration-200 rounded-3xl h-[600px] flex items-center ${
          activeIndex === index ? "opacity-100" : "opacity-85"
        } `}
      >
        <Video
          height={
            activeIndex === index
              ? "550"
              : activeIndex === index - 1 || activeIndex === index + 1
              ? "400"
              : "350"
          }
          width={
            activeIndex === index
              ? "300"
              : activeIndex === index - 1 || activeIndex === index + 1
              ? "230"
              : "230"
          }
          src={status.video}
          poster={status.thumbnail.web}
          statusImage={status.thumbnail.web}
          linkTitle={status.name}
          slug={status.slug}
          linkPosition="top"
          index={index}
          activeIndex={activeIndex}
          tripId={status._id}
          favoriteState={status.isFavorite || false}
        />
      </div>
    </div>
  ));

  return (
    <div className="slider-container">
      <Slider
        ref={sliderRef}
        className="transition-all duration-200 ease-in-out"
        {...settings}
        style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
      >
        {renderedVideosList}
      </Slider>
    </div>
  );
};

export default VideosListSlider;
