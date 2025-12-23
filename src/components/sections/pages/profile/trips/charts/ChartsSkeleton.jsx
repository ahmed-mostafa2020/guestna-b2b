"use client";

/**
 * Skeleton loader for Charts (Revenue Line Chart and Donut Chart)
 * Shows animated placeholder charts while data is loading
 * Matches exact dimensions of actual chart components
 */
const ChartsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Revenue Line Chart Skeleton - Full width */}
      <div className="w-full">
        <div className="p-4 bg-white border rounded-xl border-border animate-pulse">
          {/* Chart title skeleton */}
          <div className="h-6 lg:h-7 bg-gray-200 rounded w-1/4 mb-4"></div>

          {/* Chart area skeleton */}
          <div className="h-[300px] bg-gray-100 rounded-lg flex items-end justify-around gap-1 p-4">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-t w-full"
                style={{
                  height: `${Math.random() * 60 + 40}%`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Donut Chart & Most Active Organizations Skeletons */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Most Active Organizations Skeleton */}
        <div className="p-4 bg-white border rounded-xl border-border h-fit animate-pulse">
          {/* Chart title skeleton */}
          <div className="h-6 lg:h-7 bg-gray-200 rounded w-1/2 mb-4"></div>

          {/* Bar chart skeleton */}
          <div className="h-[320px] flex items-end justify-around gap-4 p-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-full flex flex-col gap-2 items-center"
              >
                <div
                  className="w-full bg-gray-200 rounded-t"
                  style={{ height: `${Math.random() * 60 + 40}%` }}
                ></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart Skeleton */}
        <div className="p-4 bg-white border rounded-xl border-border h-fit animate-pulse">
          {/* Chart title skeleton */}
          <div className="h-6 lg:h-7 bg-gray-200 rounded w-1/2 mb-4"></div>

          {/* Donut chart skeleton */}
          <div className="w-full h-[320px] flex justify-center items-center">
            <div className="relative w-48 h-48">
              {/* Outer circle */}
              <div className="absolute inset-0 border-[24px] border-gray-200 rounded-full"></div>
              {/* Animated segment */}
              <div
                className="absolute inset-0 border-[24px] border-transparent border-t-gray-300 rounded-full animate-spin"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSkeleton;
