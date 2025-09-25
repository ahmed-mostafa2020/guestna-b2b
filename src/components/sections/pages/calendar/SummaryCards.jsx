"use client";

import { useTranslations } from "next-intl";

const SummaryCards = ({ countsData, isLoading }) => {
  const t = useTranslations();

  const summaryData = [
    {
      title: t("profile.calendar.summary.potentialEvents"),
      count: countsData?.potentialConflicts || "0",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: t("profile.calendar.summary.academicEvents"),
      count: countsData?.academicCount || "0",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: t("profile.calendar.summary.scheduledTrips"),
      count: countsData?.scheduledTripCount || "0",
      color: "bg-green-100 text-green-600",
    },
    {
      title: t("profile.calendar.summary.totalEvents"),
      count: countsData?.totalCount || "0",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex text-center items-center justify-center">
            <div>
              <p className="text-gray-500 pb-3 font-medium">{item.title}</p>
              {isLoading ? (
                <div className="mx-auto animate-pulse h-7 bg-gray-200 rounded w-24"></div>
              ) : (
                <p className="text-2xl font-semibold">{item.count}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
