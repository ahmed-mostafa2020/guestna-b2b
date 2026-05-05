"use client";

import { memo } from "react";
import { Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";

/**
 * ProfilePageSkeleton
 *
 * Renders a shimmer placeholder that mirrors the real profile layout
 * (sidebar navigation + main content cards/table).
 * Shown as the page backdrop while the LoginAccessModal is active so users
 * understand they are on a profile page.
 */
const ProfilePageSkeleton = () => (
  <div className="bg-[#F8F9FA] border-t border-b border-[#CAC9C9] min-h-screen">
    <Grid container>
      {/* Sidebar skeleton */}
      <Grid size={{ xs: 12, sm: 3, lg: 2.5 }}>
        <aside className="flex flex-col p-6 gap-3 bg-white border-e border-[#CAC9C9] h-full min-h-screen">
          {/* Profile avatar + name */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#CAC9C9]">
            <Skeleton variant="circular" width={44} height={44} />
            <div className="flex-1">
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" height={16} />
            </div>
          </div>

          {/* Nav items */}
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={42} sx={{ borderRadius: "10px" }} />
          ))}
        </aside>
      </Grid>

      {/* Main content skeleton */}
      <Grid size={{ xs: 12, sm: 9, lg: 9.5 }}>
        <div className="p-4 lg:p-7 flex flex-col gap-5">
          {/* Page title */}
          <Skeleton variant="text" width={180} height={36} />

          {/* Info cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={100}
                sx={{ borderRadius: "12px" }}
              />
            ))}
          </div>

          {/* Chart area */}
          <Skeleton
            variant="rounded"
            height={240}
            sx={{ borderRadius: "12px" }}
          />

          {/* Table area */}
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={140} height={28} />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={52}
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </div>
        </div>
      </Grid>
    </Grid>
  </div>
);

export default memo(ProfilePageSkeleton);
