"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ContactPhoneOutlined } from "@mui/icons-material";
import { CONSTANT_VALUES } from "@constants/constantValues";

const ProviderOrderGroupCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const listSeparator = isAr ? "، " : ", ";

  const user = orderData?.user || {};

  const companyName = t("providerProfile.orderDetails.groupInfo.companyName");

  const stageName =
    orderData?.academicStages?.map((s) => s.name).join(listSeparator) ||
    orderData?.track?.educationSystem?.name ||
    orderData?.stage ||
    orderData?.stageName ||
    "-";

  const officialPhone = CONSTANT_VALUES.GUESTNA_PHONE;
  const officialPhoneRaw = CONSTANT_VALUES.GUESTNA_PHONE_RAW;

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col gap-4 font-somar">
      {/* 1. Header with Title & Icon */}
      <div className="flex items-center gap-2">
        <ContactPhoneOutlined className="!w-5 !h-5 sm:!w-6 sm:!h-6 text-mainColor shrink-0" />
        <h2 className="text-base sm:text-lg font-bold text-textDark">
          {t("providerProfile.orderDetails.groupInfo.title")}
        </h2>
      </div>

      {/* 2. Company / App Info Card with Soft Background */}
      <div className="bg-sidePageBg rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 border border-border/40">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-mainColor/10 border border-border/60 flex items-center justify-center text-mainColor shrink-0 p-2">
          <Image
            src="/icons/icon-192x192.png"
            alt={companyName}
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="font-bold text-textDark text-sm sm:text-base leading-snug truncate"
            title={companyName}
          >
            {companyName}
          </span>
        </div>
      </div>

      {/* 3. Key-Value Details */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm pt-1">
        {/* Educational Institution - currently hidden per business requirements */}

        {/* Study Stage */}
        {/* <div className="flex items-center justify-between gap-3">
          <span className="text-textLight font-normal shrink-0">
            {t("providerProfile.orderDetails.groupInfo.studyStage")}
          </span>
          <span
            className="font-bold text-textDark text-left rtl:text-left truncate max-w-[60%]"
            title={stageName}
          >
            {stageName}
          </span>
        </div> */}

        {/* Contact Phone (Guestna Official Contact) */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-textLight font-normal shrink-0">
            {t("providerProfile.orderDetails.groupInfo.contactNumber")}
          </span>
          <a
            href={`tel:${officialPhoneRaw}`}
            dir="ltr"
            className="font-bold text-textDark hover:text-mainColor transition-colors flex items-center gap-1"
          >
            <span>{officialPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderGroupCard);
