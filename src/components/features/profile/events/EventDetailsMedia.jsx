"use client";

import { memo } from "react";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";

const EventDetailsMedia = ({ thumbnail, video, name }) => {
  const imageUrl = thumbnail?.web || thumbnail?.app || "";

  return (
    <section className="w-full">
      {video ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Image Thumbnail Container */}
          <div className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
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
          <div className="relative w-full h-[250px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 lg:col-span-2">
            <video
              src={video}
              poster={imageUrl}
              controls
              playsInline
              className="w-full h-full object-cover bg-black"
            >
              Your browser does not support the video tag.
            </video>
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
