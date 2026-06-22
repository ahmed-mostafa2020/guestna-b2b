"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";
import SchoolIcon from "@mui/icons-material/School";
import WcIcon from "@mui/icons-material/Wc";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";

const EventDetailsTracks = ({ organizations, tracks }) => {
  const t = useTranslations("profile.events.details");
  const tCommon = useTranslations("common");

  const hasOrgsWithTracks =
    organizations &&
    organizations.some((org) => org.tracks && org.tracks.length > 0);
  const hasLegacyTracks = tracks && tracks.length > 0;

  if (!hasOrgsWithTracks && !hasLegacyTracks) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-center text-gray-500 font-ibm">
        {t("noTracks")}
      </div>
    );
  }

  const getGenderBadge = (gender) => {
    const uppercaseGender = gender?.toUpperCase() || "BOTH";
    const label = tCommon(uppercaseGender) || uppercaseGender;

    const colorMap = {
      MALE: "bg-blue-50 text-blue-700 border-blue-200/60",
      FEMALE: "bg-rose-50 text-rose-700 border-rose-200/60",
      BOTH: "bg-purple-50 text-purple-700 border-purple-200/60",
    };

    const colorClass =
      colorMap[uppercaseGender] ||
      "bg-gray-50 text-gray-700 border-gray-200/60";

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colorClass} font-somar`}
      >
        <WcIcon className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const renderTrackCard = (track, idx) => (
    <div
      key={track._id || idx}
      className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 p-5 shadow-sm transition-all hover:shadow flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <span className="text-sm font-extrabold text-titleColor font-ibm">
          {t("trackNumber", { number: idx + 1 })}
        </span>
      </div>

      {/* Properties */}
      <div className="flex flex-col gap-3">
        {/* Gender and Education System Badge Row */}
        <div className="flex flex-wrap items-center gap-2">
          {getGenderBadge(track.gender)}

          {track.educationSystem?.name && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 font-somar">
              <SchoolIcon className="w-3.5 h-3.5" />
              {track.educationSystem.name}
            </span>
          )}
        </div>

        {/* Academic Stages */}
        {track.academicStages && track.academicStages.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-somar">
              <EscalatorWarningIcon className="w-3.5 h-3.5 text-gray-400" />
              <span>{t("academicStages")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {track.academicStages.map((stage) => (
                <span
                  key={stage._id}
                  className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100 text-xs font-semibold font-somar"
                >
                  {stage.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grades */}
        {track.grades && track.grades.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-somar">
              <MenuBookIcon className="w-3.5 h-3.5 text-gray-400" />
              <span>{t("grades")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto custom-scrollbar pr-1 font-ibm">
              {track.grades.map((grade) => (
                <span
                  key={grade._id}
                  className="px-2 py-0.5 rounded bg-gray-50 text-gray-700 text-xs font-medium"
                >
                  {grade.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-950 font-somar border-s-4 border-mainColor ps-3">
        {t("targetAudience")}
      </h3>

      {hasOrgsWithTracks ? (
        <div className="flex flex-col gap-8">
          {organizations.map((org, orgIdx) => {
            if (!org.tracks || org.tracks.length === 0) return null;
            return (
              <div key={org._id || orgIdx} className="flex flex-col gap-4">
                {/* Organization Subheader */}
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div className="p-1.5 rounded-lg bg-mainColor/10 text-mainColor">
                    <SchoolIcon className="w-5 h-5" />
                  </div>
                  <span className="text-base font-bold text-gray-900 font-somar">
                    {org.name}
                  </span>
                </div>

                {/* Tracks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {org.tracks.map((track, idx) => renderTrackCard(track, idx))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track, idx) => renderTrackCard(track, idx))}
        </div>
      )}
    </div>
  );
};

export default memo(EventDetailsTracks);
