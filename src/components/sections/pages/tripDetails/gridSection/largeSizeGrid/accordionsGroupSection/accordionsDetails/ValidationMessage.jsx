"use client";

import { useTranslations } from "next-intl";

import LockPersonIcon from "@mui/icons-material/LockPerson";

const ValidationMessage = () => {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-1">
      <LockPersonIcon />

      <p className="text-lg font-medium lg:text-xl">
        {t("tripDetails.validationMessage")}
      </p>
    </div>
  );
};

export default ValidationMessage;
