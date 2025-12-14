"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";

const AcademicStagesListing = ({ stages = [] }) => {
  const t = useTranslations();

  const parsedStages = useMemo(() => {
    if (!Array.isArray(stages)) return [];

    return stages
      .map((stage, index) => ({
        id:
          stage?.academicStage?._id || `${stage?.academicStage?.name}-${index}`,
        name:
          stage?.academicStage?.name ||
          t("profile.schoolTeamStudents.unknownStage"),
        count: stage?.count || 0,
      }))
      .filter((stage) => stage.count > 0);
  }, [stages, t]);

  if (!parsedStages.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-gray-50 px-4 py-6 text-center text-sm text-textLight">
        {t("profile.schoolTeamStudents.emptyStages")}
      </div>
    );
  }

  return (
    <div className="space-y-3 border border-border p-4 rounded-xl">
      {parsedStages.map((stage) => (
        <div
          key={stage.id}
          className="flex items-center justify-between rounded-xl border border-border p-3"
        >
          <span className="font-medium text-textLight">{stage.name}</span>
          <span className="flex items-center justify-center rounded-lg h-11 w-11 p-3 bg-[#DAE6E6] text-lg font-medium text-black font-ibm shadow-card">
            {stage.count}
          </span>
        </div>
      ))}
    </div>
  );
};

export default memo(AcademicStagesListing);
