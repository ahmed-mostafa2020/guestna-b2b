"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import GradesListing from "./GradesListing";

const StudentsInfo = ({ totalStudents = 0, grades = [], organizationId }) => {
  const t = useTranslations();



  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border border-border p-4 rounded-xl shadow-profile">
      {/* Left side - Stage distribution */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="pb-4 lg:text-xl text-base font-medium text-mainColor">
          {t("profile.schoolTeamStudents.stagesTitle")}
        </p>
        <GradesListing grades={grades} organizationId={organizationId} />
      </div>

      {/* Right side - Students statistics */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="pb-4 lg:text-xl text-base font-medium text-mainColor">
          {t("profile.schoolTeamStudents.statsTitle")}
        </p>
        <div className="space-y-3 border border-border p-4 rounded-xl">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="font-medium text-textLight">
              {t("profile.schoolTeamStudents.totalStudents")}
            </span>
            <span className="flex items-center justify-center rounded-lg h-11 w-11 p-3 bg-[#DAE6E6] text-lg font-medium text-black font-ibm shadow-card">
              {totalStudents}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(StudentsInfo);
