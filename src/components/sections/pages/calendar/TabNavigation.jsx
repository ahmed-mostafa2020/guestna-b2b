"use client";

import { useTranslations } from "next-intl";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const t = useTranslations();
  return (
    <div className="relative mb-8">
      {/* Background striped pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-lg opacity-30"></div>

      <div className="relative flex flex-wrap gap-1 py-4 px-6 bg-[#E3F0F0] rounded-xl">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`relative flex-1 min-w-[140px] px-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center ${
            activeTab === "calendar" ? "bg-white scale-105" : ""
          }`}
        >
          <span className="font-semibold py-3 text-center leading-tight">
            {t("profile.calendar.tabs.calendar")}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`relative flex-1 min-w-[140px] px-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center ${
            activeTab === "events" ? "bg-white scale-105" : ""
          }`}
        >
          <span className="font-semibold py-3 text-center leading-tight">
            {t("profile.calendar.tabs.events")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
