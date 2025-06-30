"use client";

import { useTranslations } from "next-intl";

import { lockIcon } from "@assets/svg";

const ValidationMessage = () => {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-1">
      {lockIcon}

      <p className="text-lg font-medium lg:text-xl">
        {t("tripDetails.validationMessage")}
      </p>
    </div>
  );
};

export default ValidationMessage;
