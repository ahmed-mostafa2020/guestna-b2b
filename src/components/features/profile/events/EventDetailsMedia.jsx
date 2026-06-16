"use client";

import { memo } from "react";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";
import Video from "@components/ui/trips/Video";

const EventDetailsMedia = ({ thumbnail, video, name }) => {
  const imageUrl = thumbnail?.web || thumbnail?.app || "";

  return (
    <section className="w-full">
      {video ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Image Thumbnail Container */}
          <div className="relative w-full h-[250px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
            {imageUrl ? (
              <ImageWithPlaceholder
                src={imageUrl}
                alt={name || "Event media"}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                🖼️
              </div>
            )}
          </div>

          {/* Video Container */}
          <div className="relative w-full h-[250px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Video
              src={video}
              poster={imageUrl}
              height={450}
              width={800}
              showTitleLink={false}
              cornerVideo={false}
              activeIndex={0}
              index={0}
            />
          </div>
        </div>
      ) : (
        /* Full width banner when no video */
        <div className="relative w-full h-[250px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {imageUrl ? (
            <ImageWithPlaceholder
              src={imageUrl}
              alt={name || "Event media"}
              width={1600}
              height={450}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
              🖼️
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default memo(EventDetailsMedia);
