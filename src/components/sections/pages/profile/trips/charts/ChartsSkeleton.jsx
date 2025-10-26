"use client";

/**
 * Skeleton loader for Charts (Revenue Line Chart and Donut Chart)
 * Shows animated placeholder charts while data is loading
 * Matches exact dimensions of actual chart components
 */
const ChartsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Revenue Line Chart Skeleton - matches lg:col-span-9 */}
      <div className="lg:col-span-8">
        <div className="p-4 bg-white border rounded-xl border-border animate-pulse">
          {/* Chart title skeleton - matches text-lg lg:text-xl */}
          <div className="h-6 lg:h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
          
          {/* Chart area skeleton - matches height={300} */}
          <div className="h-[300px] bg-gray-100 rounded-lg flex items-end justify-around gap-1 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
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

      {/* Donut Chart Skeleton - matches lg:col-span-3 */}
      <div className="lg:col-span-4">
        <div className="p-4 bg-white border rounded-xl border-border h-fit animate-pulse">
          {/* Chart title skeleton - matches text-lg lg:text-xl */}
          <div className="h-6 lg:h-7 bg-gray-200 rounded w-2/3 mb-4"></div>
          
          {/* Donut chart skeleton - matches h-[200px] */}
          <div className="w-full h-[200px] flex justify-center items-center">
            <div className="relative w-32 h-32">
              {/* Outer circle */}
              <div className="absolute inset-0 border-[16px] border-gray-200 rounded-full"></div>
              {/* Animated segment */}
              <div className="absolute inset-0 border-[16px] border-transparent border-t-gray-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSkeleton;
