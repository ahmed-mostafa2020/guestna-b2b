import React from "react";
import { Box, Card, CardContent, Skeleton, Stack, Paper } from "@mui/material";

/**
 * Skeleton loader for individual card sections
 */
export const CardSkeleton = ({
  rows = 3,
  hasAvatar = false,
  hasImage = false,
  height = "auto",
}) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header with optional avatar */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          {hasAvatar && <Skeleton variant="circular" width={56} height={56} />}
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={32} />
          </Box>
        </Stack>

        {/* Divider */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={1}
          sx={{ mb: 3, bgcolor: "grey.300" }}
        />

        {/* Content rows */}
        <Stack spacing={2}>
          {hasImage && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ borderRadius: 2 }}
            />
          )}

          {Array.from({ length: rows }).map((_, index) => (
            <Box key={index}>
              <Skeleton
                variant="text"
                width="30%"
                height={20}
                sx={{ mb: 0.5 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={48}
                sx={{ borderRadius: 2, bgcolor: "grey.100" }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

/**
 * Full page skeleton for Order Details
 */
export const OrderPageLoadingSkeleton = () => {
  return (
    <Box className="!font-somar py-3 mx-auto">
      {/* Header Section Skeleton */}
      <Box className="flex gap-2 flex-col mb-6">
        <Box className="flex gap-2 items-center flex-wrap mb-2">
          {/* Back button skeleton */}
          <Skeleton
            variant="rectangular"
            width={32}
            height={32}
            sx={{ borderRadius: 2 }}
          />
          {/* Title skeleton */}
          <Skeleton variant="text" width={200} height={32} />
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* School Info Section Skeleton */}
        <CardSkeleton rows={4} hasAvatar={true} />

        {/* Trip Info Section Skeleton */}
        <CardSkeleton rows={3} hasImage={true} />

        {/* Trip Date Section Skeleton */}
        <CardSkeleton rows={2} />

        {/* Pricing Section Skeleton */}
        <CardSkeleton rows={3} />

        {/* Additional Info Section Skeleton (optional - show always for consistency) */}
        <CardSkeleton rows={2} />
      </Stack>

      {/* Edit Button Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        sx={{
          borderRadius: 2,
          mt: 4,
          bgcolor: "grey.300",
        }}
      />
    </Box>
  );
};

/**
 * Compact skeleton for quick loading states
 */
export const CompactOrderDetailsSkeleton = () => {
  return (
    <Box className="!font-somar">
      <Stack spacing={2}>
        {/* Header */}
        <Paper
          sx={{
            height: 60,
            bgcolor: "grey.200",
            borderRadius: 2,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 2 }}
          />
        </Paper>

        {/* Large card */}
        <Paper
          sx={{
            height: 200,
            bgcolor: "grey.200",
            borderRadius: 3,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 3 }}
          />
        </Paper>

        {/* Content card */}
        <Paper
          sx={{
            height: 300,
            bgcolor: "grey.200",
            borderRadius: 3,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 3 }}
          />
        </Paper>
      </Stack>
    </Box>
  );
};

/**
 * Animated pulse skeleton (your current style)
 */
export const PulseSkeletonLoader = () => {
  return (
    <Box className="!font-somar">
      <Stack spacing={2}>
        <Paper
          sx={{
            height: 60,
            bgcolor: "grey.200",
            borderRadius: 2,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.5,
              },
            },
          }}
        />
        <Paper
          sx={{
            height: 200,
            bgcolor: "grey.200",
            borderRadius: 3,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.5,
              },
            },
          }}
        />
        <Paper
          sx={{
            height: 300,
            bgcolor: "grey.200",
            borderRadius: 3,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.5,
              },
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default OrderPageLoadingSkeleton;
