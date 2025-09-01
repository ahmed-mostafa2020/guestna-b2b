"use client";

import { useTranslations } from "next-intl";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const t = useTranslations();
  return (
    <div className="flex justify-between items-center gap-1 mb-8 bg-gradient-to-r from-green-400 to-emerald-500 p-1 rounded-xl overflow-hidden">
      <button
        onClick={() => setActiveTab("calendar")}
        className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          activeTab === "calendar"
            ? "bg-white text-green-700 shadow-lg transform scale-105"
            : "text-white hover:text-green-100 hover:bg-white/10"
        }`}
      >
        {t("profile.calendar.tabs.calendar")}
      </button>
      <button
        onClick={() => setActiveTab("events")}
        className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
          activeTab === "events"
            ? "bg-white text-green-700 shadow-lg transform scale-105"
            : "text-white hover:text-green-100 hover:bg-white/10"
        }`}
      >
        {t("profile.calendar.tabs.events")}
      </button>
    </div>
  );
};

export default TabNavigation;
