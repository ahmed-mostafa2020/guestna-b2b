"use client";

import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  LocalActivityOutlined,
  PictureAsPdfOutlined,
  OpenInNew,
  DownloadOutlined,
} from "@mui/icons-material";

const ProviderOrderServicesCard = ({ orderData }) => {
  const t = useTranslations();
  const services = orderData?.services || [];
  const detailsFile = orderData?.detailsFile;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5 font-somar">
      {/* 1. Header */}
      <div className="border-b border-border/50 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-textDark font-somar">
          {t("providerProfile.orderDetails.services.title")}
        </h2>
      </div>

      {/* 2. Services Chips */}
      {services.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {services.map((item, index) => {
            const serviceObj = item.service || item;
            const name = serviceObj.name || "-";
            const iconUrl = serviceObj.icon;

            return (
              <div
                key={item._id || index}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-100 bg-[#F4F9F9] hover:border-mainColor/40 text-textDark text-xs sm:text-sm font-semibold transition-all shadow-2xs font-somar"
              >
                {iconUrl ? (
                  <div className="relative w-5 h-5 shrink-0">
                    <img
                      src={iconUrl}
                      alt={name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <LocalActivityOutlined className="!w-4 !h-4 text-mainColor shrink-0" />
                )}
                <span>{name}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-textLight py-2 font-normal">
          {t("providerProfile.orderDetails.services.noServices")}
        </p>
      )}

      {/* 3. Attachment File (PDF) if present */}
      {detailsFile && (
        <div className="mt-1 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <PictureAsPdfOutlined className="!w-5 !h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-textDark truncate font-somar">
                {t("providerProfile.orderDetails.services.attachment")}
              </span>
              <span className="text-[11px] text-textLight truncate">
                PDF Document
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={detailsFile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border text-textDark hover:text-mainColor hover:border-mainColor text-xs font-semibold shadow-2xs transition-all font-somar"
            >
              <OpenInNew className="!w-3.5 !h-3.5" />
              <span>{t("providerProfile.orderDetails.services.viewPdf")}</span>
            </a>
            <a
              href={detailsFile}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mainColor text-white hover:bg-mainColor/90 text-xs font-semibold shadow-2xs transition-all font-somar"
            >
              <DownloadOutlined className="!w-3.5 !h-3.5" />
              <span>{t("providerProfile.orderDetails.services.download")}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProviderOrderServicesCard);
