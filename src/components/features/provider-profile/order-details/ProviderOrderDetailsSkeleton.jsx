"use client";

import { memo } from "react";

const ProviderOrderDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse" aria-busy="true" aria-label="Loading order details">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-4">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
          <div className="h-4 w-4 bg-gray-200 rounded-md" />
          <div className="h-4 w-20 bg-gray-200 rounded-md" />
          <div className="h-4 w-4 bg-gray-200 rounded-md" />
          <div className="h-4 w-24 bg-gray-200 rounded-md" />
        </div>

        {/* Title & Button skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-44 bg-gray-200 rounded-xl" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* 2. Stats Grid Skeleton (4 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center gap-2 h-24"
          >
            <div className="h-4 w-20 bg-gray-200 rounded-md" />
            <div className="h-6 w-16 bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Main Content Skeleton (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
        {/* Side Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Group Card Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="h-5 w-28 bg-gray-200 rounded-md" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="h-4 w-full bg-gray-200 rounded-md" />
              <div className="h-4 w-full bg-gray-200 rounded-md" />
              <div className="h-4 w-full bg-gray-200 rounded-md" />
            </div>
          </div>

          {/* Financial Card Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="h-5 w-28 bg-gray-200 rounded-md" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-md" />
            <div className="h-4 w-full bg-gray-200 rounded-md" />
            <div className="h-4 w-full bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Main Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Status Card Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-4 h-44">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-6 w-48 bg-gray-200 rounded-md" />
                <div className="h-4 w-72 bg-gray-200 rounded-md" />
              </div>
              <div className="w-14 h-14 rounded-full bg-gray-200" />
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-md mt-auto" />
          </div>

          {/* Schedule Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="h-5 w-36 bg-gray-200 rounded-md" />
            <div className="h-12 w-full bg-gray-200 rounded-md" />
            <div className="h-12 w-full bg-gray-200 rounded-md" />
          </div>

          {/* Services Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="h-5 w-44 bg-gray-200 rounded-md" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="h-9 w-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderDetailsSkeleton);
