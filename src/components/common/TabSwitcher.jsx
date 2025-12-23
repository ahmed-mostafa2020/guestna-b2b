"use client";

import { memo } from "react";

/**
 * Reusable Tab Switcher Component
 * @param {Array} tabs - Array of tab objects with { key, label }
 * @param {string} activeTab - Currently active tab key
 * @param {function} onTabChange - Callback when tab is clicked
 */
const TabSwitcher = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="relative mb-5">
      {/* Background gradient pattern */}
      <div
        className="absolute inset-0 opacity-30 rounded-lg"
        style={{
          background:
            "linear-gradient(to right, var(--color-buttons-hover), var(--color-buttons-hover), var(--color-buttons-hover))",
        }}
      ></div>

      {/* Tab buttons container */}
      <div
        className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 py-5 px-7 rounded-xl"
        style={{ backgroundColor: "var(--color-buttons-hover)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              relative rounded-lg transition-all duration-300
              flex flex-col items-center justify-center
              ${activeTab === tab.key ? "bg-white scale-105" : ""}
            `}
          >
            <span
              className={`lg:px-28 px-4 font-medium py-2 text-center leading-tight ${
                activeTab === tab.key ? "text-black" : "text-white"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(TabSwitcher);
