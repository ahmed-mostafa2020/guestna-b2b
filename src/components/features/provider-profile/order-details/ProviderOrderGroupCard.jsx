"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { SchoolOutlined, PersonOutline } from "@mui/icons-material";

const ProviderOrderGroupCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const listSeparator = isAr ? "، " : ", ";

  const user = orderData?.user || {};
  const organization = orderData?.organization || {};

  const orgName =
    (typeof orderData?.organization === "string"
      ? orderData.organization
      : organization.name) ||
    orderData?.school?.name ||
    "-";

  const orgPhone =
    (typeof orderData?.organization === "object" && organization.phone) ||
    user.phone ||
    orderData?.phone ||
    "-";

  const userName =
    user.name ||
    (typeof orderData?.organization === "string"
      ? orderData.organization
      : organization.name) ||
    "-";

  const userRole =
    user.role?.description ||
    (typeof user.role === "string" ? user.role : "") ||
    (orgName !== "-"
      ? `${t("providerProfile.orderDetails.groupInfo.coordinator")} ${orgName}`
      : t("providerProfile.orderDetails.groupInfo.coordinator"));

  const stageName =
    orderData?.academicStages?.map((s) => s.name).join(listSeparator) ||
    orderData?.track?.educationSystem?.name ||
    orderData?.stage ||
    orderData?.stageName ||
    "-";

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col gap-4 font-somar">
      {/* 1. Header with Title & Icon */}
      <div className="flex items-center gap-2">
        <SchoolOutlined className="!w-5 !h-5 sm:!w-6 sm:!h-6 text-mainColor shrink-0" />
        <h2 className="text-base sm:text-lg font-bold text-textDark">
          {t("providerProfile.orderDetails.groupInfo.title")}
        </h2>
      </div>

      {/* 2. User / Coordinator Info Card with Soft Background */}
      <div className="bg-sidePageBg rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 border border-border/40">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-mainColor/10 border border-border/60 flex items-center justify-center text-mainColor font-bold text-base shrink-0">

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
            className="font-bold text-textDark text-sm sm:text-base leading-snug truncate"
            title={userName}
          >
            {userName}
          </span>
          <span
            className="text-xs sm:text-sm text-textLight font-normal truncate mt-0.5"
            title={userRole}
          >
            {userRole}
          </span>
        </div>
      </div>

      {/* 3. Key-Value Details */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm pt-1">
        {/* Educational Institution */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-textLight font-normal shrink-0">
            {t("providerProfile.orderDetails.groupInfo.educationalInstitution")}
          </span>
          <span
            className="font-bold text-textDark text-left rtl:text-left truncate max-w-[60%]"
            title={orgName}
          >
            {orgName}
          </span>
        </div>

        {/* Study Stage */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-textLight font-normal shrink-0">
            {t("providerProfile.orderDetails.groupInfo.studyStage")}
          </span>
          <span
            className="font-bold text-textDark text-left rtl:text-left truncate max-w-[60%]"
            title={stageName}
          >
            {stageName}
          </span>
        </div>

        {/* Contact Phone */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-textLight font-normal shrink-0">
            {t("providerProfile.orderDetails.groupInfo.contactNumber")}
          </span>
          {orgPhone !== "-" ? (
            <a
              href={`tel:${orgPhone}`}
              dir="ltr"
              className="font-bold text-textDark hover:text-mainColor transition-colors flex items-center gap-1"
            >
              <span>{orgPhone}</span>
            </a>
          ) : (
            <span className="font-bold text-textDark">-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderGroupCard);

