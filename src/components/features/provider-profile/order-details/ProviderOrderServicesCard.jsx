"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { LocalActivityOutlined } from "@mui/icons-material";

const ProviderOrderServicesCard = ({ orderData }) => {
  const t = useTranslations();
  const services = orderData?.services || [];

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col gap-5 font-somar">
      {/* 1. Header */}
      <div className="pb-3">
        <h2 className="text-base sm:text-lg font-bold text-textDark">
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
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/80 bg-mainColor/5 hover:border-mainColor/40 text-textDark text-xs sm:text-sm font-semibold transition-all shadow-2xs"
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
    </div>
  );

};

export default memo(ProviderOrderServicesCard);

