"use client";

import Image from "next/image";
import { memo, useState } from "react";
import { Skeleton } from "@mui/material";

const ImageWithPlaceholder = ({
  src,
  alt = "image",
  width,
  height,
  className = "",
  priority = false,
  videoPoster = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="relative w-full centered"
      style={{
        height: videoPoster && "100%",
        // height: height === "auto" ? "100%" : `${height}px`,
        // width: width === "auto" ? "100%" : `${width}px`,
      }}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={width === "auto" ? "100%" : `${width}px`}
          height={height === "auto" ? "100%" : `${height}px`}
          // width="100%"
          // height="100%"
          className="absolute top-0"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default memo(ImageWithPlaceholder);
