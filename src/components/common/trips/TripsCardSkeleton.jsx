"use client";

import React from "react";
import { Skeleton, Box } from "@mui/material";

const TripsCardSkeleton = () => {
  return (
    <Box
      role="status"
      aria-busy="true"
      className="rounded-2xl overflow-hidden flex flex-col relative border h-full border-[#E4E6E8] bg-white"
    >
      {/* Badges */}
      <Box className="flex items-center ps-4 gap-2 absolute z-[1] top-8">
        <Skeleton variant="rounded" width={72} height={22} animation="wave" />
        <Skeleton variant="rounded" width={56} height={22} animation="wave" />
      </Box>

      {/* Image */}
      <Skeleton
        variant="rectangular"
        height={272}
        animation="wave"
        className="w-full !rounded-none"
      />

      {/* Content */}
      <Box className="mt-[-30px] relative z-[1] bg-white rounded-tr-[32px] p-4 flex flex-col gap-3">
        {/* Cities + Rating */}
        <Box className="flex justify-between items-center">
          <Skeleton variant="text" width="40%" height={22} animation="wave" />
          <Skeleton variant="text" width="30%" height={22} animation="wave" />
        </Box>

        {/* Title */}
        <Skeleton variant="text" width="85%" height={28} animation="wave" />

        {/* Meta info */}
        <Box className="flex flex-wrap gap-2">
          <Skeleton variant="rounded" width={88} height={22} animation="wave" />
          <Skeleton
            variant="rounded"
            width={110}
            height={22}
            animation="wave"
          />
          <Skeleton variant="rounded" width={76} height={22} animation="wave" />
          <Skeleton variant="rounded" width={96} height={22} animation="wave" />
        </Box>

        {/* Footer */}
        <Box className="flex items-center justify-between mt-4 gap-3">
          <Skeleton variant="text" width="35%" height={24} animation="wave" />
          <Skeleton
            variant="rounded"
            width={150}
            height={40}
            animation="wave"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TripsCardSkeleton;
