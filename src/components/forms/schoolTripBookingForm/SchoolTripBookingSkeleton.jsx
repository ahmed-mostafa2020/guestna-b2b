"use client";

import { useTranslations } from "next-intl";

const SchoolTripBookingSkeleton = () => {
  const t = useTranslations();

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={t("schoolTripBooking.loading")}
      className="bg-white px-4 sm:px-8 py-10 md:py-12 rounded-xl shadow-md animate-pulse"
    >
      <span className="sr-only">{t("schoolTripBooking.loading")}</span>

      {/* Form title skeleton */}
      <div className="flex justify-center mb-8">
        <div className="h-8 md:h-9 w-64 md:w-80 bg-gray-200 rounded-lg" />
      </div>

      {/* Stepper skeleton */}
      <div className="py-4 md:py-6 max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {[1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-200 border-2 border-gray-100 flex items-center justify-center" />
                <div className="h-3 w-16 sm:w-20 bg-gray-200 rounded" />
              </div>
              {idx < 2 && (
                <div className="flex-1 h-1 bg-gray-200 mx-2 sm:mx-4 -mt-5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inputs grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 mt-6">
        {/* Field 1: Trip date */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-lg" />
        </div>

        {/* Field 2: Educational Track */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-lg" />
        </div>

        {/* Field 3: Educational Stage */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-lg" />
        </div>

        {/* Field 4: Grade */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-lg" />
        </div>

        {/* Field 5: Students count */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-lg" />
        </div>

        {/* Field 6: School profit */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
        <div className="h-11 w-24 sm:w-28 bg-gray-200 rounded-lg" />
        <div className="h-11 w-28 sm:w-36 bg-gray-200 rounded-lg" />
      </div>
    </section>
  );
};

export default SchoolTripBookingSkeleton;
