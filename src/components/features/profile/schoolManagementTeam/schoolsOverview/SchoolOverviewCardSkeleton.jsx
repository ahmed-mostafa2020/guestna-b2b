"use client";

import { Box, Skeleton } from "@mui/material";

const SchoolOverviewCardSkeleton = () => {
  return (
    <Box
      className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white"
      sx={{ direction: "rtl" }}
    >
      {/* Top Section */}
      <Box className="flex justify-between mb-2">
        <Box className="flex items-center mb-1">
          <Skeleton
            variant="rounded"
            width={48}
            height={48}
            className="rounded-lg me-2"
          />

          <Skeleton variant="text" width={140} height={28} />
        </Box>

        <Skeleton
          variant="rounded"
          width={70}
          height={28}
          className="rounded-full"
        />
      </Box>

      {/* City */}
      <Box className="flex items-center gap-1 mb-3">
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={70} height={22} />
      </Box>

      {/* Revenue Box */}
      <Box className="bg-green-50 px-4 py-4 rounded-md mb-3 flex justify-between">
        <Skeleton variant="text" width={120} height={22} />
        <Skeleton variant="text" width={60} height={22} />
      </Box>

      {/* Students Count */}
      <Box className="bg-blue-50 px-4 py-4 rounded-md mb-3 flex justify-between">
        <Skeleton variant="text" width={120} height={22} />
        <Skeleton variant="text" width={30} height={22} />
      </Box>

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-2 text-center mb-4">
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            className="bg-gray-100 py-2 rounded-lg flex flex-col items-center"
          >
            <Skeleton variant="text" width={30} height={22} />
            <Skeleton variant="text" width={80} height={18} />
          </Box>
        ))}
      </Box>

      {/* Button */}
      <Skeleton variant="rounded" height={48} className="w-full rounded-lg" />
    </Box>
  );
};

export default SchoolOverviewCardSkeleton;
