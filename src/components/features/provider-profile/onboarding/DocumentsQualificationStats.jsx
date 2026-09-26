"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import Skeleton from "@mui/material/Skeleton";

const DocumentsQualificationStats = ({ status, loading = false }) => {
  const t = useTranslations("providerProfile.onboarding.qualification");
  const progress = status?.qualificationProgress;

  const cards = [
    {
      id: "total",
      label: t("totalDocuments"),
      value: progress?.totalCount ?? 0,
      accent: false,
    },
    {
      id: "approved",
      label: t("completed"),
      value: progress?.approvedCount ?? 0,
      accent: false,
    },
    {
      id: "submitted",
      label: t("underReview"),
      value: progress?.submittedCount ?? 0,
      accent: false,
    },
    {
      id: "rejected",
      label: t("actionRequired"),
      value: progress?.rejectedCount ?? 0,
      accent: true,
    },
  ];

  return (
    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-border shadow-card">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-textDark font-somar">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-textLight font-somar">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-border rounded-xl p-4 flex flex-col gap-2 items-start min-h-[88px] transition-all hover:border-mainColor/30"
            >
              <span
                className={`text-sm sm:text-base font-semibold font-somar opacity-70 ${
                  card.accent ? "text-error" : "text-textLight"
                }`}
              >
                {card.label}
              </span>
              {loading ? (
                <Skeleton variant="text" width={40} height={32} />
              ) : (
                <span
                  className={`text-[28px] leading-8 font-semibold font-somar ${
                    card.accent ? "text-error" : "text-textDark"
                  }`}
                >
                  {card.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(DocumentsQualificationStats);
