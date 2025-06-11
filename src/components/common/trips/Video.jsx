"use client";

import Link from "next/link";
import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";

import ImageWithPlaceholder from "../imagesPlaceholder/ImageWithPlaceholder";
import FavoriteButton from "./FavoriteButton";

import playVideo from "@assets/play.png";

import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";

const Video = ({
  height = "100%",
  width = " 100%",
  src,
  poster,
  statusImage,
  showTitleLink = true,
  linkTitle,
  slug,
  linkPosition = "bottom",
  index = 0,
  activeIndex = 1,
  cornerVideo = false,
  tripId,
  favoriteState,
}) => {
  const [isHovering, setIsHovering] = useState(activeIndex === index);
  const t = useTranslations();
  const locale = useLocale();
  const videoRef = useRef(null);

  useEffect(() => {
    setIsHovering(index === activeIndex);
  }, [activeIndex, index]);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovering || index === activeIndex) {
        videoRef.current.play().catch((error) => {
          console.log("Autoplay failed:", error);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovering, activeIndex, index]);

  if (!src) return null;

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() =>
        index === activeIndex ? setIsHovering(true) : setIsHovering(false)
      }
      className={`relative mx-auto overflow-hidden max-w-[330px] lg:max-w-full ${
        cornerVideo
          ? locale === "ar"
            ? "rounded-tr-2xl rounded-br-2xl"
            : "rounded-tl-2xl rounded-bl-2xl"
          : "rounded-xl lg:rounded-3xl"
      }`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <video
        width="100%"
        autoPlay={isHovering || index === activeIndex}
        muted
        loop
        controls={isHovering}
        ref={videoRef}
        preload="metadata"
        title="Underwater Diving at Half Moon Beach"
        className="object-cover w-full h-full"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isHovering && poster && (
        <figure className="absolute top-0 w-full h-full transition-all duration-200 ease-in-out centered start-0">
          <ImageWithPlaceholder
            src={poster}
            alt={slug}
            width={width}
            height={height}
            videoPoster={true}
            className="absolute object-cover w-[101%] h-[101%]"
          />

          {statusImage ? (
            <div className="absolute z-[4] w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] custom-gradient-border rounded-full">
              <Image
                src={statusImage}
                alt="status Image"
                width={200}
                height={200}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          ) : (
            <Image
              src={playVideo}
              alt="play video"
              width={200}
              height={200}
              className="absolute z-[4] rounded-full 
    w-[60px] h-[60px] lg:w-[100px] lg:h-[100px]"
            />
          )}
        </figure>
      )}

      {isHovering && !statusImage && showTitleLink && (
        <Link
          href={`/${locale}/discover/${slug}`}
          className={`absolute flex ${
            linkPosition == "bottom"
              ? "items-end -bottom-0.5"
              : "items-start top-0"
          } w-full h-fit transition-all duration-200 ease-in-out start-0`}
        >
          {showTitleLink && (
            <div className="flex items-center justify-between w-full p-3 py-2 bg-white">
              <h4 className="text-sm font-semibold text-titleColor">
                {linkTitle}
              </h4>
              <h5 className="text-xs font-medium">
                {t("links.watchTripDetails")}{" "}
                {locale == "ar" ? <WestIcon /> : <EastIcon />}
              </h5>
            </div>
          )}
        </Link>
      )}

      {isHovering && statusImage && (
        <div
          className={`absolute flex ${
            linkPosition == "bottom"
              ? "items-end bottom-0"
              : "items-start top-0"
          } w-full h-fit transition-all duration-200 ease-in-out start-0`}
        >
          <div className="relative flex flex-row-reverse items-center justify-between w-full gap-2 p-3 py-4">
            <Link
              href={`/${locale}/discover/${slug}`}
              className="flex-1 text-sm font-semibold text-white text-wrap text-end"
            >
              {linkTitle}
            </Link>

            <FavoriteButton
              tripId={tripId}
              favoriteState={favoriteState}
              isAbsolute={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Video);
