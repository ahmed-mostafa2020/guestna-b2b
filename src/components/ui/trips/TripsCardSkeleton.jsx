"use client";

import { memo } from "react";
import { Skeleton, Box } from "@mui/material";

const TripsCardSkeleton = ({ imageWidth = 500 }) => {
  return (
    <Box className="rounded-2xl overflow-hidden flex flex-col card-shadow relative border border-[#E4E6E8]">
      {/* Badges */}
      <Box className="flex items-center ps-4 gap-2 absolute z-[1] top-8">
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
      </Box>

      {/* Image */}
      <Skeleton
        variant="rectangular"
        height={272}
        width="100%"
        sx={{ maxWidth: imageWidth }}
      />

      {/* Content */}
      <Box className="mt-[-30px] relative bg-white z-[1] rounded-tr-[32px] p-4 flex flex-col gap-2">
        {/* Cities + Rating */}
        <Box className="flex justify-between items-center">
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={90} height={20} />
        </Box>

        {/* Title */}
        <Skeleton variant="text" width="100%" height={26} />

        {/* Meta info */}
        <Box className="flex flex-wrap gap-2">
          <Skeleton variant="text" width={90} height={18} />
          <Skeleton variant="text" width={110} height={18} />
          <Skeleton variant="text" width={70} height={18} />
        </Box>

        {/* Price + Button */}
        <Box className="flex items-center justify-between gap-2 lg:mt-4 mt-2">
          <Skeleton variant="text" width={100} height={22} />
          <Skeleton variant="rounded" width={160} height={40} />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(TripsCardSkeleton);
