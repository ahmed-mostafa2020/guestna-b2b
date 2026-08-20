"use client";

import { memo } from "react";

const ProviderOrderDetailsSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-5 sm:gap-6 w-full font-somar animate-pulse"
      aria-busy="true"
      aria-label="Loading order details"
    >
      {/* 1. Header Skeleton (Matching ProviderOrderDetailsHeader) */}
      <header className="bg-white rounded-2xl border border-gray-100 p-5 sm:px-8 sm:py-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Right in RTL: Breadcrumbs + Title + Status Badge */}
          <div className="flex flex-col items-start gap-2">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-14 bg-gray-200 rounded-md" />
              <div className="h-3.5 w-3 bg-gray-200 rounded-md" />
              <div className="h-3.5 w-16 bg-gray-200 rounded-md" />
              <div className="h-3.5 w-3 bg-gray-200 rounded-md" />
              <div className="h-3.5 w-20 bg-gray-200 rounded-md" />
            </div>

            {/* Title & Status Badge skeleton */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="h-7 sm:h-8 w-48 sm:w-56 bg-gray-200 rounded-xl" />
              <div className="h-6 w-28 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className="h-11 w-32 bg-gray-200 rounded-xl shrink-0" />
        </div>
      </header>

      {/* 2. Stats Grid Skeleton (2 cards matching ProviderOrderStatsCards) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 sm:py-6 sm:px-6 flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="h-3.5 w-20 bg-gray-200 rounded-md mb-2.5" />
            <div className="h-6 sm:h-7 w-24 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 3. Main Content Skeleton (2 Columns: Main 8-cols First, Side 4-cols Second) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Main Column (8 cols) -> Right Side in RTL */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          {/* Status Card Skeleton (Matching ProviderOrderPendingStatusCard) */}
          <div className="bg-white rounded-2xl border border-gray-100 border-s-4 border-s-gray-300 p-5 sm:p-7 shadow-xs flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-6 w-44 bg-gray-200 rounded-lg" />
                <div className="h-4 w-72 max-w-full bg-gray-200 rounded-md mt-0.5" />
              </div>
              <div className="flex flex-col items-center gap-1.5 self-center sm:self-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 shrink-0" />
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
                <div className="h-5 w-24 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5 sm:my-6" />

            {/* 4 Metadata Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((col) => (
                <div key={col} className="flex flex-col gap-1.5">
                  <div className="h-3 w-16 bg-gray-200 rounded-md mb-0.5" />
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Skeleton (Matching ProviderOrderScheduleCard) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
            <div className="h-5 w-36 bg-gray-200 rounded-md pb-1" />
            <div className="flex flex-col gap-6 ps-2">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-1.5 pt-0.5 flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded-md" />
                  <div className="h-3 w-56 max-w-full bg-gray-200 rounded-md" />
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-1.5 pt-0.5 flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded-md" />
                  <div className="h-3 w-56 max-w-full bg-gray-200 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Services Skeleton (Matching ProviderOrderServicesCard) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-4 sm:gap-5">
            <div className="h-5 w-44 bg-gray-200 rounded-md pb-1" />
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="h-10 w-28 sm:w-32 bg-gray-200 rounded-xl"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Side Column (4 cols) -> Left Side in RTL */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          {/* Group Card Skeleton (Matching ProviderOrderGroupCard) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-md" />
              <div className="h-5 w-32 bg-gray-200 rounded-md" />
            </div>

            {/* Coordinator User Box */}
            <div className="bg-[#F8FAFC] rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* 3 Detail Rows */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3.5 w-24 bg-gray-200 rounded-md" />
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="h-3.5 w-24 bg-gray-200 rounded-md" />
                <div className="h-4 w-28 bg-gray-200 rounded-md" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="h-3.5 w-24 bg-gray-200 rounded-md" />
                <div className="h-4 w-28 bg-gray-200 rounded-md" />
              </div>
            </div>
          </div>

          {/* Financial Card Skeleton (Matching ProviderOrderFinancialCard) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200" />
              <div className="h-5 w-28 bg-gray-200 rounded-md" />
            </div>

            {/* Total Amount Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="h-3.5 w-20 bg-gray-200 rounded-md" />
              <div className="h-7 w-28 bg-gray-200 rounded-lg" />
            </div>

            {/* Payment Status Row */}
            <div className="border-t border-gray-50 pt-2 flex items-center justify-between">
              <div className="h-3.5 w-16 bg-gray-200 rounded-md" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
            </div>
          </div>
        </aside>
      </main>

      {/* 4. Bottom Action Bar Skeleton */}
      <section className="sticky bottom-0 z-20 -mx-4 lg:-mx-7 -mb-4 lg:-mb-7 px-4 lg:px-7 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
          <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-1">
            <div className="h-3 w-20 bg-gray-200 rounded-md" />
            <div className="h-4 w-28 bg-gray-200 rounded-md" />
          </div>
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="h-10 sm:h-11 w-full sm:w-28 bg-gray-200 rounded-xl" />
            <div className="h-10 sm:h-11 w-full sm:w-24 bg-gray-200 rounded-xl" />
            <div className="h-10 sm:h-11 w-full sm:w-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(ProviderOrderDetailsSkeleton);
