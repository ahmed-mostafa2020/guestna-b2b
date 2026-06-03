"use client";

import { Skeleton } from "@mui/material";

const RecommendationsLoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton variant="rounded" height={176} sx={{ borderRadius: "16px" }} />
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Main content — FIRST in DOM (RTL: right side) */}
      <div className="flex-1 flex flex-col gap-4">
        <Skeleton variant="rounded" height={96} sx={{ borderRadius: "12px" }} />
        <Skeleton variant="rounded" height={130} sx={{ borderRadius: "14px" }} />
        <Skeleton variant="rounded" width={200} height={32} sx={{ borderRadius: "8px" }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: "12px" }} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: "12px" }} />
      </div>
      {/* Sidebar — SECOND in DOM (RTL: left side) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
        <Skeleton variant="rounded" height={340} sx={{ borderRadius: "16px" }} />
        <Skeleton variant="rounded" height={196} sx={{ borderRadius: "12px" }} />
      </div>
    </div>
  </div>
);

export default RecommendationsLoadingSkeleton;
