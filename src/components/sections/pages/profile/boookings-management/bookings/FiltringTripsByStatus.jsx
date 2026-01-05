"use client";

import { useTranslations } from "next-intl";

import React, { memo, useState } from "react";

import { TRIP_STATUS } from "@constants/tripStatus";

const FiltringTripsByStatus = ({ onStatusChange, activeStatus = "ALL" }) => {
  const t = useTranslations();
  const [selectedStatus, setSelectedStatus] = useState(activeStatus);

  const statusTabs = [
    {
      key: TRIP_STATUS.ALL,
      label: t("profile.filters.status.all"),
      color: "bg-blue-500",
    },
    {
      key: TRIP_STATUS.PENDING,
      label: t("profile.filters.status.pending"),
      color: "bg-orange-500",
    },

    {
      key: TRIP_STATUS.DONE,
      label: t("profile.filters.status.done"),
      color: "bg-green-500",
    },
    {
      key: TRIP_STATUS.SCHEDULED,
      label: t("profile.filters.status.scheduled"),
      color: "bg-yellow-500",
    },
  ];

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onStatusChange?.(status === "ALL" ? null : status);
  };

  return (
    <div>
      {/* Status tabs with striped design */}
      <div className="relative">
        {/* Background striped pattern */}
        <div
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            background:
              "linear-gradient(to right, var(--color-buttons-hover), var(--color-buttons-hover), var(--color-buttons-hover))",
          }}
        ></div>

        <div
          className="relative flex flex-wrap gap-1 py-4 px-6 rounded-xl"
          style={{ backgroundColor: "var(--color-buttons-hover)" }}
        >
          {statusTabs.map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => handleStatusChange(tab.key)}
              className={`
                relative flex-1 min-w-[140px] px-4  rounded-lg transition-all duration-300
                flex flex-col items-center justify-center
                ${selectedStatus === tab.key ? "bg-white  scale-105" : ""}
              `}
            >
              {/* Status label */}
              <span className="font-medium py-3 text-center leading-tight text-black">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(FiltringTripsByStatus);
