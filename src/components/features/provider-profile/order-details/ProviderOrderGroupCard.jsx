"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SchoolOutlined, PersonOutline } from "@mui/icons-material";

const ProviderOrderGroupCard = ({ orderData }) => {
  const t = useTranslations();

  const user = orderData?.user || {};
  const organization = orderData?.organization || {};

  const orgName =
    typeof orderData?.organization === "string"
      ? orderData.organization
      : organization.name || "-";

  const orgPhone =
    typeof orderData?.organization === "object" && organization.phone
      ? organization.phone
      : user.phone || "-";

  const userName =
    user.name ||
    (typeof orderData?.organization === "string"
      ? orderData.organization
      : organization.name) ||
    "-";

  const userRole =
    user.role?.description ||
    (typeof user.role === "string" ? user.role : "") ||
    t("providerProfile.orderDetails.groupInfo.coordinator");

  const stageName =
    orderData?.track?.educationSystem?.name ||
    orderData?.stage ||
    (typeof user.role?.description === "string" ? user.role.description : "") ||
    "-";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5 font-somar">
      {/* 1. Header with Title & Icon */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-4">
        <div className="w-8 h-8 rounded-lg bg-mainColor/10 text-mainColor flex items-center justify-center">
          <SchoolOutlined className="!w-5 !h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-textDark flex items-center gap-2 font-somar">
          <span>{t("providerProfile.orderDetails.groupInfo.title")}</span>
        </h2>
      </div>

      {/* 2. User / Coordinator Info */}
      <div className="flex items-center gap-3.5">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-mainColor/10 border border-border flex items-center justify-center text-mainColor font-bold text-lg shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={userName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <PersonOutline className="!w-6 !h-6" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="font-bold text-textDark text-sm sm:text-base truncate font-somar"
            title={userName}
          >
            {userName}
          </span>
          <span
            className="text-xs sm:text-sm text-textLight font-normal truncate"
            title={userRole}
          >
            {userRole}
          </span>
        </div>
      </div>

      {/* 3. Key-Value Details */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm pt-1">
        {/* Educational Institution */}
        <div className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50">
          <span className="text-textLight font-normal">
            {t("providerProfile.orderDetails.groupInfo.educationalInstitution")}
          </span>
          <span
            className="font-bold text-textDark text-end truncate max-w-[60%] font-somar"
            title={orgName}
          >
            {orgName}
          </span>
        </div>

        {/* Study Stage */}
        <div className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50">
          <span className="text-textLight font-normal">
            {t("providerProfile.orderDetails.groupInfo.studyStage")}
          </span>
          <span
            className="font-bold text-textDark text-end truncate max-w-[60%] font-somar"
            title={stageName}
          >
            {stageName}
          </span>
        </div>

        {/* Contact Phone */}
        <div className="flex items-center justify-between gap-2 py-1.5">
          <span className="text-textLight font-normal">
            {t("providerProfile.orderDetails.groupInfo.contactNumber")}
          </span>
          {orgPhone !== "-" ? (
            <a
              href={`tel:${orgPhone}`}
              dir="ltr"
              className="font-bold text-textDark hover:text-mainColor transition-colors flex items-center gap-1 font-somar"
            >
              <span>{orgPhone}</span>
            </a>
          ) : (
            <span className="font-bold text-textDark font-somar">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderGroupCard);
