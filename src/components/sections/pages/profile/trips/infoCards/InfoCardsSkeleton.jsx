"use client";

/**
 * Skeleton loader for InfoCards
 * Shows animated placeholder cards while data is loading
 * Matches exact dimensions of actual InfoCard component
 */
const InfoCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="flex gap-2 p-4 bg-white border rounded-xl border-border animate-pulse"
        >
          {/* Icon skeleton - matches actual icon size */}
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
          
          {/* Content skeleton */}
          <div className="flex flex-col items-start gap-3 flex-1">
            {/* Title skeleton - matches font-medium text */}
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            
            {/* Value skeleton - matches text-xl font-semibold */}
            <div className="h-7 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoCardsSkeleton;
